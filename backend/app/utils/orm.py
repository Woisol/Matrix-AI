"""
PostgreSQL ORM 框架
支持异步操作、连接池管理、查询构建器、事务管理等功能
"""

import asyncio
import asyncpg
import contextvars
from typing import Any, Dict, List, Optional, Union, Type, Callable, Tuple
from datetime import datetime, date
from decimal import Decimal
import json
import logging
from contextlib import asynccontextmanager
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum

# 设置日志
logger = logging.getLogger(__name__)


_current_tx_connection: contextvars.ContextVar[Optional[asyncpg.Connection]] = contextvars.ContextVar(
    "_current_tx_connection", default=None
)

class NoUnlistenConnection(asyncpg.Connection):
        """
        自定义 asyncpg 连接：覆盖 reset 以跳过 UNLISTEN。

        背景：部分 PostgreSQL 兼容实现（例如某些 openGauss 版本）尚不支持 LISTEN/UNLISTEN，
        而 asyncpg 在连接释放/重置时会执行 UNLISTEN * 清理监听，导致报错：
            "UNLISTEN statement is not yet supported"。

        解决：覆盖 reset() 为 no-op，避免向服务器发送 UNLISTEN，从而保证连接释放不报错。

        注意：这会跳过常规的连接状态重置（如 RESET/CLOSE/UNLISTEN 等），
        在严苛的多租户或复用场景中可能导致会话级别设置遗留。若需更严格控制，
        可根据后端能力在此实现最小重置集合，或提供开关按需启用。
        """

        async def reset(self, *, timeout: float | None = None) -> None:  # type: ignore[override]
                # 直接跳过 reset 流程以避免执行 UNLISTEN 等不被支持的语句
                return None


class FieldType(Enum):
    """字段类型枚举"""
    INT = "INTEGER"
    BIGINT = "BIGINT"
    SMALLINT = "SMALLINT"
    VARCHAR = "VARCHAR"
    TEXT = "TEXT"
    BOOLEAN = "BOOLEAN"
    TIMESTAMP = "TIMESTAMP"
    DATE = "DATE"
    DECIMAL = "DECIMAL"
    JSON = "JSON"
    UUID = "UUID"


class QueryType(Enum):
    """查询类型枚举"""
    SELECT = "SELECT"
    INSERT = "INSERT"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class ORMException(Exception):
    """ORM 异常基类"""
    pass


class ConnectionException(ORMException):
    """连接异常"""
    pass


class QueryException(ORMException):
    """查询异常"""
    pass


class ValidationException(ORMException):
    """验证异常"""
    pass


class Field:
    """字段定义类"""

    def __init__(
        self,
        field_type: FieldType,
        primary_key: bool = False,
        nullable: bool = True,
        default: Any = None,
        max_length: Optional[int] = None,
        unique: bool = False,
        index: bool = False,
        description: Optional[str] = None,
        auto_increment: bool = False
    ):
        self.field_type = field_type
        self.primary_key = primary_key
        self.nullable = nullable
        self.default = default
        self.max_length = max_length
        self.unique = unique
        self.index = index
        self.description = description
        self.auto_increment = auto_increment

    def to_sql_definition(self, column_name: str) -> str:
        """生成 SQL 字段定义"""
        # 基础类型/自增处理
        if self.auto_increment:
            # 自增字段使用 SERIAL/BIGSERIAL，替代显式整数类型
            if self.field_type == FieldType.BIGINT:
                type_sql = "BIGSERIAL"
            else:
                type_sql = "SERIAL"
        else:
            # 普通类型
            if self.field_type == FieldType.VARCHAR and self.max_length:
                type_sql = f"VARCHAR({self.max_length})"
            else:
                type_sql = self.field_type.value

        sql_parts = [column_name, type_sql]

        # 约束
        if self.primary_key:
            sql_parts.append("PRIMARY KEY")

        if not self.nullable and not self.primary_key:
            sql_parts.append("NOT NULL")

        if self.unique and not self.primary_key:
            sql_parts.append("UNIQUE")

        # 默认值（非自增字段）
        if self.default is not None and not self.auto_increment:
            default_sql = None
            if callable(self.default):
                # 常见时间默认值映射
                if self.field_type == FieldType.TIMESTAMP:
                    default_sql = "CURRENT_TIMESTAMP"
                elif self.field_type == FieldType.DATE:
                    default_sql = "CURRENT_DATE"
            else:
                if self.field_type == FieldType.JSON:
                    try:
                        default_sql = f"'{json.dumps(self.default)}'::json"
                    except Exception:
                        # 回退为文本
                        default_sql = f"'{str(self.default)}'::json"
                elif isinstance(self.default, str):
                    default_sql = f"'{self.default}'"
                elif isinstance(self.default, bool):
                    default_sql = str(self.default).upper()
                else:
                    default_sql = f"{self.default}"

            if default_sql:
                sql_parts.append(f"DEFAULT {default_sql}")

        return " ".join(sql_parts)


