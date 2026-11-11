# Cliopatria 中国历史疆域快照来源

## 数据版本与许可

- 上游：[Cliopatria — Seshat Global History Databank](https://github.com/Seshat-Global-History-Databank/cliopatria)。
- 固定提交：`5f433377139a6eeaeacbdc894b70f8805b72c8b5`。
- [原始压缩包](https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/5f433377139a6eeaeacbdc894b70f8805b72c8b5/cliopatria.geojson.zip) SHA-256：`e10a4e429fca708788ff9e7572a95fce801fae55852d217cffabc1c59cd4eed4`。
- 只读取 ZIP 中的 `cliopatria_polities_only_v021.geojson`，不提取或执行上游代码。大型 ZIP 不随站点发布。
- 署名：**Cliopatria — Seshat Global History Databank and contributors**；本仓库添加快照编排、中文显示名称及说明。
- 许可：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。分发或改编时保留署名、来源和许可链接，并说明改动。
- [数据论文](https://doi.org/10.1038/s41597-025-04516-9)。上游承认历史疆界、名称与存续日期存在不确定性及学术分歧。

原始 `README.md` 是项目及数据说明，`LICENSE.md` 是许可文本，均逐字节保留。

| 文件 | SHA-256 |
| --- | --- |
| `README.md` | `1d7057948a3dcdeb359eb2e1482b71f9d9fd7650d0e55ab09dc9f90dc341b5e9` |
| `LICENSE.md` | `62ca7e92dee4ebe402372d5e64f87845de445a6c0e5d76fddb68b3e33739d1a6` |
| `selected-original.geojson` | `60f20c96b9ee0c6f05bcb27183db9a52232ea10419dd77a1a852e0bef3766311` |

## 派生方式

仓库入口 `scripts/geo/build-early-history.py` 与本目录同名脚本副本一致。原始子集包含 82 条去重后的上游记录，集合级保存 `sourceCommit`、`sourceArchiveSHA256`、`sourceFeatureIndices`；索引为原始数组零起始位置。33 份输出共引用要素 85 次，合计 813,008 字节。

选择明确的原始名称、`Type = POLITY` 和包含代表年份的闭区间 `FromYear <= year <= ToYear`，每项必须唯一。年份为公元前负数、公元后正数，不使用零年。源区间只用于选取记录，不能据此认定政权建立、灭亡的史学年代。

保留全部原属性与几何，包括 `Name`、`FromYear`、`ToYear`、`Area`、`Type`、`Wikipedia`、`Wikidata`、`SeshatID`、`Components`、`MemberOf`。没有裁切、合并、简化、重绘、补面或以现代行政边界替换。EPSG:4326 坐标按 `[经度, 纬度]` 保存。上游 `Area` 是 EPSG:6933 等积投影面积，本项目没有重新测算。

新增要素 `id`，以及属性 `displayName`、`representativeYear`、部分 `labelCoordinates`；集合级新增来源、许可和说明链接。中文显示名称不覆盖原字段。标签坐标仅用于文字排版，不表示首都或事件发生地点；保留的标签均经点在对应多边形内检查。

## 代表年份清单

| 文件名（省略 `.geojson`） | 代表年份 | 所选政权 |
| --- | ---: | --- |
| `shang-1200-bce` | 前1200 | 商 |
| `western-zhou-900-bce` | 前900 | 西周 |
| `spring-autumn-600-bce` | 前600 | 晋、楚、秦、齐、宋、陈、鲁、郑、燕、吴、周王室 |
| `warring-states-300-bce` | 前300 | 秦、楚、齐、燕、赵、魏、韩 |
| `qin-210-bce` | 前210 | 秦 |
| `western-han-200-bce` | 前200 | 西汉 |
| `western-han-100-bce` | 前100 | 西汉 |
| `western-han-1` | 1 | 西汉 |
| `eastern-han-50` | 50 | 东汉 |
| `eastern-han-100` | 100 | 东汉 |
| `three-kingdoms-250` | 250 | 曹魏、蜀汉、孙吴 |
| `three-kingdoms-262` | 262 | 曹魏、蜀汉、孙吴 |
| `wei-wu-264` | 264 | 曹魏、孙吴 |
| `jin-wu-270` | 270 | 西晋、孙吴 |
| `western-jin-300` | 300 | 西晋 |
| `eastern-jin-402` | 402 | 东晋、北魏、后秦、南燕、后凉、北凉、南凉 |
| `north-south-450` | 450 | 北魏、刘宋 |
| `north-south-570` | 570 | 北齐、北周、陈、西梁 |
| `sui-600` | 600 | 隋 |
| `tang-650` | 650 | 唐 |
| `five-dynasties-920` | 920 | 后梁、前蜀、吴、闽、吴越、南汉、楚、晋（河东） |
| `five-dynasties-970` | 970 | 北宋、南唐、吴越、南汉、北汉、辽 |
| `northern-song-1060` | 1060 | 北宋、辽、西夏、大理 |
| `southern-song-1200` | 1200 | 南宋、金、西夏、大理 |
| `yuan-1300` | 1300 | 元 |
| `ming-1400` | 1400 | 明、北元 |
| `ming-1600` | 1600 | 明 |
| `qing-1700` | 1700 | 清 |
| `qing-1820` | 1820 | 清 |
| `qing-1900` | 1900 | 清 |
| `republic-1912` | 1912 | 中华民国 |
| `republic-1937` | 1937 | 中华民国 |
| `republic-1948` | 1948 | 中华民国、中共控制区 |

不包含夏、史前或新朝，不表示全部地方政权已经收齐。原始记录的有效区间逐条保存在 `selected-original.geojson` 中；事件匹配阶段另记于 `.vitepress/vault/geo-early-catalog.mjs`。两者不能混同。例如前221年事件选前210年秦图，只提供前210年的背景参照；600年隋图不能证明581年已经统一，1300年元图不能解释为1271年的灭宋后疆域。

## 异常排除与阶段限制

### 秦、汉末、早期三国

本次空间检查使用近似城市位置作为宏观探针，不证明古城或边界的精确归属。

- 前221年的原始 `Qin` 切片仍关联 `Qin (state)`，不包含临淄；前214年的 `Qin Dynasty` 虽包含临淄，却不包含广州。二者均退出发布清单，没有作为统一秦朝或南征完成后的当年疆界。秦朝笔记统一选前210年参照，该图包含临淄、广州，并始终显示实际年份。
- 200年的 `Han Dynasty` 几何不包含洛阳探针，原拟标签也在面外，因此不发布。汉末使用100年东汉图作较早背景，并明确不能表达曹操、袁绍等军阀控制范围。
- 230年的孙吴源面不包含广州、桂林、武汉等探针，且与250年记录存在大幅面积跃变，因此不发布230年图。221—260年的笔记选250年参照，不能用它判断238年平辽东之前的确切归属。
- 250、262年的三国核心城市方向合理：洛阳在魏、成都及汉中在蜀、南京在吴。两年各政权的几何分别完全相同，没有额外的逐年边境分辨率。
- 263—264年选魏吴，265—279年选晋吴，280年后选西晋，不继续保留蜀、魏或吴。源 `Eastern Wu` 部分区间延续到282年，不能直接用作吴的灭亡年份。
- 三国220年的建国过渡没有单独快照，选择同年仍处于终年范围的东汉100年较早参照，不将尚未成立的蜀汉、孙吴画成当年三国并立。

相关纪年依据包括 [Asian Art Museum：秦](https://education.asianart.org/resources/an-introduction-to-the-qin-empire/)、[汉](https://education.asianart.org/resources/an-introduction-to-the-han-dynasty/)及 [Berkshire：三国时期](https://www.berkshirepublishing.com/ecph-china/2018/01/13/three-kingdoms-period-220-280-ce/)。这些依据支持时段检查，不逐边验证几何。

### 东晋、十六国与周王室

402年源 `Western Jin` 记录（402—409）包含南京、成都、广州，不含洛阳、长安、太原；洛阳、长安在后秦，太原在北魏。日期和南方核心区域支持仅将这一记录显示为“东晋”，不批量改名其他西晋记录。源字段及几何不改。

402年 `Later Yan` 除辽东主体外，还带有约83°E、51°N的异常离散三角形。此条记录整体退出本地原始子集和发布图，没有自行删掉单个面后伪装成修复版本。402年图因此不包含后燕，也未收录缺少该年源记录的西凉。固定源的 `Western Liang` 仅有407—409年记录；北凉图包含敦煌、酒泉，不能据此断言西凉不存在。

前600年 `Later Zhou` 记录包含洛阳，显示为“周王室”。前300年同名记录不包含洛阳，空间证据不足，因此不选入战国图。402年 `Southern Liang` 的原百科关联为 `Liang dynasty`，存在同名歧义；保留原属性，不能用该关联证明南凉边界准确。

### 五代十国

920年源 `Later Jin` 的记录区间为911—921年，面包含太原，不含开封与洛阳；后两者在后梁。日期与河东位置支持显示为“晋（河东）”，避免误作936年建立的后晋。源另有936—946年的后晋记录，未与本条混用；原英文名称、百科关联和Wikidata不改。

920年吴与吴越在长江口附近存在小片重叠，例如121.709046°E、31.720796°N同时落入两面。不同政权面不能默认无缝、互斥拼接；本图也没有穷尽五代十国时期的全部政权。

### 民国与控制范围

1948年同时选 `Republic of China` 与 `Communist Party of China` 两条记录。南京、北京、广州探针在前者，沈阳、哈尔滨、延安、石家庄、济南探针在后者。边界严格线段相交及0.25°偏移网格采样未检出两者内部重叠，不能据此保证完整GIS拓扑有效。

年度记录没有月份，不能还原1948年内战战线的逐月变化。“中共控制区”是展示名称，不代表已逐地核实的军事控制；中华民国面也不能直接等同全部领土主张。政权面、主张、行政辖区与实际控制的含义不同。

## 校验与复现

```sh
python3 -I scripts/geo/build-early-history.py
python3 -I scripts/geo/build-early-history.py --download
```

离线默认模式先核对原始子集摘要，再确定性生成33份输出及运行时目录。`--download` 用正常TLS的curl获取固定版本，下载资料进入独立空临时目录，解释器和本项目脚本保持在下载目录外；只读取已知ZIP成员，不执行上游程序。

校验包括唯一记录匹配、源区间包含代表年份、几何和原属性逐项一致、有限WGS84坐标、环闭合及至少三个不同顶点；对重点图另做城市落点与离散面检查。此前候选集合的环内严格线段相交检查未检出自交，但这不是完整OGC拓扑认证，更不能证明史料级疆界正确。

这些数据适合带来源的政权级空间背景，不保证事件当年准确边界、全部政权集合、郡县区划或连续实际控制精度。早期王朝的势力范围也不等于现代意义的连续直接统治。所有页面必须同时保留事件年份和参考年份，空白区域不能解释为无政权或确定归属。
