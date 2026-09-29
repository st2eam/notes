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
    // Keep navigation stable across macOS and Linux directory enumeration.
    const list = fs.readdirSync(dir).sort((a, b) => {
        if (path.resolve(dir) === path.resolve('./History')) {
            const order = ['index.md', '文明起源.md', '古典时期.md', '后古典时期.md', '早期近代.md', '近现代.md', '当代.md'];
            const aIndex = order.indexOf(a);
            const bIndex = order.indexOf(b);
            if (aIndex !== -1 || bIndex !== -1) return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
        }
        return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
    });
    list.forEach(function (file) {
        if (file.startsWith('.')) return;
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
                        text: path.normalize(file) === 'History/index.md' ? '历史图谱' : path.basename(file, '.md') === 'LLM Wiki 可视化教程' ? 'LLM Wiki' : path.basename(file, '.md'),
                        link: path.normalize(file) === 'History/index.md' ? '/History/' : file.replace('./', '')
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
