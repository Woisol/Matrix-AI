"""
测试 BaseModel 基础功能
"""

import pytest
from datetime import datetime
from app.test.orm.conftest import TestUser, TestCourse, create_multiple_users
from app.utils.orm import ORMException, QueryException, ValidationException


class TestBaseModel:
    """测试 BaseModel 基础功能"""
    
    async def test_model_creation(self, clean_tables):
        """测试模型创建"""
        user = TestUser(
            username="john_doe",
            email="john@example.com",
            age=30,
            score=85.5,
            metadata={"role": "admin"}
        )
        
        # 检查模型属性
        assert user.username == "john_doe"
        assert user.email == "john@example.com"
        assert user.age == 30
        assert user.score == 85.5
        assert user.metadata == {"role": "admin"}
        assert user.is_active is True  # 默认值
        assert user._exists is False  # 尚未保存
    
    async def test_model_save_new(self, clean_tables):
        """测试保存新模型"""
        user = TestUser(
            username="alice",
            email="alice@example.com",
            age=25
        )
        
        # 保存前检查
        assert user.id is None
        assert user._exists is False
        
        # 保存模型
        saved_user = await user.save()
        
        # 保存后检查
        assert saved_user.id is not None
        assert saved_user._exists is True
        assert saved_user._dirty_fields == set()
        assert isinstance(saved_user.created_at, datetime)
    
    async def test_model_save_update(self, sample_user):
        """测试更新现有模型"""
        # 修改用户信息
        original_email = sample_user.email
        sample_user.email = "updated@example.com"
        sample_user.age = 30
        
        # 检查脏字段
        assert "email" in sample_user._dirty_fields
        assert "age" in sample_user._dirty_fields
        
        # 保存更新
        updated_user = await sample_user.save()
        
        # 验证更新
        assert updated_user.email == "updated@example.com"
        assert updated_user.age == 30
        assert updated_user._dirty_fields == set()
        
        # 验证原始数据没有变化（除了被更新的字段）
        assert updated_user.username == sample_user.username
    
    async def test_model_find_by_id(self, sample_user):
        """测试根据主键查找"""
        # 查找存在的用户
        found_user = await TestUser.find_by_id(sample_user.id)
        assert found_user is not None
        assert found_user.id == sample_user.id
        assert found_user.username == sample_user.username
        
        # 查找不存在的用户
        not_found = await TestUser.find_by_id(99999)
        assert not_found is None
    
    async def test_model_get(self, sample_user):
        """测试根据条件获取单个记录"""
        # 根据用户名查找
        found_user = await TestUser.get(username=sample_user.username)
        assert found_user is not None
        assert found_user.id == sample_user.id
        
        # 根据邮箱查找
        found_user = await TestUser.get(email=sample_user.email)
        assert found_user is not None
        assert found_user.id == sample_user.id
        
        # 查找不存在的用户
        not_found = await TestUser.get(username="nonexistent")
        assert not_found is None
    
    async def test_model_filter(self, clean_tables):
        """测试根据条件过滤记录"""
        # 创建多个用户
        users = await create_multiple_users(5)
        
        # 过滤活跃用户
        active_users = await TestUser.filter(is_active=True)
        assert len(active_users) == 3  # 偶数索引的用户是活跃的
        
        # 过滤非活跃用户
        inactive_users = await TestUser.filter(is_active=False)
        assert len(inactive_users) == 2
        
        # 验证结果类型
        for user in active_users:
            assert isinstance(user, TestUser)
            assert user.is_active is True
    
    async def test_model_all(self, clean_tables):
        """测试获取所有记录"""
        # 创建多个用户
        await create_multiple_users(3)
        
        # 获取所有用户
        all_users = await TestUser.all()
        assert len(all_users) == 3
        
        for user in all_users:
            assert isinstance(user, TestUser)
            assert user._exists is True
    
    async def test_model_exists(self, sample_user):
        """测试检查记录是否存在"""
        # 检查存在的用户
        exists = await TestUser.exists(username=sample_user.username)
        assert exists is True
        
        # 检查不存在的用户
        not_exists = await TestUser.exists(username="nonexistent")
        assert not_exists is False
    
    async def test_model_count(self, clean_tables):
        """测试统计记录数量"""
        # 初始数量
        initial_count = await TestUser.count()
        assert initial_count == 0
        
        # 创建用户后统计
        await create_multiple_users(4)
        total_count = await TestUser.count()
        assert total_count == 4
        
        # 按条件统计
        active_count = await TestUser.count(is_active=True)
        assert active_count == 2  # 偶数索引的用户
        
        inactive_count = await TestUser.count(is_active=False)
        assert inactive_count == 2  # 奇数索引的用户
    
    async def test_model_delete(self, sample_user):
        """测试删除模型"""
        user_id = sample_user.id
        
        # 确认用户存在
        assert await TestUser.exists(id=user_id) is True
        
        # 删除用户
        deleted = await sample_user.delete()
        assert deleted is True
        assert sample_user._exists is False
        
        # 确认用户已被删除
        assert await TestUser.exists(id=user_id) is False
        
        # 再次删除应该返回 False
        deleted_again = await sample_user.delete()
        assert deleted_again is False
    
    async def test_model_reload(self, sample_user):
        """测试重新加载模型数据"""
        original_email = sample_user.email
        
        # 在另一个实例中修改数据
        other_user = await TestUser.find_by_id(sample_user.id)
        other_user.email = "reloaded@example.com"
        await other_user.save()
        
        # 原实例数据未变
        assert sample_user.email == original_email
        
        # 重新加载数据
        reloaded_user = await sample_user.reload()
        assert reloaded_user.email == "reloaded@example.com"
        assert sample_user.email == "reloaded@example.com"  # 原实例数据已更新
    
    async def test_model_to_dict(self, sample_user):
        """测试转换为字典"""
        user_dict = sample_user.to_dict()
        
        assert isinstance(user_dict, dict)
        assert user_dict["username"] == sample_user.username
        assert user_dict["email"] == sample_user.email
        assert user_dict["age"] == sample_user.age
        assert user_dict["id"] == sample_user.id
    
    async def test_model_fields_metadata(self):
        """测试模型字段元数据"""
        fields = TestUser.get_fields()
        
        assert "id" in fields
        assert "username" in fields
        assert "email" in fields
        assert "age" in fields
        assert "is_active" in fields
        
        # 检查主键字段
        pk_field = TestUser.get_primary_key_field()
        assert pk_field == "id"
        
        # 检查表名
        table_name = TestUser.get_table_name()
        assert table_name == "test_users"
    
    async def test_model_default_values(self, clean_tables):
        """测试字段默认值"""
        user = TestUser(username="test", email="test@example.com")
        
        # 检查默认值
        assert user.is_active is True
        assert user.metadata == {}
        assert user.age is None  # nullable 字段默认为 None
        
        await user.save()
        
        # 保存后检查默认值仍然有效
        assert user.is_active is True
        assert isinstance(user.created_at, datetime)
    
    async def test_model_unique_constraint(self, sample_user):
        """测试唯一约束"""
        duplicate_user = TestUser(
            username=sample_user.username,  # 重复的用户名
            email="different@example.com"
        )
        
        # 保存应该失败
        with pytest.raises(Exception):  # 数据库约束错误
            await duplicate_user.save()
    
    async def test_model_nullable_fields(self, clean_tables):
        """测试可空字段"""
        user = TestUser(
            username="nullable_test",
            email="nullable@example.com",
            age=None,  # 可空字段
            score=None  # 可空字段
        )
        
        await user.save()
        
        # 验证可空字段
        saved_user = await TestUser.find_by_id(user.id)
        assert saved_user.age is None
        assert saved_user.score is None
    
    async def test_model_json_field(self, clean_tables):
        """测试 JSON 字段"""
        complex_metadata = {
            "preferences": {
                "theme": "dark",
                "language": "zh-CN",
                "notifications": True
            },
            "statistics": {
                "login_count": 42,
                "last_active": "2024-01-01"
            },
            "tags": ["student", "active", "premium"]
        }
        
        user = TestUser(
            username="json_test",
            email="json@example.com",
            metadata=complex_metadata
        )
        
        await user.save()
        
        # 验证 JSON 字段
        saved_user = await TestUser.find_by_id(user.id)
        assert saved_user.metadata == complex_metadata
        assert saved_user.metadata["preferences"]["theme"] == "dark"
        assert len(saved_user.metadata["tags"]) == 3
    
    async def test_model_repr_str(self, sample_user):
        """测试模型的字符串表示"""
        repr_str = repr(sample_user)
        str_str = str(sample_user)
        
        assert "TestUser" in repr_str
        assert f"id={sample_user.id}" in repr_str
        assert repr_str == str_str
    
    async def test_model_dirty_fields_tracking(self, sample_user):
        """测试脏字段跟踪"""
        # 初始状态没有脏字段
        assert len(sample_user._dirty_fields) == 0
        
        # 修改字段
        sample_user.username = "modified_username"
        assert "username" in sample_user._dirty_fields
        
        sample_user.age = 35
        assert "age" in sample_user._dirty_fields
        assert len(sample_user._dirty_fields) == 2
        
        # 保存后脏字段应该被清空
        await sample_user.save()
        assert len(sample_user._dirty_fields) == 0
    
    async def test_model_auto_increment_field(self, clean_tables):
        """测试自增字段"""
        user1 = TestUser(username="user1", email="user1@example.com")
        user2 = TestUser(username="user2", email="user2@example.com")
        
        await user1.save()
        await user2.save()
        
        # 验证自增字段
        assert user1.id is not None
        assert user2.id is not None
        assert user2.id > user1.id  # 第二个用户的 ID 应该更大