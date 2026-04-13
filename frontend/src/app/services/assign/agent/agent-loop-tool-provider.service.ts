import { Injectable } from "@angular/core";
import { AgentLoopRunConfig } from "./agent-loop.service";
import { ToolExecutionResult } from "../../../api/type/agent-loop";

// 引入 zod 能自动检验，但还是算了
export type AgentLoopToolName =
  | 'read_editor'
  | 'read_selection'
  | 'read_problem_info'
  | 'read_problem_answer';


@Injectable({ providedIn: 'root' })
export class AgentLoopToolProvider {
  constructor() {
    const store = localStorage.getItem('agent_loop_enabled_tools');
    let enabledTools: AgentLoopToolName[] = [];
    if (store) {
      try {
        const parsed = JSON.parse(store) as AgentLoopToolName[];
        enabledTools = parsed.filter((tool): tool is AgentLoopToolName =>
          this.toolNames.includes(tool)
        );
      } catch {
        console.warn('Failed to parse enabled tools from localStorage, using default.');
      }
    } else {
      enabledTools = this.toolNames; // 默认全开
    }
    // 不然在 if 和 else 都设置也无法消除 构造函数未赋值的报错😅
    this._enabledTools = enabledTools;
    localStorage.setItem('agent_loop_enabled_tools', JSON.stringify(enabledTools));
  }

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
        : { success: false, output: 'No selection found.' };
    }],
    ['read_problem_info', async (config) => {
      if (!config.assignData) {
        return { success: false, output: 'Unable to read problem information.' };
      }

      const description = config.assignData.description?.trim() || 'No description.';
      return {
        success: true,
        output: `title: ${config.assignData.title}\n\ndescription:\n${description}`,
      };
    }],
    ['read_problem_answer', async (config) => {
      const resolution = config.analysis?.basic?.resolution;
      if (!resolution?.content?.length) {
        return { success: false, output: 'No available reference solution found.' };
      }

      const answerText = resolution.content
        .map((tab) => `# ${tab.title}\n${tab.content}`)
        .join('\n\n');

      return { success: true, output: answerText };
    }],
  ]);

  _enabledTools: AgentLoopToolName[];

  get toolNames(): AgentLoopToolName[] {
    return Array.from(this.toolRegistry.keys());
  }

  get enabledTools(): AgentLoopToolName[] {
    return this._enabledTools;
  }

  set enabledTools(tools: AgentLoopToolName[]) {
    this._enabledTools = tools;
    localStorage.setItem('agent_loop_enabled_tools', JSON.stringify(tools));
  }

  getHandler(toolName: AgentLoopToolName) {
    return this.toolRegistry.get(toolName);
  }

}