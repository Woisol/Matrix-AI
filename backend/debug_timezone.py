#!/usr/bin/env python3
"""
直接测试数据库连接和 datetime 处理
"""
import asyncio
import os
import sys
from datetime import datetime, timezone

# 添加项目根目录到Python路径
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# 应用时区修复补丁（必须在导入 Tortoise 相关模块之前）
from app.utils import timezone_patch

from tortoise import Tortoise
from app.database import TORTOISE_ORM

async def test_database_timezone():
    """测试数据库时区处理"""
    print("=== 测试数据库时区处理 ===")
    
    try:
        # 初始化数据库连接
        await Tortoise.init(config=TORTOISE_ORM)
        
        # 获取数据库连接
        conn = Tortoise.get_connection("default")
        
        # 测试时区设置
        result = await conn.execute_query("SHOW timezone;")
        print(f"数据库时区设置: {result}")
        
        # 测试当前时间
        result = await conn.execute_query("SELECT NOW();")
        print(f"数据库当前时间: {result}")
        
        # 测试插入 datetime
        test_time = datetime.now()
        print(f"Python naive datetime: {test_time}")
        
        test_time_utc = datetime.now(timezone.utc)
        print(f"Python aware datetime: {test_time_utc}")
        
        # 尝试插入测试数据
        await conn.execute_query(
            "CREATE TEMP TABLE test_datetime (id SERIAL, test_time TIMESTAMP);"
        )
        
        # 测试插入 naive datetime
        await conn.execute_query_dict(
            "INSERT INTO test_datetime (test_time) VALUES ($1);",
            [test_time]
        )
        print("✓ 成功插入 naive datetime")
        
        # 测试插入 aware datetime
        try:
            await conn.execute_query_dict(
                "INSERT INTO test_datetime (test_time) VALUES ($1);",
                [test_time_utc]
            )
            print("✓ 成功插入 aware datetime")
        except Exception as e:
            print(f"✗ 插入 aware datetime 失败: {e}")
        
        # 查询结果
        result = await conn.execute_query("SELECT * FROM test_datetime;")
        print(f"查询结果: {result}")
        
    except Exception as e:
        print(f"数据库测试失败: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await Tortoise.close_connections()

async def test_assignment_create():
    """测试作业创建"""
    print("\n=== 测试作业创建 ===")
    
    try:
        # 初始化数据库连接
        await Tortoise.init(config=TORTOISE_ORM)
        
        from app.models.assignment import Assignment
        
        # 尝试创建一个简单的作业
        test_assignment = await Assignment.create(
            id="test_" + str(int(datetime.now().timestamp())),
            title="测试作业",
            description="这是一个测试作业",
            type="program",
            end_date=None,  # 明确设置为 None
        )
        
        print(f"✓ 成功创建作业: {test_assignment.id}")
        
        # 删除测试数据
        await test_assignment.delete()
        print("✓ 清理测试数据")
        
    except Exception as e:
        print(f"作业创建测试失败: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await Tortoise.close_connections()

if __name__ == "__main__":
    print("开始数据库时区测试...")
    asyncio.run(test_database_timezone())
    
    print("\n开始作业创建测试...")
    asyncio.run(test_assignment_create())