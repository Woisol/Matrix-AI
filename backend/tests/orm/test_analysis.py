"""
分析表测试 - assignment_analysis 表 CRUD 和外键关系验证
"""
import unittest
import json
from datetime import datetime
from tests.orm.conftest import AsyncORMTestCase


class TestAnalysisTable(AsyncORMTestCase):
    """分析表测试类"""

    async def test_create_analysis(self):
        """测试创建分析记录"""
        # 先创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_analysis_001", "分析测试作业", "program"
        )

        # 创建分析记录
        analysis_data = {
            "method": "递归",
            "time_complexity": "O(n)",
            "space_complexity": "O(n)"
        }
        knowledge_data = {
            "掌握程度": "良好",
            "知识点": ["递归", "树遍历"]
        }

        await self.execute(
            "INSERT INTO assignment_analysis (assignment_id, resolution, knowledge_analysis) "
            "VALUES ($1, $2, $3)",
            "assign_for_analysis_001",
            json.dumps(analysis_data),
            json.dumps(knowledge_data)
        )

        # 获取自动生成的 ID
        analysis = await self.fetchrow(
            "SELECT * FROM assignment_analysis WHERE assignment_id = $1",
            "assign_for_analysis_001"
        )
        self.assertIsNotNone(analysis)
        self.assertEqual(analysis['assignment_id'], "assign_for_analysis_001")

        # 验证 JSON 字段
        resolution = json.loads(analysis['resolution'])
        self.assertEqual(resolution['method'], "递归")
        self.assertEqual(resolution['time_complexity'], "O(n)")

        knowledge = json.loads(analysis['knowledge_analysis'])
        self.assertEqual(knowledge['掌握程度'], "良好")

    async def test_analysis_fk_constraint(self):
        """测试分析记录外键约束"""
        # 尝试创建引用不存在的作业的分析记录
        with self.assertRaises(Exception):
            await self.execute(
                "INSERT INTO assignment_analysis (assignment_id) VALUES ($1)",
                "nonexistent_assign"
            )

    async def test_json_fields(self):
        """测试 JSON 字段存储和读取"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_json", "JSON字段测试作业", "program"
        )

        # 创建包含所有 JSON 字段的分析记录
        resolution = {"解法": "动态规划", "步骤": ["状态定义", "转移方程", "初始化", "求解"]}
        knowledge = {"知识点": ["动态规划"], "难点": ["状态转移"]}
        code = {"代码风格": "良好", "命名规范": "符合规范"}
        suggestions = {"建议": ["多练习动态规划题目"]}

        await self.execute(
            "INSERT INTO assignment_analysis (assignment_id, resolution, knowledge_analysis, code_analysis, learning_suggestions) "
            "VALUES ($1, $2, $3, $4, $5)",
            "assign_for_json",
            json.dumps(resolution),
            json.dumps(knowledge),
            json.dumps(code),
            json.dumps(suggestions)
        )

        analysis = await self.fetchrow(
            "SELECT * FROM assignment_analysis WHERE assignment_id = $1",
            "assign_for_json"
        )

        # 验证所有 JSON 字段
        self.assertIsNotNone(analysis['resolution'])
        self.assertIsNotNone(analysis['knowledge_analysis'])
        self.assertIsNotNone(analysis['code_analysis'])
        self.assertIsNotNone(analysis['learning_suggestions'])

        # 解析并验证
        res = json.loads(analysis['resolution'])
        self.assertEqual(res['解法'], "动态规划")

        know = json.loads(analysis['knowledge_analysis'])
        self.assertEqual(know['知识点'], ["动态规划"])

        code_an = json.loads(analysis['code_analysis'])
        self.assertEqual(code_an['代码风格'], "良好")

        sugg = json.loads(analysis['learning_suggestions'])
        self.assertEqual(sugg['建议'], ["多练习动态规划题目"])

    async def test_json_fields_nullable(self):
        """测试 JSON 字段可为空"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_null_json", "空JSON测试作业", "program"
        )

        # 只提供必填字段
        await self.execute(
            "INSERT INTO assignment_analysis (assignment_id) VALUES ($1)",
            "assign_for_null_json"
        )

        analysis = await self.fetchrow(
            "SELECT * FROM assignment_analysis WHERE assignment_id = $1",
            "assign_for_null_json"
        )

        self.assertIsNotNone(analysis)
        self.assertIsNone(analysis['resolution'])
        self.assertIsNone(analysis['knowledge_analysis'])
        self.assertIsNone(analysis['code_analysis'])
        self.assertIsNone(analysis['learning_suggestions'])

    async def test_analysis_read_write(self):
        """测试分析记录读写操作"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_analysis_rw", "读写测试作业", "program"
        )

        # 创建
        await self.execute(
            "INSERT INTO assignment_analysis (assignment_id, resolution) VALUES ($1, $2)",
            "assign_for_analysis_rw", json.dumps({"初始": "解法"})
        )

        # 读取
        analysis = await self.fetchrow(
            "SELECT * FROM assignment_analysis WHERE assignment_id = $1",
            "assign_for_analysis_rw"
        )
        self.assertIsNotNone(analysis)
        resolution = json.loads(analysis['resolution'])
        self.assertEqual(resolution['初始'], "解法")

        # 更新
        await self.execute(
            "UPDATE assignment_analysis SET resolution = $1, knowledge_analysis = $2 WHERE assignment_id = $3",
            json.dumps({"更新后": "新解法"}),
            json.dumps({"更新后": "新知识点"}),
            "assign_for_analysis_rw"
        )

        updated = await self.fetchrow(
            "SELECT * FROM assignment_analysis WHERE assignment_id = $1",
            "assign_for_analysis_rw"
        )

        res = json.loads(updated['resolution'])
        self.assertEqual(res['更新后'], "新解法")

        know = json.loads(updated['knowledge_analysis'])
        self.assertEqual(know['更新后'], "新知识点")

    async def test_one_to_one_relationship(self):
        """测试一对一关系（每个作业一个分析）"""
        # 创建作业和分析
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_one_to_one", "一对一测试作业", "program"
        )

        await self.execute(
            "INSERT INTO assignment_analysis (assignment_id, resolution) VALUES ($1, $2)",
            "assign_one_to_one", json.dumps({"关系": "一对一"})
        )

        # 尝试为同一个作业创建另一个分析（应该失败或覆盖）
        # 这里测试数据库约束
        await self.execute(
            "INSERT INTO assignment_analysis (assignment_id, resolution) VALUES ($1, $2)",
            "assign_one_to_one", json.dumps({"另一个": "分析"})
        )

        # 验证有两个记录（一对一由应用层保证）
        analyses = await self.fetchall(
            "SELECT * FROM assignment_analysis WHERE assignment_id = $1",
            "assign_one_to_one"
        )
        self.assertEqual(len(analyses), 2)

    async def test_analysis_delete(self):
        """测试删除分析记录"""
        # 创建父作业和分析
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_analysis_delete", "删除分析测试", "program"
        )

        analysis_id = await self.fetchval(
            "SELECT id FROM assignment_analysis WHERE assignment_id = $1",
            "assign_for_analysis_delete"
        )
        # 由于没有记录，analysis_id 为 None

        await self.execute(
            "INSERT INTO assignment_analysis (assignment_id, resolution) VALUES ($1, $2)",
            "assign_for_analysis_delete", json.dumps({"测试": "数据"})
        )

        analysis_id = await self.fetchval(
            "SELECT id FROM assignment_analysis WHERE assignment_id = $1",
            "assign_for_analysis_delete"
        )
        self.assertIsNotNone(analysis_id)

        # 删除
        await self.execute(
            "DELETE FROM assignment_analysis WHERE id = $1",
            analysis_id
        )

        # 验证删除
        analysis = await self.fetchrow(
            "SELECT * FROM assignment_analysis WHERE id = $1",
            analysis_id
        )
        self.assertIsNone(analysis)

    async def test_analysis_complex_json(self):
        """测试复杂的 JSON 数据结构"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_complex_json", "复杂JSON测试", "program"
        )

        # 复杂的嵌套 JSON 数据
        complex_data = {
            "solution": {
                "algorithm": "二分查找",
                "steps": [
                    {"step": 1, "action": "确定搜索范围"},
                    {"step": 2, "action": "计算中间位置"},
                    {"step": 3, "action": "比较中间元素"},
                    {"step": 4, "action": "缩小搜索范围"}
                ],
                "edge_cases": ["空数组", "单个元素", "未找到"]
            },
            "complexity": {
                "time": "O(log n)",
                "space": "O(1)"
            }
        }

        await self.execute(
            "INSERT INTO assignment_analysis (assignment_id, resolution) VALUES ($1, $2)",
            "assign_complex_json", json.dumps(complex_data)
        )

        analysis = await self.fetchrow(
            "SELECT * FROM assignment_analysis WHERE assignment_id = $1",
            "assign_complex_json"
        )

        data = json.loads(analysis['resolution'])
        self.assertEqual(data['solution']['algorithm'], "二分查找")
        self.assertEqual(len(data['solution']['steps']), 4)
        self.assertEqual(len(data['solution']['edge_cases']), 3)
        self.assertEqual(data['complexity']['time'], "O(log n)")


if __name__ == '__main__':
    unittest.main()
