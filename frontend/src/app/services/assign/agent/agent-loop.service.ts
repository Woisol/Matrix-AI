import { inject, Injectable, WritableSignal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { Analysis, AssignData } from "../../../api/type/assigment";
import {
  MatrixAgentConversation,
  MatrixAgentEvent,
  MatrixAgentEventOutput,
  MatrixAgentEventThink,
  MatrixAgentEventToolCall,
  MatrixAgentEventToolResult,
  MatrixAgentEventTurnEnd,
  MatrixAgentEventUserMessage,
} from "../../../api/type/agent";
import { AgentService } from "./agent.service";
import { SYSTEM_PROMPT } from "./agent.constant";
import { escapeXml } from "../../../api/util/format";

export type AgentLoopToolName =
  | 'read_editor'
  | 'read_selection'
  | 'read_problem_info'
  | 'read_problem_answer';

export type AgentLoopMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
};

export type AgentLoopRunConfig = {
  courseId: string;
  assignId: string;
  userId: string;
  userMessageContent: string;
  conversationSignal: WritableSignal<MatrixAgentConversation | null | undefined>;
  assignData?: AssignData | undefined;
  analysis?: Analysis | undefined;
  getEditorContent: () => string;
  getSelectionContent: () => string | null;
  enabledTools?: AgentLoopToolName[];
};

type AgentXmlTag = 'think' | 'tool_call' | 'output';

type ToolExecutionResult = {
  success: boolean;
  output: string;
};

type PassDisplayEvent = MatrixAgentEventOutput | MatrixAgentEventThink | MatrixAgentEventToolCall;

/**
 * 在 event 的基础上包装一个 stable 字段，只有已经明确闭合的内容才会 stable 并允许持久化
 */
type ParsedDisplayBlock = {
  event: PassDisplayEvent;
  stable: boolean;
};

type PassSnapshot = {
  displayEvents: PassDisplayEvent[];
  stableCount: number;
  toolCalls: MatrixAgentEventToolCall[];
};

type PassState = {
  _fullResponse: string;
  rawText: string;
  localStartIndex: number;
  persistedStableCount: number;
  toolCallIds: string[];
};

@Injectable({ providedIn: 'root' })
export class AgentLoopService {

  // 配置项，意思自己看
  private readonly MAX_TURN_STEP = 20;
  private readonly MAX_TOOL_RETRY = 3;

  private readonly agentService = inject(AgentService);

  //~~? 没有更新的逻辑重新开对话不就乱了吗 咳单个对话内罢了
  private toolCallCounter = 0;

  /**
   * 工具注册表，负责将工具名映射到实际的工具执行函数
   * 只需要专注工具逻辑，不需要在这里重复判断工具是否启用
   */
  private readonly toolRegistry = new Map<AgentLoopToolName, (config: AgentLoopRunConfig, input: string[]) => Promise<ToolExecutionResult>>([
    ['read_editor', async (config) => ({
      success: true,
      output: config.getEditorContent(),
    })],
    ['read_selection', async (config) => {
      const selection = config.getSelectionContent();
      return selection
        ? { success: true, output: selection }
        : { success: false, output: '当前没有选中的代码片段。' };
    }],
    ['read_problem_info', async (config) => {
      if (!config.assignData) {
        return { success: false, output: '当前无法读取题目信息。' };
      }

      const description = config.assignData.description?.trim() || '暂无描述';
      return {
        success: true,
        output: `标题: ${config.assignData.title}\n\n描述:\n${description}`,
      };
    }],
    ['read_problem_answer', async (config) => {
      const resolution = config.analysis?.basic?.resolution;
      if (!resolution?.content?.length) {
        return { success: false, output: '当前没有可读取的参考题解。' };
      }

      const answerText = resolution.content
        .map((tab) => `# ${tab.title}\n${tab.content}`)
        .join('\n\n');

      return { success: true, output: answerText };
    }],
  ]);

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

