# 现代地图数据来源

本目录保存现代参照图的固定版本原始数据、原始元数据、许可文本和构建清单。现代中国图用于省级空间定位，现代世界图用于国家与地区的概览；两者均非历史疆域复原。

## 中国省级区划：geoBoundaries CHN ADM1

- 来源项目：[geoBoundaries / William & Mary geoLab](https://www.geoboundaries.org/)。
- 固定提交：`8ce2700661a28ee944350e2b329bbabb58d2ff83`。
- [原始 GeoJSON](https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/8ce2700661a28ee944350e2b329bbabb58d2ff83/releaseData/gbOpen/CHN/ADM1/geoBoundaries-CHN-ADM1.geojson)保存为 `geoBoundaries-CHN-ADM1.geojson`；此版本的 raw.githubusercontent.com 路径返回 Git LFS 指针，不能用作边界文件。原始元数据同样通过 media.githubusercontent.com 获取真实内容。
- 元数据：`geoBoundaries-CHN-ADM1-metaData.json`，`boundaryYear` 为 `2019`，`admUnitCount` 为 `34`，来源字段为 `geoBoundaries, Wikimedia Commons`，`boundaryCanonical` 为 `People’s Republic of China`。元数据记录的 2023 年更新、构建日期不是边界年份。原始来源链接字段不完整，原样保留，不推测补全。
- 区划口径：完整保留此来源的 34 个单元，包括台湾、香港、澳门的来源分类与几何。该口径不等同于 Natural Earth 的实际控制口径，也不用于认定争议地区的法律地位或表示独立核实过的当前边界。
- 输出：`/geo/v1/modern-china-2019.geojson`。保留全部原始几何与属性，增加中文 `displayName` 和来源、年份、许可等集合元数据。没有重画、简化或裁剪几何。

### 名称与唯一标识

34 个单元的 `shapeISO` 均为 `CHN`，不能用作要素 ID。生成的要素 ID 使用 `gb-chn-adm1-{shapeID}`，并检查唯一性；原始 `shapeID` 与其他属性保留。

原始名称 `Guangzhou Province` 的 `shapeID` 是 `43563684B38891657012300`。构建时通过几何验证后，中文显示为“广东省”：

- 包围盒为 `[109.68254305100004, 20.261775017000048, 117.22161590400003, 25.585525807000067]`，与广东的空间范围一致。
- 采用含孔洞判断的点在多边形内检验，覆盖广州 `[113.2644, 23.1291]`、深圳 `[114.0579, 22.5431]`、韶关 `[113.5975, 24.8104]`、湛江 `[110.3594, 21.2707]`、梅州 `[116.1222, 24.2886]`。
- 不覆盖广西南宁 `[108.3669, 22.8170]`、湖南长沙 `[112.9388, 28.2282]`。

这些地点仅用于核对标签与几何是否对应，不用于校订省界。原始 `shapeName: "Guangzhou Province"` 保持不变。原始重复名称 `Ningxia Ningxia Hui Autonomous Region` 保持不变，显示为“宁夏回族自治区”。其余中文名称采用脚本中的明确映射。

### geoBoundaries 的两层许可

本数据的原始元数据声明 `boundaryLicense: "Public Domain"`，表示其基础来源数据的许可。geoBoundaries 项目在此固定提交的 `LICENSE` 中另行声明，项目代码和项目生成的衍生成果采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。两者含义不同，不能把项目许可改写成“整个项目均为公共领域”。

本目录将项目原始许可逐字节保存为 `geoBoundaries-LICENSE.txt`。派生中国图保留 `sourceLicense: "Public Domain"`，并设置 `license`、`projectLicense` 为 `CC-BY-4.0`。归属注明 geoBoundaries / William & Mary geoLab、Wikimedia Commons 来源；本仓库的改动是增加中文显示名称、唯一 ID 和说明性元数据，几何保持原样。

## 世界国家与地区：Natural Earth

- 来源：[Natural Earth Vector](https://github.com/nvkelso/natural-earth-vector)。
- 固定提交：`ca96624a56bd078437bca8184e78163e5039ad19`。
- [原始 GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_110m_admin_0_countries.geojson)保存为 `ne_110m_admin_0_countries.geojson`。
- 数据集：`1:110m Admin 0 Countries`，177 个国家与地区要素；这是小比例尺概览，不能期待所有小型国家或地区各有一个独立多边形。
- 固定提交内 `110m_cultural/ne_110m_admin_0_countries.VERSION.txt` 标明数据集版本为 **5.1.1**，逐字节保存同名文件。版本标签不是统一的边界年份；原始属性中的 `POP_YEAR`、`GDP_YEAR` 也不能作为边界年份。
- 该提交的原始数据集 HTML 说明另存为 `ne_110m_admin_0_countries.source.html.txt`，内容不变，增加 `.txt` 后缀以避免作为可执行网页提供。构建过程只保存、校验其字节，不执行其中的脚本，也不跟随文内链接。
- Natural Earth 原始项目许可保存为 `natural-earth-LICENSE.md`，声明其地图数据属于公共领域。输出归属文字为 `Made with Natural Earth`。
- 输出：`/geo/v1/modern-world.geojson`。保留全部原始几何与属性，中文 `displayName` 直接来自上游 `NAME_ZH`，要素 ID 为 `ne-admin0-{NE_ID}` 并检查唯一性。

Natural Earth 的原始说明明确：默认按 **de facto（实际控制）** 绘制边界，而非 de jure（法律主张）。世界图保留该默认口径，不套用另一国家立场的替代边界，不与 geoBoundaries 中国图拼接为统一口径。切换两张现代参照图时，对台湾、争议地区等的表示可能不同，这属于来源差异。地图用于空间定位，不是主权裁决。

## 目录接口与时间含义

`.vitepress/vault/geo-modern-catalog.mjs` 导出命名数组 `modernMaps`，包含：

| id | scope | 年份或版本 | geometry |
| --- | --- | --- | --- |
| `modern-china-2019` | `china` | `year: 2019`、`dataYear: 2019` | `/geo/v1/modern-china-2019.geojson` |
| `modern-world` | `world` | `edition: "5.1.1"`，不设置统一 `year` | `/geo/v1/modern-world.geojson` |

两个条目均有 `modern: true`、`period: "现代"`、`from: 1949`、`to: 100000`、`name`、`source: { title, url }`、`accuracy`。`from`、`to` 只表示应用选择现代参照图的事件时间范围；不表示数据从 1949 年起一直适用，更不表示 1949 年的边界。世界图必须展示来源版本，不能把人口统计年份或展示范围起点用作边界年份。

## 固定校验与重新生成

```sh
python3 -I scripts/geo/build-modern.py --download
python3 -I scripts/geo/build-modern.py
```

第一条命令通过正常 TLS 的 `curl` 获取固定提交的来源文件。每个文件各用一个新建空临时目录，下载工作目录保持在仓库，脚本不放入下载目录；不执行来源代码。全部 SHA-256 校验成功后才保存原件。第二条命令离线核对原件并重新生成。脚本要求 Python 隔离模式 `-I`，仅使用标准库，不安装依赖。

所有输入 SHA-256 固定在 `scripts/geo/build-modern.py` 中，输出时再次核对；`metadata.json` 记录 URL、输入 SHA-256、输出 SHA-256、字节数、要素数、版本、许可和广东名称几何核对证据。构建不写入当前日期，保留来源要素顺序和坐标，使用固定 JSON 编码，可逐字节重复生成。

| 原始文件 | SHA-256 |
| --- | --- |
| `geoBoundaries-CHN-ADM1.geojson` | `3a00467a0db9b4136facb5f2f3d0edbfd96adb15651cfdf63991da9281030e85` |
| `geoBoundaries-CHN-ADM1-metaData.json` | `b14151296df758f83bc66706929db37eb2114a439b6f0a1e5c9608732d840136` |
| `geoBoundaries-LICENSE.txt` | `c6e6f4f2cc8aa4fe74aa536570af16f0ffafd56c5878822043b4851fb858d1d1` |
| `ne_110m_admin_0_countries.geojson` | `6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f` |
| `ne_110m_admin_0_countries.VERSION.txt` | `f9893302cd3158f3b5aea394dcd2a91574869e9e6ff69e9235b10a3bf8c983fb` |
| `ne_110m_admin_0_countries.source.html.txt` | `505ed31e9d9704a90818095b534465fac7dbb93e4f56a7727d36f4d4f27ecf74` |
| `natural-earth-LICENSE.md` | `2631b5b39b6d1acc56de75235109b5af2dbb4b0ac5a127b6f06185977247fd4b` |
