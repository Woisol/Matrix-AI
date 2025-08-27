import uuid, json
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, Path, Form
from tortoise import exceptions as torExceptions

from app.models.course import Course as CourseModel
from app.models.assignment import Assignment as AssignmentModel, AssignmentCode
from app.models.playground import Playground
from app.schemas.general import CourseId, AssignId
from app.schemas.assignment import AssignData, Submit, TestSubmitRequest,SubmitRequest, TestSample, TestSampleCreate, CodeFileInfo

from app.utils.assign import listStrToList


class AssignmentController:
    async def get_assignment(assign_id: str) -> AssignData:
        try:
            assignment = await AssignmentModel.get(id=assign_id).prefetch_related("codes").prefetch_related("submissions")
            if not assignment:
                raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found")

            submit = None
            if assignment.submissions:
                testSample = TestSample(
                    input=listStrToList(assignment.codes[0].sample_input),
                    expectOutput=listStrToList(assignment.codes[0].sample_expect_output),
                    realOutput=listStrToList(assignment.submissions[0].sample_real_output),
                )
                submit = Submit(
                    score=assignment.submissions[0].score,
                    time=assignment.submissions[0].submitted_at,
                    testSample=testSample,
                    submitCode=listStrToList(assignment.submissions[0].submit_code),
                )

            _codes = await assignment.codes.all()
            if not _codes:
                raise HTTPException(status_code=404, detail=f"Code for assignment id {assign_id} not found or invalid")
            codes = _codes[0]

            return AssignData(
                assignId=assignment.id,
                title=assignment.title,
                description=assignment.description,
                assignOriginalCode=listStrToList(codes.original_code),
                submit=submit,
            )
        except torExceptions.DoesNotExist:
            raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found or invalid")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    async def create_assignment(
        course_id: str,
        title: str,
        description: str,
        assignOriginalCode: str,
        testSample: TestSampleCreate,
        # testSample: TestSampleCreate,
        ddl: Optional[str],
    ) -> AssignData:
        try:
            course = await CourseModel.get(id=course_id)
            # .prefetch_related("codes", "submissions") 用于 ManyToMany 😂
            assignment = await AssignmentModel.create(
                id=uuid.uuid4().hex,
                title=title,
                description=description,
                type="program",
                end_date=ddl if ddl else None,
                # original_code=assignOriginalCode,
            )
            # _input_str = json.dumps(testSample.input, ensure_ascii=False)
            code = await AssignmentCode.create(
                id=uuid.uuid4().hex,
                #! K.P.……
                assignment=assignment,
                original_code=assignOriginalCode,
                # sample_input='',
                # sample_expect_output='',
                sample_input=json.dumps(testSample.input, ensure_ascii=False),
                sample_expect_output=json.dumps(testSample.expectOutput, ensure_ascii=False),
            )
            await course.assignments.add(assignment)
            return AssignData(
                assignId=assignment.id,
                title=assignment.title,
                description=assignment.description,
                # 从刚创建的 AssignmentCode 里读取原始代码（为 JSON 字符串）
                assignOriginalCode=listStrToList(code.original_code),
            )
        except torExceptions.DoesNotExist:
            raise HTTPException(status_code=404, detail=f"Course with id {course_id} not found")
        except torExceptions.ValidationError as e:
            #! 缺了 str(e) 这个不知道搞了多久()
            raise HTTPException(status_code=400, detail=f"Invalid data provided: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    async def test_submit(submitRequest: TestSubmitRequest) -> str:
        try:
            # 处理提交逻辑
            output = await Playground.run_code(
                code=submitRequest.codeFile.content,
                input=submitRequest.input,
                language=submitRequest.language,
            )
            return output
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    async def submit_code(course_id:CourseId,assign_id:AssignId, submitRequest:SubmitRequest ):
        try:
            # 处理提交逻辑
            output = await Playground.run_code(
                code=submitRequest.codeFile.content,
                input="",
                language="c_cpp",
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
