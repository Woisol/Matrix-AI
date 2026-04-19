# Matrix Agent Tab 迁移说明

本文档总结当前仓库里已经落地的 `Agent` tab 实现，目标是在另一个更复杂的项目里复现同样的能力，而不依赖这次对话上下文。

这份文档基于当前代码真实实现，不是只根据设计稿整理。为了保证迁移时能真正跑起来，下面会同时覆盖：

- 前端 UI 结构
- 事件流和状态流
- agent loop 运行时
- 工具系统
- `show in editor` 复用点
- checkpoint / 回滚
- BYOK
- 后端接口与持久化契约
- 当前实现里已经存在、迁移时最好一并注意的边界条件

本次 `Agent` tab 不是完全独立的新功能，它复用了那套编辑器 patch 渲染、范围定位、`executeEdits`、选区计算和 undo 安全同步逻辑。

## 1. 功能目标

当前 `Agent` tab 最终提供的是一整套“前端主导的 agent loop + 对话持久化 + 编辑器写入/回滚”能力，而不是单纯的聊天窗口。

完整能力包括：

1. 在作业页左侧增加一个新的 `Agent` tab，与 `AI 分析` 并列。
2. 顶部显示“历史对话”下拉，支持：
   - 新建对话
   - 选择历史对话
   - 重命名
   - 删除
3. 对话内容按时间线渲染，但展示层不是逐 event 平铺，而是按“用户一轮 / agent 一轮”分组。
4. agent 一轮内支持同时显示：
   - `think`
   - `tool_call`
   - `tool_result`
   - `output`
   - `turn_end`
5. agent 输出里的代码块支持复用 `show in editor`：
   - 范围替换
   - 整篇替换
   - 点击范围标签聚焦编辑器
   - 点击按钮应用到编辑器
6. `write_editor` 工具会在真正写入前自动创建 checkpoint。
7. 成功的 `write_editor` 卡片上会出现“回滚这次写入”的入口。
8. 还支持“回滚整段会话到某条用户消息之前”，必要时同步把编辑器恢复到对应 checkpoint。
9. 工具菜单支持开关，配置持久化到 `localStorage`。
10. BYOK 支持把模型流式请求直连到用户自己的 API。
11. 当前会话可以导出为 `.txt` / `.md` 预览和下载。

## 2. 入口与展示条件

`Agent` tab 不是总显示。当前页面逻辑是：

- 必须存在提交记录：`assignData?.submit`
- 并且 `ddlGrant() === true`
- `ddlGrant()` 的定义是：
  - 没有 ddl，允许显示
  - 有 ddl 且已经到期，允许显示
  - 有 ddl 但尚未到期，不显示

也就是说，当前行为是“提交后且允许查看分析时”才开放 `AI 分析` 和 `Agent` 两个 tab。

对应代码在：

- `frontend/src/app/pages/assignment/components/course-info-tab.component.ts`

## 3. 迁移前置依赖

如果目标项目已经按旧文档迁好了 `show in editor`，这里可以复用已有实现；否则必须同时带上下面这些底座：

1. `MatrixAnalysisEditorRange`
2. `MatrixAnalysisEditRequest`
3. `CodeApplyableMarkdownComponent` 或等价组件
4. `analysis-editor.utils.ts` 里的这三个 helper
   - `validateMatrixAnalysisRange`
   - `buildEditedSelectionRange`
   - `getFullEditorRange`
5. 页面级 Monaco 编辑器实例
6. 通过 `executeEdits + pushUndoStop` 写入编辑器，而不是 `setValue`
7. `code-editor.component.ts` 里“外部同步内容前先比较当前值”的 undo 保护逻辑

这几个文件分别在：

- `frontend/src/app/pages/assignment/components/code-applyable-markdown.component.ts`
- `frontend/src/app/pages/assignment/analysis-editor.utils.ts`
- `frontend/src/app/pages/assignment/components/code-editor.component.ts`

## 4. 必迁文件清单

### 4.1 前端必需

- `frontend/src/app/pages/assignment/assigment.component.ts`
- `frontend/src/app/pages/assignment/components/course-info-tab.component.ts`
- `frontend/src/app/pages/assignment/components/agent/chat-bubble.component.ts`
- `frontend/src/app/pages/assignment/components/code-applyable-markdown.component.ts`
- `frontend/src/app/pages/assignment/analysis-editor.utils.ts`
- `frontend/src/app/pages/assignment/components/code-editor.component.ts`
- `frontend/src/app/services/assign/agent/agent.service.ts`
- `frontend/src/app/services/assign/agent/agent-stream.service.ts`
- `frontend/src/app/services/assign/agent/agent-loop.service.ts`
- `frontend/src/app/services/assign/agent/agent-loop-tool-provider.service.ts`
- `frontend/src/app/services/assign/agent/agent-loop-pass-parser.ts`
- `frontend/src/app/services/assign/agent/agent-loop-persist-cursor.ts`
- `frontend/src/app/services/assign/agent/agent-loop-tail-projector.ts`
- `frontend/src/app/services/assign/agent/agent.constant.ts`
- `frontend/src/app/api/type/agent.d.ts`
- `frontend/src/app/api/type/agent-loop.d.ts`
- `frontend/src/app/api/util/export.ts`

### 4.2 后端必需

- `backend/app/routers/agent.py`
- `backend/app/controller/agent.py`
- `backend/app/models/agent.py`
- `backend/app/schemas/agent.py`

### 4.3 测试建议一起迁

- `frontend/src/app/pages/assignment/components/course-info-tab.component.spec.ts`
- `frontend/src/app/pages/assignment/components/agent/chat-bubble.component.spec.ts`
- `frontend/src/app/pages/assignment/assigment.component.spec.ts`
- `frontend/src/app/services/assign/agent/agent.service.spec.ts`
- `frontend/src/app/services/assign/agent/agent-loop.service.spec.ts`
- `frontend/src/app/services/assign/agent/agent-loop-tool-provider.service.spec.ts`
- `frontend/src/app/services/assign/agent/agent-loop-pass-parser.spec.ts`
- `frontend/src/app/pages/assignment/analysis-editor.utils.spec.ts`
- `frontend/src/app/pages/assignment/components/code-editor.component.spec.ts`
- `backend/tests/test_agent.py`

