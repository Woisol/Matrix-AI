"""
测试 Pydantic 集成和数据验证功能
"""

import pytest
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from decimal import Decimal
from pydantic import ValidationError, Field, validator
from app.test.orm.conftest import TestUser, TestCourse
from app.utils.orm import BaseModel, PydanticMixin


# 创建测试用的 Pydantic 模型
class TestUserModel(PydanticMixin, BaseModel):
    """测试用户 Pydantic 模型"""
    table_name = "test_users_validation"

    # 基础字段
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    age: Optional[int] = Field(None, ge=0, le=150)

    # 复杂类型字段
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    tags: Optional[List[str]] = Field(default_factory=list)

    # 时间字段
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    birth_date: Optional[date] = None

    # 数值字段
    salary: Optional[Decimal] = Field(None, decimal_places=2)
    score: Optional[float] = Field(None, ge=0.0, le=100.0)

    @validator('username')
    def validate_username(cls, v):
        """用户名验证器"""
        if not v.isalnum():
            raise ValueError('用户名只能包含字母和数字')
        return v.lower()  # 转换为小写

    @validator('tags', pre=True)
    def validate_tags(cls, v):
        """标签验证器"""
        if isinstance(v, str):
            return [tag.strip() for tag in v.split(',') if tag.strip()]
        return v


