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

type ParserState = {
  _fullResponse: string;
  pendingText: string;
  activeTag: AgentXmlTag | null;
  activeBuffer: string;
  activeTempEventIndex: number | null;
  sawToolCall: boolean;
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

      const iteration = await this.emitSingleRun(config, currentConversation, persistedEventCount, enabledTools);
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
  private async emitSingleRun(
    config: AgentLoopRunConfig,
    conversation: MatrixAgentConversation,
    persistedEventCount: number,
    enabledTools: AgentLoopToolName[],
  ): Promise<{ kind: 'continue' | 'complete' | 'error_end'; persistedEventCount: number; toolFailureHappened: boolean }> {
    const parserState: ParserState = {
      _fullResponse: '',
      // 新的 chunk 来了但还没来得及消费到 activeBuffer 里的内容，先放在 pendingText 里
      pendingText: '',
      activeTag: null,
      // 当前 tag 内的内容 buffer
      activeBuffer: '',
      activeTempEventIndex: null,
      sawToolCall: false,
      protocolErrorDetail: null,
      toolFailureHappened: false,
    };

    const messages = this.buildModelMessages(conversation, enabledTools);

    for await (const chunk of this.agentService.streamMessages(config.courseId, config.assignId, config.userId, messages)) {
      parserState._fullResponse += chunk;
      parserState.pendingText += chunk;
      // 每次收到新内容都尝试消费一次 parser state
      persistedEventCount = await this.consumeParserState(config, parserState, persistedEventCount);
    }

    persistedEventCount = await this.finishRun(config, parserState, persistedEventCount);

    console.log('Model full output ', parserState._fullResponse);

    if (parserState.protocolErrorDetail) {
      return { kind: 'error_end', persistedEventCount, toolFailureHappened: parserState.toolFailureHappened };
    }

    if (parserState.sawToolCall) {
      return { kind: 'continue', persistedEventCount, toolFailureHappened: parserState.toolFailureHappened };
    }

    const turnEnd: MatrixAgentEventTurnEnd = {
      type: 'turn_end',
      payload: { reason: 'completed' },
    };
    this.agentService.appendLocalEvents(config.conversationSignal, [turnEnd]);

    persistedEventCount = await this.persistBatch(config, persistedEventCount, [turnEnd], conversation);
    return { kind: 'complete', persistedEventCount, toolFailureHappened: false };
  }

  // private async *streamModelMessages(config: AgentLoopRunConfig, messages: AgentLoopMessage[]): AsyncGenerator<string, void, void> {
  //   return yield* this.agentService.streamMessages(config.courseId as any, config.assignId as any, config.userId, messages);
  //   //   for await (const chunk of this.agentService.streamMessages(config.courseId as any, config.assignId as any, config.userId, messages)) {
  //   //     if (chunk) {
  //   //       yield chunk;
  //   //     }
  //   //   }
  // }

  /**
   * 流中消费
   * 每次收到模型输出的新内容时都尝试消费一次 parser state，来决定是否持久化事件、是否需要调用工具等
   */
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
        const tagMatch = state.pendingText.match(/<(think|tool_call|output)>/);
        if (!tagMatch || tagMatch.index === undefined) {
          return persistedEventCount;
        }

        const prefix = state.pendingText.slice(0, tagMatch.index);
        if (prefix.trim()) {
          this.appendPlainTextToOutput(config, state, prefix.trim());
          state.pendingText = state.pendingText.slice(tagMatch.index);
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

      // 未闭合
      if (closingIndex === -1) {
        // think 和 output 块流式更新
        if (state.activeTag === 'think' || state.activeTag === 'output') {
          const partialContent = this.stripPartialClosingSuffix(state.activeBuffer, closingTag);
          state.activeTempEventIndex = this.upsertLocalTempTextEvent(
            config,
            state.activeTempEventIndex,
            state.activeTag === 'think' ? 'think' : 'output',
            partialContent,
          );
        }
        return persistedEventCount;
      }

      // 执行标签相应逻辑
      const finalizedContent = state.activeBuffer.slice(0, closingIndex);
      const remainder = state.activeBuffer.slice(closingIndex + closingTag.length);
      const activeTag = state.activeTag;
      const tempIndex = state.activeTempEventIndex;

      state.activeTag = null;
      state.activeBuffer = '';
      state.activeTempEventIndex = null;
      state.pendingText = remainder + state.pendingText;

      // think 和 output 闭合后持久化，tool_call 则交给专门的 handler 调用与持久化
      if (activeTag === 'think') {
        state.activeTempEventIndex = this.upsertLocalTempTextEvent(config, tempIndex, 'think', finalizedContent);
        const thinkEvent: MatrixAgentEventThink = {
          type: 'think',
          payload: { content: finalizedContent },
        };
        persistedEventCount = await this.persistBatch(config, persistedEventCount, [thinkEvent]);
      } else if (activeTag === 'output') {
        state.activeTempEventIndex = this.upsertLocalTempTextEvent(config, tempIndex, 'output', finalizedContent);
        const outputEvent: MatrixAgentEventOutput = {
          type: 'output',
          payload: { content: finalizedContent },
        };
        persistedEventCount = await this.persistBatch(config, persistedEventCount, [outputEvent]);
      } else if (activeTag === 'tool_call') {
        state.sawToolCall = true;
        persistedEventCount = await this.handleToolCallBlock(config, finalizedContent, persistedEventCount, state);
      }
    }
  }

  /**
   * 流末收尾\
   * 主要处理 协议错误、未闭合标签、残留文本，并 append turn_end 事件
   */
  private async finishRun(
    config: AgentLoopRunConfig,
    state: ParserState,
    persistedEventCount: number,
  ): Promise<number> {
    if (state.protocolErrorDetail) {
      const endEvent: MatrixAgentEventTurnEnd = {
        type: 'turn_end',
        payload: {
          reason: 'client_error',
          detail: state.protocolErrorDetail,
        },
      };

      this.agentService.appendLocalEvents(config.conversationSignal, [endEvent]);
      return this.persistBatch(config, persistedEventCount, [endEvent]);
    }

    // 未闭合标签
    if (state.activeTag !== null) {
      const salvageContent = this.stripPartialClosingSuffix(state.activeBuffer, `</${state.activeTag}>`).trim();
      if (state.activeTag === 'output' && salvageContent) {
        state.activeTempEventIndex = this.upsertLocalTempTextEvent(config, state.activeTempEventIndex, 'output', salvageContent);
        const outputEvent: MatrixAgentEventOutput = {
          type: 'output',
          payload: { content: salvageContent },
        };
        persistedEventCount = await this.persistBatch(config, persistedEventCount, [outputEvent]);
      }

      const endEvent: MatrixAgentEventTurnEnd = {
        type: 'turn_end',
        payload: {
          reason: 'client_error',
          detail: `Unclosed <${state.activeTag}> block in model response.`,
        },
      };
      this.agentService.appendLocalEvents(config.conversationSignal, [endEvent]);
      return this.persistBatch(config, persistedEventCount, [endEvent]);
    }

    // 残留文本
    if (state.pendingText.trim()) {
      if (!state.sawToolCall) {
        const salvageOutput = state.pendingText.trim();
        this.appendPlainTextToOutput(config, state, salvageOutput);
        const outputEvent: MatrixAgentEventOutput = {
          type: 'output',
          payload: { content: salvageOutput },
        };
        persistedEventCount = await this.persistBatch(config, persistedEventCount, [outputEvent]);
        state.pendingText = '';
        return persistedEventCount;
      }

      // const endEvent: MatrixAgentEventTurnEnd = {
      //   type: 'turn_end',
      //   payload: {
      //     reason: 'client_error',
      //     detail: 'Unexpected trailing text after tool execution response.',
      //   },
      // };
      // this.agentService.appendLocalEvents(config.conversationSignal, [endEvent]);
      // return this.persistBatch(config, persistedEventCount, [endEvent]);
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
      state.protocolErrorDetail = parsed.detail;
      return persistedEventCount;
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

      // if (!Array.isArray(parsed.input) || !parsed.input.every((item: unknown) => typeof item === 'string')) {
      //   return { ok: false, detail: 'tool_call JSON 的 input 必须是 string[]。' };
      // }

      const input = Array.isArray(parsed.input) ? parsed.input.map(String) :
        parsed.input instanceof String ? parsed.input.split(',，') : null;

      if (!input) {
        return { ok: false, detail: 'tool_call JSON 的 input 必须是 string[] 或中/英文逗号分隔的单行字符串。' };
      }

      return {
        ok: true,
        toolName: parsed.toolName as AgentLoopToolName,
        input,
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
    type: 'think' | 'output',
    content: string,
  ): number | null {
    const conversation = config.conversationSignal();
    if (!conversation) return null;
    const result = this.agentService.upsertLocalTempTextEvent(conversation, currentIndex, type, content);
    config.conversationSignal.set(result.conversation);
    return result.index;
  }

  private appendPlainTextToOutput(config: AgentLoopRunConfig, state: ParserState, text: string): void {
    state.activeTempEventIndex = this.upsertLocalTempTextEvent(config, state.activeTempEventIndex, 'output', text);
  }

  private stripPartialClosingSuffix(content: string, closingTag: string): string {
    for (let overlap = Math.min(content.length, closingTag.length - 1); overlap > 0; overlap -= 1) {
      if (closingTag.startsWith(content.slice(-overlap))) {
        return content.slice(0, -overlap);
      }
    }
    return content;
  }

  /**
   * 请求持久化到后端，在错误时回滚\
   * TODO，应该重新请求后端，现在的 fallback 容易出错
   */
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