## 5. Angular / 前端依赖

当前实现是 Angular standalone component 风格。如果目标项目仍是 Angular，但不是 standalone，也可以照搬逻辑后改成模块式注册。

当前 `Agent` tab 相关依赖包括：

- `ngx-markdown`
- `ng-zorro-antd/tabs`
- `ng-zorro-antd/dropdown`
- `ng-zorro-antd/menu`
- `ng-zorro-antd/checkbox`
- `ng-zorro-antd/modal`
- `ng-zorro-antd/input`
- `ng-zorro-antd/form`
- `ng-zorro-antd/icon`
- `ng-zorro-antd/tooltip`
- `ng-zorro-antd/splitter`
- `@angular/cdk/text-field`
- `@angular/forms`
- `monaco-editor`
- `ngx-monaco-editor-v2`

如果目标项目的 UI 库不是 ng-zorro，需要保留的不是组件名本身，而是这些行为：

- dropdown 可点击且可禁用自动关闭
- modal 支持确认回调
- tooltip 可挂在图标和行内元素上
- textarea 可自动伸缩
- tabs 内容区支持撑满高度

## 6. 核心数据结构

### 6.1 Conversation / Event 类型

位置：

- `frontend/src/app/api/type/agent.d.ts`

关键定义如下：

```ts
export type ConversationId = string;
export type CheckpointId = string;

export type MatrixAgentConversationSummary = {
  conversationId: ConversationId;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type MatrixAgentConversation = MatrixAgentConversationSummary & {
  events: MatrixAgentEvent[];
};

export type MatrixAgentToolResultOutputObject = {
  message?: string;
  checkpointId?: CheckpointId;
};

export type MatrixAgentToolResultOutput = string | MatrixAgentToolResultOutputObject;

export type MatrixAgentEvent =
  | { type: 'user_message'; payload: { content: string } }
  | { type: 'think'; payload: { content: string } }
  | { type: 'tool_call'; payload: { callId: string; toolName: string; input: string[] } }
  | { type: 'tool_result'; payload: { callId: string; success: boolean; output?: MatrixAgentToolResultOutput } }
  | { type: 'output'; payload: { content: string } }
  | { type: 'turn_end'; payload: { reason: MatrixAgentEventTurnEndReason; detail?: string } };
```

这里最重要的是：

1. `events` 是完整持久化历史，不是临时渲染状态。
2. `tool_call` 和 `tool_result` 通过 `callId` 配对。
3. `tool_result.payload.output` 不一定是字符串，也可能带 `checkpointId`。
4. 这正是“卡片级回滚按钮”能工作的基础。

### 6.2 Agent Loop 运行配置

位置：

- `frontend/src/app/api/type/agent-loop.d.ts`

关键结构：

```ts
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
  updateConversationTitle: (title: string) => void;
  getEditorContent: () => string;
  getSelectionContent: () => string | null;
  writeEditorContent: (
    request: Pick<MatrixAnalysisEditRequest, 'target' | 'text' | 'range'>
  ) => Promise<MatrixAgentToolResultOutput>;
  playground: (input: string, codeInfo: CodeFileInfo, language?: CodeLanguage) => Promise<string>;
  enabledTools?: AgentLoopToolName[];
};
```

迁移时必须保留这些 callback 边界，因为当前实现是“前端 loop + 页面注入能力”的模型，不是后端一体化 agent。

## 7. 页面组件职责拆分

当前实现建议按这四层迁移。

### 7.1 `AssignmentComponent`

位置：

- `frontend/src/app/pages/assignment/assigment.component.ts`

职责：

- 持有当前 conversation、conversation history、Monaco editor、analysis、assignData
- 负责把 `course-info-tab` 的各种输出真正接到业务上
- 负责：
  - 创建 / 加载 / 删除 / 重命名对话
  - 启动 agent loop
  - 编辑器写入
  - checkpoint 创建
  - checkpoint 恢复
  - 会话 rewind
  - BYOK 状态同步

最关键的模板绑定：

```ts
<course-info-tab
  [conversationHistory]="conversationsHistory()"
  [currentConversation]="currentConversationInfo()"
  [agentToolMenuItems]="agentToolMenuItems"
  [enabledAgentTools]="enabledAgentTools()"
  [agentLoopRunning]="agentLoopRunning()"
  [byokConfig]="byokConfig()"
  (createNewConversation)="createAgentConversation()"
  (loadConversationInfo)="loadAgentConversationInfo($event)"
  (patchConversationTitle)="updateConversationTitle($event.conversationId, $event.title)"
  (deleteConversation)="deleteConversation($event)"
  (pushNewAgentEvent)="pushNewAgentEvent($event)"
  (toggleAgentTool)="toggleAgentTool($event)"
  (saveByokConfig)="handleSaveByokConfig($event)"
  (clearByokConfig)="handleClearByokConfig()"
  (refreshByokConfig)="refreshByokConfig()"
  (applyAnalysisEdit)="handleAnalysisEditRequest($event)"
  (focusRequestRangeOnEditor)="focusRequestRangeOnEditor($event)"
  (rewindConversationRequest)="handleRewindConversationRequest($event)"
  (rewindWriteRequest)="hanldeRewindWriteRequest($event)"
/>
```

### 7.2 `CourseInfoTabComponent`

位置：

- `frontend/src/app/pages/assignment/components/course-info-tab.component.ts`

职责：

