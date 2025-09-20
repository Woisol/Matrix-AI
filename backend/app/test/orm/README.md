# ORM 框架测试套件

这是一个完整的 PostgreSQL ORM 框架测试套件。该测试套件覆盖了 ORM 框架的所有核心功能。

## 测试模块概览

### 1. test_base_model.py
测试 BaseModel 的核心功能：
- CRUD 操作（创建、读取、更新、删除）
- 查询构建和执行
- 字段验证和类型转换
- 模型生命周期管理
- 错误处理

### 2. test_field.py
测试字段定义功能：
- 各种字段类型（INTEGER, VARCHAR, TEXT, TIMESTAMP, JSON等）
- 字段约束（NOT NULL, UNIQUE, DEFAULT等）
- 字段验证规则
- 自定义字段类型

### 3. test_query_builder.py
测试查询构建器：
- 基础查询（SELECT, WHERE, ORDER BY等）
- 复杂查询（JOIN, 子查询等）
- 查询链式调用
- 聚合查询
- 分页查询

### 4. test_connection_pool.py
测试连接池管理：
- 连接池创建和初始化
- 连接获取和释放
- 连接复用和管理
- 连接池配置
- 异常处理

### 5. test_transaction.py
测试事务管理：
- 事务开始、提交、回滚
- 嵌套事务和保存点
- 事务异常处理
- 并发事务处理
- 事务隔离级别

### 6. test_relationships.py
测试关系管理：
- 一对多关系（One-to-Many）
- 多对一关系（Many-to-One）
- 多对多关系（Many-to-Many）
- 关系查询和级联操作
- 延迟加载和预加载

### 7. test_batch_operations.py
测试批量操作：
- 批量插入、更新、删除
- 大数据集处理
- 批量操作性能测试
- 并发批量操作
- 错误处理和回滚

### 8. test_data_validation.py
测试 Pydantic 集成和数据验证：
- 数据类型验证
- 字段约束验证
- 自定义验证器
- 数据序列化和反序列化
- 错误消息处理

### 9. test_migration.py
测试迁移管理：
- 迁移创建和应用
- 迁移回滚
- 版本管理
- 依赖检查
- 批量数据迁移

## 运行测试

### 环境要求

确保安装了以下依赖：
```bash
pip install pytest pytest-asyncio asyncpg pydantic
```

可选安装（用于覆盖率报告）：
```bash
pip install coverage
```

### 运行所有测试

```bash
# 在 backend/app/test/orm 目录下运行
python run_tests.py
```

### 运行特定测试模块

```bash
# 运行特定测试文件
python run_tests.py test_base_model

# 或使用 pytest 直接运行
pytest test_base_model.py -v
```

### 运行特定测试用例

```bash
# 运行特定测试类
pytest test_base_model.py::TestBaseModel -v

# 运行特定测试方法
pytest test_base_model.py::TestBaseModel::test_model_creation -v
```

## 测试配置

### 数据库设置

测试使用的数据库配置在 `conftest.py` 中定义：
- 默认使用 PostgreSQL
- 测试数据库名: `test_orm_db`
- 每个测试用例都会清理数据

### 测试固件

- `clean_database`: 清理整个数据库
- `clean_tables`: 清理特定表
- `test_user`, `test_course`: 创建测试数据

### 异步测试

所有测试都使用 `pytest-asyncio` 进行异步测试：
```python
@pytest.mark.asyncio
async def test_async_function():
    # 异步测试代码
    pass
```

## 测试覆盖率

运行完整测试套件后，会自动生成覆盖率报告：
- 终端显示覆盖率统计
- 生成 HTML 覆盖率报告到 `htmlcov/` 目录

## 性能测试

部分测试包含性能验证：
- 批量操作性能测试
- 连接池性能测试  
- 查询执行时间测试

## 错误处理测试

每个模块都包含错误处理测试：
- 数据库连接错误
- SQL 语法错误
- 数据验证错误
- 事务回滚测试

## 并发测试

测试套件包含并发场景测试：
- 并发数据库访问
- 并发事务处理
- 连接池并发管理

## 注意事项

1. **数据库要求**: 需要运行的 PostgreSQL 实例
2. **权限要求**: 测试用户需要创建/删除数据库的权限
3. **隔离性**: 每个测试用例都是独立的，不会相互影响
4. **清理**: 测试完成后会自动清理测试数据

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 PostgreSQL 是否运行
   - 验证数据库配置（host, port, username, password）

2. **导入错误**
   - 确保在正确的目录运行测试
   - 检查 Python 路径设置

3. **权限错误**
   - 确保数据库用户有足够权限
   - 检查测试数据库是否可访问

### 调试测试

```bash
# 显示详细输出
pytest -v -s

# 停在第一个失败
pytest -x

# 显示本地变量
pytest --tb=long

# 运行特定标记的测试
pytest -m "slow"  # 如果使用了标记
```

## 扩展测试

添加新测试时：
1. 继承适当的测试基类
2. 使用正确的测试固件
3. 确保测试隔离性
4. 添加适当的断言
5. 处理异步操作

示例：
```python
import pytest
from app.test.orm.conftest import TestUser

class TestNewFeature:
    async def test_new_functionality(self, clean_tables):
        # 测试代码
        user = TestUser(username="test")
        await user.save()
        
        assert user.id is not None
        assert user._exists is True
```