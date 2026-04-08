from collections.abc import AsyncIterable
from fastapi import HTTPException
from regex import T
from tortoise import fields
import tortoise
import tortoise.exceptions
from tortoise.models import Model

from backend.app.schemas.agent import AIAgentEvent, AIAgentEventType
from .ai import AI
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
        conversation.events.append(event)
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
            match event.type:
                case AIAgentEventType.USER_MESSAGE | AIAgentEventType.TOOL_CALL | AIAgentEventType.TOOL_RESULT:
                    messages.append({"role": "user", "content": event.payload.get("content", "")})
                    # input.
                case AIAgentEventType.THINK | AIAgentEventType.ASSISTANT_FINAL:
                    messages.append({"role": "assistant", "content": event.payload.get("content", "")})

        response = AI.get_response_stream(messages)
        return response
