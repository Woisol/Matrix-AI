//@ts-check
const fs = require('fs');
const path = require('path');


const monacoLanguages = path.join(__dirname, '../dist/matrix-ai-frontend/browser/assets/monaco-editor/vs/basic-languages');
//! 出现了，不加 ; 导致后面的 () 被认为是函数调用()
const saveLanguages = ['cpp'];
/**
 * 清理 Monaco Editor 语言定义文件
 */

(() => {
  fs.readdirSync(monacoLanguages).forEach(file => {
    const filePath = path.join(monacoLanguages, file);
    if (!saveLanguages.includes(file.replace('.json', ''))) {
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  });
})();

console.log('✅ 已清理多余 Monaco Editor 语言定义文件，仅保留:', saveLanguages.join(', '));