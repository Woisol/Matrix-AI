# AI-Matrix 智能编程练习平台

![Banner](frontend/public/banner/banner-matrix-ai.png)

## 📋 项目简介

AI-Matrix 是一个 AI 原生的**在线编程练习平台**，专为计算机科学教育而设计。该平台集成了**课程管理**、**作业提交**、**代码评测**和 **AI 智能分析**等功能，为学生和教师提供完整的编程学习解决方案。

### 🌟 核心特性

- **🎯 智能编程练习**：支持多种编程题型，包括选择题和编程题
- **🤖 AI 驱动分析**：集成 AI 模型提供智能代码分析和解题建议
- **📚 课程管理系统**：课程和作业管理功能
- **💻 在线代码编辑器**：基于 Monaco Editor 的专业代码编辑环境
- **📊 实时评测反馈**：即时的代码测试和成绩反馈
- **🎨 现代化UI**：基于 Angular + Ant Design 的响应式界面
- **💪 龙芯平台兼容**：本项目经在**龙芯 3A6000** 主板上**实机运行**测试，**所有功能均能正常运行**

## 🏗️ 技术架构

### 后端技术栈

- **核心框架**：Python FastAPI
- **数据库 ORM**：Tortoise ORM
- **数据库**：openGauss 国产数据库
- **沙箱运行**：firejail
<!-- - **API 文档**：自动生成的 Swagger 文档 -->

### 前端技术栈

- **核心框架**：Angular 20.x
- **UI 库**：ng-zorro-antd (Ant Design)
- **代码编辑器**：Monaco Editor
- **Markdown 渲染**：ngx-markdown
- **构建工具**：Angular CLI

### 数据库设计

- **课程管理**：Course, Assignment 多对多关系
- **AI 分析**：Analysis 智能分析结果存储
- **提交记录**：AssignmentSubmission 代码提交记录

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **Python**: >= 3.9.0
- **pnpm**: >= 8.0.0 (推荐) 或 npm

### 启动项目

#### 1. 克隆项目

```bash
git clone https://github.com/Woisol/AI-matrix.git
cd AI-matrix
```

#### 2. 后端环境配置

```bash
# 使用 pip 安装
cd backend
pip install -r requirements.txt

# 或使用 conda 环境(未经充分测试)
conda env create -f backend/environment.yml
conda activate base
```

#### 3. 前端环境配置

```bash
cd frontend
pnpm install
```

#### 4. 数据库配置

