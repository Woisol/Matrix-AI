import uuid, datetime
from fastapi import APIRouter, HTTPException, Query, Path, Body,  Form

from app.models.assignment import Assignment as AssignmentModel
from app.models.course import Course as CourseModel
from app.schemas.assignment import AssignData, Submit, TestSample, AssignCreateRequest
from tortoise import exceptions as torExceptions


assign_router = APIRouter(prefix="/api", tags=["assignment"])

@assign_router.get("/courses/{course_id}/assignments/{assign_id}", response_model=AssignData)
async def get_assignment(
    assign_id: str = Path(..., description="作业ID")
    ):
    try:
        assignment = await AssignmentModel.get(id=assign_id).prefetch_related("codes").prefetch_related("submissions")
        if not assignment:
            raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found")
        if assignment.submissions:
            testSample = TestSample(
                input=assignment.codes[0].sample_input,
                expectOutput=assignment.codes[0].sample_expect_output,
                realOutput=assignment.submissions[0].sample_real_output
            )
            submit = Submit(
                score=assignment.submissions[0].score,
                time=assignment.submissions[0].submitted_at,
                testSample=testSample,
                submitCode=assignment.submissions[0].submit_code,
            )
        return AssignData(
            assignId=assignment.id,
            title=assignment.title,
            description=assignment.description,
            assignOriginalCode=assignment.original_code,
            submit=submit if assignment.submissions else None
        )
    except torExceptions.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found or invalid")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@assign_router.post("/courses/{course_id}/assignments", response_model=AssignData)
async def create_assignment(
    course_id: str = Path(..., description="课程ID"),
    title:str = Form(..., description="作业标题"),
    description:str = Form(..., description="作业描述"),
    assignOriginalCode: str = Form(..., description="作业原始代码"),
    ddl: str = Form(..., description="作业截止日期"),
):
    try:
        course = await CourseModel.get(id=course_id)
        assignment = await AssignmentModel.create(
            id=uuid.uuid4().hex,
            title=title,
            description=description,
            type="program",
            #@todo
            # start_date=datetime.n,
            end_date=ddl if ddl else None,
            # course_id=course_id,
            original_code=assignOriginalCode
        )
        #! 注意加个 await
        await course.assignments.add(assignment)
        return AssignData(
            assignId=assignment.id,
            title=assignment.title,
            description=assignment.description,
            assignOriginalCode=assignment.original_code
        )
    except torExceptions.DoesNotExist:
        raise HTTPException(status_code=404, detail=f"Course with id {course_id} not found")
    except torExceptions.ValidationError:
        raise HTTPException(status_code=400, detail=f"Invalid data provided")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
