import { inject, Injectable, WritableSignal } from "@angular/core";

import { Analysis, AssignData } from "../../../api/type/assigment";
import {
  MatrixAgentConversation,
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
  userMessage: string;
  conversationSignal: WritableSignal<MatrixAgentConversation | null | undefined>;
  assignData?: AssignData | undefined;
  analysis?: Analysis | undefined;
  enabledTools?: AgentLoopToolName[];
  getEditorContent: () => string;
  getSelectionContent: () => string | null;
};

type AgentXmlTag = 'think' | 'tool_call' | 'output';

type ToolExecutionResult = {
  success: boolean;
  output: string;
};

type LoopState = {
  _fullResponse: string;
  curTag: AgentXmlTag | null;
  pendingContent: string
};
const _initLoopState: LoopState = {
  _fullResponse: '',
  curTag: null,
  pendingContent: '',
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
   * 在开头加上 system prompt & 重组 event 回标准模型 message
   */
  buildModelMessages(conversation: MatrixAgentConversation, enabledTools: AgentLoopToolName[]): AgentLoopMessage[] {
    const messages: AgentLoopMessage[] = [
      {
        role: 'system',
        content: 'removed',
        // content: SYSTEM_PROMPT(this.toolProvider.enabledToolsPrompt),
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

  async emitAgentLoop(config: AgentLoopRunConfig): Promise<void> {
    const loopState: LoopState = _initLoopState;
    for (let step = 0; step < this.MAX_TURN_STEP; step++) {
      await this.emitOneLoop(config, loopState);
    }
  }

  async emitOneLoop(config: AgentLoopRunConfig, loopState: LoopState): Promise<void> {
    const conversation = config.conversationSignal();
    if (!conversation) {
      console.error('Conversation not found.');
      return;
    }

    this.agentService.appendLocalEvents(config.conversationSignal, [{ type: 'user_message', payload: { content: config.userMessage } }]);
    // 先 append 一个空的 output
    this.agentService.appendLocalEvents(config.conversationSignal, [{ type: 'output', payload: { content: "" } }]);

    const messages = this.buildModelMessages(conversation, config.enabledTools ?? Array.from(this.toolRegistry.keys()));

    for await (const chunk of this.agentService.streamMessages(config.courseId, config.assignId, config.userId, messages)) {
      loopState._fullResponse += chunk;
      loopState.pendingContent += chunk;

      // 直接吞掉 <output> 😡
      const startingTagMatch = loopState.pendingContent.replaceAll(/<\/?output>/g, '').match(/(.*)<(think|tool_call)>(.*)/);
      if (startingTagMatch) {
        const preContent = startingTagMatch[1];
        const tagName = startingTagMatch[2] as AgentXmlTag;
        const afterContent = startingTagMatch[3];

        if (preContent.trim()) {
          this.agentService.updateLastLocalEvent(config.conversationSignal, {
            type: 'output',
            payload: { content: preContent },
          });
        }

        if (tagName === 'think') {

        }
      }


    }

  }

  async consumePendingContent(config: AgentLoopRunConfig, loopState: LoopState): Promise<void> {
    // const toolCallMatch = loopState.pendingContent.match(/<tool_call>(.*?)<\/tool_call>/);
    // if (toolCallMatch) {
    //   try {
    //     const { toolName, input } = JSON.parse(toolCallMatch[1]) as { toolName: AgentLoopToolName; input: string[] };
    //   } catch (e) {
    //     if (e instanceof SyntaxError) {
    //       console.error('Failed to parse tool call JSON:', e);
    //       this.agentService.appendLocalEvents(config.conversationSignal, [{
    //         type: 'tool_result', payload: {
    //           callId: `tool-${this.toolCallCounter - 1}`,
    //           success: false,
    //           output: 'Bad JSON pattern in tool call, please check and try again.',
    //         }
    //       }])
    //     }

    //   }
    // }

    // const thinkMatch = loopState.pendingContent.match(/<think>/);
    // if (thinkMatch) {
    //   loopState.curTagStack.push('think');
    // }

    const tagMatch = loopState.pendingContent.match(/<(\/?)(think|tool_call)>(.*?)>/);




  }
}
