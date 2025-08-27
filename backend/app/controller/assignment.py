import uuid
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, Path, Form
from tortoise import exceptions as torExceptions

from app.models.assignment import Assignment as AssignmentModel
from app.models.course import Course as CourseModel
from app.schemas.assignment import AssignData, Submit, TestSample, CodeFileInfo

from app.utils.assign import listStrToList


class AssignmentController:
    async def get_assignment(assign_id: str = Path(..., description="作业ID")) -> AssignData:
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

            return AssignData(
                assignId=assignment.id,
                title=assignment.title,
                description=assignment.description,
                assignOriginalCode=listStrToList(assignment.original_code),
                submit=submit,
            )
        except torExceptions.DoesNotExist:
            raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found or invalid")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    async def create_assignment(
        course_id: str = Path(..., description="课程ID"),
        title: str = Form(..., description="作业标题"),
        description: str = Form(..., description="作业描述"),
        assignOriginalCode: str = Form(..., description="作业原始代码"),
        ddl: Optional[str] = Form(None, description="作业截止日期"),
    ) -> AssignData:
        try:
            course = await CourseModel.get(id=course_id)
            assignment = await AssignmentModel.create(
                id=uuid.uuid4().hex,
                title=title,
                description=description,
                type="program",
                end_date=ddl if ddl else None,
                original_code=assignOriginalCode,
            )
            await course.assignments.add(assignment)
            return AssignData(
                assignId=assignment.id,
                title=assignment.title,
                description=assignment.description,
                assignOriginalCode=listStrToList(assignment.original_code),
            )
        except torExceptions.DoesNotExist:
            raise HTTPException(status_code=404, detail=f"Course with id {course_id} not found")
        except torExceptions.ValidationError:
            raise HTTPException(status_code=400, detail="Invalid data provided")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
