"""
用户表测试 - users 表 CRUD 操作验证
"""
import unittest
from tests.orm.conftest import AsyncORMTestCase


class TestUserTable(AsyncORMTestCase):
    """用户表测试类"""

    async def test_create_user(self):
        """测试创建用户"""
        await self.execute(
            "INSERT INTO users (username, code_style, knowledge_status) "
            "VALUES ($1, $2, $3)",
            "test_user_001", "Python 代码风格", "掌握基础语法"
        )

        # 验证创建成功
        user = await self.fetchrow(
            "SELECT * FROM users WHERE username = $1",
            "test_user_001"
        )
        self.assertIsNotNone(user)
        self.assertEqual(user['username'], "test_user_001")
        self.assertEqual(user['code_style'], "Python 代码风格")
        self.assertEqual(user['knowledge_status'], "掌握基础语法")

    async def test_read_user(self):
        """测试读取用户"""
        # 先创建
        await self.execute(
            "INSERT INTO users (username) VALUES ($1)",
            "test_user_read"
        )

        # 读取
        user = await self.fetchrow(
            "SELECT * FROM users WHERE username = $1",
            "test_user_read"
        )
        self.assertIsNotNone(user)
        self.assertEqual(user['username'], "test_user_read")

    async def test_update_user(self):
        """测试更新用户"""
        # 先创建
        await self.execute(
            "INSERT INTO users (username, code_style) VALUES ($1, $2)",
            "test_user_update", "旧风格"
        )

        # 更新
        await self.execute(
            "UPDATE users SET code_style = $1 WHERE username = $2",
            "新风格", "test_user_update"
        )

        # 验证更新
        user = await self.fetchrow(
            "SELECT code_style FROM users WHERE username = $1",
            "test_user_update"
        )
        self.assertEqual(user['code_style'], "新风格")

    async def test_delete_user(self):
        """测试删除用户"""
        # 先创建
        await self.execute(
            "INSERT INTO users (username) VALUES ($1)",
            "test_user_delete"
        )

        # 删除
        await self.execute(
            "DELETE FROM users WHERE username = $1",
            "test_user_delete"
        )

        # 验证删除
        user = await self.fetchrow(
            "SELECT * FROM users WHERE username = $1",
            "test_user_delete"
        )
        self.assertIsNone(user)

    async def test_user_nullable_fields(self):
        """测试用户可选字段（code_style 和 knowledge_status 可为空）"""
        # 创建只有 username 的用户
        await self.execute(
            "INSERT INTO users (username) VALUES ($1)",
            "test_user_nullable"
        )

        user = await self.fetchrow(
            "SELECT * FROM users WHERE username = $1",
            "test_user_nullable"
        )
        self.assertIsNotNone(user)
        self.assertIsNone(user['code_style'])
        self.assertIsNone(user['knowledge_status'])

    async def test_user_username_length_constraint(self):
        """测试用户名长度限制为 50"""
        # username 字段定义为 VARCHAR(50)
        # 插入 50 字符应该成功
        long_username = "a" * 50
        await self.execute(
            "INSERT INTO users (username) VALUES ($1)",
            long_username
        )

        user = await self.fetchrow(
            "SELECT * FROM users WHERE username = $1",
            long_username
        )
        self.assertIsNotNone(user)
        self.assertEqual(len(user['username']), 50)

    async def test_user_auto_increment_id(self):
        """测试用户 ID 自增"""
        # 插入多个用户
        await self.execute(
            "INSERT INTO users (username) VALUES ($1)",
            "test_user_id_1"
        )
        await self.execute(
            "INSERT INTO users (username) VALUES ($1)",
            "test_user_id_2"
        )

        users = await self.fetchall(
            "SELECT id, username FROM users WHERE username LIKE $1 ORDER BY id",
            "test_user_id_%"
        )
        self.assertEqual(len(users), 2)
        # 验证 ID 是自增的
        self.assertGreater(users[1]['id'], users[0]['id'])

    async def test_user_multiple_read(self):
        """测试批量读取用户"""
        # 创建多个用户
        for i in range(5):
            await self.execute(
                "INSERT INTO users (username) VALUES ($1)",
                f"test_user_multi_{i}"
            )

        # 批量读取
        users = await self.fetchall(
            "SELECT username FROM users WHERE username LIKE $1 ORDER BY username",
            "test_user_multi_%"
        )
        self.assertEqual(len(users), 5)

    async def test_user_text_fields(self):
        """测试 TEXT 字段存储长内容"""
        long_style = "这是一个很长的代码风格描述" * 100
        long_status = "这是一个很长的知识掌握情况描述" * 100

        await self.execute(
            "INSERT INTO users (username, code_style, knowledge_status) VALUES ($1, $2, $3)",
            "test_user_long_text", long_style, long_status
        )

        user = await self.fetchrow(
            "SELECT * FROM users WHERE username = $1",
            "test_user_long_text"
        )
        self.assertIsNotNone(user)
        self.assertEqual(user['code_style'], long_style)
        self.assertEqual(user['knowledge_status'], long_status)


if __name__ == '__main__':
    unittest.main()
