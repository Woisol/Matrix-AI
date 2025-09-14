#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { TypeScriptParser } from './parser.js';
import { PydanticGenerator, GeneratorConfig } from './generator.js';

// 简化的转换器，只处理业务类型
class SimpleConverter {
  public async convert(): Promise<void> {
    try {
      console.log('🎯 简化类型转换器启动...');
      
      // 只处理业务类型文件
      const typeFiles = [
        path.resolve('../../frontend/src/app/api/type/general.d.ts'),
        path.resolve('../../frontend/src/app/api/type/assigment.d.ts'),
        path.resolve('../../frontend/src/app/api/type/course.d.ts')
      ];
      
      console.log('📁 处理类型文件:');
      typeFiles.forEach(file => console.log(`   - ${path.basename(file)}`));
      
      const parser = new TypeScriptParser(typeFiles);
      const allTypes = parser.parseFiles();
      
      // 过滤出我们需要的业务类型
      const businessTypes = allTypes.filter(type => {
        const businessTypeNames = [
          'ID', 'CourseId', 'AssignId',
          'MdContent', 'MdCodeContent', 'CodeContent', 'JSONStr',
          'CodeLanguage', 'SubmitScoreStatus',
          'CodeFileInfo', 'TestSample', 'Submit', 'Complexity',
          'AssignData', 'AssignTransProps',
          'BasicAnalysis', 'AiGenAnalysis', 'Analysis',
          'AllCourse', 'TodoCourse', 'AssignmentListItem', 'CourseTransProps'
        ];
        return businessTypeNames.includes(type.name);
      });
      
      console.log('📝 找到业务类型:');
      businessTypes.forEach(type => console.log(`   - ${type.name} (${type.kind})`));
      
      // 生成配置
      const config: GeneratorConfig = {
        typeMapping: {
          "string": "str",
          "number": "float", 
          "boolean": "bool",
          "Date": "datetime"
        },
        customTypes: {
          "MdContent": {
            "pythonType": "str",
            "field": "Field(..., description='Markdown内容')"
          },
          "MdCodeContent": {
            "pythonType": "str",
            "field": "Field(..., description='Markdown代码内容，注意包含```xxx```')"
          },
          "CodeContent": {
            "pythonType": "str",
            "field": "Field(..., description='代码内容')"
          },
          "JSONStr": {
            "pythonType": "str",
            "field": "Field(..., description='JSON字符串')"
          },
          "ID": {
            "pythonType": "str",
            "field": "Field(..., description='唯一标识符')"
          }
        },
        enumTypes: {
          "CodeLanguage": {
            "values": ["c_cpp"],
            "baseType": "str"
          },
          "SubmitScoreStatus": {
            "values": ["not_submitted", "not_passed", "passed", "full_score"],
            "baseType": "str"
          }
        },
        imports: [
          "from pydantic import BaseModel, Field",
          "from enum import Enum",
          "from typing import Optional, List, Dict, Union, Annotated",
          "from datetime import datetime"
        ]
      };
      
      const generator = new PydanticGenerator(config);
      const pythonCode = generator.generateModels(businessTypes);
      
      // 写入文件
      const outputPath = path.resolve('./out/business_types.py');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      
      const finalCode = `# -*- coding: utf-8 -*-
\"\"\"
AI-Matrix 业务类型定义
从 TypeScript 类型转换而来

生成时间: ${new Date().toISOString()}
\"\"\"

${pythonCode}`;
      
      fs.writeFileSync(outputPath, finalCode, 'utf-8');
      
      console.log(`✅ 转换完成! 输出文件: ${outputPath}`);
      console.log(`📊 生成了 ${businessTypes.length} 个业务模型`);
      
    } catch (error) {
      console.error('❌ 转换失败:', error);
      process.exit(1);
    }
  }
}

// 运行转换器
const converter = new SimpleConverter();
converter.convert();