from fastapi import APIRouter, Header
from fastapi.responses import StreamingResponse

from app.controller.agent import AIAgentController
from app.schemas.agent import (
    AIAgentAppendEventsRequest,
    AIAgentCheckpointCreateRequest,
    AIAgentConversation,
    AIAgentConversationSummary,
    AIAgentStreamRequest,
    AIAgentConversationTitleUpdateRequest,
    AIAgentOverrideEventsRequest,
)


agent_route = APIRouter(tags=["agent"])


@agent_route.post("/courses/{course_id}/assignments/{assign_id}/agent/conversations", response_model=AIAgentConversation)
async def create_conversation(
    course_id: str,
    assign_id: str,
    user_id: str = Header("", alias="user_id"),
):
    """创建新的对话记录"""
    del course_id
    return await AIAgentController.create_conversation(assignment_id=assign_id, user_id=user_id)


@agent_route.get("/courses/{course_id}/assignments/{assign_id}/agent/conversations", response_model=list[AIAgentConversationSummary])
async def list_conversations(
    course_id: str,
    assign_id: str,
    user_id: str = Header("", alias="user_id"),
):
    """列出用户在该作业下的所有对话记录"""
    del course_id
    return await AIAgentController.list_conversations(assignment_id=assign_id, user_id=user_id)


@agent_route.get("/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}", response_model=AIAgentConversation)
async def get_conversation(
    course_id: str,
    assign_id: str,
    conversation_id: str,
    user_id: str = Header("", alias="user_id"),
):
    """获取单个对话详情"""
    del course_id
    return await AIAgentController.get_conversation(
        conversation_id=conversation_id,
        assignment_id=assign_id,
        user_id=user_id,
    )


@agent_route.patch("/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}/title")
async def update_conversation_title(
    course_id: str,
    assign_id: str,
    conversation_id: str,
    request: AIAgentConversationTitleUpdateRequest,
    user_id: str = Header("", alias="user_id"),
):
    """更新对话标题"""
    del course_id
    return await AIAgentController.update_conversation_title(
        conversation_id=conversation_id,
        assignment_id=assign_id,
        user_id=user_id,
        title=request.title,
    )


@agent_route.delete("/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}")
async def delete_conversation(
    course_id: str,
    assign_id: str,
    conversation_id: str,
    user_id: str = Header("", alias="user_id"),
):
    """删除对话记录（软删除）"""
    del course_id
    return await AIAgentController.delete_conversation(
        conversation_id=conversation_id,
        assignment_id=assign_id,
        user_id=user_id,
    )


@agent_route.post("/courses/{course_id}/assignments/{assign_id}/agent/event")
async def append_agent_events(
    course_id: str,
    assign_id: str,
    request: AIAgentAppendEventsRequest,
    user_id: str = Header("", alias="user_id"),
):
    """按批次追加事件到指定会话。"""
    del course_id
    return await AIAgentController.append_events(
        conversation_id=request.conversation_id,
        assignment_id=assign_id,
        user_id=user_id,
        expected_event_count=request.expected_event_count,
        events=request.events,
    )


@agent_route.post("/courses/{course_id}/assignments/{assign_id}/agent/event/override")
async def override_agent_events(
    course_id: str,
    assign_id: str,
    request: AIAgentOverrideEventsRequest,
    user_id: str = Header("", alias="user_id"),
):
    """强制覆盖指定会话的完整事件列表。"""
    del course_id
    return await AIAgentController.override_events(
        conversation_id=request.conversation_id,
        assignment_id=assign_id,
        user_id=user_id,
        events=request.events,
    )


@agent_route.post(
    "/courses/{course_id}/assignments/{assign_id}/agent/checkpoints",
    response_model=str,
)
async def create_checkpoint(
    course_id: str,
    assign_id: str,
    request: AIAgentCheckpointCreateRequest,
):
    """创建对话回溯点。"""
    del course_id
    return await AIAgentController.create_checkpoint(
        assignment_id=assign_id,
        original_code=request.original_code,
    )


@agent_route.get(
    "/courses/{course_id}/assignments/{assign_id}/agent/checkpoints/{checkpoint_id}",
    response_model=str,
)
async def get_checkpoint(
    course_id: str,
    assign_id: str,
    checkpoint_id: str,
):
    """获取对话回溯点详情。"""
    del course_id
    return await AIAgentController.get_checkpoint(
        checkpoint_id=checkpoint_id,
        assignment_id=assign_id,
    )


@agent_route.post("/courses/{course_id}/assignments/{assign_id}/agent/stream")
async def stream_messages(
    course_id: str,
    assign_id: str,
    request: AIAgentStreamRequest,
    user_id: str = Header("", alias="user_id"),
):
    """直接按消息列表代理模型流式输出。"""
    del course_id
    stream = await AIAgentController.stream_messages(
        assignment_id=assign_id,
        _user_id=user_id,
        messages=[message.model_dump(exclude_none=True) for message in request.messages],
    )
    return StreamingResponse(stream, media_type="text/plain; charset=utf-8")
