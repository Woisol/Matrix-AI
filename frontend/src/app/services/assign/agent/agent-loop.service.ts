import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

import {
  MatrixAgentConversation,
  MatrixAgentEvent,
  MatrixAgentEventToolCall,
  MatrixAgentEventToolResult,
  MatrixAgentEventTurnEnd,
  MatrixAgentEventUserMessage,
} from "../../../api/type/agent";
import { escapeXml } from "../../../api/util/format";
import { AgentService } from "./agent.service";
import { SYSTEM_PROMPT } from "./agent.constant";
import { parseAgentLoopPass } from "./agent-loop-pass-parser";
import { AgentLoopPersistCursor } from "./agent-loop-persist-cursor";
import { AgentLoopRunConfig, AgentLoopMessage, ToolExecutionResult } from "../../../api/type/agent-loop";
import { projectAgentLoopPassTail } from "./agent-loop-tail-projector";
import { AgentLoopToolName, AgentLoopToolProvider } from "./agent-loop-tool-provider.service";

export type { AgentLoopRunConfig, AgentLoopMessage } from "../../../api/type/agent-loop";
export type { AgentLoopToolName } from "./agent-loop-tool-provider.service";

type PassState = {
  rawText: string;
  localStartIndex: number;
  toolCallIds: string[];
};

@Injectable({ providedIn: 'root' })
export class AgentLoopService {

  // 配置项，意思自己看
  private readonly MAX_TURN_STEP = 20;
  private readonly MAX_TOOL_RETRY = 3;

  private readonly agentService = inject(AgentService);
  private readonly toolProvider = inject(AgentLoopToolProvider);

  //~~? 没有更新的逻辑重新开对话不就乱了吗 咳单个对话内罢了
  private toolCallCounter = 0;

  /**
   * 在开头加上 system prompt & 翻译 event 为标准模型 message
   */
  buildModelMessages(conversation: MatrixAgentConversation, enabledTools: AgentLoopToolName[]): AgentLoopMessage[] {
    const messages: AgentLoopMessage[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT(enabledTools),
      },
    ];

    for (const event of conversation.events) {
      switch (event.type) {
        case 'user_message':
          messages.push({ role: 'user', content: event.payload.content });
          break;
        case 'think':
          messages.push({ role: 'assistant', content: `<think>${escapeXml(event.payload.content)}</think>` });
          break;
        case 'tool_call':
          messages.push({
            role: 'assistant',
            content: `<tool_call>${JSON.stringify({ toolName: event.payload.toolName, input: event.payload.input })}</tool_call>`,
          });
          break;
        case 'tool_result':
          messages.push({
            role: 'user',
            content: `<tool_result>${JSON.stringify({
              callId: event.payload.callId,
              success: event.payload.success,
              output: event.payload.output,
            })}</tool_result>`,
          });
          break;
        case 'output':
          messages.push({ role: 'assistant', content: `${escapeXml(event.payload.content)}` });
          break;
        case 'turn_end':
          break;
      }
    }

