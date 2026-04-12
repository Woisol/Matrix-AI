import { inject, Injectable, WritableSignal } from "@angular/core";
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
  conversationSignal: WritableSignal<MatrixAgentConversation | null | undefined>;
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
   * agent loop 核心入口方法
   * @param config 运行配置，包含必要的上下文获取函数和事件管理函数
   *
   */
  async runUserTurn(config: AgentLoopRunConfig): Promise<void> {
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
    persistedEventCount = await this.persistBatch(config, persistedEventCount, [userEvent], originalConversation);

    let turnStep = 0;
    let toolRetryCount = 0;

    while (turnStep < this.MAX_TURN_STEP) {
      turnStep += 1;
      const currentConversation = config.conversationSignal();
      if (!currentConversation) {
        console.error('Conversation not found. Aborting agent loop.');
        return;
      }

      const iteration = await this.runSingleResponse(config, currentConversation, persistedEventCount, enabledTools);
      persistedEventCount = iteration.persistedEventCount;

      if (iteration.kind === 'complete' || iteration.kind === 'error_end') {
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
    this.agentService.appendLocalEvents(config.conversationSignal, [turnEnd]);
    await this.persistBatch(config, persistedEventCount, [turnEnd], originalConversation);
  }

  //** 单次循环逻辑
  private async runSingleResponse(
    config: AgentLoopRunConfig,
    conversation: MatrixAgentConversation,
    persistedEventCount: number,
    enabledTools: AgentLoopToolName[],
  ): Promise<{ kind: 'continue' | 'complete' | 'error_end'; persistedEventCount: number; toolFailureHappened: boolean }> {
    const parserState: ParserState = {
      pendingText: '',
      activeTag: null,
      // 当前 tag 内的内容 buffer
      activeBuffer: '',
      activeTempEventIndex: null,
      sawToolCall: false,
      finalClosedContent: null,
      protocolErrorDetail: null,
      toolFailureHappened: false,
    };

    const messages = this.buildModelMessages(conversation, enabledTools);

    for await (const chunk of this.agentService.streamMessages(config.courseId, config.assignId, config.userId, messages)) {
      parserState.pendingText += chunk;
      // 每次收到新内容都尝试消费一次 parser state
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
      this.agentService.appendLocalEvents(config.conversationSignal, [turnEnd]);
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
    this.agentService.appendLocalEvents(config.conversationSignal, [missingFinalEnd]);
    persistedEventCount = await this.persistBatch(config, persistedEventCount, [missingFinalEnd], conversation);
    return { kind: 'error_end', persistedEventCount, toolFailureHappened: false };
  }

  // private async *streamModelMessages(config: AgentLoopRunConfig, messages: AgentLoopMessage[]): AsyncGenerator<string, void, void> {
  //   return yield* this.agentService.streamMessages(config.courseId as any, config.assignId as any, config.userId, messages);
  //   //   for await (const chunk of this.agentService.streamMessages(config.courseId as any, config.assignId as any, config.userId, messages)) {
  //   //     if (chunk) {
  //   //       yield chunk;
  //   //     }
  //   //   }
  // }

  private async consumeParserState(
    config: AgentLoopRunConfig,
    state: ParserState,
    persistedEventCount: number,
  ): Promise<number> {
    while (true) {
      if (state.protocolErrorDetail) {
        return persistedEventCount;
      }

      // 匹配 XML 开始
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

      // 如果已有 xml 标签
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

      // 如果已有 xml 标签
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

      this.agentService.appendLocalEvents(config.conversationSignal, trailingEvents);
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
        this.agentService.appendLocalEvents(config.conversationSignal, [endEvent]);
        return this.persistBatch(config, persistedEventCount, [
          { type: 'final', payload: { content: state.finalClosedContent } },
          endEvent,
        ]);
      }

      this.agentService.appendLocalEvents(config.conversationSignal, [endEvent]);
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
      this.agentService.appendLocalEvents(config.conversationSignal, [endEvent]);
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
      this.agentService.appendLocalEvents(config.conversationSignal, [toolResultEvent]);
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

    this.agentService.appendLocalEvents(config.conversationSignal, [toolCallEvent]);
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
    this.agentService.appendLocalEvents(config.conversationSignal, [toolResultEvent]);
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

  //~~ localEvent 操作 已经完整迁移到 agent.service

  private upsertLocalTempTextEvent(
    config: AgentLoopRunConfig,
    currentIndex: number | null,
    type: 'think' | 'final',
    content: string,
  ): number | null {
    const conversation = config.conversationSignal();
    if (!conversation) return null;
    const result = this.agentService.upsertLocalTempTextEvent(conversation, currentIndex, type, content);
    config.conversationSignal.set(result.conversation);
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
      conversationId: config.conversationSignal()?.conversationId ?? fallbackConversation?.conversationId ?? '',
      expectedEventCount,
      events,
    }));

    if (!statusCode || statusCode < 200 || statusCode >= 300) {
      if (fallbackConversation) {
        config.conversationSignal.set(fallbackConversation);
      }
      throw new Error(`Persisting events failed with status ${statusCode ?? 'unknown'}.`);
    }

    return expectedEventCount + events.length;
  }
}
