# Matrix Analysis `showInEditor` 迁移说明

本文档总结本次在 `matrix-show-in-editor` 工作树中完成的能力，目的是把这套实现迁移到另一个更复杂的原项目时，能够在新对话上下文里直接复现，不依赖当前上下文记忆。

## 1. 功能目标

本次实现解决了 4 类能力：

1. `MatrixAnalysisProps.showInEditor === true` 时，分析面板中的特殊代码块可以显示“应用到编辑器”按钮。
2. 支持两种应用模式：
   - 坐标替换：` ```cpp:x1Cy1-x2Cy2 `
   - 整篇替换：基础分析中的普通 fenced code block，例如 ` ```C++ `
3. 应用后支持 `Ctrl+Z` 撤回。
4. 点击范围标签时可以在编辑器中定位并聚焦，tooltip 也能正常显示。

## 2. 最终行为定义

### 2.1 markdown 语法

支持两种代码块：

#### A. 坐标替换块

<!-- ```md -->
```cpp:2C3-4C5
int value = 1;
return value;
```
<!-- ``` -->

含义：

- `2C3-4C5` 表示 Monaco 风格的 1-based 范围
- 即 `startLineNumber = 2`
- `startColumn = 3`
- `endLineNumber = 4`
- `endColumn = 5`

#### B. 整篇替换块

<!-- ```md -->
```C++
#include <iostream>
using namespace std;

int main() {
    return 0;
}
```
<!-- ``` -->

含义：

- 仅在基础分析模块里启用
- 表示用代码块内容替换整个编辑器内容
- 同样支持 `Ctrl+Z`

### 2.2 展示规则

- 普通 markdown 仍然按原样渲染。
- 坐标替换块会渲染成带工具栏的代码卡片。
- 整篇替换块只在基础分析中渲染成带工具栏的代码卡片。
- AI 代码分析中的普通 fenced code block 仍然只是普通 markdown，不应误变成“整篇替换”按钮。

### 2.3 交互规则

- 点击“应用到编辑器”：
  - 执行 `executeEdits`
  - 自动选中修改后的区域
  - 自动滚动到修改处
  - 自动 `focus()` 编辑器
  - 弹通知提示可使用 `Ctrl+Z`

- 点击范围标签：
  - 若当前请求为坐标替换块，定位到该范围
  - 自动滚动到该范围
  - 自动 `focus()` 编辑器
  - 整篇替换块不触发定位事件

## 3. 前端架构拆分

本次实现采用 4 层职责分离：

### 3.1 `matrix-analyse.utils.ts`

职责：

- 解析 markdown 内容
- 把内容切成：
  - `markdown`
  - `editor-patch`
- 生成结构化编辑请求

文件：

- `frontend/src/app/pages/assignment/components/matrix-analyse.utils.ts`

### 3.2 `matrix-analyse.component.ts`

职责：

- 把解析结果渲染成普通 markdown 或交互式代码卡片
- 提供两个输出事件：
  - `applyToEditor`
  - `focusRequestRangeOnEditor`

文件：

- `frontend/src/app/pages/assignment/components/matrix-analyse.component.ts`

### 3.3 `course-info-tab.component.ts`

职责：

- 作为中间透传层
- 不做业务判断
- 负责把 `matrix-analyse` 的两个事件继续向上冒泡

文件：

- `frontend/src/app/pages/assignment/components/course-info-tab.component.ts`

### 3.4 `assigment.component.ts`

职责：

- 持有 Monaco editor 实例
- 真正执行：
  - 范围聚焦
  - 内容应用
  - 选区设置
  - 滚动
  - 聚焦
  - 通知

文件：

- `frontend/src/app/pages/assignment/assigment.component.ts`

### 3.5 `code-editor.component.ts`

职责：

- 承载 `ngx-monaco-editor-v2`
- 对外提供 `editorReady`
- 修复“外部同步导致 undo 栈被冲掉”的问题

文件：

- `frontend/src/app/pages/assignment/components/code-editor.component.ts`

