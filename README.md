# Steam's Notes

基于 VitePress、Markdown 和 GitHub Pages 的网页知识库。全站采用 Obsidian 默认主题风格的阅读工作台，提供文件树、分类浏览、多标签页、全文搜索、双向链接、力导向图谱与右键菜单。内容在本地修改后发布，不提供在线编辑或账号同步。

## 本地使用

使用 Node.js 20，与 GitHub Pages 构建环境保持一致。

```sh
npm ci --registry=https://registry.npmjs.org
npm run docs:dev
npm test
npm run docs:build
npm run docs:preview
```

开发地址默认是 `http://localhost:5173/notes/`，生产预览地址是 `http://127.0.0.1:4173/notes/`。预览服务按文件系统读取静态产物，兼容 macOS 上 `public/photography` 与 `Photography` 目录的大小写合并。GitHub Pages 使用 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)，推送 `main` 后构建和发布 `docs/`。

`npm test` 使用 Node.js 内置测试运行器，覆盖链接解析、分类与语义关系、工作区恢复、右键菜单 URL 与定位、关联图谱、嵌入、PWA 及交互演示模型。`npm run docs:build` 验证 Vue 编译与静态页面生成，并生成重定向、附件和离线资源。界面交互需在实际浏览器中验证，包括右键目标、键盘导航、关联节点范围、窄屏和 iframe。

## PWA 安装与离线阅读

生产构建支持 PWA，发布后可通过浏览器安装到桌面或手机。Chrome / Edge 可使用地址栏安装入口或站内“安装”提示；iPhone / iPad 在 Safari 的分享菜单中选择“添加到主屏幕”。安装和离线支持需要 HTTPS，本地生产预览的 localhost 地址也可使用。

首次联网访问后，后台缓存首页、阅读工作台、全文索引和笔记脚本；缓存完成后支持离线启动、搜索及阅读已访问的笔记。笔记页面与不超过 5 MB 的同源附件按访问缓存，最多保留 200 项；未缓存页面在离线时显示返回首页的提示，外部资源和大型附件仍需联网。浏览器可能清理缓存，离线内容不替代源文件备份。

发布新版本后，应用提示“新版本已准备好”，点击“刷新更新”切换版本并刷新已打开的应用页面。开发模式不注册 Service Worker；修改 PWA 后使用 `npm run docs:build` 和 `npm run docs:preview` 验证。构建末尾生成 `docs/sw.js`，缓存版本由发布内容决定；Manifest、图标和 Worker 的作用域均限定在 `/notes/`，兼容现有 GitHub Pages 部署。

## 维护笔记与链接

Markdown 是正文和图谱关系的唯一来源。各模块的 `index.md` 是目录笔记，目前隐藏文件夹中的总览入口，保留源文件；新增笔记后请把它加入相应总览。构建时扫描笔记生成元数据、文件树、全文索引和链接关系；隐藏目录、依赖、缓存、构建产物和 VitePress 示例页不进入知识库索引。

```md
---
aliases: [别名]
tags: [历史, 学习]
---

# 笔记标题

[[历史/中国史/三国/司马昭之心]]
[[历史/中国史/三国/挟天子以令诸侯|汉末政治安排]]
[标准链接](/历史/中国史/秦/事件/秦灭六国.md)
```

ID 使用包含 `.md` 的完整相对路径。内部 Markdown 链接和 Wiki 链接共用解析规则；同名或同别名无法唯一解析时保留为未解析链接。代码、代码块和公式中的链接示例不形成关系。既有分期锚点和页面重定向继续保留。

