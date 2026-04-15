import { Injectable } from "@angular/core";
import { AgentLoopRunConfig } from "./agent-loop.service";
import { ToolExecutionResult } from "../../../api/type/agent-loop";
import { CodeFileInfo } from "../../../api/type/assigment";

// 引入 zod 能自动检验，但还是算了
export type AgentLoopToolName =
  | 'change_title'
  | 'get_tool_hint'
  | 'read_editor'
  | 'read_selection'
  | 'read_problem_info'
  | 'read_problem_answer'
  | 'write_editor'
  // | 'write_editor_suggestion'
  | 'playground'
  | 'web_search'
  | 'web_read';
export type AgentLoopToolNameDisplay = Exclude<AgentLoopToolName, 'get_tool_hint' | 'read_selection' | 'write_editor_suggestion'>;

type AgentLoopToolDefinition = {
  // label: string;
  hint: string;
  showInDisplay: boolean;
  toggleable: boolean;
  implemented: boolean;
  mappedTools?: AgentLoopToolName[];
};

export type AgentLoopToolMenuItem = {
  name: AgentLoopToolNameDisplay;
  hint: string;
  toggleable: boolean;
  implemented: boolean;
};



@Injectable({ providedIn: 'root' })
export class AgentLoopToolProvider {
  /**
   * 定义层：统一描述工具的展示、提示、可切换性与映射关系
   */
  private readonly toolDefinitions: Record<AgentLoopToolName, AgentLoopToolDefinition> = {
    change_title: {
      hint: '修改当前对话标题，格式：change_title(newTitle: string)',
      showInDisplay: false,
      toggleable: false,
      implemented: true,
    },
    get_tool_hint: {
      hint: '获取工具使用提示，输入参数为工具名可以获取指定工具的提示，不输入参数可以获取所有启用工具的提示',
      showInDisplay: false,
      toggleable: false,
      implemented: true,
    },
    read_editor: {
      hint: '读取编辑器全文内容',
      showInDisplay: true,
      toggleable: true,
      implemented: true,
      mappedTools: ['read_selection'],
    },
    read_selection: {
      hint: '读取编辑器选中内容',
      showInDisplay: false,
      toggleable: false,
      implemented: true,
    },
    read_problem_info: {
      hint: '读取题目信息',
      showInDisplay: true,
      toggleable: true,
      implemented: true,
    },
    read_problem_answer: {
      hint: '读取题目答案',
      showInDisplay: true,
      toggleable: true,
      implemented: true,
    },
    write_editor: {
      hint: '在指定的位置写入编辑器内容，格式：write_editor(target: \'full-editor\' | \'range\', content: string, startLine?: number, startColumn?: number, endLine?: number, endColumn?: number)',
      showInDisplay: true,
      toggleable: true,
      implemented: true,
      // mappedTools: ['write_editor_suggestion'],
    },
    // write_editor_suggestion: {
    //   hint: '提供编辑器内容修改建议，但不直接修改，格式同 write_editor',
    //   showInDisplay: false,
    //   toggleable: false,
    //   implemented: false,
    // },
    playground: {
      hint: '调用沙箱测试运行代码并获得执行结果。格式：playground(input: string, shortCode?: string)',
      showInDisplay: true,
      toggleable: true,
      implemented: true,
    },
    web_search: {
      hint: '暂未实现',
      showInDisplay: true,
      toggleable: false,
      implemented: false,
    },
    web_read: {
      hint: '暂未实现',
      showInDisplay: true,
      toggleable: false,
      implemented: false,
    },
  };

