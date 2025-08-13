"""
测试脚本 - 用于测试课程OJ平台API功能
"""
import asyncio
import aiohttp
import json
from datetime import datetime, timedelta
import unittest


BASE_URL = "http://localhost:8000"


async def test_api():
    """测试API功能"""
    async with aiohttp.ClientSession() as session:
        print("=== 测试课程OJ平台API ===\n")
        
        # 1. 测试健康检查
        print("1. 测试健康检查")
        async with session.get(f"{BASE_URL}/health") as resp:
            result = await resp.json()
            print(f"状态: {resp.status}, 响应: {result}\n")
        
        # 2. 测试获取课程列表（应该是空的）
        print("2. 测试获取课程列表")
        async with session.get(f"{BASE_URL}/api/courses") as resp:
            result = await resp.json()
            print(f"状态: {resp.status}, 课程数量: {len(result)}\n")
        
        # 3. 测试创建课程（需要先有路由）
        print("3. 测试创建课程")
        course_data = {
            "name": "Python编程基础",
            "type": "public",
            "status": "open",
            "school_year": "2023-2024",
            "semester": "秋季学期",
            "description": "这是一门Python编程基础课程",
            "creator_name": "张老师"
        }
        # 注意：需要先添加创建课程的路由才能测试
        print(f"课程数据: {course_data}")
        print("注意：需要先实现POST /api/courses路由\n")
        
        print("=== API测试完成 ===")


if __name__ == "__main__":
    print("请先启动服务器: uvicorn app.main:app --reload")
    print("然后运行此测试脚本\n")
    
    # asyncio.run(test_api())
