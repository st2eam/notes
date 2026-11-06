# GeoNames 城市坐标索引来源

## 来源与快照

- 数据提供者与署名对象：**GeoNames 及其贡献者**，<https://www.geonames.org/>。
- 原始下载 URL：<https://download.geonames.org/export/dump/cities15000.zip>。
- 数据说明与字段定义：<https://download.geonames.org/export/dump/readme.txt>，本地原样保留为 [upstream-readme.txt](upstream-readme.txt)。
- 官方授权说明：<https://www.geonames.org/export/>，说明数据使用 CC BY、要求署名并允许商业使用。上游 `readme.txt` 明确指定 **Creative Commons Attribution 4.0 International（CC BY 4.0）**。
- 获取日期：**2026-11-06（UTC）**。直接获取官方源，无镜像；首次传输超时后以 HTTPS Range 续传完成，ZIP CRC 校验通过。
- ZIP 唯一数据成员：`cities15000.txt`，8,548,333 字节、34,204 行；ZIP 成员时间为 `2026-11-05 03:44:00`，上游未标明该时间的时区，不作为所有城市记录的更新时间。
- 原始 ZIP 保存在仓库 `scripts/geo/gazetteer/raw/cities15000.zip`（3,366,174 字节），位于 `public` 之外，不随静态站点发布。下载内容与解释器／脚本目录分离；脚本只读取 ZIP 指定成员，不解压运行代码。

原始文件摘要：

```text
6e5bb17e2c265df549ca7d8cae1762d8cf4ce04a9edca9426c2cdbf378b42c0e  cities15000.zip
d5279a10a5c02beab103602f8900babadb2fbfea8b9e4c905c5573b3b291732b  cities15000.txt
```

`cities15000.zip` 是每日更新的可变地址；精确复现使用上述已保留的 ZIP。新的每日下载不保证拥有相同摘要，脚本遇到其他快照会中止。

## 许可、版权与引用

原始 GeoNames 数据及本项目分发的城市索引采用 **CC BY 4.0**。许可页：<https://creativecommons.org/licenses/by/4.0/>。完整英文法律文本原样保存在 [LICENSE-CC-BY-4.0.txt](LICENSE-CC-BY-4.0.txt)，下载自 <https://creativecommons.org/licenses/by/4.0/legalcode.txt>。

可以复制、再分发、提取、改编并用于商业用途。分发原始或修改后的数据时，须合理署名 GeoNames，保留其提供的版权、许可、免责与来源说明，附上许可文本或链接，并说明修改及保留已有修改记录。不能暗示 GeoNames 认可本项目，不能以额外法律条件或技术措施限制接收者享有许可授予的权利。完整权利范围、数据库权利、终止与恢复、其他权利及免责以法律文本为准。

GeoNames 按“原样”提供数据，不保证准确性、及时性或完整性。原始作者与贡献者保留其适用的版权及数据库权利；本项目未将数据改授为公有领域。GeoNames 署名不表示其为历史地点判断背书。

使用索引或在界面展示其坐标时应保留以下署名或含同等信息的链接：

> 城市坐标来源：GeoNames 及其贡献者（https://www.geonames.org/），CC BY 4.0（https://creativecommons.org/licenses/by/4.0/）。本项目于 2026-11-06 筛选城市、提取别名并转换为 TSV；数据按原样提供。

## 本地索引与筛选

产物：[../../v1/cities.tsv](../../v1/cities.tsv)，**1,107 条城市记录，78,110 字节**。共 242 个上游国家／地区代码，其中 `CN` 为 392 条，1,029 条含汉字别名。来源为人口大于 15,000 的城市或首都数据集；本次按以下规则取并集：

1. 名称命中仓库 `历史/**/*.md` 笔记：490 条。汉字名称按长度至少 2 的字面子串匹配，另匹配去除末尾“市”的形式；英文仅匹配 `name`／`asciiname` 中长度至少 4 的 ASCII 名称，按大小写无关的连续字母数字词序列匹配。
2. 上游 `feature code` 为 `PPLC` 的首都：241 条。
3. 上游 `population >= 1000000`：573 条。
4. 笔记地理绑定中人工确认身份、但未被上述筛选选入的记录：另补 9 条，标记为 `curated-place-binding`。同名记录通过 GeoNames ID 固定，不按人口自动选择。

上述计数有交集。命中是候选筛选，短地名、同名地点或普通英文词可能产生误命中，不证明笔记指向该城市。[selection.tsv](selection.tsv) 固定此次选取的 GeoNames ID、原因和命中名称。默认重建使用该名单，不受笔记后续变化影响；显式传入 `--select-notes` 才重新筛选。

