from collections.abc import AsyncIterable
from fastapi import APIRouter

from app.controller.agent import AIAgentController
from app.schemas.agent import AIAgentEvent
# https://fastapi.tiangolo.com/zh/tutorial/server-sent-events/ 但需要 1.135.0
from fastapi.sse import EventSourceResponse
# from sse_starlette.sse import EventSourceResponse


agent_route = APIRouter(tags=["agent"])

@agent_route.post("/courses/{course_id}/assignments/{assign_id}/agent/conversations")
async def create_conversation(
    course_id: str,
    assign_id: str,
    user_id: str,
):
    """创建新的对话记录"""
    return await AIAgentController.create_conversation(assign_id, user_id)

@agent_route.get("/courses/{course_id}/assignments/{assign_id}/agent/conversations")
async def list_conversations(
    course_id: str,
    assign_id: str,
    user_id: str
):
    """列出用户在该作业下的所有对话记录"""
    return await AIAgentController.list_conversations(assign_id, user_id)

@agent_route.delete("/courses/{course_id}/assignments/{assign_id}/agent/conversations/{conversation_id}")
async def delete_conversation(
    course_id: str,
    assign_id: str,
    conversation_id: str,
    user_id: str
):
    """删除对话记录（软删除）"""
    return await AIAgentController.delete_conversation(conversation_id, assign_id, user_id)

# https://fastapi.tiangolo.com/zh/tutorial/server-sent-events/#what-are-server-sent-events
@agent_route.post(
    "/courses/{course_id}/assignments/{assign_id}/agent/events",
    response_class=EventSourceResponse,
    response_model=None,
)
async def append_agent_event(
    course_id: str,
    assign_id: str,
    user_id: str,
    conversation_id: str,
    event: AIAgentEvent
) -> AsyncIterable[str]:
    """接收前端新 event 请求，转发到实际模型并持久化存储"""
    # 诶链上每个函数都必须 await 不然返回的 coroutine 对象
    return await AIAgentController.handle_append_event(conversation_id, assign_id, user_id, event)