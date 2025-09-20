"""
测试事务管理功能
"""

import pytest
import asyncio
from app.test.orm.conftest import TestUser, TestCourse
from app.utils.orm import transaction, Transaction, QueryException, get_connection_pool


class TestTransactionManagement:
    """测试事务管理功能"""
    
    async def test_transaction_context_manager(self, clean_tables):
        """测试事务上下文管理器"""
        # 使用事务创建用户
        async with transaction() as tx:
            user = TestUser(
                username="tx_user",
                email="tx@example.com",
                age=30
            )
            await user.save()
            
            # 在事务内检查用户是否存在
            exists = await TestUser.exists(username="tx_user")
            assert exists is True
        
        # 事务提交后，用户应该仍然存在
        exists = await TestUser.exists(username="tx_user")
        assert exists is True
    
    async def test_transaction_automatic_rollback(self, clean_tables):
        """测试事务自动回滚"""
        initial_count = await TestUser.count()
        
        # 在事务中发生异常，应该自动回滚
        with pytest.raises(ValueError):
            async with transaction() as tx:
                user1 = TestUser(
                    username="rollback_user1",
                    email="rollback1@example.com"
                )
                await user1.save()
                
                user2 = TestUser(
                    username="rollback_user2",
                    email="rollback2@example.com"
                )
                await user2.save()
                
                # 故意抛出异常
                raise ValueError("Test rollback")
        
        # 事务回滚后，用户数量应该不变
        final_count = await TestUser.count()
        assert final_count == initial_count
        
        # 确认用户没有被保存
        exists1 = await TestUser.exists(username="rollback_user1")
        exists2 = await TestUser.exists(username="rollback_user2") 
        assert exists1 is False
        assert exists2 is False
    
    async def test_transaction_manual_commit(self, clean_tables):
        """测试手动提交事务"""
        pool = get_connection_pool()
        
        async with pool.acquire() as conn:
            tx = Transaction(conn)
            await tx.__aenter__()
            
            try:
                # 在事务中创建用户
                await conn.execute(
                    "INSERT INTO test_users (username, email, age) VALUES ($1, $2, $3)",
                    "manual_commit_user", "manual@example.com", 25
                )
                
                # 手动提交
                await tx.commit()
                
            except Exception as e:
                await tx.rollback()
                raise
            finally:
                await tx.__aexit__(None, None, None)
        
        # 验证用户已保存
        exists = await TestUser.exists(username="manual_commit_user")
        assert exists is True
    
    async def test_transaction_manual_rollback(self, clean_tables):
        """测试手动回滚事务"""
        pool = get_connection_pool()
        
        async with pool.acquire() as conn:
            tx = Transaction(conn)
            await tx.__aenter__()
            
            try:
                # 在事务中创建用户
                await conn.execute(
                    "INSERT INTO test_users (username, email, age) VALUES ($1, $2, $3)",
                    "manual_rollback_user", "rollback@example.com", 25
                )
                
                # 手动回滚
                await tx.rollback()
                
            except Exception:
                await tx.rollback()
            finally:
                await tx.__aexit__(None, None, None)
        
        # 验证用户没有被保存
        exists = await TestUser.exists(username="manual_rollback_user")
        assert exists is False
    
    async def test_transaction_savepoint(self, clean_tables):
        """测试保存点功能"""
        async with transaction() as tx:
            # 创建第一个用户
            user1 = TestUser(
                username="savepoint_user1",
                email="savepoint1@example.com"
            )
            await user1.save()
            
            # 创建保存点
            savepoint_name = await tx.savepoint("after_user1")
            
            # 创建第二个用户
            user2 = TestUser(
                username="savepoint_user2", 
                email="savepoint2@example.com"
            )
            await user2.save()
            
            # 回滚到保存点
            await tx.rollback_to_savepoint(savepoint_name)
            
            # 创建第三个用户
            user3 = TestUser(
                username="savepoint_user3",
                email="savepoint3@example.com"
            )
            await user3.save()
        
        # 验证结果：user1 和 user3 应该存在，user2 应该不存在
        exists1 = await TestUser.exists(username="savepoint_user1")
        exists2 = await TestUser.exists(username="savepoint_user2")
        exists3 = await TestUser.exists(username="savepoint_user3")
        
        assert exists1 is True
        assert exists2 is False  # 被回滚了
        assert exists3 is True
    
    async def test_transaction_multiple_savepoints(self, clean_tables):
        """测试多个保存点"""
        pool = get_connection_pool()
        
        async with pool.acquire() as conn:
            tx = Transaction(conn)
            await tx.__aenter__()
            
            try:
                # 创建第一个用户
                await conn.execute(
                    "INSERT INTO test_users (username, email) VALUES ($1, $2)",
                    "multi_sp_user1", "multi1@example.com"
                )
                
                sp1 = await tx.savepoint("sp1")
                
                # 创建第二个用户
                await conn.execute(
                    "INSERT INTO test_users (username, email) VALUES ($1, $2)",
                    "multi_sp_user2", "multi2@example.com"
                )
                
                sp2 = await tx.savepoint("sp2")
                
                # 创建第三个用户  
                await conn.execute(
                    "INSERT INTO test_users (username, email) VALUES ($1, $2)",
                    "multi_sp_user3", "multi3@example.com"
                )
                
                # 回滚到第一个保存点
                await tx.rollback_to_savepoint(sp1)
                
                # 创建第四个用户
                await conn.execute(
                    "INSERT INTO test_users (username, email) VALUES ($1, $2)",
                    "multi_sp_user4", "multi4@example.com"
                )
                
                await tx.commit()
                
            except Exception:
                await tx.rollback()
            finally:
                await tx.__aexit__(None, None, None)
        
        # 验证结果
        exists1 = await TestUser.exists(username="multi_sp_user1")  # 应该存在
        exists2 = await TestUser.exists(username="multi_sp_user2")  # 被回滚
        exists3 = await TestUser.exists(username="multi_sp_user3")  # 被回滚  
        exists4 = await TestUser.exists(username="multi_sp_user4")  # 应该存在
        
        assert exists1 is True
        assert exists2 is False
        assert exists3 is False
        assert exists4 is True
    
    async def test_transaction_release_savepoint(self, clean_tables):
        """测试释放保存点"""
        pool = get_connection_pool()
        
        async with pool.acquire() as conn:
            tx = Transaction(conn)
            await tx.__aenter__()
            
            try:
                # 创建用户
                await conn.execute(
                    "INSERT INTO test_users (username, email) VALUES ($1, $2)",
                    "release_sp_user", "release@example.com"
                )
                
                sp_name = await tx.savepoint("release_test")
                
                # 创建更多数据
                await conn.execute(
                    "INSERT INTO test_users (username, email) VALUES ($1, $2)",
                    "release_sp_user2", "release2@example.com"
                )
                
                # 释放保存点
                await tx.release_savepoint(sp_name)
                
                # 现在应该无法回滚到已释放的保存点
                with pytest.raises(QueryException):
                    await tx.rollback_to_savepoint(sp_name)
                
                await tx.commit()
                
            except Exception:
                await tx.rollback()
            finally:
                await tx.__aexit__(None, None, None)
        
        # 所有用户都应该存在（保存点被释放，不影响提交）
        exists1 = await TestUser.exists(username="release_sp_user")
        exists2 = await TestUser.exists(username="release_sp_user2")
        assert exists1 is True
        assert exists2 is True
    
    async def test_transaction_nested_operations(self, clean_tables):
        """测试事务中的嵌套操作"""
        async with transaction() as tx:
            # 创建用户
            user = TestUser(
                username="nested_user",
                email="nested@example.com"
            )
            await user.save()
            
            # 创建课程
            course = TestCourse(
                id="nested-course",
                course_name="嵌套测试课程",
                user_id=user.id
            )
            await course.save()
            
            # 更新用户
            user.age = 35
            await user.save()
            
            # 创建保存点
            sp = await tx.savepoint("nested_ops")
            
            # 更新课程
            course.description = "更新的描述"
            await course.save()
            
            # 如果需要，可以回滚部分操作
            if course.description != "期望的描述":
                await tx.rollback_to_savepoint(sp)
                course.description = "回滚后的描述"
                await course.save()
        
        # 验证所有操作
        saved_user = await TestUser.get(username="nested_user")
        saved_course = await TestCourse.get(id="nested-course")
        
        assert saved_user is not None
        assert saved_user.age == 35
        assert saved_course is not None
        assert saved_course.description == "回滚后的描述"
    
    async def test_transaction_isolation_levels(self, clean_tables):
        """测试事务隔离（基础测试）"""
        pool = get_connection_pool()
        
        # 事务1：插入数据但不提交
        async with pool.acquire() as conn1:
            tx1 = conn1.transaction()
            await tx1.start()
            
            await conn1.execute(
                "INSERT INTO test_users (username, email) VALUES ($1, $2)",
                "isolation_user", "isolation@example.com"
            )
            
            # 事务2：尝试读取数据
            async with pool.acquire() as conn2:
                count = await conn2.fetchval(
                    "SELECT COUNT(*) FROM test_users WHERE username = $1",
                    "isolation_user"
                )
                # 由于事务隔离，应该看不到未提交的数据
                assert count == 0
            
            # 提交事务1
            await tx1.commit()
        
        # 现在事务2应该能看到数据
        count = await pool.fetchval(
            "SELECT COUNT(*) FROM test_users WHERE username = $1",
            "isolation_user"
        )
        assert count == 1
    
    async def test_transaction_concurrent_access(self, clean_tables):
        """测试并发事务访问"""
        async def create_user_in_transaction(user_id: int):
            """在事务中创建用户"""
            async with transaction() as tx:
                user = TestUser(
                    username=f"concurrent_user_{user_id}",
                    email=f"concurrent_{user_id}@example.com",
                    age=20 + user_id
                )
                await user.save()
                
                # 模拟一些处理时间
                await asyncio.sleep(0.01)
                
                return user.id
        
        # 并发创建多个用户
        tasks = [create_user_in_transaction(i) for i in range(5)]
        user_ids = await asyncio.gather(*tasks)
        
        # 验证所有用户都被创建
        assert len(user_ids) == 5
        for i, user_id in enumerate(user_ids):
            user = await TestUser.find_by_id(user_id)
            assert user is not None
            assert user.username == f"concurrent_user_{i}"
    
    async def test_transaction_error_recovery(self, clean_tables):
        """测试事务错误恢复"""
        # 第一个事务：成功
        async with transaction() as tx:
            user1 = TestUser(
                username="recovery_user1",
                email="recovery1@example.com"
            )
            await user1.save()
        
        # 第二个事务：失败
        with pytest.raises(Exception):
            async with transaction() as tx:
                user2 = TestUser(
                    username="recovery_user2",
                    email="recovery2@example.com"
                )
                await user2.save()
                
                # 尝试创建重复用户名（应该失败）
                duplicate_user = TestUser(
                    username="recovery_user1",  # 重复用户名
                    email="duplicate@example.com"
                )
                await duplicate_user.save()
        
        # 第三个事务：应该正常工作
        async with transaction() as tx:
            user3 = TestUser(
                username="recovery_user3",
                email="recovery3@example.com"
            )
            await user3.save()
        
        # 验证结果
        exists1 = await TestUser.exists(username="recovery_user1")
        exists2 = await TestUser.exists(username="recovery_user2")
        exists3 = await TestUser.exists(username="recovery_user3")
        
        assert exists1 is True   # 第一个事务成功
        assert exists2 is False  # 第二个事务回滚
        assert exists3 is True   # 第三个事务成功
    
    async def test_transaction_savepoint_errors(self, clean_tables):
        """测试保存点错误处理"""
        pool = get_connection_pool()
        
        async with pool.acquire() as conn:
            tx = Transaction(conn)
            await tx.__aenter__()
            
            try:
                # 尝试回滚不存在的保存点
                with pytest.raises(QueryException):
                    await tx.rollback_to_savepoint("nonexistent_savepoint")
                
                # 尝试释放不存在的保存点
                with pytest.raises(QueryException):
                    await tx.release_savepoint("nonexistent_savepoint")
                
                # 正常创建保存点
                sp = await tx.savepoint("valid_savepoint")
                
                # 多次释放同一保存点应该出错
                await tx.release_savepoint(sp)
                with pytest.raises(QueryException):
                    await tx.release_savepoint(sp)
                
                await tx.rollback()
                
            except Exception:
                await tx.rollback()
            finally:
                await tx.__aexit__(None, None, None)
    
    async def test_transaction_without_active_transaction(self):
        """测试在没有活跃事务时的操作"""
        pool = get_connection_pool()
        
        async with pool.acquire() as conn:
            tx = Transaction(conn)
            
            # 在没有开始事务时尝试创建保存点
            with pytest.raises(QueryException):
                await tx.savepoint("no_tx_savepoint")
            
            # 在没有事务时尝试回滚保存点
            with pytest.raises(QueryException):
                await tx.rollback_to_savepoint("no_tx_savepoint")
    
    async def test_transaction_large_operations(self, clean_tables):
        """测试大批量操作的事务"""
        async with transaction() as tx:
            # 批量创建用户
            batch_size = 50
            for i in range(batch_size):
                user = TestUser(
                    username=f"large_tx_user_{i}",
                    email=f"large_tx_{i}@example.com",
                    age=20 + (i % 30)
                )
                await user.save()
            
            # 中途创建保存点
            sp = await tx.savepoint("large_batch_middle")
            
            # 继续创建更多用户
            for i in range(batch_size, batch_size + 25):
                user = TestUser(
                    username=f"large_tx_user_{i}",
                    email=f"large_tx_{i}@example.com",
                    age=20 + (i % 30)
                )
                await user.save()
            
            # 决定是否回滚后半部分
            total_users = await TestUser.count()
            if total_users > 60:  # 如果用户太多，回滚一部分
                await tx.rollback_to_savepoint(sp)
        
        # 验证最终结果
        final_count = await TestUser.count()
        assert final_count == batch_size  # 应该只有前50个用户