"""
作业代码表测试 - assignment_codes 表 CRUD 和外键关系验证
"""
import unittest
from datetime import datetime
from tests.orm.conftest import AsyncORMTestCase


class TestAssignmentCodeTable(AsyncORMTestCase):
    """作业代码表测试类"""

    async def test_create_assignment_code(self):
        """测试创建作业代码记录"""
        # 先创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_code_001", "作业代码测试", "program"
        )

        # 创建作业代码
        await self.execute(
            "INSERT INTO assignment_codes (id, assignment_id, original_code, sample_input, sample_expect_output) "
            "VALUES ($1, $2, $3, $4, $5)",
            "code_001", "assign_for_code_001",
            'print("hello")',
            '["hello"]',
            '["hello"]'
        )

        code = await self.fetchrow(
            "SELECT * FROM assignment_codes WHERE id = $1",
            "code_001"
        )
        self.assertIsNotNone(code)
        self.assertEqual(code['id'], "code_001")
        self.assertEqual(code['assignment_id'], "assign_for_code_001")
        self.assertEqual(code['original_code'], 'print("hello")')
        self.assertEqual(code['sample_input'], '["hello"]')
        self.assertEqual(code['sample_expect_output'], '["hello"]')

    async def test_assignment_code_fk_constraint(self):
        """测试作业代码外键约束"""
        # 尝试创建引用不存在的作业的代码记录
        with self.assertRaises(Exception):
            await self.execute(
                "INSERT INTO assignment_codes (id, assignment_id, original_code) "
                "VALUES ($1, $2, $3)",
                "code_fk_test", "nonexistent_assign", "code"
            )

    async def test_assignment_code_field_constraints(self):
        """测试作业代码字段长度限制"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_long_code", "长字段测试作业", "program"
        )

        # original_code 最大 10000 字符
        long_code = "x" * 10000
        await self.execute(
            "INSERT INTO assignment_codes (id, assignment_id, original_code) VALUES ($1, $2, $3)",
            "code_long_code", "assign_for_long_code", long_code
        )
        code = await self.fetchrow(
            "SELECT * FROM assignment_codes WHERE id = $1",
            "code_long_code"
        )
        self.assertIsNotNone(code)
        self.assertEqual(len(code['original_code']), 10000)

        # sample_input 最大 10000 字符
        long_input = "y" * 10000
        await self.execute(
            "INSERT INTO assignment_codes (id, assignment_id, sample_input) VALUES ($1, $2, $3)",
            "code_long_input", "assign_for_long_code", long_input
        )
        code = await self.fetchrow(
            "SELECT * FROM assignment_codes WHERE id = $1",
            "code_long_input"
        )
        self.assertIsNotNone(code)
        self.assertEqual(len(code['sample_input']), 10000)

        # sample_expect_output 最大 10000 字符
        long_output = "z" * 10000
        await self.execute(
            "INSERT INTO assignment_codes (id, assignment_id, sample_expect_output) VALUES ($1, $2, $3)",
            "code_long_output", "assign_for_long_code", long_output
        )
        code = await self.fetchrow(
            "SELECT * FROM assignment_codes WHERE id = $1",
            "code_long_output"
        )
        self.assertIsNotNone(code)
        self.assertEqual(len(code['sample_expect_output']), 10000)

    async def test_assignment_code_read_write(self):
        """测试作业代码读写操作"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_code_rw", "读写测试作业", "program"
        )

        # 创建
        await self.execute(
            "INSERT INTO assignment_codes (id, assignment_id, original_code) VALUES ($1, $2, $3)",
            "code_rw", "assign_for_code_rw", "初始代码"
        )

        # 读取
        code = await self.fetchrow(
            "SELECT * FROM assignment_codes WHERE id = $1",
            "code_rw"
        )
        self.assertIsNotNone(code)
        self.assertEqual(code['original_code'], "初始代码")

        # 更新
        await self.execute(
            "UPDATE assignment_codes SET original_code = $1, sample_input = $2, sample_expect_output = $3 WHERE id = $4",
            "更新后的代码", '["input"]', '["output"]', "code_rw"
        )

        updated = await self.fetchrow(
            "SELECT * FROM assignment_codes WHERE id = $1",
            "code_rw"
        )
        self.assertEqual(updated['original_code'], "更新后的代码")
        self.assertEqual(updated['sample_input'], '["input"]')
        self.assertEqual(updated['sample_expect_output'], '["output"]')

    async def test_assignment_multiple_codes(self):
        """测试一个作业可以有多个代码记录"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_multi_code", "多代码测试作业", "program"
        )

        # 创建多个代码记录
        for i in range(5):
            await self.execute(
                "INSERT INTO assignment_codes (id, assignment_id, original_code) VALUES ($1, $2, $3)",
                f"code_multi_{i}", "assign_multi_code", f"代码{i}"
            )

        # 验证所有代码都属于同一个作业
        codes = await self.fetchall(
            "SELECT * FROM assignment_codes WHERE assignment_id = $1 ORDER BY id",
            "assign_multi_code"
        )
        self.assertEqual(len(codes), 5)
        for i, code in enumerate(codes):
            self.assertEqual(code['assignment_id'], "assign_multi_code")
            self.assertEqual(code['original_code'], f"代码{i}")

    async def test_assignment_code_delete(self):
        """测试删除作业代码"""
        # 创建父作业和代码
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_code_delete", "删除代码测试", "program"
        )
        await self.execute(
            "INSERT INTO assignment_codes (id, assignment_id, original_code) VALUES ($1, $2, $3)",
            "code_delete", "assign_for_code_delete", "待删除代码"
        )

        # 验证存在
        code = await self.fetchrow(
            "SELECT * FROM assignment_codes WHERE id = $1",
            "code_delete"
        )
        self.assertIsNotNone(code)

        # 删除
        await self.execute(
            "DELETE FROM assignment_codes WHERE id = $1",
            "code_delete"
        )

        # 验证删除
        code = await self.fetchrow(
            "SELECT * FROM assignment_codes WHERE id = $1",
            "code_delete"
        )
        self.assertIsNone(code)

    async def test_assignment_code_str_method(self):
        """测试作业代码 __str__ 方法中的 assignment.id 访问"""
        # 创建父作业
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_for_str_test", "Str测试作业", "program"
        )

        # 创建代码
        await self.execute(
            "INSERT INTO assignment_codes (id, assignment_id) VALUES ($1, $2)",
            "code_str_test", "assign_for_str_test"
        )

        # 通过外键获取作业信息
        code = await self.fetchrow(
            "SELECT ac.*, a.title as assignment_title "
            "FROM assignment_codes ac "
            "JOIN assignments a ON ac.assignment_id = a.id "
            "WHERE ac.id = $1",
            "code_str_test"
        )
        self.assertIsNotNone(code)
        self.assertEqual(code['assignment_id'], "assign_for_str_test")
        self.assertEqual(code['assignment_title'], "Str测试作业")


if __name__ == '__main__':
    unittest.main()
