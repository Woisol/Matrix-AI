#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 修复 Monaco Editor ESM 模块中的 CSS import 问题
 * 移除所有的 import '*.css' 语句
 */
function fixMonacoEditor() {
  console.log('正在修复 Monaco Editor CSS import 问题...');

  // 递归查找所有 Monaco Editor ESM 模块中的 JS 文件
  const monacoEsmDir = 'node_modules/monaco-editor/esm';

  if (!fs.existsSync(monacoEsmDir)) {
    console.log('ℹ️ Monaco Editor ESM 目录不存在，跳过修复');
    return;
  }

  let fixedCount = 0;

  function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');

          // 移除 CSS import 语句的正则表达式
          const cssImportRegex = /^import\s+['"][^'"]*\.css['"];?\s*$/gm;

          if (cssImportRegex.test(content)) {
            const fixedContent = content.replace(cssImportRegex, '');
            fs.writeFileSync(fullPath, fixedContent, 'utf8');
            fixedCount++;
            console.log(`已修复: ${fullPath}`);
          }
        } catch (error) {
          console.error(`修复文件时出错 ${fullPath}:`, error.message);
        }
      }
    }
  }

  processDirectory(monacoEsmDir);

  if (fixedCount > 0) {
    console.log(`✅ 成功修复了 ${fixedCount} 个文件`);
  } else {
    console.log('ℹ️ 没有找到需要修复的文件');
  }
}

// 检查是否在正确的目录中
if (!fs.existsSync('node_modules/monaco-editor')) {
  console.log('ℹ️ Monaco Editor 未安装，跳过修复');
  process.exit(0);
}

fixMonacoEditor();
