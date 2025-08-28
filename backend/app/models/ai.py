import os
from pydantic import BaseModel, Field
from typing import Optional
from fastapi import HTTPException
from openai import OpenAI

from app.schemas.assignment import AssignData, Submit, TestSubmitRequest,SubmitRequest, TestSample, TestSampleCreate, CodeFileInfo, MatrixAnalysisProps, MatrixAnalysisContent, BasicAnalysis
from app.constants.prompt import AIPrompt
from assignment import AssignmentController

class AIMessage(BaseModel):
    role: str
    content: str

class AI:
    class AICONFIG:
        MODEL=r"deepseek-r1-distill-qwen-7b",
        MAX_TOKENS=1000,
        TEMPERATURE=0.7,
        def MESSAGES(prompt: str) -> list[AIMessage]:
            return [
                AIMessage(role="system", content=prompt),
                # AIMessage(role="user", content="请给出详细的解题步骤和思路。")
            ]
    )
    client =  OpenAI(api_key=os.getenv("sk-b8dc10dafd2445a3b62830eb625634bf"),
                            base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")

    @classmethod
    async def getResponse(cls, prompt: str) -> str:
        response = cls.client.chat.completions.create(
            model=cls.AICONFIG.MODEL,
            messages=cls.AICONFIG.MESSAGES(prompt),
            max_tokens=cls.AICONFIG.MAX_TOKENS,
            temperature=cls.AICONFIG.TEMPERATURE,
        )
        #TODO: 完善AI返回的格式与校验

        return response.choices[0].message.content

class AIQueue:
    #@todo 使用队列
    """AI 任务队列，用于管理和处理多个 AI 请求"""
    def __init__(self):
        self.queue = []

    def add_to_queue(self, item):
        self.queue.append(item)

    def process_queue(self):
        while self.queue:
            item = self.queue.pop(0)
            raise NotImplementedError("AI 任务处理逻辑未实现")

class AIAnalysisGenerator:
    @classmethod
    async def genResolutions(cls, course_id: str, assign_id: str) -> MatrixAnalysisProps:
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)
            # course_data: CourseData = await CourseController.get_course(course_id)

            # 获取所有可能解法
            _resolContent = await AI.getResponse(prompt=AIPrompt.RESOLUTION(
                assign_data.title, assign_data.description, assign_data.assignOriginalCode[0].content))

            resolContents = [c.strip() for c in _resolContent.split("\n") if c.strip() != ""]

            # 生成标题
            resolTitle = [await AI.getResponse(AIPrompt.TITLE_CODE(code)) for code in resolContents]

            analysis = MatrixAnalysisProps(
                content=[
                    MatrixAnalysisContent(
                        title=t,
                        content=c
                    ) for t, c in zip(resolTitle, resolContents)
                ],
                #@todo implement summary prompt and logic
                summary="",
                showInEditor=False
            )

            return analysis

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    @classmethod
    async def genKnowledgeAnalysis(cls, course_id: str, assign_id: str) -> MatrixAnalysisProps:
        raise NotImplementedError("Knowledge analysis generation not implemented yet")

    @classmethod
    async def genCodeAnalysis(cls, course_id: str, assign_id: str) -> MatrixAnalysisProps:
        raise NotImplementedError("Code analysis generation not implemented yet")

    @classmethod
    async def genLearningSuggestions(cls, course_id: str, assign_id: str) -> MatrixAnalysisProps:
        raise NotImplementedError("Learning suggestions generation not implemented yet")
