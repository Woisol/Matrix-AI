from datetime import datetime
from enum import Enum
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class AIAgentEventType(str, Enum):
    USER_MESSAGE = "user_message"
    THINK = "think"
    TOOL_CALL = "tool_call"
    TOOL_RESULT = "tool_result"
    OUTPUT = "output"
    TURN_END = "turn_end"


class AIAgentEvent(BaseModel):
    type: AIAgentEventType = Field(..., description="事件类型")
    payload: dict = Field(..., description="事件数据")


class AIAgentConversationSummary(BaseModel):
    conversation_id: str = Field(..., description="会话 ID")
    title: str = Field(..., description="会话标题")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")


class AIAgentConversation(BaseModel):
    conversation_id: str = Field(..., description="会话 ID")
    title: str = Field(..., description="会话标题")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    events: List[AIAgentEvent] = Field(..., description="会话事件列表")


class AIAgentConversationTitleUpdateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="新的会话标题")


class AIAgentAppendEventsRequest(BaseModel):
    conversation_id: str = Field(..., description="会话 ID")
    expected_event_count: int = Field(..., ge=0, description="前端预期的当前事件数")
    events: List[AIAgentEvent] = Field(..., min_length=1, description="待追加的事件列表")


class AIAgentModelMessage(BaseModel):
    role: Literal["system", "user", "assistant", "tool"] = Field(..., description="消息角色")
    content: str = Field(..., description="消息内容")
    tool_call_id: Optional[str] = Field(None, description="工具调用 ID")


class AIAgentStreamRequest(BaseModel):
    messages: List[AIAgentModelMessage] = Field(..., min_length=1, description="模型请求消息列表")
