from collections.abc import AsyncIterable
from tortoise import fields
from tortoise.models import Model

from app.models.ai import AI
from app.schemas.agent import AIAgentEvent, AIAgentEventType

class AIAgentConservation(Model):
    """AI Agent 对话记录模型"""
    id = fields.CharField(max_length=50, pk=True, description="对话记录ID，")
    assign_id = fields.CharField(max_length=50, description="关联的作业ID")
    user_id = fields.CharField(max_length=50, description="用户ID")
    title = fields.CharField(max_length=200, description="会话标题")
    deleted_at = fields.DatetimeField(null=True, description="删除时间")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")
    events = fields.JSONField(description="对话内容，包含用户输入和AI回复的列表")

    class Meta:
        table = "ai_agent_conversations"
        table_description = "AI Agent 对话记录表"
        indexes = [
            ("assign_id",),  # 按作业ID查询对话记录
        ]
class AIAgent:
    """AI Agent 实现，主要负责转发模型数据以及持久化"""
    @classmethod
    async def append_event(cls, conversation: AIAgentConservation, event: AIAgentEvent) -> None:
        """接收前端新 event 请求，转发到实际模型并持久化存储"""
        # JSONField 里只存可序列化字典，避免后续读取时对象/字典混用。
        conversation.events.append(event.model_dump())
        try:
            await conversation.save()
            # await conversation.save().throw(tortoise.exceptions.IncompleteInstanceError,None,(){})
        except Exception as e:
            raise Exception("保存事件失败：" + str(e))
        return

    @classmethod
    async def request_ai_from_event_stream(cls, events: list[AIAgentEvent]) -> AsyncIterable[str]:
        """接收前端新 event 请求，转发到实际模型并持久化存储"""
        messages = []
        for event in events:
            payload = event.get("payload", {}) if isinstance(event, dict) else {}
            content = payload.get("content", "")

            match event.type:
                case AIAgentEventType.USER_MESSAGE | AIAgentEventType.TOOL_CALL:
                    messages.append({"role": "user", "content": content})
                case AIAgentEventType.THINK | AIAgentEventType.ASSISTANT_FINAL:
                    messages.append({"role": "assistant", "content": content})
                case AIAgentEventType.TOOL_RESULT:
                    # OpenAI tool 角色通常要求 tool_call_id；缺失时降级为 user 内容避免请求报错。
                    # 怪不得 5.4 一直说要有个 callId 原来是官方 SDK 的 tool 角色要求
                    tool_call_id = payload.get("callId")
                    if tool_call_id:
                        messages.append({"role": "tool", "content": content, "tool_call_id": tool_call_id})
                    else:
                        messages.append({"role": "user", "content": content})

        # ？这里又不用 await
        """关于用不用 await
            对于 async 的函数，直接调用返回的协程 coroutine 对象，如果不 await 就不会执行函数体内的代码，而是直接返回这个 coroutine 对象。
            而这里的 get_response_stream 是一个 async generator function，尽管 async 但调用直接得到 async generator 对象，后续提供给 EventSourceResponse 迭代，不要 await
        """
        return AI.get_response_stream(messages)

