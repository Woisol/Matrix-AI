"""
课程相关模型
"""
from tortoise.models import Model
from tortoise import fields

from tortoise.fields import ManyToManyRelation
from .assignment import Assignment


class Course(Model):
    """课程模型"""
    id = fields.CharField(max_length=50, pk=True, description="课程ID")
    course_name = fields.CharField(max_length=200, description="课程名称")
    type = fields.CharField(max_length=20, default="public", description="课程类型: public, private")
    status = fields.CharField(max_length=20, default="open", description="课程状态: open, close")
    description = fields.TextField(null=True, description="课程描述")
    creator_name = fields.CharField(max_length=100, default="管理员", description="创建者姓名")
    completed = fields.BooleanField(default=False, description="是否完成")

    # 多对多关系：课程可以包含多个作业，作业可以被多个课程使用
    assignments: ManyToManyRelation[Assignment] = fields.ManyToManyField("models.Assignment", related_name="courses", description="课程包含的作业")

    created_at = fields.DatetimeField(auto_now_add=True, description="创建时间")
    updated_at = fields.DatetimeField(auto_now=True, description="更新时间")

    class Meta:
        table = "courses"
        table_description = "课程表"

    def __str__(self):
        return f"Course(id={self.id}, name={self.course_name})"

