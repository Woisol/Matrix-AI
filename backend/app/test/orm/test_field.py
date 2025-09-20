"""
测试 Field 类和字段类型定义
"""

import pytest
from app.utils.orm import Field, FieldType


class TestField:
    """测试 Field 类"""
    
    def test_field_basic_creation(self):
        """测试基础字段创建"""
        field = Field(FieldType.VARCHAR, max_length=50)
        
        assert field.field_type == FieldType.VARCHAR
        assert field.max_length == 50
        assert field.nullable is True  # 默认值
        assert field.primary_key is False  # 默认值
        assert field.unique is False  # 默认值
        assert field.index is False  # 默认值
        assert field.default is None  # 默认值
        assert field.auto_increment is False  # 默认值
    
    def test_field_primary_key(self):
        """测试主键字段"""
        field = Field(
            FieldType.INT,
            primary_key=True,
            auto_increment=True
        )
        
        assert field.primary_key is True
        assert field.auto_increment is True
        assert field.field_type == FieldType.INT
    
    def test_field_with_constraints(self):
        """测试带约束的字段"""
        field = Field(
            FieldType.VARCHAR,
            max_length=100,
            nullable=False,
            unique=True,
            index=True,
            default="default_value",
            description="测试字段"
        )
        
        assert field.max_length == 100
        assert field.nullable is False
        assert field.unique is True
        assert field.index is True
        assert field.default == "default_value"
        assert field.description == "测试字段"
    
    def test_field_type_enum_values(self):
        """测试字段类型枚举值"""
        assert FieldType.INT.value == "INTEGER"
        assert FieldType.BIGINT.value == "BIGINT"
        assert FieldType.SMALLINT.value == "SMALLINT"
        assert FieldType.VARCHAR.value == "VARCHAR"
        assert FieldType.TEXT.value == "TEXT"
        assert FieldType.BOOLEAN.value == "BOOLEAN"
        assert FieldType.TIMESTAMP.value == "TIMESTAMP"
        assert FieldType.DATE.value == "DATE"
        assert FieldType.DECIMAL.value == "DECIMAL"
        assert FieldType.JSON.value == "JSON"
        assert FieldType.UUID.value == "UUID"
    
    def test_field_sql_definition_varchar(self):
        """测试 VARCHAR 字段的 SQL 定义"""
        field = Field(FieldType.VARCHAR, max_length=100, nullable=False)
        sql_def = field.to_sql_definition("username")
        
        assert "username" in sql_def
        assert "VARCHAR(100)" in sql_def
        assert "NOT NULL" in sql_def
    
    def test_field_sql_definition_primary_key(self):
        """测试主键字段的 SQL 定义"""
        field = Field(
            FieldType.INT,
            primary_key=True,
            auto_increment=True
        )
        sql_def = field.to_sql_definition("id")
        
        assert "id" in sql_def
        assert "PRIMARY KEY" in sql_def
        assert "SERIAL" in sql_def or "INTEGER" in sql_def
    
    def test_field_sql_definition_with_default(self):
        """测试带默认值字段的 SQL 定义"""
        # 字符串默认值
        str_field = Field(FieldType.VARCHAR, max_length=50, default="default")
        str_sql = str_field.to_sql_definition("status")
        assert "DEFAULT 'default'" in str_sql
        
        # 布尔默认值
        bool_field = Field(FieldType.BOOLEAN, default=True)
        bool_sql = bool_field.to_sql_definition("is_active")
        assert "DEFAULT TRUE" in bool_sql
        
        # 数字默认值
        int_field = Field(FieldType.INT, default=0)
        int_sql = int_field.to_sql_definition("count")
        assert "DEFAULT 0" in int_sql
    
    def test_field_sql_definition_unique(self):
        """测试唯一约束字段的 SQL 定义"""
        field = Field(
            FieldType.VARCHAR,
            max_length=100,
            unique=True,
            nullable=False
        )
        sql_def = field.to_sql_definition("email")
        
        assert "UNIQUE" in sql_def
        assert "NOT NULL" in sql_def
    
    def test_field_sql_definition_nullable(self):
        """测试可空字段的 SQL 定义"""
        # 可空字段（默认）
        nullable_field = Field(FieldType.INT, nullable=True)
        nullable_sql = nullable_field.to_sql_definition("age")
        assert "NOT NULL" not in nullable_sql
        
        # 非空字段
        not_null_field = Field(FieldType.INT, nullable=False)
        not_null_sql = not_null_field.to_sql_definition("required_field")
        assert "NOT NULL" in not_null_sql
    
    def test_field_sql_definition_text_type(self):
        """测试 TEXT 类型字段的 SQL 定义"""
        field = Field(FieldType.TEXT, nullable=True)
        sql_def = field.to_sql_definition("description")
        
        assert "description TEXT" in sql_def
        assert "NOT NULL" not in sql_def
    
    def test_field_sql_definition_boolean_type(self):
        """测试 BOOLEAN 类型字段的 SQL 定义"""
        field = Field(FieldType.BOOLEAN, default=False)
        sql_def = field.to_sql_definition("is_published")
        
        assert "is_published BOOLEAN" in sql_def
        assert "DEFAULT FALSE" in sql_def
    
    def test_field_sql_definition_timestamp_type(self):
        """测试 TIMESTAMP 类型字段的 SQL 定义"""
        field = Field(FieldType.TIMESTAMP, nullable=False)
        sql_def = field.to_sql_definition("created_at")
        
        assert "created_at TIMESTAMP" in sql_def
        assert "NOT NULL" in sql_def
    
    def test_field_sql_definition_decimal_type(self):
        """测试 DECIMAL 类型字段的 SQL 定义"""
        field = Field(FieldType.DECIMAL, nullable=True)
        sql_def = field.to_sql_definition("price")
        
        assert "price DECIMAL" in sql_def
    
    def test_field_sql_definition_json_type(self):
        """测试 JSON 类型字段的 SQL 定义"""
        field = Field(FieldType.JSON, default={})
        sql_def = field.to_sql_definition("metadata")
        
        assert "metadata JSON" in sql_def
    
    def test_field_sql_definition_bigint_auto_increment(self):
        """测试 BIGINT 自增字段的 SQL 定义"""
        field = Field(
            FieldType.BIGINT,
            primary_key=True,
            auto_increment=True
        )
        sql_def = field.to_sql_definition("big_id")
        
        assert "big_id" in sql_def
        assert "PRIMARY KEY" in sql_def
        assert "BIGSERIAL" in sql_def or "BIGINT" in sql_def
    
    def test_field_sql_definition_uuid_type(self):
        """测试 UUID 类型字段的 SQL 定义"""
        field = Field(FieldType.UUID, unique=True)
        sql_def = field.to_sql_definition("uuid_field")
        
        assert "uuid_field UUID" in sql_def
        assert "UNIQUE" in sql_def
    
    def test_field_complex_definition(self):
        """测试复杂字段定义"""
        field = Field(
            FieldType.VARCHAR,
            max_length=255,
            nullable=False,
            unique=True,
            index=True,
            default="complex",
            description="复杂字段示例"
        )
        
        sql_def = field.to_sql_definition("complex_field")
        
        assert "complex_field VARCHAR(255)" in sql_def
        assert "NOT NULL" in sql_def
        assert "UNIQUE" in sql_def
        assert "DEFAULT 'complex'" in sql_def
    
    def test_field_without_max_length(self):
        """测试不需要长度限制的字段类型"""
        # TEXT 类型不需要长度
        text_field = Field(FieldType.TEXT)
        text_sql = text_field.to_sql_definition("content")
        assert "TEXT" in text_sql
        assert "(" not in text_sql  # 不应该有长度限制
        
        # INT 类型不需要长度
        int_field = Field(FieldType.INT)
        int_sql = int_field.to_sql_definition("number")
        assert "INTEGER" in int_sql
        assert "(" not in int_sql
    
    def test_field_default_values_types(self):
        """测试不同类型的默认值"""
        # None 默认值
        none_field = Field(FieldType.VARCHAR, default=None)
        assert none_field.default is None
        
        # 空字符串默认值
        empty_field = Field(FieldType.VARCHAR, default="")
        assert empty_field.default == ""
        
        # 数字默认值
        number_field = Field(FieldType.INT, default=42)
        assert number_field.default == 42
        
        # 布尔默认值
        bool_field = Field(FieldType.BOOLEAN, default=True)
        assert bool_field.default is True
        
        # 复杂对象默认值
        dict_field = Field(FieldType.JSON, default={"key": "value"})
        assert dict_field.default == {"key": "value"}
    
    def test_field_index_property(self):
        """测试字段索引属性"""
        # 普通索引
        indexed_field = Field(FieldType.VARCHAR, index=True, max_length=100)
        assert indexed_field.index is True
        
        # 主键字段不需要额外索引标记
        pk_field = Field(FieldType.INT, primary_key=True)
        assert pk_field.primary_key is True
        
        # 唯一字段通常也有索引
        unique_field = Field(FieldType.VARCHAR, unique=True, max_length=100)
        assert unique_field.unique is True
    
    def test_field_description_property(self):
        """测试字段描述属性"""
        field = Field(
            FieldType.VARCHAR,
            max_length=200,
            description="用户名字段，用于登录认证"
        )
        
        assert field.description == "用户名字段，用于登录认证"
    
    def test_field_combination_constraints(self):
        """测试字段约束组合"""
        # 主键 + 自增
        pk_field = Field(FieldType.INT, primary_key=True, auto_increment=True)
        assert pk_field.primary_key is True
        assert pk_field.auto_increment is True
        
        # 唯一 + 非空 + 索引
        unique_field = Field(
            FieldType.VARCHAR,
            max_length=100,
            unique=True,
            nullable=False,
            index=True
        )
        assert unique_field.unique is True
        assert unique_field.nullable is False
        assert unique_field.index is True
        
        # 默认值 + 非空
        default_field = Field(
            FieldType.BOOLEAN,
            default=True,
            nullable=False
        )
        assert default_field.default is True
        assert default_field.nullable is False