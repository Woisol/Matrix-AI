from datetime import datetime
from typing import Iterable
from app.models.assignment import Assignment
from app.schemas.course import AssignmentListItem
from app.schemas.assignment import Submit

def AssignDBtoSchema(assignments: Iterable[Assignment]) -> list[AssignmentListItem]:
    result: list[AssignmentListItem] = []
    for assignment in assignments:
        # 从 ReverseRelation 读取 submissions（需要在查询时 prefetch_related("assignments__submissions")）
        score = 0
        submissions:Submit = getattr(assignment, "submissions", None)
        if submissions:
            # 取最新一次提交的分数（按 submitted_at 最大）
            score = submissions.score if submissions.score is not None else 0

        result.append({
            "assignId": assignment.id,
            "assignmentName": assignment.title,  # title 映射为 assignmentName
            "type": assignment.type,
            "score": score,
            "ddl": assignment.end_date,
        })

    return result
