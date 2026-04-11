import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { Analysis, AssignData } from "../../../api/type/assigment";
import {
  MatrixAgentConversation,
  MatrixAgentEvent,
  MatrixAgentEventFinal,
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
  getConversation: () => MatrixAgentConversation | null;
  setConversation: (conversation: MatrixAgentConversation) => void;
  assignData?: AssignData | undefined;
  analysis?: Analysis | undefined;
  getEditorContent: () => string;
  getSelectionContent: () => string | null;
  enabledTools?: AgentLoopToolName[];
};

type AgentXmlTag = 'think' | 'tool_call' | 'final';

type ToolExecutionResult = {
  success: boolean;
  output: string;
};

type ParserState = {
  pendingText: string;
  activeTag: AgentXmlTag | null;
  activeBuffer: string;
  activeTempEventIndex: number | null;
  sawToolCall: boolean;
  finalClosedContent: string | null;
  protocolErrorDetail: string | null;
  toolFailureHappened: boolean;
};

@Injectable({ providedIn: 'root' })
export class AgentLoopService {
  private readonly agentService = inject(AgentService);

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

  buildSystemPrompt(enabledTools: AgentLoopToolName[]): string {
    return SYSTEM_PROMPT(enabledTools);
  }

  buildModelMessages(conversation: MatrixAgentConversation, enabledTools: AgentLoopToolName[]): AgentLoopMessage[] {
    // 在开头加上 system prompt
    const messages: AgentLoopMessage[] = [
      {
        role: 'system',
        content: this.buildSystemPrompt(enabledTools),
      },
    ];

    // 翻译各 event 为标准模型 message
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
        case 'final':
          messages.push({ role: 'assistant', content: `<final>${escapeXml(event.payload.content)}</final>` });
          break;
        case 'turn_end':
          break;
      }
    }

    return messages;
  }

  /**
   * agent loop 核心方法
   * @param config 运行配置，包含必要的上下文获取函数和事件管理函数
   *
   */
  async runUserTurn(config: AgentLoopRunConfig): Promise<void> {
    const originalConversation = config.getConversation();
    if (!originalConversation) {
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

    this.appendLocalEvents(config, [userEvent]);

    let persistedEventCount = originalConversation.events.length;
    persistedEventCount = await this.persistBatch(config, persistedEventCount, [userEvent], originalConversation);

    let turnStep = 0;
    let toolRetryCount = 0;

    while (turnStep < 8) {
      turnStep += 1;
      const currentConversation = config.getConversation();
      if (!currentConversation) return;

      const iteration = await this.runSingleResponse(config, currentConversation, persistedEventCount, enabledTools);
      persistedEventCount = iteration.persistedEventCount;

      if (iteration.kind === 'complete') {
        return;
      }

      if (iteration.kind === 'error_end') {
        return;
      }

      toolRetryCount = iteration.toolFailureHappened ? toolRetryCount + 1 : 0;
      if (toolRetryCount >= 3) {
        const turnEnd: MatrixAgentEventTurnEnd = {
          type: 'turn_end',
          payload: {
            reason: 'tool_retry_limit_reached',
            detail: 'Tool retry limit reached while recovering from repeated tool failures.',
          },
        };
        this.appendLocalEvents(config, [turnEnd]);
        await this.persistBatch(config, persistedEventCount, [turnEnd], originalConversation);
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
    this.appendLocalEvents(config, [turnEnd]);
    await this.persistBatch(config, persistedEventCount, [turnEnd], originalConversation);
  }

  private async runSingleResponse(
    config: AgentLoopRunConfig,
    conversation: MatrixAgentConversation,
    persistedEventCount: number,
    enabledTools: AgentLoopToolName[],
  ): Promise<{ kind: 'continue' | 'complete' | 'error_end'; persistedEventCount: number; toolFailureHappened: boolean }> {
    const parserState: ParserState = {
      pendingText: '',
      activeTag: null,
      activeBuffer: '',
      activeTempEventIndex: null,
      sawToolCall: false,
      finalClosedContent: null,
      protocolErrorDetail: null,
      toolFailureHappened: false,
    };

    const messages = this.buildModelMessages(conversation, enabledTools);

    for await (const chunk of this.streamModelMessages(config, messages)) {
      parserState.pendingText += chunk;
      persistedEventCount = await this.consumeParserState(config, parserState, persistedEventCount);
    }

    persistedEventCount = await this.finishParserState(config, parserState, persistedEventCount);

    if (parserState.protocolErrorDetail) {
      return { kind: 'error_end', persistedEventCount, toolFailureHappened: parserState.toolFailureHappened };
    }

    if (parserState.sawToolCall) {
      return { kind: 'continue', persistedEventCount, toolFailureHappened: parserState.toolFailureHappened };
    }

    if (parserState.finalClosedContent !== null) {
      const turnEnd: MatrixAgentEventTurnEnd = {
        type: 'turn_end',
        payload: { reason: 'completed' },
      };
      this.appendLocalEvents(config, [turnEnd]);
      persistedEventCount = await this.persistBatch(config, persistedEventCount, [
        { type: 'final', payload: { content: parserState.finalClosedContent } },
        turnEnd,
      ], conversation);
      return { kind: 'complete', persistedEventCount, toolFailureHappened: false };
    }

    const missingFinalEnd: MatrixAgentEventTurnEnd = {
      type: 'turn_end',
      payload: {
        reason: 'client_error',
        detail: 'Model response ended without <final> or <tool_call>.',
      },
    };
    this.appendLocalEvents(config, [missingFinalEnd]);
    persistedEventCount = await this.persistBatch(config, persistedEventCount, [missingFinalEnd], conversation);
    return { kind: 'error_end', persistedEventCount, toolFailureHappened: false };
  }

  private async *streamModelMessages(config: AgentLoopRunConfig, messages: AgentLoopMessage[]): AsyncGenerator<string, void, void> {
    for await (const chunk of this.agentService.streamMessages(config.courseId as any, config.assignId as any, config.userId, messages)) {
      if (chunk) {
        yield chunk;
      }
    }
  }

  private async consumeParserState(
    config: AgentLoopRunConfig,
    state: ParserState,
    persistedEventCount: number,
  ): Promise<number> {
    while (true) {
      if (state.protocolErrorDetail) {
        return persistedEventCount;
      }

      if (state.activeTag === null) {
        const tagMatch = state.pendingText.match(/<(think|tool_call|final)>/);
        if (!tagMatch || tagMatch.index === undefined) {
          return persistedEventCount;
        }

        const prefix = state.pendingText.slice(0, tagMatch.index);
        if (prefix.trim()) {
          if (!state.sawToolCall) {
            this.appendPlainTextToFinal(config, state, prefix.trim());
            state.pendingText = state.pendingText.slice(tagMatch.index);
            return persistedEventCount;
          }
          state.protocolErrorDetail = `Unexpected text outside XML tag: ${prefix.trim().slice(0, 120)}`;
          return persistedEventCount;
        }

        state.activeTag = tagMatch[1] as AgentXmlTag;
        state.activeBuffer = '';
        state.activeTempEventIndex = null;
        state.pendingText = state.pendingText.slice(tagMatch.index + tagMatch[0].length);
        continue;
      }

      state.activeBuffer += state.pendingText;
      state.pendingText = '';
      const closingTag = `</${state.activeTag}>`;
      const closingIndex = state.activeBuffer.indexOf(closingTag);

      if (closingIndex === -1) {
        if (state.activeTag === 'think' || state.activeTag === 'final') {
          const partialContent = this.stripPartialClosingSuffix(state.activeBuffer, closingTag);
          state.activeTempEventIndex = this.upsertLocalTempTextEvent(
            config,
            state.activeTempEventIndex,
            state.activeTag === 'think' ? 'think' : 'final',
            partialContent,
          );
        }
        return persistedEventCount;
      }

      const finalizedContent = state.activeBuffer.slice(0, closingIndex);
      const remainder = state.activeBuffer.slice(closingIndex + closingTag.length);
      const activeTag = state.activeTag;
      const tempIndex = state.activeTempEventIndex;

      state.activeTag = null;
      state.activeBuffer = '';
      state.activeTempEventIndex = null;
      state.pendingText = remainder + state.pendingText;

      if (activeTag === 'think') {
        state.activeTempEventIndex = this.upsertLocalTempTextEvent(config, tempIndex, 'think', finalizedContent);
        const thinkEvent: MatrixAgentEventThink = {
          type: 'think',
          payload: { content: finalizedContent },
        };
        persistedEventCount = await this.persistBatch(config, persistedEventCount, [thinkEvent]);
      } else if (activeTag === 'final') {
        if (state.sawToolCall) {
          state.protocolErrorDetail = 'A response containing <tool_call> must not also contain <final>.';
          return persistedEventCount;
        }
        state.activeTempEventIndex = this.upsertLocalTempTextEvent(config, tempIndex, 'final', finalizedContent);
        state.finalClosedContent = finalizedContent;
      } else if (activeTag === 'tool_call') {
        state.sawToolCall = true;
        persistedEventCount = await this.handleToolCallBlock(config, finalizedContent, persistedEventCount, state);
      }
    }
  }

  private async finishParserState(
    config: AgentLoopRunConfig,
    state: ParserState,
    persistedEventCount: number,
  ): Promise<number> {
    if (state.protocolErrorDetail) {
      const trailingEvents: MatrixAgentEvent[] = [];
      if (state.finalClosedContent) {
        trailingEvents.push({
          type: 'final',
          payload: { content: state.finalClosedContent },
        });
        trailingEvents.push({
          type: 'turn_end',
          payload: {
            reason: 'client_error',
            detail: state.protocolErrorDetail,
          },
        });
      } else {
        trailingEvents.push({
          type: 'turn_end',
          payload: {
            reason: 'client_error',
            detail: state.protocolErrorDetail,
          },
        });
      }

      this.appendLocalEvents(config, trailingEvents);
      return this.persistBatch(config, persistedEventCount, trailingEvents);
    }

    if (state.activeTag !== null) {
      const salvageContent = this.stripPartialClosingSuffix(state.activeBuffer, `</${state.activeTag}>`).trim();
      if (state.activeTag === 'final' && salvageContent) {
        state.activeTempEventIndex = this.upsertLocalTempTextEvent(config, state.activeTempEventIndex, 'final', salvageContent);
        state.finalClosedContent = salvageContent;
      }

      const endEvent: MatrixAgentEventTurnEnd = {
        type: 'turn_end',
        payload: {
          reason: 'client_error',
          detail: `Unclosed <${state.activeTag}> block in model response.`,
        },
      };
      if (state.finalClosedContent) {
        this.appendLocalEvents(config, [endEvent]);
        return this.persistBatch(config, persistedEventCount, [
          { type: 'final', payload: { content: state.finalClosedContent } },
          endEvent,
        ]);
      }

      this.appendLocalEvents(config, [endEvent]);
      return this.persistBatch(config, persistedEventCount, [endEvent]);
    }

    if (state.pendingText.trim()) {
      if (!state.sawToolCall) {
        const salvageFinal = state.pendingText.trim();
        this.appendPlainTextToFinal(config, state, salvageFinal);
        const events: MatrixAgentEvent[] = [
          { type: 'final', payload: { content: state.finalClosedContent ?? salvageFinal } },
          { type: 'turn_end', payload: { reason: 'completed', detail: 'Model output contained plain text outside XML tags and was salvaged as final content.' } },
        ];
        return this.persistBatch(config, persistedEventCount, events);
      }

      const endEvent: MatrixAgentEventTurnEnd = {
        type: 'turn_end',
        payload: {
          reason: 'client_error',
          detail: 'Unexpected trailing text after tool execution response.',
        },
      };
      this.appendLocalEvents(config, [endEvent]);
      return this.persistBatch(config, persistedEventCount, [endEvent]);
    }

    return persistedEventCount;
  }

  private async handleToolCallBlock(
    config: AgentLoopRunConfig,
    blockContent: string,
    persistedEventCount: number,
    state: ParserState,
  ): Promise<number> {
    const parsed = this.parseToolCallPayload(blockContent);
    if (!parsed.ok) {
      state.toolFailureHappened = true;
      const toolResultEvent: MatrixAgentEventToolResult = {
        type: 'tool_result',
        payload: {
          callId: this.nextCallId(),
          success: false,
          output: parsed.detail,
        },
      };
      this.appendLocalEvents(config, [toolResultEvent]);
      return this.persistBatch(config, persistedEventCount, [toolResultEvent]);
    }

    const callId = this.nextCallId();
    const toolCallEvent: MatrixAgentEventToolCall = {
      type: 'tool_call',
      payload: {
        callId,
        toolName: parsed.toolName,
        input: parsed.input,
      },
    };

    this.appendLocalEvents(config, [toolCallEvent]);
    persistedEventCount = await this.persistBatch(config, persistedEventCount, [toolCallEvent]);

    const toolResult = await this.executeTool(config, parsed.toolName, parsed.input);
    if (!toolResult.success) {
      state.toolFailureHappened = true;
    }

    const toolResultEvent: MatrixAgentEventToolResult = {
      type: 'tool_result',
      payload: {
        callId,
        success: toolResult.success,
        output: toolResult.output,
      },
    };
    this.appendLocalEvents(config, [toolResultEvent]);
    return this.persistBatch(config, persistedEventCount, [toolResultEvent]);
  }

  private parseToolCallPayload(content: string): { ok: true; toolName: AgentLoopToolName; input: string[] } | { ok: false; detail: string } {
    try {
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, detail: 'tool_call JSON 必须是对象。' };
      }

      if (typeof parsed.toolName !== 'string' || !parsed.toolName.trim()) {
        return { ok: false, detail: 'tool_call JSON 缺少合法的 toolName。' };
      }

      if (!this.toolRegistry.has(parsed.toolName as AgentLoopToolName)) {
        return { ok: false, detail: `工具 ${String(parsed.toolName)} 未启用或未实现。` };
      }

      if (!Array.isArray(parsed.input) || !parsed.input.every((item: unknown) => typeof item === 'string')) {
        return { ok: false, detail: 'tool_call JSON 的 input 必须是 string[]。' };
      }

      return {
        ok: true,
        toolName: parsed.toolName as AgentLoopToolName,
        input: parsed.input,
      };
    } catch (error) {
      return {
        ok: false,
        detail: `tool_call JSON 解析失败，请重新输出合法 JSON。错误: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  private async executeTool(config: AgentLoopRunConfig, toolName: AgentLoopToolName, input: string[]): Promise<ToolExecutionResult> {
    const handler = this.toolRegistry.get(toolName);
    if (!handler) {
      return { success: false, output: `工具 ${toolName} 未启用或未实现。` };
    }
    return handler(config, input);
  }

  private nextCallId(): string {
    this.toolCallCounter += 1;
    return `call-${this.toolCallCounter}`;
  }

  private appendLocalEvents(config: AgentLoopRunConfig, events: MatrixAgentEvent[]): void {
    const conversation = config.getConversation();
    if (!conversation) return;
    config.setConversation(this.agentService.appendLocalEvents(conversation, events));
  }

  private appendLocalEventAndGetIndex(config: AgentLoopRunConfig, event: MatrixAgentEvent): number | null {
    const conversation = config.getConversation();
    if (!conversation) return null;
    const result = this.agentService.appendLocalEventAndGetIndex(conversation, event);
    config.setConversation(result.conversation);
    return result.index;
  }

  private replaceLocalEventAt(config: AgentLoopRunConfig, index: number, event: MatrixAgentEvent): void {
    const conversation = config.getConversation();
    if (!conversation) return;
    config.setConversation(this.agentService.replaceLocalEventAt(conversation, index, event));
  }

  private upsertLocalTempTextEvent(
    config: AgentLoopRunConfig,
    currentIndex: number | null,
    type: 'think' | 'final',
    content: string,
  ): number | null {
    const conversation = config.getConversation();
    if (!conversation) return null;
    const result = this.agentService.upsertLocalTempTextEvent(conversation, currentIndex, type, content);
    config.setConversation(result.conversation);
    return result.index;
  }

  private appendPlainTextToFinal(config: AgentLoopRunConfig, state: ParserState, text: string): void {
    const nextFinalContent = `${state.finalClosedContent ?? ''}${text}`;
    state.finalClosedContent = nextFinalContent;
    state.activeTempEventIndex = this.upsertLocalTempTextEvent(config, state.activeTempEventIndex, 'final', nextFinalContent);
  }

  private stripPartialClosingSuffix(content: string, closingTag: string): string {
    for (let overlap = Math.min(content.length, closingTag.length - 1); overlap > 0; overlap -= 1) {
      if (closingTag.startsWith(content.slice(-overlap))) {
        return content.slice(0, -overlap);
      }
    }
    return content;
  }

  private async persistBatch(
    config: AgentLoopRunConfig,
    expectedEventCount: number,
    events: MatrixAgentEvent[],
    fallbackConversation?: MatrixAgentConversation,
  ): Promise<number> {
    const statusCode = await firstValueFrom(this.agentService.appendEvents$(config.courseId as any, config.assignId as any, config.userId, {
      conversationId: config.getConversation()?.conversationId ?? fallbackConversation?.conversationId ?? '',
      expectedEventCount,
      events,
    }));

    if (!statusCode || statusCode < 200 || statusCode >= 300) {
      if (fallbackConversation) {
        config.setConversation(fallbackConversation);
      }
      throw new Error(`Persisting events failed with status ${statusCode ?? 'unknown'}.`);
    }

    return expectedEventCount + events.length;
  }
}
