import uuid, json
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, Path, Form
from tortoise import exceptions as torExceptions

from app.models.course import Course as CourseModel
from app.models.assignment import Assignment as AssignmentModel, AssignmentCode, AssignmentSubmission
from app.models.playground import Playground
from app.schemas.general import CourseId, AssignId
from app.schemas.assignment import AssignData, Submit, TestSubmitRequest,SubmitRequest, TestSample, TestSampleCreate, CodeFileInfo, JudgeResult

from app.utils.assign import listStrToList


class AssignmentController:
    @classmethod
    async def get_assignment(cls,assign_id: str) -> AssignData:
        try:
            assignment = await AssignmentModel.get(id=assign_id).prefetch_related("codes").prefetch_related("submissions")
            if not assignment:
                raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found")

            _codes = await assignment.codes.all()
            if not _codes:
                raise HTTPException(status_code=404, detail=f"Code for assignment id {assign_id} not found or invalid")
            codes = _codes[0]

            _submissions = await assignment.submissions.all()
            submit = None
            if _submissions:
                submissions = _submissions[0]
                testSample = TestSample(
                    input=listStrToList(codes.sample_input),
                    expectOutput=listStrToList(codes.sample_expect_output),
                    realOutput=listStrToList(submissions.sample_real_output),
                )
                submit = Submit(
                    score=submissions.score,
                    time=submissions.submitted_at,
                    testSample=testSample,
                    submitCode=listStrToList(submissions.submit_code),
                )


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


    @classmethod
    async def create_assignment(
        cls,
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
    @classmethod
    async def test_submit(cls, submitRequest: TestSubmitRequest) -> str:
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
    @classmethod
    async def submit_code(cls, course_id: CourseId, assign_id: AssignId, submitRequest: SubmitRequest):
        try:
            assignment = await AssignmentModel.get(id=assign_id)
            _codes = await assignment.codes.all()
            if not _codes:
                raise HTTPException(status_code=404, detail=f"Code for assignment id {assign_id} not found or invalid")
            codes = _codes[0]
            sample_input = listStrToList(codes.sample_input)
            sample_output = listStrToList(codes.sample_expect_output)

            judgeRes:JudgeResult = await Playground.judge_code(
                code=submitRequest.codeFile.content,
                testSample=TestSampleCreate(input=sample_input, expectOutput=sample_output),
            )
            submit = Submit(
                score=judgeRes.score,
                time=datetime.now(),
                testSample=TestSample(
                    input=sample_input,
                    expectOutput=sample_output,
                    realOutput=judgeRes.testRealOutput,
                ),
                submitCode=[submitRequest.codeFile],
            )

            # 检查是否已有提交记录，有则更新，无则创建
            _submission = await assignment.submissions.all()
            submitModel:AssignmentSubmission | None = None
            if _submission:
                submission = _submission[0]
                # 更新现有提交
                submission.score = submit.score
                submission.sample_real_output = json.dumps(judgeRes.testRealOutput, ensure_ascii=False)
                submission.submit_code = json.dumps([submitRequest.codeFile.model_dump()], ensure_ascii=False)
                #~~ 确实需要手动更新 因为设置了 auto_now_add 而非 auto_now
                # submission.submitted_at = datetime.now()
                submitModel = submission
            else:
                # 创建新提交
                submitModel = await AssignmentSubmission.create(
                    id=uuid.uuid4().hex,
                    assignment=assignment,
                    student_id="Matrix AI",
                    score=submit.score,
                    sample_real_output=json.dumps(judgeRes.testRealOutput, ensure_ascii=False),
                    submit_code=json.dumps([submitRequest.codeFile.model_dump()], ensure_ascii=False),
                )
            await submitModel.save()
            return submit
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