class ConnectionPool:
    """PostgreSQL 连接池管理器"""

    def __init__(self, dsn: str, min_size: int = 5, max_size: int = 20):
        self.dsn = dsn
        self.min_size = min_size
        self.max_size = max_size
        self._pool: Optional[asyncpg.Pool] = None
        self._closed = False
        self._stats = {
            'total_connections': 0,
            'active_connections': 0,
            'idle_connections': 0,
            'queries_executed': 0,
            'connection_errors': 0
        }

    async def initialize(self):
        """初始化连接池"""
        if self._pool is None:
            try:
                self._pool = await asyncpg.create_pool(
                    self.dsn,
                    min_size=self.min_size,
                    max_size=self.max_size,
                    command_timeout=60,
                    connection_class=NoUnlistenConnection,
                )
                logger.info(f"Connection pool initialized: min={self.min_size}, max={self.max_size}")
            except Exception as e:
                raise ConnectionException(f"Failed to create connection pool: {e}")
    async def close(self):
        """关闭连接池"""
        if self._pool and not self._closed:
            await self._pool.close()
            self._closed = True
            logger.info("Connection pool closed")

    @asynccontextmanager
    async def acquire(self):
        """获取连接"""
        if not self._pool:
            await self.initialize()
        # 在事务上下文里复用同一连接
        ctx_conn = _current_tx_connection.get()
        if ctx_conn is not None:
            yield ctx_conn
            return
        async with self._pool.acquire() as connection:
            yield connection

    async def execute(self, query: str, *args) -> str:
        """执行 SQL 命令"""
        async with self.acquire() as conn:
            return await conn.execute(query, *args)

    async def fetch(self, query: str, *args) -> List[asyncpg.Record]:
        """执行查询并返回所有结果"""
        async with self.acquire() as conn:
            return await conn.fetch(query, *args)

    async def fetchrow(self, query: str, *args) -> Optional[asyncpg.Record]:
        """执行查询并返回单行结果"""
        async with self.acquire() as conn:
            return await conn.fetchrow(query, *args)

    async def fetchval(self, query: str, *args) -> Any:
        """执行查询并返回单个值"""
        async with self.acquire() as conn:
            return await conn.fetchval(query, *args)

    def get_stats(self) -> Dict[str, Any]:
        """获取连接池统计信息"""
        if self._pool:
            self._stats.update({
                'total_connections': self._pool.get_size(),
                'active_connections': self._pool.get_size() - self._pool.get_idle_size(),
                'idle_connections': self._pool.get_idle_size(),
            })
        return self._stats.copy()

    async def health_check(self) -> bool:
        """健康检查"""
        try:
            result = await self.fetchval("SELECT 1")
            return result == 1
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            self._stats['connection_errors'] += 1
            return False


