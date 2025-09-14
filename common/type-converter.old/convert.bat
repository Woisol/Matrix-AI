@echo off
echo 🚀 AI-Matrix 类型转换工具
echo.

REM 检查 Node.js 环境
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

REM 检查项目依赖
if not exist "node_modules" (
    echo 📦 安装依赖中...
    call pnpm install
    if %errorlevel% neq 0 (
        echo ❌ 错误: 依赖安装失败
        pause
        exit /b 1
    )
)

REM 构建项目
echo 🔨 构建项目中...
call pnpm run build
if %errorlevel% neq 0 (
    echo ❌ 错误: 项目构建失败
    pause
    exit /b 1
)

REM 运行转换
echo 🔄 开始类型转换...
call pnpm run test
if %errorlevel% neq 0 (
    echo ❌ 错误: 类型转换失败
    pause
    exit /b 1
)

echo.
echo ✅ 转换完成！
echo 📁 输出文件位置: backend\app\schemas\generated\types_generated.py
echo.
pause