## 4. 关键类型定义

核心类型在：

- `frontend/src/app/pages/assignment/components/matrix-analyse.utils.ts`

关键结构如下：

```ts
export interface MatrixAnalysisEditorRange {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export type MatrixAnalysisEditRequest =
  | {
      target: 'range';
      language: string;
      range: MatrixAnalysisEditorRange;
      text: string;
      tabTitle: string;
    }
  | {
      target: 'full-editor';
      language: string;
      text: string;
      tabTitle: string;
    };
```

注意：

- `target: 'range'` 代表局部替换。
- `target: 'full-editor'` 代表整篇替换。
- 整篇替换请求没有 `range` 字段。

## 5. 解析器实现要点

### 5.1 关键正则

```ts
const SPECIAL_FENCE_PATTERN = /^([a-zA-Z0-9_#+-]+):(\d+)C(\d+)-(\d+)C(\d+)$/;
const PLAIN_LANGUAGE_FENCE_PATTERN = /^[a-zA-Z0-9_#+-]+$/;
const FENCED_CODE_BLOCK_PATTERN = /```([^\r\n]*)\r?\n([\s\S]*?)```/g;
```

含义：

- `SPECIAL_FENCE_PATTERN`
  - 匹配带坐标的 patch block
- `PLAIN_LANGUAGE_FENCE_PATTERN`
  - 匹配纯语言名代码块
  - 用于基础分析里的整篇替换
- `FENCED_CODE_BLOCK_PATTERN`
  - 扫描 fenced code block

### 5.2 关键解析函数

```ts
export function parseMatrixAnalysisSegments(
  content: string | null | undefined,
  showInEditor: boolean | null | undefined,
  tabTitle: string,
  allowWholeEditorReplace = false,
): MatrixAnalysisRenderSegment[] {
  const markdownContent = content ?? '';
  if (!showInEditor || !markdownContent.trim()) {
    return [{ type: 'markdown', markdown: markdownContent }];
  }

  const segments: MatrixAnalysisRenderSegment[] = [];
  let lastMatchEnd = 0;

  for (const match of markdownContent.matchAll(FENCED_CODE_BLOCK_PATTERN)) {
    const fullMatch = match[0];
    const header = match[1]?.trim() ?? '';
    const code = match[2] ?? '';
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastMatchEnd) {
      segments.push({
        type: 'markdown',
        markdown: markdownContent.slice(lastMatchEnd, matchIndex),
      });
    }

    const specialFenceMatch = header.match(SPECIAL_FENCE_PATTERN);
    if (specialFenceMatch) {
      segments.push({
        type: 'editor-patch',
        language: specialFenceMatch[1],
        code,
        previewMarkdown: buildPreviewMarkdown(specialFenceMatch[1], code),
        request: {
          target: 'range',
          language: specialFenceMatch[1],
          tabTitle,
          text: code,
          range: {
            startLineNumber: Number(specialFenceMatch[2]),
            startColumn: Number(specialFenceMatch[3]),
            endLineNumber: Number(specialFenceMatch[4]),
            endColumn: Number(specialFenceMatch[5]),
          },
        },
      });
      lastMatchEnd = matchIndex + fullMatch.length;
      continue;
    }

    if (allowWholeEditorReplace && header.match(PLAIN_LANGUAGE_FENCE_PATTERN)) {
      segments.push({
        type: 'editor-patch',
        language: header,
        code,
        previewMarkdown: buildPreviewMarkdown(header, code),
        request: {
          target: 'full-editor',
          language: header,
          tabTitle,
          text: code,
        },
      });
      lastMatchEnd = matchIndex + fullMatch.length;
      continue;
    }

    segments.push({
      type: 'markdown',
      markdown: fullMatch,
    });
    lastMatchEnd = matchIndex + fullMatch.length;
  }

  if (lastMatchEnd < markdownContent.length) {
    segments.push({
      type: 'markdown',
      markdown: markdownContent.slice(lastMatchEnd),
    });
  }

  return coalesceMarkdownSegments(
    segments.length ? segments : [{ type: 'markdown', markdown: markdownContent }],
  );
}
```

