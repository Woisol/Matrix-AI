"""
课程相关的Pydantic Schema
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime


# 课程相关Schema
class CourseBase(BaseModel):
    """课程基础信息"""
    name: str = Field(..., description="课程名称")
    type: str = Field(default="public", description="课程类型: public, private")
    status: str = Field(default="open", description="课程状态: open, close")
    school_year: str = Field(..., description="学年")
    semester: str = Field(..., description="学期")
    description: Optional[str] = Field(None, description="课程描述")


class CourseCreate(CourseBase):
    """创建课程请求模型"""
    creator_name: Optional[str] = Field("管理员", description="创建者姓名")


class CourseUpdate(BaseModel):
    """更新课程请求模型"""
    name: Optional[str] = Field(None, description="课程名称")
    type: Optional[str] = Field(None, description="课程类型")
    status: Optional[str] = Field(None, description="课程状态")
    school_year: Optional[str] = Field(None, description="学年")
    semester: Optional[str] = Field(None, description="学期")
    description: Optional[str] = Field(None, description="课程描述")


class CourseResponse(CourseBase):
    """课程响应模型"""
    id: int
    creator_name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CourseListResponse(BaseModel):
    """课程列表响应模型"""
    id: int
    name: str
    type: str
    status: str
    school_year: str
    semester: str
    creator_name: str
    created_at: datetime

    class Config:
        from_attributes = True


# 课程作业相关Schema
class CourseAssignmentBase(BaseModel):
    """课程作业基础信息"""
    title: str = Field(..., description="作业标题")
    description: Optional[str] = Field(None, description="作业描述")
    start_date: datetime = Field(..., description="开始时间")
    end_date: datetime = Field(..., description="结束时间")
    grade_at_end: int = Field(default=0, description="结束后是否评分")
    pub_answer: int = Field(default=0, description="是否公布答案")
    plcheck: int = Field(default=0, description="抄袭检测")
    submit_limitation: int = Field(default=10, description="提交次数限制")


class CourseAssignmentCreate(CourseAssignmentBase):
    """创建课程作业请求模型"""
    answer_file: Optional[str] = Field(None, description="答案文件内容")
    support_files: Optional[Dict[str, Any]] = Field(default_factory=dict, description="支持文件")


class CourseAssignmentUpdate(BaseModel):
    """更新课程作业请求模型"""
    startdate: Optional[datetime] = Field(None, alias="start_date", description="开始时间")
    enddate: Optional[datetime] = Field(None, alias="end_date", description="结束时间")
    grade_at_end: Optional[int] = Field(None, description="结束后是否评分")
    pub_answer: Optional[int] = Field(None, description="是否公布答案")
    plcheck: Optional[int] = Field(None, description="抄袭检测")
    submit_limitation: Optional[int] = Field(None, description="提交次数限制")

    class Config:
        populate_by_name = True


class CourseAssignmentResponse(CourseAssignmentBase):
    """课程作业响应模型"""
    id: int
    course_id: int
    support_files: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CourseAssignmentDetail(CourseAssignmentResponse):
    """课程作业详细信息"""
    answer_file: Optional[str] = Field(None, description="答案文件内容")


# 课程作业提交相关Schema
class SubmissionCreate(BaseModel):
    """创建提交请求模型"""
    detail: Dict[str, Any] = Field(..., description="提交内容详情")
    student_name: str = Field(..., description="提交学生姓名")


class SubmissionResponse(BaseModel):
    """提交响应模型"""
    id: int
    assignment_id: int
    student_name: str
    detail: Dict[str, Any]
    score: Optional[float]
    feedback: Optional[str]
    status: str
    judge_result: Optional[Dict[str, Any]]
    submit_time: datetime
    judge_time: Optional[datetime]

    class Config:
        from_attributes = True


class SubmissionFeedback(BaseModel):
    """提交反馈模型"""
    score: Optional[float]
    feedback: Optional[str]
    judge_result: Optional[Dict[str, Any]]


class RejudgeRequest(BaseModel):
    """重新评测请求模型"""
    wayToCallJudge: str = Field(..., description="调用评测方式: normal, force")


# 通用响应模型
class MessageResponse(BaseModel):
    """通用消息响应"""
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    """错误响应"""
    message: str
    success: bool = False

