"""
pytest 配置文件，用于 ORM 测试
"""

import pytest
import asyncio
import asyncpg
from typing import AsyncGenerator
import os
from urllib.parse import urlsplit, urlunsplit, quote, unquote
from datetime import datetime

from app.utils.orm import (
    init_database, close_database, BaseModel, Field, FieldType,
    one_to_many, many_to_one, many_to_many, foreign_key,
    get_connection_pool, ConnectionPool
)


# 测试数据库配置
TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    # 默认提供已编码的密码，避免 '#' 被误解析
    "postgresql://matrixai:Matrix%2313331314@192.168.134.205:8888/matrixai"
)


def _sanitize_dsn(raw: str) -> str:
    """对 DSN 进行清理/编码（仅在需要时编码密码）。"""
    try:
        parts = urlsplit(raw)
        if '@' in parts.netloc:
            cred, host = parts.netloc.split('@', 1)
            if ':' in cred:
                user, pwd = cred.split(':', 1)
                enc_pwd = quote(unquote(pwd), safe='')
                if enc_pwd != pwd:
                    new_netloc = f"{user}:{enc_pwd}@{host}"
                    return urlunsplit((parts.scheme, new_netloc, parts.path, parts.query, parts.fragment))
        return raw
    except Exception:
        return raw


# 测试模型定义
class TestUser(BaseModel):
    """测试用户模型"""
    __table_name__ = "test_users"

    id = Field(FieldType.INT, primary_key=True, auto_increment=True)
    username = Field(FieldType.VARCHAR, max_length=50, unique=True, nullable=False)
    email = Field(FieldType.VARCHAR, max_length=100, unique=True)
    age = Field(FieldType.INT, nullable=True)
    is_active = Field(FieldType.BOOLEAN, default=True)
    score = Field(FieldType.DECIMAL, nullable=True)
    metadata = Field(FieldType.JSON, default={})
    created_at = Field(FieldType.TIMESTAMP, default=datetime.now)

    # 定义关系
    courses = one_to_many("TestCourse", "user_id", "owner")
    profile = one_to_many("TestUserProfile", "user_id", "user")


class TestCourse(BaseModel):
    """测试课程模型"""
    __table_name__ = "test_courses"

    id = Field(FieldType.VARCHAR, max_length=50, primary_key=True)
    course_name = Field(FieldType.VARCHAR, max_length=200, nullable=False)
    description = Field(FieldType.TEXT, nullable=True)
    user_id = Field(FieldType.INT, index=True)  # 外键
    is_published = Field(FieldType.BOOLEAN, default=False)
    created_at = Field(FieldType.TIMESTAMP, default=datetime.now)

    # 定义关系
    owner = many_to_one("TestUser", "user_id", "courses")
    assignments = many_to_many("TestAssignment", "test_course_assignments", "courses")


class TestAssignment(BaseModel):
    """测试作业模型"""
    __table_name__ = "test_assignments"

    id = Field(FieldType.INT, primary_key=True, auto_increment=True)
    title = Field(FieldType.VARCHAR, max_length=200, nullable=False)
    description = Field(FieldType.TEXT, nullable=True)
    difficulty = Field(FieldType.VARCHAR, max_length=20, default="medium")
    points = Field(FieldType.INT, default=100)
    is_active = Field(FieldType.BOOLEAN, default=True)
    created_at = Field(FieldType.TIMESTAMP, default=datetime.now)

    # 定义关系
    courses = many_to_many("TestCourse", "test_course_assignments", "assignments")


class TestUserProfile(BaseModel):
    """测试用户配置模型"""
    __table_name__ = "test_user_profiles"

    id = Field(FieldType.INT, primary_key=True, auto_increment=True)
    user_id = Field(FieldType.INT, unique=True, nullable=False)
    avatar_url = Field(FieldType.VARCHAR, max_length=255, nullable=True)
    bio = Field(FieldType.TEXT, nullable=True)
    settings = Field(FieldType.JSON, default={})

    # 定义关系
    user = many_to_one("TestUser", "user_id", "profile")


# Pytest 配置
@pytest.fixture(scope="session")
def event_loop():
    """创建测试事件循环"""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_db():
    """设置测试数据库"""
    # 创建测试数据库（如果不存在）
    try:
        # 连接到默认数据库创建测试数据库
        default_dsn = _sanitize_dsn(TEST_DATABASE_URL.replace("/ai_matrix_test", "/postgres"))
        conn = await asyncpg.connect(default_dsn)

        # 检查数据库是否存在
        db_exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = 'ai_matrix_test'"
        )

        if not db_exists:
            await conn.execute("CREATE DATABASE ai_matrix_test")
            print("Created test database: ai_matrix_test")

        await conn.close()
    except Exception as e:
        print(f"Warning: Could not create test database: {e}")

    # 初始化 ORM 连接
    await init_database(_sanitize_dsn(TEST_DATABASE_URL), min_size=1, max_size=5)

    yield

    # 清理
    await close_database()


