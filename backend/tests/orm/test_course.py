"""
课程表测试 - courses 表 CRUD 操作验证
"""
import unittest
from datetime import datetime
from tests.orm.conftest import AsyncORMTestCase


class TestCourseTable(AsyncORMTestCase):
    """课程表测试类"""

    async def test_create_course(self):
        """测试创建课程"""
        await self.execute(
            "INSERT INTO courses (id, course_name, type, status, completed) "
            "VALUES ($1, $2, $3, $4, $5)",
            "course_001", "Python 基础", "public", "open", False
        )

        course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_001"
        )
        self.assertIsNotNone(course)
        self.assertEqual(course['id'], "course_001")
        self.assertEqual(course['course_name'], "Python 基础")
        self.assertEqual(course['type'], "public")
        self.assertEqual(course['status'], "open")
        self.assertEqual(course['completed'], False)

    async def test_course_default_values(self):
        """测试课程默认值"""
        # 只提供必填字段，测试默认值
        await self.execute(
            "INSERT INTO courses (id, course_name) VALUES ($1, $2)",
            "course_default_test", "测试默认值课程"
        )

        course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_default_test"
        )
        self.assertIsNotNone(course)
        # type 默认为 "public"
        self.assertEqual(course['type'], "public")
        # status 默认为 "open"
        self.assertEqual(course['status'], "open")
        # completed 默认为 False
        self.assertEqual(course['completed'], False)

    async def test_course_type_enum_values(self):
        """测试课程类型字段的有效值"""
        # 创建不同类型的课程
        await self.execute(
            "INSERT INTO courses (id, course_name, type) VALUES ($1, $2, $3)",
            "course_public", "公开课", "public"
        )
        await self.execute(
            "INSERT INTO courses (id, course_name, type) VALUES ($1, $2, $3)",
            "course_private", "私有课", "private"
        )

        public_course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_public"
        )
        private_course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_private"
        )

        self.assertEqual(public_course['type'], "public")
        self.assertEqual(private_course['type'], "private")

    async def test_course_status_enum_values(self):
        """测试课程状态字段的有效值"""
        await self.execute(
            "INSERT INTO courses (id, course_name, status) VALUES ($1, $2, $3)",
            "course_status_open", "开放课程", "open"
        )
        await self.execute(
            "INSERT INTO courses (id, course_name, status) VALUES ($1, $2, $3)",
            "course_status_close", "关闭课程", "close"
        )

        open_course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_status_open"
        )
        close_course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_status_close"
        )

        self.assertEqual(open_course['status'], "open")
        self.assertEqual(close_course['status'], "close")

    async def test_course_field_constraints(self):
        """测试课程字段长度限制"""
        # id 最大 50 字符
        long_id = "c" * 50
        await self.execute(
            "INSERT INTO courses (id, course_name) VALUES ($1, $2)",
            long_id, "测试长ID课程"
        )
        course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            long_id
        )
        self.assertIsNotNone(course)
        self.assertEqual(len(course['id']), 50)

        # course_name 最大 200 字符
        long_name = "n" * 200
        await self.execute(
            "INSERT INTO courses (id, course_name) VALUES ($1, $2)",
            "course_long_name", long_name
        )
        course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_long_name"
        )
        self.assertIsNotNone(course)
        self.assertEqual(len(course['course_name']), 200)

        # type 最大 20 字符
        long_type = "t" * 20
        await self.execute(
            "INSERT INTO courses (id, course_name, type) VALUES ($1, $2, $3)",
            "course_long_type", "测试长类型", long_type
        )
        course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_long_type"
        )
        self.assertIsNotNone(course)
        self.assertEqual(len(course['type']), 20)

    async def test_course_read_write(self):
        """测试课程读写操作"""
        # 创建
        await self.execute(
            "INSERT INTO courses (id, course_name, type, status, completed) "
            "VALUES ($1, $2, $3, $4, $5)",
            "course_rw", "读写测试课程", "public", "open", False
        )

        # 读取
        course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_rw"
        )
        self.assertIsNotNone(course)
        self.assertEqual(course['course_name'], "读写测试课程")

        # 更新
        await self.execute(
            "UPDATE courses SET course_name = $1, status = $2, completed = $3 WHERE id = $4",
            "更新后的课程名", "close", True, "course_rw"
        )

        updated_course = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_rw"
        )
        self.assertEqual(updated_course['course_name'], "更新后的课程名")
        self.assertEqual(updated_course['status'], "close")
        self.assertEqual(updated_course['completed'], True)

    async def test_course_boolean_field(self):
        """测试课程完成状态布尔字段"""
        # completed = False
        await self.execute(
            "INSERT INTO courses (id, course_name, completed) VALUES ($1, $2, $3)",
            "course_not_complete", "未完成课程", False
        )

        # completed = True
        await self.execute(
            "INSERT INTO courses (id, course_name, completed) VALUES ($1, $2, $3)",
            "course_completed", "已完成课程", True
        )

        not_complete = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_not_complete"
        )
        completed = await self.fetchrow(
            "SELECT * FROM courses WHERE id = $1",
            "course_completed"
        )

        self.assertEqual(not_complete['completed'], False)
        self.assertEqual(completed['completed'], True)

    async def test_course_timestamps(self):
        """测试课程时间戳字段"""
        await self.execute(
            "INSERT INTO courses (id, course_name) VALUES ($1, $2)",
            "course_ts_test", "时间戳测试"
        )

        course = await self.fetchrow(
            "SELECT created_at, updated_at FROM courses WHERE id = $1",
            "course_ts_test"
        )

        # 验证时间戳字段存在且不为 NULL
        self.assertIsNotNone(course['created_at'])
        self.assertIsNotNone(course['updated_at'])


if __name__ == '__main__':
    unittest.main()
