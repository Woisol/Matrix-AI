from tortoise.fields import ManyToManyRelation
from app.models.assignment import Assignment
from app.schemas.course import AssignmentListItem
def AssignDBtoSchema(assign: ManyToManyRelation[Assignment]) -> list[AssignmentListItem]:
    assignments:list[AssignmentListItem] = []
    for assignment in assign:
        assignments.append({
            "assignId": assignment.id,
            "assignmentName": assignment.title,  # title 映射为 assignmentName
            "type": assignment.type,
            "score": assignment.score,
            "ddl": assignment.end_date
        })

    return assignments