历史按中国史和世界史组织。事件笔记围绕单一事件记录时间、地点与经过，使用 `historyId` 进入时间总览；历史概念、人物总览和文学概念归入相应地区及朝代、时期，不标记 `historyId`。中国史的“司马昭之心”“挟天子以令诸侯”归入三国，记录史料出处、政治背景与词义，保留可核查的来源链接。人物页通过内部链接串联生平事件；中国史各朝代目录下按内容分设 `人物/`、`地点/`、`事件/` 子类，制度、典故和时期综述类笔记仍留在朝代根目录；跨朝代地点归入“历史/中国史/地点”，时期综述、时间线及制度、文学专题文章归入“历史/中国史/专题”，唐宋八大家入口位于“历史/中国史/专题/唐宋八大家”。世界史同样按洲、国家或地区分设 `人物/`、`事件/` 子类（目前没有独立地点笔记），跨地区的综述、时间线和主题文章归入“历史/世界史/专题”。此前迁移的原人物、朝代、分期、主题和书籍阅读汇总保存在 `.vitepress/archive/history-events/`；事件正文保留参考资料名称，不提供外部链接。

## 阅读工作台

- `Ctrl/Cmd+O`：笔记快速切换；修饰键加 Enter 在新标签页打开。
- `Ctrl/Cmd+P`：命令面板；`Ctrl/Cmd+F`：全文搜索。
- 内部链接悬停或键盘聚焦时显示预览；修饰键点击在新标签页打开。
- 左右分隔条可拖动，也可以用方向键调整。窄屏侧栏使用抽屉。
- 手机及窄屏触摸平板使用底部工具栏；按钮点击范围至少为 44×44，窗口为刘海、圆角和底部手势区域预留安全区。文件和辅助侧栏互相避让，支持横屏阅读；搜索输入框使用 16px 字号，避免 iOS 聚焦时自动放大。
- 标签页、主题、侧栏宽度、目录展开状态、局部图深度和图谱设置保存在此浏览器；关联图谱标签页保留各自的目标笔记。

## 关联地点与历史地图

右侧栏顶部显示当前笔记直接引用或通过 `geo.places` 声明的地点；地点笔记也显示自身。点位显示古称与今称，区域显示有来源的 Polygon / MultiPolygon。地图下方的地点列表提供定位、历史形态选择和打开笔记入口；尚缺坐标或边界的关联仍列出待补状态。普通入链、分类关系与间接图谱邻居不自动扩散为地点。

地图使用 Vue 3 与本地打包的 Leaflet 1.9.4，GeoJSON 随站点同源部署，不请求第三方瓦片、在线地理编码、外部字体或地图 CDN，不需要 API 密钥。默认视野包含完整背景疆域及全部关联地点；恢复范围按钮可从单点定位回到全图。

历史疆域包含 Cliopatria（CC BY 4.0）的 33 份代表年份快照，覆盖商周、春秋战国、秦汉、三国、两晋南北朝、隋唐、五代十国、宋辽金夏、元明清和民国；另保留 Historical Basemaps（GPLv3）的 800 年唐代与周边图。现代中国接入 geoBoundaries 的 2019 年 34 个省级行政区参考，世界现代图采用 Natural Earth 国家层。各来源独立保留许可、原始文件、固定版本和重建方法，见 [地理数据来源](public/geo/SOURCES.md)。夏、史前及新朝仍缺少合适的疆域数据；现有图也没有穷尽当时所有地方政权，不以现代省界补画古代疆域。

地点元数据保存在地点笔记的 frontmatter，大型几何放在 `public/geo/`：

```yaml
geo:
  place:
    id: stable-place-id
    kind: point # point / region / polity
    modernName: 现代位置说明 # 不加“今”前缀
    variants:
      - id: historical-site
        name: 历史名称
        from: 618
        to: 907
        coordinates: [108.9, 34.3] # WGS84 [经度, 纬度]；本例仅演示格式
        accuracy: 约略位置
        source:
          title: 定位资料标题
          url: https://example.org/source
```

区域形态用 `geometry: /geo/v1/区域文件.geojson` 代替 `coordinates`，另可提供 `labelCoordinates` 放置标签。`snapshotYear` 标明区域快照的真实年份；其 `from/to` 只用于代表时期匹配，不代表边界在整个时期内不变。没有已核验区域边界时使用 `variants: []`，显示“区域范围待补”，不以现代同名城市或现代省界代替。