- 只负责左侧 tab UI 和中间态交互
- 不持有真正的对话/编辑器业务逻辑
- 负责把 `currentConversation.events` 转成展示所需的 `_displayEvents`
- 负责用户输入区、工具菜单、BYOK 表单、导出预览 modal

这里最关键的不是模板，而是把 event 流分组为 UI 批次的函数：

```ts
private _splitEventsForDisplay(events: MatrixAgentEvent[]): DisplayEvent[] {
  const resDisplayEvents: DisplayEvent[] = [];
  let currentDisplayEvents: DisplayEvent | null = null;

  events.forEach((event, eventIndex) => {
    if (event.type === 'user_message') {
      if (currentDisplayEvents) {
        resDisplayEvents.push(currentDisplayEvents);
      }
      currentDisplayEvents = { type: 'user', sourceStartIndex: eventIndex, events: [event] };
    } else {
      if (!currentDisplayEvents || currentDisplayEvents.type === 'user') {
        if (currentDisplayEvents) {
          resDisplayEvents.push(currentDisplayEvents);
        }
        currentDisplayEvents = { type: 'agent', sourceStartIndex: eventIndex, events: [event] };
      } else {
        currentDisplayEvents.events.push(event);
      }
    }
  });

  if (currentDisplayEvents) {
    resDisplayEvents.push(currentDisplayEvents);
  }

  return resDisplayEvents;
}
```

这个分组是整个 UI 看起来像“一轮轮对话”的关键。

### 7.3 `AgentChatBubbleComponent` / `AgentAssistantMessageComponent`

位置：

- `frontend/src/app/pages/assignment/components/agent/chat-bubble.component.ts`

职责：

- 用户消息：右侧气泡
- agent 消息：左侧复合卡片
- 在 assistant 卡片里合并：
  - 连续 `think`
  - `tool_call + tool_result`
  - `output`
  - `turn_end`

最重要的 derived state 是：

```ts
toolResultsByCallId = new Map<string, MatrixAgentEventToolResult>();
orphanToolResultIndexes = new Set<number>();

private rebuildDerivedState(events: Exclude<MatrixAgentEvent, MatrixAgentEventUserMessage>[]): void {
  this.toolResultsByCallId = new Map<string, MatrixAgentEventToolResult>();
  this.orphanToolResultIndexes = new Set<number>();

  const seenToolCallIds = new Set<string>();
  events.forEach((event, index) => {
    if (event.type === 'tool_call') {
      seenToolCallIds.add(event.payload.callId);
      return;
    }

    if (event.type !== 'tool_result') return;

    if (seenToolCallIds.has(event.payload.callId) && !this.toolResultsByCallId.has(event.payload.callId)) {
      this.toolResultsByCallId.set(event.payload.callId, event);
      return;
    }

    this.orphanToolResultIndexes.add(index);
  });
}
```

没有这层映射，工具卡片就只能“调用事件”和“结果事件”分开渲染，交互会很碎。

### 7.4 `CodeApplyableMarkdownComponent`

位置：

- `frontend/src/app/pages/assignment/components/code-applyable-markdown.component.ts`

职责：

- 把 agent `output` 里的 markdown 解析成：
  - 普通 markdown 段
  - 可应用到编辑器的 patch 卡片

它复用的是 `show in editor` 那套语义，只是当前实现把这部分做成了一个更轻量的通用组件，而不是直接复用 `matrix-analyse.component.ts`。

## 8. 关键模板结构

### 8.1 `CourseInfoTabComponent` 里的 Agent tab

核心模板骨架如下：

```html
<nz-tab nzTitle="Agent">
  <section class="history-panel">
    <button class="history-trigger" nz-dropdown [nzDropdownMenu]="historyMenu" nzTrigger="click">
      <h5><span nz-icon nzType="history"></span> 历史对话</h5>
      <nz-icon class="history-arrow" nzType="down"></nz-icon>
    </button>

    <nz-dropdown-menu #historyMenu="nzDropdownMenu">
      <ul nz-menu class="history-dropdown-menu">
        @for (conv of conversationHistory; track $index) {
          <li
            nz-menu-item
            class="history-conversation-item"
            [class.is-active]="currentConversation?.conversationId === conv.conversationId"
            (click)="onConversationItemClick(conv.conversationId)"
          >
            ...
          </li>
        }
        <li nz-menu-item class="new-conversation-trigger" (click)="createNewConversation.emit()">
          新建一个对话...
        </li>
      </ul>
    </nz-dropdown-menu>
  </section>

  <section class="chat-section" #chatScrollContainer>
    @for (event of _displayEvents(); track $index) {
      <agent-chat-bubble
        [dEvent]="event"
        (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
        (applyToEditor)="applyAnalysisEdit.emit($event)"
        (rewindConversationRequest)="handleRewindConversationRequest(event, $event)"
        (rewindWriteRequest)="rewindWriteRequest.emit($event)"
      />
    }
  </section>

  <section class="agent-action">
    <form #agentForm="ngForm" (ngSubmit)="onAgentSubmit(agentForm)">
      <textarea
        nz-input
        [(ngModel)]="userInput"
        name="userInput"
        (keydown)="onKeyDown($event, agentForm)"
        class="agent-input"
        cdkTextareaAutosize
        cdkAutosizeMinRows="1"
        cdkAutosizeMaxRows="6"
      ></textarea>

      <menu class="agent-action-buttons">
        <button class="secondary" nz-dropdown [nzDropdownMenu]="agentActionMenu" [nzClickHide]="false">Tools</button>
        <button class="secondary" nz-dropdown [nzDropdownMenu]="byokMenu" [nzClickHide]="false">BYOK</button>
        <button class="secondary" (click)="exportCurrentConversation()" [disabled]="!currentConversation">
          <span nz-icon nzType="export"></span>
        </button>
        <button class="secondary send-action" type="submit" [disabled]="agentLoopRunning">
          <nz-icon nzType="send"></nz-icon>
        </button>
      </menu>
    </form>
  </section>
</nz-tab>
```

