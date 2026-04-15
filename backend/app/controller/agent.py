from datetime import datetime, timezone
import uuid
from collections.abc import AsyncGenerator

from fastapi import HTTPException
from app.controller.ai import torExceptions
from app.models.agent import AIAgent, AIAgentConservation
from app.models.assignment import Assignment
from app.schemas.agent import AIAgentEvent
from app.models.ai import AI


class AIAgentController:
    """AI Agent 相关接口"""

    @classmethod
    async def _get_assignment_or_404(cls, assignment_id: str) -> Assignment:
        try:
            return await Assignment.get(id=assignment_id)
        except torExceptions.DoesNotExist as exc:
            raise HTTPException(status_code=404, detail="请求了不存在的作业 ID") from exc

    @classmethod
    def _serialize_conversation_summary(cls, conversation: AIAgentConservation | dict):
        if isinstance(conversation, dict):
            return {
                "conversation_id": conversation["id"],
                "title": conversation["title"],
                "created_at": conversation["created_at"],
                "updated_at": conversation["updated_at"],
            }

        return {
            "conversation_id": conversation.id,
            "title": conversation.title,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
        }

    @classmethod
    def _serialize_conversation(cls, conversation: AIAgentConservation):
        return {
            "conversation_id": conversation.id,
            "title": conversation.title,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
            "events": conversation.events,
        }

    @classmethod
    async def create_conversation(cls, assignment_id: str, user_id: str):
        """创建新的对话记录"""
        #~~ 验证 user_id 授权状态，这里暂时只检查用户是否存在，应该通过 middleware 实现
        assignment = await cls._get_assignment_or_404(assignment_id)

        conversation = await AIAgentConservation.create(
            id=str(uuid.uuid4()),
            assignment=assignment,
            user_id=user_id,
            title="新的对话",
            events=[]
        )
        return cls._serialize_conversation(conversation)

    @classmethod
    async def list_conversations(cls, assignment_id: str, user_id: str):
        """列出用户在该作业下的所有对话记录"""
        assignment = await cls._get_assignment_or_404(assignment_id)
        conversations = await assignment.agent_conversations.filter(
            user_id=user_id,
            deleted_at=None,
        ).order_by("-updated_at").values("id", "title", "created_at", "updated_at")
        return [cls._serialize_conversation_summary(conversation) for conversation in conversations]

    @classmethod
    async def get_conversation(cls, conversation_id: str, assignment_id: str, user_id: str):
        """获取单个会话详情"""
        assignment = await cls._get_assignment_or_404(assignment_id)
        conversation = await assignment.agent_conversations.filter(
            id=conversation_id,
            user_id=user_id,
            deleted_at=None,
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")

        return cls._serialize_conversation(conversation)

    @classmethod
    async def delete_conversation(cls, conversation_id: str, assignment_id: str, user_id: str):
        """删除对话记录（软删除）"""
        assignment = await cls._get_assignment_or_404(assignment_id)
        conversation = await assignment.agent_conversations.filter(
            id=conversation_id,
            user_id=user_id,
            deleted_at=None,
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")
        conversation.deleted_at = datetime.now(timezone.utc)
        await conversation.save()
        return

    @classmethod
    async def update_conversation_title(cls, conversation_id: str, assignment_id: str, user_id: str, title: str):
        """更新会话标题"""
        assignment = await cls._get_assignment_or_404(assignment_id)
        conversation = await assignment.agent_conversations.filter(
            id=conversation_id,
            user_id=user_id,
            deleted_at=None,
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")

        conversation.title = title.strip()
        await conversation.save()
        return

    @classmethod
    async def append_events(
        cls,
        conversation_id: str,
        assignment_id: str,
        user_id: str,
        expected_event_count: int,
        events: list[AIAgentEvent],
    ):
        """按批次追加事件，仅负责持久化，不在后端执行 agent loop。"""
        assignment = await cls._get_assignment_or_404(assignment_id)
        conversation = await assignment.agent_conversations.filter(
            id=conversation_id,
            user_id=user_id,
            deleted_at=None,
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")

        try:
            await AIAgent.append_events(conversation, expected_event_count, events)
            return
        except ValueError as e:
            # from expected_event_count mismatch
            raise HTTPException(status_code=409, detail=str(e)) from e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"新增事件失败: {str(e)}") from e

    @classmethod
    async def override_events(
        cls,
        conversation_id: str,
        assignment_id: str,
        user_id: str,
        events: list[AIAgentEvent],
    ):
        """强制覆盖会话事件，不校验当前事件数。"""
        assignment = await cls._get_assignment_or_404(assignment_id)
        conversation = await assignment.agent_conversations.filter(
            id=conversation_id,
            user_id=user_id,
            deleted_at=None,
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")

        try:
            await AIAgent.override_events(conversation, events)
            return
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"覆盖事件失败: {str(e)}") from e

    @classmethod
    async def create_checkpoint(cls, assignment_id: str, original_code: str):
        """创建对话回溯点"""
        assignment = await cls._get_assignment_or_404(assignment_id)
        checkpoint = await assignment.agent_checkpoints.create(
            id=str(uuid.uuid4()),
            original_code=original_code,
        )
        return checkpoint.id

    @classmethod
    async def get_checkpoint(cls, checkpoint_id: str, assignment_id: str):
        """获取对话回溯点详情"""
        assignment = await cls._get_assignment_or_404(assignment_id)
        checkpoint = await assignment.agent_checkpoints.filter(id=checkpoint_id).first()
        if not checkpoint:
            raise HTTPException(status_code=404, detail="回溯点不存在")

        return checkpoint.original_code
        # JSON

    @classmethod
    async def stream_messages(
        cls,
        assignment_id: str,
        user_id: str,
        messages: list[dict],
    ) -> AsyncGenerator[str, None]:
        """直接代理模型流式输出，供前端 loop 自主编排。"""
        await cls._get_assignment_or_404(assignment_id)

        async def _stream() -> AsyncGenerator[str, None]:
            async for chunk in AI.get_response_stream(messages):
                yield chunk

        return _stream()

