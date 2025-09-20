#!/usr/bin/env python3
"""
快速测试脚本 - 验证 ORM 框架基本功能
"""

import asyncio
import sys
from pathlib import Path

# 添加项目路径
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))

import os
from datetime import datetime
from urllib.parse import urlsplit, urlunsplit, quote, unquote
from app.utils.orm import (
    init_database,
    close_database,
    get_connection_pool,
    BaseModel,
    Field,
    FieldType,
)


class QuickTestUser(BaseModel):
    """快速测试用户模型"""
    __table_name__ = "quick_test_users"

    id = Field(FieldType.INT, primary_key=True, auto_increment=True)
    username = Field(FieldType.VARCHAR, max_length=50, unique=True, nullable=False)
    email = Field(FieldType.VARCHAR, max_length=100, nullable=False)
    age = Field(FieldType.INT, nullable=True)
    created_at = Field(FieldType.TIMESTAMP, default=datetime.now)


async def quick_test():
    """快速功能测试"""
    print("🚀 PostgreSQL ORM 框架快速测试")
    print("="*50)

    try:
        # 初始化连接池
        print("1️⃣  初始化数据库连接...")
        # 允许通过命令行参数覆盖 DSN
        cli_dsn = sys.argv[1] if len(sys.argv) > 1 else None
        dsn = cli_dsn or os.getenv(
            "TEST_DATABASE_URL",
            # 注意：密码中的特殊字符需要进行 URL 编码（例如 '#' -> '%23'）
            "postgresql://matrixai:Matrix%2313331314@192.168.134.205:8888/matrixai",
        )
        # 若环境变量未编码密码，自动尝试编码
        def _sanitize_dsn(raw: str) -> str:
            try:
                parts = urlsplit(raw)
                if '@' in parts.netloc:
                    cred, host = parts.netloc.split('@', 1)
                    if ':' in cred:
                        user, pwd = cred.split(':', 1)
                        # 仅当需要时才编码：通过先解码再编码判断是否已正确编码
                        enc_pwd = quote(unquote(pwd), safe='')
                        if enc_pwd != pwd:
                            new_netloc = f"{user}:{enc_pwd}@{host}"
                            return urlunsplit((parts.scheme, new_netloc, parts.path, parts.query, parts.fragment))
                return raw
            except Exception:
                return raw

        dsn = _sanitize_dsn(dsn)
        await init_database(dsn, min_size=1, max_size=5)
        print("✅ 数据库连接成功")

        # 创建表（如果不存在）
        print("2️⃣  创建测试表...")
        pool = get_connection_pool()
        async with pool.acquire() as conn:
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS quick_test_users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) NOT NULL,
                    age INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            # 确保可重复运行：清理可能存在的测试数据
            await conn.execute("DELETE FROM quick_test_users WHERE username = $1", "quicktest_user")
        print("✅ 测试表创建成功")

        # 测试 CRUD 操作
        print("3️⃣  测试 CRUD 操作...")

        # Create
        user = QuickTestUser()
        user.username = "quicktest_user"
        user.email = "quick@test.com"
        user.age = 25
        await user.save()
        print(f"✅ 创建用户: ID={user.id}")

        # Read
        found_user = await QuickTestUser.find_by_id(user.id)
        assert found_user is not None
        assert found_user.username == "quicktest_user"
        print(f"✅ 读取用户: {found_user.username}")

        # Update
        found_user.age = 30
        await found_user.save()
        updated_user = await QuickTestUser.find_by_id(user.id)
        assert updated_user.age == 30
        print(f"✅ 更新用户: age={updated_user.age}")

        # Count
        count = await QuickTestUser.count()
        print(f"✅ 用户总数: {count}")

        # Query
        # 使用 QueryBuilder 执行并将记录映射为模型
        qb = QuickTestUser.query().where("age > $1", 20)
        records = await qb.execute()
        users = [QuickTestUser._from_record(r) for r in records]
        print(f"✅ 查询结果: {len(users)} 个用户")

        # Delete
        await found_user.delete()
        deleted_user = await QuickTestUser.find_by_id(user.id)
        assert deleted_user is None
        print("✅ 删除用户成功")

        print("4️⃣  清理测试数据...")
        async with pool.acquire() as conn:
            await conn.execute("DROP TABLE IF EXISTS quick_test_users")
        print("✅ 清理完成")

        print()
        print("🎉 快速测试通过！ORM 框架基本功能正常")
        print("="*50)
        print("💡 现在可以运行完整测试套件:")
        print("   python run_tests.py")
        print("💡 也可以传入自定义 DSN 运行该脚本:")
        print("   python quick_test.py postgresql://user:pass@host:port/dbname")

        return True

    except Exception as e:
        # 打印更清晰的连接信息（脱敏）
        try:
            parts = urlsplit(dsn)
            hostinfo = parts.netloc.split('@')[-1]
            hostonly = hostinfo.split(':')[0] if ':' in hostinfo else hostinfo
            port = hostinfo.split(':')[1] if ':' in hostinfo else '5432'
            print("❌ 测试失败:", str(e))
            print(f"   -> Host: {hostonly}  Port: {port}  DB: {parts.path.lstrip('/') or '(default)'}")
        except Exception:
            print(f"❌ 测试失败: {e}")
        return False

    finally:
        # 始终尝试清理并关闭连接池，保证可重复运行
        try:
            pool = get_connection_pool()
            async with pool.acquire() as conn:
                await conn.execute("DROP TABLE IF EXISTS quick_test_users")
        except Exception:
            pass
        await close_database()


if __name__ == "__main__":
    success = asyncio.run(quick_test())
    sys.exit(0 if success else 1)