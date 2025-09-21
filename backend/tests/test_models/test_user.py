"""
用户模型测试
"""
import pytest
import uuid
from tortoise.exceptions import IntegrityError

from app.models.user import User
from tests.test_helpers import TestDataGenerator


class TestUserModel:
    """用户模型测试类"""

    @pytest.mark.asyncio
    async def test_create_user(self, db):
        """测试创建用户"""
        username = f"test_user_{uuid.uuid4()}"
        code_style = "Clean and readable code"
        knowledge_status = "Beginner level"

        user = await User.create(
            username=username,
            code_style=code_style,
            knowledge_status=knowledge_status
        )

        assert user.id is not None
        assert user.username == username
        assert user.code_style == code_style
        assert user.knowledge_status == knowledge_status

    @pytest.mark.asyncio
    async def test_create_user_with_minimal_data(self, db):
        """测试创建最少数据的用户"""
        username = f"minimal_user_{uuid.uuid4()}"

        user = await User.create(
            username=username,
            code_style=None,
            knowledge_status=None
        )

        assert user.id is not None
        assert user.username == username
        assert user.code_style is None
        assert user.knowledge_status is None

    @pytest.mark.asyncio
    async def test_get_user_by_id(self, db):
        """测试通过ID获取用户"""
        user = await TestDataGenerator.create_test_user()

        retrieved_user = await User.get(id=user.id)

        assert retrieved_user.id == user.id
        assert retrieved_user.username == user.username
        assert retrieved_user.code_style == user.code_style
        assert retrieved_user.knowledge_status == user.knowledge_status

    @pytest.mark.asyncio
    async def test_get_user_by_username(self, db):
        """测试通过用户名获取用户"""
        username = f"unique_user_{uuid.uuid4()}"
        user = await TestDataGenerator.create_test_user(username=username)

        retrieved_user = await User.get(username=username)

        assert retrieved_user.id == user.id
        assert retrieved_user.username == username

    @pytest.mark.asyncio
    async def test_update_user(self, db):
        """测试更新用户"""
        user = await TestDataGenerator.create_test_user()

        new_code_style = "Updated code style"
        new_knowledge_status = "Advanced level"

        user.code_style = new_code_style
        user.knowledge_status = new_knowledge_status
        await user.save()

        # 重新获取用户验证更新
        updated_user = await User.get(id=user.id)
        assert updated_user.code_style == new_code_style
        assert updated_user.knowledge_status == new_knowledge_status

    @pytest.mark.asyncio
    async def test_delete_user(self, db):
        """测试删除用户"""
        user = await TestDataGenerator.create_test_user()
        user_id = user.id

        await user.delete()

        # 验证用户已被删除
        with pytest.raises(Exception):  # DoesNotExist
            await User.get(id=user_id)

    @pytest.mark.asyncio
    async def test_list_users(self, db):
        """测试获取用户列表"""
        # 创建多个用户
        users = []
        for i in range(3):
            user = await TestDataGenerator.create_test_user(
                username=f"list_user_{i}_{uuid.uuid4()}"
            )
            users.append(user)

        all_users = await User.all()

        # 验证创建的用户都在列表中
        user_ids = [user.id for user in all_users]
        for user in users:
            assert user.id in user_ids

    @pytest.mark.asyncio
    async def test_user_str_representation(self, db):
        """测试用户的字符串表示"""
        user = await TestDataGenerator.create_test_user(username="str_test_user")

        # 检查__str__方法是否正常工作
        str_repr = str(user)
        assert isinstance(str_repr, str)
        assert len(str_repr) > 0

    @pytest.mark.asyncio
    async def test_user_username_constraints(self, db):
        """测试用户名约束"""
        # 测试用户名长度限制
        long_username = "a" * 100  # 超过50字符限制

        # 这应该会失败，因为用户名超过了最大长度
        with pytest.raises(Exception):  # ValidationError 或类似错误
            await User.create(
                username=long_username,
                code_style="test",
                knowledge_status="test"
            )

    @pytest.mark.asyncio
    async def test_user_filter_operations(self, db):
        """测试用户过滤操作"""
        # 创建多个用户
        users_data = [
            ("filter_user_1", "Style 1", "Beginner"),
            ("filter_user_2", "Style 2", "Intermediate"),
            ("filter_user_3", "Style 1", "Advanced"),
        ]

        created_users = []
        for username, code_style, knowledge_status in users_data:
            user = await TestDataGenerator.create_test_user(
                username=f"{username}_{uuid.uuid4()}",
                code_style=code_style,
                knowledge_status=knowledge_status
            )
            created_users.append(user)

        # 测试按代码风格过滤
        style1_users = await User.filter(code_style="Style 1").all()
        assert len(style1_users) >= 2  # 至少有我们创建的2个

        # 测试按知识状态过滤
        beginner_users = await User.filter(knowledge_status="Beginner").all()
        assert len(beginner_users) >= 1  # 至少有我们创建的1个

    @pytest.mark.asyncio
    async def test_user_exists(self, db):
        """测试用户存在性检查"""
        username = f"exists_user_{uuid.uuid4()}"

        # 用户不存在
        exists_before = await User.exists(username=username)
        assert not exists_before

        # 创建用户
        await TestDataGenerator.create_test_user(username=username)

        # 用户存在
        exists_after = await User.exists(username=username)
        assert exists_after