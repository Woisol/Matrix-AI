from pydantic import BaseModel, Field
from tortoise import fields
from tortoise.models import Model

# 移除循环导入 - 使用字符串引用而非直接导入
# from app.models.assignment import Assignment
class Analysis(Model):
    """AI 分析模型"""
    assignment = fields.ForeignKeyField("models.Assignment", related_name="analysis", description="所属作业")
    resolution = fields.JSONField(description="题目解法")
    knowledge_analysis = fields.JSONField(description="知识点分析")
    code_analysis = fields.JSONField(description="提交代码分析")
    learning_suggestions = fields.JSONField(description="学习建议")

    class Meta:
        table = "assignment_analysis"
        table_description = "作业AI分析表"

    def __str__(self):
        return f"Analysis for {self.assignment.id}"
