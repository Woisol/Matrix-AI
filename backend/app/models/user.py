from tortoise.models import Model
from tortoise import fields
class User(Model):
  """用户模型"""
  id = fields.IntField(pk=True)
  username = fields.CharField(max_length=50)
  code_style = fields.TextField(null=True, description="代码风格 AI 总结")
  knowledge_status = fields.TextField(null=True, description="知识掌握情况 AI 总结")

