import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保 dist 目录存在
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// 构建项目
console.log('构建项目...');
execSync('npm run build', { stdio: 'inherit' });

// 复制 manifest.json 到 dist 目录
console.log('复制 manifest.json 到 dist 目录...');
fs.copyFileSync('manifest.json', path.join('dist', 'manifest.json'));

// 复制图标文件
console.log('复制图标文件...');
fs.copyFileSync(
  path.join('public', 'vite.svg'),
  path.join('dist', 'vite.svg')
);

console.log('扩展构建完成！');