"""
测试配置文件 - 提供数据库连接和 fixtures
"""
import asyncio
import os
import asyncpg
from unittest import IsolatedAsyncioTestCase

# 测试数据库配置
TEST_DB_CONFIG = {
    "host": os.getenv("TEST_DB_HOST", os.getenv("DB_HOST", "192.168.134.205")),
    "port": int(os.getenv("TEST_DB_PORT", os.getenv("DB_PORT", "8888"))),
    "user": os.getenv("TEST_DB_USER", os.getenv("DB_USER", "matrixai")),
    "password": os.getenv("TEST_DB_PASSWORD", os.getenv("DB_PASSWORD", "Matrix#13331314")),
    "database": "test_matrixai"
}

# 用于创建数据库的管理员配置
ADMIN_DB_CONFIG = {
    "host": os.getenv("TEST_DB_HOST", os.getenv("DB_HOST", "192.168.134.205")),
    "port": int(os.getenv("TEST_DB_PORT", os.getenv("DB_PORT", "8888"))),
    "user": os.getenv("TEST_DB_USER", os.getenv("DB_USER", "matrixai")),
    "password": os.getenv("TEST_DB_PASSWORD", os.getenv("DB_PASSWORD", "Matrix#13331314")),
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


# DDL 语句创建测试表
CREATE_TABLES_SQL = """
-- users 表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    code_style TEXT,
    knowledge_status TEXT
);

-- courses 表
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    course_name VARCHAR(200) NOT NULL,
    type VARCHAR(20) DEFAULT 'public',
    status VARCHAR(20) DEFAULT 'open',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- assignments 表
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    type VARCHAR(20),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- assignment_codes 表
CREATE TABLE IF NOT EXISTS assignment_codes (
    id VARCHAR(50) PRIMARY KEY,
    assignment_id VARCHAR(50) NOT NULL REFERENCES assignments(id),
    original_code VARCHAR(10000),
    sample_input VARCHAR(10000),
    sample_expect_output VARCHAR(10000)
);

-- assignment_submissions 表
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id VARCHAR(50) PRIMARY KEY,
    assignment_id VARCHAR(50) NOT NULL REFERENCES assignments(id),
    student_id VARCHAR(50) NOT NULL,
    score FLOAT,
    sample_real_output VARCHAR(10000),
    submit_code VARCHAR(10000),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- assignment_analysis 表
CREATE TABLE IF NOT EXISTS assignment_analysis (
    id SERIAL PRIMARY KEY,
    assignment_id VARCHAR(50) NOT NULL REFERENCES assignments(id),
    resolution JSONB,
    knowledge_analysis JSONB,
    code_analysis JSONB,
    learning_suggestions JSONB
);

-- courses_assignments 多对多关联表
CREATE TABLE IF NOT EXISTS courses_assignments (
    course_id VARCHAR(50) NOT NULL REFERENCES courses(id),
    assignment_id VARCHAR(50) NOT NULL REFERENCES assignments(id),
    PRIMARY KEY (course_id, assignment_id)
);
"""

# 清理测试数据的 SQL
CLEANUP_SQL = """
DELETE FROM courses_assignments;
DELETE FROM assignment_analysis;
DELETE FROM assignment_codes;
DELETE FROM assignment_submissions;
DELETE FROM assignments;
DELETE FROM courses;
DELETE FROM users;
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
