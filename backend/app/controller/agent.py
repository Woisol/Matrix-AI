import json
from datetime import datetime, timezone
import uuid
from collections.abc import AsyncGenerator

from fastapi import HTTPException
from app.controller.ai import torExceptions
from app.models.agent import AIAgent, AIAgentConservation
from app.models.assignment import Assignment
from app.schemas.agent import AIAgentEvent


class AIAgentController:
    """AI Agent 相关接口"""

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
    async def create_conversation(cls, assign_id: str, user_id: str):
        """创建新的对话记录"""
        #~~ 验证 user_id 授权状态，这里暂时只检查用户是否存在，应该通过 middleware 实现
        try:
            _assign:Assignment = await Assignment.get(id=assign_id)
        except torExceptions.DoesNotExist:
            raise HTTPException(status_code=404, detail="请求了不存在的作业 ID")

        conversation = await AIAgentConservation.create(
            id=str(uuid.uuid4()),
            assign_id=assign_id,
            user_id=user_id,
            title="新的对话",
            events=[]
        )
        return cls._serialize_conversation(conversation)

    @classmethod
    async def list_conversations(cls, assign_id: str, user_id: str):
        """列出用户在该作业下的所有对话记录"""
        conversations = await AIAgentConservation.filter(assign_id=assign_id, user_id=user_id, deleted_at=None).order_by("-updated_at").values("id", "title", "created_at", "updated_at")
        return [cls._serialize_conversation_summary(conversation) for conversation in conversations]

    @classmethod
    async def get_conversation(cls, conversation_id: str, assign_id: str, user_id: str):
        """获取单个会话详情"""
        conversation = await AIAgentConservation.filter(
            id=conversation_id,
            assign_id=assign_id,
            user_id=user_id,
            deleted_at=None,
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")

        return cls._serialize_conversation(conversation)

    @classmethod
    async def delete_conversation(cls, conversation_id: str, assign_id: str, user_id: str):
        """删除对话记录（软删除）"""
        conversation = await AIAgentConservation.filter(id=conversation_id, assign_id=assign_id, user_id=user_id, deleted_at=None).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")
        conversation.deleted_at = datetime.now(timezone.utc)
        await conversation.save()
        return

    @classmethod
    async def update_conversation_title(cls, conversation_id: str, assign_id: str, user_id: str, title: str):
        """更新会话标题"""
        conversation = await AIAgentConservation.filter(
            id=conversation_id,
            assign_id=assign_id,
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
        assign_id: str,
        user_id: str,
        expected_event_count: int,
        events: list[AIAgentEvent],
    ):
        """按批次追加事件，仅负责持久化，不在后端执行 agent loop。"""
        conversation = await AIAgentConservation.filter(id=conversation_id, assign_id=assign_id, user_id=user_id, deleted_at=None).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")

        try:
            await AIAgent.append_events(conversation, expected_event_count, events)
            return
        except ValueError as e:
            # from expected_event_count mismatch
            raise HTTPException(status_code=409, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"新增事件失败: {str(e)}")

    @classmethod
    async def stream_conversation(
        cls,
        conversation_id: str,
        assign_id: str,
        user_id: str,
    ) -> AsyncGenerator[str, None]:
        """基于当前会话已持久化事件流，生成最小对话式流式回复。"""
        conversation = await AIAgentConservation.filter(
            id=conversation_id,
            assign_id=assign_id,
            user_id=user_id,
            deleted_at=None,
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="对话记录不存在")

        async def _stream() -> AsyncGenerator[str, None]:
            try:
                full_content = ""
                stream = await AIAgent.request_ai_from_event_stream(conversation.events)
                async for chunk in stream:
                    full_content += chunk
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"

                yield f"event: complete\ndata: {json.dumps({'content': full_content})}\n\n"
            except Exception as e:
                yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"

        return _stream()

