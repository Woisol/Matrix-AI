import json, ast
from datetime import datetime
from typing import Iterable
from app.models.assignment import Assignment, AssignmentSubmission
from app.schemas.course import AssignmentListItem
from app.schemas.assignment import Submit, TestSample, TestSampleResult, MdCodeContent
from app.models.base import fetch_all


async def AssignDBtoSchema(assignments: Iterable[Assignment]) -> list[AssignmentListItem]:
    """Tortoise ORM 版本 - 保留兼容"""
    result: list[AssignmentListItem] = []
    for assignment in assignments:
        score = 0
        _submissions = await assignment.submissions.all()
        if _submissions:
            submissions = _submissions[0]
            score = submissions.score if submissions.score is not None else 0

        result.append({
            "assignId": assignment.id,
            "assignmentName": assignment.title,
            "type": assignment.type,
            "score": score,
            "ddl": assignment.end_date,
        })

    return result


async def AssignDBtoSchemaNative(assignments: list[Assignment]) -> list[AssignmentListItem]:
    """原生 SQL ORM 版本 - 使用 JOIN 查询获取分数"""
    if not assignments:
        return []

    # 获取所有作业ID
    assignment_ids = [a.id for a in assignments]

    # 批量查询每个作业的最新提交分数
    scores_map = {}
    if assignment_ids:
        rows = await fetch_all(
            """SELECT assignment_id, score FROM assignment_submissions
               WHERE assignment_id = ANY($1)
               ORDER BY submitted_at DESC""",
            assignment_ids
        )
        seen = set()
        for row in rows:
            aid = row["assignment_id"]
            if aid not in seen:
                scores_map[aid] = row["score"]
                seen.add(aid)

    # 构建结果
    result: list[AssignmentListItem] = []
    for assignment in assignments:
        score = scores_map.get(assignment.id, None)

        result.append({
            "assignId": assignment.id,
            "assignmentName": assignment.title,
            "type": assignment.type,
            "score": score,
            "ddl": assignment.end_date,
        })

    return result

def listStrToList(list_str: str) -> list[str]:
    """将字符串列表转换为 Python 列表"""
    res = json.loads(list_str, strict=False)
    # .replace("'", '"')
    return res
    # return list(ast.literal_eval(list_str))

    # list_str[0] = list_str[-1] = ''
    # list_str = list_str.strip('[]')
    #! 这居然能删去吗😂
    # list_str = list_str[1:] + list_str[:-1]
    # list = list_str.split(",")
    # for i in range(len(list)):
    #     list[i] = list[i].strip()
    # return list

def testSampleToResultList(sample_input:list[str], sample_output:list[str], real_output:list[str]) -> list[TestSampleResult]:
    sample_range = min(len(sample_input), len(sample_output), len(real_output))
    return [
        TestSampleResult(
            input=sample_input[i],
            expectOutput=sample_output[i],
            realOutput=real_output[i] if i < len(real_output) else "",
        )
        for i in range(sample_range)
    ]
