
import os, logging
import requests
import json
from queue import Queue
from typing import Any, Dict, List, Optional,AsyncGenerator

from fastapi import HTTPException
from openai import OpenAI
from pydantic import BaseModel, Field

from app.controller.assignment import AssignmentController
from app.constants.prompt import AIPrompt
from app.models.assignment import AssignmentSubmission
from app.models.user import User
from app.schemas.assignment import (
    AssignData, BasicAnalysis, CodeFileInfo, Complexity, MatrixAnalysisContent,
    MatrixAnalysisProps, Submit, TestSample, TestSampleCreate, TestSubmitRequest,
    SubmitRequest
)
from app.utils.ai import code_md_wrapper
from app.constants.user import UserMatrixAI




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
        MODEL = "qwen3-max"
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
        api_key=os.getenv("OPENAI_API_KEY", "sk-b8dc10dafd2445a3b62830eb625634bf"),
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
    async def get_response_stream(cls, prompt: str) -> AsyncGenerator[str, None]:
        """获取AI流式响应（使用官方SDK的stream模式）"""
        try:
            stream = cls.client.chat.completions.create(
                model=cls.AIConfig.MODEL,
                messages=cls.AIConfig.messages(prompt),
                max_tokens=cls.AIConfig.MAX_TOKENS,
                temperature=cls.AIConfig.TEMPERATURE,
                stream=True
            )
            
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            logging.error(f"Stream error: {e}")
            raise
                


    @classmethod
    async def __get_response(cls, prompt: str) -> str:
        """通过比赛官方给的API请求获取AI响应"""
        import asyncio

        def _make_request():
            """执行同步的requests调用"""
            request_data: AIRequest = AIRequest(
                message=cls.AIConfig.messages(prompt)
            )
            response = requests.post(request_data.url, json=request_data.model_dump(), stream=True)
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

        # 使用 asyncio.run_in_executor 让同步调用变成异步
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _make_request)


class AIQueue:
    """AI任务队列，用于管理和处理多个AI请求"""
    num_tasks: int = 0

    def __init__(self) -> None:
        """初始化任务队列"""
        self.queue: Queue = Queue()
        self.num_tasks = 0

    def add_to_queue(self, item: Any) -> None:
        """添加项目到队列"""
        self.queue.put(item)
        self.num_tasks += 1
        self.process_queue()

    def process_queue(self) -> None:
        """处理队列中的任务"""
        while not self.queue.empty():
            item: Any = self.queue.get()
            # 处理任务

            self.queue.task_done()