迁移时最好保留这三段布局层次：

1. `history-panel`
2. `chat-section`
3. `agent-action`

因为当前高度、滚动和 sticky 效果都依赖这个结构。

### 8.2 `AgentAssistantMessageComponent`

最关键的渲染规则如下：

```html
@for (event of dEvent.events; track $index) {
  @if (event.type === 'think' && shouldRenderThinkBlock($index)) {
    <details class="think-block animated-details">
      <summary class="think-summary sticky">think</summary>
      <div class="think-content">
        @for (content of getThinkContents($index); track $index) {
          <markdown class="markdown-patched" [data]="content"></markdown>
        }
      </div>
    </details>
  } @else if (event.type === 'tool_call') {
    <details class="bubble-card tool-card">
      <summary class="tool-summary">
        <div class="tool-card-header sticky">
          <code class="tool-title">{{event.payload.toolName}}({{ event.payload.input.join(', ') }})</code>
          <span class="tool-status">...</span>
          @if(getToolCheckpointId(event.payload.callId)) {
            <button
              class="rewind-write-icon"
              type="button"
              (click)="$event.stopPropagation(); rewindWriteRequest.emit(getToolCheckpointId(event.payload.callId))"
            >
              ↫
            </button>
          }
        </div>
        @if (getToolResultOutput(event.payload.callId)) {
          <pre class="tool-output">{{ getToolResultOutput(event.payload.callId) }}</pre>
        }
      </summary>
    </details>
  } @else if (event.type === 'output') {
    <code-applyable-markdown
      [content]="event.payload.content"
      (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
      (applyToEditor)="applyToEditor.emit($event)"
    />
  } @else if (event.type === 'turn_end') {
    <p class="bubble-body system-end">{{ turnEndReasonMap[event.payload.reason] }}</p>
  }
}
```

注意：`output` 不是普通 `<markdown>`，而是 `code-applyable-markdown`。这就是 agent 输出能直接“应用到编辑器”的原因。

## 9. 关键样式

### 9.1 `CourseInfoTabComponent` 里的布局样式

当前样式几乎都写在组件内联 `styles` 里。迁移到别的项目时，如果你拆到 `.scss` 或 `.css` 文件中，建议先原样保留 selector，再逐步清理。

最关键的一段是 tab 内容区撑满高度：

```css
:host { display: block; height: 100%; }

:host ::ng-deep nz-tabs.tab-expend {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:host ::ng-deep nz-tabs.tab-expend > .ant-tabs-content-holder {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

:host ::ng-deep nz-tabs.tab-expend > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane {
  height: 100%;
  overflow: auto;
  padding-right: 8px;
  flex: 1 1 auto;
  min-width: 0;
}
```

如果这一段没迁，`chat-section` 往往会失去正确高度，滚动会直接坏掉。

历史对话和聊天区的关键样式：

```css
.history-trigger {
  width: 100%;
  height: 30px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-sm) var(--size-radius-sm) 0 0;
  background: var(--color-bg);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
}

.chat-section {
  flex: 1;
  overflow: auto;
  background-color: var(--color-surface);
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 2px 12px 10px;
  scrollbar-width: thin;
  scrollbar-color: var(--color-secondary) var(--color-surface);
  user-select: text;
}

.agent-action {
  height: fit-content;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-sm);
}

.agent-action .agent-input {
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-radius: var(--size-radius-sm) var(--size-radius-sm) 0 0;
}

.agent-action .agent-action-buttons {
  padding: 4px;
  display: flex;
  gap: 4px;
  align-items: center;
}
```

工具菜单和 BYOK 面板的关键样式：

```css
.agent-tool-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.agent-tool-badge {
  padding: 0 6px;
  border-radius: 999px;
  background: var(--color-primary-light-xl);
  color: var(--color-secondary);
  font-size: 11px;
  line-height: 18px;
}

.byok-menu {
  width: 320px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--color-bg);
}
```

### 9.2 `chat-bubble.component.ts` 里的消息样式

assistant 卡片的视觉重心都在这个文件里：

```css
.chat-bubble.agent {
  padding: 10px 12px;
  border-radius: 14px 14px 14px 2px;
  background: var(--color-bg);
  color: var(--color-text);
  margin-right: auto;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.think-summary {
  cursor: pointer;
  user-select: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #6b7280;
  list-style: none;
  background: var(--color-bg);
}

.tool-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-status.pending { color: #ad6800; }
.tool-status.success { color: rgb(51, 117, 28); }
.tool-status.error { color: #cf1322; }

.rewind-write-icon {
  flex: 0 0 auto;
  padding: 4px;
  margin-left: 8px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg);
  color: var(--color-secondary);
}

.system-end {
  color: var(--color-secondary);
  border: 1px dashed #cbd5e1;
  border-radius: var(--size-radius-sm);
  font-size: 13px;
  text-align: center;
}
```

用户卡片与“回滚到这里”入口则在 `AgentChatBubbleComponent`：

```css
.chat-bubble.user {
  padding: 10px 12px;
  border-radius: 14px 14px 2px 14px;
  background: var(--color-primary-light);
  margin-left: auto;
  border: 1px solid var(--color-border);
}

.rewind-chat {
  opacity: 0;
  width: 5.5rem;
  color: var(--color-secondary);
}

.rewind-chat:hover {
  cursor: pointer;
  opacity: 1;
}
```

## 10. `show in editor` 在 Agent 输出中的复用

位置：

- `frontend/src/app/pages/assignment/components/code-applyable-markdown.component.ts`

核心逻辑仍然是解析 fenced code block：

```ts
const SPECIAL_FENCE_PATTERN = /^([a-zA-Z0-9_#+-]+):(\d+)C(\d+)-(\d+)C(\d+)$/;
const PLAIN_LANGUAGE_FENCE_PATTERN = /^[a-zA-Z0-9_#+-]+$/;
const FENCED_CODE_BLOCK_PATTERN = /```([^\r\n]*)\r?\n([\s\S]*?)```/g;
```