@pytest.fixture(scope="session")
async def setup_tables(test_db):
    """创建测试表"""
    # 创建所有测试表
    await TestUser.create_table()
    await TestCourse.create_table()
    await TestAssignment.create_table()
    await TestUserProfile.create_table()

    # 创建多对多关系的中间表
    pool = get_connection_pool()
    await pool.execute("""
        CREATE TABLE IF NOT EXISTS test_course_assignments (
            id SERIAL PRIMARY KEY,
            course_id VARCHAR(50) REFERENCES test_courses(id) ON DELETE CASCADE,
            assignment_id INTEGER REFERENCES test_assignments(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(course_id, assignment_id)
        )
    """)

    yield

    # 测试完成后清理表
    try:
        await pool.execute("DROP TABLE IF EXISTS test_course_assignments CASCADE")
        await TestUserProfile.drop_table()
        await TestAssignment.drop_table()
        await TestCourse.drop_table()
        await TestUser.drop_table()
        print("Cleaned up test tables")
    except Exception as e:
        print(f"Warning: Could not clean up tables: {e}")


@pytest.fixture
async def clean_tables(setup_tables):
    """每个测试前清理表数据"""
    pool = get_connection_pool()

    # 清理所有表数据
    await pool.execute("TRUNCATE test_course_assignments RESTART IDENTITY CASCADE")
    await pool.execute("TRUNCATE test_user_profiles RESTART IDENTITY CASCADE")
    await pool.execute("TRUNCATE test_assignments RESTART IDENTITY CASCADE")
    await pool.execute("TRUNCATE test_courses RESTART IDENTITY CASCADE")
    await pool.execute("TRUNCATE test_users RESTART IDENTITY CASCADE")

    yield


@pytest.fixture
async def sample_user(clean_tables):
    """创建示例用户"""
    user = TestUser(
        username="test_user",
        email="test@example.com",
        age=25,
        score=95.5,
        metadata={"role": "student", "level": "beginner"}
    )
    await user.save()
    return user


@pytest.fixture
async def sample_course(sample_user):
    """创建示例课程"""
    course = TestCourse(
        id="test-course-001",
        course_name="测试课程",
        description="这是一个测试课程",
        user_id=sample_user.id
    )
    await course.save()
    return course


@pytest.fixture
async def sample_assignment():
    """创建示例作业"""
    assignment = TestAssignment(
        title="测试作业",
        description="这是一个测试作业",
        difficulty="easy",
        points=50
    )
    await assignment.save()
    return assignment


@pytest.fixture
async def sample_user_profile(sample_user):
    """创建示例用户配置"""
    profile = TestUserProfile(
        user_id=sample_user.id,
        avatar_url="https://example.com/avatar.jpg",
        bio="这是用户简介",
        settings={"theme": "dark", "language": "zh-CN"}
    )
    await profile.save()
    return profile


# 工具函数
async def create_multiple_users(count: int = 5):
    """创建多个测试用户"""
    users = []
    for i in range(count):
        user = TestUser(
            username=f"user_{i}",
            email=f"user_{i}@example.com",
            age=20 + i,
            is_active=i % 2 == 0
        )
        await user.save()
        users.append(user)
    return users


async def create_multiple_courses(user_id: int, count: int = 3):
    """创建多个测试课程"""
    courses = []
    for i in range(count):
        course = TestCourse(
            id=f"course-{user_id}-{i}",
            course_name=f"课程 {i}",
            description=f"课程 {i} 的描述",
            user_id=user_id,
            is_published=i % 2 == 0
        )
        await course.save()
        courses.append(course)
    return courses


async def create_multiple_assignments(count: int = 4):
    """创建多个测试作业"""
    assignments = []
    difficulties = ["easy", "medium", "hard", "expert"]
    for i in range(count):
        assignment = TestAssignment(
            title=f"作业 {i}",
            description=f"作业 {i} 的描述",
            difficulty=difficulties[i % len(difficulties)],
            points=(i + 1) * 25
        )
        await assignment.save()
        assignments.append(assignment)
    return assignments