### 5.3 重要策略

- 解析器不应该吞掉无法识别的代码块。
- 任意不合法块都必须回退为普通 markdown。
- `buildPreviewMarkdown()` 要强制补齐结尾换行，否则 fenced block 渲染不稳定。

## 6. 组件模板和样式

### 6.1 `matrix-analyse.component.ts` 关键模板

```ts
<section class="editor-patch-card">
  <div class="editor-patch-toolbar">
    <span
      class="editor-patch-range"
      tabindex="0"
      role="button"
      nz-tooltip
      [nzTooltipTitle]="segment.request.target === 'range' ? '在编辑器中定位范围' : ''"
      (click)="focusRequestRange(segment.request)"
    >
      {{ segment.language }} · {{ describeRequestTarget(segment.request) }}
    </span>

    <button
      class="apply-action"
      nz-tooltip
      [nzTooltipTitle]="'应用到编辑器'"
      (click)="applyToEditor.emit(segment.request)"
    >
      <span nz-icon nzType="check" nzTheme="outline"></span>
    </button>
  </div>

  <markdown
    class="markdown-patched editor-patch-preview"
    [data]="segment.previewMarkdown"
  ></markdown>
</section>
```

### 6.2 样式片段

```css
.editor-patch-card {
  margin: 12px 0;
  border: 1px solid #d9d9d9;
  border-radius: var(--size-radius-sm);
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.editor-patch-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.editor-patch-range {
  font-size: 12px;
  color: #595959;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  cursor: pointer;
}

.editor-patch-preview {
  display: block;
  padding: 0 12px 12px;
}

.apply-action {
  padding: 4px 8px;
}
```

### 6.3 tooltip 的正确用法

本次踩过的坑：

- `nz-tooltip="..."` 这种写法在这里不稳定。
- span/button 没有正确接入 directive 时，tooltip 不显示。

最终采用：

```html
nz-tooltip
[nzTooltipTitle]="'应用到编辑器'"
```

并确保组件 imports 中引入：

```ts
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
```

## 7. 事件透传

### 7.1 `matrix-analyse.component.ts`

```ts
@Output() applyToEditor = new EventEmitter<MatrixAnalysisEditRequest>();
@Output() focusRequestRangeOnEditor = new EventEmitter<MatrixAnalysisEditorRange>();
```

### 7.2 `course-info-tab.component.ts`

```html
<matrix-analyse
  [analysis]="analysis.basic.resolution"
  [allowWholeEditorReplace]="true"
  (focusRequestRangeOnEditor)="focusRequestRangeOnEditor.emit($event)"
  (applyToEditor)="applyAnalysisEdit.emit($event)"
></matrix-analyse>
```

```ts
@Output() applyAnalysisEdit = new EventEmitter<MatrixAnalysisEditRequest>();
@Output() focusRequestRangeOnEditor = new EventEmitter<MatrixAnalysisEditorRange>();
```

## 8. Monaco 应用逻辑

### 8.1 范围定位

```ts
focusRequestRangeOnEditor(range: MatrixAnalysisEditorRange): void {
  if (!this.codeEditor) {
    this.notify.error("编辑器还没有准备好，无法定位", "操作失败");
    return;
  }

  const monacoRange = new monaco.Range(
    range.startLineNumber,
    range.startColumn,
    range.endLineNumber,
    range.endColumn,
  );

  this.codeEditor.setSelection(monacoRange);
  this.codeEditor.revealRangeInCenter(monacoRange);
  this.codeEditor.focus();
}
```

### 8.2 应用修改

