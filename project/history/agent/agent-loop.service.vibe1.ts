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

type ToolExecutionResult = {
  success: boolean;
  output: string;
};

type ParsedPlainTextSegment = {
  kind: 'plain_text';
  content: string;
};

type ParsedOutputSegment = {
  kind: 'output';
  content: string;
};

type ParsedThinkSegment = {
  kind: 'think';
  content: string;
};

type ParsedToolCallSegment = {
  kind: 'tool_call';
  toolName: AgentLoopToolName;
  input: string[];
};

type ParsedPassSegment =
  | ParsedPlainTextSegment
  | ParsedOutputSegment
  | ParsedThinkSegment
  | ParsedToolCallSegment;

type LocalAssistantEvent =
  | MatrixAgentEventOutput
  | MatrixAgentEventThink
  | MatrixAgentEventToolCall;

type PassSnapshot = {
  displayEvents: LocalAssistantEvent[];
  committedEvents: LocalAssistantEvent[];
  toolCalls: MatrixAgentEventToolCall[];
};

type PassResult = {
  kind: 'continue' | 'complete';
  persistedEventCount: number;
  toolFailureHappened: boolean;
};

class PersistConflictError extends Error {
  constructor() {
    super('Conversation changed while persisting agent events.');
  }
}

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
        : { success: false, output: 'No selection is currently available.' };
    }],
    ['read_problem_info', async (config) => {
      if (!config.assignData) {
        return { success: false, output: 'Problem information is not available.' };
      }

      const description = config.assignData.description?.trim() || 'No description';
      return {
        success: true,
        output: `Title: ${config.assignData.title}\n\nDescription:\n${description}`,
      };
    }],
    ['read_problem_answer', async (config) => {
      const resolution = config.analysis?.basic?.resolution;
      if (!resolution?.content?.length) {
        return { success: false, output: 'Reference answer is not available.' };
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
          messages.push({ role: 'assistant', content: escapeXml(event.payload.content) });
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

    const enabledTools: AgentLoopToolName[] = config.enabledTools?.length
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

    let persistedEventCount = originalConversation.events.length;
    persistedEventCount = await this.persistBatch(
      config,
      persistedEventCount,
      [userEvent],
      originalConversation.conversationId,
    );

    let toolRetryCount = 0;

    for (let turnStep = 0; turnStep < this.MAX_TURN_STEP; turnStep += 1) {
      const conversation = config.conversationSignal();
      if (!conversation) {
        console.error('Conversation not found. Aborting agent loop.');
        return;
      }

      const result = await this.runSinglePass(config, conversation, persistedEventCount, enabledTools);
      persistedEventCount = result.persistedEventCount;

      if (result.kind === 'complete') {
        return;
      }

      toolRetryCount = result.toolFailureHappened ? toolRetryCount + 1 : 0;
      if (toolRetryCount >= this.MAX_TOOL_RETRY) {
        const turnEnd: MatrixAgentEventTurnEnd = {
          type: 'turn_end',
          payload: {
            reason: 'tool_retry_limit_reached',
            detail: 'Tool retry limit reached while recovering from repeated tool failures.',
          },
        };
        this.agentService.appendLocalEvents(config.conversationSignal, [turnEnd]);
        await this.persistBatch(config, persistedEventCount, [turnEnd], conversation.conversationId);
        return;
      }
    }

    const finalConversation = config.conversationSignal();
    const turnEnd: MatrixAgentEventTurnEnd = {
      type: 'turn_end',
      payload: {
        reason: 'max_turn_limit_reached',
        detail: 'Agent loop stopped after reaching the maximum turn limit.',
      },
    };
    this.agentService.appendLocalEvents(config.conversationSignal, [turnEnd]);
    await this.persistBatch(
      config,
      persistedEventCount,
      [turnEnd],
      finalConversation?.conversationId ?? originalConversation.conversationId,
    );
  }

  private async runSinglePass(
    config: AgentLoopRunConfig,
    conversation: MatrixAgentConversation,
    persistedEventCount: number,
    enabledTools: AgentLoopToolName[],
  ): Promise<PassResult> {
    const messages = this.buildModelMessages(conversation, enabledTools);
    const previewStartIndex = conversation.events.length;
    const passCallIdSeed = this.toolCallCounter;

    let rawText = '';
    let committedEventCount = 0;
    let toolFailureHappened = false;

    for await (const chunk of this.agentService.streamMessages(config.courseId, config.assignId, config.userId, messages)) {
      rawText += chunk;

      const snapshot = this.buildPassSnapshot(rawText, false, passCallIdSeed);
      this.replacePreviewTail(config.conversationSignal, previewStartIndex, snapshot.displayEvents);

      const newCommittedEvents = snapshot.committedEvents.slice(committedEventCount);
      if (newCommittedEvents.length > 0) {
        persistedEventCount = await this.persistBatch(
          config,
          persistedEventCount,
          newCommittedEvents,
          conversation.conversationId,
        );
        committedEventCount = snapshot.committedEvents.length;
      }
    }

    const finalSnapshot = this.buildPassSnapshot(rawText, true, passCallIdSeed);
    this.replacePreviewTail(config.conversationSignal, previewStartIndex, finalSnapshot.displayEvents);

    const remainingCommittedEvents = finalSnapshot.committedEvents.slice(committedEventCount);
    if (remainingCommittedEvents.length > 0) {
      persistedEventCount = await this.persistBatch(
        config,
        persistedEventCount,
        remainingCommittedEvents,
        conversation.conversationId,
      );
    }

    if (finalSnapshot.toolCalls.length === 0) {
      const turnEnd: MatrixAgentEventTurnEnd = {
        type: 'turn_end',
        payload: { reason: 'completed' },
      };
      this.agentService.appendLocalEvents(config.conversationSignal, [turnEnd]);
      persistedEventCount = await this.persistBatch(config, persistedEventCount, [turnEnd], conversation.conversationId);
      return { kind: 'complete', persistedEventCount, toolFailureHappened: false };
    }

    for (const toolCallEvent of finalSnapshot.toolCalls) {
      const toolResult = await this.executeTool(
        config,
        toolCallEvent.payload.toolName as AgentLoopToolName,
        toolCallEvent.payload.input,
      );
      if (!toolResult.success) {
        toolFailureHappened = true;
      }

      const toolResultEvent: MatrixAgentEventToolResult = {
        type: 'tool_result',
        payload: {
          callId: toolCallEvent.payload.callId,
          success: toolResult.success,
          output: toolResult.output,
        },
      };

      this.agentService.appendLocalEvents(config.conversationSignal, [toolResultEvent]);
      persistedEventCount = await this.persistBatch(config, persistedEventCount, [toolResultEvent], conversation.conversationId);
    }

    return { kind: 'continue', persistedEventCount, toolFailureHappened };
  }

  private buildPassSnapshot(rawText: string, finalize: boolean, callIdSeed: number): PassSnapshot {
    const parsedSegments = this.parsePassSegments(rawText);
    const lastSegment = parsedSegments.at(-1);
    const stableSegments = finalize
      ? parsedSegments
      : lastSegment?.kind === 'plain_text'
        ? parsedSegments.slice(0, -1)
        : parsedSegments;
    const trailingPlainText = !finalize && lastSegment?.kind === 'plain_text'
      ? lastSegment.content
      : '';

    const committedEvents = this.mapSegmentsToEvents(stableSegments, callIdSeed);
    const displayEvents: LocalAssistantEvent[] = [...committedEvents];
    if (trailingPlainText.length > 0) {
      displayEvents.push({
        type: 'output',
        payload: { content: trailingPlainText },
      });
    }

    return {
      displayEvents,
      committedEvents,
      toolCalls: committedEvents.filter((event): event is MatrixAgentEventToolCall => event.type === 'tool_call'),
    };
  }

  private parsePassSegments(rawText: string): ParsedPassSegment[] {
    const segments: ParsedPassSegment[] = [];
    const tagPattern = /<(think|tool_call|output)>([\s\S]*?)<\/\1>/g;

    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = tagPattern.exec(rawText)) !== null) {
      if (match.index > cursor) {
        this.pushPlainTextSegment(segments, rawText.slice(cursor, match.index));
      }

      const [, tagName, tagContent] = match;
      if (tagName === 'output') {
        if (tagContent.length > 0) {
          segments.push({ kind: 'output', content: tagContent });
        }
      } else if (tagName === 'think') {
        if (tagContent.length > 0) {
          segments.push({ kind: 'think', content: tagContent });
        }
      } else {
        const toolCall = this.tryParseToolCall(tagContent);
        if (toolCall) {
          segments.push({
            kind: 'tool_call',
            toolName: toolCall.toolName,
            input: toolCall.input,
          });
        } else {
          this.pushPlainTextSegment(segments, match[0]);
        }
      }

      cursor = match.index + match[0].length;
    }

    if (cursor < rawText.length) {
      this.pushPlainTextSegment(segments, rawText.slice(cursor));
    }

    return segments;
  }

  private pushPlainTextSegment(segments: ParsedPassSegment[], content: string): void {
    if (!content.length) {
      return;
    }

    const previous = segments.at(-1);
    if (previous?.kind === 'plain_text') {
      previous.content += content;
      return;
    }

    segments.push({ kind: 'plain_text', content });
  }

  private mapSegmentsToEvents(segments: ParsedPassSegment[], callIdSeed: number): LocalAssistantEvent[] {
    const events: LocalAssistantEvent[] = [];
    let toolCallOffset = 0;

    for (const segment of segments) {
      switch (segment.kind) {
        case 'plain_text':
        case 'output':
          if (segment.content.length > 0) {
            events.push({
              type: 'output',
              payload: { content: segment.content },
            });
          }
          break;
        case 'think':
          if (segment.content.length > 0) {
            events.push({
              type: 'think',
              payload: { content: segment.content },
            });
          }
          break;
        case 'tool_call':
          events.push({
            type: 'tool_call',
            payload: {
              callId: this.buildCallId(callIdSeed + toolCallOffset + 1),
              toolName: segment.toolName,
              input: segment.input,
            },
          });
          toolCallOffset += 1;
          break;
      }
    }

    return events;
  }

  private tryParseToolCall(content: string): { toolName: AgentLoopToolName; input: string[] } | null {
    try {
      const parsed = JSON.parse(content) as { toolName?: unknown; input?: unknown };
      if (typeof parsed?.toolName !== 'string' || !this.toolRegistry.has(parsed.toolName as AgentLoopToolName)) {
        return null;
      }

      if (!Array.isArray(parsed.input) || !parsed.input.every((item) => typeof item === 'string')) {
        return null;
      }

      return {
        toolName: parsed.toolName as AgentLoopToolName,
        input: [...parsed.input],
      };
    } catch {
      return null;
    }
  }

  private buildCallId(sequence: number): string {
    return `call-${sequence}`;
  }

  private replacePreviewTail(
    conversationSignal: WritableSignal<MatrixAgentConversation | null | undefined>,
    startIndex: number,
    previewEvents: LocalAssistantEvent[],
  ): void {
    const conversation = conversationSignal();
    if (!conversation) {
      return;
    }

    conversationSignal.set({
      ...conversation,
      updatedAt: new Date().toISOString(),
      events: [
        ...conversation.events.slice(0, startIndex),
        ...previewEvents,
      ],
    });
  }

  private async executeTool(config: AgentLoopRunConfig, toolName: AgentLoopToolName, input: string[]): Promise<ToolExecutionResult> {
    const handler = this.toolRegistry.get(toolName);
    if (!handler) {
      return { success: false, output: `Tool ${toolName} is not enabled or implemented.` };
    }

    return handler(config, input);
  }

  /**
   * 请求持久化到后端，在错误时回滚\
   * dTODO，应该重新请求后端，现在的 fallback 容易出错
   */
  private async persistBatch(
    config: AgentLoopRunConfig,
    expectedEventCount: number,
    events: MatrixAgentEvent[],
    conversationId?: string,
  ): Promise<number> {
    if (events.length === 0) {
      return expectedEventCount;
    }

    const statusCode = await firstValueFrom(this.agentService.appendEvents$(
      config.courseId as any,
      config.assignId as any,
      config.userId,
      {
        conversationId: conversationId ?? config.conversationSignal()?.conversationId ?? '',
        expectedEventCount,
        events,
      },
    ));

    if (statusCode === 409) {
      await this.reloadConversation(config, conversationId);
      throw new PersistConflictError();
    }

    if (!statusCode || statusCode < 200 || statusCode >= 300) {
      throw new Error(`Persisting events failed with status ${statusCode ?? 'unknown'}.`);
    }

    const toolCalls = events.filter((event): event is MatrixAgentEventToolCall => event.type === 'tool_call');
    if (toolCalls.length > 0) {
      this.toolCallCounter += toolCalls.length;
    }

    return expectedEventCount + events.length;
  }

  private async reloadConversation(config: AgentLoopRunConfig, conversationId?: string): Promise<void> {
    const targetConversationId = conversationId ?? config.conversationSignal()?.conversationId;
    if (!targetConversationId) {
      return;
    }

    const latestConversation = await firstValueFrom(
      this.agentService.getConversation$(config.courseId as any, config.assignId as any, targetConversationId, config.userId),
    );

    if (latestConversation) {
      config.conversationSignal.set(latestConversation);
    }
  }
}
