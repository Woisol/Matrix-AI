# Agent API 规范

本文档描述当前后端已经实现的 Matrix Agent 相关接口，包含请求方法、路径、请求负载、返回结构和示例。

## 约定

1. 当前接口中的 `user_id` 仍然通过 query 参数传入，属于临时联调方案。
2. 后续如果接入鉴权，推荐使用 FastAPI `Depends()` 从认证上下文中注入当前用户，而不是继续由前端显式传 `user_id`。
3. 会话事件采用 append-only 模式持久化。
4. `POST /agent/event` 虽然路径是单数 `event`，但请求体里传的是 `MatrixAgentEvent[]`，因为它表达的是“一次追加动作中的一批事件”。

## 数据结构

### MatrixAgentEvent

```json
{
  "type": "user_message | think | tool_call | tool_result | assistant_final | turn_end",
  "payload": {}
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
- Query：
  - `user_id: string`

### 请求体

无。

### 返回

返回完整会话对象，初始标题为 `新的对话`，事件列表为空。

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
- Query：
  - `user_id: string`

### 返回

返回当前用户在指定作业下的未删除会话列表，按 `updated_at` 倒序排列。

### 返回示例

```json
[
  {
    "conversation_id": "6c4d06eb-40fb-4ea5-98b5-df16bb9d23c9",
    "title": "修复 main.cpp 边界问题",
    "created_at": "2026-04-08T12:00:00Z",
    "updated_at": "2026-04-08T12:05:00Z"
  },
  {
    "conversation_id": "6f5a7325-7a1d-49e9-a20f-2662490dc5d1",
    "title": "新的对话",
    "created_at": "2026-04-08T11:00:00Z",
    "updated_at": "2026-04-08T11:00:00Z"
  }
]
```

## 3. 读取单个会话

- 方法：`GET`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}`
- Query：
  - `user_id: string`

### 返回

返回完整会话对象及其 `events`。

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
    }
  ]
}
```

## 4. 更新会话标题

- 方法：`PATCH`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}/title`
- Query：
  - `user_id: string`

### 请求体

```json
{
  "title": "修复 main.cpp 边界问题"
}
```

### 返回

```json
{
  "message": "对话标题已更新"
}
```

## 5. 删除会话

- 方法：`DELETE`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}`
- Query：
  - `user_id: string`

### 返回

```json
{
  "message": "对话记录已删除"
}
```

说明：

1. 当前删除为软删除。
2. 被删除的会话不会出现在列表接口中。

## 6. 追加事件

- 方法：`POST`
- 路径：`/courses/{course_id}/assignments/{assign_id}/agent/event`
- Query：
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

### 字段说明

- `conversation_id`
  - 要追加事件的会话 ID。
- `expected_event_count`
  - 前端认为当前会话中已经持久化的事件数量。
  - 后端会在追加前检查当前数据库中的事件数是否一致。
- `events`
  - 本次要顺序追加的一批事件。

### 为什么这里是 `MatrixAgentEvent[]`

因为前端不会逐 token 持久化，而是按语义阶段提交一小批事件，例如：

1. `[user_message]`
2. `[think]`
3. `[tool_call]`
4. `[tool_result]`
5. `[assistant_final, turn_end]`

因此这个接口表达的是“一次 append 动作”，而不是“单条 event 上传”。

### 成功返回

```json
{
  "message": "事件追加成功"
}
```

### 冲突返回

当 `expected_event_count` 与后端实际事件数不一致时，返回 `409 Conflict`。

示例：

```json
{
  "detail": "expected_event_count mismatch: expected 2, got 4"
}
```

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

1. 当前后端 `append /event` 只负责持久化事件，不负责在后端执行 agent loop。
2. 原始模型流到 `MatrixAgentEvent` 的转换仍应由前端 runtime 负责。
3. 后端存储的是已经转换好的业务事件流，而不是原始模型协议数据。
