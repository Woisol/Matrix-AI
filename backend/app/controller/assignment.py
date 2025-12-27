"""
作业控制器 - 使用原生 SQL ORM
"""
import uuid
import json
import base64
import asyncio
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, Path, Form
from app.models import (
    Course as CourseModel,
    Assignment as AssignmentModel,
    AssignmentCode,
    AssignmentSubmission,
    fetch_all,
    fetch_one,
)
from app.models.playground import Playground
from app.schemas.general import CourseId, AssignId
from app.schemas.assignment import (
    AssignData, Submit, TestSubmitRequest, SubmitRequest,
    TestSample, TestSampleCreate, TestSampleResult,
    CodeFileInfo, JudgeResult, MdCodeContent
)
from app.utils.assign import listStrToList, testSampleToResultList


class AssignmentController:
    """作业控制器"""

    @classmethod
    async def get_assignment(cls, assign_id: str) -> AssignData:
        """获取作业详情"""
        try:
            assignment = await AssignmentModel.get(id=assign_id)

            # 获取作业代码
            codes = await fetch_one(
                "SELECT * FROM assignment_codes WHERE assignment_id = $1 LIMIT 1",
                assign_id
            )
            if not codes:
                raise HTTPException(status_code=404, detail=f"Code for assignment id {assign_id} not found")

            # 获取提交记录
            submissions = await fetch_all(
                "SELECT * FROM assignment_submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC LIMIT 1",
                assign_id
            )

            submit = None
            if submissions:
                sub = submissions[0]
                submit = Submit(
                    score=sub['score'],
                    time=sub['submitted_at'],
                    testSample=testSampleToResultList(
                        sample_input=listStrToList(codes['sample_input']),
                        sample_output=listStrToList(codes['sample_expect_output']),
                        real_output=listStrToList(sub['sample_real_output']),
                    ),
                    submitCode=listStrToList(sub['submit_code']),
                )

            return AssignData(
                assignId=assignment.id,
                title=assignment.title,
                description=assignment.description,
                assignOriginalCode=listStrToList(codes['original_code']),
                ddl=assignment.end_date,
                submit=submit,
            )
        except HTTPException:
            raise
        except Exception as e:
            logging.error(f"Error occurred while getting assignment {assign_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def set_assignment(
        cls,
        assignId: str | None,
        courseId: str,
        title: str,
        description: str,
        assignOriginalCode: str,
        testSample: TestSampleCreate,
        ddl: Optional[str],
    ) -> bool:
        """创建或更新作业"""
        try:
            if assignId:
                # 更新作业
                assignment = await AssignmentModel.get(id=assignId)
                assignment.title = title
                assignment.description = description
                assignment.end_date = ddl if ddl else None
                await assignment.save()

                # 更新代码
                codes = await fetch_one(
                    "SELECT * FROM assignment_codes WHERE assignment_id = $1 LIMIT 1",
                    assignId
                )
                if codes:
                    await fetch_one(
                        """UPDATE assignment_codes
                           SET original_code=$1, sample_input=$2, sample_expect_output=$3
                           WHERE id=$4""",
                        assignOriginalCode,
                        json.dumps(testSample.input, ensure_ascii=False),
                        json.dumps(testSample.expectOutput, ensure_ascii=False),
                        codes['id']
                    )
            else:
                # 创建作业
                new_assign_id = uuid.uuid4().hex
                assignment = await AssignmentModel.create(
                    id=new_assign_id,
                    title=title,
                    description=description,
                    type="program",
                    end_date=ddl if ddl else None,
                )

                # 创建代码
                await AssignmentCode.create(
                    id=uuid.uuid4().hex,
                    assignment_id=new_assign_id,
                    original_code=assignOriginalCode,
                    sample_input=json.dumps(testSample.input, ensure_ascii=False),
                    sample_expect_output=json.dumps(testSample.expectOutput, ensure_ascii=False),
                )

                # 关联课程
                await fetch_one(
                    "INSERT INTO courses_assignments (courses_id, assignment_id) VALUES ($1, $2)",
                    courseId, new_assign_id
                )

            try:
                listStrToList(assignOriginalCode)
            except Exception:
                print("Warning: assignOriginalCode is not a valid JSON string list")

            return True
        except Exception as e:
            logging.error(f"Error occurred while creating assignment: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def delete_assignment(cls, course_id: str, assign_id: str) -> None:
        """删除作业"""
        try:
            assignment = await AssignmentModel.get(id=assign_id)
            await assignment.delete()
            return True
        except Exception as e:
            logging.error(f"Error occurred while deleting assignment {assign_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def test_submit(cls, submitRequest: TestSubmitRequest) -> str:
        """测试代码提交"""
        try:
            output = await Playground.run_code(
                code=submitRequest.codeFile.content,
                input=submitRequest.input,
                language=submitRequest.language,
            )
            return output
        except Exception as e:
            logging.error(f"Error occurred while testing code submission: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def submit_code(cls, course_id: CourseId, assign_id: AssignId, submitRequest: SubmitRequest):
        """提交代码"""
        try:
            assignment = await AssignmentModel.get(id=assign_id)
            if assignment.end_date and assignment.end_date < datetime.now().isoformat():
                raise HTTPException(status_code=400, detail="Deadline has passed")

            # 获取作业代码
            codes = await fetch_one(
                "SELECT * FROM assignment_codes WHERE assignment_id = $1 LIMIT 1",
                assign_id
            )
            if not codes:
                raise HTTPException(status_code=404, detail=f"Code for assignment id {assign_id} not found")

            sample_input = listStrToList(codes['sample_input'])
            sample_output = listStrToList(codes['sample_expect_output'])

            judgeRes = await Playground.judge_code(
                code=submitRequest.codeFile.content,
                testSample=TestSampleCreate(input=sample_input, expectOutput=sample_output),
            )

            submit = Submit(
                score=judgeRes.score,
                time=datetime.now(timezone.utc),
                testSample=testSampleToResultList(
                    sample_input=sample_input,
                    sample_output=sample_output,
                    real_output=judgeRes.testRealOutput,
                ),
                submitCode=[submitRequest.codeFile],
            )

            # 检查是否已有提交
            submissions = await fetch_all(
                "SELECT * FROM assignment_submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC LIMIT 1",
                assign_id
            )

            if submissions:
                # 更新现有提交
                await fetch_one(
                    """UPDATE assignment_submissions
                       SET score=$1, sample_real_output=$2, submit_code=$3
                       WHERE id=$4""",
                    judgeRes.score,
                    json.dumps(judgeRes.testRealOutput, ensure_ascii=False),
                    json.dumps([submitRequest.codeFile.model_dump()], ensure_ascii=False),
                    submissions[0]['id']
                )
            else:
                # 创建新提交
                await AssignmentSubmission.create(
                    id=uuid.uuid4().hex,
                    assignment_id=assign_id,
                    student_id="Matrix AI",
                    score=judgeRes.score,
                    sample_real_output=json.dumps(judgeRes.testRealOutput, ensure_ascii=False),
                    submit_code=json.dumps([submitRequest.codeFile.model_dump()], ensure_ascii=False),
                )

            return submit
        except HTTPException:
            raise
        except Exception as e:
            logging.error(f"Error occurred while submitting code for assignment {assign_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# 兼容函数式调用
get_assignment = AssignmentController.get_assignment
set_assignment = AssignmentController.set_assignment
delete_assignment = AssignmentController.delete_assignment
test_submit = AssignmentController.test_submit
submit_code = AssignmentController.submit_code