class TestDataValidation:
    """测试数据验证功能"""

    async def test_pydantic_model_creation(self, clean_tables):
        """测试 Pydantic 模型创建"""
        # 创建有效数据
        user_data = {
            "username": "testuser123",
            "email": "test@example.com",
            "age": 25,
            "metadata": {"role": "user"},
            "tags": ["python", "testing"]
        }

        user = TestUserModel(**user_data)
        await user.save()

        # 验证保存的数据
        assert user._exists is True
        assert user.username == "testuser123"  # 验证器会转换为小写
        assert user.email == "test@example.com"
        assert user.age == 25
        assert user.metadata == {"role": "user"}
        assert user.tags == ["python", "testing"]
        assert isinstance(user.created_at, datetime)

    async def test_field_validation_min_max_length(self, clean_tables):
        """测试字段长度验证"""
        # 测试用户名太短
        with pytest.raises(ValidationError) as exc_info:
            TestUserModel(username="ab", email="test@example.com")

        error = exc_info.value.errors()[0]
        assert error['type'] == 'value_error.any_str.min_length'
        assert 'min_length' in error['msg']

        # 测试用户名太长
        long_username = "a" * 51
        with pytest.raises(ValidationError) as exc_info:
            TestUserModel(username=long_username, email="test@example.com")

        error = exc_info.value.errors()[0]
        assert error['type'] == 'value_error.any_str.max_length'
        assert 'max_length' in error['msg']

    async def test_email_regex_validation(self, clean_tables):
        """测试邮箱正则表达式验证"""
        # 测试无效邮箱格式
        invalid_emails = [
            "invalid-email",
            "@example.com",
            "test@",
            "test.example.com",
            "test@.com",
            "test@example",
        ]

        for invalid_email in invalid_emails:
            with pytest.raises(ValidationError) as exc_info:
                TestUserModel(username="testuser", email=invalid_email)

            error = exc_info.value.errors()[0]
            assert error['type'] == 'value_error.str.regex'
            assert 'regex' in error['msg']

        # 测试有效邮箱格式
        valid_emails = [
            "test@example.com",
            "user.name@domain.co.uk",
            "test+tag@example.org",
            "123@example.com"
        ]

        for valid_email in valid_emails:
            user = TestUserModel(username="testuser", email=valid_email)
            assert user.email == valid_email

    async def test_numeric_range_validation(self, clean_tables):
        """测试数值范围验证"""
        # 测试年龄范围验证
        with pytest.raises(ValidationError) as exc_info:
            TestUserModel(username="testuser", email="test@example.com", age=-1)

        error = exc_info.value.errors()[0]
        assert error['type'] == 'value_error.number.not_ge'

        with pytest.raises(ValidationError) as exc_info:
            TestUserModel(username="testuser", email="test@example.com", age=151)

        error = exc_info.value.errors()[0]
        assert error['type'] == 'value_error.number.not_le'

        # 测试分数范围验证
        with pytest.raises(ValidationError) as exc_info:
            TestUserModel(username="testuser", email="test@example.com", score=-0.1)

        with pytest.raises(ValidationError) as exc_info:
            TestUserModel(username="testuser", email="test@example.com", score=100.1)

        # 测试有效范围
        user = TestUserModel(
            username="testuser",
            email="test@example.com",
            age=25,
            score=85.5
        )
        assert user.age == 25
        assert user.score == 85.5

    async def test_custom_validators(self, clean_tables):
        """测试自定义验证器"""
        # 测试用户名验证器 - 只允许字母和数字
        with pytest.raises(ValidationError) as exc_info:
            TestUserModel(username="test-user", email="test@example.com")

        error = exc_info.value.errors()[0]
        assert "只能包含字母和数字" in error['msg']

        # 测试用户名转换为小写
        user = TestUserModel(username="TESTUSER", email="test@example.com")
        assert user.username == "testuser"  # 应该被转换为小写

        # 测试标签验证器 - 字符串转换为列表
        user = TestUserModel(
            username="testuser",
            email="test@example.com",
            tags="python, django, fastapi"
        )
        assert user.tags == ["python", "django", "fastapi"]

    async def test_optional_fields(self, clean_tables):
        """测试可选字段"""
        # 最少必需字段
        user = TestUserModel(username="testuser", email="test@example.com")
        await user.save()

        assert user.age is None
        assert user.metadata == {}  # default_factory
        assert user.tags == []      # default_factory
        assert user.birth_date is None
        assert user.salary is None
        assert user.score is None
        assert isinstance(user.created_at, datetime)  # default_factory

    async def test_default_values_and_factories(self, clean_tables):
        """测试默认值和工厂"""
        user = TestUserModel(username="testuser", email="test@example.com")

        # 测试 default_factory
        assert isinstance(user.metadata, dict)
        assert isinstance(user.tags, list)
        assert isinstance(user.created_at, datetime)

        # 每次创建应该有不同的对象实例
        user2 = TestUserModel(username="testuser2", email="test2@example.com")
        assert user.metadata is not user2.metadata  # 不是同一个对象
        assert user.tags is not user2.tags

    async def test_complex_data_types(self, clean_tables):
        """测试复杂数据类型"""
        complex_data = {
            "username": "complexuser",
            "email": "complex@example.com",
            "metadata": {
                "profile": {
                    "preferences": {"theme": "dark", "language": "zh-CN"},
                    "settings": {"notifications": True}
                },
                "statistics": {"login_count": 42, "last_login": "2024-01-01"}
            },
            "tags": ["advanced", "power-user", "beta-tester"],
            "birth_date": date(1990, 5, 15),
            "salary": Decimal("75000.50")
        }

        user = TestUserModel(**complex_data)
        await user.save()

        # 验证复杂数据保存和读取
        saved_user = await TestUserModel.find_by_id(user.id)
        assert saved_user.metadata == complex_data["metadata"]
        assert saved_user.tags == complex_data["tags"]
        assert saved_user.birth_date == complex_data["birth_date"]
        assert saved_user.salary == complex_data["salary"]

    async def test_data_serialization(self, clean_tables):
        """测试数据序列化"""
        user_data = {
            "username": "serializeuser",
            "email": "serialize@example.com",
            "age": 30,
            "metadata": {"role": "admin", "permissions": ["read", "write", "delete"]},
            "tags": ["admin", "senior"],
            "birth_date": date(1993, 8, 20),
            "salary": Decimal("90000.00"),
            "score": 95.5
        }

        user = TestUserModel(**user_data)
        await user.save()

        # 测试 dict() 序列化
        user_dict = user.dict()
        assert isinstance(user_dict, dict)
        assert user_dict['username'] == "serializeuser"
        assert user_dict['metadata'] == user_data["metadata"]
        assert isinstance(user_dict['birth_date'], date)

        # 测试 dict(exclude=...) 排除字段
        user_dict_partial = user.dict(exclude={'metadata', 'salary'})
        assert 'metadata' not in user_dict_partial
        assert 'salary' not in user_dict_partial
        assert 'username' in user_dict_partial

        # 测试 dict(include=...) 包含字段
        user_dict_include = user.dict(include={'username', 'email', 'age'})
        assert len(user_dict_include) == 3
        assert 'username' in user_dict_include
        assert 'email' in user_dict_include
        assert 'age' in user_dict_include

    async def test_json_serialization(self, clean_tables):
        """测试 JSON 序列化"""
        user_data = {
            "username": "jsonuser",
            "email": "json@example.com",
            "birth_date": date(1995, 3, 10),
            "created_at": datetime(2024, 1, 1, 12, 0, 0),
            "salary": Decimal("60000.00")
        }

        user = TestUserModel(**user_data)
        await user.save()

        # 测试 json() 序列化
        user_json = user.json()
        assert isinstance(user_json, str)

        # 解析 JSON 并验证
        import json
        parsed = json.loads(user_json)
        assert parsed['username'] == "jsonuser"
        assert parsed['email'] == "json@example.com"
        assert parsed['birth_date'] == "1995-03-10"  # 日期应该序列化为字符串
        assert parsed['created_at'] == "2024-01-01T12:00:00"  # datetime 序列化为 ISO 格式
        assert parsed['salary'] == "60000.00"  # Decimal 序列化为字符串

    async def test_data_type_conversion(self, clean_tables):
        """测试数据类型转换"""
        # Pydantic 会自动进行类型转换
        user = TestUserModel(
            username="convertuser",
            email="convert@example.com",
            age="25",  # 字符串转换为整数
            score="88.5",  # 字符串转换为浮点数
            birth_date="1998-07-15",  # 字符串转换为日期
            salary="55000.75"  # 字符串转换为 Decimal
        )

        assert isinstance(user.age, int)
        assert user.age == 25
        assert isinstance(user.score, float)
        assert user.score == 88.5
        assert isinstance(user.birth_date, date)
        assert user.birth_date == date(1998, 7, 15)
        assert isinstance(user.salary, Decimal)
        assert user.salary == Decimal("55000.75")

    async def test_validation_on_update(self, clean_tables):
        """测试更新时的验证"""
        # 创建有效用户
        user = TestUserModel(username="updateuser", email="update@example.com")
        await user.save()

        # 尝试更新为无效数据
        with pytest.raises(ValidationError):
            user.email = "invalid-email"
            user.validate()  # 显式调用验证

        # 更新为有效数据
        user.email = "newemail@example.com"
        user.age = 35
        user.validate()  # 应该通过验证

        await user.save()

        # 验证更新后的数据
        updated_user = await TestUserModel.find_by_id(user.id)
        assert updated_user.email == "newemail@example.com"
        assert updated_user.age == 35

    async def test_bulk_validation(self, clean_tables):
        """测试批量数据验证"""
        valid_users_data = [
            {"username": f"bulkuser{i}", "email": f"bulk{i}@example.com", "age": 20 + i}
            for i in range(5)
        ]

        # 创建并验证多个用户
        users = []
        for user_data in valid_users_data:
            user = TestUserModel(**user_data)  # 创建时会自动验证
            users.append(user)

        # 批量保存
        for user in users:
            await user.save()

        # 验证所有用户都被保存
        count = await TestUserModel.count()
        assert count == 5

        # 验证数据正确性
        for i, user in enumerate(users):
            saved_user = await TestUserModel.find_by_id(user.id)
            assert saved_user.username == f"bulkuser{i}"
            assert saved_user.age == 20 + i

    async def test_nested_validation_errors(self, clean_tables):
        """测试嵌套验证错误"""
        with pytest.raises(ValidationError) as exc_info:
            TestUserModel(
                username="ab",  # 太短
                email="invalid-email",  # 无效格式
                age=-5,  # 超出范围
                score=105.0  # 超出范围
            )

        errors = exc_info.value.errors()

        # 应该有多个验证错误
        assert len(errors) >= 4

        # 检查错误字段
        error_fields = {error['loc'][0] for error in errors}
        expected_fields = {'username', 'email', 'age', 'score'}
        assert error_fields == expected_fields

    async def test_partial_update_validation(self, clean_tables):
        """测试部分更新验证"""
        # 创建用户
        user = TestUserModel(username="partialuser", email="partial@example.com")
        await user.save()

        # 部分更新 - 只更新一个字段
        user.age = 28
        await user.save()

        # 验证只有指定字段被更新
        updated_user = await TestUserModel.find_by_id(user.id)
        assert updated_user.username == "partialuser"
        assert updated_user.email == "partial@example.com"
        assert updated_user.age == 28

    async def test_integration_with_regular_models(self, clean_tables):
        """测试与常规模型的集成"""
        # 使用常规 TestUser 模型
        regular_user = TestUser(
            username="regularuser",
            email="regular@example.com",
            age=25
        )
        await regular_user.save()

        # 使用 Pydantic 模型
        pydantic_user = TestUserModel(
            username="pydanticuser",
            email="pydantic@example.com",
            age=30
        )
        await pydantic_user.save()

        # 验证两种模型都能正常工作
        regular_count = await TestUser.count()
        pydantic_count = await TestUserModel.count()

        assert regular_count >= 1
        assert pydantic_count >= 1

        # 验证数据访问
        regular_fetched = await TestUser.get(username="regularuser")
        pydantic_fetched = await TestUserModel.get(username="pydanticuser")

        assert regular_fetched is not None
        assert pydantic_fetched is not None
        assert regular_fetched.username == "regularuser"
        assert pydantic_fetched.username == "pydanticuser"