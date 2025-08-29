import uuid, json

from app.models.assignment import Assignment as AssignmentModel, Analysis
from app.models.ai import AI, AIAnalysisGenerator
from app.schemas.assignment import BasicAnalysis, AiGenAnalysis

import os
from openai import OpenAI


class AIController:
    """用于控制测试相关的AI服务的控制器.由于申请api时间有限，现使用通义千问的统一模型接口进行测试"""
    @classmethod
    async def getBasic(cls, course_id: str, assign_id: str) -> BasicAnalysis:
        #@todo 可能需要重新生成功能 /basic/again ？
        assignment = await AssignmentModel.get(id=assign_id).prefetch_related("analysis")
        analysis = assignment.analysis[0] if assignment.analysis else None
        if analysis:
            return BasicAnalysis(
                resolution=analysis.resolution,
                knowledgeAnalysis=analysis.knowledge_analysis
            )
        else:
            #@todo add to queue instead
            resol = await AIAnalysisGenerator.genResolutions(course_id, assign_id)
            knowled = await AIAnalysisGenerator.genKnowledgeAnalysis(course_id, assign_id)
            analysis = await Analysis.create(
                assignment=assignment,
                resolution=json.dumps(resol.model_dump_json()),
                knowledge_analysis=json.dumps(knowled.model_dump_json())
            )
            await analysis.save()
            return BasicAnalysis(
                resolution=resol,
                knowledgeAnalysis=knowled
            )

    async def getAiGen(cls, course_id: str, assign_id: str) -> AiGenAnalysis:
        assignment = await AssignmentModel.get(id=assign_id).prefetch_related("analysis")
        analysis = assignment.analysis[0] if assignment.analysis else None
        if analysis:
            return AiGenAnalysis(
                codeAnalysis=json.loads(analysis.code_analysis),
                learningSuggestions=json.loads(analysis.learning_suggestions)
            )
        else:
            #@todo add to queue instead
            codeAnal = await AIAnalysisGenerator.genCodeAnalysis(course_id, assign_id)
            learnSug = await AIAnalysisGenerator.genLearningSuggestions(course_id, assign_id)
            return AiGenAnalysis(
                codeAnalysis=codeAnal,
                learningSuggestions=learnSug
            )