class QueryBuilder:
    """SQL 查询构建器"""

    def __init__(self, table_name: str, pool: ConnectionPool):
        self.table_name = table_name
        self.pool = pool
        self._query_type = QueryType.SELECT
        self._select_fields = ["*"]
        self._where_conditions = []
        self._joins = []
        self._order_by = []
        self._group_by = []
        self._having_conditions = []
        self._limit_value = None
        self._offset_value = None
        self._values = {}
        self._params = []

    def select(self, *fields: str) -> "QueryBuilder":
        """设置查询字段"""
        self._query_type = QueryType.SELECT
        self._select_fields = list(fields) if fields else ["*"]
        return self

    def where(self, condition: str, *params) -> "QueryBuilder":
        """添加 WHERE 条件"""
        self._where_conditions.append(condition)
        self._params.extend(params)
        return self

    def where_eq(self, field: str, value: Any) -> "QueryBuilder":
        """添加等值条件"""
        return self.where(f"{field} = ${len(self._params) + 1}", value)

    def where_in(self, field: str, values: List[Any]) -> "QueryBuilder":
        """添加 IN 条件"""
        placeholders = ",".join(f"${len(self._params) + i + 1}" for i in range(len(values)))
        self._where_conditions.append(f"{field} IN ({placeholders})")
        self._params.extend(values)
        return self

    def where_like(self, field: str, pattern: str) -> "QueryBuilder":
        """添加 LIKE 条件"""
        return self.where(f"{field} LIKE ${len(self._params) + 1}", pattern)

    def where_between(self, field: str, start: Any, end: Any) -> "QueryBuilder":
        """添加 BETWEEN 条件"""
        return self.where(f"{field} BETWEEN ${len(self._params) + 1} AND ${len(self._params) + 2}", start, end)

    def join(self, table: str, condition: str) -> "QueryBuilder":
        """添加 JOIN"""
        self._joins.append(f"JOIN {table} ON {condition}")
        return self

    def left_join(self, table: str, condition: str) -> "QueryBuilder":
        """添加 LEFT JOIN"""
        self._joins.append(f"LEFT JOIN {table} ON {condition}")
        return self

    def right_join(self, table: str, condition: str) -> "QueryBuilder":
        """添加 RIGHT JOIN"""
        self._joins.append(f"RIGHT JOIN {table} ON {condition}")
        return self

    def order_by(self, field: str, direction: str = "ASC") -> "QueryBuilder":
        """添加排序"""
        self._order_by.append(f"{field} {direction.upper()}")
        return self

    def group_by(self, *fields: str) -> "QueryBuilder":
        """添加分组"""
        self._group_by.extend(fields)
        return self

    def having(self, condition: str, *params) -> "QueryBuilder":
        """添加 HAVING 条件"""
        self._having_conditions.append(condition)
        self._params.extend(params)
        return self

    def limit(self, count: int) -> "QueryBuilder":
        """设置查询限制"""
        self._limit_value = count
        return self

    def offset(self, count: int) -> "QueryBuilder":
        """设置查询偏移"""
        self._offset_value = count
        return self

    def values(self, **kwargs) -> "QueryBuilder":
        """设置插入/更新的值"""
        self._values.update(kwargs)
        return self

    def build_select(self) -> Tuple[str, List[Any]]:
        """构建 SELECT 查询"""
        query_parts = [f"SELECT {', '.join(self._select_fields)}"]
        query_parts.append(f"FROM {self.table_name}")

        if self._joins:
            query_parts.extend(self._joins)

        if self._where_conditions:
            query_parts.append(f"WHERE {' AND '.join(self._where_conditions)}")

        if self._group_by:
            query_parts.append(f"GROUP BY {', '.join(self._group_by)}")

        if self._having_conditions:
            query_parts.append(f"HAVING {' AND '.join(self._having_conditions)}")

        if self._order_by:
            query_parts.append(f"ORDER BY {', '.join(self._order_by)}")

        if self._limit_value:
            query_parts.append(f"LIMIT {self._limit_value}")

        if self._offset_value:
            query_parts.append(f"OFFSET {self._offset_value}")

        return " ".join(query_parts), self._params

    def build_insert(self) -> Tuple[str, List[Any]]:
        """构建 INSERT 查询"""
        if not self._values:
            raise QueryException("No values provided for INSERT")

        fields = list(self._values.keys())
        placeholders = [f"${i + 1}" for i in range(len(fields))]
        values = []
        for field in fields:
            val = self._values[field]
            # 将 JSON/dict/list 序列化为 JSON 字符串，交由数据库解析为 JSON
            if isinstance(val, (dict, list)):
                values.append(json.dumps(val))
            else:
                values.append(val)

        query = f"INSERT INTO {self.table_name} ({', '.join(fields)}) VALUES ({', '.join(placeholders)}) RETURNING *"
        return query, values

    def build_update(self) -> Tuple[str, List[Any]]:
        """构建 UPDATE 查询"""
        if not self._values:
            raise QueryException("No values provided for UPDATE")

        set_clauses = []
        values = []
        param_index = 1

        for field, value in self._values.items():
            set_clauses.append(f"{field} = ${param_index}")
            # JSON 值序列化
            if isinstance(value, (dict, list)):
                values.append(json.dumps(value))
            else:
                values.append(value)
            param_index += 1

        query_parts = [f"UPDATE {self.table_name}"]
        query_parts.append(f"SET {', '.join(set_clauses)}")

        if self._where_conditions:
            # 更新参数索引
            updated_conditions = []
            for condition in self._where_conditions:
                updated_condition = condition
                for i, param in enumerate(self._params):
                    updated_condition = updated_condition.replace(f"${i + 1}", f"${param_index}")
                    param_index += 1
                updated_conditions.append(updated_condition)

            query_parts.append(f"WHERE {' AND '.join(updated_conditions)}")
            values.extend(self._params)

        query_parts.append("RETURNING *")
        return " ".join(query_parts), values

    def build_delete(self) -> Tuple[str, List[Any]]:
        """构建 DELETE 查询"""
        query_parts = [f"DELETE FROM {self.table_name}"]

        if self._where_conditions:
            query_parts.append(f"WHERE {' AND '.join(self._where_conditions)}")

        return " ".join(query_parts), self._params

    async def execute(self) -> Any:
        """执行查询"""
        try:
            if self._query_type == QueryType.SELECT:
                query, params = self.build_select()
                return await self.pool.fetch(query, *params)
            elif self._query_type == QueryType.INSERT:
                query, params = self.build_insert()
                return await self.pool.fetchrow(query, *params)
            elif self._query_type == QueryType.UPDATE:
                query, params = self.build_update()
                return await self.pool.fetch(query, *params)
            elif self._query_type == QueryType.DELETE:
                query, params = self.build_delete()
                return await self.pool.execute(query, *params)
        except Exception as e:
            logger.error(f"Query execution failed: {e}")
            raise QueryException(f"Query execution failed: {e}")

    async def first(self) -> Optional[asyncpg.Record]:
        """获取第一条记录"""
        self.limit(1)
        results = await self.execute()
        return results[0] if results else None

    async def count(self) -> int:
        """获取记录数量"""
        self._select_fields = ["COUNT(*) as count"]
        query, params = self.build_select()
        result = await self.pool.fetchval(query, *params)
        return result or 0


# 全局连接池实例
_connection_pool: Optional[ConnectionPool] = None


async def init_database(dsn: str, min_size: int = 5, max_size: int = 20):
    """初始化数据库连接池"""
    global _connection_pool
    _connection_pool = ConnectionPool(dsn, min_size, max_size)
    await _connection_pool.initialize()


async def close_database():
    """关闭数据库连接池"""
    global _connection_pool
    if _connection_pool:
        await _connection_pool.close()


def get_connection_pool() -> ConnectionPool:
    """获取连接池实例"""
    if not _connection_pool:
        raise ConnectionException("Database not initialized. Call init_database() first.")
    return _connection_pool


class RelationType(Enum):
    """关系类型枚举"""
    ONE_TO_ONE = "one_to_one"
    ONE_TO_MANY = "one_to_many"
    MANY_TO_ONE = "many_to_one"
    MANY_TO_MANY = "many_to_many"


class Relationship:
    """模型关系定义"""

    def __init__(
        self,
        related_model: str,
        relation_type: RelationType,
        foreign_key: Optional[str] = None,
        related_name: Optional[str] = None,
        through: Optional[str] = None,
        lazy: bool = True
    ):
        self.related_model = related_model
        self.foreign_key = foreign_key
        self.related_name = related_name
        self.through = through  # 用于多对多关系的中间表
        self.lazy = lazy  # 是否延迟加载


class ModelMeta(type):
    """模型元类，用于处理模型的元数据"""

    def __new__(cls, name, bases, dct):
        # 收集字段定义和关系定义
        fields = {}
        relationships = {}
        table_name = dct.get('__table_name__', name.lower() + 's')

        # 先收集键，避免遍历时修改 dct
        keys = list(dct.keys())
        for key in keys:
            value = dct[key]
            if isinstance(value, Field):
                fields[key] = value
                # 移除类属性，避免实例读取到 Field 对象
                del dct[key]
            elif isinstance(value, Relationship):
                relationships[key] = value
                # 移除类属性，避免实例读取到 Relationship 对象
                del dct[key]

        # 存储字段和关系元数据
        dct['_fields'] = fields
        dct['_relationships'] = relationships
        dct['_table_name'] = table_name

        return super().__new__(cls, name, bases, dct)


