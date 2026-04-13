import { Injectable } from "@angular/core";
import { AgentLoopRunConfig } from "./agent-loop.service";
import { ToolExecutionResult } from "../../../api/type/agent-loop";

// 引入 zod 能自动检验，但还是算了
export type AgentLoopToolName =
  | 'get_tool_hint'
  | 'read_editor'
  | 'read_selection'
  | 'read_problem_info'
  | 'read_problem_answer'
  | 'write_editor'
  | 'write_editor_suggestion'
  | 'playground'
  | 'web_search'
  | 'web_read';
export type AgentLoopToolNameDisplay = Exclude<AgentLoopToolName, 'get_tool_hint' | 'read_selection' | 'write_editor_suggestion'>;



@Injectable({ providedIn: 'root' })
export class AgentLoopToolProvider {
  constructor() {
    const store = localStorage.getItem('agent_loop_enabled_tools');
    let enabledTools: AgentLoopToolNameDisplay[] = [];
    if (store) {
      try {
        const parsed = JSON.parse(store) as AgentLoopToolNameDisplay[];
        enabledTools = parsed.filter((tool): tool is AgentLoopToolNameDisplay =>
          this.availableToolNames.includes(tool)
        );
      } catch {
        console.warn('Failed to parse enabled tools from localStorage, using default.');
      }
    } else {
      enabledTools = this.availableToolsDisplay; // 默认全开
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
    ['get_tool_hint', async (_, input) => {
      const [toolName] = input;
      if (!toolName) {
        return { success: true, output: 'All possible tools: ' + this.enabledToolsDisplay.map(name => `${name} (${this.toolHinters[name]})`).join(', ') };
      }
      if (!this.availableToolNames.includes(toolName as AgentLoopToolName))
        return { success: false, output: 'Tool not enabled or not found for get_tool_hint.' };
      const hint = this.toolHinters[toolName as AgentLoopToolName];
      return { success: !!hint, output: hint || 'Tool hint not found.' };
    }],
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
    // schema: write(target: 'full-editor' | 'range', content: string, startLine?: number, startColumn?: number, endLine?: number, endColumn?: number)
    ['write_editor', async (config, input) => {
      const [target, content, ...position] = input;
      if (target === 'full-editor') {
        if (!content) {
          return { success: false, output: 'Erasing entire editor content is not allowed.' };
        }
        config.writeEditorContent({ target, language: '', text: content, tabTitle: '' });
      }
      else if (target === 'range') {
        const [startLineNumber, startColumn, endLineNumber, endColumn] = position.map(Number);
        if (!startLineNumber || !startColumn || !endLineNumber || !endColumn) {
          return { success: false, output: 'Invalid or missing position parameters for range write.' };
        }
        config.writeEditorContent({ target, language: '', text: content, tabTitle: '', range: { startLineNumber, startColumn, endLineNumber, endColumn } });
      }
      else {
        return { success: false, output: 'Invalid target for write_editor tool. Must be "full-editor" or "range".' };
      }
      return { success: true, output: 'Content written to editor successfully.' };
    }]
  ]);

  private readonly toolHinters: Record<AgentLoopToolName, string> = {
    get_tool_hint: '获取工具使用提示，输入参数为工具名可以获取指定工具的提示，不输入参数可以获取所有启用工具的提示',
    read_editor: '读取编辑器全文内容',
    read_selection: '读取编辑器选中内容',
    read_problem_info: '读取题目信息',
    read_problem_answer: '读取题目答案',
    write_editor: '在指定的位置写入编辑器内容，格式：write_editor(target: \'full- editor\' | \'range\', content: string, startLine?: number, startColumn?: number, endLine?: number, endColumn?: number)，例如使用 write_editor(\'range\', \'new content\', 10, 1, 12, 1) 可以替换第10行第1列到第12行第1列的内容为 new content',
    write_editor_suggestion: '提供编辑器内容修改建议，但不直接修改，格式同 write_editor',
    playground: '暂未实现',
    web_search: '暂未实现',
    web_read: '暂未实现',
  };


  _enabledTools: AgentLoopToolNameDisplay[];

  /**
   * available 是定义的所有工具
   */
  get availableToolNames(): AgentLoopToolName[] {
    return Array.from(this.toolRegistry.keys());
  }

  get availableToolsDisplay(): AgentLoopToolNameDisplay[] {
    // 究极耦合😅😅😅
    return this.availableToolNames.filter(name => name !== 'get_tool_hint' && name !== 'read_selection' && name !== 'write_editor_suggestion') as AgentLoopToolNameDisplay[];
  }

  /**
   * 面向前端的工具列表，折叠了被合并管理的工具
   * enabled 是启用的工具
   */
  get enabledToolsDisplay(): AgentLoopToolNameDisplay[] {
    return this._enabledTools;
  }

  get enabledTools(): AgentLoopToolName[] {
    const enabledTools: AgentLoopToolName[] = this._enabledTools;
    if (enabledTools.includes('read_editor')) enabledTools.push('read_selection');
    if (enabledTools.includes('write_editor')) enabledTools.push('write_editor_suggestion');
    return enabledTools;
  }

  set enabledToolsDisplay(tools: AgentLoopToolNameDisplay[]) {
    this._enabledTools = tools;
    localStorage.setItem('agent_loop_enabled_tools', JSON.stringify(tools));
  }

  getHandler(toolName: AgentLoopToolName) {
    return this.toolRegistry.get(toolName);
  }

}