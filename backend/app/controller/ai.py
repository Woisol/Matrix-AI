import uuid, json
import requests
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, Path, Form
from tortoise import exceptions as torExceptions

from app.models.course import Course as CourseModel
from app.models.assignment import Assignment as AssignmentModel
from app.models.ai import AI
from app.schemas.course import Course as CourseData
from app.schemas.general import CourseId, AssignId
from app.schemas.assignment import AssignData, Submit, TestSubmitRequest,SubmitRequest, TestSample, TestSampleCreate, CodeFileInfo, MatrixAnalysisProps, MatrixAnalysisContent, BasicAnalysis
from app.schemas.ai import AiResponse
from app.constants.prompt import AIPrompt
from assignment import AssignmentController
from course import CourseController
from app.utils.assign import listStrToList

import os
from openai import OpenAI

# url = "http://10.10.1.11:38666/v1/chat/completions"
#模型使用url+request库进行调用，需要把格式包入message体中

class TestAiController:
    """用于控制测试相关的AI服务的控制器.由于申请api时间有限，现使用通义千问的统一模型接口进行测试"""
    @classmethod
    async def genResolutions(cls, course_id: str, assign_id: str) -> MatrixAnalysisProps:
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)
            # course_data: CourseData = await CourseController.get_course(course_id)

            # 获取所有可能解法
            _resoltContent = await AI.getResponse(prompt=AIPrompt.RESOLUTION(
                assign_data.title, assign_data.description, assign_data.assignOriginalCode[0].content))

            resoltContents = [c.strip() for c in _resoltContent.split("\n") if c.strip() != ""]

            # 生成标题
            resoltTitle = [await AI.getResponse(AIPrompt.TITLE_CODE(code)) for code in resoltContents]

            analysis = MatrixAnalysisProps(
                content=[
                    MatrixAnalysisContent(
                        title=t,
                        content=c
                    ) for t, c in zip(resoltTitle, resoltContents)
                ],
                #@todo implement summary prompt and logic
                summary=""
                showInEditor=False
            )

            return analysis

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

