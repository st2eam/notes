# 地理底图来源与处理记录

本目录包含自然陆地底图、商周至民国的 33 份 [Cliopatria 代表年份疆域](sources/cliopatria/SOURCES.md)、公元 800 年东亚历史概览、[现代行政区参考](sources/modern/SOURCES.md)及 [GeoNames 城市坐标索引](sources/geonames/SOURCES.md)。城市坐标来源为 **GeoNames 及其贡献者**（<https://www.geonames.org/>），采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，保留独立许可、获取日期、固定快照摘要与处理记录。城市坐标不用于推断古城或古战场的精确位置。

历史图层按代表年份提供主要政权疆域示意，涵盖商、西周、春秋、战国、秦、西汉、东汉、三国、两晋南北朝、隋、唐、五代十国、宋辽金夏、元、明、清和民国。它们不能表示逐年边界、连续有效控制范围或县级精确边界；没有穷尽全部地方政权。夏、史前及新朝仍没有接入合适的疆域几何。现代图独立使用现代资料，不能用于复原 1949 年或其他历史年份的边界。`tang-800.geojson` 可作为区域地点的概览范围引用，不能充当地点归属或历史行政区划判定依据。

## 数据来源

| sourceId | 上游与固定提交 | 许可 | 本地原始文件 |
| --- | --- | --- | --- |
| `natural-earth-110m-land` | [nvkelso/natural-earth-vector](https://github.com/nvkelso/natural-earth-vector/tree/ca96624a56bd078437bca8184e78163e5039ad19)，`ca96624a56bd078437bca8184e78163e5039ad19`，解析自 `refs/heads/master` | Public domain，公有领域 | [ne_110m_land.geojson](sources/natural-earth/ne_110m_land.geojson)、[LICENSE.md](sources/natural-earth/LICENSE.md) |
| `historical-basemaps-800` | [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps/tree/4b5039e50d8d2464b065bd76ad6086cd4597108d)，`4b5039e50d8d2464b065bd76ad6086cd4597108d`，解析自 `refs/heads/master` | GNU GPL version 3；派生历史数据按 GPL-3.0-only 分发 | [world_800.geojson](sources/historical-basemaps/world_800.geojson)、[LICENSE](sources/historical-basemaps/LICENSE)、[上游 README.md](sources/historical-basemaps/README.md) |

Natural Earth 采用 1:110,000,000 的自然陆地数据，适合全国／大陆尺度概览。它不是现代行政国界图，也不是公元 800 年海岸线复原。署名：**Made with Natural Earth**；原作者包括 Tom Patterson、Nathaniel Vaughn Kelso 及贡献者。上游虽不强制署名，此处保留署名与完整权利说明。

历史底图署名：**Historical basemaps — André Ourednik and contributors**。上游 README 还说明早期资料来自多个来源，包括 ThinkQuest Team C006628；这些说明原样保留。原始世界图、完整 GPLv3 LICENSE 和本地处理脚本随本目录共同提供，能够取得、检查并重新生成派生数据。仅历史数据及其派生子集使用上述 GPLv3 许可；Natural Earth 的公有领域地位单独记录。

固定版本原始下载地址：

- [Natural Earth 原始 GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_110m_land.geojson)
- [Natural Earth 许可说明](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/LICENSE.md)
- [800 年原始世界图](https://raw.githubusercontent.com/aourednik/historical-basemaps/4b5039e50d8d2464b065bd76ad6086cd4597108d/geojson/world_800.geojson)
- [历史底图 GPLv3 LICENSE](https://raw.githubusercontent.com/aourednik/historical-basemaps/4b5039e50d8d2464b065bd76ad6086cd4597108d/LICENSE)
- [历史底图说明](https://raw.githubusercontent.com/aourednik/historical-basemaps/4b5039e50d8d2464b065bd76ad6086cd4597108d/README.md)

## 产物与修改

修改日期：2026-11-05。修改者：本项目维护者。对应处理脚本：[build.py](sources/build.py)，仓库维护路径为 `scripts/geo/build.py`；下载后按该路径放置即可使用下文复现命令。

| 文件 | 要素数 | 内容 |
| --- | ---: | --- |
| [v1/land.geojson](v1/land.geojson) | 127 | 全部自然陆地要素，保持全球覆盖 |
| [v1/east-asia-800.geojson](v1/east-asia-800.geojson) | 8 | 下表明确列出的东亚及周边要素 |
| [v1/tang-800.geojson](v1/tang-800.geojson) | 1 | 与东亚集合中的 `tang-800` 完全相同的唐要素 |

历史要素的稳定 `id`、原始 `NAME` 和新增 `displayName`：

| id | NAME（原样保留） | displayName |
| --- | --- | --- |
| `tang-800` | Tang Empire | 唐 |
| `tibetan-empire-800` | Tibetan Empire | 吐蕃 |
| `uyghurs-800` | Uyghurs | 回鹘 |
| `nan-chao-800` | Nan Chao | 南诏 |
| `silia-800` | Silia | 新罗 |
| `parhae-800` | Parhae | 渤海 |
| `japan-800` | Japan | 日本 |
| `champa-800` | Champa | 占婆 |

处理仅包括按 `NAME` 白名单筛选、递归将经纬度舍入到小数点后 4 位、压缩 JSON 空白，以及添加展示名称、稳定 ID、来源、代表年份、署名与许可说明。原始属性全部保留，包括 `NAME`、`SUBJECTO`、`PARTOF`、`BORDERPRECISION`。没有裁切、多边形合并、缓冲、简化、自动修复、补画、行政边界替换或从其他年份移植几何。唐和吐蕃均保留原始 `MultiPolygon`；其他要素同样保留几何类型、环顺序、环方向和顶点数量。

坐标为 WGS 84 / CRS84 的 `[经度, 纬度]` 十进制度。输出省略源文件的旧式 `crs` 字段。4 位小数只是存储精度，不代表历史边界具有约十米的定位精度。集合级 `representativeYear: 800` 表示代表年份，不是起止时间。

Historical Basemaps 部分没有导入 `world_700.geojson` 或其他年份；新增历史年份来自独立记录许可和版本的 Cliopatria。上游 700 年索引中存在错误的 Sui 标签，不能将索引标签视为年代或几何正确性的证据。

## 历史校核依据

- [Smithsonian：Timeline of Chinese History, Art, and Culture](https://asia-archive.si.edu/learn/for-educators/teaching-china-with-the-smithsonian/interactives/timelines/timeline-of-chinese-history-art-and-culture/)：记录唐为 **618–907**，安禄山叛乱为 **755–763**，并说明冲突使唐朝权力受到不可逆的削弱（“irreversibly weakened by the conflict”）。
- [George Israel / Berger 等：The Tang Dynasty and the Emergence of East Asia，World History: Cultures, States, and Societies to 1500](https://human.libretexts.org/Bookshelves/History/World_History/Book%3A_World_History_-_Cultures_States_and_Societies_to_1500_%28Berger_et_al.%29/04%3A_China_and_East_Asia_to_the_Ming_Dynasty/4.11%3A_The_Tang_Dynasty_and_the_Emergence_of_East_Asia)：记录唐的 **618–907** 年代，并在安禄山起兵的后果中说明“the empire shrank and Central Asia was lost”。这支持不能将盛唐扩张范围套用于 800 年；它没有逐边验证本数据。
- [Britannica：Tang dynasty](https://www.britannica.com/topic/Tang-dynasty) 及其摘要页在本次访问中返回 HTTP 403，未将不可读页面内容计入已完成的校核。

以上资料只校核朝代时段及大尺度历史变化，不能证明每个顶点、周边政权标签或整条边界准确。

## 数据质量与适用限制

上游明确标为持续修订的工作资料（work in progress），几何精度面向世界／大陆尺度，历史区域可能重叠，历史边界的含义也不等同于现代主权国界。与 Natural Earth 当代自然陆地叠加时，古今海岸线、河湖变化和制图概化会产生错位。

本次所选 8 个历史要素的 `BORDERPRECISION` 均为 `1`，即 approximate。`Silia` 是上游的原始拼写，本地仅以 `displayName` 显示“新罗”，没有改写源属性。`Uyghurs`、`Parhae` 等原文标签也保持不变。唐以外及空白区域未补成其他国家，未选入要素不表示该区域当时无人居住、没有政权或具有某种确定归属。

唐和吐蕃都有明显概化的长直线边界。唐的原始外包框约为 `[102.4245, 16.1880, 126.0181, 42.9574]`；吐蕃约为 `[75.1481, 21.8958, 104.2660, 43.7630]`。吐蕃南界延伸至约北纬 21.9°，回鹘范围延伸至约东经 137.3°，这些宽泛范围不能据此解释为确切的直接统治边界。本次保留并报告这些源数据限制，没有根据直觉移动边界或伪造修复。

粗略点落区检查结果：长安、洛阳、成都、广州在唐要素内，拉萨在吐蕃内；长安不在吐蕃内，拉萨不在唐内。源要素与舍入产物通过经纬度范围、有限数值、环闭合、舍入后至少 3 个不同顶点的检查；所选历史要素舍入后未检出非相邻线段的严格自相交。这些检查没有覆盖全部 GIS 拓扑问题，也不构成史料级边界校勘。

原始历史外环为顺时针，输出保持原方向。对外环绕向有特定要求的渲染器需要显式兼容。没有为了满足渲染器而改写原始几何。

## 复现

在仓库根目录运行，Python 必须启用隔离模式；不在下载目录运行解释器：

```sh
python3 -I scripts/geo/build.py
```

脚本只使用 Python 标准库，校验所有原始文件的固定 SHA-256，再确定性生成三个产物。若原始文件缺失：

```sh
python3 -I scripts/geo/build.py --download
```

下载使用启用 TLS 校验的 `curl`，每种上游数据先进入各自新建的空临时目录，通过摘要校验后复制到对应来源目录。现有文件摘要不一致时中止，不自动覆盖。脚本不导入、执行下载内容，不调用上游脚本。下载目录、脚本目录彼此分离。

原始 GeoJSON 的 SHA-256：

```text
9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9  sources/natural-earth/ne_110m_land.geojson
9d046cdc4662109c3f803ae46e2c8cba941aa092ec86eccc7823e6cf1554920c  sources/historical-basemaps/world_800.geojson
```

以上三个原有生成文件共 143,039 字节。新增 Cliopatria 与现代数据的固定摘要、原始记录及许可单独保存在各自来源目录；它们不适用本节的三个文件统计。

新增数据重建命令：

```sh
python3 -I scripts/geo/build-early-history.py
python3 -I scripts/geo/build-modern.py
```

历史脚本从已固定摘要的原始子集确定性重建 33 个快照及运行时清单；使用 `--download` 可从固定版本 ZIP 重新提取子集，大型 ZIP 不随站点发布。现代脚本的来源与下载方式见 [现代数据处理说明](sources/modern/SOURCES.md)。所有脚本均由本项目维护，不执行上游下载的代码。
