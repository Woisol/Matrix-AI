from fastapi import APIRouter
from app.controller.ai import AIController
from app.schemas import ai as ai_schema


ai_route = APIRouter(prefix="/api", tags=["ai"])

@ai_route.get("/courses/{course_id}/assignments/{assign_id}/analysis/basic")
async def basic_analysis(
    course_id: str,
    assign_id: str,
):
    return await AIController.getBasic(course_id, assign_id)

@ai_route.get("/courses/{course_id}/assignments/{assign_id}/analysis/aiGen")
async def generate_analysis(
    course_id: str,
    assign_id: str,
):
    return await AIController.getAiGen(course_id, assign_id)