以及：

- `language:startLineCstartColumn-endLineCendColumn` 表示范围替换
- 纯语言 fenced block 表示整篇替换

agent output 的 `output` 会进这个组件，所以 agent 既能自然语言解释，也能在回复里直接给可应用 patch。

如果目标项目已经完成了旧文档里的迁移，建议：

1. 复用原有 `MatrixAnalysisEditorRange`
2. 复用原有 `MatrixAnalysisEditRequest`
3. 复用原有编辑器 apply 逻辑
4. 把 agent 输出改为调用已有公共组件，而不是保留重复实现

## 11. 前端 Agent Loop 运行时

### 11.1 System Prompt 协议

位置：

- `frontend/src/app/services/assign/agent/agent.constant.ts`

当前 prompt 非常关键，因为 parser 就是按这个 XML 协议写的：

```ts
export const SYSTEM_PROMPT = (enabledToolsPrompt: string) => `
You are Matrix Agent, a coding assistant for students finishing programming assignments.
Prefer XML tags: <think>, <tool_call>.
If you need to mix assistant text with tool calls in one response, use <output> blocks before or after <tool_call> blocks.
If you do not need any tool call in this response, you may answer directly as plain text (without XML tags), or with <output>...</output>.
Never emit markdown code fences or bullet prefixes unless explicitly requested.
You may emit multiple <think> blocks and multiple <tool_call> blocks in one response.
When calling a tool, the body of <tool_call> must be valid JSON with exact shape {"toolName":"...","input":["..."]}.
Never invent tool names outside the enabled tool list.
Enabled tools: ${enabledToolsPrompt}.
`
```

这意味着迁移时不能只搬 parser，还必须把 prompt 约束也一起搬过去，否则模型输出格式会漂。

### 11.2 `AgentLoopService.emitAgentLoop`

位置：

- `frontend/src/app/services/assign/agent/agent-loop.service.ts`

这是整套功能的核心入口。运行流程是：

1. 先把 `user_message` 追加到本地 conversation signal
2. 立刻持久化这条用户消息
3. 进入循环，每轮执行一次 `runSinglePass`
4. 每一轮都：
   - 组装 model messages
   - 流式读取模型输出
   - 增量解析 `<think> / <tool_call> / <output>`
   - 更新 conversation tail
   - 只持久化“稳定前缀”
5. 一轮结束后：
   - 如果没有 tool call，也没有协议错误，写入 `turn_end: completed`
   - 否则执行工具，把 `tool_result` 追加进会话，再进入下一轮
6. 若连续工具失败次数过多或轮数超上限，则写入带 reason 的 `turn_end`

当前硬编码阈值：

- `MAX_TURN_STEP = 20`
- `MAX_TOOL_RETRY = 3`

### 11.3 Stable Prefix 持久化

这里是当前实现最容易被漏迁，但实际上最重要的一部分。

位置：

- `frontend/src/app/services/assign/agent/agent-loop-pass-parser.ts`
- `frontend/src/app/services/assign/agent/agent-loop-persist-cursor.ts`
- `frontend/src/app/services/assign/agent/agent-loop-tail-projector.ts`

设计动机：

- 流式文本会持续增长
- 如果每次 chunk 都完整覆写远端事件，会非常混乱
- 所以当前做法是：
  - 展示层可以先看到“草稿态”
  - 但只有闭合完成的 block 才允许持久化

例如：

1. 纯文本 `plain text` 在 `finalize=false` 时是 `output`，但 `stableCount=0`
2. `<think>draft` 未闭合时，可以显示 draft think block，但还不能持久化
3. `</think>` 到来后，这个 think block 才变成稳定内容

核心返回结构：

```ts
export type AgentLoopPassSnapshot = {
  displayEvents: AgentLoopPassDisplayEvent[];
  stableCount: number;
  toolBlockIds: string[];
  toolCalls: MatrixAgentEventToolCall[];
  toolErrors: MatrixAgentEventToolResult[];
};
```

`AgentLoopPersistCursor` 负责只把 `displayEvents.slice(oldStableCount, newStableCount)` 这一段写到后端。

### 11.4 Tool Call 解析规则

当前 parser 支持两种格式，但迁移时建议只保留 JSON 作为主协议：

1. 推荐格式：

```xml
<tool_call>{"toolName":"read_editor","input":["main.cpp"]}</tool_call>
```

2. 兼容格式：

```xml
<tool_call>read_editor, main.cpp, selected line</tool_call>
```

解析失败时不会丢掉，而是生成一个失败的 `tool_result`，这样模型能在下一轮看到错误并自我修正：

```ts
{
  type: 'tool_result',
  payload: {
    callId,
    success: false,
    output: 'Invalid tool_call payload. Use JSON {"toolName":"...","input":["..."]} or comma-separated "toolName, arg1, arg2".',
  },
}
```

## 12. 工具系统

### 12.1 Tool Definition / Display / Mapping

位置：

- `frontend/src/app/services/assign/agent/agent-loop-tool-provider.service.ts`

当前工具分三类：

1. 用户可见且可开关
2. 用户可见但未实现
3. 内部工具，不展示但始终可用

当前定义如下：

```ts
export type AgentLoopToolName =
  | 'change_title'
  | 'get_tool_hint'
  | 'read_editor'
  | 'read_selection'
  | 'read_problem_info'
  | 'read_problem_answer'
  | 'write_editor'
  | 'playground'
  | 'web_search'
  | 'web_read';

export type AgentLoopToolNameDisplay =
  Exclude<AgentLoopToolName, 'get_tool_hint' | 'read_selection'>;
```

其中最重要的映射关系是：

- `read_editor` 在展示层是一个工具
- 但真正启用时会自动展开为：
  - `read_editor`
  - `read_selection`

对应代码：

