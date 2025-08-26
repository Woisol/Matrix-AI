"""
课程相关的Pydantic Schema
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from assignment import AssignData, TestSample, CodeSet
from general import AssignId
from enum import Enum

class CourseBaseModel(BaseModel):
    id: int = Field(..., description="课程ID")
    name: str = Field(..., description="课程名称")
    assignment: list[AssignData] = Field(..., description="课程作业列表")
    completed: bool = Field(..., description="是否完成")

class CourseResponseModel(CourseBaseModel):
    completed: bool = Field(..., description="是否已完成课程")

class SubmissionModel(BaseModel):
    score: float = Field(..., description="提交分数")
    time: datetime = Field(..., description="提交时间")
    sample: TestSample = Field(..., description="样例输入输出")
    assignCode: list[CodeSet] = Field(..., description="作业代码")


class AssignmentResponseModel(AssignData):
    description: str = Field(..., description="作业描述")
    assignOriginalCode: list[CodeSet] = Field(..., description="作业原始代码")
    submit: SubmissionModel = Field(..., description="作业提交信息")

class AssignType(str, Enum):
    CHOOSE = "choose"
    PROGRAM = "program"

class AssignmentListItem(BaseModel):
    assignId: AssignId
    assignmentName: str
    type: AssignType
    score: Optional[float]
    ddl: Optional[datetime]

