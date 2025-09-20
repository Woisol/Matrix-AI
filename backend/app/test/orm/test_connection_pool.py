"""
测试 ConnectionPool 连接池管理功能
"""

import pytest
import asyncio
from app.utils.orm import ConnectionPool, ConnectionException, get_connection_pool


class TestConnectionPool:
    """测试 ConnectionPool 连接池管理"""
    
    async def test_connection_pool_initialization(self, test_db):
        """测试连接池初始化"""
        pool = get_connection_pool()
        
        assert pool is not None
        assert pool.min_size >= 1
        assert pool.max_size >= pool.min_size
        assert pool._pool is not None
        assert not pool._closed
    
    async def test_connection_pool_acquire_connection(self, test_db):
        """测试获取连接"""
        pool = get_connection_pool()
        
        async with pool.acquire() as conn:
            assert conn is not None
            # 测试连接是否可用
            result = await conn.fetchval("SELECT 1")
            assert result == 1
    
    async def test_connection_pool_execute_query(self, test_db):
        """测试执行查询"""
        pool = get_connection_pool()
        
        # 执行简单查询
        result = await pool.fetchval("SELECT 1 as test_value")
        assert result == 1
        
        # 执行带参数的查询
        result = await pool.fetchval("SELECT $1 as param_value", "test")
        assert result == "test"
    
    async def test_connection_pool_fetch_methods(self, clean_tables):
        """测试不同的 fetch 方法"""
        pool = get_connection_pool()
        
        # 插入测试数据
        await pool.execute(
            "INSERT INTO test_users (username, email, age) VALUES ($1, $2, $3)",
            "pool_test", "pool@example.com", 25
        )
        
        # fetchval - 获取单个值
        count = await pool.fetchval("SELECT COUNT(*) FROM test_users")
        assert count == 1
        
        # fetchrow - 获取单行
        row = await pool.fetchrow("SELECT username, email FROM test_users WHERE username = $1", "pool_test")
        assert row is not None
        assert row["username"] == "pool_test"
        assert row["email"] == "pool@example.com"
        
        # fetch - 获取多行
        rows = await pool.fetch("SELECT * FROM test_users")
        assert len(rows) == 1
        assert rows[0]["username"] == "pool_test"
    
    async def test_connection_pool_stats(self, test_db):
        """测试连接池统计信息"""
        pool = get_connection_pool()
        
        stats = pool.get_stats()
        
        assert isinstance(stats, dict)
        assert 'total_connections' in stats
        assert 'active_connections' in stats
        assert 'idle_connections' in stats
        assert 'queries_executed' in stats
        assert 'connection_errors' in stats
        
        # 统计信息应该是数字
        assert isinstance(stats['total_connections'], int)
        assert isinstance(stats['active_connections'], int)
        assert isinstance(stats['idle_connections'], int)
    
    async def test_connection_pool_health_check(self, test_db):
        """测试健康检查"""
        pool = get_connection_pool()
        
        # 健康检查应该返回 True
        is_healthy = await pool.health_check()
        assert is_healthy is True
    
    async def test_connection_pool_concurrent_connections(self, test_db):
        """测试并发连接"""
        pool = get_connection_pool()
        
        async def test_query(query_id: int):
            """测试查询函数"""
            result = await pool.fetchval("SELECT $1 as query_id", query_id)
            return result
        
        # 并发执行多个查询
        tasks = [test_query(i) for i in range(10)]
        results = await asyncio.gather(*tasks)
        
        # 验证所有查询都成功执行
        assert len(results) == 10
        assert results == list(range(10))
    
    async def test_connection_pool_transaction_isolation(self, clean_tables):
        """测试事务隔离"""
        pool = get_connection_pool()
        
        # 在一个连接中开始事务但不提交
        async with pool.acquire() as conn1:
            tx1 = conn1.transaction()
            await tx1.start()
            
            await conn1.execute(
                "INSERT INTO test_users (username, email) VALUES ($1, $2)",
                "tx_test", "tx@example.com"
            )
            
            # 在另一个连接中查询，应该看不到未提交的数据
            async with pool.acquire() as conn2:
                count = await conn2.fetchval("SELECT COUNT(*) FROM test_users WHERE username = $1", "tx_test")
                assert count == 0  # 事务未提交，看不到数据
            
            # 提交事务
            await tx1.commit()
        
        # 现在应该能看到数据
        count = await pool.fetchval("SELECT COUNT(*) FROM test_users WHERE username = $1", "tx_test")
        assert count == 1
    
    async def test_connection_pool_error_handling(self, test_db):
        """测试错误处理"""
        pool = get_connection_pool()
        
        # 执行无效的 SQL 查询
        with pytest.raises(Exception):
            await pool.execute("INVALID SQL QUERY")
        
        # 连接池在错误后应该仍然可用
        result = await pool.fetchval("SELECT 1")
        assert result == 1
    
    async def test_connection_pool_parameter_binding(self, clean_tables):
        """测试参数绑定"""
        pool = get_connection_pool()
        
        # 测试不同类型的参数
        test_cases = [
            ("string_param", "test_string"),
            ("int_param", 42),
            ("bool_param", True),
            ("null_param", None)
        ]
        
        for username, test_value in test_cases:
            await pool.execute(
                "INSERT INTO test_users (username, email, age, is_active) VALUES ($1, $2, $3, $4)",
                username, f"{username}@example.com", test_value if isinstance(test_value, int) else 25,
                test_value if isinstance(test_value, bool) else True
            )
        
        # 验证数据插入正确
        count = await pool.fetchval("SELECT COUNT(*) FROM test_users")
        assert count == len(test_cases)
    
    async def test_connection_pool_large_query_result(self, clean_tables):
        """测试大结果集查询"""
        pool = get_connection_pool()
        
        # 插入大量数据
        batch_size = 100
        for i in range(batch_size):
            await pool.execute(
                "INSERT INTO test_users (username, email, age) VALUES ($1, $2, $3)",
                f"batch_user_{i}", f"batch_user_{i}@example.com", 20 + (i % 50)
            )
        
        # 查询所有数据
        all_users = await pool.fetch("SELECT * FROM test_users ORDER BY id")
        assert len(all_users) == batch_size
        
        # 验证数据顺序
        for i, user in enumerate(all_users):
            assert user["username"] == f"batch_user_{i}"
    
    async def test_connection_pool_query_timeout(self, test_db):
        """测试查询超时（如果支持）"""
        pool = get_connection_pool()
        
        # 测试正常查询不会超时
        start_time = asyncio.get_event_loop().time()
        result = await pool.fetchval("SELECT 1")
        end_time = asyncio.get_event_loop().time()
        
        assert result == 1
        assert end_time - start_time < 1.0  # 应该很快完成
    
    async def test_connection_pool_prepared_statements(self, clean_tables):
        """测试预处理语句（间接测试）"""
        pool = get_connection_pool()
        
        # 多次执行相同的查询（可能会使用预处理语句）
        for i in range(5):
            await pool.execute(
                "INSERT INTO test_users (username, email, age) VALUES ($1, $2, $3)",
                f"prepared_user_{i}", f"prepared_{i}@example.com", 20 + i
            )
        
        # 验证所有插入都成功
        count = await pool.fetchval("SELECT COUNT(*) FROM test_users")
        assert count == 5
        
        # 多次执行相同的查询模式
        for i in range(5):
            user = await pool.fetchrow(
                "SELECT * FROM test_users WHERE username = $1",
                f"prepared_user_{i}"
            )
            assert user is not None
            assert user["age"] == 20 + i
    
    async def test_connection_pool_json_data_handling(self, clean_tables):
        """测试 JSON 数据处理"""
        pool = get_connection_pool()
        
        # 插入包含 JSON 数据的记录
        json_data = {"key": "value", "number": 42, "array": [1, 2, 3]}
        await pool.execute(
            "INSERT INTO test_users (username, email, metadata) VALUES ($1, $2, $3)",
            "json_user", "json@example.com", json_data
        )
        
        # 查询 JSON 数据
        result = await pool.fetchrow(
            "SELECT metadata FROM test_users WHERE username = $1",
            "json_user"
        )
        
        assert result is not None
        retrieved_json = result["metadata"]
        assert retrieved_json == json_data
        assert retrieved_json["key"] == "value"
        assert retrieved_json["number"] == 42
        assert retrieved_json["array"] == [1, 2, 3]
    
    async def test_connection_pool_unicode_handling(self, clean_tables):
        """测试 Unicode 字符处理"""
        pool = get_connection_pool()
        
        # 测试各种 Unicode 字符
        unicode_strings = [
            "普通中文",
            "Émojis: 😀😃😄",
            "русский текст",
            "العربية",
            "日本語ひらがな",
            "特殊符号：©®™"
        ]
        
        for i, unicode_str in enumerate(unicode_strings):
            await pool.execute(
                "INSERT INTO test_users (username, email) VALUES ($1, $2)",
                f"unicode_user_{i}", f"{unicode_str}@example.com"
            )
        
        # 验证 Unicode 数据正确存储和检索
        for i, expected_str in enumerate(unicode_strings):
            result = await pool.fetchrow(
                "SELECT email FROM test_users WHERE username = $1",
                f"unicode_user_{i}"
            )
            assert result is not None
            assert result["email"] == f"{expected_str}@example.com"
    
    async def test_connection_pool_null_value_handling(self, clean_tables):
        """测试 NULL 值处理"""
        pool = get_connection_pool()
        
        # 插入包含 NULL 值的记录
        await pool.execute(
            "INSERT INTO test_users (username, email, age, score) VALUES ($1, $2, $3, $4)",
            "null_user", "null@example.com", None, None
        )
        
        # 查询 NULL 值
        result = await pool.fetchrow(
            "SELECT age, score FROM test_users WHERE username = $1",
            "null_user"
        )
        
        assert result is not None
        assert result["age"] is None
        assert result["score"] is None