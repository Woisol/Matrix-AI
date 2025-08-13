# 课程OJ平台后端API

基于FastAPI、Tortoise ORM和SQLite3构建的课程在线判题平台后端服务。

## 项目结构

```
backend/
├── app/
│   ├── main.py              # FastAPI主应用
│   ├── database.py          # 数据库配置
│   ├── models/
│   │   ├── __init__.py
│   │   └── course.py        # 课程相关模型
│   ├── schemas/
│   │   ├── course.py        # Pydantic模型
│   │   └── problem.py
│   ├── routers/
│   │   ├── course.py        # 课程相关路由
│   │   └── ai.py
│   └── utils/
│       ├── __init__.py
│       └── AI_utils.py
├── requirements.txt         # Python依赖
├── run.py                  # 启动脚本
└── README.md               # 本文档
```

## 功能特性

### 已实现的API端点

#### 课程管理
- `GET /api/courses` - 获取课程列表
- `POST /api/courses` - 创建新课程
- `GET /api/courses/{course_id}` - 获取课程详情
- `POST /api/courses/{course_id}` - 更新课程信息

#### 作业管理
- `POST /api/courses/{course_id}/assignments` - 创建课程作业
- `GET /api/courses/{course_id}/assignments/{ca_id}` - 获取作业详情
- `POST /api/courses/{course_id}/assignments/{ca_id}` - 更新作业信息
- `DELETE /api/courses/{course_id}/assignments/{ca_id}` - 删除作业
- `GET /api/courses/{course_id}/assignments/{ca_id}/answer` - 获取作业答案

#### 提交管理
- `GET /api/courses/{course_id}/assignments/{ca_id}/submissions` - 获取提交列表
- `POST /api/courses/{course_id}/assignments/{ca_id}/submissions` - 创建提交
- `GET /api/courses/{course_id}/assignments/{ca_id}/submissions/{sub_ca_id}` - 获取提交详情
- `POST /api/courses/{course_id}/assignments/{ca_id}/submissions/{sub_ca_id}` - 重新评测
- `GET /api/courses/{course_id}/assignments/{ca_id}/submissions/last` - 获取最后提交
- `GET /api/courses/{course_id}/assignments/{ca_id}/submissions/last/feedback` - 获取最后提交反馈

#### 系统接口
- `GET /` - 根路径
- `GET /health` - 健康检查

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 启动服务

```bash
# 方式1：使用启动脚本
python run.py

# 方式2：直接使用uvicorn
uvicorn app.main:app --reload
```

### 3. 访问API

- API服务地址: http://localhost:8000
- 交互式API文档: http://localhost:8000/docs
- API文档(ReDoc): http://localhost:8000/redoc

## 数据库模型

### Course（课程）
- id: 主键
- name: 课程名称
- type: 课程类型(public/private)
- status: 课程状态(open/close)
- school_year: 学年
- semester: 学期
- description: 课程描述
- creator_name: 创建者姓名
- created_at/updated_at: 时间戳

### CourseAssignment（课程作业）
- id: 主键
- course: 关联课程
- title: 作业标题
- description: 作业描述
- start_date/end_date: 起止时间
- grade_at_end: 结束后是否评分
- pub_answer: 是否公布答案
- plcheck: 抄袭检测
- submit_limitation: 提交次数限制
- answer_file: 答案文件
- support_files: 支持文件(JSON)
- created_at/updated_at: 时间戳

### CourseAssignmentSubmission（作业提交）
- id: 主键
- assignment: 关联作业
- student_name: 学生姓名
- detail: 提交内容(JSON)
- score: 分数
- feedback: 反馈
- status: 状态(pending/judging/finished/error)
- judge_result: 评测结果(JSON)
- submit_time: 提交时间
- judge_time: 评测时间

## API使用示例

### 创建课程

```bash
curl -X POST "http://localhost:8000/api/courses" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Python编程基础",
       "type": "public",
       "status": "open",
       "school_year": "2023-2024",
       "semester": "秋季学期",
       "description": "Python编程基础课程",
       "creator_name": "张老师"
     }'
```

### 创建作业

```bash
curl -X POST "http://localhost:8000/api/courses/1/assignments" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Python基础练习",
       "description": "编写一个简单的Python程序",
       "start_date": "2024-01-01T00:00:00",
       "end_date": "2024-01-07T23:59:59",
       "submit_limitation": 5
     }'
```

### 提交作业

```bash
curl -X POST "http://localhost:8000/api/courses/1/assignments/1/submissions" \
     -H "Content-Type: application/json" \
     -d '{
       "student_name": "张三",
       "detail": {
         "code": "print(\"Hello, World!\")",
         "language": "python"
       }
     }'
```

## 开发说明

### 技术栈
- **FastAPI**: 现代、快速的Web框架
- **Tortoise ORM**: 异步ORM，类似Django ORM
- **SQLite3**: 轻量级数据库
- **Pydantic**: 数据验证和序列化
- **Uvicorn**: ASGI服务器

### 特点
- 简化的架构，专注于课程功能
- 无用户认证系统，使用姓名标识
- 完整的CRUD操作
- 异步数据库操作
- 自动API文档生成
- 类型提示和数据验证

## 注意事项

1. 这是一个简化版本，未包含用户认证系统
2. 数据库使用SQLite，适合开发和小规模部署
3. 评测系统功能需要进一步实现
4. 生产环境建议使用PostgreSQL等数据库
5. 需要根据实际需求添加权限控制

## 扩展建议

1. 添加用户认证和授权系统
2. 实现真正的代码评测功能
3. 添加文件上传下载功能
4. 实现实时通知系统
5. 添加数据库迁移脚本
6. 完善错误处理和日志系统
