"""
课程相关的Pydantic Schema
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

class CourseBaseModel(BaseModel):
    id: int = Field(..., description="课程ID")
    name: str = Field(..., description="课程名称")
    description: str = Field(..., description="课程描述")

class AssignmentModel(BaseModel):
    assignId: int = Field(..., description="作业ID")
    name: str = Field(..., description="作业标题")
    type: str = Field(..., description="作业类型")
    score: float = Field(..., description="作业分数")
    due_date: datetime = Field(..., description="截止日期")

class CourseResponseModel(CourseBaseModel):
    assignments: List[AssignmentModel] = Field(..., description="课程作业列表")
    completed: bool = Field(..., description="是否已完成课程")

class Sample(BaseModel):
    input: str = Field(..., description="输入")
    realOutput: str = Field(..., description="真实输出")
    expectOutput: str = Field(..., description="期望输出")
    
class CodeSet(BaseModel):
    filename: str = Field(..., description="文件名")
    content: str = Field(..., description="文件内容")

class SubmissionModel(BaseModel):
    score: float = Field(..., description="提交分数")
    time: datetime = Field(..., description="提交时间")
    sample: Sample = Field(..., description="样例输入输出")
    assignCode: List[CodeSet] = Field(..., description="作业代码")


class AssignmentResponseModel(AssignmentModel):
    description: str = Field(..., description="作业描述")
    assignOriginalCode: List[CodeSet] = Field(..., description="作业原始代码")
    submit: SubmissionModel = Field(..., description="作业提交信息")



