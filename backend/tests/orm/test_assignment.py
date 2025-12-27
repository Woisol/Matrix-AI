"""
作业表测试 - assignments 表 CRUD 操作验证
"""
import unittest
from datetime import datetime, timedelta
from tests.orm.conftest import AsyncORMTestCase


class TestAssignmentTable(AsyncORMTestCase):
    """作业表测试类"""

    async def test_create_assignment(self):
        """测试创建作业"""
        await self.execute(
            "INSERT INTO assignments (id, title, description, type, start_date, end_date) "
            "VALUES ($1, $2, $3, $4, $5, $6)",
            "assign_001", "第一次作业", "这是一个简单的作业", "choose",
            datetime.now(), datetime.now() + timedelta(days=7)
        )

        assignment = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_001"
        )
        self.assertIsNotNone(assignment)
        self.assertEqual(assignment['id'], "assign_001")
        self.assertEqual(assignment['title'], "第一次作业")
        self.assertEqual(assignment['description'], "这是一个简单的作业")
        self.assertEqual(assignment['type'], "choose")

    async def test_assignment_type_enum_values(self):
        """测试作业类型枚举值"""
        # choose 类型
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_choose", "选择题作业", "choose"
        )

        # program 类型
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_program", "编程作业", "program"
        )

        choose_assign = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_choose"
        )
        program_assign = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_program"
        )

        self.assertEqual(choose_assign['type'], "choose")
        self.assertEqual(program_assign['type'], "program")

    async def test_assignment_datetime_fields(self):
        """测试作业日期时间字段"""
        start = datetime.now()
        end = start + timedelta(days=7)

        await self.execute(
            "INSERT INTO assignments (id, title, type, start_date, end_date) "
            "VALUES ($1, $2, $3, $4, $5)",
            "assign_datetime", "日期测试作业", "program", start, end
        )

        assignment = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_datetime"
        )

        self.assertIsNotNone(assignment['start_date'])
        self.assertIsNotNone(assignment['end_date'])
        self.assertGreater(assignment['end_date'], assignment['start_date'])

    async def test_assignment_nullable_datetime(self):
        """测试作业日期时间字段可为空"""
        # 不提供日期
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_no_date", "无日期作业", "choose"
        )

        assignment = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_no_date"
        )

        self.assertIsNone(assignment['start_date'])
        self.assertIsNone(assignment['end_date'])

    async def test_assignment_field_constraints(self):
        """测试作业字段长度限制"""
        # id 最大 50 字符
        long_id = "a" * 50
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            long_id, "测试长ID作业", "choose"
        )
        assignment = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            long_id
        )
        self.assertIsNotNone(assignment)
        self.assertEqual(len(assignment['id']), 50)

        # title 最大 200 字符
        long_title = "t" * 200
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_long_title", long_title, "choose"
        )
        assignment = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_long_title"
        )
        self.assertIsNotNone(assignment)
        self.assertEqual(len(assignment['title']), 200)

        # description 最大 1000 字符
        long_desc = "d" * 1000
        await self.execute(
            "INSERT INTO assignments (id, title, description, type) VALUES ($1, $2, $3, $4)",
            "assign_long_desc", "长描述作业", long_desc, "choose"
        )
        assignment = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_long_desc"
        )
        self.assertIsNotNone(assignment)
        self.assertEqual(len(assignment['description']), 1000)

    async def test_assignment_read_write(self):
        """测试作业读写操作"""
        # 创建
        await self.execute(
            "INSERT INTO assignments (id, title, description, type) "
            "VALUES ($1, $2, $3, $4)",
            "assign_rw", "读写测试作业", "初始描述", "choose"
        )

        # 读取
        assignment = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_rw"
        )
        self.assertIsNotNone(assignment)
        self.assertEqual(assignment['description'], "初始描述")

        # 更新
        await self.execute(
            "UPDATE assignments SET title = $1, description = $2, type = $3 WHERE id = $4",
            "更新后的标题", "更新后的描述", "program", "assign_rw"
        )

        updated = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_rw"
        )
        self.assertEqual(updated['title'], "更新后的标题")
        self.assertEqual(updated['description'], "更新后的描述")
        self.assertEqual(updated['type'], "program")

    async def test_assignment_timestamps(self):
        """测试作业时间戳字段"""
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_ts_test", "时间戳测试", "choose"
        )

        assignment = await self.fetchrow(
            "SELECT created_at, updated_at FROM assignments WHERE id = $1",
            "assign_ts_test"
        )

        # 验证时间戳字段存在且不为 NULL
        self.assertIsNotNone(assignment['created_at'])
        self.assertIsNotNone(assignment['updated_at'])

    async def test_assignment_delete(self):
        """测试删除作业"""
        # 创建
        await self.execute(
            "INSERT INTO assignments (id, title, type) VALUES ($1, $2, $3)",
            "assign_delete", "待删除作业", "choose"
        )

        # 验证存在
        assignment = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_delete"
        )
        self.assertIsNotNone(assignment)

        # 删除
        await self.execute(
            "DELETE FROM assignments WHERE id = $1",
            "assign_delete"
        )

        # 验证删除
        assignment = await self.fetchrow(
            "SELECT * FROM assignments WHERE id = $1",
            "assign_delete"
        )
        self.assertIsNone(assignment)


if __name__ == '__main__':
    unittest.main()
