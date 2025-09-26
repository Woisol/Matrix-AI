from enum import Enum
from tortoise import fields
from tortoise.fields import ReverseRelation
from tortoise.models import Model

# 移除循环导入 - 使用字符串引用而非直接导入
#! 倒是可以只导入一个否则似乎数据库结构创建错误
from app.models.analysis import Analysis
from app.utils.fields import NaiveDatetimeField

#! 单独定义，据 C4：
# 1. 职责分离
# Models: 负责数据库存储和ORM映射
# Schemas: 负责API接口验证和序列化
# 两者关注点不同，应该独立定义
# 2. 避免循环依赖

class AssignTypeEnum(str, Enum):
    """作业类型枚举"""
    CHOOSE = "choose"
    PROGRAM = "program"


class SubmitScoreStatusEnum(str, Enum):
    """提交状态枚举"""
    NOT_SUBMITTED = "not_submitted"
    NOT_PASSED = "not_passed"
    PASSED = "passed"
    FULL_SCORE = "full_score"

class Assignment(Model):
    """课程作业模型"""
    id = fields.CharField(max_length=50, pk=True, description="作业ID")
    # course = fields.ForeignKeyField("models.Course", related_name="assignments", description="所属课程")
    # assignment_name 为前端设计失误，实际等同于 title
    title = fields.CharField(max_length=200, description="作业标题")  # 保留兼容性
    description = fields.TextField(max_length=1000, description="作业描述")
    type = fields.CharEnumField(AssignTypeEnum, max_length=20, description="作业类型")
    # score = fields.FloatField(null=True, description="作业得分")
    start_date = NaiveDatetimeField(null=True,description="开始时间")
    end_date = NaiveDatetimeField(null=True, description="截止时间")  # ddl

    # # 作业原始代码和答案
    # original_code = fields.CharField(max_length=10000, description="作业原始代码文件列表 JSON")

    codes: ReverseRelation["AssignmentCode"]
    submissions: ReverseRelation["AssignmentSubmission"]
    analysis: ReverseRelation["Analysis"]  # 使用字符串引用避免循环导入

    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")

    class Meta:
        table = "assignments"
        table_description = "作业表"
        indexes = [
            ("type",),                    # 按作业类型查询
            ("end_date",),               # 按截止时间查询
        ]

    def __str__(self):
        return f"Assignment(id={self.id}, title={self.title})"


class AssignmentCode(Model):
    """作业代码模型"""
    id = fields.CharField(max_length=50, pk=True, description="作业代码ID")
    assignment = fields.ForeignKeyField("models.Assignment", related_name="codes", description="所属作业")
    original_code = fields.CharField(max_length=10000, description="作业原始代码文件列表")
    sample_input = fields.CharField(max_length=10000, description="测试样例输入列表")
    sample_expect_output = fields.CharField(max_length=10000, description="样例期望输出列表")
    # submit = fields.JSONField(default=object, description="提交内容")

    class Meta:
        table = "assignment_codes"
        table_description = "作业代码表"

    def __str__(self):
        return f"AssignmentCode(id={self.id}, assignment={self.assignment.id})"

class AssignmentSubmission(Model):
    """作业提交模型"""
    id = fields.CharField(max_length=50, pk=True, description="作业提交ID")
    assignment = fields.ForeignKeyField("models.Assignment", related_name="submissions", description="所属作业")
    # 预计弃用
    student_id = fields.CharField(max_length=50, description="学生ID")
    score = fields.FloatField(null=True, description="提交分数")
    sample_real_output = fields.CharField(max_length=10000, description="样例真实输出列表")
    submit_code = fields.CharField(max_length=10000, description="提交代码文件列表")

    submitted_at = NaiveDatetimeField(auto_now=True, description="提交时间")

    class Meta:
        table = "assignment_submissions"
        table_description = "作业提交表"

    def __str__(self):
        return f"AssignmentSubmission(id={self.id}, assignment={self.assignment.id}, student={self.student_id})"
