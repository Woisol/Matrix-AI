"""
模型模块 - 轻量级原生 SQL ORM
"""
from .base import Model, get_db, get_pool, close_pool, execute, fetch_one, fetch_all, fetch_val
from .user import User
from .course import Course
from .assignment import Assignment, AssignmentCode, AssignmentSubmission, AssignTypeEnum, SubmitScoreStatusEnum
from .analysis import Analysis
from .views import (
    init_views,
)
from .procedures import (
    init_procedures,
    init_triggers,
    init_all_advanced_sql,
)

__all__ = [
    # 核心
    "Model",
    "get_db",
    "get_pool",
    "close_pool",
    "execute",
    "fetch_one",
    "fetch_all",
    "fetch_val",
    # 模型
    "User",
    "Course",
    "Assignment",
    "AssignmentCode",
    "AssignmentSubmission",
    "AssignTypeEnum",
    "SubmitScoreStatusEnum",
    "Analysis",
    # 高级 SQL
    "init_views",
    # 存储过程和触发器
    "init_procedures",
    "init_triggers",
    "init_all_advanced_sql",
]
