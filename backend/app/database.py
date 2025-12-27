"""
数据库配置和初始化 - 使用原生 SQL ORM
"""
import os
import logging
import asyncio
from fastapi import FastAPI
from app.models.base import get_pool, close_pool
from app.models import (
    init_views,
    init_procedures,
    init_triggers,
    User,
)
from app.constants.user import UserMatrixAI


async def init_db():
    """初始化数据库连接池"""
    try:
        pool = await get_pool()
        logging.info("数据库连接池初始化成功")
        return pool
    except Exception as e:
        logging.error(f"数据库连接失败: {e}")
        raise


async def ensure_user_table():
    """初始化默认数据，避免重复创建"""
    # 检查是否已有默认用户
    default_user_exists = await User.exists(username=UserMatrixAI.username)

    if not default_user_exists:
        await User.create(
            username=UserMatrixAI.username,
            code_style="",
            knowledge_status=""
        )
        logging.info(f"已创建默认管理员用户: {UserMatrixAI.username}")


async def init_advanced_sql():
    """初始化高级 SQL 对象（视图、存储过程、触发器）"""
    # 这些功能暂时禁用，避免初始化错误
    # 如需启用，请取消以下注释
    #
    try:
        await init_views()
        logging.info("SQL 视图初始化成功")
    except Exception as e:
        logging.warning(f"SQL 视图初始化跳过: {e}")
    #
    # try:
    #     await init_procedures()
    #     logging.info("存储过程初始化成功")
    # except Exception as e:
    #     logging.warning(f"存储过程初始化跳过: {e}")
    #
    # try:
    #     await init_triggers()
    #     logging.info("触发器初始化成功")
    # except Exception as e:
    #     logging.warning(f"触发器初始化跳过: {e}")
    pass


async def close_db():
    """关闭数据库连接池"""
    await close_pool()
    logging.info("数据库连接池已关闭")


async def init_app():
    """初始化 FastAPI 应用的数据库"""

    # @app.on_event("startup")
    # async def startup_event():
    await init_db()
    await init_advanced_sql()
    await ensure_user_table()

    # @app.on_event("shutdown")
    # async def shutdown_event():
    await close_db()
