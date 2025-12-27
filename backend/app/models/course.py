"""
课程相关模型
"""
from app.models.base import Model


class Course(Model):
    """课程模型"""
    table_name = "courses"
    columns = {
        "id": str,
        "course_name": str,
        "type": str,
        "status": str,
        "completed": bool,
        "created_at": str,
        "updated_at": str,
    }

    class _meta:
        pk = "id"

    def __repr__(self):
        return f"<Course(id='{self.id}', name='{self.course_name}')>"