事件可使用 `geo.time: {from: 805, to: 805}`、`geo.period: 唐`、`geo.scope: china`，并通过 `geo.places: [{target: 历史/中国史/地点/洛阳.md, variant: 历史形态ID}]` 显式关联。没有独立笔记的地点使用共享目录 ID，不需要建立空白地点页：

```yaml
geo:
  places:
    - target: 历史/中国史/地点/洛阳.md
      variant: sui-tang
    - place: city-paris
    - place: city-beijing
      name: 大都 # 保留本条笔记使用的古称；现代城市坐标只是位置参照
  locationNote: 原文地点说明及关联所代表的角色
  bindingStatus: bound # uncertain 表示古址或发生地点存在考证
  excludePlaces:
    - 历史/中国史/三国/地点/许昌.md # 明确排除的地点不因正文链接重新进入地图
```

`target` 与 `place` 每项只能使用一种。共享实体定义在 `scripts/geo/place-definitions.mjs`，从固定 GeoNames 快照提取城市坐标后生成 `.vitepress/vault/geo-places.mjs`；坐标来源为 GeoNames 及其贡献者，采用 CC BY 4.0，见 [城市数据来源](public/geo/sources/geonames/SOURCES.md)。今址、历史城址与历史行政区分别记录，现代聚落参照不代表古战场或宫殿的精确位置。

年份以负数表示公元前，不使用零年。未显式声明时间时读取 `historyDate`，其次使用明确的朝代信息；跨度较大的笔记可切换显示年份。城址迁移以不同历史形态记录，无法唯一匹配时需手动选择。

批量绑定读取正文中的明确“地点”字段，另检查人物页及《人类简史》笔记的地理内容；正文、非地理 frontmatter、代码示例、文献书名及参考资料不参与改写。复杂地点说明通过 `scripts/geo/location-overrides.mjs` 逐条消歧；已核验的历史形态选择会保留。此过程只在显式运行迁移命令时执行，浏览器不会按关键词猜测地名。

```sh
python3 -I scripts/geo/gazetteer/build.py
node scripts/geo/build-place-catalog.mjs
node scripts/geo/bind-notes.mjs # 预览变更
node scripts/geo/bind-notes.mjs --write # 将绑定写入 Markdown 的 geo 字段
```

共享目录包含未取得合法边界或可靠坐标的实体。这些实体已绑定，但只显示相关地区说明与待补状态；不得将“已绑定”当作“全部可绘制”。无地理信息的笔记不强行绑定位置。

历史疆域先筛选覆盖域、朝代及阶段，再选代表年份；页面同时显示笔记年代与地图参照年份。没有具体事件年份的朝代总览默认选择已有快照，也可切换阶段；精确事件保留原年份。三国按魏蜀吴、魏吴、晋吴和西晋统一后的阶段匹配，汉末图不表示军阀控制区。现代层明确标注行政区参考及资料版本，不把 2019 年省界当成笔记当年的边界。没有对应疆域时显示自然地理底图、已知地点和明确提示，不改用现代行政疆域。底图海岸线反映现代自然地理，不能视为古河道或古海岸线复原。数据未缓存或请求失败时保留地点列表并提供重试。

地图资源按需加载，遵循 PWA 同源运行时缓存；首次离线未缓存的地理文件仍不可用。取消外部地图依赖不能保证 GitHub Pages 在国内网络稳定可达，部署域名仍需实测，也可将同一构建产物部署至国内静态托管。

## 右键菜单

菜单操作针对右键命中的对象，适用于文件树、分类树、工作区标签页、正文普通内部笔记链接和图谱中的笔记节点。

