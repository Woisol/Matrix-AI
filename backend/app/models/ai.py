import os
from pydantic import BaseModel, Field
from typing import Optional
from openai import OpenAI
class AIMessage(BaseModel):
    role: str
    content: str

class AIConfig:
    MODEL:str
    MAX_TOKENS:int
    TEMPERATURE:float
    MESSAGES: callable[Optional[list[AIMessage]]] = None

class AI:
    AICONFIG : AIConfig = AIConfig(
        MODEL=r"deepseek-r1-distill-qwen-7b",
        MAX_TOKENS=1000,
        TEMPERATURE=0.7,
        MESSAGES= lambda prompt: [
            AIMessage(role="system", content=prompt),
            # AIMessage(role="user", content="请给出详细的解题步骤和思路。")
        ]
    )
    client =  OpenAI(api_key=os.getenv(""),
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
    """AI 任务队列，用于管理和处理多个 AI 请求"""
    def __init__(self):
        self.queue = []

    def add_to_queue(self, item):
        self.queue.append(item)

    def process_queue(self):
        while self.queue:
            item = self.queue.pop(0)
            # Process the item