class BaseModel(metaclass=ModelMeta):
    """ORM 基础模型类"""

    _fields: Dict[str, Field] = {}
    _relationships: Dict[str, Relationship] = {}
    _table_name: str = ""

    def __init__(self, **kwargs):
        self._data = {}
        self._dirty_fields = set()
        self._exists = False
        self._related_managers = {}

        # 设置字段值
        for field_name, field_def in self._fields.items():
            if field_name in kwargs:
                self._data[field_name] = kwargs[field_name]
            elif field_def.default is not None:
                # 支持可调用默认值（例如 datetime.now）
                try:
                    self._data[field_name] = field_def.default() if callable(field_def.default) else field_def.default
                except Exception:
                    # 回退到原始默认值
                    self._data[field_name] = field_def.default
            else:
                self._data[field_name] = None

    def __getattr__(self, name: str) -> Any:
        if name in self._fields:
            return self._data.get(name)
        elif name in self._relationships:
            # 返回关系管理器
            if name not in self._related_managers:
                relationship = self._relationships[name]
                self._related_managers[name] = RelatedManager(self, relationship, name)
            return self._related_managers[name]
        raise AttributeError(f"'{self.__class__.__name__}' has no attribute '{name}'")

    def __setattr__(self, name: str, value: Any) -> None:
        if name.startswith('_') or name not in self._fields:
            super().__setattr__(name, value)
        else:
            if hasattr(self, '_data') and self._data.get(name) != value:
                self._dirty_fields.add(name)
            if hasattr(self, '_data'):
                self._data[name] = value
            else:
                super().__setattr__(name, value)

    @classmethod
    def get_table_name(cls) -> str:
        """获取表名"""
        return cls._table_name

    @classmethod
    def get_fields(cls) -> Dict[str, Field]:
        """获取字段定义"""
        return cls._fields

    @classmethod
    def get_primary_key_field(cls) -> Optional[str]:
        """获取主键字段名"""
        for field_name, field_def in cls._fields.items():
            if field_def.primary_key:
                return field_name
        return None

    @classmethod
    async def create_table(cls) -> None:
        """创建数据表"""
        pool = get_connection_pool()

        field_definitions = []
        for field_name, field_def in cls._fields.items():
            field_definitions.append(field_def.to_sql_definition(field_name))

        # 添加索引
        indexes = []
        for field_name, field_def in cls._fields.items():
            if field_def.index and not field_def.primary_key:
                indexes.append(f"CREATE INDEX IF NOT EXISTS idx_{cls._table_name}_{field_name} ON {cls._table_name} ({field_name});")

        create_sql = f"""
        CREATE TABLE IF NOT EXISTS {cls._table_name} (
            {', '.join(field_definitions)}
        );
        """

        try:
            await pool.execute(create_sql)
            logger.info(f"Table {cls._table_name} created successfully")

            # 创建索引
            for index_sql in indexes:
                await pool.execute(index_sql)
        except Exception as e:
            raise QueryException(f"Failed to create table {cls._table_name}: {e}")

    @classmethod
    async def drop_table(cls) -> None:
        """删除数据表"""
        pool = get_connection_pool()
        await pool.execute(f"DROP TABLE IF EXISTS {cls._table_name}")
        logger.info(f"Table {cls._table_name} dropped")

    @classmethod
    def query(cls) -> QueryBuilder:
        """创建查询构建器"""
        pool = get_connection_pool()
        return QueryBuilder(cls._table_name, pool)

    @classmethod
    async def all(cls) -> List["BaseModel"]:
        """获取所有记录"""
        records = await cls.query().execute()
        return [cls._from_record(record) for record in records]

    @classmethod
    async def get(cls, **kwargs) -> Optional["BaseModel"]:
        """根据条件获取单个记录"""
        query = cls.query()
        for field, value in kwargs.items():
            query = query.where_eq(field, value)

        record = await query.first()
        return cls._from_record(record) if record else None

    @classmethod
    async def filter(cls, **kwargs) -> List["BaseModel"]:
        """根据条件过滤记录"""
        query = cls.query()
        for field, value in kwargs.items():
            query = query.where_eq(field, value)

        records = await query.execute()
        return [cls._from_record(record) for record in records]

    @classmethod
    async def find_by_id(cls, id_value: Any) -> Optional["BaseModel"]:
        """根据主键查找记录"""
        pk_field = cls.get_primary_key_field()
        if not pk_field:
            raise QueryException(f"No primary key defined for {cls.__name__}")

        return await cls.get(**{pk_field: id_value})

    @classmethod
    async def exists(cls, **kwargs) -> bool:
        """检查记录是否存在"""
        query = cls.query()
        for field, value in kwargs.items():
            query = query.where_eq(field, value)

        count = await query.count()
        return count > 0

    @classmethod
    async def count(cls, **kwargs) -> int:
        """统计记录数量"""
        query = cls.query()
        for field, value in kwargs.items():
            query = query.where_eq(field, value)

        return await query.count()

    @classmethod
    async def delete_where(cls, condition: str, *params) -> int:
        """按条件删除记录，返回删除行数"""
        qb = cls.query()
        qb._query_type = QueryType.DELETE
        qb.where(condition, *params)
        result = await qb.execute()
        # asyncpg execute 返回形如 'DELETE <count>'
        try:
            parts = str(result).split()
            return int(parts[-1]) if parts else 0
        except Exception:
            return 0

    @classmethod
    def _from_record(cls, record: asyncpg.Record) -> "BaseModel":
        """从数据库记录创建模型实例"""
        if not record:
            return None

        instance = cls()
        row = dict(record)
        # 将 JSON 字段从字符串解码为 Python 对象
        for fname, fdef in cls._fields.items():
            if fdef.field_type == FieldType.JSON and fname in row and isinstance(row[fname], str):
                try:
                    row[fname] = json.loads(row[fname])
                except Exception:
                    # 保留原值
                    pass
        instance._data = row
        instance._exists = True
        instance._dirty_fields.clear()
        return instance

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return self._data.copy()

    def get_primary_key_value(self) -> Any:
        """获取主键值"""
        pk_field = self.get_primary_key_field()
        if pk_field:
            return self._data.get(pk_field)
        return None

    async def save(self) -> "BaseModel":
        """保存模型实例"""
        pool = get_connection_pool()

        if self._exists:
            # 更新现有记录
            if not self._dirty_fields:
                return self  # 没有修改，直接返回

            pk_field = self.get_primary_key_field()
            if not pk_field:
                raise QueryException(f"No primary key defined for {self.__class__.__name__}")

            pk_value = self._data[pk_field]
            if pk_value is None:
                raise QueryException("Primary key value is None")

            # 只更新脏字段
            update_data = {field: self._data[field] for field in self._dirty_fields}

            query = QueryBuilder(self._table_name, pool)
            query._query_type = QueryType.UPDATE
            query = query.values(**update_data).where_eq(pk_field, pk_value)

            records = await query.execute()
            if records:
                self._data = dict(records[0])
                self._dirty_fields.clear()
        else:
            # 插入新记录
            query = QueryBuilder(self._table_name, pool)
            query._query_type = QueryType.INSERT

            # 过滤空值和自增字段
            insert_data = {}
            for field_name, value in self._data.items():
                field_def = self._fields.get(field_name)
                if field_def and field_def.auto_increment:
                    continue
                if value is not None:
                    insert_data[field_name] = value
                else:
                    # 若值为空且存在可调用默认值，使用默认值
                    if field_def and field_def.default is not None and callable(field_def.default):
                        try:
                            insert_data[field_name] = field_def.default()
                        except Exception:
                            pass

            query = query.values(**insert_data)
            record = await query.execute()

            if record:
                self._data = dict(record)
                self._exists = True
                self._dirty_fields.clear()

        return self

    async def delete(self) -> bool:
        """删除模型实例"""
        if not self._exists:
            return False

        pk_field = self.get_primary_key_field()
        if not pk_field:
            raise QueryException(f"No primary key defined for {self.__class__.__name__}")

        pk_value = self._data[pk_field]
        if pk_value is None:
            return False

        pool = get_connection_pool()
        query = QueryBuilder(self._table_name, pool)
        query._query_type = QueryType.DELETE
        query = query.where_eq(pk_field, pk_value)

        result = await query.execute()
        if result:
            self._exists = False
            return True
        return False

    async def reload(self) -> "BaseModel":
        """重新加载模型数据"""
        pk_field = self.get_primary_key_field()
        if not pk_field:
            raise QueryException(f"No primary key defined for {self.__class__.__name__}")

        pk_value = self._data[pk_field]
        if pk_value is None:
            raise QueryException("Primary key value is None")

        fresh_instance = await self.__class__.find_by_id(pk_value)
        if fresh_instance:
            self._data = fresh_instance._data
            self._dirty_fields.clear()

        return self

    def __repr__(self) -> str:
        pk_field = self.get_primary_key_field()
        pk_value = self._data.get(pk_field) if pk_field else "None"
        return f"{self.__class__.__name__}(id={pk_value})"

    def __str__(self) -> str:
        return self.__repr__()


