from collections.abc import AsyncIterable

from fastapi import HTTPException
import tortoise
import tortoise.fields
from app.controller.ai import torExceptions
from app.models.agent import AIAgent, AIAgentConservation
from app.models.assignment import Assignment
from app.schemas.agent import AIAgentEvent


class AIAgentController:
    """AI Agent 相关接口"""

    @classmethod
    async def create_conversation(cls, assign_id: str, user_id: str) -> str:
        """创建新的对话记录"""
        #~~ 验证 user_id 授权状态，这里暂时只检查用户是否存在，应该通过 middleware 实现
        try:
            _assign:Assignment = await Assignment.get(id=assign_id)
        except torExceptions.DoesNotExist:
            raise HTTPException(status_code=404, detail="请求了不存在的作业 ID")

        conversation = await AIAgentConservation.create(
            assign_id=assign_id,
            user_id=user_id,
            title="新的对话",
            events=[]
        )
        return conversation.id

    @classmethod
    async def list_conversations(cls, assign_id: str, user_id: str):
        """列出用户在该作业下的所有对话记录"""
        conversations = await AIAgentConservation.filter(assign_id=assign_id, user_id=user_id, deleted_at=None).order_by("-updated_at").values("id", "title", "created_at", "updated_at")
        return conversations

    @classmethod
    async def delete_conversation(cls, conversation_id: str, assign_id: str, user_id: str):
        """删除对话记录（软删除）"""
        conversation = await AIAgentConservation.filter(id=conversation_id, assign_id=assign_id, user_id=user_id, deleted_at=None).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")
        conversation.deleted_at = tortoise.fields.DatetimeField.now()
        await conversation.save()
        return {"message": "对话记录已删除"}

    @classmethod
    async def handle_append_event(cls, conversation_id: str, assign_id: str, user_id: str, event: AIAgentEvent) -> AsyncIterable[str]:
        """接收前端新 event 请求，验证后交由 AIAgent 处理。名称稍误解，同时执行 append_event 持久化与请求 AI 生成"""
        conversation = await AIAgentConservation.filter(id=conversation_id, assign_id=assign_id, user_id=user_id, deleted_at=None).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")

        try:
            await AIAgent.append_event(conversation, event)
            return await AIAgent.request_ai_from_event_stream(conversation.events)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"新增事件失败: {str(e)}")

