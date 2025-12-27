"""
AI 控制器 - 使用原生 SQL ORM
"""
import json
import logging

from typing import AsyncGenerator
from fastapi import HTTPException

from app.models import Assignment as AssignmentModel, fetch_all, fetch_one
from app.schemas.assignment import BasicAnalysis, AiGenAnalysis

from datetime import datetime, timezone

from app.models.ai import AIAnalysisGenerator


class AIController:
    """用于控制测试相关的AI服务的控制器"""

    @classmethod
    async def getBasic(cls, course_id: str, assign_id: str, re_gen: bool = False) -> BasicAnalysis:
        """获取基础分析（解题思路和知识点分析）"""
        try:
            # 获取作业
            assignment = await AssignmentModel.get(id=assign_id)

            # 获取分析记录
            analysis = await fetch_one(
                "SELECT * FROM assignment_analysis WHERE assignment_id = $1 LIMIT 1",
                assign_id
            )

            if re_gen:
                resol = await AIAnalysisGenerator.genResolutions(assign_id)
                knowled = await AIAnalysisGenerator.genKnowledgeAnalysis(assign_id)

                # 使用存储过程进行 UPSERT
                await fetch_one(
                    "SELECT upsert_assignment_analysis($1, $2, $3, NULL, NULL)",
                    assign_id,
                    resol.model_dump_json() if resol else None,
                    knowled.model_dump_json() if knowled else None
                )

                return BasicAnalysis(
                    resolution=resol,
                    knowledgeAnalysis=knowled
                )
            elif analysis:
                # asyncpg.Record 需要用字典方式访问字段，不能用属性方式。
                return BasicAnalysis(
                    resolution=json.loads(analysis['resolution']),
                    knowledgeAnalysis=json.loads(analysis['knowledge_analysis'])
                )
            else:
                resol = await AIAnalysisGenerator.genResolutions(assign_id)
                knowled = await AIAnalysisGenerator.genKnowledgeAnalysis(assign_id)

                # 使用存储过程进行 UPSERT
                await fetch_one(
                    "SELECT upsert_assignment_analysis($1, $2, $3, NULL, NULL)",
                    assign_id,
                    resol.model_dump_json() if resol else None,
                    knowled.model_dump_json() if knowled else None
                )
                return BasicAnalysis(resolution=resol, knowledgeAnalysis=knowled)

        except HTTPException:
            raise
        except json.JSONDecodeError as e:
            logging.error(f"JSON decode error in getBasic for assignment {assign_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error: JSON processing failed")
        except Exception as e:
            logging.error(f"Error occurred in getBasic for assignment {assign_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def getAiGen(cls, course_id: str, assign_id: str, re_gen: bool = False) -> AiGenAnalysis:
        """获取AI生成的代码分析和学习建议"""
        try:
            # 获取作业
            assignment = await AssignmentModel.get(id=assign_id)

            # 检查截止时间
            if assignment.end_date:
                end_date = assignment.end_date
                if isinstance(end_date, str):
                    end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))

                if end_date.tzinfo is None:
                    end_date_utc = end_date.replace(tzinfo=timezone.utc)
                else:
                    end_date_utc = end_date.astimezone(timezone.utc)

                if end_date_utc > datetime.now(timezone.utc):
                    logging.warning(f"Attempt to access AI analysis before deadline for assignment {assign_id}")
                    raise HTTPException(status_code=400, detail="Deadline not meet yet")

            # 检查是否已提交作业
            submissions = await fetch_all(
                "SELECT * FROM assignment_submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC LIMIT 1",
                assign_id
            )
            submited = len(submissions) > 0

            if not submited:
                logging.warning(f"Attempt to access AI analysis without submission for assignment {assign_id}")
                raise HTTPException(status_code=403, detail="AI生成分析功能需要在提交作业后才能使用哦~")

            # 获取分析记录
            analysis = await fetch_one(
                "SELECT * FROM assignment_analysis WHERE assignment_id = $1 LIMIT 1",
                assign_id
            )

            if analysis and analysis.get('code_analysis') and analysis.get('learning_suggestions'):
                return AiGenAnalysis(
                    codeAnalysis=json.loads(analysis['code_analysis']) if analysis['code_analysis'] else None,
                    learningSuggestions=json.loads(analysis['learning_suggestions']) if analysis['learning_suggestions'] else None
                )
            else:
                codeAnal = await AIAnalysisGenerator.genCodeAnalysis(assign_id)
                learnSug = await AIAnalysisGenerator.genLearningSuggestions(assign_id)

                # 使用存储过程进行 UPSERT
                await fetch_one(
                    "SELECT upsert_assignment_analysis($1, NULL, NULL, $2, $3)",
                    assign_id,
                    codeAnal.model_dump_json(),
                    learnSug.model_dump_json()
                )

                return AiGenAnalysis(codeAnalysis=codeAnal, learningSuggestions=learnSug)

        except HTTPException:
            raise
        except json.JSONDecodeError as e:
            logging.error(f"JSON decode error in getAiGen for assignment {assign_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error: JSON processing failed")
        except Exception as e:
            logging.error(f"Error occurred in getAiGen for assignment {assign_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def getBasicStream(cls, course_id: str, assign_id: str, analysis_type: str) -> AsyncGenerator[str, None]:
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

    @classmethod
    async def getAiGenStream(cls, course_id: str, assign_id: str, analysis_type: str) -> AsyncGenerator[str, None]:
        """
        流式获取AI生成分析

        Args:
            course_id: 课程ID
            assign_id: 作业ID
            analysis_type: 分析类型 (code 或 learning)
        """
        # 检查作业是否存在
        try:
            assignment = await AssignmentModel.get(id=assign_id)
        except HTTPException:
            yield f"event: error\ndata: {{\"error\": \"Assignment not found\"}}\n\n"
            return

        # 检查截止时间
        if assignment.end_date:
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

        # 检查是否已提交
        submissions = await fetch_all(
            "SELECT * FROM assignment_submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC LIMIT 1",
            assign_id
        )
        submited = len(submissions) > 0

        if not submited:
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


# 兼容 camelCase 命名
getBasic = AIController.getBasic
getAiGen = AIController.getAiGen
getBasicStream = AIController.getBasicStream
getAiGenStream = AIController.getAiGenStream