  constructor() {
    const store = localStorage.getItem('agent_loop_enabled_tools');
    let enabledTools = this.defaultEnabledToolsDisplay();
    if (store) {
      try {
        const parsed = JSON.parse(store) as AgentLoopToolNameDisplay[];
        enabledTools = this.normalizeEnabledDisplayTools(parsed);
      } catch {
        console.warn('Failed to parse enabled tools from localStorage, using default.');
      }
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
    ['change_title', async (config, input) => {
      const [newTitle] = input;
      if (!newTitle) {
        return { success: false, output: 'New title is required for change_title tool.' };
      }
      config.updateConversationTitle(newTitle);
      return { success: true, output: `Title changed to "${newTitle}"` };
    }],
    ['get_tool_hint', async (_, input) => {
      const [toolName] = input;
      if (!toolName) {
        return {
          success: true,
          output: 'All possible tools: ' + this.toolMenuItems.map((item) => `${item.name} (${item.hint})`).join(', '),
        };
      }
      if (!this.availableToolNames.includes(toolName as AgentLoopToolName))
        return { success: false, output: 'Tool not enabled or not found for get_tool_hint.' };
      const hint = this.toolDefinitions[toolName as AgentLoopToolName]?.hint;
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
        config.writeEditorContent({ target, text: content, range: undefined });
      }
      else if (target === 'range') {
        const [startLineNumber, startColumn, endLineNumber, endColumn] = position.map(Number);
        if (!startLineNumber || !startColumn || !endLineNumber || !endColumn) {
          return { success: false, output: 'Invalid or missing position parameters for range write.' };
        }
        config.writeEditorContent({ target, text: content, range: { startLineNumber, startColumn, endLineNumber, endColumn } });
      }
      else {
        return { success: false, output: 'Invalid target for write_editor tool. Must be "full-editor" or "range".' };
      }
      return { success: true, output: 'Content written to editor successfully.' };
    }],
    ['playground', async (config, _input) => {
      const [input = '', shortCode] = _input;
      let codeInfo: CodeFileInfo;
      // if (shortCode) {
      //   codeInfo = { fileName: 'short_code.cpp', content: shortCode };
      // } else {
      //   codeInfo = config.getModels()
      // }
      codeInfo = { fileName: 'short_code.cpp', content: shortCode ?? config.getEditorContent() };
      const result = await config.playground(input, codeInfo);
      if (result === undefined) {
        return { success: false, output: `Playground execution failed, could be server or network error.` };
      }
      return { success: true, output: result };
    }]
  ]);

  get enabledToolsPrompt(): string {
    if (this.enabledTools.length === 0) {
      return 'No tools enabled currently.';
    }
    return 'Enabled tools: ' + this.enabledTools.map((name) => `${name}: ${this.toolDefinitions[name].hint}`).join(', ');
  }

  _enabledTools: AgentLoopToolNameDisplay[];

  /**
   * available 是定义的所有工具
   */
  get availableToolNames(): AgentLoopToolName[] {
    // return Array.from(this.toolRegistry.keys());
    return Object.keys(this.toolDefinitions) as AgentLoopToolName[];
  }

  get availableToolsDisplay(): AgentLoopToolNameDisplay[] {    // 究极耦合😅😅😅
    // 究极耦合😅😅😅
    return this.availableToolNames.filter((name): name is AgentLoopToolNameDisplay => this.toolDefinitions[name].showInDisplay);
  }

  get toolMenuItems(): AgentLoopToolMenuItem[] {
    return this.availableToolsDisplay.map((name) => {
      const def = this.toolDefinitions[name];
      return {
        name,
        hint: def.hint,
        toggleable: def.toggleable && def.implemented,
        implemented: def.implemented,
      };
    });
  }

  isToolToggleable(toolName: AgentLoopToolNameDisplay): boolean {
    const def = this.toolDefinitions[toolName];
    return def.toggleable && def.implemented;
  }

  expandEnabledTools(enabledDisplayTools: AgentLoopToolNameDisplay[]): AgentLoopToolName[] {
    const expandedTools = new Set<AgentLoopToolName>();

    Object.entries(this.toolDefinitions)
      .filter(([_, def]) => !def.showInDisplay)
      .map(([name]) => name as AgentLoopToolName)
      .forEach((toolName) => {
        expandedTools.add(toolName);
      });
    // 炫技失败😅😅😅
    // |> expandedTools.add()

    for (const toolName of this.normalizeEnabledDisplayTools(enabledDisplayTools)) {
      expandedTools.add(toolName);
      for (const mappedTool of this.toolDefinitions[toolName].mappedTools ?? []) {
        expandedTools.add(mappedTool);
      }
    }

    return Array.from(expandedTools);
  }

  /**
   * 面向前端的工具列表，折叠了被合并管理的工具
   * enabled 是启用的工具
   */
  get enabledToolsDisplay(): AgentLoopToolNameDisplay[] {
    return [...this._enabledTools];
  }

  get enabledTools(): AgentLoopToolName[] {
    return this.expandEnabledTools(this._enabledTools);
  }

  set enabledToolsDisplay(tools: AgentLoopToolNameDisplay[]) {
    this._enabledTools = this.normalizeEnabledDisplayTools(tools);
    localStorage.setItem('agent_loop_enabled_tools', JSON.stringify(this._enabledTools));
  }

  getHandler(toolName: AgentLoopToolName) {
    return this.toolRegistry.get(toolName);
  }

  private defaultEnabledToolsDisplay(): AgentLoopToolNameDisplay[] {
    return this.availableToolsDisplay.filter((toolName) => this.isToolToggleable(toolName));
  }

  private normalizeEnabledDisplayTools(tools: AgentLoopToolNameDisplay[]): AgentLoopToolNameDisplay[] {
    const toolSet = new Set(tools);
    return this.availableToolsDisplay.filter((toolName) => this.isToolToggleable(toolName) && toolSet.has(toolName));
  }

}