class Transaction:
    """事务管理器"""

    def __init__(self, connection):
        self.connection = connection
        self._transaction = None
        self._savepoints = []

    async def __aenter__(self):
        """进入事务上下文"""
        if self._transaction is None:
            self._transaction = self.connection.transaction()
            await self._transaction.start()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """退出事务上下文"""
        if self._transaction:
            try:
                if exc_type is None:
                    await self._transaction.commit()
                else:
                    await self._transaction.rollback()
            finally:
                self._transaction = None
                self._savepoints.clear()

    async def commit(self):
        """提交事务"""
        if self._transaction:
            await self._transaction.commit()
            self._transaction = None
            self._savepoints.clear()

    async def rollback(self):
        """回滚事务"""
        if self._transaction:
            await self._transaction.rollback()
            self._transaction = None
            self._savepoints.clear()

    async def savepoint(self, name: str = None) -> str:
        """创建保存点"""
        if not self._transaction:
            raise QueryException("No active transaction")

        if name is None:
            name = f"sp_{len(self._savepoints) + 1}"

        await self.connection.execute(f"SAVEPOINT {name}")
        self._savepoints.append(name)
        return name

    async def rollback_to_savepoint(self, name: str):
        """回滚到保存点"""
        if not self._transaction:
            raise QueryException("No active transaction")

        if name not in self._savepoints:
            raise QueryException(f"Savepoint {name} not found")

        await self.connection.execute(f"ROLLBACK TO SAVEPOINT {name}")

        # 移除此保存点之后的所有保存点
        try:
            index = self._savepoints.index(name)
            self._savepoints = self._savepoints[:index + 1]
        except ValueError:
            pass

    async def release_savepoint(self, name: str):
        """释放保存点"""
        if not self._transaction:
            raise QueryException("No active transaction")

        if name not in self._savepoints:
            raise QueryException(f"Savepoint {name} not found")

        await self.connection.execute(f"RELEASE SAVEPOINT {name}")
        self._savepoints.remove(name)


