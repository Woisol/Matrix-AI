# Agent Loop 实现逻辑

本文档描述当前 Matrix Agent Loop 首版的实际实现逻辑，方便后续继续扩展和排查问题。

## 1. 当前目标

当前 loop 的目标不是完整 coding agent，而是先跑通一条稳定的前端主导链路：

1. 用户发送一条 `user_message`
2. 前端重建当前会话的模型 messages
3. 前端请求后端模型流式代理接口
4. 前端按 XML 协议流式解析模型输出
5. 根据解析结果生成 `think / tool_call / tool_result / final / turn_end`
6. 语义阶段结束后按批次持久化到后端

## 2. 入口与职责分层

### 页面入口

入口仍然在：

- `frontend/src/app/pages/assignment/assigment.component.ts`
- 方法：`pushNewAgentEvent(event)`

但页面本身不再承载 loop 逻辑，只负责把用户消息转交给 loop service。

### Loop 主体

loop 主体现在在：

- `frontend/src/app/services/assign/agent-loop.service.ts`

这里负责：

1. 构建 system prompt
2. 把 `conversation.events` 转成模型 messages
3. 发起流式请求
4. 增量解析 XML
5. 按工具名分发本地工具
6. 生成并持久化新事件

### 后端职责

后端当前只负责两类能力：

1. 会话和事件持久化
2. 模型流式代理

对应新增接口：

- `POST /courses/{course_id}/assignments/{assign_id}/agent/stream`

这个接口不做 loop，不做持久化，只是把前端提供的 `messages` 原样送给模型并流式返回。

## 3. 模型消息构建

每次 loop 请求模型前，都会重新构建完整消息列表。

消息列表由两部分组成：

1. `system` 消息
2. 从 `conversation.events` 重建出来的历史消息

### system prompt

system prompt 不进入持久化 event。

当前实现里，每次请求模型时都会重新注入 system prompt，原因是当前 conversation state 仍然由前端自己重建，而不是由服务端托管。

system prompt 主要约束：

1. 角色定位：`Matrix Agent`
2. 输出协议：只能使用 `<think> / <tool_call> / <final>`
3. `tool_call` 必须输出合法 JSON
4. 一次响应中只要出现 `tool_call`，就不允许再出现 `final`
5. 当前启用的工具列表

### 从 event 重建模型消息

当前约定如下：

1. `user_message`
   - 转为普通 `user` 消息

2. `think`
   - 转为 assistant 消息，内容包装成：
   - `<think>...</think>`

3. `tool_call`
   - 转为 assistant 消息，内容包装成：
   - `<tool_call>{"toolName":"...","input":[...]}</tool_call>`

4. `tool_result`
   - 转为 user 消息，内容包装成：
   - `<tool_result>{"callId":"...","success":true,"output":"..."}</tool_result>`

5. `final`
   - 转为 assistant 消息，内容包装成：
   - `<final>...</final>`

6. `turn_end`
   - 不参与模型消息重建

## 4. XML 流式解析

当前 parser 是一个增量状态机。

### 支持的标签

1. `<think>...</think>`
2. `<tool_call>...</tool_call>`
3. `<final>...</final>`

### 当前解析策略

#### think

1. 一旦读到 `<think>`，立刻进入 `think` 块状态
2. 块未闭合前，内容会作为临时 `think` 事件本地更新
3. 遇到 `</think>` 时，固化成正式 `think` event
4. 再按 `[think]` 这个批次持久化

#### final

1. 一旦读到 `<final>`，立刻进入 `final` 块状态
2. 块未闭合前，内容会作为临时 `final` 事件本地更新
3. 遇到 `</final>` 时，认为本轮已经拿到最终答复
4. 本轮最终按 `[final, turn_end]` 一起持久化

#### tool_call

1. 只有在读到完整的 `</tool_call>` 后才会尝试解析
2. 标签内部内容要求是 JSON
3. JSON 结构当前约定：

```json
{
  "toolName": "read_editor",
  "input": []
}
```

## 5. 工具分发

当前工具分发由 `AgentLoopService` 内部的注册表 `Map` 负责。

首版只接了只读工具：

1. `read_editor`
2. `read_selection`
3. `read_problem_info`
4. `read_problem_answer`

每个工具 handler 当前都返回：

```ts
{
  success: boolean
  output: string
}
```

也就是说，首版工具结果仍然统一压成纯文本。

## 6. 持久化批次

当前 loop 仍然沿用 append-only event 流，并保持分阶段持久化。

默认批次如下：

1. `[user_message]`
2. `[think]`
3. `[tool_call]`
4. `[tool_result]`
5. `[final, turn_end]`

调用后端持久化时，仍带：

- `conversation_id`
- `expected_event_count`
- `events`

如果前后端事件数分叉，后端会返回 `409`。

## 7. 错误策略

### tool_call JSON 错误

如果 `<tool_call>` 内部 JSON 解析失败，不直接结束整轮。

而是：

1. 生成一个失败的 `tool_result`
2. `output` 里写明错误原因
3. 再进入下一轮模型请求，让模型自己修正调用格式

### 协议层错误

如果发生下面这类错误：

1. 标签外出现意外文本
2. `tool_call` 后又出现 `final`
3. 标签未闭合
4. 流结束时结构不完整

则按“最佳努力兜底”处理：

1. 能 salvage 的 `final` 文本尽量保留
2. 然后追加：

```json
{
  "type": "turn_end",
  "payload": {
    "reason": "client_error",
    "detail": "具体协议错误说明"
  }
}
```

### 运行上限

当前 loop 内部还保留两类上限保护：

1. `max_turn_limit_reached`
2. `tool_retry_limit_reached`

它们属于运行时安全阈值，不是协议错误。

## 8. 当前已知边界

1. 当前 loop 只读，不自动写编辑器。
2. `write_editor`、回溯点、abort 状态机还没有接入 loop。
3. `tool_result` 当前只保存字符串，不支持 richer 结构。
4. `read_problem_answer` 当前基于已有分析结果读取，不是独立后端答案接口。
5. 目前仍然使用前端重建 conversation state，而不是服务端托管会话状态。

## 9. 后续自然扩展方向

后续最自然的扩展顺序建议是：

1. 工具开关真正接入 `AgentLoopService`
2. `AbortController + running/aborting` 状态并入 loop
3. 把 `write_editor` 接入 dispatcher
4. 加入更严格的 XML 协议和 parser 测试
5. 如果字符串工具结果不够，再升级 runtime 内部的 richer tool result 抽象
