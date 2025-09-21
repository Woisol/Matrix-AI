# 后端测试文档

## 概述

本项目为AI-Matrix后端应用提供了全面的测试套件，包括单元测试、集成测试和端到端测试。测试覆盖了所有主要组件：模型层、控制器层、路由层和工具类。

## 测试结构

```
backend/
├── tests/
│   ├── conftest.py              # 测试配置和fixtures
│   ├── test_helpers.py          # 测试工具和助手函数
│   ├── test_models/            # 模型层测试
│   │   ├── test_course.py
│   │   ├── test_assignment.py
│   │   └── test_analysis.py
│   ├── test_controllers/       # 控制器层测试
│   │   ├── test_course.py
│   │   └── test_assignment.py
│   ├── test_routes/           # 路由层测试（API集成测试）
│   │   ├── test_course.py
│   │   └── test_assignment.py
│   └── test_utils/            # 工具类测试
│       └── test_utils.py
├── pyproject.toml             # pytest配置
├── run_tests.sh              # Linux/Mac测试运行脚本
└── run_tests.bat             # Windows测试运行脚本
```

## 测试类型

### 1. 模型层测试 (test_models/)

测试数据库模型的CRUD操作、关系映射和业务逻辑：

- **课程模型测试** (`test_course.py`)
  - 创建、读取、更新、删除课程
  - 课程与作业的多对多关系
  - 数据验证和约束测试
  - 查询过滤和排序

- **作业模型测试** (`test_assignment.py`)
  - 作业的基本CRUD操作
  - 作业代码和提交记录的关系测试
  - 枚举类型字段测试
  - 级联删除行为

- **分析模型测试** (`test_analysis.py`)
  - AI分析数据的存储和检索
  - JSON字段的复杂数据操作
  - 与作业模型的外键关系

### 2. 控制器层测试 (test_controllers/)

测试业务逻辑层的功能和错误处理：

- **课程控制器测试** (`test_course.py`)
  - 课程列表获取和过滤
  - 课程创建和更新逻辑
  - 错误处理和异常情况
  - 数据一致性验证

- **作业控制器测试** (`test_assignment.py`)
  - 作业的获取和管理
  - 代码提交和判题逻辑
  - 截止日期验证
  - JSON数据处理

### 3. 路由层测试 (test_routes/)

测试HTTP API端点的请求响应：

- **课程API测试** (`test_course.py`)
  - GET /courses - 获取课程列表
  - GET /courses/todo - 获取待完成课程
  - GET /courses/{id} - 获取单个课程
  - POST /courses - 创建/更新课程
  - DELETE /courses/{id} - 删除课程

- **作业API测试** (`test_assignment.py`)
  - GET /courses/{course_id}/assignments/{assignment_id}
  - POST /courses/{course_id}/assignments
  - DELETE /courses/{course_id}/assignments/{assignment_id}
  - POST /playground/submission
  - POST /courses/{course_id}/assignments/{assignment_id}/submission

### 4. 工具类测试 (test_utils/)

测试辅助函数和工具类：

- 数据格式转换函数
- JSON字符串处理
- 代码Markdown包装
- 测试样例结果处理

## 测试工具

### TestDataGenerator

提供测试数据生成功能：

```python
# 创建测试课程
course = await TestDataGenerator.create_test_course(course_name="测试课程")

# 创建测试作业
assignment = await TestDataGenerator.create_test_assignment(title="测试作业")

# 创建完整的课程作业结构
course, assignment, code = await TestDataGenerator.create_full_test_course_with_assignment()
```

### AssertionHelpers

提供常用的断言助手：

```python
# 断言响应成功
AssertionHelpers.assert_response_success(response, 200)

# 断言响应错误
AssertionHelpers.assert_response_error(response, 404, "not found")

# 断言课程数据
AssertionHelpers.assert_course_data(actual_data, expected_course)
```

### MockHelpers

提供Mock对象和数据：

```python
# Mock AI响应
ai_response = MockHelpers.mock_ai_response("AI生成的内容")

# Mock OpenAI API响应
openai_response = MockHelpers.mock_openai_response("AI回复内容")
```

## 运行测试

### 本地运行

**Windows:**
```bash
# 运行完整测试套件
run_tests.bat

# 运行特定测试类型
pytest tests/test_models/ -v
pytest tests/test_controllers/ -v
pytest tests/test_routes/ -v
pytest tests/test_utils/ -v
```

**Linux/Mac:**
```bash
# 运行完整测试套件
./run_tests.sh

# 运行特定测试
pytest tests/test_models/ -v
```

### 运行选项