@asynccontextmanager
async def transaction():
    """事务上下文管理器"""
    pool = get_connection_pool()
    async with pool.acquire() as conn:
        token = _current_tx_connection.set(conn)
        try:
            async with Transaction(conn) as tx:
                yield tx
        finally:
            _current_tx_connection.reset(token)


class BatchOperation:
    """批量操作器"""

    def __init__(self, model_class: Type[BaseModel], batch_size: int = 1000):
        self.model_class = model_class
        self.batch_size = batch_size
        self.pool = get_connection_pool()
        self._insert_data = []
        self._update_data = []
        self._delete_ids = []

    def add_insert(self, **data):
        """添加插入数据"""
        self._insert_data.append(data)

    def add_update(self, id_value: Any, **data):
        """添加更新数据"""
        pk_field = self.model_class.get_primary_key_field()
        if not pk_field:
            raise QueryException(f"No primary key defined for {self.model_class.__name__}")

        update_item = data.copy()
        update_item[pk_field] = id_value
        self._update_data.append(update_item)

    def add_delete(self, id_value: Any):
        """添加删除ID"""
        self._delete_ids.append(id_value)

    async def execute_inserts(self) -> List[BaseModel]:
        """执行批量插入"""
        if not self._insert_data:
            return []

        results = []
        table_name = self.model_class.get_table_name()

        for i in range(0, len(self._insert_data), self.batch_size):
            batch = self._insert_data[i:i + self.batch_size]

            if not batch:
                continue

            # 构建批量插入SQL
            fields = list(batch[0].keys())
            values_placeholders = []
            all_values = []

            for j, item in enumerate(batch):
                row_placeholders = []
                for field in fields:
                    param_index = len(all_values) + 1
                    row_placeholders.append(f"${param_index}")
                    # 将字典/列表等 JSON 结构序列化为字符串，交由数据库 JSON 类型解析
                    val = item.get(field)
                    if isinstance(val, (dict, list)):
                        all_values.append(json.dumps(val))
                    else:
                        all_values.append(val)
                values_placeholders.append(f"({', '.join(row_placeholders)})")

            query = f"""
            INSERT INTO {table_name} ({', '.join(fields)})
            VALUES {', '.join(values_placeholders)}
            RETURNING *
            """

            records = await self.pool.fetch(query, *all_values)
            batch_results = [self.model_class._from_record(record) for record in records]
            results.extend(batch_results)

        self._insert_data.clear()
        return results

    async def execute_updates(self) -> List[BaseModel]:
        """执行批量更新"""
        if not self._update_data:
            return []

        results = []
        pk_field = self.model_class.get_primary_key_field()
        table_name = self.model_class.get_table_name()

        for update_item in self._update_data:
            pk_value = update_item.pop(pk_field)

            if not update_item:
                continue

            query = QueryBuilder(table_name, self.pool)
            query._query_type = QueryType.UPDATE
            query = query.values(**update_item).where_eq(pk_field, pk_value)

            records = await query.execute()
            if records:
                results.extend([self.model_class._from_record(record) for record in records])

        self._update_data.clear()
        return results

    async def execute_deletes(self) -> int:
        """执行批量删除"""
        if not self._delete_ids:
            return 0

        pk_field = self.model_class.get_primary_key_field()
        table_name = self.model_class.get_table_name()

        total_deleted = 0

        for i in range(0, len(self._delete_ids), self.batch_size):
            batch = self._delete_ids[i:i + self.batch_size]

            query = QueryBuilder(table_name, self.pool)
            query._query_type = QueryType.DELETE
            query = query.where_in(pk_field, batch)

            result = await query.execute()
            # PostgreSQL DELETE 返回删除的行数
            if result:
                deleted_count = int(result.split()[-1]) if result.split() else 0
                total_deleted += deleted_count

        self._delete_ids.clear()
        return total_deleted

    async def execute_all(self) -> Dict[str, Any]:
        """执行所有批量操作"""
        async with transaction() as tx:
            inserted = await self.execute_inserts()
            updated = await self.execute_updates()
            deleted_count = await self.execute_deletes()

            return {
                'inserted': inserted,
                'updated': updated,
                'deleted_count': deleted_count
            }