如果使用 docker 启动 openGauss，参考[官方网站](https://docs.opengauss.org/zh/docs/7.0.0-RC1/docs/InstallationGuide/%E5%AE%B9%E5%99%A8%E9%95%9C%E5%83%8F%E5%AE%89%E8%A3%85.html)\
本项目参考命令如下

```bash
# 启动 openGauss 容器
docker run --name opengauss --privileged=true -d \
  -e GS_PASSWORD={your_password} \
  -e GS_NODENAME=matrixaidb \
  -e GS_USERNAME=matrixai \
  -e GS_DB=matrixai \
  -v ./backend/db:/var/lib/opengauss \
  -p 8888:5432 \
  opengauss/opengauss-server:latest
```

由于项目没有配置环境变量，启动数据库后请在 backend\app\database.py:17 中**完善数据库的 host 密码等相关信息**

#### 5. 启动服务

##### 后端服务

```bash
cd backend
python run.py
```
服务将在 http://localhost:8000 启动

##### 前端服务

```bash
cd frontend
pnpm start
```
服务将在 http://localhost:4200 启动\
前端 /api 的开发代理已经配置好，在浏览器中打开上述网址即可直接使用


##### VS Code debug

如果你使用 VS Code，.vscode 文件夹下有示例的前后端调试配置，删去 .example 后缀后可以直接使用

### 部署项目

考虑到本项目在**龙芯上部署**的性质，没有配置 docker compose 而是使用原生部署

完成**前述 前端、后端、数据库 配置**后，使用如下命令打包前端

```bash
pnpm run publish
```

命令会自动修复 monaco 问题并精简其语言配置文件，输出产物在 frontend\dist 下

后端依旧使用 `python run.py` 或 `nohup python3 run.py > backend.log 2>&1 &` 启动\
配合 nginx 等反代工具将 /api 代理到后端的 8000 端口即可。\
nginx 配置可以参考 [nginx.conf](project/assets/nginx.conf)

本项目在内网环境下实现了[基于 GitHub Action 的 CI/CD devOps](.github/workflows/deploy-matrix-ai-on-loongarch.yml)，也可以作为参考

经过**龙芯 3A6000** 主板本机**实机运行**，本项目的**所有功能均能正常运行在龙芯平台上**

## 📝 使用指南

### 页面介绍

1. 主页
   路径 / 或 /home\
   展示 banner 以及学生的待办作业\
   (为了演示前端没有实现只显示未完成作业的逻辑而是全部展示)

   在主页点击 Todo-List 中的作业可以直接跳转到对应作业下开始作答。\
   右栏也可以跳转到进行中的课程

2. 课程页与课程详细页
   点击顶栏的 “课程” tab 进入课程页面，此处展示所有课程，再次点击即可进入课程详细页，其中展示了课程下的所有作业

3. 实时编程作业页
   作业页分为两栏

   左栏为信息栏，包含三个标签页如下：
   1. 描述 tab：当前题目的描述信息，包含了题目要求以及输入输出示例
   2. 提交 tab：代码提交情况，包含了当前提交对于题目每个测例的输入输出以及最终得分
   3. AI 分析 tab：项目核心部分，在学生提交了代码且题目已经截止(如果不截止则无该条限制)后展示针对本题的 AI 分析，具体详情见功能介绍部分

   右栏为 Monaco 编辑器，支持基于文本的简单代码自动补全；下方为测试面板与提交按钮，测试面板展开后可以运行当前代码并输入测试数据，服务端在 firejail 沙箱中执行代码后返回结果，提交按钮则提交当前代码并接受题目预设输入测例的测试与打分。
4. 管理页
   本页用于管理课程与题目相关数据，原本不计划用于展示，功能使用需要一定技巧，具体见功能介绍部分

### 功能介绍

1. 代码运行
   点击作业页面右栏下方的测试面板按钮展开测试面板，在测试面板左栏中输入程序的输入，点击运行按钮即可向服务端发送运行请求，\
   运行的结果会在测试面板右栏显示，学生可以基于此判断代码运行是否正确，有效辅助学生进行代码编写。

2. 代码提交
   点击作业页面右栏下方的提交按钮，代表学生对自己的代码有足够的自信选择提交当前代码\
   提交成功后服务端会使用题目的输入测例对学生的代码进行测试，等待测试完成后会返回测试的结果，包含测试得分（使用测例通过百分比计算），各个测例的标准输入、实际输出、期望输出等数据。\
   作业测评全自动运行，测试结果会在左栏的 提交 tab 中展示，有效减轻教师批改负担，同时提供比传统OJ系统更精准的改进指导。

3. AI 分析
   出于教学公平的考虑，AI 分析功能只会在学生提交了代码且题目截止后才会开放（本项目中如果题目没有设置截止日期则 AI 分析是否开放只取决于是否提交），避免学生在作答阶段依赖外部AI工具，保障评测公平性。，AI 分析包含以下内容：
   1. 题目预处理（题目级AI分析）
      包含题目的多个参考题解（AI 生成）与其空间时间复杂度（AI 生成）、知识点分析，帮助学生穿透题目直达本质，更好理解题目，从而写出更快更好的代码。
   2. 提交代码分析（学生级AI诊断）
      包含针对学生代码的质量分析和知识点学习建议，质量分析中穿插对学生历史提交的评价，既之处学生代码长期以来存在的问题，也肯定学生代码质量的改进之处；学习建议中则结合当前题目与学生历史提交中展现的缺失知识点，给予学生明确的知识点学习方向建议，帮助学生拓展视野，助力学生自主提高代码能力。

4. 管理页面
   本页主要用于观察课程与题目数据，管理员可以在此添加课程和作业。

   对于添加作业，需要在下方列表中点击单一课程复制其课程 id 后，复制到 添加作业 模态框中的课程 ID，随后继续完成作业其它相关信息的填写即可，信息填写要求如页面中所示

   另外 添加作业 模态框中支持使用类似如下结构的内容快捷填写作业信息，
   ```
    C++字符串
    ---
    # 要求
    输入一个字符串，返回其长度
    ---
    #include<iostream>
    using namespace std;
    int main(){
      return 0;
    }
    ---
    a|abc
    ---
    1|3
   ```
   将包含上诉内容的文本粘贴到模态框（此时输入焦点不要在任意输入框上）或者将包含上述内容的文件拖拽到模态框，即可进行自动解析和填写，方便快速添加作业

   部分预设的可录入题目数据见 [c-input.txt](project\assets\assignTemplate\c-input.txt)

## 🔧 开发指南

### 项目结构

```text
AI-matrix/
├── backend/                 # 后端服务
│   ├── app/
│   │   ├── controller/     # 业务控制层
│   │   ├── models/         # 数据模型
│   │   ├── routers/        # API 路由
│   │   ├── schemas/        # 数据验证模式
│   │   ├── utils/          # 工具函数
│   │   └── constants/      # 常量配置
│   ├── docs/               # 文档
│   └── tests/              # 简略的测试用例
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/      # 页面组件
│   │   │   ├── services/   # 业务服务
│   │   │   ├── api/        # API 接口
│   │   │   └── shared/     # 共享组件
│   │   └── assets/         # 静态资源
│   ├── public/             # 公共资源
│   └── scripts/            # 构建脚本
└── project/                # 项目资源
    ├── assets/             # 项目资产
    └── docs/               # 项目文档
```

<!-- ### API 接口

#### 课程管理

- `GET /courses` - 获取课程列表
- `POST /courses` - 创建新课程
- `GET /courses/{course_id}` - 获取课程详情
- `PUT /courses/{course_id}` - 更新课程信息
- `DELETE /courses/{course_id}` - 删除课程

#### 作业管理

- `GET /courses/{course_id}/assignments` - 获取作业列表
- `POST /courses/{course_id}/assignments` - 创建作业
- `GET /courses/{course_id}/assignments/{assign_id}` - 获取作业详情
- `POST /courses/{course_id}/assignments/{assign_id}/submit` - 提交作业

#### AI 分析

- `GET /courses/{course_id}/assignments/{assign_id}/analysis/basic` - 获取基础分析
- `GET /courses/{course_id}/assignments/{assign_id}/analysis/aiGen` - 生成 AI 分析 -->

## 🤝 贡献指南

1. Fork 此仓库
2. 创建功能分支 (`git checkout -b dev/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin dev/AmazingFeature`)
5. 开启 Pull Request

<!-- ## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。 -->

## 🔗 相关链接

- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [Angular 文档](https://angular.io/)
- [Ant Design Angular](https://ng.ant.design/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [openGauss 数据库](https://opengauss.org/)

⭐ 如果这个项目对你有帮助，请给我们一个星标！
