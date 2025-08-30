import json

from fastapi import HTTPException

from app.models.assignment import Assignment as AssignmentModel, Analysis
from app.models.ai import AI, AIAnalysisGenerator
from app.schemas.assignment import BasicAnalysis, AiGenAnalysis

import os
from openai import OpenAI
from datetime import datetime, timezone

class AIController:
    """用于控制测试相关的AI服务的控制器.由于申请api时间有限，现使用通义千问的统一模型接口进行测试"""
    @classmethod
    async def getBasic(cls, course_id: str, assign_id: str, re_gen: bool = False) -> BasicAnalysis:
        #@todo 可能需要重新生成功能 /basic/again ？
        assignment = await AssignmentModel.get(id=assign_id).prefetch_related("analysis")
        analysis = assignment.analysis[0] if assignment.analysis else None

        if re_gen:
            resol = await AIAnalysisGenerator.genResolutions(course_id, assign_id)
            knowled = await AIAnalysisGenerator.genKnowledgeAnalysis(course_id, assign_id)
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
            resol = await AIAnalysisGenerator.genResolutions(course_id, assign_id)
            knowled = await AIAnalysisGenerator.genKnowledgeAnalysis(course_id, assign_id)
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



    @classmethod
    async def getAiGen(cls, course_id: str, assign_id: str, re_gen: bool = False) -> AiGenAnalysis:
        assignment = await AssignmentModel.get(id=assign_id).prefetch_related("analysis","submissions")
        if assignment.end_date and assignment.end_date > datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Deadline not meet yet")

        submited = True if assignment.submissions and assignment.submissions[0] else False
        if not submited:
            raise HTTPException(status_code=403, detail="AI生成分析功能需要在提交作业后才能使用哦~")

        analysis = assignment.analysis[0] if assignment.analysis else None
        if analysis and analysis.code_analysis and analysis.learning_suggestions:
            return AiGenAnalysis(
                codeAnalysis=analysis.code_analysis,
                learningSuggestions=analysis.learning_suggestions
            )
        else:
            #@todo add to queue instead
            codeAnal = await AIAnalysisGenerator.genCodeAnalysis(course_id, assign_id)
            learnSug = await AIAnalysisGenerator.genLearningSuggestions(course_id, assign_id)
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
