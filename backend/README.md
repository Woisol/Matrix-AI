# AI-matrix 后端（FastAPI + Tortoise ORM）

本目录是 MatrixAI 的后端服务，基于 FastAPI、Tortoise ORM 与 Uvicorn。提供课程、作业、以及 AI 分析相关 API。

## 技术栈

- Python 3.12（`environment.yml`/Anaconda）
- FastAPI（Web 框架）
- Uvicorn（ASGI 服务器，热重载）
- Tortoise ORM + asyncpg（数据库 ORM，默认 PostgreSQL 驱动）
- SQLite 备选（已在配置中注释，可切换）

依赖清单见 `requirements.txt`：

```text
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.4.0
tortoise-orm[asyncpg]>=0.20.0
aerich>=0.7.0
python-multipart>=0.0.6
aiosqlite>=0.19.0
```

## 目录结构

- `run.py`：开发启动脚本（使用 Uvicorn 热重载）
- `app/main.py`：FastAPI 应用入口，注册路由与生命周期管理
- `app/database.py`：数据库配置（Tortoise ORM），初始化/关闭连接、默认数据
- `app/routers/`：路由模块（course、assignment、ai）
- `app/models/`：ORM 模型
- `app/controller/`：业务逻辑层
- `app/schemas/`：Pydantic 模型（请求/响应）
- `tests/`、`app/test/`：测试与示例

## 环境准备

你可以任选 pip 或 Conda 准备环境。

### 方案 A：pip（推荐简洁）

1. 创建虚拟环境（可选）
2. 安装依赖：

```bash
pip install -r requirements.txt
```

### 方案 B：Conda（依据 `environment.yml`）

`environment.yml` 较大，包含桌面与科学计算组件，仅供需要时参考。一般后端开发建议采用 pip + 轻量虚拟环境。

## 运行服务

开发模式（热重载）：

```bash
python run.py
```

或直接使用 uvicorn：

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

启动后：

- 健康检查：[http://localhost:8000/health](http://localhost:8000/health)
- OpenAPI 文档：[http://localhost:8000/docs](http://localhost:8000/docs)

## 数据库配置

默认配置在 `app/database.py`，采用 OpenGauss数据库（基于PostgreSQL）（asyncpg）：

```python
TORTOISE_ORM = {

    "connections": {
        "default": {
            "engine": "tortoise.backends.asyncpg",
            "credentials": {
                "host": "192.168.134.205",
                "port": 8888,
                "user": "matrixai",
                "password": "Matrix#13331314",
                "database": "matrixai",
                "connection_class": NoUnlistenConnection,
            }
        }
    },
    # "connections": {"default": "sqlite://db.sqlite3"},
    "apps": {
        "models": {
            "models": [
                "app.models.course",
                "app.models.assignment",
                "app.models.analysis",
                "app.models.user",
                "aerich.models"
            ],
            "default_connection": "default",
        },
    },
}
```

数据库dockers部署方法：参考[官方网站](https://docs.opengauss.org/zh/docs/7.0.0-RC1/docs/InstallationGuide/%E5%AE%B9%E5%99%A8%E9%95%9C%E5%83%8F%E5%AE%89%E8%A3%85.html)

运行容器参考如下命令：

```bash
docker run --name opengauss --privileged=true -d -e GS_PASSWORD=Matrix#13331314 /
-e GS_NODENAME=matrixaidb -e GS_USERNAME=matrixai -e GS_DB=matrixai /
-v {/you/path/to/backend/db }:/var/lib/opengauss -p 8888:5432 opengauss/opengauss-server:latest
```

密码要求：

```log
Error: The supplied GS_PASSWORD is not meet requirements.
Please Check if the password contains uppercase, lowercase, numbers, special characters, and password length(8).
At least one uppercase, lowercase, numeric, special character.
Example: Enmo@123
```

之后可使用数据库前端软件进行连接。

## API 概览（节选）

具体以接口文档和代码为准，以下为主要路由：

### 健康检查

- GET `/health` → `{ status: "healthy", service: "course-oj-api" }`

### 课程（`app/routers/course.py`）

- GET `/courses` → 课程列表
- GET `/courses/todo` → 待办课程列表
- GET `/courses/{course_id}` → 课程详情
- POST `/courses` → 新增/更新课程（请求体 `CourseCreateRequest`）
- DELETE `/courses/{course_id}` → 删除课程

### 作业（`app/routers/assignment.py`）

- GET `/courses/{course_id}/assignments/{assign_id}` → 作业详情
- POST `/courses/{course_id}/assignments` → 新增/更新作业（请求体 `AssignCreateRequest`，其中 `testSample` 为 JSON 字符串，内部会解析为结构体）
- DELETE `/courses/{course_id}/assignments/{assign_id}` → 删除作业
- POST `/playground/submission` → 代码演练区测试提交
- POST `/courses/{course_id}/assignments/{assign_id}/submission` → 学生提交，返回 `Submit`

### AI 分析（`app/routers/ai.py`）

- GET `/courses/{course_id}/assignments/{assign_id}/analysis/basic` → 基础分析（`reGen` 可控是否重新生成）
- GET `/courses/{course_id}/assignments/{assign_id}/analysis/aiGen` → AI 生成分析

## 开发与测试

本仓库提供了 `tests/test_api.py` 的 aiohttp 示例（需服务已启动）：

```bash
# 先启动后端
uvicorn app.main:app --reload

# 另开终端运行示例（如改造为 unittest/pytest 可自定）
python tests/test_api.py
```

前端开发默认通过代理访问后端（参考前端 `proxy.conf.json`）。

## 常见问题与排查

1) asyncpg/数据库连接失败

- 检查 `app/database.py` 中主机、端口、账号密码、数据库名称是否正确；
- 本地快速试跑可切换 SQLite。

1) 表不存在/模型不同步

- 首次启动会自动 `generate_schemas()` 建表；若模型变化，建议引入迁移工具 `aerich`（已在依赖中）。

1) 端口占用

- 默认 8000，可通过 `--port` 指定其它端口。

1) Python 版本

- `app/main.py` 要求 Python ≥ 3.9；推荐 3.12（与当前依赖兼容）。
