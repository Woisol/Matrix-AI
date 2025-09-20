"""
测试批量操作功能
"""

import pytest
import asyncio
from app.test.orm.conftest import TestUser, TestCourse, create_multiple_users
from app.utils.orm import BatchOperation, transaction


class TestBatchOperation:
    """测试 BatchOperation 批量操作"""
    
    async def test_batch_operation_creation(self, clean_tables):
        """测试批量操作器创建"""
        batch = BatchOperation(TestUser, batch_size=10)
        
        assert batch.model_class == TestUser
        assert batch.batch_size == 10
        assert len(batch._insert_data) == 0
        assert len(batch._update_data) == 0
        assert len(batch._delete_ids) == 0
    
    async def test_batch_insert_single_batch(self, clean_tables):
        """测试单批次插入"""
        batch = BatchOperation(TestUser, batch_size=100)
        
        # 添加插入数据
        test_data = [
            {"username": "batch_user_1", "email": "batch1@example.com", "age": 25},
            {"username": "batch_user_2", "email": "batch2@example.com", "age": 30},
            {"username": "batch_user_3", "email": "batch3@example.com", "age": 35}
        ]
        
        for data in test_data:
            batch.add_insert(**data)
        
        # 执行批量插入
        inserted_users = await batch.execute_inserts()
        
        assert len(inserted_users) == 3
        for i, user in enumerate(inserted_users):
            assert isinstance(user, TestUser)
            assert user.username == f"batch_user_{i+1}"
            assert user.email == f"batch{i+1}@example.com"
            assert user.age == [25, 30, 35][i]
            assert user._exists is True
        
        # 验证数据库中的数据
        db_count = await TestUser.count()
        assert db_count == 3
    
    async def test_batch_insert_multiple_batches(self, clean_tables):
        """测试多批次插入"""
        batch = BatchOperation(TestUser, batch_size=5)  # 小批次大小
        
        # 添加10个用户数据（会分成2个批次）
        for i in range(10):
            batch.add_insert(
                username=f"multi_batch_user_{i}",
                email=f"multi_batch_{i}@example.com",
                age=20 + i
            )
        
        # 执行批量插入
        inserted_users = await batch.execute_inserts()
        
        assert len(inserted_users) == 10
        
        # 验证所有用户都被插入
        db_count = await TestUser.count()
        assert db_count == 10
        
        # 验证用户属性
        for i, user in enumerate(inserted_users):
            assert user.username == f"multi_batch_user_{i}"
            assert user.age == 20 + i
    
    async def test_batch_insert_empty_data(self, clean_tables):
        """测试空数据批量插入"""
        batch = BatchOperation(TestUser)
        
        # 不添加任何数据
        inserted_users = await batch.execute_inserts()
        
        assert len(inserted_users) == 0
        
        # 数据库中应该没有数据
        db_count = await TestUser.count()
        assert db_count == 0
    
    async def test_batch_update_operations(self, clean_tables):
        """测试批量更新操作"""
        # 先创建一些用户
        existing_users = await create_multiple_users(5)
        
        batch = BatchOperation(TestUser)
        
        # 添加更新操作
        for i, user in enumerate(existing_users):
            batch.add_update(
                user.id,
                email=f"updated_{i}@example.com",
                age=user.age + 10
            )
        
        # 执行批量更新
        updated_users = await batch.execute_updates()
        
        assert len(updated_users) == 5
        
        # 验证更新结果
        for i, user in enumerate(updated_users):
            assert user.email == f"updated_{i}@example.com"
            assert user.age == existing_users[i].age + 10
        
        # 验证数据库中的数据
        for i, original_user in enumerate(existing_users):
            db_user = await TestUser.find_by_id(original_user.id)
            assert db_user.email == f"updated_{i}@example.com"
            assert db_user.age == original_user.age + 10
    
    async def test_batch_update_nonexistent_ids(self, clean_tables):
        """测试更新不存在的ID"""
        batch = BatchOperation(TestUser)
        
        # 尝试更新不存在的用户
        batch.add_update(999, email="nonexistent@example.com")
        batch.add_update(1000, age=50)
        
        # 执行批量更新
        updated_users = await batch.execute_updates()
        
        # 不存在的ID不会返回任何结果
        assert len(updated_users) == 0
    
    async def test_batch_delete_operations(self, clean_tables):
        """测试批量删除操作"""
        # 先创建一些用户
        existing_users = await create_multiple_users(8)
        user_ids = [user.id for user in existing_users]
        
        batch = BatchOperation(TestUser)
        
        # 添加删除操作（删除前5个用户）
        for user_id in user_ids[:5]:
            batch.add_delete(user_id)
        
        # 执行批量删除
        deleted_count = await batch.execute_deletes()
        
        assert deleted_count == 5
        
        # 验证数据库中剩余用户数量
        remaining_count = await TestUser.count()
        assert remaining_count == 3
        
        # 验证被删除的用户不存在
        for user_id in user_ids[:5]:
            deleted_user = await TestUser.find_by_id(user_id)
            assert deleted_user is None
        
        # 验证未删除的用户仍然存在
        for user_id in user_ids[5:]:
            existing_user = await TestUser.find_by_id(user_id)
            assert existing_user is not None
    
    async def test_batch_delete_nonexistent_ids(self, clean_tables):
        """测试删除不存在的ID"""
        batch = BatchOperation(TestUser)
        
        # 尝试删除不存在的用户
        batch.add_delete(999)
        batch.add_delete(1000)
        batch.add_delete(1001)
        
        # 执行批量删除
        deleted_count = await batch.execute_deletes()
        
        # 不存在的ID删除计数为0
        assert deleted_count == 0
    
    async def test_batch_execute_all_operations(self, clean_tables):
        """测试执行所有批量操作"""
        # 先创建一些用户用于更新和删除
        existing_users = await create_multiple_users(5)
        
        batch = BatchOperation(TestUser, batch_size=10)
        
        # 添加插入操作
        for i in range(3):
            batch.add_insert(
                username=f"new_user_{i}",
                email=f"new_{i}@example.com",
                age=25 + i
            )
        
        # 添加更新操作
        for i in range(2):  # 更新前2个用户
            batch.add_update(
                existing_users[i].id,
                email=f"batch_updated_{i}@example.com"
            )
        
        # 添加删除操作
        for i in range(2, 4):  # 删除第3、4个用户
            batch.add_delete(existing_users[i].id)
        
        # 执行所有操作
        results = await batch.execute_all()
        
        # 验证结果
        assert len(results['inserted']) == 3
        assert len(results['updated']) == 2
        assert results['deleted_count'] == 2
        
        # 验证最终数据库状态
        final_count = await TestUser.count()
        assert final_count == 6  # 原有5个 + 新增3个 - 删除2个 = 6个
    
    async def test_batch_operations_in_transaction(self, clean_tables):
        """测试事务中的批量操作"""
        initial_count = await TestUser.count()
        
        async with transaction() as tx:
            batch = BatchOperation(TestUser)
            
            # 添加批量插入操作
            for i in range(5):
                batch.add_insert(
                    username=f"tx_batch_user_{i}",
                    email=f"tx_batch_{i}@example.com",
                    age=30 + i
                )
            
            # 在事务中执行
            results = await batch.execute_all()
            assert len(results['inserted']) == 5
        
        # 事务提交后验证数据
        final_count = await TestUser.count()
        assert final_count == initial_count + 5
    
    async def test_batch_operations_rollback_on_error(self, clean_tables):
        """测试批量操作中的错误回滚"""
        initial_count = await TestUser.count()
        
        with pytest.raises(Exception):
            async with transaction() as tx:
                batch = BatchOperation(TestUser)
                
                # 添加有效数据
                batch.add_insert(
                    username="valid_user",
                    email="valid@example.com",
                    age=25
                )
                
                # 执行批量插入
                await batch.execute_inserts()
                
                # 故意抛出异常
                raise ValueError("Test rollback")
        
        # 验证数据被回滚
        final_count = await TestUser.count()
        assert final_count == initial_count
    
    async def test_batch_large_dataset(self, clean_tables):
        """测试大数据集批量操作"""
        batch = BatchOperation(TestUser, batch_size=50)
        
        # 添加大量数据
        dataset_size = 200
        for i in range(dataset_size):
            batch.add_insert(
                username=f"large_dataset_user_{i}",
                email=f"large_{i}@example.com",
                age=20 + (i % 50)
            )
        
        # 执行批量插入
        inserted_users = await batch.execute_inserts()
        
        assert len(inserted_users) == dataset_size
        
        # 验证数据库中的数据
        db_count = await TestUser.count()
        assert db_count == dataset_size
        
        # 验证数据正确性（抽样检查）
        sample_indices = [0, 50, 100, 150, 199]
        for i in sample_indices:
            user = await TestUser.get(username=f"large_dataset_user_{i}")
            assert user is not None
            assert user.email == f"large_{i}@example.com"
            assert user.age == 20 + (i % 50)
    
    async def test_batch_concurrent_operations(self, clean_tables):
        """测试并发批量操作"""
        async def concurrent_batch_insert(batch_id: int, count: int):
            """并发批量插入函数"""
            batch = BatchOperation(TestUser, batch_size=10)
            
            for i in range(count):
                batch.add_insert(
                    username=f"concurrent_{batch_id}_{i}",
                    email=f"concurrent_{batch_id}_{i}@example.com",
                    age=20 + batch_id + i
                )
            
            results = await batch.execute_all()
            return len(results['inserted'])
        
        # 并发执行多个批量操作
        tasks = [
            concurrent_batch_insert(0, 10),
            concurrent_batch_insert(1, 15), 
            concurrent_batch_insert(2, 12),
            concurrent_batch_insert(3, 8)
        ]
        
        inserted_counts = await asyncio.gather(*tasks)
        
        # 验证每个批次的插入数量
        expected_counts = [10, 15, 12, 8]
        assert inserted_counts == expected_counts
        
        # 验证总数量
        total_count = await TestUser.count()
        assert total_count == sum(expected_counts)
    
    async def test_batch_operations_data_validation(self, clean_tables):
        """测试批量操作的数据验证"""
        batch = BatchOperation(TestUser)
        
        # 添加有效数据
        batch.add_insert(
            username="valid_user",
            email="valid@example.com",
            age=25
        )
        
        # 尝试添加无效数据（如果有验证的话）
        # 这里测试空的必需字段
        try:
            batch.add_insert(
                username="",  # 空用户名可能无效
                email="empty@example.com"
            )
            
            results = await batch.execute_all()
            # 如果没有验证，应该能正常执行
            
        except Exception as e:
            # 如果有验证，应该捕获到异常
            assert "validation" in str(e).lower() or "constraint" in str(e).lower()
    
    async def test_batch_operations_performance(self, clean_tables):
        """测试批量操作性能"""
        import time
        
        # 测试单个插入的时间
        start_time = time.time()
        for i in range(50):
            user = TestUser(
                username=f"single_user_{i}",
                email=f"single_{i}@example.com",
                age=25 + i
            )
            await user.save()
        single_insert_time = time.time() - start_time
        
        # 清理数据
        await TestUser.query().where("username LIKE $1", "single_user_%").execute()
        
        # 测试批量插入的时间
        batch = BatchOperation(TestUser, batch_size=25)
        for i in range(50):
            batch.add_insert(
                username=f"batch_user_{i}",
                email=f"batch_{i}@example.com",
                age=25 + i
            )
        
        start_time = time.time()
        await batch.execute_all()
        batch_insert_time = time.time() - start_time
        
        # 批量操作应该比单个操作快（通常情况下）
        print(f"Single insert time: {single_insert_time:.4f}s")
        print(f"Batch insert time: {batch_insert_time:.4f}s")
        
        # 验证数据正确性
        batch_count = await TestUser.count()
        assert batch_count == 50
    
    async def test_batch_mixed_data_types(self, clean_tables):
        """测试批量操作混合数据类型"""
        batch = BatchOperation(TestUser)
        
        # 添加包含各种数据类型的记录
        test_cases = [
            {
                "username": "json_user",
                "email": "json@example.com",
                "age": 30,
                "metadata": {"role": "admin", "permissions": ["read", "write"]}
            },
            {
                "username": "null_user",
                "email": "null@example.com",
                "age": None,  # NULL 值
                "metadata": {}
            },
            {
                "username": "unicode_user",
                "email": "unicode@例子.com",  # Unicode
                "age": 25,
                "metadata": {"中文": "测试", "emoji": "😀"}
            }
        ]
        
        for case in test_cases:
            batch.add_insert(**case)
        
        results = await batch.execute_all()
        assert len(results['inserted']) == 3
        
        # 验证数据正确保存
        for case in test_cases:
            user = await TestUser.get(username=case["username"])
            assert user is not None
            assert user.email == case["email"]
            assert user.age == case["age"]
            assert user.metadata == case["metadata"]