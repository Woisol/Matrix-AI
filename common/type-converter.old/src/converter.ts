#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { TypeScriptParser } from './parser.js';
import { PydanticGenerator, GeneratorConfig } from './generator.js';

interface Config {
  input: {
    typeDir: string;
    files: string[];
  };
  output: {
    dir: string;
    filename: string;
  };
  typeMapping: Record<string, string>;
  customTypes: Record<string, { pythonType: string; field: string }>;
  enumTypes: Record<string, { values: string[]; baseType: string }>;
  imports: string[];
}

class TypeConverter {
  private config: Config;
  private projectRoot: string;

  constructor(configPath: string = './config.json') {
    this.projectRoot = path.dirname(configPath);

    console.log(`📋 读取配置文件: ${configPath}`);
    console.log(`📁 项目根目录: ${this.projectRoot}`);

    if (!fs.existsSync(configPath)) {
      throw new Error(`配置文件不存在: ${configPath}`);
    }

    const configContent = fs.readFileSync(configPath, 'utf-8');
    this.config = JSON.parse(configContent);

    console.log('✓ 配置文件加载成功');
  }

  public async convert(): Promise<void> {
    try {
      console.log('🚀 开始转换 TypeScript 类型到 Pydantic...');

      // 1. 解析 TypeScript 文件
      const typeFiles = this.getTypeFiles();
      console.log(`📁 找到 ${typeFiles.length} 个类型文件:`);
      typeFiles.forEach(file => console.log(`   - ${path.basename(file)}`));

      if (typeFiles.length === 0) {
        throw new Error('没有找到有效的类型文件');
      }

      const parser = new TypeScriptParser(typeFiles);
      const types = parser.parseFiles();
      console.log(`📝 解析到 ${types.length} 个类型定义`);
      types.forEach(type => console.log(`   - ${type.name} (${type.kind})`));

      // 2. 生成 Pydantic 代码
      const generatorConfig: GeneratorConfig = {
        typeMapping: this.config.typeMapping,
        customTypes: this.config.customTypes,
        enumTypes: this.config.enumTypes,
        imports: this.config.imports
      };

      const generator = new PydanticGenerator(generatorConfig);
      const pythonCode = generator.generateModels(types);

      // 3. 写入输出文件
      const outputPath = this.getOutputPath();
      console.log(`📤 输出路径: ${outputPath}`);

      this.ensureOutputDir(outputPath);

      const finalCode = this.addFileHeader(pythonCode);
      fs.writeFileSync(outputPath, finalCode, 'utf-8');

      console.log(`✅ 转换完成! 输出文件: ${outputPath}`);
      console.log(`📊 生成了 ${types.length} 个 Python 模型`);
      console.log(`📄 代码行数: ${finalCode.split('\\n').length}`);

    } catch (error) {
      console.error('❌ 转换失败:', error);
      process.exit(1);
    }
  }

  private getTypeFiles(): string[] {
    const typeDir = path.resolve(this.projectRoot, this.config.input.typeDir);
    console.log(`🔍 类型文件目录: ${typeDir}`);

    if (!fs.existsSync(typeDir)) {
      throw new Error(`类型文件目录不存在: ${typeDir}`);
    }

    const files: string[] = [];

    for (const fileName of this.config.input.files) {
      const filePath = path.join(typeDir, fileName);
      console.log(`🔍 检查文件: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  类型文件不存在，跳过: ${fileName}`);
        continue;
      }

      files.push(filePath);
      console.log(`✓ 找到文件: ${fileName}`);
    }

    return files;
  }

  private getOutputPath(): string {
    const outputDir = path.resolve(this.projectRoot, this.config.output.dir);
    return path.join(outputDir, this.config.output.filename);
  }

  private ensureOutputDir(outputPath: string): void {
    const dir = path.dirname(outputPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 创建输出目录: ${dir}`);
    }
  }

  private addFileHeader(code: string): string {
    const header = `# -*- coding: utf-8 -*-
\"\"\"
自动生成的 Pydantic 模型
从 TypeScript 类型定义转换而来

生成时间: ${new Date().toISOString()}
生成工具: TypeScript to Pydantic Converter

⚠️  警告: 此文件由工具自动生成，请勿手动编辑！
如需修改，请编辑 TypeScript 类型定义文件，然后重新运行转换工具。
\"\"\"

`;

    return header + code;
  }

  public static async run(): Promise<void> {
    const configPath = process.argv[2] || './config.json';
    console.log(`🎯 启动类型转换器，配置文件: ${configPath}`);

    try {
      const converter = new TypeConverter(configPath);
      await converter.convert();
    } catch (error) {
      console.error('❌ 程序执行失败:', error);
      process.exit(1);
    }
  }
}

// 直接运行，简化逻辑
console.log('🎯 启动转换脚本...');
TypeConverter.run();

export { TypeConverter };