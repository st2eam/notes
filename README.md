# Steam's Notes

基于 VitePress、Markdown 和 GitHub Pages 的网页知识库。全站采用 Obsidian 默认主题风格的阅读工作台；提供文件树、多标签页、全文搜索、双向链接与力导向图谱。内容在本地修改后发布，不提供在线编辑或账号同步。

## 本地使用

```sh
npm ci --registry=https://registry.npmjs.org
npm run docs:dev
npm test
npm run docs:build
npm run docs:preview
```

生产预览地址是 `http://127.0.0.1:4173/notes/`。预览服务按文件系统读取静态产物，兼容 macOS 上 `public/photography` 与 `Photography` 目录的大小写合并。GitHub Pages 使用已有 `.github/workflows/deploy.yml`，推送 `main` 后构建和发布 `docs/`。

## 维护笔记与链接

Markdown 是正文和图谱关系的唯一来源。各模块的 `index.md` 是可见的目录笔记；新增笔记后请把它加入相应总览。构建时扫描笔记生成元数据、文件树、全文索引和链接关系；隐藏目录、依赖、缓存、构建产物和 VitePress 示例页不进入知识库索引。

```md
---
aliases: [别名]
tags: [历史, 学习]
---

# 笔记标题

[[历史/政权与制度/汉王朝]]
[[历史/政权与制度/汉王朝#关键事件|汉代事件]]
[标准链接](../历史/政权与制度/汉王朝.md#关键事件)
```

ID 使用包含 `.md` 的完整相对路径。内部 Markdown 链接和 Wiki 链接共用解析规则；同名或同别名无法唯一解析时保留为未解析链接。代码、代码块和公式中的链接示例不形成关系。既有分期锚点和页面重定向继续保留。

History 包含 42 篇实体笔记、6 篇主题笔记、6 篇分期文章和 4 篇书籍阅读路径；迁移保留 171 条事件和原有 130 条关系说明。历史来源与观点线索保留在正文中。旧 History 数据数组和固定 SVG 图谱已经移除。

## 阅读工作台

- `Ctrl/Cmd+O`：笔记快速切换；修饰键加 Enter 在新标签页打开。
- `Ctrl/Cmd+P`：命令面板；`Ctrl/Cmd+F`：全文搜索。
- 内部链接悬停或键盘聚焦时显示预览；修饰键点击在新标签页打开。
- 左右分隔条可拖动，也可以用方向键调整。窄屏侧栏使用抽屉。
- 标签页、主题、侧栏宽度、目录展开状态、局部图深度和图谱设置保存在此浏览器。
- `?embed=true` 或 iframe 中使用紧凑阅读布局，保留“笔记”文件切换、“目录”小节跳转及主题按钮；切换笔记会保留嵌入参数。iframe 阅读区宽度大于 760px 时，目录常驻左侧并为正文预留空间；窄屏目录继续使用抽屉。
- 嵌入背景默认透明；`background=theme` 使用当前主题底色。`theme=light` / `theme=dark` 指定配色，默认 `theme=auto` 同步同源父页面的 `dark` 类、`data-theme` / `data-color-mode` 或 `color-scheme`；无法读取父页面时跟随系统主题。
- 跨域 iframe 无法直接读取父页面的样式。父页面可在地址中传主题参数，或使用下方消息协议动态同步；通过 `parentOrigin` 指定父页面来源（省略时使用 Referrer，Referrer 不可用时仅信任站点同源）。

```html
<iframe id="notes" src="https://st2eam.github.io/notes/历史/政权与制度/汉王朝.html?embed=true&background=transparent&parentOrigin=https%3A%2F%2Fyour-site.example"></iframe>
```

```js
const frame = document.querySelector('#notes');
const notesOrigin = 'https://st2eam.github.io';
function syncNotesTheme() {
  frame.contentWindow.postMessage({
    type: 'notes:embed-config',
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    background: 'transparent', // 改成 'theme' 可使用笔记主题底色
  }, notesOrigin);
}
window.addEventListener('message', (event) => {
  if (event.source === frame.contentWindow && event.origin === notesOrigin && event.data?.type === 'notes:embed-ready') syncNotesTheme();
});
// 父页面切换主题后再次调用 syncNotesTheme()。
```


## 图谱

Canvas 2D 与 D3-force 按真实笔记链接布局。默认显示笔记和孤立节点，隐藏标签、附件和箭头；距离不表示年代或因果。

- 拖动圆点调整位置，拖动背景平移，滚轮缩放，双指缩放与平移。
- 聚焦画布后 `+/-` 缩放，方向键平移，`Home` 或 `0` 适合屏幕；节点列表提供键盘等价操作。
- 过滤支持普通文字、`path:历史/`、`category:"计算机与软件/架构/设计模式"`、`tag:历史`，以及 `-path:Tools/` 排除。
- 设置面板提供过滤、颜色分组、显示与四类力参数。全局图、目录筛选图与局部图分别保存设置。
- 局部图可查看一至五层邻居及等价节点列表；隐藏视图和浏览器后台暂停模拟。

## 代码入口

- `.vitepress/vault/`：类型、解析、构建索引、搜索、图谱关系与状态恢复。
- `.vitepress/theme/components/vault/`：阅读工作台、文件树与 Canvas 图谱。
- `tests/vault.test.mjs`：解析、搜索、关系、历史迁移与恢复测试。
- `tests/preview.test.mjs`：生产产物的直接访问与嵌入查询路径测试。

全文索引和图谱绘制代码按需加载。已有设计、AI、摄影 Vue 演示继续在 VitePress 正文中运行。添加本地附件后，构建流程会保留公开资源并复制其他被引用的附件到静态产物。


## 分类与语义关系

目录按七个领域组织，每篇笔记的 `primaryCategory` 决定实体文件位置；`categories` 列出主分类与交叉分类，每项含 `path`、`reason`。`classificationStatus: provisional` 表示正文尚不足以确认。`tags` 用于人物、时代、语言或框架实体，不替代分类。

`relations` 保存在 Markdown frontmatter，每项包含 `target`（完整笔记路径）、`type`（citation/similar/subordinate/causal）、`label`、`reason`、`evidence`、`status`（confirmed/inferred）。相似关系无方向；其余关系有方向。因果必须有可核查证据。普通正文链接继续生成引用，分类声明生成从属关系；同一目标可保留不同语义。

工作台左栏“分类浏览”显示交叉归属，右栏展示分类理由与关系证据。图谱可筛选分类、关系类型及确认状态；搜索支持 `category:历史/主题/交流与贸易`。旧目录筛选会转换为新路径或 `origin:` 原路径筛选，旧页面保留查询和锚点后跳到新页面。

完整整理清单与证据位于 `.vitepress/reports/reclassification.md`，机器可读记录在同目录 `classification.json`。该目录不参与页面发布或图谱扫描。`migration-paths.mjs` 是旧笔记身份映射，不是内容或图谱的第二份来源。
