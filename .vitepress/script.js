const fs = require('fs');
const path = require('path');

// 读取.gitignore文件并创建一个包含所有忽略路径的集合
const gitignore = fs.readFileSync('.gitignore', 'utf-8').split('\n')
    .filter(line => line.trim() !== '' && !line.startsWith('#'))
    .reduce((acc, curr) => {
        acc.push(path.resolve(curr));
        return acc;
    }, new Array());

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const absolutePath = path.resolve(file);
        // 如果这个路径在.gitignore中，就跳过
        if (gitignore.some(item => absolutePath.startsWith(item))) {
            return;
        }
        const stat = fs.statSync(file);
        if (stat) {
            if (stat.isDirectory()) {
                const items = walkDir(file);
                if (items.length > 0) {
                    results.push({
                        text: path.basename(file),
                        collapsed: true,
                        items: items
                    });
                }
            } else {
                if (['/api-examples.md', '/index.md', '/markdown-examples.md'].some(item => file.replace('./', '') === item)) return
                if (path.extname(file) === '.md') {
                    results.push({
                        text: path.basename(file, '.md'),
                        link: file.replace('./', '')
                    });
                }
            }
        }
    });
    return results;
}

const sidebar = walkDir('./'); // replace './' with your directory
fs.writeFileSync('.vitepress/sidebar.ts', 'export default ' + JSON.stringify(sidebar, null, 4));
console.log('Generated sidebar.ts successfully!');
