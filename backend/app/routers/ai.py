from fastapi import APIRouter, Query
from app.controller.ai import AIController
from fastapi.responses import StreamingResponse


ai_route = APIRouter(tags=["ai"])

@ai_route.get("/courses/{course_id}/assignments/{assign_id}/analysis/basic")
async def basic_analysis(
    course_id: str,
    assign_id: str,
    reGen: bool = Query(False, description="是否重新生成分析")
):
    return await AIController.getBasic(course_id, assign_id, re_gen=reGen)

@ai_route.get("/courses/{course_id}/assignments/{assign_id}/analysis/aiGen")
async def generate_analysis(
    course_id: str,
    assign_id: str,
):
    return await AIController.getAiGen(course_id, assign_id)


@ai_route.get("/courses/{course_id}/assignments/{assign_id}/analysis/basic/stream")
async def basic_analysis_stream(
    course_id: str,
    assign_id: str,
    analysisType: str = Query("resolution", description="分析类型: resolution 或 knowledge")
):
    """流式生成基础分析（解题分析或知识点分析）"""
    return StreamingResponse(
        AIController.getBasicStream(course_id, assign_id, analysisType),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # 禁用nginx缓冲
        }
    )

@ai_route.get("/courses/{course_id}/assignments/{assign_id}/analysis/aiGen/stream")
async def generate_analysis_stream(
    course_id: str,
    assign_id: str,
    analysisType: str = Query("code", description="分析类型: code 或 learning")
):
    """流式生成AI分析（代码分析或学习建议）"""
    return StreamingResponse(
        AIController.getAiGenStream(course_id, assign_id, analysisType),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


