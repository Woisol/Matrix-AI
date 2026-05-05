# sxml.js

流式 XML 解析器，专为 LLM 流式输出设计。

## 动机

LLM 流式输出时，XML 标签（如 `<think>`、`<tool_call>`）可能任意分布在不同的 chunk 中。传统的 SAX/StAX 解析器通常假设输入是完整的，无法很好地处理这种场景。sxml.js 专为此设计：

- 接收随意分割的字符串 chunk，即时输出可消费的解析结果
- 两种确认模式：`confirmAt:'close'`（默认）—— 标签闭合后产出结构化事件；`confirmAt:'open'` —— 开标签即输出事件，后续文本流式更新其内容
- 标签可嵌套，默认 1 层，子标签自动收纳为父标签的属性

## 安装

```bash
npm install @woisol-g/sxml.js
# 或
pnpm add @woisol-g/sxml.js
```

## 快速开始

```typescript
import { SxmlParser } from '@woisol-g/sxml.js';

const parser = new SxmlParser({
  legalTags: ['think', 'tool_call'],
});

// 流式写入 chunk
parser.write('让我想一想');
parser.write('<think>这个问');
parser.write('题需要思考一下</think>');
parser.write('<tool_call name="calc">2+2</tool_call>');
parser.end();

// 消费结果
let result;
while ((result = parser.tryPull()) !== null) {
  // result.update — 更新最后一个文本事件
  // result.append — 追加新事件
}

// 或使用异步 pull
const result = await parser.pull();
```

## 核心概念

### 三层架构

```
L1 Tokenizer (字符级状态机)
  ↓ XML 语义事件
L2 XmlProcessor (标签栈管理)  
  ↓ 带栈上下文的事件
L3 SxmlParser (业务事件层)
  ↓ SxmlResult 增量 patch
Consumer
```

### SxmlResult

增量 patch，指示消费方如何更新事件列表：

```typescript
interface SxmlResult {
  update?: SxmlEvent | null; // 替换最后一个事件；null 表示清除最后一个事件
  append: SxmlEvent[];    // 追加新事件
}
```

消费方按以下方式维护事件列表：

```typescript
if (result.update === null) events.pop();
else if (result.update !== undefined) events[events.length - 1] = result.update;
events.push(...result.append);
```

### 文本回退（Backtracking）

未闭合的标签先以原始文本形式输出。标签闭合后，原始文本被截断，结构化事件追加到列表。

```
输入 chunks: '<think' → '>hello</think>'

chunk 1: "text"     → { append: [text("<think")] }
chunk 2: "hello</think>"  → { update: null, append: [think("hello")] }
```

### 即时确认（confirmAt: 'open'）

`confirmAt:'open'` 模式的标签（如 `<think>`）在开标签时立即输出业务事件，后续文本流式更新事件内容，无需等待闭合标签。

```
legalTags: [{ name: 'think', confirmAt: 'open' }]
输入: before<think>hello</think>after

输出序列:
  1. { append: [text("before"), think(content="")] }
  2. { update: think(content="hello") }          ← 文本流式更新
  3. { update: think(content="hello") }          ← 闭合确认
  4. { append: [text("after")] }
```

这对需要即时展示标签状态的场景非常有用：比如 `<think>` 出现后，前端可立即进入"思考中"状态，内容逐字追加，不再需要 `\r` 回溯覆盖。

### 默认标签处理器

`legalTags` 中的标签自动使用默认处理器，产出形如 `{ type, name, ...attrs, content }` 的事件。嵌套的子标签被收纳为父标签的属性（当两者均使用默认处理器时）。

```typescript
// 输入: <outer><inner>val</inner>text</outer>
// 输出:
{ type: 'outer', name: 'outer', content: 'text', inner: 'val' }
```

### 自定义标签处理器

可通过 `tagHandlers` 覆盖特定标签的处理逻辑：

```typescript
const parser = new SxmlParser({
  legalTags: ['tool_call'],
  tagHandlers: {
    tool_call: {
      build(tagName, attrs, children) {
        const content = children
          .filter(c => c.type === 'text')
          .map(c => c.content)
          .join('');
        return {
          type: 'tool_call',
          toolName: attrs.name,
          result: Number(content),
        };
      },
    },
  },
});
```

## API

### SxmlParser

| 方法 | 说明 |
|------|------|
| `write(chunk)` | 写入一个字符串 chunk |
| `end()` | 标记流结束 |
| `isEnd` | 只读 getter，当前流是否已结束 |
| `lastConfirm` | 只读 getter，最后一个对外事件是否已稳定、不会再被后续 `update` 修改，可用于判断是否持久化 |
| `tryPull()` | 同步拉取下一个结果，无结果时返回 `null` |
| `pull()` | 异步拉取，返回 `Promise<SxmlResult \| null>` |
| `reset()` | 重置到初始状态 |

### SxmlConfig

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `legalTags` | `LegalTagConfig[]` | — | 合法标签白名单。每个条目可为字符串（`confirmAt:'close'`）或 `{ name, confirmAt }` 对象 |
| `tagCharPattern` | `RegExp` | `/^[a-zA-Z0-9_\-.:]$/` | 标签名字符正则（`legalTags` 未提供时生效） |
| `tagHandlers` | `Record<string, TagHandler>` | — | 自定义标签处理器 |
| `maxNestingDepth` | `number` | `1` | 最大嵌套解析深度 |
| `maxBufferSize` | `number` | `1048576` | 缓冲区最大字节数 |
| `errorStrategy` | `ErrorStrategy` | `lenient` | 错误处理策略 |

### LegalTagConfig

每个 `legalTags` 条目可为字符串或对象：

```typescript
type LegalTagConfig = string | { name: string; confirmAt: 'open' | 'close' };
```

- 字符串简写 → 等同于 `{ name: 'tagname', confirmAt: 'close' }`
- `{ name: 'think', confirmAt: 'open' }` → 开标签即输出业务事件，内容流式更新

### ErrorStrategy

| 模式 | 说明 |
|------|------|
| `strict` | 遇到 XML 语法错误立即抛出异常 |
| `lenient` | 跳过错误字符，发出 error 事件，继续解析（默认） |
| `silent` | 跳过错误字符，不报告 |

## 特殊场景

**自闭合标签**：支持 `<br/>` 和 `<br />`（含空格变体）。

**属性引号**：支持双引号和单引号属性值，属性值内可包含另一种引号。

**嵌套深度限制**：默认只解析 1 层。超出 `maxNestingDepth` 的标签保留为原始 XML 文本。

## License

ISC
