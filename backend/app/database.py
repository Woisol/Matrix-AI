"""
数据库配置和初始化
"""
from tortoise import Tortoise
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
import os

# 数据库配置
TORTOISE_ORM = {
    "connections": {"default": "sqlite://db.sqlite3"},
    "apps": {
        "models": {
            "models": ["app.models.course", "app.models.assignment", "aerich.models"],
            "default_connection": "default",
        },
    },
}


async def init_db():
    """初始化数据库连接"""
    await Tortoise.init(
        db_url="sqlite://db.sqlite3",
        modules={"models": ["app.models.course", "app.models.assignment"]}
    )
    # 生成数据库表
    await Tortoise.generate_schemas()


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
