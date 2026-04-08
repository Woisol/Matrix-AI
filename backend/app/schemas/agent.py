from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, Annotated, List
from datetime import datetime

class AIAgentConversation(BaseModel):
    conversation_id: str = Field(..., description="会话 ID")
    assign_id: str = Field(..., description="关联作业 ID")
    user_id: str = Field(..., description="用户 ID")
    title: str = Field(..., description="会话标题")
    deleted_at: Optional[datetime] = Field(None, description="删除时间")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    events: List['AIAgentEvent'] = Field(..., description="会话事件列表")
class AIAgentEventType(str, Enum):
    USER_MESSAGE = "user_message"
    THINK = "think"
    TOOL_CALL = "tool_call"
    TOOL_RESULT = "tool_result"
    ASSISTANT_FINAL = "assistant_final"
    TURN_END = "turn_end"
class AIAgentEvent(BaseModel):
    type: AIAgentEventType = Field(..., description="事件类型")
    payload: dict = Field(..., description="事件数据")