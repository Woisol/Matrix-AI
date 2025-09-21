"""
测试配置文件
"""
import os
import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient
from tortoise import Tortoise
from tortoise.contrib.test import finalizer, initializer

from app.main import app


# 测试数据库配置 - 使用内存SQLite数据库
TEST_TORTOISE_ORM = {
    "connections": {"default": "sqlite://:memory:"},
    "apps": {
        "models": {
            "models": [
                "app.models.course",
                "app.models.assignment",
                "app.models.analysis",
                "app.models.user",
                "app.models.playground"
            ],
            "default_connection": "default",
        },
    },
}


@pytest.fixture(scope="session")
def event_loop():
    """创建一个用于整个测试会话的事件循环"""
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db():
    """数据库会话 fixture - 每个测试函数都重新初始化数据库"""
    # 直接使用 Tortoise.init 初始化
    await Tortoise.init(config=TEST_TORTOISE_ORM)
    await Tortoise.generate_schemas()
    yield
    await Tortoise.close_connections()


@pytest_asyncio.fixture
async def client(db):
    """创建测试客户端"""
    from httpx import ASGITransport
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# 环境变量设置
os.environ["TESTING"] = "1"