import os
import sys
import types
import unittest
from unittest.mock import AsyncMock, MagicMock, patch
from typing import cast
#import asyncio,sys,os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from app.models.ai import AI

from app.constants import prompt as Prompt
from app.schemas.assignment import AssignData, CodeFileInfo, Complexity
# 确保可以导入 app 包


# stub openai 避免安装真实依赖（需要是 ModuleType）
openai_stub = types.ModuleType("openai")
setattr(openai_stub, "OpenAI", MagicMock())  # type: ignore[attr-defined]
sys.modules.setdefault("openai", openai_stub)



@unittest.skip("duplicate of backend/test/test_ai.py; skipping")
class Dummy(unittest.TestCase):
    def test_skip(self):
        self.assertTrue(True)


class TestAIConfig(unittest.TestCase):
    def test_messages_format(self):
        prompt = "hello"
        msgs = AI.AIConfig.messages(prompt)
        self.assertIsInstance(msgs, list)
        self.assertGreaterEqual(len(msgs), 1)
        self.assertIn("role", msgs[0])
        self.assertIn("content", msgs[0])
        self.assertEqual(msgs[0]["role"], "system")
        self.assertEqual(msgs[0]["content"], prompt)


class TestAIAnalysisGenerator(unittest.IsolatedAsyncioTestCase):
    async def test_gen_resolutions_success(self):
        # 构造假的作业数据
        assign = AssignData(
            assignId="assign-1",
            title="两数之和",
            description="给定数组与目标，返回两数下标",
            assignOriginalCode=[CodeFileInfo(fileName="main.cpp", content="int main(){}")],
            ddl=None,
            submit=None,
        )

        # 第一次调用 get_response 返回所有解法（当前实现按换行切分）
        solutions_text = await AI.get_response(Prompt.AIPrompt.RESOLUTION(assign.title,
                                                                         assign.description,
                                                                         assign.assignOriginalCode[0].content))
        print(solutions_text)


    #     get_resp_side_effects = [solutions_text, title_1, title_2, comp_1, comp_2]

    #     with patch("app.controller.assignment.AssignmentController.get_assignment", new=AsyncMock(return_value=assign)):
    #         with patch.object(AI, "getResponse", new=AsyncMock(side_effect=get_resp_side_effects)):
    #             res = await AIAnalysisGenerator.genResolutions("course-1", "assign-1")

    #     self.assertIsNotNone(res)
    #     self.assertEqual(len(res.content), 2)

    #     # 校验标题与内容
    #     self.assertEqual(res.content[0].title, title_1)
    #     self.assertEqual(res.content[0].content, "code_v1")
    #     self.assertEqual(res.content[1].title, title_2)
    #     self.assertEqual(res.content[1].content, "code_v2")

    #     # 校验复杂度解析
    #     self.assertIsNotNone(res.content[0].complexity)
    #     self.assertIsNotNone(res.content[1].complexity)
    #     c0 = cast(Complexity, res.content[0].complexity)
    #     c1 = cast(Complexity, res.content[1].complexity)
    #     self.assertEqual(c0.time, "O(n)")
    #     self.assertEqual(c0.space, "O(1)")
    #     self.assertEqual(c1.time, "O(n log n)")
    #     self.assertEqual(c1.space, "O(n)")

    #     # 其他字段
    #     self.assertEqual(res.summary, "")
    #     self.assertFalse(res.showInEditor)

    # async def test_gen_resolutions_error(self):
    #     assign = AssignData(
    #         assignId="assign-1",
    #         title="题目",
    #         description="描述",
    #         assignOriginalCode=[CodeFileInfo(fileName="a.cpp", content="int main(){}")] ,
    #         submit=None,
    #     )

    #     from fastapi import HTTPException

    #     with patch("app.controller.assignment.AssignmentController.get_assignment", new=AsyncMock(return_value=assign)):
    #         with patch.object(AI, "getResponse", new=AsyncMock(side_effect=Exception("boom"))):
    #             with self.assertRaises(HTTPException) as ctx:
    #                 await AIAnalysisGenerator.genResolutions("course-1", "assign-1")
    #             self.assertEqual(ctx.exception.status_code, 500)


if __name__ == "__main__":
    unittest.main()
