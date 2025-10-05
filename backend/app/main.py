"""
FastAPI课程OJ平台主应用
"""
import sys
import os
from dotenv import load_dotenv

# 添加项目根目录到 Python 路径，使绝对导入可用
#~~ 这tm啥
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

# 应用时区修复补丁（必须在导入 Tortoise 相关模块之前）
try:
    from app.utils import timezone_patch
except ImportError as e:
    print(f"警告：无法加载时区修复补丁: {e}")

# 检查 Python 版本是否大于 3.9
if sys.version_info < (3, 9):
    print(f"错误: 此应用需要 Python 3.9 或更高版本，当前版本: {sys.version}")
    print("请升级 Python 版本后再运行")
    sys.exit(1)

# print(f"Python 版本检查通过: {sys.version}")

from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routers.course import course_router
from app.routers.assignment import assign_router
from app.routers.ai import ai_route
from app.database import init_db, close_db, ensure_user_table


api_key=os.getenv("OPENAI_API_KEY", "Your-api-key")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化数据库
    await init_db()
    # 初始化默认数据（避免重复创建）
    await ensure_user_table()
    yield
    # 关闭时清理数据库连接
    await close_db()


# 创建FastAPI应用实例
app = FastAPI(
    title="课程OJ平台API",
    description="基于FastAPI、Tortoise ORM和SQLite3的课程在线判题平台",
    version="1.0.0",
    lifespan=lifespan
)

# 注册路由
for router in [course_router, assign_router,ai_route]:
    app.include_router(router)


@app.get("/")
async def root():
    """根路径"""
    return {"message": "课程OJ平台API服务运行中", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "service": "course-oj-api"}


