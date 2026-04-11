# Agent API 规范

本文档描述当前后端已经实现的 Matrix Agent 相关接口，包含请求方法、路径、请求负载、返回结构和示例。

## 约定

1. 当前大部分接口通过请求头传入 `user_id`。
2. `GET /agent/conversations/{conversation_id}/stream` 为了兼容浏览器 `EventSource`，仍然通过 query 参数传 `user_id`。
3. 会话事件采用 append-only 模式持久化。
4. `POST /agent/event` 虽然路径是单数 `event`，但请求体里传的是 `MatrixAgentEvent[]`，因为它表达的是“一次追加动作中的一批事件”。
5. `POST /agent/stream` 不持久化任何会话数据，只代理模型流式输出，供前端 loop 使用。

## 数据结构

### MatrixAgentEvent

```json
{
  "type": "user_message | think | tool_call | tool_result | final | turn_end",
  "payload": {}
}
```

### TurnEnd payload

```json
{
  "reason": "completed | aborted | page_unload | max_turn_limit_reached | tool_retry_limit_reached | client_error | server_error",
  "detail": "可选的补充说明"
}
```

### ConversationSummary

```json
{
  "conversation_id": "string",
  "title": "string",
  "created_at": "2026-04-08T12:00:00Z",
  "updated_at": "2026-04-08T12:05:00Z"
}
```

### Conversation

```json
{
  "conversation_id": "string",
  "title": "string",
  "created_at": "2026-04-08T12:00:00Z",
  "updated_at": "2026-04-08T12:05:00Z",
  "events": [
    {
      "type": "user_message",
      "payload": {
        "content": "你能读取我当前选中的代码吗？"
      }
    }
  ]
}
```

## 1. 创建会话

- 方法：`POST`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/conversations`
- Header：
  - `user_id: string`

### 请求体

无。

### 返回示例

```json
{
  "conversation_id": "6c4d06eb-40fb-4ea5-98b5-df16bb9d23c9",
  "title": "新的对话",
  "created_at": "2026-04-08T12:00:00Z",
  "updated_at": "2026-04-08T12:00:00Z",
  "events": []
}
```

## 2. 列出作业下的会话

- 方法：`GET`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/conversations`
- Header：
  - `user_id: string`

### 返回示例

```json
[
  {
    "conversation_id": "6c4d06eb-40fb-4ea5-98b5-df16bb9d23c9",
    "title": "修复 main.cpp 边界问题",
    "created_at": "2026-04-08T12:00:00Z",
    "updated_at": "2026-04-08T12:05:00Z"
  }
]
```

## 3. 读取单个会话

- 方法：`GET`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}`
- Header：
  - `user_id: string`

### 返回示例

```json
{
  "conversation_id": "6c4d06eb-40fb-4ea5-98b5-df16bb9d23c9",
  "title": "修复 main.cpp 边界问题",
  "created_at": "2026-04-08T12:00:00Z",
  "updated_at": "2026-04-08T12:05:00Z",
  "events": [
    {
      "type": "user_message",
      "payload": {
        "content": "你能读取我当前选中的代码吗？"
      }
    },
    {
      "type": "tool_call",
      "payload": {
        "callId": "call-1",
        "toolName": "read_selection",
        "input": [
          "main.cpp",
          "L1:C1-L3:C1"
        ]
      }
    },
    {
      "type": "tool_result",
      "payload": {
        "callId": "call-1",
        "success": true,
        "output": "int main() {}"
      }
    },
    {
      "type": "final",
      "payload": {
        "content": "这里是最终回答"
      }
    }
  ]
}
```

## 4. 更新会话标题

- 方法：`PATCH`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}/title`
- Header：
  - `user_id: string`

### 请求体

```json
{
  "title": "修复 main.cpp 边界问题"
}
```

### 成功返回

状态码 `200`，无响应体约束。

## 5. 删除会话

- 方法：`DELETE`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}`
- Header：
  - `user_id: string`

### 成功返回

状态码 `200`，无响应体约束。

说明：

1. 当前删除为软删除。
2. 被删除的会话不会出现在列表接口中。

## 6. 追加事件

- 方法：`POST`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/event`
- Header：
  - `user_id: string`

### 请求体

```json
{
  "conversation_id": "6c4d06eb-40fb-4ea5-98b5-df16bb9d23c9",
  "expected_event_count": 2,
  "events": [
    {
      "type": "think",
      "payload": {
        "content": "先分析一下当前问题。"
      }
    },
    {
      "type": "tool_call",
      "payload": {
        "callId": "call-2",
        "toolName": "read_editor",
        "input": [
          "main.cpp"
        ]
      }
    }
  ]
}
```

### 为什么这里是 `MatrixAgentEvent[]`

因为前端不会逐 token 持久化，而是按语义阶段提交一小批事件，例如：

1. `[user_message]`
2. `[think]`
3. `[tool_call]`
4. `[tool_result]`
5. `[final, turn_end]`

因此这个接口表达的是“一次 append 动作”，而不是“单条 event 上传”。

### 成功返回

状态码 `200`，无响应体约束。

### 冲突返回

当 `expected_event_count` 与后端实际事件数不一致时，返回 `409 Conflict`。

示例：

```json
{
  "detail": "expected_event_count mismatch: expected 2, got 4"
}
```

## 7. 会话流式对话

- 方法：`GET`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}/stream`
- Query：
  - `user_id: string`

### 说明

1. 该接口基于当前会话已经持久化的 `events` 生成一轮最小的流式对话回复。
2. 当前实现仅负责“对话式流式回答”，不包含完整 agent loop。
3. 前端应在用户消息 append 成功后，再调用该接口拉取流式文本。

### 返回

返回 `text/event-stream`。

### 事件格式

```text
data: {"chunk":"你"}

data: {"chunk":"好"}

event: complete
data: {"content":"你好"}
```

## 8. 模型消息流式代理

- 方法：`POST`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/stream`
- Header：
  - `user_id: string`

### 请求体

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are Matrix Agent..."
    },
    {
      "role": "user",
      "content": "请读取当前代码"
    }
  ]
}
```

### 说明

1. 该接口不持久化任何会话数据。
2. 该接口用于前端 agent loop 自主构建 messages 后发起流式模型请求。
3. 允许的 `role`：
   - `system`
   - `user`
   - `assistant`
   - `tool`
4. `tool_call_id` 仅在 `role = tool` 时按需携带。

### 返回

返回 `text/plain` 分块流。

## 错误码约定

### `404 Not Found`

适用场景：

1. 指定作业不存在。
2. 指定会话不存在。
3. 会话已被软删除。

### `409 Conflict`

适用场景：

1. `appendEvents` 时 `expected_event_count` 不匹配。

### `500 Internal Server Error`

适用场景：

1. 后端保存事件失败。
2. 其他未处理异常。

## 当前实现边界

1. 当前后端 `append /event` 只负责持久化事件，不负责在后端执行完整 agent loop。
2. 原始模型流到 `MatrixAgentEvent` 的转换由前端 runtime 负责。
3. 后端存储的是已经转换好的业务事件流，而不是原始模型协议数据。
4. `conversation stream` 只负责根据已持久化会话生成流式自然语言回复，前端仍需要在流式完成后自行追加 `final` / `turn_end`。
5. `agent/stream` 只做模型流式代理，不做持久化。
