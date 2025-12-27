"""
作业模型 - 包括 Assignment, AssignmentCode, AssignmentSubmission
"""
from enum import Enum
from app.models.base import Model


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
    table_name = "assignments"
    columns = {
        "id": str,
        "title": str,
        "description": str,
        "type": str,
        "start_date": str,
        "end_date": str,
        "created_at": str,
        "updated_at": str,
    }

    class _meta:
        pk = "id"

    def __repr__(self):
        return f"<Assignment(id='{self.id}', title='{self.title}')>"


class AssignmentCode(Model):
    """作业代码模型"""
    table_name = "assignment_codes"
    columns = {
        "id": str,
        "assignment_id": str,
        "original_code": str,
        "sample_input": str,
        "sample_expect_output": str,
    }

    class _meta:
        pk = "id"

    def __repr__(self):
        return f"<AssignmentCode(id='{self.id}', assignment_id='{self.assignment_id}')>"


class AssignmentSubmission(Model):
    """作业提交模型"""
    table_name = "assignment_submissions"
    columns = {
        "id": str,
        "assignment_id": str,
        "student_id": str,
        "score": float,
        "sample_real_output": str,
        "submit_code": str,
        "submitted_at": str,
    }

    class _meta:
        pk = "id"

    def __repr__(self):
        return f"<AssignmentSubmission(id='{self.id}', assignment_id='{self.assignment_id}')>"
