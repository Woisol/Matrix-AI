# PostgreSQL ORM 框架

这是一个为 AI-matrix 项目专门设计的 PostgreSQL ORM 框架，提供了简洁而强大的数据库操作接口。

## 主要特性

### 🚀 核心功能
- **异步支持**: 完全基于 asyncio 和 asyncpg 实现
- **连接池管理**: 自动连接池管理和监控
- **类型安全**: 集成 Pydantic 进行数据验证
- **查询构建器**: 灵活的链式查询接口
- **事务支持**: 完整的事务管理，包括保存点
- **关系管理**: 支持一对一、一对多、多对多关系
- **批量操作**: 高效的批量插入、更新、删除
- **数据库迁移**: 简单的迁移管理工具

### 📋 字段类型支持
- `INT`, `BIGINT`, `SMALLINT` - 整数类型
- `VARCHAR`, `TEXT` - 字符串类型  
- `BOOLEAN` - 布尔类型
- `TIMESTAMP`, `DATE` - 时间类型
- `DECIMAL` - 精确数值类型
- `JSON` - JSON 数据类型
- `UUID` - UUID 类型

## 快速开始

### 1. 安装依赖

```bash
pip install asyncpg pydantic
```

### 2. 初始化数据库连接

```python
from app.utils.orm import init_database, close_database

# 初始化连接池
await init_database("postgresql://user:password@localhost:5432/database")

# 程序结束时关闭连接池
await close_database()
```

### 3. 定义模型

```python
from app.utils.orm import BaseModel, Field, FieldType, one_to_many, many_to_one

class User(BaseModel):
    __table_name__ = "users"
    
    id = Field(FieldType.INT, primary_key=True, auto_increment=True)
    username = Field(FieldType.VARCHAR, max_length=50, unique=True, nullable=False)
    email = Field(FieldType.VARCHAR, max_length=100, unique=True)
    is_active = Field(FieldType.BOOLEAN, default=True)
    created_at = Field(FieldType.TIMESTAMP, default=datetime.now)
    
    # 定义关系
    courses = one_to_many("Course", "user_id", "owner")

class Course(BaseModel):
    __table_name__ = "courses"
    
    id = Field(FieldType.VARCHAR, max_length=50, primary_key=True)
    course_name = Field(FieldType.VARCHAR, max_length=200, nullable=False)
    user_id = Field(FieldType.INT, index=True)  # 外键
    
    # 定义反向关系
    owner = many_to_one("User", "user_id", "courses")
```

### 4. 创建表

```python
# 创建数据表
await User.create_table()
await Course.create_table()
```

## 基础操作

### 创建记录

```python
# 创建用户
user = User(username="john_doe", email="john@example.com")
await user.save()

# 批量创建
users_data = [
    {"username": "alice", "email": "alice@example.com"},
    {"username": "bob", "email": "bob@example.com"}
]

batch = BatchOperation(User)
for data in users_data:
    batch.add_insert(**data)
results = await batch.execute_all()
```

### 查询记录

```python
# 根据主键查找
user = await User.find_by_id(1)

# 根据条件查找单个记录
user = await User.get(username="john_doe")

# 查找多个记录
users = await User.filter(is_active=True)

# 获取所有记录
all_users = await User.all()

# 检查记录是否存在
exists = await User.exists(username="john_doe")

# 统计记录数量
count = await User.count(is_active=True)
```

### 更新记录

```python
# 更新单个记录
user = await User.get(username="john_doe")
user.email = "newemail@example.com"
await user.save()

# 批量更新
batch = BatchOperation(User)
batch.add_update(user_id=1, email="new1@example.com")
batch.add_update(user_id=2, email="new2@example.com")
await batch.execute_all()
```

### 删除记录

```python
# 删除单个记录
user = await User.get(username="john_doe")
await user.delete()

# 批量删除
batch = BatchOperation(User)
batch.add_delete(1)
batch.add_delete(2)
await batch.execute_all()
```

## 高级查询

### 查询构建器

```python
# 复杂查询条件
users = await (User.query()
               .where("created_at > $1", datetime(2024, 1, 1))
               .where_eq("is_active", True)
               .where_like("username", "john%")
               .order_by("created_at", "DESC")
               .limit(10)
               .offset(20)
               .execute())

# JOIN 查询
results = await (User.query()
                 .select("users.username", "courses.course_name")
                 .join("courses", "users.id = courses.user_id")
                 .where_eq("users.is_active", True)
                 .execute())

# 聚合查询
user_count = await User.query().count()

# 分组查询
results = await (User.query()
                 .select("is_active", "COUNT(*) as count")
                 .group_by("is_active")
                 .having("COUNT(*) > $1", 1)
                 .execute())
```

### 关系操作

