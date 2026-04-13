import { Injectable, inject, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import type { Analysis, AssignData } from '../../../api/type/assigment';
import { escapeXml } from '../../../api/util/format';
import type {
  MatrixAgentConversation,
  MatrixAgentEvent,
  MatrixAgentEventToolCall,
  MatrixAgentEventTurnEndReason,
} from '../../../api/type/agent';
import { AgentService } from './agent.service';
import { SYSTEM_PROMPT } from './agent.constant';

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
  enabledTools?: AgentLoopToolName[];
  getEditorContent: () => string;
  getSelectionContent: () => string | null;
};

type ParsedAssistantBlock =
  | { type: 'output'; content: string }
  | { type: 'think'; content: string }
  | { type: 'tool_call'; toolName: string; input: string[] };

type ParsedPassSnapshot = {
  stableEvents: MatrixAgentEvent[];
  draftEvents: MatrixAgentEvent[];
  toolCallIds: string[];
};

@Injectable({ providedIn: 'root' })
export class AgentLoopService {
  private readonly agentService = inject(AgentService);
  private readonly maxModelPasses = 8;
  private toolCallCounter = 0;
  /**
   * agent loop 核心入口方法
   * @param config 运行配置，包含必要的上下文获取函数和事件管理函数
   *
   */  async emitAgentLoop(config: AgentLoopRunConfig): Promise<void> {
    const conversation = config.conversationSignal();
    if (!conversation) {
      throw new Error('Conversation not found.');
    }

    let acknowledgedEventCount = conversation.events.length;
    const userEvent: MatrixAgentEvent = {
      type: 'user_message',
      payload: { content: config.userMessageContent },
    };

    const turnBaseEvents = [...conversation.events, userEvent];
    const committedTurnEvents: MatrixAgentEvent[] = [];

    this.renderTurn(config.conversationSignal, turnBaseEvents, committedTurnEvents, []);
    acknowledgedEventCount = await this.persistEvents(config, acknowledgedEventCount, [userEvent]);

    for (let passIndex = 0; passIndex < this.maxModelPasses; passIndex += 1) {
      const messages = this.buildModelMessages({
        ...conversation,
        events: [...turnBaseEvents, ...committedTurnEvents],
      }, config.enabledTools ?? this.defaultEnabledTools());

      let rawText = '';
      let stableEventCount = 0;
      let toolCallIds: string[] = [];
      const pendingToolCalls: MatrixAgentEventToolCall[] = [];

      for await (const chunk of this.agentService.streamMessages(config.courseId, config.assignId, config.userId, messages)) {
        rawText += chunk;

        const snapshot = this.buildPassSnapshot(rawText, false, toolCallIds);
        toolCallIds = snapshot.toolCallIds;

        const newStableEvents = snapshot.stableEvents.slice(stableEventCount);
        if (newStableEvents.length > 0) {
          committedTurnEvents.push(...newStableEvents);
          pendingToolCalls.push(...newStableEvents.filter((event): event is MatrixAgentEventToolCall => event.type === 'tool_call'));
          stableEventCount = snapshot.stableEvents.length;
          this.renderTurn(config.conversationSignal, turnBaseEvents, committedTurnEvents, snapshot.draftEvents);
          acknowledgedEventCount = await this.persistEvents(config, acknowledgedEventCount, newStableEvents);
        } else {
          this.renderTurn(config.conversationSignal, turnBaseEvents, committedTurnEvents, snapshot.draftEvents);
        }
      }

      const finalSnapshot = this.buildPassSnapshot(rawText, true, toolCallIds);
      const finalStableEvents = finalSnapshot.stableEvents.slice(stableEventCount);
      if (finalStableEvents.length > 0) {
        committedTurnEvents.push(...finalStableEvents);
        pendingToolCalls.push(...finalStableEvents.filter((event): event is MatrixAgentEventToolCall => event.type === 'tool_call'));
        stableEventCount = finalSnapshot.stableEvents.length;
        this.renderTurn(config.conversationSignal, turnBaseEvents, committedTurnEvents, finalSnapshot.draftEvents);
        acknowledgedEventCount = await this.persistEvents(config, acknowledgedEventCount, finalStableEvents);
      } else {
        this.renderTurn(config.conversationSignal, turnBaseEvents, committedTurnEvents, finalSnapshot.draftEvents);
      }

      if (pendingToolCalls.length === 0) {
        const completedTurnEnd = this.createTurnEndEvent('completed');
        committedTurnEvents.push(completedTurnEnd);
        this.renderTurn(config.conversationSignal, turnBaseEvents, committedTurnEvents, []);
        await this.persistEvents(config, acknowledgedEventCount, [completedTurnEnd]);
        return;
      }

      for (const toolCall of pendingToolCalls) {
        const toolResultEvent: MatrixAgentEvent = {
          type: 'tool_result',
          payload: {
            callId: toolCall.payload.callId,
            ...(await this.executeTool(config, toolCall)),
          },
        };
        committedTurnEvents.push(toolResultEvent);
        this.renderTurn(config.conversationSignal, turnBaseEvents, committedTurnEvents, []);
        acknowledgedEventCount = await this.persistEvents(config, acknowledgedEventCount, [toolResultEvent]);
      }
    }

    const maxTurnEnd = this.createTurnEndEvent('max_turn_limit_reached');
    committedTurnEvents.push(maxTurnEnd);
    this.renderTurn(config.conversationSignal, turnBaseEvents, committedTurnEvents, []);
    await this.persistEvents(config, acknowledgedEventCount, [maxTurnEnd]);
  }

