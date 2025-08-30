import json, ast
from datetime import datetime
from typing import Iterable
from app.models.assignment import Assignment
from app.schemas.course import AssignmentListItem
from app.schemas.assignment import Submit, TestSample, TestSampleResult, MdCodeContent

async def AssignDBtoSchema(assignments: Iterable[Assignment]) -> list[AssignmentListItem]:
    result: list[AssignmentListItem] = []
    for assignment in assignments:
        # 从 ReverseRelation 读取 submissions（需要在查询时 prefetch_related("assignments__submissions")）
        score = 0
        _submissions = await assignment.submissions.all()
        # submissions:Submit = getattr(assignment, "submissions", None)
        if _submissions:
            submissions = _submissions[0]

            score = submissions.score if submissions.score is not None else 0

        result.append({
            "assignId": assignment.id,
            "assignmentName": assignment.title,  # title 映射为 assignmentName
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
    return [
        TestSampleResult(
            input=sample_input[i],
            expectOutput=sample_output[i],
            realOutput=real_output[i] if i < len(real_output) else "",
        )
        for i in range(len(sample_input))
    ]
