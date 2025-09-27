"""
数据库配置和初始化
"""
from tortoise import Tortoise
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
import os, logging
from app.constants.user import UserMatrixAI
from app.utils.orm import NoUnlistenConnection

# 数据库配置
TORTOISE_ORM = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.asyncpg",
            "credentials": {
                "host": os.getenv("DB_HOST", "localhost"),
                "port": os.getenv("DB_PORT", 8888),
                "user": os.getenv("DB_USER", "matrixai"),
                "password": os.getenv("DB_PASSWORD"),
                "database": os.getenv("DB_NAME", "matrixai"),
                "connection_class": NoUnlistenConnection,
            }
        }
    },
    # "connections": {"default": "sqlite://db.sqlite3"},
    "apps": {
        "models": {
            "models": ["app.models.course", "app.models.assignment", "app.models.analysis", "app.models.user", "aerich.models"],
            "default_connection": "default",
        },
    },
}


async def init_db():
    """初始化数据库连接"""
    await Tortoise.init(config=TORTOISE_ORM)
    # 生成数据库表
    await Tortoise.generate_schemas()

async def ensure_user_table():
    """初始化默认数据，避免重复创建"""
    from app.models.user import User

    # 检查是否已有默认用户，避免重复创建
    default_user_exists = await User.exists(username=UserMatrixAI.username)

    if not default_user_exists:
        # 创建默认管理员用户
        await User.create(
            username=UserMatrixAI.username,
            code_style="",
            knowledge_status=""
        )
        logging.info(f"已创建默认管理员用户: {UserMatrixAI.username}")

    # 可以添加其他默认数据
    # 例如：默认课程、默认作业等


async def close_db():
    """关闭数据库连接"""
    await Tortoise.close_connections()


def init_tortoise(app: FastAPI):
    """注册Tortoise ORM到FastAPI应用"""
    register_tortoise(
        app,
        config=TORTOISE_ORM,
        generate_schemas=True,
        add_exception_handlers=True,
    )