```ts
handleAnalysisEditRequest = (request: MatrixAnalysisEditRequest) => {
  if (!this.codeEditor) {
    this.notify.error("编辑器还没有准备好，请稍后再试。", "应用失败");
    return;
  }

  const model = this.codeEditor.getModel();
  if (!model) {
    this.notify.error("当前没有可编辑的代码模型。", "应用失败");
    return;
  }

  const editTargetRange = request.target === 'full-editor'
    ? getFullEditorRange(model)
    : (() => {
        const validationResult = validateMatrixAnalysisRange(model, request.range);
        if (!validationResult.ok) {
          this.notify.error(validationResult.reason, "应用失败");
          return null;
        }

        return validationResult.range;
      })();

  if (!editTargetRange) {
    return;
  }

  const selectionRange = buildEditedSelectionRange(editTargetRange, request.text);
  const editRange = new monaco.Range(
    editTargetRange.startLineNumber,
    editTargetRange.startColumn,
    editTargetRange.endLineNumber,
    editTargetRange.endColumn,
  );
  const selection = new monaco.Selection(
    selectionRange.startLineNumber,
    selectionRange.startColumn,
    selectionRange.endLineNumber,
    selectionRange.endColumn,
  );

  this.codeEditor.pushUndoStop();
  const applied = this.codeEditor.executeEdits(
    'matrix-analysis',
    [
      {
        range: editRange,
        text: request.text,
        forceMoveMarkers: true,
      },
    ],
    [selection],
  );
  this.codeEditor.pushUndoStop();

  if (!applied) {
    this.notify.error("未能把修改应用到编辑器。", "应用失败");
    return;
  }

  this.codeFile.update((codeFile) => ({
    ...codeFile,
    content: model.getValue(),
  }));

  this.codeEditor.setSelection(selection);
  this.codeEditor.revealRangeInCenter(selection);
  this.codeEditor.focus();
  this.notify.success(
    `已把「${request.tabTitle}」中的修改应用到编辑器，可使用 Ctrl+Z 撤回。`,
    "应用成功",
  );
}
```

## 9. 整篇替换的范围计算

位置：

- `frontend/src/app/pages/assignment/analysis-editor.utils.ts`

关键代码：

```ts
export function getFullEditorRange(model: MatrixAnalysisModelLike): MatrixAnalysisEditorRange {
  const endLineNumber = model.getLineCount();
  return {
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber,
    endColumn: model.getLineMaxColumn(endLineNumber),
  };
}
```

说明：

- 整篇替换不是自己拼字符串去 `setValue`，而是仍然走 `executeEdits`。
- 这样才能和 undo/redo 栈保持一致。

## 10. Undo 失效问题的根因与修复

### 10.1 问题根因

应用 patch 后，页层会把最新代码同步回 `codeFile`。

但 `CodeEditorComponent.ngOnChanges()` 之前会无条件执行：

```ts
this.editor.setValue(newContent);
```

即使 `newContent` 和编辑器当前内容完全一致，也会再次 `setValue()`。

这会破坏 Monaco 的撤销栈，所以看起来 `Ctrl+Z` 不生效。

### 10.2 修复方式

在 `code-editor.component.ts` 中增加：

```ts
private syncEditorContent(newContent: string) {
  if (!this.editor) {
    this.pendingContent = newContent;
    return;
  }

  if (this.editor.getValue() === newContent) {
    return;
  }

  this.editor.setValue(newContent);
}
```

然后把：

```ts
this.editor.setValue(newContent);
```

替换成：

```ts
this.syncEditorContent(newContent);
```

### 10.3 原则

- 外部同步进编辑器时，只有内容真的不一致才允许 `setValue()`
- 否则会误清空或重建 undo 栈

## 12. 后端 / mock 约定

这次为了联调，在：

- `backend/app/controller/ai.py`

里补了一个基础分析 mock，包含两类块：

1. 普通 fenced block
   - 用于整篇替换
2. 带坐标 fenced block
   - 用于局部替换

当前 mock 示例思路：

