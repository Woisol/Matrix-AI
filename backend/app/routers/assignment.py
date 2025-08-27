import json
from fastapi import APIRouter, Path, Form, Body
from app.schemas.assignment import AssignData, AssignCreateRequest, TestSubmitRequest, TestSampleCreate
from app.controller.assignment import AssignmentController


assign_router = APIRouter(prefix="/api", tags=["assignment"])

@assign_router.get("/courses/{course_id}/assignments/{assign_id}", response_model=AssignData)
async def get_assignment(assign_id: str = Path(..., description="作业ID")):
    return await AssignmentController.get_assignment(assign_id=assign_id)

@assign_router.post("/courses/{course_id}/assignments", response_model=AssignData)
async def create_assignment(
    course_id: str = Path(..., description="课程ID"),
    #! 传入为 form，复用较麻烦不管了……
    # assignCreate: AssignCreateRequest = Body(...)
    title: str = Form(..., description="作业标题"),
    description: str = Form(..., description="作业描述"),
    assignOriginalCode: str = Form(..., description="作业原始代码"),
    testSample: str = Form(..., description="测试样例"),
    ddl: str = Form(..., description="作业截止日期"),
):
    #! 极其混乱，请求传输必须为 str，访问 .input 需要 json，但存储又需要 str
    _testSampleJSON: TestSampleCreate = TestSampleCreate.model_validate_json(testSample)

    return await AssignmentController.create_assignment(
        course_id=course_id,
        title=title,
        description=description,
        assignOriginalCode=assignOriginalCode,
        testSample=_testSampleJSON,
        ddl=ddl,
    )

@assign_router.post("/playground/submission", response_model=str)
async def test_submit(submitRequest: TestSubmitRequest = Body(...)):
    return await AssignmentController.test_submit(submitRequest=submitRequest)

@assign_router.post("/courses/{course_id}/assignments/{assign_id}/submission", response_model=str)
async def submit_code(
    course_id: str = Path(..., description="课程ID"),
    assign_id: str = Path(..., description="作业ID"),
    submitRequest: TestSubmitRequest = Body(...)
 ):
    return await AssignmentController.submit_code(course_id, assign_id, submitRequest=submitRequest)
    
