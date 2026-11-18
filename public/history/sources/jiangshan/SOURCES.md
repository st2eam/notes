# 江山地图参考数据与处理记录

## 固定版本与采用范围

参考项目：[DeanChensj/jiangshan-map](https://github.com/DeanChensj/jiangshan-map)。固定提交：[`897b9ad4e987fcface8728ffdfbe33e801a3dbae`](https://github.com/DeanChensj/jiangshan-map/tree/897b9ad4e987fcface8728ffdfbe33e801a3dbae)，获取日期：2026-11-17。署名：**DeanChensj/jiangshan-map and contributors**。

2026-11-18 核对上游 HEAD `f0a84fb0fe4f43b4a518c189365d4f226ce979aa`，下列四个文件与固定快照逐字节一致，因此继续使用原固定版本。文件摘要和逐项核对记录见仓库 `.vitepress/reports/history-content-review.json` 的 `source` 字段。

侧栏地图及时间线事件地图统一使用此固定版本的政权轮廓、一级区划、聚落坐标、事件代表点、周边地理参照和河湖数据，用 Leaflet 渲染。地图不加载旧的 Cliopatria、Natural Earth 或 GeoNames 资源；旧笔记中的地理元数据仅用于名称、关联关系和导航，不作为绘图坐标或几何的回退来源。Markdown 笔记仍是事件和知识图谱的唯一内容来源，审计报告不作为另一份运行时事件库。

原始数据、许可及说明按原内容归档：

| 文件 | 上游路径 | 字节数 |
| --- | --- | ---: |
| [事件与地点原始数据](map-data/source.js.txt) | `js/map_data.js` | 336585 |
| [原始文献映射](milestone-sources/source.js.txt) | `js/milestone_sources.js` | 5029 |
| [GPLv3 许可全文](license/LICENSE) | `LICENSE` | 35150 |
| [上游说明](readme/README.txt) | `README.md` | 33702 |

每个文件的固定下载 URL、SHA-256 和获取版本见 [manifest.json](manifest.json)。JavaScript 以 `.js.txt` 归档，只解析静态字面量，不执行或作为网页脚本加载。

## 内容对读与实际统计

`DYNASTY_DATA` 中的时期含起止年、代表年、阶段、事件和聚落。阶段以 `snap` 引用离散地图切片；事件含年份、叙述、地点和坐标，部分带月份、人物和多地点；聚落可含古今名、别名、都城时期和存在时段。文献映射以“时期键:年份”为键，同年多件事可能共享该键。

本轮逐条读取全部上游叙述，并对原有中国史事件全文进行对应审计。统计由内容迁移与逐篇验证脚本复算：

| 项目 | 数量 | 口径 |
| --- | ---: | --- |
| 上游时期 | 18 | `DYNASTY_DATA` 数组 |
| 上游里程碑 | 526 | 各时期 `milestones` 合计，全部有显式内容对应 |
| 上游聚落 | 1763 | 各时期 `settlements` 合计，未按地点身份去重 |
| 被引用的快照 ID | 204 | `phases[].snap` 去重 |
| 没有上游文献映射的里程碑 | 441 | 原文献表不含该时期/年份键 |
| 原有中国史事件 | 310 | 固定本地 Git 基线中的事件 |
| 新增中国史事件 | 379 | 补入缺失里程碑及合写条目中的独立行动 |
| 完成对读后的中国史事件 | 689 | 全部具有明确发生地点或发生范围 |
| 显式内容对应 | 593 | 每组含本地 `historyId`、上游键、内容范围及理由 |
| 有上游对应的本地事件 | 562 | 一篇笔记可对应多个里程碑 |
| 本地独立补充 | 127 | 上游未包含同一具名事件，保留本地内容 |
| 记录差异的上游条目 | 104 | 纪年、合写范围、地点身份或史料层次存在差异 |
| 新增人物 / 地点 / 概念笔记 | 82 / 359 / 21 | 复用已有节点，缺失核心节点才新增 |
| 新增目录 | 5 | 连通新建人物、地点和概念目录 |
| 逐篇校验的新增或修改笔记 | 1156 | 846 篇新增笔记及 310 篇原有事件 |
| 预期图谱关联 | 2504 | 逐条验证目标与关系类型，不替代 Markdown 图谱 |

详细对应见 `.vitepress/reports/history-content-review.json`：`events` 覆盖全部 526 条上游里程碑，`localEvents` 覆盖原有 310 篇事件，`edits` 保留原文摘要与关联目标。逐篇结果见 `.vitepress/reports/history-content-validation.json`。引用适配报告见 `.vitepress/reports/jiangshan-audit.json`。

## 对应范围与史料限制

对应采用显式 `historyId` 清单。同年、同朝代和相近标题只能提供候选，不能单独确认同一事件。一篇笔记可以对应上游的多个阶段；一条合写里程碑也可以拆成多篇笔记，每组以 `scope` 说明实际覆盖的行动。

例如，前221年的灭齐、统一、称帝及制度措施分别对照本地对应笔记；刘邦称帝定位定陶氾水，洛阳与长安另作后续都城阶段；1905年同盟会成立地的东京指日本东京，不与北宋开封混淆。诸葛瑾致书刘备只标明孙吴至白帝城的通信范围，不由信中提及白帝推定双方会面或准确收信地点。

马陵之战、魏迁大梁、交子、清设台湾府等条目的纪年及合写差异保留在正文和审计中。超出上游覆盖的史前、夏商周及其他独立事件仍保留本地叙述；不以同年的其他行动替代。

界面“事件来源”展示对应范围与差异，有书目才显示书名卷次。上游文献属于进一步核验的线索，尚未逐卷核验所有叙述；缺少书目不等于内容没有对应，存在对应也不等于坐标精度或史实已获独立证明。少数单独核对的史籍原文在相应笔记中另列来源。

## 地图来源与许可边界

上游代码和多数自编内容声明采用 GPL-3.0。本目录原始事件、文献及派生引用按 GPLv3 保留来源与许可；适配器由本项目编写，原始数据及处理源码随仓库提供。本记录不重新授权整个笔记仓库。

上游不同图层并非统一许可：政权轮廓起源于 [Historical Basemaps — André Ourednik and contributors](https://github.com/aourednik/historical-basemaps) 并声明 GPL；一级行政区根据历史文献人工重绘，但早期来源记录不完整。本次采用政权与一级区划，保留江山地图、相关上游及 GPLv3 署名。原始说明见固定版本的 [data/atlas/README.md](https://github.com/DeanChensj/jiangshan-map/blob/897b9ad4e987fcface8728ffdfbe33e801a3dbae/data/atlas/README.md)。

CHGIS/Hartwell 衍生府级边界明确排除在 GPL 之外，限制学术、非商业并禁止再分发；现代省界适用 DataV GeoAtlas 条款。本次不发布府级层、现代省界或包含这些层的完整压缩包。河湖和周边国家只保留独立的允许子集；周边国家是现代地理参照，不表示历史边界。

地图产物包含17个历史时期、204个阶段/快照、1406条有效聚落记录、260个河湖要素，以及1834个共享几何要素、2186条共享环。地图疆域覆盖前403年至1948年，无零年；阶段边界年属于后一个阶段。聚落遵循出现/消失年份、古名变化和分段都城时期。同城可以在多个时期重复计数。产物及摘要见 [地图 manifest](../../jiangshan/manifest.json)。这些统计不表示历史边界逐要素准确性已获核验。

事件代表点仅在其记录年份生效，坐标必须逐项存在于固定 `map_data.js` 的 `coord` 或 `siteCoords` 中。本轮删除11项不在所标注来源中的坐标，剩余500项固定来源地点变体通过精确成员校验；不以近似坐标或其他来源填补。疆域覆盖之外，若同一固定来源确有该年的事件代表点，可以显示该点和周边地理参照，但不推定该年存在可用疆域。没有可显示地理资料时，侧栏隐藏“关联地点”，笔记仍保留文字地点说明。

默认选择可绘制的事件发生地，相关背景地点不会代替缺失的发生地；只有选中的地点显示 tooltip。同名多坐标要求选择。区域按地图可视尺寸的75%适配，展开详情时避让面板。来源和精度说明折叠，图层开关保留于大图工作区。

[旧地图资源](../../../geo/SOURCES.md)保留归档及原有许可记录。上游历史轮廓经过0.01度概化与人工修订，表示阶段示意；聚落及事件代表点均不等于古址、宫城或战场的精确位置。

## 处理与复现

内容迁移工具为仓库内 `scripts/history/complete-content.mjs`。原有310篇事件始终从本地 Git 提交 `9d2d3c6c014b9b82f58c9c41314e414df508ac95` 读取，并核验原文摘要，避免从已插入链接的正文逆向还原。它用于复现本轮迁移；重跑会按固定基线重新生成这些事件，后续人工编辑正文前应相应维护迁移输入。连续重跑已核验全部2494篇 Markdown 字节不变。

```sh
# 从已审阅的内容清单和固定本地原文重建笔记及对应审计
node scripts/history/complete-content.mjs --write

# 逐篇验证收录、内部链接、预期关联、标题、发生地与坐标来源
node scripts/history/validate-content.mjs

# 从显式对应审计重建运行时引用与适配报告
node scripts/history/jiangshan.mjs --write

# 校验固定摘要、重算并比较引用产物，不写文件、不联网
node scripts/history/jiangshan.mjs
```

图谱仍由 `.vitepress/vault/build.mjs` 读取 Markdown 生成，当前为2494个节点、10287条关联。新笔记不另存运行时节点或边数据，`expectedLinks` 仅为逐篇验证清单。

地图处理工具为 `scripts/history/jiangshan-map.mjs`，只读取语法树中的 JSON 常量，按图层引用筛选几何，独立解码 VLQ 坐标、闭环并统一 RFC 7946 外环逆时针/内环顺时针。不会执行上游 IIFE 或导出脚本。离线复现输入为 [source-subset.json](../../jiangshan/source-subset.json) 和本目录归档的 `map_data.js`；子集不包含府级引用、府级独占几何及现代省界。

```sh
# 离线重算并校验所有地图产物
node scripts/history/jiangshan-map.mjs

# 从已保存的允许子集重新生成
node scripts/history/jiangshan-map.mjs --write

# 重新提取；两个原始文件须分别下载到各自新建的空目录
node scripts/history/jiangshan-map.mjs --atlas /path/to/atlas_snapshots.js --geography /path/to/china_geo_data.js --write

# 仅在原始来源缺失时按清单下载，校验TLS与摘要
node scripts/history/jiangshan.mjs --download --write
```

下载的每个文件先进入独立的新空临时目录，校验后复制；解释器不在下载目录运行。完整混合许可包只用于临时提取，不进入发布目录。上游语法树仅允许静态数组、对象和字面量，拒绝函数、调用、展开属性和其他执行语句。

后续仍可逐事件核验原始史料、补录一级区划的逐要素来源，以及在明确独立来源与许可后扩展世界地区或更早、更晚年代。内容对应和 GPL 声明不能替代史料考证或受限图层授权。
