"""
表结构测试 - 验证数据库表和字段定义是否正确
"""
import unittest
from tests.orm.conftest import AsyncORMTestCase


class TestTableStructure(AsyncORMTestCase):
    """测试表结构验证"""

    async def test_users_table_exists(self):
        """验证 users 表存在"""
        result = await self.fetchval(
            "SELECT 1 FROM pg_tables WHERE tablename = 'users' LIMIT 1"
        )
        self.assertIsNotNone(result, "users 表应该存在")

    async def test_courses_table_exists(self):
        """验证 courses 表存在"""
        result = await self.fetchval(
            "SELECT 1 FROM pg_tables WHERE tablename = 'courses' LIMIT 1"
        )
        self.assertIsNotNone(result, "courses 表应该存在")

    async def test_assignments_table_exists(self):
        """验证 assignments 表存在"""
        result = await self.fetchval(
            "SELECT 1 FROM pg_tables WHERE tablename = 'assignments' LIMIT 1"
        )
        self.assertIsNotNone(result, "assignments 表应该存在")

    async def test_assignment_codes_table_exists(self):
        """验证 assignment_codes 表存在"""
        result = await self.fetchval(
            "SELECT 1 FROM pg_tables WHERE tablename = 'assignment_codes' LIMIT 1"
        )
        self.assertIsNotNone(result, "assignment_codes 表应该存在")

    async def test_assignment_submissions_table_exists(self):
        """验证 assignment_submissions 表存在"""
        result = await self.fetchval(
            "SELECT 1 FROM pg_tables WHERE tablename = 'assignment_submissions' LIMIT 1"
        )
        self.assertIsNotNone(result, "assignment_submissions 表应该存在")

    async def test_assignment_analysis_table_exists(self):
        """验证 assignment_analysis 表存在"""
        result = await self.fetchval(
            "SELECT 1 FROM pg_tables WHERE tablename = 'assignment_analysis' LIMIT 1"
        )
        self.assertIsNotNone(result, "assignment_analysis 表应该存在")

    async def test_courses_table_columns(self):
        """验证 courses 表的字段定义"""
        columns = await self.fetchall("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'courses'
            ORDER BY ordinal_position
        """)
        column_names = [c['column_name'] for c in columns]

        # 验证必要字段存在
        self.assertIn('id', column_names)
        self.assertIn('course_name', column_names)
        self.assertIn('type', column_names)
        self.assertIn('status', column_names)
        self.assertIn('completed', column_names)
        self.assertIn('created_at', column_names)
        self.assertIn('updated_at', column_names)

    async def test_assignments_table_columns(self):
        """验证 assignments 表的字段定义"""
        columns = await self.fetchall("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'assignments'
            ORDER BY ordinal_position
        """)
        column_names = [c['column_name'] for c in columns]

        # 验证必要字段存在
        self.assertIn('id', column_names)
        self.assertIn('title', column_names)
        self.assertIn('description', column_names)
        self.assertIn('type', column_names)
        self.assertIn('start_date', column_names)
        self.assertIn('end_date', column_names)

    async def test_users_table_columns(self):
        """验证 users 表的字段定义"""
        columns = await self.fetchall("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position
        """)
        column_names = [c['column_name'] for c in columns]

        # 验证必要字段存在
        self.assertIn('id', column_names)
        self.assertIn('username', column_names)
        self.assertIn('code_style', column_names)
        self.assertIn('knowledge_status', column_names)

    async def test_assignment_codes_fk_exists(self):
        """验证 assignment_codes 表存在外键约束"""
        constraints = await self.fetchall("""
            SELECT conname
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            JOIN pg_class r ON c.confrelid = r.oid
            WHERE t.relname = 'assignment_codes'
                AND c.contype = 'f'
        """)
        self.assertTrue(len(constraints) > 0, "assignment_codes 应该存在外键约束")

    async def test_assignment_submissions_fk_exists(self):
        """验证 assignment_submissions 表存在外键约束"""
        constraints = await self.fetchall("""
            SELECT conname
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'assignment_submissions'
                AND c.contype = 'f'
        """)
        self.assertTrue(len(constraints) > 0, "assignment_submissions 应该存在外键约束")

    async def test_assignment_analysis_fk_exists(self):
        """验证 assignment_analysis 表存在外键约束"""
        constraints = await self.fetchall("""
            SELECT conname
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'assignment_analysis'
                AND c.contype = 'f'
        """)
        self.assertTrue(len(constraints) > 0, "assignment_analysis 应该存在外键约束")

    async def test_course_assignments_m2m_table_exists(self):
        """验证课程-作业多对多关联表存在"""
        result = await self.fetchval(
            "SELECT 1 FROM pg_tables WHERE tablename = 'courses_assignments' LIMIT 1"
        )
        self.assertIsNotNone(result, "courses_assignments 多对多关联表应该存在")


if __name__ == '__main__':
    unittest.main()