class AIAnalysisGenerator:
    """AI分析生成器，提供各种类型的分析功能"""

    @classmethod
    async def genResolutions(
        cls, assign_id: str
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
            # @todo 新增错误响应，注意文档
        except requests.ConnectTimeout as e:
            raise HTTPException(
                status_code=504,
                detail="AI service timeout, please try again later."
            )

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )

    @classmethod
    async def genKnowledgeAnalysis(
        cls,  assign_id: str
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
        cls, assign_id: str
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

            _user = await User.filter(username=UserMatrixAI.username).all()
            if not _user:
                logging.error("No user")
            user = _user[0]

            # 获取代码分析
            code_analysis_content = await AI.get_response(
                prompt=AIPrompt.CODEANALYSIS(
                    assign_data.title,
                    assign_data.description,
                    submitted_code,
                    user.code_style
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
        cls, assign_id: str
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

            # 获取提交的代码，如果没有则使用空字符串
            submitted_code = ""
            if assign_data.submit and assign_data.submit.submitCode:
                submitted_code = assign_data.submit.submitCode[0].content

            _user = await User.filter(username=UserMatrixAI.username).all()
            if not _user:
                logging.error("No user")
            user = _user[0]

            # 获取学习建议
            learning_suggestion_content = await AI.get_response(
                prompt=AIPrompt.LEARNING_SUGGESTIONS(
                    assign_data.title,
                    assign_data.description,
                    submitted_code,
                    user.knowledge_status
                )
            )
            learning_suggestion_contents = [
                c.strip() for c in learning_suggestion_content.split("---") if c.strip()
            ]

            # 生成标题
            learning_suggestion_titles = [
                #queue here
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
    @classmethod
    async def genUserCodeStyle(cls, previous_analysis: str, submission_str: str):
        return await AI.get_response(AIPrompt.CODE_STYLE(previous_analysis, submission_str))

    @classmethod
    async def genUserKnowledgeStatus(cls, previous_analysis: str, submission_str: str):
        return await AI.get_response(AIPrompt.KNOWLEDGE_STATUS(previous_analysis, submission_str))

    @classmethod
    async def genUserProfile(cls):
        logging.info(f"Received user profile generate request")

        try:
            # 完全重新初始化数据库连接，避免事件循环绑定问题
            from tortoise import Tortoise
            from app.database import TORTOISE_ORM

            # 重新初始化
            if not Tortoise._inited:
                await Tortoise.init(config=TORTOISE_ORM)

            # 重新导入模型以确保使用新的连接
            #! 其实关键在于用户模块() 重新导入即可不用重新连接数据库
            from app.models.user import User as UserModel
            from app.models.assignment import AssignmentSubmission as SubmissionModel

            _user = await UserModel.filter(username=UserMatrixAI.username).first()
            if not _user:
                logging.error("No user found")
                return
            user = _user

            # 使用 prefetch_related 避免 N+1 查询
            submissions = await SubmissionModel.filter(
                student_id=UserMatrixAI.username
            ).prefetch_related('assignment').all()

            if not submissions:
                logging.error("No submissions found for user")
                return

            submission_str = ""
            for submission in submissions:
                try:
                    submit_code_data = json.loads(submission.submit_code)
                    if submit_code_data and len(submit_code_data) > 0:
                        content = submit_code_data[0].get('content', '')
                        submission_str += f"""【{submission.assignment.title}】

用户提交的代码：
{content}

---
"""
                except (json.JSONDecodeError, IndexError, AttributeError) as e:
                    logging.warning(f"Failed to parse submission code: {e}")
                    continue

            if not submission_str.strip():
                logging.warning("No valid submission content found")
                return

            code_style = await cls.genUserCodeStyle(user.code_style, submission_str)
            knowledge_status = await cls.genUserKnowledgeStatus(user.knowledge_status, submission_str)

            user.code_style = code_style
            user.knowledge_status = knowledge_status
            await user.save()

            logging.info("User profile updated successfully")

        except Exception as e:
            logging.error(f"Error in genUserProfile: {e}")
            # 不抛出异常，避免影响主流程

    @classmethod
    async def genResolutionsStream(
        cls, assign_id: str
    ) -> AsyncGenerator[str, None]:
        """
        流式生成解题分析

        Args:
            assign_id: 作业ID

        Yields:
            SSE格式的数据流
        """
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)
            logging.info(f"Received resolution generate request (stream)")

            # 1. 流式获取所有可能解法
            yield f"event: section\ndata: {{\"type\": \"resolution\", \"status\": \"generating\"}}\n\n"
            
            full_content = ""
            async for chunk in AI.get_response_stream(
                prompt=AIPrompt.RESOLUTION(
                    assign_data.title,
                    assign_data.description,
                    assign_data.assignOriginalCode[0].content
                )
            ):
                full_content += chunk
                yield f"data: {json.dumps({'chunk': chunk, 'type': 'resolution'})}\n\n"
            
            # 2. 分割解法
            resol_contents = [c.strip() for c in full_content.split("---") if c.strip()]
            
            yield f"event: section\ndata: {{\"type\": \"processing\", \"total\": {len(resol_contents)}}}\n\n"

            # 3. 为每个解法生成标题和复杂度
            result_contents = []
            for idx, code in enumerate(resol_contents):
                yield f"event: progress\ndata: {{\"current\": {idx + 1}, \"total\": {len(resol_contents)}}}\n\n"
                
                # 生成标题
                title = await AI.get_response(AIPrompt.TITLE_CODE(code))
                
                # 生成复杂度
                complexity_text = await AI.get_response(AIPrompt.COMPLEXITY(code))
                lines = complexity_text.split("\n")
                time_complexity = lines[0].split(":")[-1].strip() if lines else "O(n)"
                space_complexity = lines[1].split(":")[-1].strip() if len(lines) > 1 else "O(1)"

                result_contents.append({
                    "title": title,
                    "content": code_md_wrapper(code),
                    "complexity": {
                        "time": time_complexity,
                        "space": space_complexity
                    }
                })
            
            # 4. 发送最终结果
            yield f"event: complete\ndata: {json.dumps({'content': result_contents, 'summary': None, 'showInEditor': False})}\n\n"

        except Exception as e:
            error_msg = f"Internal server error: {str(e)}"
            logging.error(error_msg)
            yield f"event: error\ndata: {json.dumps({'error': error_msg})}\n\n"

    @classmethod
    async def genKnowledgeAnalysisStream(
        cls, assign_id: str
    ) -> AsyncGenerator[str, None]:
        """流式生成知识点分析"""
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)
            logging.info(f"Received knowledge analysis generate request (stream)")

            yield f"event: section\ndata: {{\"type\": \"knowledge\", \"status\": \"generating\"}}\n\n"
            
            full_content = ""
            async for chunk in AI.get_response_stream(
                prompt=AIPrompt.KNOWLEDGEANALYSIS(
                    assign_data.title,
                    assign_data.description,
                    assign_data.assignOriginalCode[0].content
                )
            ):
                full_content += chunk
                yield f"data: {json.dumps({'chunk': chunk, 'type': 'knowledge'})}\n\n"
            
            knowledge_contents = [c.strip() for c in full_content.split("---") if c.strip()]
            
            yield f"event: section\ndata: {{\"type\": \"processing\", \"total\": {len(knowledge_contents)}}}\n\n"

            result_contents = []
            for idx, content_text in enumerate(knowledge_contents):
                yield f"event: progress\ndata: {{\"current\": {idx + 1}, \"total\": {len(knowledge_contents)}}}\n\n"
                
                title = await AI.get_response(AIPrompt.TITLE(content_text))
                result_contents.append({
                    "title": title,
                    "content": content_text,
                    "complexity": None
                })
            
            yield f"event: complete\ndata: {json.dumps({'content': result_contents, 'summary': '', 'showInEditor': False})}\n\n"

        except Exception as e:
            error_msg = f"Internal server error: {str(e)}"
            logging.error(error_msg)
            yield f"event: error\ndata: {json.dumps({'error': error_msg})}\n\n"

    @classmethod
    async def genCodeAnalysisStream(
        cls, assign_id: str
    ) -> AsyncGenerator[str, None]:
        """流式生成代码分析"""
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)
            
            submitted_code = ""
            if assign_data.submit and assign_data.submit.submitCode:
                submitted_code = assign_data.submit.submitCode[0].content

            logging.info(f"Received code analysis generate request (stream)")

            _user = await User.filter(username=UserMatrixAI.username).all()
            if not _user:
                logging.error("No user")
                yield f"event: error\ndata: {json.dumps({'error': 'User not found'})}\n\n"
                return
            user = _user[0]

            yield f"event: section\ndata: {{\"type\": \"code_analysis\", \"status\": \"generating\"}}\n\n"
            
            full_content = ""
            async for chunk in AI.get_response_stream(
                prompt=AIPrompt.CODEANALYSIS(
                    assign_data.title,
                    assign_data.description,
                    submitted_code,
                    user.code_style
                )
            ):
                full_content += chunk
                yield f"data: {json.dumps({'chunk': chunk, 'type': 'code_analysis'})}\n\n"
            
            code_analysis_contents = [c.strip() for c in full_content.split("---") if c.strip()]
            
            yield f"event: section\ndata: {{\"type\": \"processing\", \"total\": {len(code_analysis_contents)}}}\n\n"

            result_contents = []
            for idx, content_text in enumerate(code_analysis_contents):
                yield f"event: progress\ndata: {{\"current\": {idx + 1}, \"total\": {len(code_analysis_contents)}}}\n\n"
                
                title = await AI.get_response(AIPrompt.TITLE(content_text))
                result_contents.append({
                    "title": title,
                    "content": content_text,
                    "complexity": None
                })
            
            yield f"event: complete\ndata: {json.dumps({'content': result_contents, 'summary': '', 'showInEditor': False})}\n\n"

        except Exception as e:
            error_msg = f"Internal server error: {str(e)}"
            logging.error(error_msg)
            yield f"event: error\ndata: {json.dumps({'error': error_msg})}\n\n"

    @classmethod
    async def genLearningSuggestionsStream(
        cls, assign_id: str
    ) -> AsyncGenerator[str, None]:
        """流式生成学习建议"""
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)

            submitted_code = ""
            if assign_data.submit and assign_data.submit.submitCode:
                submitted_code = assign_data.submit.submitCode[0].content

            logging.info(f"Received learning suggestions generate request (stream)")

            _user = await User.filter(username=UserMatrixAI.username).all()
            if not _user:
                logging.error("No user")
                yield f"event: error\ndata: {json.dumps({'error': 'User not found'})}\n\n"
                return
            user = _user[0]

            yield f"event: section\ndata: {{\"type\": \"learning\", \"status\": \"generating\"}}\n\n"
            
            full_content = ""
            async for chunk in AI.get_response_stream(
                prompt=AIPrompt.LEARNING_SUGGESTIONS(
                    assign_data.title,
                    assign_data.description,
                    submitted_code,
                    user.knowledge_status
                )
            ):
                full_content += chunk
                yield f"data: {json.dumps({'chunk': chunk, 'type': 'learning'})}\n\n"
            
            learning_contents = [c.strip() for c in full_content.split("---") if c.strip()]
            
            yield f"event: section\ndata: {{\"type\": \"processing\", \"total\": {len(learning_contents)}}}\n\n"

            result_contents = []
            for idx, content_text in enumerate(learning_contents):
                yield f"event: progress\ndata: {{\"current\": {idx + 1}, \"total\": {len(learning_contents)}}}\n\n"
                
                title = await AI.get_response(AIPrompt.TITLE(content_text))
                result_contents.append({
                    "title": title,
                    "content": content_text,
                    "complexity": None
                })
            
            yield f"event: complete\ndata: {json.dumps({'content': result_contents, 'summary': '', 'showInEditor': False})}\n\n"

        except Exception as e:
            error_msg = f"Internal server error: {str(e)}"
            logging.error(error_msg)
            yield f"event: error\ndata: {json.dumps({'error': error_msg})}\n\n"