```python
# 获取用户的所有课程
user = await User.find_by_id(1)
courses = await user.courses.all()

# 为用户添加课程
course = Course(id="python-101", course_name="Python 基础")
await course.save()
await user.courses.add(course)

# 移除课程关联
await user.courses.remove(course)

# 清除所有关联
await user.courses.clear()

# 统计关联数量
course_count = await user.courses.count()
```

## 事务管理

### 基础事务

```python
from app.utils.orm import transaction

async with transaction() as tx:
    user = User(username="test_user", email="test@example.com")
    await user.save()
    
    course = Course(id="test-course", course_name="测试课程", user_id=user.id)
    await course.save()
    
    # 如果出现异常，事务会自动回滚
```

### 保存点

```python
async with transaction() as tx:
    user = User(username="user1", email="user1@example.com")
    await user.save()
    
    # 创建保存点
    savepoint = await tx.savepoint("user_created")
    
    try:
        # 尝试危险操作
        duplicate_user = User(username="user1", email="duplicate@example.com")
        await duplicate_user.save()
    except Exception:
        # 回滚到保存点
        await tx.rollback_to_savepoint(savepoint)
```

## 数据验证

### Pydantic 集成

```python
# 转换为 Pydantic 模型
user = User(username="john", email="john@example.com")
pydantic_user = user.to_pydantic()

# 从 Pydantic 模型创建 ORM 实例
orm_user = User.from_pydantic(pydantic_user)

# 数据验证
try:
    validated_data = user.validate_data()
    print("数据验证通过")
except ValidationException as e:
    print(f"数据验证失败: {e}")
```

## 数据库迁移

```python
from app.utils.orm import Migration

pool = get_connection_pool()
migration = Migration(pool)

# 创建迁移表
await migration.create_migration_table()

# 应用迁移
await migration.apply_migration(
    "001_add_user_profile", 
    "ALTER TABLE users ADD COLUMN profile_image VARCHAR(255)"
)

# 查看已应用的迁移
migrations = await migration.get_applied_migrations()
```

## 性能优化

### 连接池监控

```python
pool = get_connection_pool()
stats = pool.get_stats()
print(f"连接池统计: {stats}")

# 健康检查
is_healthy = await pool.health_check()
```

### 查询优化

```python
from app.utils.orm import QueryOptimizer

# 获取索引建议
suggestions = QueryOptimizer.suggest_indexes(User)
for suggestion in suggestions:
    print(suggestion)

# 分析查询执行计划
explain_query = QueryOptimizer.explain_query(
    "SELECT * FROM users WHERE username = $1", 
    ["john_doe"]
)
```

### 原始 SQL

```python
from app.utils.orm import execute_raw_sql, get_database_info

# 执行原始 SQL
results = await execute_raw_sql("SELECT COUNT(*) FROM users WHERE is_active = $1", True)

# 获取数据库信息
db_info = await get_database_info()
print(f"数据库版本: {db_info['version']}")
```

## 配置示例

### 环境配置

```python
# 开发环境
DEV_DSN = "postgresql://dev_user:dev_pass@localhost:5432/ai_matrix_dev"

# 生产环境  
PROD_DSN = "postgresql://prod_user:prod_pass@prod_host:5432/ai_matrix_prod"

# 初始化
await init_database(
    dsn=DEV_DSN,
    min_size=5,    # 最小连接数
    max_size=20    # 最大连接数
)
```

## 错误处理

```python
from app.utils.orm import ORMException, ConnectionException, QueryException, ValidationException

try:
    user = await User.get(username="nonexistent")
except QueryException as e:
    print(f"查询错误: {e}")
except ConnectionException as e:
    print(f"连接错误: {e}")
except ValidationException as e:
    print(f"验证错误: {e}")
except ORMException as e:
    print(f"ORM 错误: {e}")
```

## 最佳实践

1. **连接池管理**: 在应用启动时初始化连接池，结束时关闭
2. **事务使用**: 对于需要一致性的操作使用事务
3. **批量操作**: 大量数据操作使用批量接口
4. **索引优化**: 为经常查询的字段添加索引
5. **数据验证**: 使用 Pydantic 进行数据验证
6. **错误处理**: 合适的异常处理和日志记录

## 与现有项目集成

如果要在现有的 AI-matrix 项目中使用这个 ORM，可以逐步迁移：

1. 保留现有的 Tortoise ORM 模型
2. 新功能使用新的 ORM 框架
3. 逐步迁移现有模型到新框架

```python
# 在 database.py 中同时初始化两个 ORM
from app.utils.orm import init_database as init_custom_orm

async def init_db():
    # 现有的 Tortoise ORM 初始化
    await Tortoise.init(...)
    
    # 新的自定义 ORM 初始化
    await init_custom_orm("postgresql://...")
```

这个 ORM 框架为 AI-matrix 项目提供了强大而灵活的数据库操作能力，可以很好地适配 PostgreSQL 数据库的高级特性。