    return messages;
  }

  /**
   * agent loop 核心入口方法
   * @param config 运行配置，包含必要的上下文获取函数和事件管理函数
   *
   */
  async emitAgentLoop(config: AgentLoopRunConfig): Promise<void> {
    const originalConversation = config.conversationSignal();
    if (!originalConversation) {
      console.error('Conversation not found. Aborting agent loop.');
      return;
    }

    const trimmedContent = config.userMessageContent.trim();
    if (!trimmedContent) {
      return;
    }

    const userEvent: MatrixAgentEventUserMessage = {
      type: 'user_message',
      payload: { content: trimmedContent },
    };

    //** 核心循环
    this.agentService.appendLocalEvents(config.conversationSignal, [userEvent]);

    let persistedEventCount = await this.persistEvents(
      config,
      originalConversation.events.length,
      [userEvent],
    );

    let turnStep = 0;
    let toolRetryCount = 0;

    while (turnStep < this.MAX_TURN_STEP) {
      turnStep += 1;

      const conversation = config.conversationSignal();
      if (!conversation) {
        console.error('Conversation not found while running the loop.');
        return;
      }

      const iteration = await this.runSinglePass(config, conversation, persistedEventCount, this.toolProvider.enabledTools);
      persistedEventCount = iteration.persistedEventCount;

      if (iteration.kind === 'complete') {
        return;
      }

      toolRetryCount = iteration.toolFailureHappened ? toolRetryCount + 1 : 0;
      if (toolRetryCount >= this.MAX_TOOL_RETRY) {
        const turnEnd: MatrixAgentEventTurnEnd = {
          type: 'turn_end',
          payload: {
            reason: 'tool_retry_limit_reached',
            detail: 'Tool retry limit reached while recovering from repeated tool failures.',
          },
        };
        this.agentService.appendLocalEvents(config.conversationSignal, [turnEnd]);
        await this.persistEvents(config, persistedEventCount, [turnEnd]);
        return;
      }
    }

    const turnEnd: MatrixAgentEventTurnEnd = {
      type: 'turn_end',
      payload: {
        reason: 'max_turn_limit_reached',
        detail: 'Agent loop stopped after reaching the maximum turn limit.',
      },
    };
    this.agentService.appendLocalEvents(config.conversationSignal, [turnEnd]);
    await this.persistEvents(config, persistedEventCount, [turnEnd]);
  }

  /*
   ** 单次循环逻辑
   */
  private async runSinglePass(
    config: AgentLoopRunConfig,
    conversation: MatrixAgentConversation,
    persistedEventCount: number,
    enabledTools: AgentLoopToolName[],
  ): Promise<{ kind: 'continue' | 'complete'; persistedEventCount: number; toolFailureHappened: boolean }> {
    const passState: PassState = {
      rawText: '',
      localStartIndex: conversation.events.length,
      toolCallIds: [],
    };
    const persistCursor = new AgentLoopPersistCursor(
      persistedEventCount,
      (expectedEventCount, events) => this.persistEvents(config, expectedEventCount, events),
    );

    const messages = this.buildModelMessages(conversation, enabledTools);

    // 流式 & 解析
    for await (const chunk of this.agentService.streamMessages(config.courseId, config.assignId, config.userId, messages)) {
      passState.rawText += chunk;

      const snapshot = parseAgentLoopPass({
        rawText: passState.rawText,
        existingToolCallIds: passState.toolCallIds,
        enabledTools,
        finalize: false,
        nextCallId: () => this.nextCallId(),
      });
      passState.toolCallIds = snapshot.toolCalls.map((toolCall) => toolCall.payload.callId);

      // 传入 localStartIndex 而非 push，只更新本次对话的 tail 事件
      this.projectPassTail(config, passState.localStartIndex, snapshot.displayEvents);
      await persistCursor.persistStablePrefix(snapshot.displayEvents, snapshot.stableCount);
    }

    const finalSnapshot = parseAgentLoopPass({
      rawText: passState.rawText,
      existingToolCallIds: passState.toolCallIds,
      enabledTools,
      finalize: true,
      nextCallId: () => this.nextCallId(),
    });

    this.projectPassTail(config, passState.localStartIndex, finalSnapshot.displayEvents);
    persistedEventCount = await persistCursor.persistStablePrefix(finalSnapshot.displayEvents, finalSnapshot.stableCount);


    // 无工具调用，结束本轮
    if (!finalSnapshot.toolCalls.length) {
      const turnEnd: MatrixAgentEventTurnEnd = {
        type: 'turn_end',
        payload: { reason: 'completed' },
      };
      this.agentService.appendLocalEvents(config.conversationSignal, [turnEnd]);
      persistedEventCount = await this.persistEvents(config, persistedEventCount, [turnEnd]);
      return { kind: 'complete', persistedEventCount, toolFailureHappened: false };
    }

    // 有工具调用
    const toolRun = await this.executeToolCalls(config, finalSnapshot.toolCalls, persistedEventCount);
    return {
      kind: 'continue',
      persistedEventCount: toolRun.persistedEventCount,
      toolFailureHappened: toolRun.toolFailureHappened,
    };
  }

  private projectPassTail(
    config: AgentLoopRunConfig,
    startIndex: number,
    events: MatrixAgentEvent[],
  ): void {
    const conversation = config.conversationSignal();
    if (!conversation) return;

    config.conversationSignal.set(projectAgentLoopPassTail(conversation, startIndex, events));
  }

  private async executeToolCalls(
    config: AgentLoopRunConfig,
    toolCalls: MatrixAgentEventToolCall[],
    persistedEventCount: number,
  ): Promise<{ persistedEventCount: number; toolFailureHappened: boolean }> {
    let toolFailureHappened = false;

    for (const toolCall of toolCalls) {
      const toolResult = await this.executeTool(
        config,
        toolCall.payload.toolName as AgentLoopToolName,
        toolCall.payload.input,
      );
      if (!toolResult.success) {
        toolFailureHappened = true;
      }

      const toolResultEvent: MatrixAgentEventToolResult = {
        type: 'tool_result',
        payload: {
          callId: toolCall.payload.callId,
          success: toolResult.success,
          output: toolResult.output,
        },
      };

      this.agentService.appendLocalEvents(config.conversationSignal, [toolResultEvent]);
      persistedEventCount = await this.persistEvents(config, persistedEventCount, [toolResultEvent]);
    }

    return { persistedEventCount, toolFailureHappened };
  }

  private async executeTool(
    config: AgentLoopRunConfig,
    toolName: AgentLoopToolName,
    input: string[],
  ): Promise<ToolExecutionResult> {
    const handler = this.toolProvider.getHandler(toolName);
    if (!handler) {
      return { success: false, output: `Tool ${toolName} is not enabled or implemented.` };
    }

    return handler(config, input);
  }

  private nextCallId(): string {
    this.toolCallCounter += 1;
    return `call-${this.toolCallCounter}`;
  }

  /**
   * 请求持久化到后端，在错误时回滚\
   * dTODO，应该重新请求后端，现在的 fallback 容易出错
   */
  private async persistEvents(
    config: AgentLoopRunConfig,
    expectedEventCount: number,
    events: MatrixAgentEvent[],
  ): Promise<number> {
    const conversationId = config.conversationSignal()?.conversationId;
    if (!conversationId) {
      throw new Error('Conversation not found while persisting events.');
    }

    const result = await firstValueFrom(this.agentService.appendEventsWithResult$(
      config.courseId,
      config.assignId,
      config.userId,
      {
        conversationId,
        expectedEventCount,
        events,
      },
    ));

    if (result.ok) {
      return expectedEventCount + events.length;
    }

    if (result.status === 409) {
      const remoteConversation = await firstValueFrom(this.agentService.getConversation$(
        config.courseId,
        config.assignId,
        conversationId,
        config.userId,
      ));
      if (remoteConversation) {
        config.conversationSignal.set(remoteConversation);
      }
      throw new Error(`Persist conflict: ${result.detail ?? 'expected_event_count mismatch'}`);
    }

    throw new Error(`Persisting events failed with status ${result.status}${result.detail ? `: ${result.detail}` : ''}.`);
  }
}
