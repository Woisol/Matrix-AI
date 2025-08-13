#!/usr/bin/env python3
"""
课程OJ平台启动脚本
"""
import uvicorn
import os
import sys

# 添加项目根目录到Python路径
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

if __name__ == "__main__":
    # 启动FastAPI应用
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=[project_root]
    )
