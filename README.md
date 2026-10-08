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

[[History/笔记/汉王朝]]
[[History/笔记/汉王朝#关键事件|汉代事件]]
[标准链接](../History/笔记/汉王朝.md#关键事件)
```

ID 使用包含 `.md` 的完整相对路径。内部 Markdown 链接和 Wiki 链接共用解析规则；同名或同别名无法唯一解析时保留为未解析链接。代码、代码块和公式中的链接示例不形成关系。既有分期锚点和页面重定向继续保留。

History 包含 42 篇实体笔记、6 篇主题笔记、6 篇分期文章和 4 篇书籍阅读路径；迁移保留 171 条事件和原有 130 条关系说明。历史来源与观点线索保留在正文中。旧 History 数据数组和固定 SVG 图谱已经移除。

## 阅读工作台

- `Ctrl/Cmd+O`：笔记快速切换；修饰键加 Enter 在新标签页打开。
- `Ctrl/Cmd+P`：命令面板；`Ctrl/Cmd+F`：全文搜索。
- 内部链接悬停或键盘聚焦时显示预览；修饰键点击在新标签页打开。
- 左右分隔条可拖动，也可以用方向键调整。窄屏侧栏使用抽屉。
- 标签页、主题、侧栏宽度、目录展开状态、局部图深度和图谱设置保存在此浏览器。
- `?embed=true` 或 iframe 中仅显示正文及互动演示。

## 图谱

Canvas 2D 与 D3-force 按真实笔记链接布局。默认显示笔记和孤立节点，隐藏标签、附件和箭头；距离不表示年代或因果。

- 拖动圆点调整位置，拖动背景平移，滚轮缩放，双指缩放与平移。
- 聚焦画布后 `+/-` 缩放，方向键平移，`Home` 或 `0` 适合屏幕；节点列表提供键盘等价操作。
- 过滤支持普通文字、`path:History/`、`path:"Design Patterns/"`、`tag:历史`，以及 `-path:Tools/` 排除。
- 设置面板提供过滤、颜色分组、显示与四类力参数。全局图、目录筛选图与局部图分别保存设置。
- 局部图可查看一至五层邻居及等价节点列表；隐藏视图和浏览器后台暂停模拟。

## 代码入口

- `.vitepress/vault/`：类型、解析、构建索引、搜索、图谱关系与状态恢复。
- `.vitepress/theme/components/vault/`：阅读工作台、文件树与 Canvas 图谱。
- `tests/vault.test.mjs`：解析、搜索、关系、历史迁移与恢复测试。
- `tests/preview.test.mjs`：生产产物的直接访问与嵌入查询路径测试。

全文索引和图谱绘制代码按需加载。已有设计、AI、摄影 Vue 演示继续在 VitePress 正文中运行。添加本地附件后，构建流程会保留公开资源并复制其他被引用的附件到静态产物。
