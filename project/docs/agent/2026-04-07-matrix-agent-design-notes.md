# Matrix Agent 设计记录（阶段性）

本文档用于记录当前已经讨论并拍板的设计结论，作为后续继续细化的工作底稿。

## 1. 产品入口与边界

1. `Agent` 作为作业页中与 `AI 分析` 并列的新 tab。
2. 与现有 AI 分析保持同一使用边界，只能在截止后或提交满分后开放。
3. 进入 `Agent` tab 后，不直接打开最近一次会话，而是先展示历史会话列表，由用户手动选择继续或新建。

## 2. 会话与持久化

1. 会话历史走后端持久化，而不是只存在前端内存或 `localStorage`。
2. 会话主标识语义采用：`assignmentId + userId + conversationUuid`。
3. 同一作业下允许存在多条 agent 对话。
4. 会话删除采用软删除，前端不再展示，但后端不立即物理删除。
5. 会话列表不按时间分组，但保留固定操作：
   - 新建对话
   - 重命名
   - 删除
6. 新建会话默认标题为“新对话”。
7. 首条消息发送后自动生成标题。
8. 增加内部工具 `set_conversation_title`，允许 agent 在对话目标明显变化时主动修改标题。
9. 历史列表只显示会话标题，不额外展示预览摘要。

当前持久化层的 conversation 顶层结构暂定为：

```ts
type MatrixAgentConversation = {
  conversationUuid: string
  assignmentId: string
  userId: string
  title: string
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  events: MatrixAgentEvent[]
}
```

补充说明：

1. `deletedAt: null` 表示未删除，有值表示软删除。
2. `createdAt` 和 `updatedAt` 保留在 conversation 顶层。
3. 当前版本不额外保存列表预览字段。
4. 当前版本不在 conversation 中保存运行态 `status`。
5. 当前版本不在 conversation 中保存工具开关快照。

## 3. 总体架构方向

1. 当前主方向为“前端主导 + 后端服务化支撑”。
2. `agent loop` 跑在前端，由前端负责：
   - 消息组织
   - 工具编排
   - 流式输出
   - 中止控制
3. 后端主要负责：
   - 模型请求转发
   - 历史会话持久化
   - 题目信息、题目答案、playground 等服务型接口
4. 题目相关和 playground 等能力，虽然底层依赖后端 API，但在 agent 视角中仍然表现为“前端发起的工具调用”。

## 4. 工具开关与工具模型

1. 工具开关面向用户能力分组设计，实际执行按内部原子工具区分。
2. 工具开关使用全局默认配置。
3. 默认全部开启。
4. 工具开关持久化到 `localStorage`。
5. 运行中允许修改工具开关，但只对下一轮消息生效，不影响当前正在执行的这一轮。

当前用户可见工具集合如下：

1. `read_problem_info`
2. `read_problem_answer`
3. `read_editor`
4. `write_editor`
5. `playground`
6. `web_search`

补充说明：

1. `read_problem_info` 和 `read_problem_answer` 在权限上明确拆开。
2. 前端工具列表中只暴露一个 `read_editor`，但它实际控制两个内部工具：
   - `read_editor`
   - `read_selection`
3. `set_conversation_title` 属于内部工具，不出现在工具开关列表中。
4. `checkpoint` 不显式作为工具暴露，而是由 `write_editor` 自动处理。

## 5. 写编辑器与回退机制

1. 只要 `write_editor` 开关开启，agent 就允许直接写入编辑器。
2. 不采用“每次写入都二次确认”的交互。
3. 安全性主要依赖回溯与回退能力，而不是确认弹窗。
4. `write_editor` 首阶段只支持两种粒度：
   - 整篇替换
   - 指定 range 替换
5. `write_editor` 每次执行前都应自动创建回溯点。
6. 回退能力同时支持两种方式：
   - 编辑器原生 `Ctrl+Z`
   - 工具卡片级“回退这次修改”

## 6. 对话与时间线展示

1. 一轮 assistant 回复以一个整体消息卡片承载。
2. 工具调用和工具结果以卡片形式嵌入 assistant 消息卡片内部。
3. `think` 内容允许展示。
4. `think` 默认折叠成类似 `> think` 的形式。
5. 只折叠 `think` 文本本身，工具调用与工具结果仍保持外显。
6. `read_problem_answer` 不需要额外的“已污染”或“已参考答案”持续标记，只需在工具卡片中展示调用事实。
7. assistant 卡片内部严格按事件时间顺序展示，不做分区重排。
8. 连续相邻的 `think` 会在展示层合并成一个折叠块；一旦中间出现工具调用或工具结果，则后续 `think` 重新开始新的折叠块。
9. 一个工具调用在展示层对应一张工具卡片：
   - `tool_call` 出现时先渲染“调用中”的卡片骨架
   - `tool_result` 返回后原地补全
   - 如果最终没有 `tool_result`，则显示特定文案说明其未完成或已中断
10. 工具卡片默认只显示真实内部工具名、当前状态和一小段结果摘要。
11. 工具卡片标题直接使用真实内部工具名，例如 `read_selection`、`write_editor`，不额外维护展示名映射。
12. 工具卡片摘要默认取工具输出开头；如果没有输出，则退化为成功/失败状态文案。
13. 如果一轮不存在 `output`，assistant 卡片底部仍然要显示系统态收尾文案，而不是伪装成 agent 自然语言回复。

