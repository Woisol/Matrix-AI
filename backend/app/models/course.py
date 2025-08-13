"""
课程相关模型
"""
from tortoise.models import Model
from tortoise import fields
from typing import Optional
from datetime import datetime


class Course(Model):
    """课程模型"""
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=200, description="课程名称")
    type = fields.CharField(max_length=20, default="public", description="课程类型: public, private")
    status = fields.CharField(max_length=20, default="open", description="课程状态: open, close")
    school_year = fields.CharField(max_length=20, description="学年，如：2016-2017")
    semester = fields.CharField(max_length=20, description="学期，如：秋季学期")
    description = fields.TextField(null=True, description="课程描述")
    creator_name = fields.CharField(max_length=100, default="管理员", description="创建者姓名")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")
    
    class Meta:
        table = "courses"
        table_description = "课程表"
    
    def __str__(self):
        return f"Course(id={self.id}, name={self.name})"


class CourseAssignment(Model):
    """课程作业模型"""
    id = fields.IntField(pk=True)
    course = fields.ForeignKeyField("models.Course", related_name="assignments", description="所属课程")
    title = fields.CharField(max_length=200, description="作业标题")
    description = fields.TextField(null=True, description="作业描述")
    start_date = fields.DatetimeField(description="开始时间")
    end_date = fields.DatetimeField(description="结束时间")
    grade_at_end = fields.IntField(default=0, description="结束后是否评分")
    pub_answer = fields.IntField(default=0, description="是否公布答案")
    plcheck = fields.IntField(default=0, description="抄袭检测")
    submit_limitation = fields.IntField(default=10, description="提交次数限制")
    answer_file = fields.TextField(null=True, description="答案文件内容")
    support_files = fields.JSONField(default=dict, description="支持文件")
    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")
    
    class Meta:
        table = "course_assignments"
        table_description = "课程作业表"
    
    def __str__(self):
        return f"CourseAssignment(id={self.id}, title={self.title})"


class CourseAssignmentSubmission(Model):
    """课程作业提交模型"""
    id = fields.IntField(pk=True)
    assignment = fields.ForeignKeyField("models.CourseAssignment", related_name="submissions", description="所属作业")
    student_name = fields.CharField(max_length=100, description="提交学生姓名")
    detail = fields.JSONField(description="提交内容详情")
    score = fields.FloatField(null=True, description="分数")
    feedback = fields.TextField(null=True, description="反馈")
    status = fields.CharField(max_length=20, default="pending", description="状态: pending, judging, finished, error")
    judge_result = fields.JSONField(null=True, description="评测结果")
    submit_time = fields.DatetimeField(auto_now_add=True, description="提交时间")
    judge_time = fields.DatetimeField(null=True, description="评测时间")
    
    class Meta:
        table = "course_assignment_submissions"
        table_description = "课程作业提交表"
    
    def __str__(self):
        return f"CourseAssignmentSubmission(id={self.id})"