输出是 UTF-8、LF 换行、有表头的 TSV，按数字 ID 升序。字段顺序：

```text
id\tname\tcountry\tlon\tlat\tpopulation\taltChineseNames\tasciiName
```

其中 `\t` 表示实际 TAB 分隔符。`id` 为 GeoNames ID，`name` 保留上游主名称，`country` 为上游 ISO 3166 两字母代码；坐标为 WGS 84 十进制度，**经度在前、纬度在后**。人口直接保留上游快照值，不代表历史人口或同一统计年份。第 8 列保留 `asciiname`，它是 ASCII 转写，不保证是英语通行名。经纬度保留源文件数值，不另作四舍五入。

`altChineseNames` 从 `name`、`asciiname`、逗号分隔的 `alternatenames` 中提取至少包含一个汉字、且其余仅含汉字或所允许的空白／分隔符的候选名称；去重、排序后以 `|` 分隔，空字段表示没有候选。排除混有假名、韩文、拉丁字母或数字的名字，因此也可能漏掉混合书写的中文名称。源字段没有语言标签，汉字候选可能包括日语汉字等，并非经 `zh` 标签确认的中文；没有下载 `alternateNamesV2`，也没有生成或翻译缺失别名。

索引只提供现代城市候选坐标，没有补造“长安→西安”“君士坦丁堡→伊斯坦布尔”等历史对应。城市中心、历史城址、行政区范围彼此不同；同名候选需结合国家、笔记语境及历史地点资料判断。来源中的国别代码照录，不作历史归属判断。

城市索引提取只做记录筛选、字段选取、别名筛选／排序及 TSV 格式转换，不调整坐标或更新人口。后续由 `scripts/geo/build-place-catalog.mjs` 按人工核验的名称、国家及固定 ID 建立共享地点目录，供 Markdown 显式绑定；历史别名是本项目的独立判断，不属于 GeoNames 原始数据。

`cities.tsv` 不匹配当前 `.vitepress/pwa/build.mjs` 的预缓存扩展名。完整 ZIP 留在 `public` 之外；未引入大型 JSON 或 PWA 配置修改。

## 复现与只读查询

从仓库根目录运行，Python 使用隔离模式，脚本仅依赖标准库：

```sh
python3 -I scripts/geo/gazetteer/build.py
node scripts/geo/gazetteer/verify.mjs
shasum -a 256 -c public/geo/sources/geonames/SHA256SUMS
```

脚本校验固定 ZIP SHA-256，只读取指定成员，检查字段数、重复 ID、要素类别、坐标范围及人口，再按固定 `selection.tsv` 生成索引。生成结果 SHA-256 为：

```text
3d4c9a2fa21c5e215f4d0b2de83b6604d75e1e4b5957ea1b89ba065bb4de0198  public/geo/v1/cities.tsv
```

显式指定快照、输出位置或重新筛选笔记：

```sh
python3 -I scripts/geo/gazetteer/build.py --zip /absolute/path/cities15000.zip --output /absolute/path/cities.tsv
python3 -I scripts/geo/gazetteer/build.py --select-notes /absolute/path/to/历史
```

重建脚本不联网。需要获取新的原始数据时，使用保持 TLS 校验的 `curl`，每种外部数据单独存入新建空目录，从仓库目录运行解释器，不在下载目录运行代码。本次数据、说明文档、许可文本分别进入独立的新临时目录，下载后只作为数据读取，从未执行下载内容。

只读 CLI：

```sh
node scripts/geo/gazetteer/query.mjs 北京 CN
node scripts/geo/gazetteer/query.mjs 伦敦
```

Node ESM 可导入：

```js
import { loadCityIndex, parseCities, createCityIndex } from './scripts/geo/gazetteer/query.mjs';
const index = loadCityIndex();
const candidates = index.find('洛阳', { country: 'CN' });
// 也可 createCityIndex(parseCities(tsvText))，由调用方提供 TSV 文本。
```

查询返回冻结的候选数组和记录。记录包含字符串 `id`、`name`、`asciiName`、`country`，数值 `lon`／`lat`／`population`，以及字符串数组 `altChineseNames`。按人口降序、ID 升序返回全部候选，保留国内外同名；可选 `country` 筛选不区分代码大小写。名称只进行 NFKC、英文大小写／引号及汉字末尾“市”的归一化，不作简繁转换、模糊搜索或自动古今映射。无匹配返回空数组，CLI 同时返回退出码 1。
