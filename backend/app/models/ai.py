
import os, logging
import requests
import json
from typing import Any, Dict, List, Optional

from fastapi import HTTPException
from openai import OpenAI
from pydantic import BaseModel, Field

from app.controller.assignment import AssignmentController
from app.constants.prompt import AIPrompt
from app.schemas.assignment import (
    AssignData, BasicAnalysis, CodeFileInfo, Complexity, MatrixAnalysisContent,
    MatrixAnalysisProps, Submit, TestSample, TestSampleCreate, TestSubmitRequest,
    SubmitRequest
)
from app.utils.ai import code_md_wrapper


class AIMessage(BaseModel):
    """AI消息模型，包含角色和内容"""
    role: str
    content: str


class AIRequest(BaseModel):
    """AI请求模型，用于包装API调用参数"""

    url: str = "http://10.10.1.11:38666/v1/chat/completions"
    # 模型使用url+request库进行调用，需要把格式包入message体中
    message: List[Dict[str, Any]]
    model: str = "deepseek-r1-distill-qwen-7b"
    stream: bool = True
    temperature: float = 0.01
    max_tokens: int = 5000


class AI:
    """AI服务类，处理与OpenAI API的交互"""

    class AIConfig:
        """AI配置类"""
        MODEL = "deepseek-r1-distill-qwen-7b"
        MAX_TOKENS = 1000
        TEMPERATURE = 0.7

        @classmethod
        def messages(cls, prompt: str) -> List[Dict[str, str]]:
            """构建消息列表"""
            return [
                {"role": "system", "content": prompt},
                # {"role": "user", "content": "请给出详细的解题步骤和思路。"}
            ]

    # 从环境变量获取API密钥，提高安全性
    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY", ""),
        base_url=os.getenv(
            "OPENAI_BASE_URL",
            "https://dashscope.aliyuncs.com/compatible-mode/v1"
        )
    )

    @classmethod
    async def get_response(cls, prompt: str) -> str:
        """获取AI响应"""
        response = cls.client.chat.completions.create(
            model=cls.AIConfig.MODEL,
            messages=cls.AIConfig.messages(prompt),
            max_tokens=cls.AIConfig.MAX_TOKENS,
            temperature=cls.AIConfig.TEMPERATURE,
        )

        return (response.choices[0].message.content
                if response.choices[0].message.content else "")

    @classmethod
    async def get_response_from_request(cls, prompt: str) -> str:
        """通过官方给的API请求获取AI响应"""

        request_data: AIRequest = AIRequest(
            message=cls.AIConfig.messages(prompt)
        )

        response = requests.post(AIRequest.url, json = request_data.model_dump(),stream=True)
        response.encoding = 'utf-8'
        ai_response = ''
        for line in response.iter_lines(decode_unicode=True):
            # api返回格式的回答包在data中
            # 差不多像data: {... ,"choices":[{"index":0,"delta":{"role":"assistant","content":"流式内容"},"finish_reason":null}]}
            if line.startswith("data: "):
                try:
                    json_data = json.loads(line[5:])
                    if 'choices' in json_data:
                        content = json_data['choices'][0]['delta'].get('content','')
                        if content:
                            ai_response += content
                except json.JSONDecodeError:
                    continue
        return ai_response


class AIQueue:
    """AI任务队列，用于管理和处理多个AI请求"""

    def __init__(self) -> None:
        """初始化任务队列"""
        self.queue: List[Any] = []

    def add_to_queue(self, item: Any) -> None:
        """添加项目到队列"""
        self.queue.append(item)

    def process_queue(self) -> None:
        """处理队列中的任务"""
        while self.queue:
            item = self.queue.pop(0)
            raise NotImplementedError("AI任务处理逻辑未实现")


