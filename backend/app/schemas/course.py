"""
课程相关的Pydantic Schema
"""
from pydantic import BaseModel, Field
# from typing import Optional, List, Any, Dict
from datetime import datetime

class CourseBaseModel(BaseModel):
    id: int = Field(..., description="课程ID")
    name: str = Field(..., description="课程名称")
    description: str = Field(..., description="课程描述")

class CourseResponseModel(CourseBaseModel):
    assignment: list[AssignmentModel] = Field(..., description="课程作业列表")
    completed: bool = Field(..., description="是否已完成课程")

class SubmissionModel(BaseModel):
    score: float = Field(..., description="提交分数")
    time: datetime = Field(..., description="提交时间")
    sample: TestSample = Field(..., description="样例输入输出")
    assignCode: list[CodeSet] = Field(..., description="作业代码")


class AssignmentResponseModel(AssignmentModel):
    description: str = Field(..., description="作业描述")
    assignOriginalCode: list[CodeSet] = Field(..., description="作业原始代码")
    submit: SubmissionModel = Field(..., description="作业提交信息")



