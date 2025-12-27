"""
用户模型
"""
from app.models.base import Model


class User(Model):
    """用户模型"""
    table_name = "user"
    columns = {
        "id": int,
        "username": str,
        "code_style": str,
        "knowledge_status": str,
    }

    class _meta:
        pk = "id"

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"
