import uuid, json, base64
import asyncio, logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, Path, Form
from tortoise import exceptions as torExceptions

# from app.controller.ai import AIAnalysisGenerator
from app.models.course import Course as CourseModel
from app.models.assignment import Assignment as AssignmentModel, AssignmentCode, AssignmentSubmission
from app.models.playground import Playground
from app.schemas.general import CourseId, AssignId
from app.schemas.assignment import AssignData, Submit, TestSubmitRequest,SubmitRequest, TestSample, TestSampleCreate, TestSampleResult, CodeFileInfo, JudgeResult, MdCodeContent

from app.utils.assign import listStrToList, testSampleToResultList


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
                submit = Submit(
                    score=submissions.score,
                    time=submissions.submitted_at,
                    testSample=testSampleToResultList(sample_input=listStrToList(codes.sample_input),sample_output=listStrToList(codes.sample_expect_output),real_output=listStrToList(submissions.sample_real_output),),
                    submitCode=listStrToList(submissions.submit_code),
                )

            return AssignData(
                assignId=assignment.id,
                title=assignment.title,
                description=assignment.description,
                assignOriginalCode=listStrToList(codes.original_code),
                ddl=assignment.end_date,
                submit=submit,
            )
        except torExceptions.DoesNotExist:
            logging.error(f"Assignment with id {assign_id} not found or invalid")
            raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found or invalid")
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
        # testSample: TestSampleCreate,
        ddl: Optional[str],
    ) -> bool:
        try:
            course = await CourseModel.get(id=courseId)
            # .prefetch_related("codes", "submissions") 用于 ManyToMany 😂

            if assignId:
                assignment = await AssignmentModel.get(id=assignId).prefetch_related("codes")
                assignment.title = title
                assignment.description = description
                assignment.end_date = ddl if ddl else None
                await assignment.save()

                assignment.codes[0].original_code = assignOriginalCode
                assignment.codes[0].sample_input = json.dumps(testSample.input, ensure_ascii=False)
                assignment.codes[0].sample_expect_output = json.dumps(testSample.expectOutput, ensure_ascii=False)
                await assignment.codes[0].save()
            else:
                # invalid input for query argument $7: datetime.datetime(2025, 9, 26, 10, 53, 4... (can't subtract offset-naive and offset-aware datetimes)
                assignment = await AssignmentModel.create(
                    id=uuid.uuid4().hex,
                    title=title,
                    description=description,
                    type="program",
                    end_date=ddl if ddl else None,
                    # original_code=assignOriginalCode,
                )
                # _input_str = json.dumps(testSample.input, ensure_ascii=False)
                # code =
                await AssignmentCode.create(
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
            try:
                listStrToList(assignOriginalCode)
            except Exception:
                print("Warning: assignOriginalCode is not a valid JSON string list")
            return True
            # return AssignData(
            #     assignId=assignment.id,
            #     title=assignment.title,
            #     description=assignment.description,
            #     #~~ 从刚创建的 AssignmentCode 里读取原始代码（为 JSON 字符串）
            #     # 偷懒了，直接使用 assignment.codes[0] 在创建路径下需要另外 fetch
            #     assignOriginalCode=listStrToList(assignOriginalCode),
            # )
        except torExceptions.DoesNotExist:
            logging.error(f"Course with id {courseId} not found")
            raise HTTPException(status_code=404, detail=f"Course with id {courseId} not found")
        except json.JSONDecodeError as e:
            logging.error(f"JSON decode error occurred while creating assignment: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid JSON data provided: {str(e)}")
        except torExceptions.ValidationError as e:
            logging.error(f"Validation error occurred while creating assignment: {str(e)}")
            #! 缺了 str(e) 这个不知道搞了多久()
            raise HTTPException(status_code=400, detail=f"Invalid data provided: {str(e)}")
        except Exception as e:
            logging.error(f"Error occurred while creating assignment: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def delete_assignment(cls, course_id: str, assign_id: str) -> None:
        try:
            assignment = await AssignmentModel.get(id=assign_id)
            await assignment.delete()
            return True
        except torExceptions.DoesNotExist:
            logging.error(f"Assignment with id {assign_id} not found during deletion")
            raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found")
        except Exception as e:
            logging.error(f"Error occurred while deleting assignment {assign_id}: {str(e)}")
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
            logging.error(f"Error occurred while testing code submission: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    @classmethod
    async def submit_code(cls, course_id: CourseId, assign_id: AssignId, submitRequest: SubmitRequest):
        try:
            assignment = await AssignmentModel.get(id=assign_id)
            if(assignment.end_date and assignment.end_date < datetime.now(timezone.utc)):
                raise HTTPException(status_code=400, detail="Deadline has passed")
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
                time=datetime.now(timezone.utc),
                testSample=testSampleToResultList(sample_input=sample_input, sample_output=sample_output, real_output=judgeRes.testRealOutput),
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

            #! 使用线程池执行后台任务，避免阻塞事件循环
            import concurrent.futures

            # 创建线程池并提交任务，但不等待完成
            #! 上个实现用 with 会等待全部完成才返回没真正实现 异步
            executor = concurrent.futures.ThreadPoolExecutor()
            loop = asyncio.get_event_loop()

            # 删除之前的 AI 分析 - 传递 assignment.id 而不是 assignment 对象
            assignment_id = assignment.id
            loop.run_in_executor(executor, lambda: asyncio.run(cls.remove_previous_ai_gen_by_id(assignment_id)))

            # 生成用户画像 - 创建独立的任务，避免事件循环绑定问题
            from app.controller.ai import AIAnalysisGenerator
            loop.run_in_executor(executor, lambda: asyncio.run(cls.gen_user_profile_safe()))

            return submit
        except HTTPException as he:
            raise he
        except Exception as e:
            logging.error(f"Error occurred while submitting code for assignment {assign_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    # @classmethod
    # async def remove_previous_ai_gen(cls, assignment: AssignmentModel):
    #     """删除之前的 AI 生成分析"""
    #     try:
    #         _analysis = await assignment.analysis.all()

    #         if _analysis:
    #             analysis = _analysis[0]
    #             analysis.code_analysis = None
    #             analysis.learning_suggestions = None
    #             await analysis.save()
    #     except Exception as e:
    #         # 静默处理错误，不影响主流程
    #         logging.error(f"清除 {assignment.id} 的 AI 分析缓存时出错: {e}")

    @classmethod
    async def remove_previous_ai_gen_by_id(cls, assignment_id: str):
        """通过 ID 删除之前的 AI 生成分析，避免事件循环绑定问题"""
        try:
            # 在新的事件循环中重新查询数据，避免绑定到不同事件循环的问题
            assignment = await AssignmentModel.get(id=assignment_id)
            _analysis = await assignment.analysis.all()

            if _analysis:
                analysis = _analysis[0]
                analysis.code_analysis = None
                analysis.learning_suggestions = None
                await analysis.save()
        except Exception as e:
            # 静默处理错误，不影响主流程
            logging.error(f"清除 {assignment_id} 的 AI 分析缓存时出错: {e}")

    @classmethod
    async def gen_user_profile_safe(cls):
        """线程安全的用户画像生成方法，避免事件循环绑定问题"""
        try:
            from app.controller.ai import AIAnalysisGenerator
            await AIAnalysisGenerator.genUserProfile()
        except Exception as e:
            # 静默处理错误，不影响主流程
            logging.error(f"生成用户画像时出错: {e}")
