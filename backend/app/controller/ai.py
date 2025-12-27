"""
AI 控制器
"""
import json
import logging
from typing import AsyncGenerator, Optional

from fastapi import HTTPException

from app.models import Assignment as AssignmentModel, fetch_all, fetch_one, execute
from app.models.base import Model
from app.schemas.assignment import BasicAnalysis, AiGenAnalysis


async def _get_assignment_with_relations(assign_id: str) -> Optional[Model]:
    """获取作业记录"""
    try:
        return await AssignmentModel.get(id=assign_id)
    except HTTPException:
        return None


async def _get_analysis(assign_id: str) -> Optional[dict]:
    """获取分析记录"""
    return await fetch_one(
        "SELECT * FROM assignment_analysis WHERE assignment_id = $1 LIMIT 1",
        assign_id
    )


async def _create_or_update_analysis(assign_id: str, resolution: str, knowledge_analysis: str,
                           code_analysis: Optional[str] = None,
                           learning_suggestions: Optional[str] = None):
    """创建或更新分析记录"""
    row = await fetch_one(
        "SELECT id FROM assignment_analysis WHERE assignment_id = $1 LIMIT 1",
        assign_id
    )

    if row:
        # 更新
        await execute(
            """UPDATE assignment_analysis
               SET resolution=$1, knowledge_analysis=$2, code_analysis=$3, learning_suggestions=$4
               WHERE assignment_id=$5""",
            resolution, knowledge_analysis, code_analysis or None, learning_suggestions or None, assign_id
        )
    else:
        # 插入
        await execute(
            """INSERT INTO assignment_analysis
               (assignment_id, resolution, knowledge_analysis, code_analysis, learning_suggestions)
               VALUES ($1, $2, $3, $4, $5)""",
            assign_id, resolution, knowledge_analysis, code_analysis or None, learning_suggestions or None
        )


async def _update_analysis_code_learning(assign_id: str, code_analysis: str, learning_suggestions: str):
    """更新分析记录的 code_analysis 和 learning_suggestions"""
    row = await fetch_one(
        "SELECT id FROM assignment_analysis WHERE assignment_id = $1 LIMIT 1",
        assign_id
    )

    if row:
        await execute(
            """UPDATE assignment_analysis
               SET code_analysis=$1, learning_suggestions=$2
               WHERE assignment_id=$3""",
            code_analysis, learning_suggestions, assign_id
        )
    else:
        await execute(
            """INSERT INTO assignment_analysis
               (assignment_id, code_analysis, learning_suggestions)
               VALUES ($1, $2, $3)""",
            assign_id, code_analysis, learning_suggestions
        )