```bash
# 运行所有测试
pytest

# 运行特定文件
pytest tests/test_models/test_course.py

# 运行特定测试类
pytest tests/test_models/test_course.py::TestCourseModel

# 运行特定测试方法
pytest tests/test_models/test_course.py::TestCourseModel::test_create_course

# 生成覆盖率报告
pytest --cov=app --cov-report=html

# 生成HTML测试报告
pytest --html=test_report.html

# 并行运行测试
pytest -n 4

# 只运行失败的测试
pytest --lf

# 运行慢速测试
pytest -m slow

# 跳过慢速测试
pytest -m "not slow"
```

## 测试配置

### pytest.ini 配置

```ini
[tool.pytest.ini_options]
minversion = "7.0"
addopts = [
    "-ra",
    "--strict-markers",
    "--strict-config",
    "--cov=app",
    "--cov-report=term-missing",
    "--cov-report=html:htmlcov"
]
testpaths = ["tests"]
asyncio_mode = "auto"
markers = [
    "slow: 标记为慢速测试",
    "integration: 标记为集成测试",
    "unit: 标记为单元测试"
]
```

### 测试数据库

测试使用内存SQLite数据库，每个测试会话自动初始化和清理：

```python
TEST_TORTOISE_ORM = {
    "connections": {"default": "sqlite://:memory:"},
    "apps": {
        "models": {
            "models": [
                "app.models.course",
                "app.models.assignment",
                "app.models.analysis",
                "app.models.user",
                "app.models.playground"
            ],
            "default_connection": "default",
        },
    },
}
```

## CI/CD集成

### GitHub Actions

项目包含完整的GitHub Actions工作流配置（`.github/workflows/backend-tests.yml`）：

- **多Python版本测试**: Python 3.9, 3.10, 3.11
- **自动依赖缓存**: 提升构建速度
- **分层测试执行**: 模型、控制器、路由、工具类分别测试
- **覆盖率报告**: 集成Codecov上传覆盖率
- **代码质量检查**: Black格式化、isort导入排序、flake8代码检查
- **测试报告**: 生成JUnit XML和HTML报告

### 覆盖率目标

- **总体覆盖率**: > 85%
- **模型层覆盖率**: > 90%
- **控制器层覆盖率**: > 85%
- **路由层覆盖率**: > 80%
- **工具类覆盖率**: > 95%

## 最佳实践

### 1. 测试命名

```python
def test_feature_scenario_expected_result():
    """测试特定功能在特定场景下的预期结果"""
    pass

# 示例
def test_create_course_with_valid_data_returns_true():
    """测试使用有效数据创建课程返回True"""
    pass
```

### 2. 测试结构 (AAA模式)

```python
async def test_example():
    # Arrange - 准备测试数据
    course = await TestDataGenerator.create_test_course()

    # Act - 执行测试操作
    result = await CourseController.get_course(course.id)

    # Assert - 验证结果
    assert result.courseId == course.id
```

### 3. Mock使用

```python
@patch('app.models.playground.Playground.run_code')
async def test_code_execution(mock_run_code):
    # Mock外部依赖
    mock_run_code.return_value = "expected output"

    # 执行测试
    result = await execute_code("test code")

    # 验证Mock被正确调用
    mock_run_code.assert_called_once_with(code="test code")
```

### 4. 异常测试

```python
async def test_get_nonexistent_course_raises_404():
    """测试获取不存在的课程抛出404异常"""
    with pytest.raises(HTTPException) as exc_info:
        await CourseController.get_course("nonexistent-id")

    assert exc_info.value.status_code == 404
    assert "not found" in exc_info.value.detail
```

## 故障排除

### 常见问题

1. **数据库连接错误**
   - 检查测试数据库配置
   - 确保测试环境变量设置正确

2. **异步测试失败**
   - 确保使用了`@pytest.mark.asyncio`装饰器
   - 检查事件循环配置

3. **Mock不生效**
   - 确认Mock路径正确
   - 检查导入语句的位置

4. **测试数据污染**
   - 确保每个测试使用独立的数据
   - 检查fixture的scope设置

### 调试技巧

```bash
# 显示详细错误信息
pytest -v --tb=long

# 进入调试模式
pytest --pdb

# 显示print输出
pytest -s

# 运行特定标记的测试
pytest -m integration
```

## 维护指南

### 添加新测试

1. 确定测试类型和位置
2. 使用TestDataGenerator创建测试数据
3. 遵循AAA测试模式
4. 添加适当的断言和错误检查
5. 更新相关文档

### 更新现有测试

1. 运行相关测试确保现有功能正常
2. 根据代码变更调整测试
3. 更新Mock对象和期望值
4. 验证覆盖率不降低

### 性能优化

1. 使用适当的fixture scope
2. 合理使用并行测试
3. 优化测试数据生成
4. 减少不必要的数据库操作

通过这套完整的测试体系，可以确保AI-Matrix后端的代码质量和系统稳定性。