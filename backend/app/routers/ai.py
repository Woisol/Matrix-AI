from fastapi import APIRouter
from controller import ai
from app.schemas import ai as ai_schema


ai_route = APIRouter(tags=["ai"])

@ai_route.get("/courses/{course_id}/assignments/{assign_id}/analysis/basic")
async def basic_analysis(
    course_id: str,
    assign_id: str,
):
    return await ai.TestAiController.post_test_request(course_id, assign_id)