  private defaultEnabledTools(): AgentLoopToolName[] {
    return [
      'read_editor',
      'read_selection',
      'read_problem_info',
      'read_problem_answer',
    ];
  }

  /**
   * 在开头加上 system prompt & 翻译 event 为标准模型 message
   */
  private buildModelMessages(conversation: MatrixAgentConversation, enabledTools: AgentLoopToolName[]): AgentLoopMessage[] {
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
        case 'output':
          messages.push({ role: 'assistant', content: escapeXml(event.payload.content) });
          break;
        case 'think':
          messages.push({ role: 'assistant', content: `<think>${escapeXml(event.payload.content)}</think>` });
          break;
        case 'tool_call':
          messages.push({
            role: 'assistant',
            content: `<tool_call>${JSON.stringify({
              toolName: event.payload.toolName,
              input: event.payload.input,
            })}</tool_call>`,
          });
          break;
        case 'tool_result':
          messages.push({
            role: 'tool',
            content: event.payload.output,
            tool_call_id: event.payload.callId,
          });
          break;
        case 'turn_end':
          break;
      }
    }

    return messages;
  }

  private renderTurn(
    conversationSignal: WritableSignal<MatrixAgentConversation | null | undefined>,
    turnBaseEvents: MatrixAgentEvent[],
    committedTurnEvents: MatrixAgentEvent[],
    draftEvents: MatrixAgentEvent[],
  ): void {
    const conversation = conversationSignal();
    if (!conversation) {
      return;
    }

    conversationSignal.set({
      ...conversation,
      updatedAt: new Date().toISOString(),
      events: [...turnBaseEvents, ...committedTurnEvents, ...draftEvents],
    });
  }

  private buildPassSnapshot(rawText: string, finalize: boolean, existingToolCallIds: string[]): ParsedPassSnapshot {
    const parsed = this.parseAssistantText(rawText, finalize);
    const materialized = this.materializeBlocks(parsed.stableBlocks, existingToolCallIds);
    const draftEvents = parsed.draftText
      ? [{ type: 'output', payload: { content: parsed.draftText } } satisfies MatrixAgentEvent]
      : [];

    return {
      stableEvents: materialized.events,
      draftEvents,
      toolCallIds: materialized.toolCallIds,
    };
  }

  private parseAssistantText(rawText: string, finalize: boolean): { stableBlocks: ParsedAssistantBlock[]; draftText: string } {
    const stableBlocks: ParsedAssistantBlock[] = [];
    let searchCursor = 0;
    let plainStart = 0;

    while (true) {
      const nextTag = this.findNextSupportedTag(rawText, searchCursor);
      if (!nextTag) {
        break;
      }

      const closeIndex = rawText.indexOf(nextTag.closeTag, nextTag.openIndex + nextTag.openTag.length);
      if (closeIndex === -1) {
        break;
      }

      const closeEnd = closeIndex + nextTag.closeTag.length;
      const innerContent = rawText.slice(nextTag.openIndex + nextTag.openTag.length, closeIndex);

      if (nextTag.type === 'tool_call') {
        const parsedToolCall = this.tryParseToolCall(innerContent);
        if (!parsedToolCall) {
          searchCursor = closeEnd;
          continue;
        }

        const plainText = rawText.slice(plainStart, nextTag.openIndex);
        if (plainText) {
          stableBlocks.push({ type: 'output', content: plainText });
        }
        stableBlocks.push({
          type: 'tool_call',
          toolName: parsedToolCall.toolName,
          input: parsedToolCall.input,
        });
        searchCursor = closeEnd;
        plainStart = closeEnd;
        continue;
      }

      const plainText = rawText.slice(plainStart, nextTag.openIndex);
      if (plainText) {
        stableBlocks.push({ type: 'output', content: plainText });
      }
      stableBlocks.push({
        type: nextTag.type,
        content: innerContent,
      });
      searchCursor = closeEnd;
      plainStart = closeEnd;
    }

    let draftText = rawText.slice(plainStart);
    if (finalize && draftText) {
      stableBlocks.push({ type: 'output', content: draftText });
      draftText = '';
    }

    return { stableBlocks, draftText };
  }

  private findNextSupportedTag(rawText: string, fromIndex: number): {
    type: 'output' | 'think' | 'tool_call';
    openTag: string;
    closeTag: string;
    openIndex: number;
  } | null {
    const candidates = [
      { type: 'output' as const, openTag: '<output>', closeTag: '</output>' },
      { type: 'think' as const, openTag: '<think>', closeTag: '</think>' },
      { type: 'tool_call' as const, openTag: '<tool_call>', closeTag: '</tool_call>' },
    ]
      .map((tag) => ({
        ...tag,
        openIndex: rawText.indexOf(tag.openTag, fromIndex),
      }))
      .filter((tag) => tag.openIndex >= 0)
      .sort((left, right) => left.openIndex - right.openIndex);

    return candidates[0] ?? null;
  }

  private tryParseToolCall(content: string): { toolName: string; input: string[] } | null {
    try {
      const parsed = JSON.parse(content) as { toolName?: unknown; input?: unknown };
      if (typeof parsed.toolName !== 'string' || !Array.isArray(parsed.input)) {
        return null;
      }

      const input = parsed.input.map((item) => String(item));
      return {
        toolName: parsed.toolName,
        input,
      };
    } catch {
      return null;
    }
  }

  private materializeBlocks(blocks: ParsedAssistantBlock[], existingToolCallIds: string[]): {
    events: MatrixAgentEvent[];
    toolCallIds: string[];
  } {
    const toolCallIds = [...existingToolCallIds];
    let toolCallIndex = 0;
    const events = blocks.map((block): MatrixAgentEvent => {
      if (block.type === 'output') {
        return {
          type: 'output',
          payload: { content: block.content },
        };
      }

      if (block.type === 'think') {
        return {
          type: 'think',
          payload: { content: block.content },
        };
      }

      const callId = toolCallIds[toolCallIndex] ?? this.nextToolCallId();
      toolCallIds[toolCallIndex] = callId;
      toolCallIndex += 1;
      return {
        type: 'tool_call',
        payload: {
          callId,
          toolName: block.toolName,
          input: block.input,
        },
      };
    });

    return { events, toolCallIds };
  }

  private nextToolCallId(): string {
    this.toolCallCounter += 1;
    return `tool-call-${this.toolCallCounter}`;
  }

  private async executeTool(
    config: AgentLoopRunConfig,
    toolCall: MatrixAgentEventToolCall,
  ): Promise<{ success: boolean; output: string }> {
    switch (toolCall.payload.toolName) {
      case 'read_editor':
        return {
          success: true,
          output: config.getEditorContent(),
        };
      case 'read_selection': {
        const selection = config.getSelectionContent();
        return selection
          ? { success: true, output: selection }
          : { success: false, output: '当前没有选中的代码片段。' };
      }
      case 'read_problem_info': {
        if (!config.assignData) {
          return { success: false, output: '当前无法读取题目信息。' };
        }
        const description = config.assignData.description?.trim() || '暂无描述';
        return {
          success: true,
          output: `标题: ${config.assignData.title}\n\n描述:\n${description}`,
        };
      }
      case 'read_problem_answer': {
        const resolution = config.analysis?.basic?.resolution;
        if (!resolution?.content?.length) {
          return { success: false, output: '当前没有可读取的参考题解。' };
        }

        return {
          success: true,
          output: resolution.content
            .map((tab) => `# ${tab.title}\n${tab.content}`)
            .join('\n\n'),
        };
      }
      default:
        return {
          success: false,
          output: `Unsupported tool: ${toolCall.payload.toolName}`,
        };
    }
  }

  private createTurnEndEvent(reason: MatrixAgentEventTurnEndReason): MatrixAgentEvent {
    return {
      type: 'turn_end',
      payload: { reason },
    };
  }

  private async persistEvents(
    config: AgentLoopRunConfig,
    expectedEventCount: number,
    events: MatrixAgentEvent[],
  ): Promise<number> {
    const conversation = config.conversationSignal();
    if (!conversation) {
      throw new Error('Conversation not found.');
    }

    const statusCode = await firstValueFrom(this.agentService.appendEvents$(
      config.courseId as any,
      config.assignId as any,
      config.userId,
      {
        conversationId: conversation.conversationId,
        expectedEventCount,
        events,
      },
    ));

    if (statusCode === 409) {
      await this.reloadConversation(config, conversation.conversationId);
      throw new Error('Conversation event count conflict.');
    }

    if (statusCode !== 200) {
      throw new Error(`Persist events failed with status ${String(statusCode)}.`);
    }

    return expectedEventCount + events.length;
  }

  private async reloadConversation(config: AgentLoopRunConfig, conversationId: string): Promise<void> {
    const service = this.agentService as AgentService & {
      getConversation$?: (
        courseId: string,
        assignId: string,
        conversationId: string,
        userId?: string,
      ) => ReturnType<AgentService['getConversation$']>;
    };
    if (!service.getConversation$) {
      return;
    }

    const latestConversation = await firstValueFrom(
      service.getConversation$(config.courseId, config.assignId, conversationId, config.userId),
    );
    if (latestConversation) {
      config.conversationSignal.set(latestConversation);
    }
  }
}
