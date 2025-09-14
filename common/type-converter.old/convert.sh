#!/bin/bash

echo "🚀 AI-Matrix 类型转换工具"
echo

# 检查 Node.js 环境
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查项目依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖中..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "❌ 错误: 依赖安装失败"
        exit 1
    fi
fi

# 构建项目
echo "🔨 构建项目中..."
pnpm run build
if [ $? -ne 0 ]; then
    echo "❌ 错误: 项目构建失败"
    exit 1
fi

# 运行转换
echo "🔄 开始类型转换..."
pnpm run test
if [ $? -ne 0 ]; then
    echo "❌ 错误: 类型转换失败"
    exit 1
fi

echo
echo "✅ 转换完成！"
echo "📁 输出文件位置: backend/app/schemas/generated/types_generated.py"
echo