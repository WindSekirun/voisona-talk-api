import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsApiDir = path.join(__dirname, '../docs/api');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

// 1. Rename README.md to index.md
const readmePath = path.join(docsApiDir, 'README.md');
const indexPath = path.join(docsApiDir, 'index.md');

if (fs.existsSync(readmePath)) {
  fs.renameSync(readmePath, indexPath);
  console.log('Renamed README.md to index.md');
}

// 2. Replace all occurrences of "README.md" with "index.md" in all markdown files
walk(docsApiDir, (filePath) => {
  if (filePath.endsWith('.md')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('README.md')) {
      content = content.replace(/README\.md/g, 'index.md');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated links in: ${path.relative(docsApiDir, filePath)}`);
    }
  }
});