| 目标 | 操作 |
| --- | --- |
| 文件树、分类树中的笔记 | 打开笔记、在新笔记标签页打开、复制链接、查看关联 |
| 文件树、分类树中的目录 | 展开目录或收起目录 |
| 笔记标签页 | 复制链接、查看关联、关闭标签页 |
| 图谱标签页 | 复制链接、关闭标签页 |
| 正文普通内部笔记链接 | 打开笔记、在新笔记标签页打开、复制链接、查看关联 |
| 大图谱、小图谱中的笔记节点，以及大图谱的节点列表 | 打开笔记、在新笔记标签页打开、复制链接、查看关联 |

“在新笔记标签页打开”会激活目标笔记；已有同一笔记的标签页时直接切换。关闭非活动标签页保留当前视图，关闭最后一个标签页回到首页。“查看关联”打开以目标笔记为范围的大图谱，具体范围见下方“图谱”。

可聚焦的菜单目标支持 `Shift+F10` 或菜单键唤起；画布中的笔记节点可通过大图谱节点列表使用键盘操作。菜单内使用上下方向键、`Home` / `End` 移动，`Enter` / 空格执行，`Escape` 取消并恢复焦点，`Tab` 关闭后继续正常焦点流转。点击外部、切换路由、滚动背景或调整窗口大小时关闭菜单；菜单会避让视口边缘。

复制生成包含 `/notes/` 基路径的完整链接，保留正文链接的查询参数和锚点、图谱链接的范围与筛选参数，移除 `embed`、`theme`、`background`、`parentOrigin` 等嵌入环境参数。复制成功或失败均显示状态提示。

选中文本、输入框、可编辑区域、外部链接、附件、正文空白和图谱空白保留浏览器原生菜单。正文中带 `view=graph` 或显式 `embed=true` 的特殊链接保留原有行为；触屏长按使用原生菜单。

## 嵌入阅读

`?embed=true` 或 iframe 中使用紧凑阅读布局，工具栏提供“笔记”文件切换和“目录”小节跳转，隐藏工作区标签栏与局部图谱。阅读区宽度大于 760px 时，文件树位于左侧，文章目录默认在右侧展开，两侧面板为正文预留空间；窄屏使用抽屉。切换笔记保留嵌入参数。

嵌入模式中的笔记菜单提供打开、复制，目录菜单提供展开或收起；隐藏“在新笔记标签页打开”和“查看关联”。菜单以当前 iframe 的视口为定位边界。

嵌入背景默认透明；`background=theme` 使用当前主题底色。`theme=light` / `theme=dark` 指定配色，默认 `theme=auto` 同步同源父页面的 `dark` 类、`data-theme` / `data-color-mode` 或 `color-scheme`；无法读取父页面时跟随系统主题。

跨域 iframe 无法直接读取父页面的样式。父页面可在地址中传主题参数，或使用下方消息协议动态同步；通过 `parentOrigin` 指定父页面来源（省略时使用 Referrer，Referrer 不可用时仅信任站点同源）。

