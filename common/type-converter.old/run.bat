@echo off
echo.
echo ==================================================
echo    AI-Matrix TypeScript to Pydantic 转换工具    
echo ==================================================
echo.

echo 🎯 启动业务类型转换...
call pnpm run build

echo.
echo 🔄 开始转换业务类型...
node dist/simple-converter.js

echo.
echo 📁 生成的文件:
echo    - out/business_types.py (核心业务类型)
echo    - out/types_generated.py (完整类型，包含系统类型)
echo.

echo ✅ 转换完成！
echo.
echo 💡 使用建议:
echo    1. 将 business_types.py 复制到后端项目
echo    2. 根据需要调整类型定义
echo    3. 运行 'pnpm run convert' 重新生成全量类型
echo.
pause