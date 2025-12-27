import json
import logging

from typing import AsyncGenerator
from fastapi import HTTPException
from tortoise import exceptions as torExceptions

from app.models.assignment import Assignment as AssignmentModel, Analysis
from app.models.ai import AIAnalysisGenerator
from app.schemas.assignment import BasicAnalysis, AiGenAnalysis

import os
from openai import OpenAI
from datetime import datetime, timezone

class AIController:
    """用于控制测试相关的AI服务的控制器.由于申请api时间有限，现使用通义千问的统一模型接口进行测试"""
    @classmethod
    async def getBasic(cls, course_id: str, assign_id: str, re_gen: bool = False) -> BasicAnalysis:
        """获取基础分析（解题思路和知识点分析）"""
        #@todo 可能需要重新生成功能 /basic/again ？
        #Done
        try:
            assignment = await AssignmentModel.get(id=assign_id).prefetch_related("analysis")
            analysis = assignment.analysis[0] if assignment.analysis else None

            if re_gen:
                resol = await AIAnalysisGenerator.genResolutions(assign_id)
                knowled = await AIAnalysisGenerator.genKnowledgeAnalysis(assign_id)
                if analysis:
                    analysis.resolution = resol.model_dump_json()
                    analysis.knowledge_analysis = knowled.model_dump_json()
                    await analysis.save()
                else:
                    #@todo add to queue instead
                    analysis = await Analysis.create(
                        assignment=assignment,
                        resolution=resol.model_dump_json(),
                        knowledge_analysis=knowled.model_dump_json()
                    )
                    await analysis.save()
                return BasicAnalysis(
                    resolution=resol,
                    knowledgeAnalysis=knowled
                )
            elif analysis:
                return BasicAnalysis(
                    resolution=analysis.resolution,
                    knowledgeAnalysis=analysis.knowledge_analysis
                )
            else:
                resol = await AIAnalysisGenerator.genResolutions(assign_id)
                knowled = await AIAnalysisGenerator.genKnowledgeAnalysis(assign_id)
                #@todo add to queue instead
                analysis = await Analysis.create(
                    assignment=assignment,
                    resolution=resol.model_dump_json(),
                    knowledge_analysis=knowled.model_dump_json()
                )
                await analysis.save()
                return BasicAnalysis(
                    resolution=resol,
                    knowledgeAnalysis=knowled
                )
        except torExceptions.DoesNotExist:
            logging.error(f"Assignment with id {assign_id} not found")
            raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found")
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
            assignment = await AssignmentModel.get(id=assign_id).prefetch_related("analysis","submissions")

            # 检查截止时间
            if assignment.end_date:
                if assignment.end_date.tzinfo is None:
                    end_date_utc = assignment.end_date.replace(tzinfo=timezone.utc)
                else:
                    end_date_utc = assignment.end_date.astimezone(timezone.utc)

                if end_date_utc > datetime.now(timezone.utc):
                    logging.warning(f"Attempt to access AI analysis before deadline for assignment {assign_id}")
                    raise HTTPException(status_code=400, detail="Deadline not meet yet")

            # 检查是否已提交作业
            submited = True if assignment.submissions and assignment.submissions[0] else False
            if not submited:
                logging.warning(f"Attempt to access AI analysis without submission for assignment {assign_id}")
                raise HTTPException(status_code=403, detail="AI生成分析功能需要在提交作业后才能使用哦~")

            analysis = assignment.analysis[0] if assignment.analysis else None
            if analysis and analysis.code_analysis and analysis.learning_suggestions:
                return AiGenAnalysis(
                    codeAnalysis=analysis.code_analysis,
                    learningSuggestions=analysis.learning_suggestions
                )
            else:
                #@todo add to queue instead
                codeAnal = await AIAnalysisGenerator.genCodeAnalysis(assign_id)
                learnSug = await AIAnalysisGenerator.genLearningSuggestions(assign_id)
                if analysis:
                    analysis.code_analysis = codeAnal.model_dump_json()
                    analysis.learning_suggestions = learnSug.model_dump_json()
                    await analysis.save()
                else:
                    analysis = await Analysis.create(
                        assignment=assignment,
                        code_analysis=codeAnal.model_dump_json(),
                        learning_suggestions=learnSug.model_dump_json()
                    )
                    await analysis.save()
                return AiGenAnalysis(
                    codeAnalysis=codeAnal,
                    learningSuggestions=learnSug
                )
        except HTTPException:
            # 重新抛出 HTTP 异常（业务逻辑异常）
            raise
        except torExceptions.DoesNotExist:
            logging.error(f"Assignment with id {assign_id} not found")
            raise HTTPException(status_code=404, detail=f"Assignment with id {assign_id} not found")
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
        if analysis_type == "resolution":
            async for chunk in AIAnalysisGenerator.genResolutionsStream(assign_id):
                yield chunk
        elif analysis_type == "knowledge":
            async for chunk in AIAnalysisGenerator.genKnowledgeAnalysisStream(assign_id):
                yield chunk
        else:
            yield f"event: error\ndata: {{\"error\": \"Invalid analysis type\"}}\n\n"

    @classmethod
    async def getAiGenStream(cls, course_id: str, assign_id: str, analysis_type: str) -> AsyncGenerator[str, None]:
        """
        流式获取AI生成分析
        
        Args:
            course_id: 课程ID
            assign_id: 作业ID
            analysis_type: 分析类型 (code 或 learning)
        """
        # 检查是否已提交
        assignment = await AssignmentModel.get(id=assign_id).prefetch_related("submissions")
        
        if assignment.end_date and assignment.end_date > datetime.now(timezone.utc):
            yield f"event: error\ndata: {{\"error\": \"Deadline not meet yet\"}}\n\n"
            return

        submited = True if assignment.submissions and assignment.submissions[0] else False
        if not submited:
            yield f"event: error\ndata: {{\"error\": \"AI生成分析功能需要在提交作业后才能使用哦~\"}}\n\n"
            return

        if analysis_type == "code":
            async for chunk in AIAnalysisGenerator.genCodeAnalysisStream(assign_id):
                yield chunk
        elif analysis_type == "learning":
            async for chunk in AIAnalysisGenerator.genLearningSuggestionsStream(assign_id):
                yield chunk
        else:
            yield f"event: error\ndata: {{\"error\": \"Invalid analysis type\"}}\n\n"

