import uuid, json
import requests
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, Path, Form
from tortoise import exceptions as torExceptions

from app.models.course import Course as CourseModel
from app.models.assignment import Assignment as AssignmentModel
from app.models.ai import AI, AIAnalysisGenerator
from app.schemas.course import Course as CourseData
from app.schemas.general import CourseId, AssignId
from app.schemas.assignment import AssignData, Submit, TestSubmitRequest,SubmitRequest, TestSample, TestSampleCreate, CodeFileInfo, MatrixAnalysisProps, MatrixAnalysisContent, BasicAnalysis, AiGenAnalysis
from app.schemas.ai import AiResponse
from app.constants.prompt import AIPrompt
from assignment import AssignmentController
from course import CourseController

import os
from openai import OpenAI

# url = "http://10.10.1.11:38666/v1/chat/completions"
#模型使用url+request库进行调用，需要把格式包入message体中

class AIController:
    """用于控制测试相关的AI服务的控制器.由于申请api时间有限，现使用通义千问的统一模型接口进行测试"""
    @classmethod
    async def getBasic(cls, course_id: str, assign_id: str) -> BasicAnalysis:
        assignment = await AssignmentModel.get(id=assign_id).prefetch_related("analysis")
        analysis = assignment.analysis[0] if assignment.analysis else None
        if analysis:
            return BasicAnalysis(
                resolution=json.loads(analysis.resolution),
                knowledgeAnalysis=json.loads(analysis.knowledge_analysis)
            )
        else:
            #@todo add to queue instead
            resol = await AIAnalysisGenerator.genResolutions(course_id, assign_id)
            knowled = await AIAnalysisGenerator.genKnowledgeAnalysis(course_id, assign_id)
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