class RelatedManager:
    """关系管理器"""

    def __init__(self, parent_instance: BaseModel, relationship: Relationship, field_name: str):
        self.parent_instance = parent_instance
        self.relationship = relationship
        self.field_name = field_name
        self._related_model_class = None

    def get_related_model_class(self) -> Type[BaseModel]:
        """获取关联模型类"""
        if self._related_model_class is None:
            # 这里应该从全局注册表中获取模型类
            # 简化实现，假设可以通过名称找到类
            import sys
            current_module = sys.modules[__name__]
            self._related_model_class = getattr(current_module, self.relationship.related_model, None)

            if self._related_model_class is None:
                raise QueryException(f"Related model {self.relationship.related_model} not found")

        return self._related_model_class

    async def all(self) -> List[BaseModel]:
        """获取所有关联对象"""
        related_model = self.get_related_model_class()
        parent_pk = self.parent_instance.get_primary_key_value()

        if self.relationship.relation_type == RelationType.ONE_TO_MANY:
            # 一对多：通过外键查找
            fk_field = self.relationship.foreign_key
            return await related_model.filter(**{fk_field: parent_pk})

        elif self.relationship.relation_type == RelationType.MANY_TO_ONE:
            # 多对一：查找单个对象
            fk_value = getattr(self.parent_instance, self.relationship.foreign_key)
            if fk_value:
                result = await related_model.find_by_id(fk_value)
                return [result] if result else []
            return []

        elif self.relationship.relation_type == RelationType.MANY_TO_MANY:
            # 多对多：通过中间表查找
            if not self.relationship.through:
                raise QueryException("Many-to-many relationship requires through table")

            pool = get_connection_pool()
            parent_table = self.parent_instance.get_table_name()
            related_table = related_model.get_table_name()
            through_table = self.relationship.through

            # 构建复杂查询
            query = f"""
            SELECT r.* FROM {related_table} r
            JOIN {through_table} t ON r.id = t.{related_table[:-1]}_id
            WHERE t.{parent_table[:-1]}_id = $1
            """

            records = await pool.fetch(query, parent_pk)
            return [related_model._from_record(record) for record in records]

        return []

    async def add(self, *objects: BaseModel):
        """添加关联对象"""
        if self.relationship.relation_type == RelationType.ONE_TO_MANY:
            # 一对多：设置外键
            parent_pk = self.parent_instance.get_primary_key_value()
            fk_field = self.relationship.foreign_key

            for obj in objects:
                setattr(obj, fk_field, parent_pk)
                await obj.save()

        elif self.relationship.relation_type == RelationType.MANY_TO_MANY:
            # 多对多：插入中间表记录
            if not self.relationship.through:
                raise QueryException("Many-to-many relationship requires through table")

            pool = get_connection_pool()
            parent_pk = self.parent_instance.get_primary_key_value()
            parent_table = self.parent_instance.get_table_name()
            related_model = self.get_related_model_class()
            related_table = related_model.get_table_name()
            through_table = self.relationship.through

            for obj in objects:
                related_pk = obj.get_primary_key_value()
                if related_pk:
                    # 检查关系是否已存在
                    exists = await pool.fetchval(
                        f"SELECT 1 FROM {through_table} WHERE {parent_table[:-1]}_id = $1 AND {related_table[:-1]}_id = $2",
                        parent_pk, related_pk
                    )

                    if not exists:
                        await pool.execute(
                            f"INSERT INTO {through_table} ({parent_table[:-1]}_id, {related_table[:-1]}_id) VALUES ($1, $2)",
                            parent_pk, related_pk
                        )

    async def remove(self, *objects: BaseModel):
        """移除关联对象"""
        if self.relationship.relation_type == RelationType.ONE_TO_MANY:
            # 一对多：清除外键或删除对象
            fk_field = self.relationship.foreign_key

            for obj in objects:
                setattr(obj, fk_field, None)
                await obj.save()

        elif self.relationship.relation_type == RelationType.MANY_TO_MANY:
            # 多对多：删除中间表记录
            if not self.relationship.through:
                raise QueryException("Many-to-many relationship requires through table")

            pool = get_connection_pool()
            parent_pk = self.parent_instance.get_primary_key_value()
            parent_table = self.parent_instance.get_table_name()
            related_model = self.get_related_model_class()
            related_table = related_model.get_table_name()
            through_table = self.relationship.through

            for obj in objects:
                related_pk = obj.get_primary_key_value()
                if related_pk:
                    await pool.execute(
                        f"DELETE FROM {through_table} WHERE {parent_table[:-1]}_id = $1 AND {related_table[:-1]}_id = $2",
                        parent_pk, related_pk
                    )

    async def clear(self):
        """清除所有关联对象"""
        if self.relationship.relation_type == RelationType.ONE_TO_MANY:
            # 一对多：清除所有外键
            related_objects = await self.all()
            await self.remove(*related_objects)

        elif self.relationship.relation_type == RelationType.MANY_TO_MANY:
            # 多对多：删除所有中间表记录
            if not self.relationship.through:
                raise QueryException("Many-to-many relationship requires through table")

            pool = get_connection_pool()
            parent_pk = self.parent_instance.get_primary_key_value()
            parent_table = self.parent_instance.get_table_name()
            through_table = self.relationship.through

            await pool.execute(
                f"DELETE FROM {through_table} WHERE {parent_table[:-1]}_id = $1",
                parent_pk
            )

    async def count(self) -> int:
        """统计关联对象数量"""
        if self.relationship.relation_type == RelationType.MANY_TO_MANY:
            if not self.relationship.through:
                raise QueryException("Many-to-many relationship requires through table")

            pool = get_connection_pool()
            parent_pk = self.parent_instance.get_primary_key_value()
            parent_table = self.parent_instance.get_table_name()
            through_table = self.relationship.through

            return await pool.fetchval(
                f"SELECT COUNT(*) FROM {through_table} WHERE {parent_table[:-1]}_id = $1",
                parent_pk
            ) or 0
        else:
            objects = await self.all()
            return len(objects)