```py
MatrixAnalysisContent(
    title="参考代码",
    content=(
        "```Cpp\n"
        "#include <iostream>\n"
        "using namespace std;\n\n"
        "int main() {\n"
        "    cout << \"Hello, Matrix AI!\" << endl;\n"
        "    return 0;\n"
        "}\n"
        "```\n"
        "```Cpp:2C1-3C1\n"
        "using namespace std-not;\n"
        "```\n"
    ),
    complexity=Complexity(time="O(n)", space="O(1)")
)
```

迁移到真实项目时：

- 保留 `showInEditor: true`
- 基础分析如果要支持整篇替换，只需要返回普通 fenced block
- 若要支持局部替换，则返回带坐标 fenced block

## 13. 测试覆盖

当前 focused 回归覆盖了：

### 13.1 解析层

- `matrix-analyse.utils.spec.ts`

验证：

- 坐标块解析
- 多 patch 块
- 基础分析整篇替换块
- 非法块回退 markdown
- 未闭合块回退 markdown

### 13.2 编辑器范围层

- `analysis-editor.utils.spec.ts`

验证：

- 范围合法性
- 选区计算
- 整篇替换范围

### 13.3 展示层

- `matrix-analyse.component.spec.ts`

验证：

- 坐标块会发出 `range` 请求
- 基础分析普通 fenced block 会发出 `full-editor` 请求

### 13.4 编辑器同步层

- `code-editor.component.spec.ts`

验证：

- 外部回流内容与当前值一致时，不再 `setValue`
- 避免撤销栈被重置

### 13.5 页层聚焦和应用层

- `assigment.component.spec.ts`

验证：

- `focusRequestRangeOnEditor` 事件真正接到父层
- 范围定位后会 `focus()`
- 应用修改后会 `focus()`

## 14. 迁移到原项目时的最小清单

### 14.1 数据结构

- 迁移 `MatrixAnalysisEditRequest`
- 迁移 `MatrixAnalysisEditorRange`
- 迁移 `parseMatrixAnalysisSegments`

### 14.2 组件

- 给分析展示组件加两个输出：
  - `applyToEditor`
  - `focusRequestRangeOnEditor`

- 给基础分析入口加：

```html
[allowWholeEditorReplace]="true"
```

### 14.3 Monaco 页层

- 必须保留：
  - `executeEdits`
  - `pushUndoStop`
  - `setSelection`
  - `revealRangeInCenter`
  - `focus()`

### 14.4 编辑器同步

- 任何外部同步代码都不要无脑 `setValue`
- 必须先比较 `editor.getValue()`

### 14.5 tooltip

- 使用 `NzToolTipModule`
- 使用：

```html
nz-tooltip
[nzTooltipTitle]="..."
```

不要混用错误写法。

## 15. 已知注意点

### 15.1 构建时的既有 warning

当前工作树中，`pnpm build` 仍有一个和本次功能无关的 warning：

- `frontend/src/app/pages/home/home.component.ts`

问题是 CSS 括号不平衡。

它不影响本功能迁移，但如果目标项目要求零 warning，需要一起清掉。

### 15.2 文本编码

当前仓库部分旧文件存在中文注释/字符串的编码历史问题，终端里可能显示为乱码。迁移到原项目时，建议直接使用本文档中的规范中文文案，而不要机械复制那些异常编码的旧字符串。

## 16. 建议的迁移顺序

推荐按下面顺序迁移：

1. 先迁移 `matrix-analyse.utils.ts`
2. 再迁移 `analysis-editor.utils.ts`
3. 再改 `matrix-analyse.component.ts`
4. 再改 `course-info-tab.component.ts`
5. 再改 `assigment.component.ts`
6. 最后修 `code-editor.component.ts` 的同步逻辑
7. 再补 mock 或接真实后端
8. 最后补 focused tests

这样可以最大限度减少一次性联动带来的排查成本。

## 17. 本次最终验证结果

本工作树最终验证结论：

- focused regression tests：通过
- 相关 suite 数量：23 个测试全部通过
- `pnpm build`：通过
- 后端 mock 文件 `backend/app/controller/ai.py`：已修改用于联调基础分析

如果在另一个对话里让我直接迁移到原项目，优先把这份文档当作唯一可信来源即可。
