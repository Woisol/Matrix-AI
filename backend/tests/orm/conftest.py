"""
测试配置文件 - 提供数据库连接和 fixtures
"""
import asyncio
import os
import asyncpg
from unittest import IsolatedAsyncioTestCase

# 从 constants 文件导入 DDL
from app.constants.create_table import CREATE_TABLES_SQL
TEST_DB_CONFIG = {
    "host": os.getenv("TEST_DB_HOST", "192.168.134.205"),
    "port": int(os.getenv("TEST_DB_PORT", "8888")),
    "user": os.getenv("TEST_DB_USER", "matrixai"),
    "password": os.getenv("TEST_DB_PASSWORD", "Matrix#13331314"),
    "database": "test_matrixai"
}

# 用于创建数据库的管理员配置
ADMIN_DB_CONFIG = {
    "host": os.getenv("TEST_DB_HOST", "192.168.134.205"),
    "port": int(os.getenv("TEST_DB_PORT", "8888")),
    "user": os.getenv("TEST_DB_USER", "matrixai"),
    "password": os.getenv("TEST_DB_PASSWORD", "Matrix#13331314"),
    "database": "postgres"
}

_test_db_initialized = False


async def ensure_test_database():
    """确保测试数据库存在"""
    global _test_db_initialized
    if _test_db_initialized:
        return

    try:
        conn = await asyncpg.connect(**TEST_DB_CONFIG)
        await conn.close()
        _test_db_initialized = True
        return
    except asyncpg.InvalidCatalogNameError:
        pass

    try:
        admin_conn = await asyncpg.connect(**ADMIN_DB_CONFIG)
        exists = await admin_conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1 LIMIT 1",
            "test_matrixai"
        )

        if not exists:
            await admin_conn.execute("CREATE DATABASE test_matrixai")
            print("Created test database: test_matrixai")

        await admin_conn.close()
        _test_db_initialized = True
        print("Test database ready: test_matrixai")
    except Exception as e:
        print(f"Warning: Could not create test database: {e}")
        raise


# 清理测试数据的 SQL - 使用 DROP TABLE IF EXISTS + CREATE TABLE 模式
CLEANUP_SQL = """
DROP TABLE IF EXISTS courses_assignments CASCADE;
DROP TABLE IF EXISTS assignment_analysis CASCADE;
DROP TABLE IF EXISTS assignment_codes CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
"""


async def init_test_schema(conn):
    """初始化测试数据库表结构"""
    await conn.execute(CLEANUP_SQL)  # 先清理
    await conn.execute(CREATE_TABLES_SQL)


async def get_test_connection() -> asyncpg.Connection:
    """获取测试数据库连接"""
    await ensure_test_database()
    conn = await asyncpg.connect(**TEST_DB_CONFIG)
    # 初始化表结构（每次连接都重置表）
    await init_test_schema(conn)
    return conn


class AsyncORMTestCase(IsolatedAsyncioTestCase):
    """异步 ORM 测试基类"""

    @classmethod
    def setUpClass(cls):
        pass

    async def asyncSetUp(self):
        self.conn = await get_test_connection()

    async def asyncTearDown(self):
        if self.conn:
            await self.conn.close()

    async def execute(self, sql, *args):
        return await self.conn.execute(sql, *args)

    async def fetchrow(self, sql, *args):
        return await self.conn.fetchrow(sql, *args)

    async def fetchall(self, sql, *args):
        return await self.conn.fetch(sql, *args)

    async def fetchval(self, sql, *args):
        return await self.conn.fetchval(sql, *args)
