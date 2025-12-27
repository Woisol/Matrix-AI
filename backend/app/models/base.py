"""
轻量级原生 SQL ORM - 替代 Tortoise ORM
"""
import asyncio
import logging
import os
import json
from datetime import datetime, date
from typing import Any, Optional, List, Type, TypeVar, get_origin, get_args
import asyncpg
from fastapi import HTTPException

from app.constants.create_table import CREATE_TABLES_SQL

# 数据库配置
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "192.168.1.1"),
    "port": int(os.getenv("DB_PORT", "8888")),
    "user": os.getenv("DB_USER", "matrixai"),
    "password": os.getenv("DB_PASSWORD", "default_password"),
    "database": os.getenv("DB_NAME", "matrixai"),
}

# 连接池
_pool: Optional[asyncpg.Pool] = None


async def _ensure_database_exists():
    """确保数据库存在，如果不存在则创建"""
    db_name = DB_CONFIG["database"]
    # 先尝试连接到目标数据库
    try:
        conn = await asyncpg.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=db_name,
            timeout=5
        )
        await conn.close()
        return  # 数据库已存在
    except asyncpg.InvalidCatalogNameError:
        # 数据库不存在，连接到 postgres 系统数据库并创建
        logging.info(f"Database '{db_name}' not found, creating...")
        conn = await asyncpg.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database="postgres",
            timeout=10
        )
        try:
            await conn.execute(f'CREATE DATABASE "{db_name}"')
            logging.info(f"Database '{db_name}' created successfully")
        except asyncpg.DuplicateDatabaseError:
            logging.warning(f"Database '{db_name}' already exists")
        finally:
            await conn.close()