class AIAnalysisGenerator:
    """AI分析生成器，提供各种类型的分析功能"""

    @classmethod
    async def genResolutions(
        cls, course_id: str, assign_id: str
    ) -> MatrixAnalysisProps:
        """
        生成解题分析

        Args:
            course_id: 课程ID
            assign_id: 作业ID

        Returns:
            MatrixAnalysisProps: 解题分析结果

        Raises:
            HTTPException: 当处理过程中出现错误时
        """
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)
            # course_data: CourseData = await CourseController.get_course(course_id)

            logging.info(f"Received resolution generate request")
            # 获取所有可能解法
            resol_content = await AI.get_response(
                prompt=AIPrompt.RESOLUTION(
                    assign_data.title,
                    assign_data.description,
                    assign_data.assignOriginalCode[0].content
                )
            )
            resol_contents = [
                c.strip() for c in resol_content.split("---") if c.strip()
            ]

            # 生成标题
            resol_titles = [
                await AI.get_response(AIPrompt.TITLE_CODE(code))
                for code in resol_contents
            ]
            # 生成复杂度
            resol_complexities = [
                await AI.get_response(AIPrompt.COMPLEXITY(code))
                for code in resol_contents
            ]

            # 构建分析内容
            content = []
            for title, content_text, complexity_text in zip(
                resol_titles, resol_contents, resol_complexities
            ):
                lines = complexity_text.split("\n")
                time_complexity = lines[0].split(":")[-1].strip()
                space_complexity = lines[1].split(":")[-1].strip()

                content.append(MatrixAnalysisContent(
                    title=title,
                    content=code_md_wrapper(content_text),
                    complexity=Complexity(
                        time=time_complexity,
                        space=space_complexity
                    )
                ))

            analysis = MatrixAnalysisProps(
                content=content,
                # TODO: implement summary prompt and logic
                summary=None,
                showInEditor=False
            )

            return analysis

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )

    @classmethod
    async def genKnowledgeAnalysis(
        cls, course_id: str, assign_id: str
    ) -> MatrixAnalysisProps:
        """
        生成知识点分析

        Args:
            course_id: 课程ID
            assign_id: 作业ID

        Returns:
            MatrixAnalysisProps: 知识点分析结果
        """
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)

            logging.info(f"Received knowledge analysis generate request")

            # 获取知识点分析
            knowledge_content = await AI.get_response(
                prompt=AIPrompt.KNOWLEDGEANALYSIS(
                    assign_data.title,
                    assign_data.description,
                    assign_data.assignOriginalCode[0].content
                )
            )
            knowledge_contents = [
                c.strip() for c in knowledge_content.split("---") if c.strip()
            ]

            # 生成标题
            knowledge_titles = [
                await AI.get_response(AIPrompt.TITLE(content))
                for content in knowledge_contents
            ]
            # 构建分析内容
            content = []
            for title, content_text in zip(knowledge_titles, knowledge_contents):
                content.append(MatrixAnalysisContent(
                    title=title,
                    content=content_text,
                    complexity=None
                ))

            analysis = MatrixAnalysisProps(
                content=content,
                # TODO: implement summary prompt and logic
                summary="",
                showInEditor=False
            )

            return analysis

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )

    @classmethod
    async def genCodeAnalysis(
        cls, course_id: str, assign_id: str
    ) -> MatrixAnalysisProps:
        """
        生成代码分析

        Args:
            course_id: 课程ID
            assign_id: 作业ID

        Returns:
            MatrixAnalysisProps: 代码分析结果
        """
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)

            # 获取提交的代码，如果没有则使用空字符串
            submitted_code = ""
            if assign_data.submit and assign_data.submit.submitCode:
                submitted_code = assign_data.submit.submitCode[0].content

                logging.info(f"Received code analysis generate request")

            # 获取代码分析
            code_analysis_content = await AI.get_response(
                prompt=AIPrompt.CODEANALYSIS(
                    assign_data.title,
                    assign_data.description,
                    submitted_code
                )
            )
            code_analysis_contents = [
                c.strip() for c in code_analysis_content.split("---") if c.strip()
            ]

            # 生成标题
            code_analysis_titles = [
                await AI.get_response(AIPrompt.TITLE(content))
                for content in code_analysis_contents
            ]
            # 构建分析内容
            content = []
            for title, content_text in zip(code_analysis_titles, code_analysis_contents):
                content.append(MatrixAnalysisContent(
                    title=title,
                    content=content_text,
                    complexity=None
                ))

            analysis = MatrixAnalysisProps(
                content=content,
                # TODO: implement summary prompt and logic
                summary="",
                showInEditor=False
            )

            return analysis

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )

    @classmethod
    async def genLearningSuggestions(
        cls, course_id: str, assign_id: str
    ) -> MatrixAnalysisProps:
        """
        生成学习建议

        Args:
            course_id: 课程ID
            assign_id: 作业ID

        Returns:
            MatrixAnalysisProps: 学习建议结果
        """
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)

            logging.info(f"Received learning suggestions generate request")

            # 获取学习建议
            learning_suggestion_content = await AI.get_response(
                prompt=AIPrompt.LEARNING_SUGGESTIONS(
                    assign_data.title,
                    assign_data.description,
                    assign_data.assignOriginalCode[0].content
                )
            )
            learning_suggestion_contents = [
                c.strip() for c in learning_suggestion_content.split("---") if c.strip()
            ]

            # 生成标题
            learning_suggestion_titles = [
                await AI.get_response(AIPrompt.TITLE(content))
                for content in learning_suggestion_contents
            ]
            # 构建分析内容
            content = []
            for title, content_text in zip(learning_suggestion_titles, learning_suggestion_contents):
                content.append(MatrixAnalysisContent(
                    title=title,
                    content=content_text,
                    complexity=None
                ))

            analysis = MatrixAnalysisProps(
                content=content,
                # TODO: implement summary prompt and logic
                summary="",
                showInEditor=False
            )

            return analysis

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )
