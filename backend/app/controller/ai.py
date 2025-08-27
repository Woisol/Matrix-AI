import uuid, json
import requests
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, Path, Form
from tortoise import exceptions as torExceptions

from app.models.course import Course as CourseModel
from app.models.assignment import Assignment as AssignmentModel
from app.schemas.course import Course as CourseData
from app.schemas.general import CourseId, AssignId
from app.schemas.assignment import AssignData, Submit, TestSubmitRequest,SubmitRequest, TestSample, TestSampleCreate, CodeFileInfo
from app.schemas.ai import AiResponse
from assignment import AssignmentController
from course import CourseController
from app.utils.assign import listStrToList

import os
from openai import OpenAI



url = "http://10.10.1.11:38666/v1/chat/completions"
#模型使用url+request库进行调用，需要把格式包入message体中

class TestAiController:
    """用于控制测试相关的AI服务的控制器.由于申请api时间有限，现使用通义千问的统一模型接口进行测试"""

    client =  OpenAI(api_key=os.getenv("sk-b8dc10dafd2445a3b62830eb625634bf"),
                             base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")
    @classmethod
    async def post_test_request(cls, course_id: str, assign_id: str):
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)
            course_data: CourseData = await CourseController.get_course(course_id)
            prompt = f"""你是一个资深的编程作业助教，你的任务是帮助学生理解和分析编程作业。以下是作业的详细信息：
                     课程名称: {course_data.courseName}
                     作业标题: {assign_data.title}
                     作业描述: {assign_data.description}
                     作业原始代码: {assign_data.assignOriginalCode}
                     请基于以上信息，提供以下内容，输出为JSON格式，格式要求如下：
                        {{
                            title: "作业标题",
                            summy: "作业描述的简要总结",
                            "解题思路": "简要描述解决该作业的思路和步骤"
                        }}
"""
            
            response = cls.client.chat.completions.create(
                model="deepseek-r1-distill-qwen-7b", #模型名称选择
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": "帮我分析这个作业的主要知识点和解题思路，要求准确且简洁。"}
                ],
                max_tokens=1000,
                temperature=0.7,
            )
            #TODO: 完善AI返回的格式与校验

            content = json.loads(response.choices[0].message.content)
            return AiResponse(**content)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


class AiController:
    """用于控制有关ai的服务的控制器,正式获得API后使用"""

    async def postResponse(self, course_id: str, assign_id: str):
        try:
            assign_data: AssignData = await AssignmentController.get_assignment(assign_id)
            course_data: CourseData = await CourseController.get_course(course_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
        