"""
AI 分析模型
"""
from app.models.base import Model


class Analysis(Model):
    """AI 分析模型"""
    table_name = "assignment_analysis"
    columns = {
        "id": int,
        "assignment_id": str,
        "resolution": str,  # JSON
        "knowledge_analysis": str,  # JSON
        "code_analysis": str,  # JSON
        "learning_suggestions": str,  # JSON
    }

    class _meta:
        pk = "id"

    def __repr__(self):
        return f"<Analysis(id={self.id}, assignment_id='{self.assignment_id}')>"
