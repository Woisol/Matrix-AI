# 关于 Matrix Agent 的一些构想
## 零碎 Idea
1. 应该主要在客户端(前端)处理工具因为代码数据主要在前端，涉及到后端数据的再手动请求
   2. ~~但对话依然请求后端由后端~~
2. 全部在前端处理？历史记录额外请求后端保存？
3. 用户个人 prompt
4. 用户 skill？？？
5. 艹如果 agent 能写的话要做好回溯点😨
6. 要实现 abort，加上 AbortController
7. 工具列表？让用户手动选择能使用哪些工具
8. BYOK Bring your own key，支持自己输入 baseUrl 和 api key

## 边界
1. 和现有的 AI 分析一样，只能在截止 / 提交满分后才能使用

## 需要的工具
> ✅ 代表已经实现 / 已经有较好的接口容易实现
1. 代码读✅
2. 选择的代码读
3. 代码写✅
4. 代码执行(接入 playground)
5. 题目信息读取
6. 题目答案读取
7. 联网？
7. context 7？？？

1. read_problem_info
2. read_problem_answer(确实，读答案可以单独关比较好)
3. read_editor(本身是一个工具，也是前端工具列表中的文案，实际控制的工具权限还包括下面的工具)
   1. read_selection
4. write_editor
5. playground(code_execution)
6. web_search
7. set_conversation_title

## 大致实现
### General
1. 必须狠狠参考 Claude Code 源码😡
2. Agent loop，
### 前端
1. 在 AI 分析 右边加上 tab，title: Agent

## 关于 Agent Loop 实现
1. cc： Claude Code 的公开信息其实很明确地在表达一件事：loop 应该跟工具宿主放在一起，而不是只跟 UI 放在一起。
   - Anthropic 官方把 Claude Code定义为一个“lives in your terminal”的 agenticcoding system，也就是它活在本地宿主里，不是单纯的云端聊天界面。
   - Claude Agent SDK 官方又明确说，它提供的是“the same tools, agent loop, andcontext management that power Claude Code”。这说明对外最可靠的参考，不是去猜内部源码，而是看 SDK 文档暴露出来的架构约束。
   - 官方的 loop 文档也写得很直白：prompt -> Claude 决策 -> 请求工具 -> host 执行工具 -> 把结果再喂回 Claude -> 重复直到结束。也就是说，真正掌控 loop 的一方，必须是能执行工具的宿主。
   - 官方会话文档还说明，session 默认是写到本地磁盘，并且跟 cwd 和当前机器绑定；跨机器恢复要么搬 session 文件，要么自己把关键状态提炼出来重新喂给新session。
   - 权限、MCP、skills、settings 也都是宿主侧配置；甚至官方还明确写了 Claude Code的 internal system prompt 不公开。这意味着我们没法也不该把“研究源码”当成唯一依据，更该看它公开出来的宿主模型。
   - 另外，Claude 还专门做了 file checkpointing 来支持回滚，但它也承认只能覆盖Write/Edit 这类受控写入，不能覆盖任意 shell 写文件。这和你文档里说的“agent能写就必须有回溯点”高度一致。
2. cc：三种方案对比
   1. 纯前端 loop
   优点是最贴近编辑器，read_selection / write_editor / AbortController 都最自然，交互延迟也最低。\
   问题是浏览器 tab 不是 Claude Code 那种稳定宿主：刷新、切页、断线、浏览器回收、\
   权限隔离，都会让长会话和可恢复性变差。再加上你们已经要做数据库持久化，纯前端会让“会话权威状态”变得很别扭。

   2. 纯后端 loop
   优点是持久化、审计、重放、会话恢复、工具权限、远程工具整合都最顺。
   问题是编辑器工具会变得难受很多，因为后端天然拿不到“当前未保存代码”“当前选区”“立即写回编辑器并制造本地撤销栈”这些前端本地状态。你最后一定会反过来做一层浏览器 RPC。

   3. 混合
   这是我认为最像 Claude Code“宿主驱动”精神、同时又贴合你们产品事实的方案。
   这里我在做一个设计推断：Matrix 里真正的“工具宿主”其实是两半，一半是浏览器里的编辑器宿主，一半是后端的服务宿主。所以最合理的做法不是谁全吃，而是让两边各自拥有最贴近自己的工具，再由一个权威 loop 去编排。