class PydanticMixin:
    """Pydantic 集成混入类"""

    @classmethod
    def create_pydantic_model(cls, name: Optional[str] = None) -> Type[BaseModel]:
        """创建对应的 Pydantic 模型"""
        if name is None:
            name = f"{cls.__name__}Schema"

        # 字段类型映射
        type_mapping = {
            FieldType.INT: int,
            FieldType.BIGINT: int,
            FieldType.SMALLINT: int,
            FieldType.VARCHAR: str,
            FieldType.TEXT: str,
            FieldType.BOOLEAN: bool,
            FieldType.TIMESTAMP: datetime,
            FieldType.DATE: date,
            FieldType.DECIMAL: Decimal,
            FieldType.JSON: dict,
            FieldType.UUID: str,
        }

        # 构建字段定义
        field_definitions = {}
        for field_name, field_def in cls._fields.items():
            python_type = type_mapping.get(field_def.field_type, str)

            if field_def.nullable:
                python_type = Optional[python_type]

            # 设置默认值
            if field_def.default is not None:
                field_definitions[field_name] = (python_type, field_def.default)
            elif field_def.nullable:
                field_definitions[field_name] = (python_type, None)
            else:
                field_definitions[field_name] = python_type

        # 创建 Pydantic 模型
        return type(name, (BaseModel,), {
            '__annotations__': field_definitions,
            'model_config': ConfigDict(from_attributes=True)
        })

    def to_pydantic(self) -> BaseModel:
        """转换为 Pydantic 模型实例"""
        pydantic_model = self.create_pydantic_model()
        return pydantic_model(**self._data)

    @classmethod
    def from_pydantic(cls, pydantic_instance: BaseModel) -> "BaseModel":
        """从 Pydantic 模型实例创建 ORM 实例"""
        return cls(**pydantic_instance.model_dump())

    def validate_data(self) -> Dict[str, Any]:
        """验证模型数据"""
        pydantic_model = self.create_pydantic_model()
        try:
            validated = pydantic_model(**self._data)
            return validated.model_dump()
        except Exception as e:
            raise ValidationException(f"Data validation failed: {e}")


# 便捷函数和装饰器
def foreign_key(related_model: str, on_delete: str = "CASCADE") -> Field:
    """创建外键字段"""
    return Field(
        field_type=FieldType.INT,
        description=f"Foreign key to {related_model}",
        index=True
    )


def one_to_many(related_model: str, foreign_key: str, related_name: Optional[str] = None) -> Relationship:
    """创建一对多关系"""
    return Relationship(
        related_model=related_model,
        relation_type=RelationType.ONE_TO_MANY,
        foreign_key=foreign_key,
        related_name=related_name
    )


def many_to_one(related_model: str, foreign_key: str, related_name: Optional[str] = None) -> Relationship:
    """创建多对一关系"""
    return Relationship(
        related_model=related_model,
        relation_type=RelationType.MANY_TO_ONE,
        foreign_key=foreign_key,
        related_name=related_name
    )


def many_to_many(related_model: str, through: str, related_name: Optional[str] = None) -> Relationship:
    """创建多对多关系"""
    return Relationship(
        related_model=related_model,
        relation_type=RelationType.MANY_TO_MANY,
        through=through,
        related_name=related_name
    )


def one_to_one(related_model: str, foreign_key: str, related_name: Optional[str] = None) -> Relationship:
    """创建一对一关系"""
    return Relationship(
        related_model=related_model,
        relation_type=RelationType.ONE_TO_ONE,
        foreign_key=foreign_key,
        related_name=related_name
    )


# 将 PydanticMixin 功能集成到现有的 BaseModel 中
# 通过动态添加方法来避免重复定义
for method_name in dir(PydanticMixin):
    if not method_name.startswith('_'):
        method = getattr(PydanticMixin, method_name)
        if callable(method):
            setattr(BaseModel, method_name, method)


# 数据库迁移工具
class Migration:
    """数据库迁移工具"""

    def __init__(self, pool: ConnectionPool):
        self.pool = pool

    async def create_migration_table(self):
        """创建迁移记录表"""
        await self.pool.execute("""
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                migration_name VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

    async def is_migration_applied(self, migration_name: str) -> bool:
        """检查迁移是否已应用"""
        result = await self.pool.fetchval(
            "SELECT 1 FROM migrations WHERE migration_name = $1",
            migration_name
        )
        return result is not None

    async def apply_migration(self, migration_name: str, sql: str):
        """应用迁移"""
        if await self.is_migration_applied(migration_name):
            logger.info(f"Migration {migration_name} already applied")
            return

        async with transaction() as tx:
            await self.pool.execute(sql)
            await self.pool.execute(
                "INSERT INTO migrations (migration_name) VALUES ($1)",
                migration_name
            )
            logger.info(f"Applied migration: {migration_name}")

    async def get_applied_migrations(self) -> List[str]:
        """获取已应用的迁移列表"""
        records = await self.pool.fetch(
            "SELECT migration_name FROM migrations ORDER BY applied_at"
        )
        return [record['migration_name'] for record in records]


# 查询优化工具
class QueryOptimizer:
    """查询优化器"""

    @staticmethod
    def explain_query(query: str, params: List[Any] = None) -> str:
        """分析查询执行计划"""
        return f"EXPLAIN ANALYZE {query}"

    @staticmethod
    def suggest_indexes(model_class: Type[BaseModel]) -> List[str]:
        """建议索引"""
        suggestions = []
        table_name = model_class.get_table_name()

        for field_name, field_def in model_class.get_fields().items():
            if field_def.index and not field_def.primary_key:
                suggestions.append(f"CREATE INDEX idx_{table_name}_{field_name} ON {table_name} ({field_name});")

        return suggestions


# 数据库工具函数
async def execute_raw_sql(query: str, *params) -> Any:
    """执行原始 SQL"""
    pool = get_connection_pool()
    return await pool.fetch(query, *params)


async def get_database_info() -> Dict[str, Any]:
    """获取数据库信息"""
    pool = get_connection_pool()

    version = await pool.fetchval("SELECT version()")
    total_connections = await pool.fetchval("SELECT count(*) FROM pg_stat_activity")

    return {
        'version': version,
        'total_connections': total_connections,
        'pool_stats': pool.get_stats()
    }