async def get_basic(course_id: str, assign_id: str, re_gen: bool = False) -> BasicAnalysis:
    """获取基础分析（解题思路和知识点分析）"""
    try:
        assignment = await _get_assignment_with_relations(assign_id)
        if not assignment:
            raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found")

        analysis = await _get_analysis(assign_id)

        if re_gen:
            # TODO: 调用 AI 生成分析
            # resol = await AIAnalysisGenerator.genResolutions(assign_id)
            # knowled = await AIAnalysisGenerator.genKnowledgeAnalysis(assign_id)
            # await _create_analysis(assign_id, resol.model_dump_json(), knowled.model_dump_json())
            # return BasicAnalysis(resolution=resol, knowledgeAnalysis=knowled)
            if analysis:
                return BasicAnalysis(
                    resolution=json.loads(analysis['resolution']) if analysis['resolution'] else None,
                    knowledgeAnalysis=json.loads(analysis['knowledge_analysis']) if analysis['knowledge_analysis'] else None
                )
            else:
                return BasicAnalysis(resolution=None, knowledgeAnalysis=None)
        elif analysis:
            return BasicAnalysis(
                resolution=json.loads(analysis['resolution']) if analysis['resolution'] else None,
                knowledgeAnalysis=json.loads(analysis['knowledge_analysis']) if analysis['knowledge_analysis'] else None
            )
        else:
            return BasicAnalysis(resolution=None, knowledgeAnalysis=None)
    except HTTPException:
        raise
    except json.JSONDecodeError as e:
        logging.error(f"JSON decode error in getBasic for assignment {assign_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error: JSON processing failed")
    except Exception as e:
        logging.error(f"Error occurred in getBasic for assignment {assign_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


async def get_ai_gen(course_id: str, assign_id: str, re_gen: bool = False) -> AiGenAnalysis:
    """获取AI生成的代码分析和学习建议"""
    try:
        assignment = await _get_assignment_with_relations(assign_id)
        if not assignment:
            raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found")

        # 检查截止时间
        if assignment.end_date:
            from datetime import datetime, timezone
            end_date = assignment.end_date
            if isinstance(end_date, str):
                # 解析日期字符串
                end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))

            if end_date.tzinfo is None:
                end_date_utc = end_date.replace(tzinfo=timezone.utc)
            else:
                end_date_utc = end_date.astimezone(timezone.utc)

            if end_date_utc > datetime.now(timezone.utc):
                logging.warning(f"Attempt to access AI analysis before deadline for assignment {assign_id}")
                raise HTTPException(status_code=400, detail="Deadline not meet yet")

        # 检查是否已提交
        submissions = await fetch_all(
            "SELECT * FROM assignment_submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC LIMIT 1",
            assign_id
        )

        if not submissions:
            logging.warning(f"Attempt to access AI analysis without submission for assignment {assign_id}")
            raise HTTPException(status_code=403, detail="AI生成分析功能需要在提交作业后才能使用哦~")

        analysis = await _get_analysis(assign_id)

        if analysis and analysis.get('code_analysis') and analysis.get('learning_suggestions'):
            return AiGenAnalysis(
                codeAnalysis=json.loads(analysis['code_analysis']) if analysis['code_analysis'] else None,
                learningSuggestions=json.loads(analysis['learning_suggestions']) if analysis['learning_suggestions'] else None
            )
        else:
            # TODO: 调用 AI 生成分析
            # codeAnal = await AIAnalysisGenerator.genCodeAnalysis(assign_id)
            # learnSug = await AIAnalysisGenerator.genLearningSuggestions(assign_id)
            # await _update_analysis_code_learning(assign_id, codeAnal.model_dump_json(), learnSug.model_dump_json())
            # return AiGenAnalysis(codeAnalysis=codeAnal, learningSuggestions=learnSug)
            return AiGenAnalysis(
                codeAnalysis=json.loads(analysis['code_analysis']) if analysis and analysis.get('code_analysis') else None,
                learningSuggestions=json.loads(analysis['learning_suggestions']) if analysis and analysis.get('learning_suggestions') else None
            )
    except HTTPException:
        raise
    except json.JSONDecodeError as e:
        logging.error(f"JSON decode error in getAiGen for assignment {assign_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error: JSON processing failed")
    except Exception as e:
        logging.error(f"Error occurred in getAiGen for assignment {assign_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# 兼容 camelCase 命名
getBasic = get_basic
getAiGen = get_ai_gen


async def get_basic_stream(course_id: str, assign_id: str, analysis_type: str) -> AsyncGenerator[str, None]:
    """
    流式获取基础分析

    Args:
        course_id: 课程ID
        assign_id: 作业ID
        analysis_type: 分析类型 (resolution 或 knowledge)
    """
    # TODO: 实现流式 AI 生成
    # if analysis_type == "resolution":
    #     async for chunk in AIAnalysisGenerator.genResolutionsStream(assign_id):
    #         yield chunk
    # elif analysis_type == "knowledge":
    #     async for chunk in AIAnalysisGenerator.genKnowledgeAnalysisStream(assign_id):
    #         yield chunk
    # else:
    #     yield f"event: error\ndata: {{\"error\": \"Invalid analysis type\"}}\n\n"
    yield f"event: error\ndata: {{\"error\": \"Stream not implemented yet\"}}\n\n"


async def get_ai_gen_stream(course_id: str, assign_id: str, analysis_type: str) -> AsyncGenerator[str, None]:
    """
    流式获取AI生成分析

    Args:
        course_id: 课程ID
        assign_id: 作业ID
        analysis_type: 分析类型 (code 或 learning)
    """
    # 检查是否已提交
    assignment = await _get_assignment_with_relations(assign_id)
    if not assignment:
        yield f"event: error\ndata: {{\"error\": \"Assignment not found\"}}\n\n"
        return

    if assignment.end_date:
        from datetime import datetime, timezone
        end_date = assignment.end_date
        if isinstance(end_date, str):
            end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))

        if end_date.tzinfo is None:
            end_date_utc = end_date.replace(tzinfo=timezone.utc)
        else:
            end_date_utc = end_date.astimezone(timezone.utc)

        if end_date_utc > datetime.now(timezone.utc):
            yield f"event: error\ndata: {{\"error\": \"Deadline not meet yet\"}}\n\n"
            return

    submissions = await fetch_all(
        "SELECT * FROM assignment_submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC LIMIT 1",
        assign_id
    )

    if not submissions:
        yield f"event: error\ndata: {{\"error\": \"AI生成分析功能需要在提交作业后才能使用哦~\"}}\n\n"
        return

    # TODO: 实现流式 AI 生成
    # if analysis_type == "code":
    #     async for chunk in AIAnalysisGenerator.genCodeAnalysisStream(assign_id):
    #         yield chunk
    # elif analysis_type == "learning":
    #     async for chunk in AIAnalysisGenerator.genLearningSuggestionsStream(assign_id):
    #         yield chunk
    # else:
    #     yield f"event: error\ndata: {{\"error\": \"Invalid analysis type\"}}\n\n"
    yield f"event: error\ndata: {{\"error\": \"Stream not implemented yet\"}}\n\n"