```ts
expandEnabledTools(enabledDisplayTools: AgentLoopToolNameDisplay[]): AgentLoopToolName[] {
  const expandedTools = new Set<AgentLoopToolName>();

  Object.entries(this.toolDefinitions)
    .filter(([_, def]) => !def.showInDisplay)
    .map(([name]) => name as AgentLoopToolName)
    .forEach((toolName) => expandedTools.add(toolName));

  for (const toolName of this.normalizeEnabledDisplayTools(enabledDisplayTools)) {
    expandedTools.add(toolName);
    for (const mappedTool of this.toolDefinitions[toolName].mappedTools ?? []) {
      expandedTools.add(mappedTool);
    }
  }

  return Array.from(expandedTools);
}
```

### 12.2 当前已实现工具

- `change_title`
- `get_tool_hint`
- `read_editor`
- `read_selection`
- `read_problem_info`
- `read_problem_answer`
- `write_editor`
- `playground`

### 12.3 当前未实现但会展示为 disabled 的工具

- `web_search`
- `web_read`

UI 上会有“开发中” badge。

### 12.4 工具配置持久化

启用工具存放在：

- `localStorage['agent_loop_enabled_tools']`

默认行为：

- 所有“已实现且可 toggle”的展示工具默认都开启

### 12.5 `write_editor` 工具的协议

当前 handler 约定如下：

```ts
['write_editor', async (config, input) => {
  const [target, content, ...position] = input;

  if (target === 'full-editor') {
    return {
      success: true,
      output: await config.writeEditorContent({ target, text: content, range: undefined }),
    };
  } else if (target === 'range') {
    const [startLineNumber, startColumn, endLineNumber, endColumn] = position.map(Number);
    return {
      success: true,
      output: await config.writeEditorContent({
        target,
        text: content,
        range: { startLineNumber, startColumn, endLineNumber, endColumn },
      }),
    };
  }

  return { success: false, output: 'Invalid target for write_editor tool.' };
}]
```

也就是说工具层并不自己操作 Monaco，它只委托页面层的 `writeEditorContent` callback。

## 13. BYOK

位置：

- `frontend/src/app/services/assign/agent/agent-stream.service.ts`
- `frontend/src/app/pages/assignment/components/course-info-tab.component.ts`

当前实现是：

1. 若没有 BYOK 配置，走 Matrix 后端代理：

```ts
POST /api/courses/{courseId}/assignments/{assignId}/agent/stream
```

2. 若有 BYOK 配置，直接请求用户提供的 `baseUrl`：

- 若 `baseUrl` 以 `/chat/completions` 结尾，直接用
- 若以 `/v1` 结尾，补 `/chat/completions`
- 否则补 `/v1/chat/completions`

BYOK 存储位置：

- `sessionStorage['MAGENT_BYOK_CONFIG']`
- `sessionStorage['MAGENT_BYOK_NOTICE_SHOWN']`

`streamMessagesViaByok` 同时兼容两种返回：

1. 直接文本 chunk
2. SSE `data:` 风格的 OpenAI 兼容流

如果目标项目也要保留 BYOK，建议把这层服务完整迁过去，而不是在页面组件里直接写 `fetch`。

## 14. 编辑器写入、checkpoint 与回滚

### 14.1 写入编辑器前先创建 checkpoint

位置：

- `frontend/src/app/pages/assignment/assigment.component.ts`

关键代码：

```ts
handleAgentWriteEditorRequest = async (
  request: Pick<MatrixAnalysisEditRequest, 'target' | 'range' | 'text'>
): Promise<MatrixAgentToolResultOutput> => {
  const checkpointId = await firstValueFrom(
    this.agentService.createCheckpoint$(this.courseId!, this.assignId!, this._agentUserId, [this.codeFile()])
  );

  this.handleAnalysisEditRequest(request);

  if (!checkpointId) {
    this.notify.warning("未能创建检查点。", "编辑警告");
  }

  this.userEditedEditorAfterAgentWrite = false;
  return {
    checkpointId,
    message: 'Content written to editor successfully.',
  };
}
```

重点：

1. checkpoint 是页面层负责建，不是工具层负责建。
2. 返回值里必须带 `checkpointId`，这样工具卡片才能出现回滚按钮。

### 14.2 真正应用到编辑器仍走旧的 `show in editor` 逻辑

关键点仍然是：

- `validateMatrixAnalysisRange`
- `buildEditedSelectionRange`
- `getFullEditorRange`
- `pushUndoStop`
- `executeEdits`
- `setSelection`
- `revealRangeInCenter`
- `focus`

也就是说，agent 写编辑器并没有另起一套逻辑，而是直接复用了原来的 patch 应用机制。

### 14.3 追踪“agent 写入后用户是否手工改过”

当前页面层用两个变量控制：

```ts
private suppressEditorChangeTracking = false;
private userEditedEditorAfterAgentWrite = false;
```

在 `handleEditorReady` 里注册：

```ts
this.editorContentChangeDisposable = editor.onDidChangeModelContent(() => {
  if (this.suppressEditorChangeTracking) {
    return;
  }
  this.userEditedEditorAfterAgentWrite = true;
});
```

而在 agent 自动写入 / 自动回滚时，会先临时设 `suppressEditorChangeTracking = true`，避免把程序写入误判为“用户手改”。

### 14.4 卡片级回滚

成功的 `write_editor` 工具卡片会带 checkpoint id，assistant 卡片通过：

```ts
getToolCheckpointId(callId: string): CheckpointId | undefined {
  return (this.toolResultsByCallId.get(callId)?.payload.output as MatrixAgentToolResultOutputObject)?.checkpointId;
}
```

拿到 checkpoint 后，点击图标就向页面层发出：

```ts
@Output() rewindWriteRequest = new EventEmitter<CheckpointId | undefined>();
```

页面层最终调用：

- `handleAgentRollbackRequest`
- `restoreEditorFromCheckpoint`

