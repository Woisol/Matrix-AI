"""
FastAPI课程OJ平台主应用
"""
from fastapi import FastAPI
from contextlib import asynccontextmanager
from routers.course import course_router
from database import init_db, close_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化数据库
    await init_db()
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
app.include_router(course_router)


@app.get("/")
async def root():
    """根路径"""
    return {"message": "课程OJ平台API服务运行中", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "service": "course-oj-api"}


