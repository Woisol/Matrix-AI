"""
课程相关的Pydantic Schema
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from assignment import AssignData, TestSample, CodeSet
from general import AssignId
from enum import Enum
from general import CourseId

class AssignType(str, Enum):
    CHOOSE = "choose"
    PROGRAM = "program"

class AssignmentListItem(BaseModel):
    assign_id: AssignId
    assignment_name: str
    type: AssignType
    score: Optional[float]
    ddl: Optional[datetime]

class CourseBase(BaseModel):
    id: CourseId = Field(..., description="课程ID")
    course_name: str = Field(..., description="课程名称")

class Course(CourseBase):
    assignment: Optional[list[AssignmentListItem]] = Field(..., description="课程作业列表")
    completed: bool = Field(..., description="是否完成")

class TodoCourse(CourseBase):
    assignment: list[AssignmentListItem] = Field(..., description="课程作业列表")

class SubmissionModel(BaseModel):
    score: float = Field(..., description="提交分数")
    time: datetime = Field(..., description="提交时间")
    sample: TestSample = Field(..., description="样例输入输出")
    assignCode: list[CodeSet] = Field(..., description="作业代码")