### 14.5 会话级回滚

点击用户消息上方“回滚到这里”时，会：

1. 把该条用户消息内容重新塞回输入框
2. 把会话事件截断到这条消息之前
3. 检查被截掉的尾部里是否存在成功的 `write_editor`
4. 如果有，对用户弹出“是否同时恢复编辑器代码”确认框
5. 然后调用后端 `override_events`

关键逻辑：

```ts
const truncatedEvents = conversation.events.slice(0, userEventIndex);
const truncatedTail = conversation.events.slice(userEventIndex);
const checkpointId = this.findLatestWriteEditorCheckpointId(truncatedTail);
```

## 15. `AgentService` 与前后端字段映射

位置：

- `frontend/src/app/services/assign/agent/agent.service.ts`

前端使用 camelCase，后端接口使用 snake_case，所以这里必须保留映射层。

例如：

```ts
private mapConversationSummary(raw: RawMatrixAgentConversationSummary): MatrixAgentConversationSummary {
  return {
    conversationId: raw.conversation_id,
    title: raw.title,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}
```

以及 append / override 请求体：

```ts
{
  conversation_id: request.conversationId,
  expected_event_count: request.expectedEventCount,
  events: request.events,
}
```

这里不要偷懒直接把前端类型传给后端，否则接口字段会对不上。

## 16. 后端接口契约

### 16.1 路由

位置：

- `backend/app/routers/agent.py`

当前路由包括：

1. `POST /courses/{course_id}/assignments/{assign_id}/agent/conversations`
2. `GET /courses/{course_id}/assignments/{assign_id}/agent/conversations`
3. `GET /courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}`
4. `PATCH /courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}/title`
5. `DELETE /courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}`
6. `POST /courses/{course_id}/assignments/{assign_id}/agent/event`
7. `POST /courses/{course_id}/assignments/{assign_id}/agent/event/override`
8. `POST /courses/{course_id}/assignments/{assign_id}/agent/checkpoints`
9. `GET /courses/{course_id}/assignments/{assign_id}/agent/checkpoints/{checkpoint_id}`
10. `POST /courses/{course_id}/assignments/{assign_id}/agent/stream`

### 16.2 控制器语义

位置：

- `backend/app/controller/agent.py`

关键点：

1. conversation 通过 `assignment + user_id + deleted_at=None` 查询
2. 删除是软删除：写 `deleted_at`
3. `append_events` 做乐观并发检查：
   - 传入 `expected_event_count`
   - 若和当前后端事件数不一致，抛 409
4. `override_events` 是强制覆盖，不做 event count 校验
5. checkpoint 存的是“序列化后的代码文件列表字符串”
6. `stream_messages` 只是把消息数组转发给模型流，不负责 agent loop

### 16.3 持久化模型

位置：

- `backend/app/models/agent.py`

核心字段：

```py
class AIAgentConservation(Model):
    id = fields.CharField(max_length=50, primary_key=True)
    assignment = fields.ForeignKeyField("models.Assignment", related_name="agent_conversations")
    user_id = fields.CharField(max_length=50)
    title = fields.CharField(max_length=200)
    deleted_at = fields.DatetimeField(null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    events = fields.JSONField()

class AIAgentConservationCheckpoint(Model):
    id = fields.CharField(max_length=50, primary_key=True)
    assignment = fields.ForeignKeyField("models.Assignment", related_name="agent_checkpoints")
    original_code = fields.CharField(max_length=10000)
```

注意 checkpoint 当前是按 assignment 维度挂的，不带 user_id。

## 17. 导出格式

位置：

- `frontend/src/app/api/util/export.ts`

当前导出不是原始 JSON，而是“更接近可读 transcript”的文本格式。

规则：

1. `user_message` 开启一个 `User:` section
2. `think / output / tool_call / tool_result` 都累积到同一个 `Matrix Agent:` section
3. `turn_end` 不会写到导出文本中

关键代码：

```ts
if (event.type === 'think') {
  agentBuffer += `<think>${String(event.payload.content ?? '')}</think>`;
  return;
}

if (event.type === 'tool_call') {
  const renderedCall = `${toolName}(${input.map((item) => String(item)).join(',')})`;
  agentBuffer += `<tool_call>${renderedCall}</tool_call>`;
  return;
}
```

如果目标项目也需要“导出对话”，直接复用这段 util 即可。

## 18. 当前测试覆盖点

当前仓库里，相关测试已经覆盖了迁移时最容易漏掉的点。即使你在另一个项目不直接搬 spec，也建议把这些用例思想带过去。

### 18.1 `course-info-tab.component.spec.ts`

覆盖：

- `_splitEventsForDisplay`
- 提交输入只发 `user_message`
- rewind 时把旧用户消息回填到输入框
- 工具菜单 toggle 发射
- 对话导出预览

### 18.2 `chat-bubble.component.spec.ts`

覆盖：

- 用户气泡渲染
- `tool_call + tool_result` 合并
- pending 工具卡片
- orphan tool result fallback
- 连续 `think` 合并
- 无 output 时仍显示 `turn_end`

### 18.3 `assigment.component.spec.ts`

覆盖：

- 左侧事件正确传到页面层
- range focus 后编辑器会 `focus()`
- patch 应用后编辑器会 `focus()`
- agent 写入前会创建 checkpoint
- 手工修改后回滚会弹确认框
- conversation rewind 触发代码恢复确认
- `pushNewAgentEvent` 会把配置正确交给 `AgentLoopService`

### 18.4 `agent-loop.service.spec.ts`

覆盖：

- stable prefix 持久化策略
- 流式 plain text / think / tool_call 混合解析
- malformed tool_call 转成失败 tool_result
- 成功 `write_editor` 把 checkpointId 透传到 tool_result
- 409 conflict 时会重新拉取远端 conversation

### 18.5 `agent-loop-tool-provider.service.spec.ts`