## 7. Agent Loop 运行规则

1. 单轮请求采用全自动执行模式。
2. 用户发起请求后，agent 会连续思考、连续调用工具，直到：
   - 产出最终回复
   - 命中停止条件
   - 被用户中止
3. `AbortController` 是必需能力，不是附加能力。
4. 运行保护采用双阈值：
   - 最大步数
   - 连续失败阈值
5. 任一阈值触发时，agent 自动停止，并输出“做到哪了 / 卡在哪 / 建议下一步”的总结。
6. 工具失败时，UI 只忠实展示失败结果，不额外提供系统级策略建议，是否重试或换策略由 agent 自行决定。

## 8. 会话运行态约束

1. 同一时间只允许一个会话处于运行中。
2. 切换到其他会话前，必须先停止当前正在运行的会话。
3. 页面刷新、关闭或路由离开都会直接中断当前运行。
4. 如果离开时正在生成，需要弹出提示。
5. 页面返回后不会自动恢复执行，只展示已持久化的历史内容。
6. 运行中允许用户继续编辑输入框草稿。
7. 运行中不允许发送下一条消息，必须等当前轮结束或被中止。

## 9. 上下文与持久化策略

1. 每轮开始默认只注入最小元信息。
2. 题面内容、题目答案、编辑器全文、选区内容均通过工具按需读取，不默认预灌入上下文。
3. 会话采用增量持久化策略，但不是所有细粒度内容都实时逐段落库。
4. 以下内容及时保存：
   - 用户消息
   - 工具调用
   - 工具结果
   - 最终回复
5. `think` 内容按阶段整体保存，不做逐 token 级别持久化。
6. `think` 和 `output` 均允许在前端内存中流式展示，但落库时以阶段完成后的完整文本为准。
7. 工具调用参数由 runtime 负责解析和理解；当前 event 存储只保留极简可回放的参数留痕。

## 10. 事件流模型

当前持久化采用扁平 `event` 流模型：

1. 所有 event 统一存储在 `conversation.events` 数组中。
2. 新事件仅做 append。
3. 事件先后顺序由 `events` 数组本身定义。
4. 当前版本不为 event 单独保存 `createdAt`。
5. 当前版本不为 event 单独保存 `turnId`。

展示层使用以下归属规则组装 assistant 卡片：

1. 两条 `user_message` 之间的所有非 user event，归为同一轮 agent 回复。
2. 一轮内允许存在多个 `think`。
3. 一轮内最多存在一个 `output`。
4. 每轮必须以一个 `turn_end` 收尾。

当前最小 event schema 暂定为：

```ts
type MatrixAgentEvent =
  | {
      type: 'user_message'
      payload: {
        content: string
      }
    }
  | {
      type: 'think'
      payload: {
        content: string
      }
    }
  | {
      type: 'tool_call'
      payload: {
        callId: string
        toolName: string
        input: string[]
      }
    }
  | {
      type: 'tool_result'
      payload: {
        callId: string
        success: boolean
        output: string
      }
    }
  | {
      type: 'output'
      payload: {
        content: string
      }
    }
  | {
      type: 'turn_end'
      payload: {
        reason:
          | 'completed'
          | 'aborted'
          | 'page_unload'
          | 'max_turn_limit_reached'
          | 'tool_retry_limit_reached'
          | 'client_error'
          | 'server_error'
      }
    }
```

补充说明：

1. `tool_call` 与 `tool_result` 通过 `callId` 配对。
2. `tool_call` 允许没有对应的 `tool_result`。
3. `tool_result.success` 作为前端判断卡片成功/失败态的统一字段。
4. `tool_result.output` 当前统一压成单个字符串。
5. `user_message`、`think`、`output` 当前都只保存 `content: string`。
6. `max_turn_limit_reached` 与 `tool_retry_limit_reached` 这两类结束原因应尽量补一条 `output` 收尾。
7. `page_unload`、`aborted`、`client_error`、`server_error` 不强求补 `output`。

## 11. 运行态与持久化边界

1. conversation schema 只负责持久化历史，不承担当前运行态管理。
2. 当前正在运行的会话、是否正在中止、是否允许离开页面等状态，应由前端单独的 runtime 变量或 store 管理。
3. 由于同一时间只允许一个会话运行，因此运行态天然更适合放在会话持久化结构之外。
4. 工具开关是全局本地偏好，不属于单条 conversation 的历史事实，因此也不写入 conversation。

## 12. 暂缓讨论项

以下内容确认属于后续扩展或后续优化，本轮不继续展开：

1. `BYOK`
   - 允许用户自行输入 `baseUrl` 与 `apiKey`
   - 但属于后续扩展，不纳入当前主线
2. `system_prompt`
   - 会先给 agent 一个“面向学生使用场景”的基本角色定义
   - 但具体教学风格、提示策略后续再慢慢优化
3. `context7`
   - 目前仍处于备选工具阶段，暂未并入本轮已拍板集合

## 13. 下一步建议继续细化的主题

当前最值得继续压实的下一块是：

1. 前端 runtime 状态机
2. 会话切换、停止、中止中的状态边界
3. Agent loop 的前端编排细节