async def _ensure_tables_exist():
    """确保所有表都已创建"""
    # 直接连接，不使用 get_db() 避免递归调用 get_pool()
    conn = await asyncpg.connect(
        host=DB_CONFIG["host"],
        port=DB_CONFIG["port"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        database=DB_CONFIG["database"],
        timeout=10
    )
    try:
        await conn.execute(CREATE_TABLES_SQL)
    finally:
        await conn.close()

async def get_pool() -> asyncpg.Pool:
    """获取数据库连接池"""
    global _pool
    if _pool is None:
        # 确保数据库存在
        await _ensure_database_exists()
        await _ensure_tables_exist()
        _pool = await asyncpg.create_pool(**DB_CONFIG, min_size=2, max_size=10)
    return _pool


async def get_db() -> asyncpg.Connection:
    """获取数据库连接"""
    pool = await get_pool()
    return await pool.acquire()


async def close_pool():
    """关闭连接池"""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


# 类型映射
TYPE_MAP = {
    int: "INTEGER",
    str: "VARCHAR",
    bool: "BOOLEAN",
    float: "FLOAT",
    datetime: "TIMESTAMP",
    date: "DATE",
    dict: "JSONB",
    list: "JSONB",
}


def _quoted_table(table_name: str) -> str:
    """安全转义表名（处理保留字如 user）"""
    return f'"{table_name}"'


class Model:
    """模型基类"""

    # 子类必须定义
    table_name: str = ""
    columns: dict = {}  # 字段名 -> 类型

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

    def __repr__(self):
        return f"<{self.__class__.__name__}: {self.pk_value}>"

    @property
    def pk_value(self) -> Any:
        """获取主键值"""
        pk_name = self._meta.pk
        return getattr(self, pk_name, None)

    class _meta:
        """模型元信息"""
        pk: str = "id"

    @classmethod
    async def _get_connection(cls) -> asyncpg.Connection:
        """获取数据库连接"""
        return await get_db()

    @classmethod
    async def create(cls, **kwargs) -> "Model":
        """创建记录"""
        conn = await cls._get_connection()
        try:
            valid_kwargs = {k: v for k, v in kwargs.items() if k in cls.columns}
            valid_kwargs = cls._prepare_values(valid_kwargs)

            placeholders = ", ".join([f"${i+1}" for i in range(len(valid_kwargs))])
            columns_str = ", ".join(valid_kwargs.keys())
            sql = f"INSERT INTO {_quoted_table(cls.table_name)} ({columns_str}) VALUES ({placeholders}) RETURNING *"

            row = await conn.fetchrow(sql, *valid_kwargs.values())
            return cls._from_row(row)
        finally:
            await conn.close()

    @classmethod
    async def get(cls, **kwargs) -> "Model":
        """获取单条记录"""
        conn = await cls._get_connection()
        try:
            if not kwargs:
                raise ValueError("至少需要一个查询条件")

            conditions = []
            values = []
            for i, (key, value) in enumerate(kwargs.items()):
                conditions.append(f"{key} = ${i+1}")
                values.append(value)

            where_str = " AND ".join(conditions)
            sql = f"SELECT * FROM {_quoted_table(cls.table_name)} WHERE {where_str} LIMIT 1"

            row = await conn.fetchrow(sql, *values)
            if row is None:
                raise HTTPException(status_code=404, detail=f"{cls.__name__} not found")

            return cls._from_row(row)
        finally:
            await conn.close()

    @classmethod
    async def get_or_none(cls, **kwargs) -> Optional["Model"]:
        """获取单条记录，不存在返回 None"""
        conn = await cls._get_connection()
        try:
            if not kwargs:
                return None

            conditions = []
            values = []
            for i, (key, value) in enumerate(kwargs.items()):
                conditions.append(f"{key} = ${i+1}")
                values.append(value)

            where_str = " AND ".join(conditions)
            sql = f"SELECT * FROM {_quoted_table(cls.table_name)} WHERE {where_str} LIMIT 1"

            row = await conn.fetchrow(sql, *values)
            if row is None:
                return None
            return cls._from_row(row)
        finally:
            await conn.close()

    @classmethod
    async def filter(cls, **kwargs) -> List["Model"]:
        """查询多条记录"""
        conn = await cls._get_connection()
        try:
            if not kwargs:
                sql = f"SELECT * FROM {_quoted_table(cls.table_name)}"
                rows = await conn.fetch(sql)
            else:
                conditions = []
                values = []
                for i, (key, value) in enumerate(kwargs.items()):
                    if value is None:
                        conditions.append(f"{key} IS NULL")
                    else:
                        conditions.append(f"{key} = ${i+1}")
                        values.append(value)

                where_str = " AND ".join(conditions)
                sql = f"SELECT * FROM {_quoted_table(cls.table_name)} WHERE {where_str}"
                rows = await conn.fetch(sql, *values)

            return [cls._from_row(row) for row in rows]
        finally:
            await conn.close()

    @classmethod
    async def all(cls) -> List["Model"]:
        """获取所有记录"""
        return await cls.filter()

    @classmethod
    async def exists(cls, **kwargs) -> bool:
        """检查记录是否存在"""
        conn = await cls._get_connection()
        try:
            if not kwargs:
                sql = f"SELECT 1 FROM {_quoted_table(cls.table_name)} LIMIT 1"
                row = await conn.fetchrow(sql)
            else:
                conditions = []
                values = []
                for i, (key, value) in enumerate(kwargs.items()):
                    conditions.append(f"{key} = ${i+1}")
                    values.append(value)

                where_str = " AND ".join(conditions)
                sql = f"SELECT 1 FROM {_quoted_table(cls.table_name)} WHERE {where_str} LIMIT 1"
                row = await conn.fetchrow(sql, *values)

            return row is not None
        finally:
            await conn.close()

    async def save(self) -> "Model":
        """保存记录（插入或更新）"""
        conn = await self._get_connection()
        try:
            pk_name = self._meta.pk
            pk_value = getattr(self, pk_name)

            values = self._prepare_values(self._get_instance_values())

            if pk_value is None:
                placeholders = ", ".join([f"${i+1}" for i in range(len(values))])
                columns_str = ", ".join(values.keys())
                sql = f"INSERT INTO {_quoted_table(self.table_name)} ({columns_str}) VALUES ({placeholders}) RETURNING *"
            else:
                set_clauses = [f"{k} = ${i+1}" for i, k in enumerate(values.keys())]
                where_clause = f"{pk_name} = ${len(values) + 1}"
                sql = f"UPDATE {_quoted_table(self.table_name)} SET {', '.join(set_clauses)} WHERE {where_clause} RETURNING *"
                values[pk_name] = pk_value

            row = await conn.fetchrow(sql, *values.values())
            return self._from_row(row)
        finally:
            await conn.close()

    async def delete(self) -> bool:
        """删除记录"""
        conn = await self._get_connection()
        try:
            pk_name = self._meta.pk
            pk_value = getattr(self, pk_name)

            if pk_value is None:
                raise ValueError("无法删除未保存的记录")

            sql = f"DELETE FROM {_quoted_table(self.table_name)} WHERE {pk_name} = $1"
            result = await conn.execute(sql, pk_value)
            return result != "DELETE 0"
        finally:
            await conn.close()

    async def refresh(self):
        """从数据库刷新记录"""
        pk_name = self._meta.pk
        pk_value = getattr(self, pk_name)

        if pk_value is None:
            raise ValueError("无法刷新未保存的记录")

        fresh = await self.__class__.get(**{pk_name: pk_value})
        for key, value in fresh.__dict__.items():
            setattr(self, key, value)

    @classmethod
    def _from_row(cls, row: dict) -> "Model":
        """从数据库行创建模型实例"""
        kwargs = {}
        for key, value in row.items():
            if isinstance(value, datetime):
                pass
            elif isinstance(value, str):
                #! 严格检查头尾，否则 description 中开头可能包含 [ 会误判
                if value.startswith("{") and value.endswith("}") or value.startswith("[") and value.endswith("]"):
                    try:
                        value = json.loads(value)
                    except:
                        pass
            kwargs[key] = value
        return cls(**kwargs)

    @classmethod
    def _prepare_values(cls, values: dict) -> dict:
        """准备值用于 SQL"""
        from datetime import date, timezone
        result = {}
        for key, value in values.items():
            if value is None:
                result[key] = None
            elif isinstance(value, (dict, list)):
                result[key] = json.dumps(value)
            elif isinstance(value, datetime):
                result[key] = value
            elif isinstance(value, date):
                result[key] = datetime.combine(value, datetime.min.time()).replace(tzinfo=timezone.utc)
            elif isinstance(value, str):
                # 尝试解析 ISO 格式的 datetime 字符串
                try:
                    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
                    result[key] = parsed
                except (ValueError, AttributeError):
                    result[key] = value
            else:
                result[key] = value
        return result

    def _get_instance_values(self) -> dict:
        """获取实例的非 PK 字段值"""
        result = {}
        for key in self.columns:
            if hasattr(self, key):
                value = getattr(self, key)
                if key != self._meta.pk:
                    result[key] = value
        return result


# === 便捷函数 ===

async def execute(sql: str, *args) -> str:
    """执行 SQL，返回结果"""
    conn = await get_db()
    try:
        return await conn.execute(sql, *args)
    finally:
        await conn.close()


async def fetch_one(sql: str, *args) -> Optional[dict]:
    """查询单条记录"""
    conn = await get_db()
    try:
        return await conn.fetchrow(sql, *args)
    finally:
        await conn.close()


async def fetch_all(sql: str, *args) -> List[dict]:
    """查询所有记录"""
    conn = await get_db()
    try:
        return await conn.fetch(sql, *args)
    finally:
        await conn.close()


async def fetch_val(sql: str, *args) -> Any:
    """查询单个值"""
    conn = await get_db()
    try:
        return await conn.fetchval(sql, *args)
    finally:
        await conn.close()