覆盖：

- display tool 到 internal tool 的展开
- 未实现工具保持 disabled

### 18.6 `analysis-editor.utils.spec.ts` / `code-editor.component.spec.ts`

覆盖：

- range 合法性校验
- 编辑后选区计算
- 整篇替换范围
- 外部同步内容相同时不重复 `setValue`

## 19. 建议迁移顺序

推荐按下面顺序迁移，排查成本最低：

1. 先确认目标项目是否已经有 `show in editor` 底座。
2. 迁类型与 util：
   - `agent.d.ts`
   - `agent-loop.d.ts`
   - `export.ts`
   - `agent.constant.ts`
3. 迁后端 schema / model / controller / router。
4. 迁 `agent.service.ts`。
5. 迁 `agent-stream.service.ts`。
6. 迁 `agent-loop-tool-provider.service.ts`。
7. 迁 `agent-loop-pass-parser.ts`、`agent-loop-persist-cursor.ts`、`agent-loop-tail-projector.ts`。
8. 迁 `agent-loop.service.ts`。
9. 迁 `code-applyable-markdown.component.ts`。
10. 迁 `chat-bubble.component.ts`。
11. 迁 `course-info-tab.component.ts` 的模板、样式和交互。
12. 最后在页面级组件里接入：
    - conversation 状态
    - editor 读写
    - rewind / rollback
    - BYOK
    - export
13. 补测试。

## 20. 已知注意点和迁移时建议顺手修的地方

这部分不是要你重构，而是为了在另一个项目里别把当前仓库里的边界问题原样复制过去却不自知。

### 20.1 工具快照语义和当前实现并不完全一致

`AssignmentComponent.pushNewAgentEvent()` 在发消息前会算出：

```ts
const enabledToolsSnapshot = this.agentToolProvider.expandEnabledTools(this.enabledAgentTools());
```

并把它传入 `emitAgentLoop({ enabledTools: enabledToolsSnapshot })`。

但 `AgentLoopService.emitAgentLoop()` 当前实际调用的是：

```ts
this.runSinglePass(config, conversation, persistedEventCount, this.toolProvider.enabledTools);
```

并且 `buildModelMessages` 用的也是 `this.toolProvider.enabledToolsPrompt`，不是 `config.enabledTools` 的快照。

这意味着：

- 产品文案写的是“运行中修改仅对下一轮消息生效”
- 当前代码却更接近“运行中改工具，后续 pass 可能读到实时值”

如果你在目标项目想严格保留产品语义，迁移时建议一并改成真正消费 `config.enabledTools` 和快照版 prompt。

### 20.2 `override_events` 当前 schema 不允许空事件数组

后端 `AIAgentOverrideEventsRequest` 里：

```py
events: List[AIAgentEvent] = Field(..., min_length=1)
```

但前端 `rewindConversationAt()` 如果点击第一条用户消息，会得到：

```ts
const truncatedEvents = conversation.events.slice(0, userEventIndex);
```

此时 `userEventIndex === 0` 会产生空数组。

所以：

- 如果你想支持“回滚到首条消息之前，留下空会话”
- 需要同步放宽后端 schema，或者在前端避免提交空数组

### 20.3 checkpoint 恢复只恢复当前文件或第一个文件

当前恢复逻辑是：

```ts
const targetFile = checkpointFiles.find((file) => file.fileName === currentFileName) ?? checkpointFiles[0];
```

如果目标项目是多文件编辑器，最好重新设计：

- checkpoint 如何对应多个文件
- 恢复时到底恢复当前打开文件，还是整个工作区

### 20.4 BYOK 默认 model 现在有两处默认值

当前代码里：

- `AgentStreamService.BYOK_DEFAULT_MODEL = "gpt-5.3-codex"`
- `CourseInfoTabComponent.byokModelDraft = 'qwen3-max'`

虽然大多数情况下最终会被 `byokConfig` 覆盖，但迁移到别的项目时最好统一成一个默认值，避免 UI 和实际请求不一致。

### 20.5 当前样式高度依赖 `::ng-deep` 和 Ant Design DOM 结构

如果目标项目：

- 不是 ng-zorro
- 或者 tab DOM 结构不同

那就不要逐字照抄 selector，而要保留“撑满高度”和“聊天区独立滚动”的布局语义。

## 21. 最小验收清单

迁移完成后，至少手工验证下面这些点：

1. `Agent` tab 只在当前项目需要的可见条件下出现。
2. 能新建、加载、重命名、删除对话。
3. 用户消息发送后，agent 输出能分成用户卡片和 assistant 卡片两类。
4. assistant 输出里的 `think` 可折叠。
5. `tool_call` 会先出现 pending 卡片，返回 `tool_result` 后原位补全。
6. `output` 里的代码块能“应用到编辑器”和“定位范围”。
7. `write_editor` 后出现 checkpoint 可回滚入口。
8. agent 写入后，手工再改编辑器，再点回滚会弹确认框。
9. 点击“回滚到这里”会同时回滚对话，必要时询问是否恢复代码。
10. 工具菜单状态刷新页面后仍保留。
11. BYOK 可走直连流；关闭 BYOK 后回到平台流。
12. 导出预览和下载正常。
13. 并发冲突时，前端能在 409 后重新拉远端 conversation。

## 22. 迁移时的核心判断

如果你在另一个上下文里让我直接照着做，这份文档里最重要的结论可以压缩成一句话：

当前 `Agent` tab 不是“一个组件”，而是以下 5 层一起迁：

1. 页面级状态与 Monaco 编辑器接线
2. 左侧 tab UI 和对话交互
3. assistant 卡片渲染层
4. 前端 agent loop / 工具系统 / 流式 parser
5. conversation / checkpoint / stream 的后端接口与持久化

漏掉任何一层，最后得到的都会只是一个“看起来像 agent tab”的壳子，而不是当前仓库里这套真实可运行的实现。
