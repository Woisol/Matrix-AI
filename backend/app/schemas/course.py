"""
课程相关的Pydantic Schema
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.assignment import TestSample, CodeFileInfo
from app.schemas.general import AssignId, CourseId
from enum import Enum

class AssignType(str, Enum):
    CHOOSE = "choose"
    PROGRAM = "program"

class AssignmentListItem(BaseModel):
    assignId: AssignId
    assignmentName: str
    type: AssignType
    score: Optional[float]
    ddl: Optional[datetime]

class CourseBase(BaseModel):
    courseId: CourseId = Field(..., description="课程ID")
    courseName: str = Field(..., description="课程名称")

class Course(CourseBase):
    assignment: Optional[list[AssignmentListItem]] = Field(default=None, description="课程作业列表")
    completed: bool = Field(..., description="是否完成")

class TodoCourse(CourseBase):
    assignment: list[AssignmentListItem] = Field(..., description="课程作业列表")


class CourseCreateRequest(BaseModel):
    """创建课程请求模型"""
    courseId: CourseId = Field(..., description="课程ID")
    courseName: str = Field(..., description="课程名称", min_length=1, max_length=200)
    type: str = Field(default="public", description="课程类型: public, private")
    status: str = Field(default="open", description="课程状态: open, close")
    description: Optional[str] = Field(None, description="课程描述", max_length=1000)
    creatorName: str = Field(default="管理员", description="创建者姓名", max_length=100)
    assignmentIds: Optional[list[AssignId]] = Field(default=None, description="关联的作业ID列表")


class SubmissionModel(BaseModel):
    score: float = Field(..., description="提交分数")
    time: datetime = Field(..., description="提交时间")
    sample: TestSample = Field(..., description="样例输入输出")
    assignCode: list[CodeFileInfo] = Field(..., description="作业代码")
