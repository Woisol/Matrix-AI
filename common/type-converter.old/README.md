# TypeScript to Pydantic Converter

AI-Matrix 项目的类型转换工具，将 TypeScript 类型定义自动转换为 Python Pydantic 模型。

## 功能特性

- 🔄 **自动转换**: 从 TypeScript 接口和类型别名生成 Pydantic 模型
- 📝 **注释保持**: 保留 TypeScript 注释并转换为 Python 文档
- 🏷️ **类型映射**: 智能映射 TypeScript 类型到 Python 类型
- 🔧 **自定义配置**: 支持自定义类型映射和生成规则
- 📦 **枚举支持**: 完整支持 TypeScript 枚举转换
- 🎯 **Field 生成**: 自动生成 Pydantic Field 定义

## 快速开始

### 1. 安装依赖

```bash
cd common/type-converter
pnpm install
```

### 2. 配置类型转换

编辑 `config.json` 文件，配置输入输出路径和类型映射：

```json
{
  "input": {
    "typeDir": "../../frontend/src/app/api/type",
    "files": ["general.d.ts", "assigment.d.ts", "course.d.ts"]
  },
  "output": {
    "dir": "../../backend/app/schemas/generated",
    "filename": "types_generated.py"
  }
}
```

### 3. 运行转换

**Windows:**
```cmd
convert.bat
```

**Linux/macOS:**
```bash
chmod +x convert.sh
./convert.sh
```

**或使用 npm 脚本:**
```bash
pnpm run convert
```

## 项目结构

```
common/type-converter/
├── src/
│   ├── parser.ts        # TypeScript AST 解析器
│   ├── generator.ts     # Pydantic 代码生成器
│   └── converter.ts     # 主转换脚本
├── config.json          # 转换配置文件
├── package.json
├── tsconfig.json
├── convert.bat          # Windows 批处理脚本
├── convert.sh           # Linux/macOS Shell 脚本
└── README.md
```

## 配置说明

### 类型映射 (typeMapping)

```json
{
  "typeMapping": {
    "string": "str",
    "number": "float", 
    "boolean": "bool",
    "Date": "datetime"
  }
}
```

### 自定义类型 (customTypes)

```json
{
  "customTypes": {
    "MdContent": {
      "pythonType": "str",
      "field": "Field(..., description='Markdown内容')"
    }
  }
}
```

### 枚举类型 (enumTypes)

```json
{
  "enumTypes": {
    "CodeLanguage": {
      "values": ["c_cpp"],
      "baseType": "str"
    }
  }
}
```

## 转换示例

**TypeScript 输入:**

```typescript
export type CodeLanguage = 'c_cpp' | 'javascript' | 'typescript';

export interface AssignData {
  assignId: string;
  title: string;
  description?: string;
  ddl?: Date;
  submit?: Submit;
}
```

**Python 输出:**

```python
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
from datetime import datetime

class CodeLanguage(str, Enum):
    C_CPP = "c_cpp"
    JAVASCRIPT = "javascript" 
    TYPESCRIPT = "typescript"

class AssignData(BaseModel):
    assignId: str = Field(..., description='唯一标识符')
    title: str = Field(...)
    description: Optional[str] = None
    ddl: Optional[datetime] = None
    submit: Optional[Submit] = None
```

## 开发指南

### 构建项目

```bash
pnpm run build
```

### 开发模式

```bash
pnpm run dev
```

### 监听文件变化

```bash
pnpm run watch
```

### 清理构建文件

```bash
pnpm run clean
```

## 注意事项

1. **文件路径**: 确保配置文件中的路径正确
2. **依赖版本**: 需要 Node.js 16+ 和 TypeScript 5+
3. **类型复杂性**: 复杂的泛型类型可能需要手动调整
4. **导入依赖**: 生成的 Python 文件可能需要额外的导入语句

## 故障排除

### 常见错误

1. **找不到模块 "typescript"**
   ```bash
   pnpm install typescript @types/node
   ```

2. **配置文件路径错误**
   - 检查 `config.json` 中的相对路径是否正确

3. **生成的代码语法错误**
   - 检查 TypeScript 源文件是否有语法错误
   - 确认自定义类型映射配置正确

### 调试技巧

```bash
# 查看详细错误信息
pnpm run dev -- --verbose

# 只解析不生成
pnpm run dev -- --parse-only
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 发起 Pull Request

## 许可证

MIT License