    const enabledTools = config.enabledTools?.length
      ? config.enabledTools
      : Array.from(this.toolRegistry.keys());

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
        console.error('Conversation not found within single pass. Aborting agent loop.');
        return;
      }

      const iteration = await this.runSinglePass(config, conversation, persistedEventCount, enabledTools);
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
      _fullResponse: '',
      rawText: '',
      localStartIndex: conversation.events.length,
      persistedStableCount: 0,
      toolCallIds: [],
    };

    const messages = this.buildModelMessages(conversation, enabledTools);

    // 流式 & 解析
    for await (const chunk of this.agentService.streamMessages(config.courseId, config.assignId, config.userId, messages)) {
      passState._fullResponse += chunk;
      passState.rawText += chunk;

      const snapshot = this.buildPassSnapshot(passState.rawText, passState.toolCallIds, enabledTools, false);
      passState.toolCallIds = snapshot.toolCalls.map((toolCall) => toolCall.payload.callId);

      this.replaceLocalPassDisplay(config, passState.localStartIndex, snapshot.displayEvents);
      persistedEventCount = await this.persistStablePrefix(config, passState, snapshot, persistedEventCount);
    }

    console.log('Full response for this pass:', passState._fullResponse);

    const finalSnapshot = this.buildPassSnapshot(passState.rawText, passState.toolCallIds, enabledTools, true);
    this.replaceLocalPassDisplay(config, passState.localStartIndex, finalSnapshot.displayEvents);
    persistedEventCount = await this.persistStablePrefix(config, passState, finalSnapshot, persistedEventCount);


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

  /**
   * 核心解析方法，将模型输出的 raw text 解析为前端可展示的事件列表，并提取工具调用信息
   */
  private buildPassSnapshot(
    rawText: string,
    existingToolCallIds: string[],
    enabledTools: AgentLoopToolName[],
    finalize: boolean,
  ): PassSnapshot {
    const blocks: ParsedDisplayBlock[] = [];
    const toolCalls: MatrixAgentEventToolCall[] = [];
    let cursor = 0;
    let toolIndex = 0;
    let curTag: AgentXmlTag | null = null;
    let curTagStartIndex = -1;
    let curTagContentStartIndex = -1;

    while (cursor < rawText.length) {
      const nextTag = this.findNextOpeningTag(rawText, cursor);
      if (!nextTag) {
        this.pushOutputBlock(blocks, rawText.slice(cursor), finalize);
        break;
      }

      const closeTag = `</${nextTag.tag}>`;
      const closeIndex = rawText.indexOf(closeTag, nextTag.index + nextTag.openTag.length);
      if (closeIndex === -1) {
        // 说明有 开标签 但没有 闭标签，直接 push 为 output
        this.pushOutputBlock(blocks, rawText.slice(cursor), finalize);
        break;
      }

      // push 标签前的文本为 output
      if (nextTag.index > cursor) {
        this.pushOutputBlock(blocks, rawText.slice(cursor, nextTag.index), true);
      }

      const tagContent = rawText.slice(nextTag.index + nextTag.openTag.length, closeIndex);
      if (nextTag.tag === 'output') {
        this.pushOutputBlock(blocks, tagContent, true);
      } else if (nextTag.tag === 'think') {
        blocks.push({
          event: {
            type: 'think',
            payload: { content: tagContent },
          },
          stable: true,
        });
      } else {
        const parsedToolCall = this.parseToolCallPayload(tagContent, enabledTools);
        if (parsedToolCall.ok) {
          const callId = existingToolCallIds[toolIndex] ?? this.nextCallId();
          const toolCallEvent: MatrixAgentEventToolCall = {
            type: 'tool_call',
            payload: {
              callId,
              toolName: parsedToolCall.toolName,
              input: parsedToolCall.input,
            },
          };
          blocks.push({ event: toolCallEvent, stable: true });
          toolCalls.push(toolCallEvent);
          toolIndex += 1;
        } else {
          const rawBlock = rawText.slice(nextTag.index, closeIndex + closeTag.length);
          this.pushOutputBlock(blocks, rawBlock, true);
        }
      }

      cursor = closeIndex + closeTag.length;
    }

    return {
      displayEvents: blocks.map((block) => block.event),
      stableCount: finalize ? blocks.length : this.countStablePrefix(blocks),
      toolCalls,
    };
  }

  /**
   * 找 /<(think|tool_call|output)>/
   */
  private findNextOpeningTag(text: string, cursor: number): { tag: AgentXmlTag; index: number; openTag: string } | null {
    const match = text.slice(cursor).match(/<(think|tool_call|output)>/);
    if (!match || match.index === undefined) {
      return null;
    }

    return {
      tag: match[1] as AgentXmlTag,
      index: cursor + match.index,
      openTag: match[0],
    };
  }

  private pushOutputBlock(blocks: ParsedDisplayBlock[], content: string, stable: boolean): void {
    if (!content) {
      return;
    }

    blocks.push({
      event: {
        type: 'output',
        payload: { content },
      },
      stable,
    });
  }

  private countStablePrefix(blocks: ParsedDisplayBlock[]): number {
    let stableCount = 0;
    for (const block of blocks) {
      if (!block.stable) {
        break;
      }
      stableCount += 1;
    }
    return stableCount;
  }

  private replaceLocalPassDisplay(
    config: AgentLoopRunConfig,
    startIndex: number,
    events: PassDisplayEvent[],
  ): void {
    const conversation = config.conversationSignal();
    if (!conversation) return;

    config.conversationSignal.set({
      ...conversation,
      updatedAt: new Date().toISOString(),
      events: [
        ...conversation.events.slice(0, startIndex),
        ...events,
      ],
    });
  }

  private async persistStablePrefix(
    config: AgentLoopRunConfig,
    passState: PassState,
    snapshot: PassSnapshot,
    persistedEventCount: number,
  ): Promise<number> {
    if (snapshot.stableCount <= passState.persistedStableCount) {
      return persistedEventCount;
    }

    const newStableEvents = snapshot.displayEvents.slice(passState.persistedStableCount, snapshot.stableCount);
    if (!newStableEvents.length) {
      passState.persistedStableCount = snapshot.stableCount;
      return persistedEventCount;
    }

    persistedEventCount = await this.persistEvents(config, persistedEventCount, newStableEvents);
    passState.persistedStableCount = snapshot.stableCount;
    return persistedEventCount;
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

  private parseToolCallPayload(
    content: string,
    enabledTools: AgentLoopToolName[],
  ): { ok: true; toolName: AgentLoopToolName; input: string[] } | { ok: false } {
    try {
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== 'object') {
        return { ok: false };
      }

      if (typeof parsed.toolName !== 'string' || !parsed.toolName.trim()) {
        return { ok: false };
      }

      const toolName = parsed.toolName as AgentLoopToolName;
      if (!enabledTools.includes(toolName) || !this.toolRegistry.has(toolName)) {
        return { ok: false };
      }

      if (!Array.isArray(parsed.input) || !parsed.input.every((item: unknown) => typeof item === 'string')) {
        return { ok: false };
      }

      return {
        ok: true,
        toolName,
        input: parsed.input,
      };
    } catch {
      return { ok: false };
    }
  }

  private async executeTool(
    config: AgentLoopRunConfig,
    toolName: AgentLoopToolName,
    input: string[],
  ): Promise<ToolExecutionResult> {
    const handler = this.toolRegistry.get(toolName);
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
