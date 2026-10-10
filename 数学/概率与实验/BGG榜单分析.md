---
originalPath: 数学/概率与实验/BGG榜单分析.md
primaryCategory: 数学/概率与实验
categories:
  - path: 数学/概率与实验
    reason: 正文讨论桌游榜单的评分口径、样本偏差与可复核筛选。
classificationStatus: confirmed
relations:
  - target: 数学/概率与实验/概率统计.md
    type: similar
    status: inferred
    reason: 榜单分析衔接样本与总体及统一指标的思想。
    evidence: 正文指出BGG评分者是自愿参与样本，不能直接代表所有玩家。
  - target: 数学/概率与实验/离散概率分布.md
    type: citation
    status: confirmed
    reason: 引用二项模型的条件来解释重开率估计。
    evidence: 正文指出只有机会独立且重开概率近似恒定时，重开次数才适合二项模型。
tags: []
---
# BGG 榜单分析

BGG（BoardGameGeek）榜单用于建立候选集合，名次不能代替本桌体验。

## 先分清核心指标

| 指标 | 口径与用途 |
|---|---|
| Avg Rating | 用户 1–10 分评价的平均值；反映参与评分者的偏好 |
| Geek Rating | 用于榜单排序的调整评分，含虚拟评价等调整；不是原始均分 |
| Num Voters | 评分人数；不等于销量、游玩次数或复杂度投票人数 |
| Weight | 社区 1–5 复杂度投票的平均值，混合规则负担与策略深度；不是盒子重量 |
| Board Game Rank | 总榜的相对名次；类型榜、热度榜 Hotness 与总榜须分别记录 |

[BGG 评分说明](https://boardgamegeek.com/wiki/page/ratings)指出 Geek Rating 会调整少量高评分的优势，算法未完整公开。[Weight 说明](https://boardgamegeek.com/wiki/page/weight)指出复杂度含义因人而异，4 分不是 2 分的两倍难度。

## 官网数据示例快照

获取日期：**2026-10-11（北京时间）**。排名、均分和评分人数取自 [BGG 总榜第一页](https://boardgamegeek.com/browse/boardgame/page/1)的 web search 索引（显示两天前抓取）；复杂度取自下列官网条目或分类页，各页面抓取时间不同。直接访问总榜返回 403，故这是本次获取到的官网索引快照，**不保证是获取时刻的实时数值，也不是同一秒采集的数据**。

| 总榜排名 | 原名 | Avg Rating /10 | Weight /5 | 评分人数 |
|---:|---|---:|---:|---:|
| 1 | Brass: Birmingham | 8.56 | 3.86 | 60471 |
| 2 | Ark Nova | 8.54 | 3.80 | 63425 |
| 3 | Pandemic Legacy: Season 1 | 8.50 | 2.83 | 57892 |
| 4 | Gloomhaven | 8.53 | 3.92 | 67818 |
| 5 | Dune: Imperium – Uprising | 8.70 | 3.53 | 20519 |
| 6 | Dune: Imperium | 8.41 | 3.08 | 60035 |
| 7 | Twilight Imperium: Fourth Edition | 8.56 | 4.37 | 29112 |
| 8 | War of the Ring: Second Edition | 8.55 | 4.23 | 25637 |
| 9 | Terraforming Mars | 8.33 | 3.27 | 115248 |
| 10 | Star Wars: Rebellion | 8.42 | 3.75 | 36941 |

复杂度来源（编号对应排名，括号为索引抓取时间）：

- 1：[Brass 评分页](https://boardgamegeek.com/boardgame/224517/brass-birmingham/ratings?rated=1)（两周前）；2：[Ark Nova](https://boardgamegeek.com/boardgame/342942)（一天前）。
- 3：[Pandemic Legacy Wiki](https://boardgamegeek.com/boardgame/161936/pandemic-legacy-season-1/wiki)（三天前）；4：[Gloomhaven 版本页](https://boardgamegeek.com/boardgame/174430/Gloomhaven/versions)（四天前）。
- 5：[Uprising](https://boardgamegeek.com/boardgame/397598)（两天前）；6：[Dune Wiki](https://boardgamegeek.com/boardgame/316554/dune-imperium/wiki)（两天前）。
- 7、9：[Economic 分类页](https://boardgamegeek.com/boardgamecategory/1021/economic/linkeditems/boardgamecategory?pageid=1&sort=rank)（两周前）。
- 8：[War of the Ring](https://boardgamegeek.com/boardgame/115746)（两天前）；10：[Star Wars: Rebellion](https://boardgamegeek.com/boardgame/187645/star-wars-rebellion)（一个月前）。

第 5 名均分高于第 1 名，不能按均分重建名次。复查保存来源、ID、日期；缺失值注明未获取。

## 按需求筛选，而非只选最高名次

按人数、时长、语言和排名粗筛；新手友好度结合规则例外、首次耗时与文本量判断，主题偏好按题材及合作或竞争方式筛选。

中文对照采用“原名＋BGG ID＋中文版本名”，从 Versions 中文版本核实出版商与年份。例如 Brass: Birmingham（224517）用“工业革命：伯明翰”、Ark Nova（342942）用“方舟动物园”作检索提示，正式译名仍须核对。扩展与新版按 ID 分开。

“重开率”自行定义：本组首次体验后，固定 30 天内有组织机会的游戏中实际再次开局的比例。记录分子、分母及观察期不足的条目；它不是总榜字段，不能用票数推算。[[数学/概率与实验/离散概率分布|离散概率分布]]说明，只有机会独立且重开概率近似恒定时，重开次数才适合二项模型；现实中固定团、日程和熟练度会造成关联。

## 检查样本偏差

[[数学/概率与实验/概率统计|概率统计与实验]]强调样本与总体的区别：BGG 评分者是自愿参与样本，不能直接代表所有玩家；票数增加也不能自动消除偏好与选择偏差。

试玩时统一群体与观察窗口，记录教学时间及重开情况。

