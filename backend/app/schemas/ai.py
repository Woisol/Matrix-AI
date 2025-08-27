from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, Annotated, List
from datetime import datetime

from  app.schemas.general import AssignId

class AiContent(BaseModel):
    title: str = Field(..., description="标题")
    body: str = Field(..., description="内容详情")

class AiResponse(BaseModel):
    title: str = Field(..., description="分析标题")
    summary: str = Field(..., description="分析内容")
    content: List[AiContent] = Field(..., description="详细分析内容")
    learning_suggestion: List[AiContent] = Field(..., description="学习建议")