```html
<iframe id="notes" src="https://st2eam.github.io/notes/历史/中国史/秦/事件/秦灭六国.html?embed=true&background=transparent&parentOrigin=https%3A%2F%2Fyour-site.example"></iframe>
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

Canvas 2D 与 D3-force 按实际笔记链接和语义关系布局。默认显示笔记和孤立节点，隐藏标签、附件和箭头；距离不表示年代或因果。

“查看关联”在大图谱中打开独立的“笔记标题 · 关联图谱”标签页，默认仅显示目标笔记自身及一层直接关联的笔记，包括入链、出链和语义关系，不纳入仅通过多层关系间接相连的笔记。没有关联时只显示目标笔记。同一目标复用已有标签页，不同笔记的关联图谱可同时保留。

关联图谱使用目标笔记地址加 `?view=graph&scope=related` 表示范围；复制图谱标签页链接、刷新页面或恢复工作区后仍保留该范围。普通大图谱使用 `?view=graph`，筛选条件通过 `filter` 参数保存。关联范围内仍可按分类、关系类型、确认状态和搜索条件过滤。

- 拖动圆点调整位置，拖动背景平移，滚轮缩放，双指缩放与平移。
- 聚焦画布后 `+/-` 缩放，方向键平移，`Home` 或 `0` 适合屏幕；节点列表提供键盘等价操作。
- 过滤支持普通文字、`path:历史/`、`category:"计算机/架构/设计模式"`、`tag:历史`，以及 `-path:Tools/` 排除。
- 设置面板提供过滤、颜色分组、显示与四类力参数。全局图、目录筛选图、各笔记的关联图谱与侧栏局部图分别保存设置。
- 侧栏局部图可查看一至五层邻居及等价节点列表；右键“查看关联”始终打开一层直接关联的大图谱。隐藏视图和浏览器后台暂停模拟。
- 左键点击笔记节点，在大图谱中查看该笔记及其一层直接关联节点；大图谱节点列表与侧栏“相关笔记”列表采用相同行为。打开笔记正文使用节点右键菜单中的“打开笔记”或“在新笔记标签页打开”。
- 笔记节点右键菜单复用工作台操作；节点密集时优先命中离指针最近的节点。

## 代码入口

- [.vitepress/vault/](.vitepress/vault/)：类型、解析、构建索引、搜索、图谱关系与状态恢复。
- [.vitepress/theme/components/vault/](.vitepress/theme/components/vault/)：阅读工作台、文件树与 Canvas 图谱；[ContextMenu.vue](.vitepress/theme/components/vault/ContextMenu.vue) 负责共享菜单的定位、键盘交互与关闭。
- [context-menu.mjs](.vitepress/vault/context-menu.mjs)：公开分享链接生成与视口边缘定位；[workspace.mjs](.vitepress/vault/workspace.mjs) 统一构造图谱标签页并恢复工作区。
- [tests/vault.test.mjs](tests/vault.test.mjs)：解析、搜索、关系、历史迁移与恢复测试。
- [tests/context-menu.test.mjs](tests/context-menu.test.mjs)：分享链接的基路径、中文、锚点、嵌入参数与菜单定位边界测试。
- [tests/related-graph.test.mjs](tests/related-graph.test.mjs)：关联节点范围、图谱标签页身份、去重与恢复测试。
- [tests/preview.test.mjs](tests/preview.test.mjs)：生产产物的直接访问与嵌入查询路径测试。

全文索引和图谱绘制代码按需加载。已有设计、AI、摄影 Vue 演示继续在 VitePress 正文中运行。添加本地附件后，构建流程会保留公开资源并复制其他被引用的附件到静态产物。


## 分类与语义关系

目录按主题领域组织，每篇笔记的 `primaryCategory` 决定实体文件位置；`categories` 列出主分类与交叉分类，每项含 `path`、`reason`。`classificationStatus: provisional` 表示正文尚不足以确认。`tags` 用于人物、时代、语言或框架实体，不替代分类。

`relations` 保存在 Markdown frontmatter，每项包含 `target`（完整笔记路径）、`type`（citation/similar/subordinate/causal）、`label`、`reason`、`evidence`、`status`（confirmed/inferred）。相似关系无方向；其余关系有方向。因果必须有可核查证据。普通正文链接继续生成引用，分类声明生成从属关系；同一目标可保留不同语义。

工作台左栏“分类浏览”显示交叉归属，右栏展示分类理由与关系证据。图谱可筛选分类、关系类型及确认状态；搜索支持 `category:历史/中国史`。旧目录筛选会转换为新路径或 `origin:` 原路径筛选，旧页面保留查询和锚点后跳到新页面。

完整整理清单与证据位于 `.vitepress/reports/reclassification.md`，机器可读记录在同目录 `classification.json`。该目录不参与页面发布或图谱扫描。`migration-paths.mjs` 是旧笔记身份映射，不是内容或图谱的第二份来源。

历史的中国史按朝代与时期分类，世界史按国家与地区分类。两个时间总览支持分类筛选、关键词搜索、年份范围和日期正反排序。原历史分类总览保存在 `.vitepress/archive/history/`，不进入知识库索引。
