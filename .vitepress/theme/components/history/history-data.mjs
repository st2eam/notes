/** @typedef {'china' | 'world'} Track */
/** @typedef {'culture' | 'person' | 'event' | 'process' | 'polity'} HistoricalKind */
/** @typedef {'comparison' | 'exchange' | 'context' | 'part-of'} RelationType */

export const periods = [
  { id: 'origins', title: '文明起源', years: '约前 5000 年—前 800 年', page: '文明起源' },
  { id: 'classical', title: '古典时期', years: '前 800 年—公元 500 年', page: '古典时期' },
  { id: 'postclassical', title: '后古典时期', years: '500—1500 年', page: '后古典时期' },
  { id: 'early-modern', title: '早期近代', years: '1500—1800 年', page: '早期近代' },
  { id: 'modern', title: '近现代', years: '1800—1914 年', page: '近现代' },
  { id: 'contemporary', title: '当代', years: '1914 年至今', page: '当代' },
]

const source = (title, url) => ({ title, url })
const wikipedia = (path) => source('维基百科（入门索引）', `https://en.wikipedia.org/wiki/${path}`)
const metGalleon = source('大都会艺术博物馆：马尼拉大帆船贸易', 'https://www.metmuseum.org/essays/the-manila-galleon-trade-1565-1815')
const unescoSilk = source('联合国教科文组织：丝绸之路', 'https://www.unesco.org/en/silk-roads/about-silk-roads')

// year 只用于列表排序；网络采用关系布局，节点距离不表示年代间隔。
const rawNodes = [
  ['yangshao', 'origins', 'china', '仰韶文化', '约前 5000—前 3000 年', -5000, '中国黄河流域', '新石器时代聚落与彩陶文化，适合观察早期农业和定居生活。', source('剑桥大学考古系：仰韶文化', 'https://www.arch.cam.ac.uk/research/projects/recently-completed-projects/yangshao-culture-100-year-research-history-and')],
  ['liangzhu', 'origins', 'china', '良渚古城', '约前 3300—前 2300 年', -3300, '中国长江下游', '城址、水利和玉器遗存，为研究早期复杂社会提供证据。', source('联合国教科文组织：良渚古城遗址', 'https://whc.unesco.org/en/list/1592')],
  ['shang', 'origins', 'china', '商王朝', '约前 1600—前 1046 年', -1600, '中国黄河中下游', '甲骨文和青铜器让王权、祭祀与文字得到较直接的考古印证。', wikipedia('Shang_dynasty')],
  ['sumer', 'origins', 'world', '苏美尔城邦', '约前 3500 年起', -3500, '西亚两河流域', '乌鲁克等城市的发展与早期文字、行政记录密切相关。', wikipedia('Sumer')],
  ['egypt', 'origins', 'world', '古埃及早王朝', '约前 3100 年起', -3100, '非洲尼罗河流域', '尼罗河沿岸形成统一王国，并留下丰富的文字和建筑遗存。', wikipedia('Ancient_Egypt')],
  ['indus', 'origins', 'world', '印度河文明', '约前 2600—前 1900 年', -2600, '南亚印度河流域', '城市规划和远距离交换十分突出；其文字至今尚未被可靠释读。', wikipedia('Indus_Valley_Civilisation')],

  ['zhou', 'classical', 'china', '东周与诸子', '前 770—前 256 年', -770, '中国黄河流域', '诸侯竞争与思想争鸣并行，形成后世反复讨论的政治和伦理问题。', wikipedia('Zhou_dynasty')],
  ['qin', 'classical', 'china', '秦统一', '前 221 年', -221, '中国', '秦结束战国格局，建立统一的中央集权帝国。', wikipedia('Qin_dynasty')],
  ['han', 'classical', 'china', '汉王朝', '前 206 年—公元 220 年', -206, '中国', '皇室与政府分开，丞相主政，察举选官；田赋很轻，兵役和徭役连在一起。对中亚的联系也在加强。', wikipedia('Han_dynasty')],
  ['zhang-qian', 'classical', 'china', '张骞', '前 2 世纪', -138, '中国—中亚', '奉汉武帝之命出使西域，其行程是早期中亚交流的重要线索。', unescoSilk],
  ['achaemenid', 'classical', 'world', '阿契美尼德帝国', '约前 550—前 330 年', -550, '西亚与东北非', '跨地区帝国以行省和道路联系广阔的领土。', wikipedia('Achaemenid_Empire')],
  ['maurya', 'classical', 'world', '孔雀王朝', '约前 321—前 185 年', -321, '南亚', '南亚早期大帝国，阿育王时期的敕令是重要史料。', source('国家地理教育：孔雀王朝', 'https://education.nationalgeographic.org/resource/mauryan-empire/')],
  ['ashoka', 'classical', 'world', '阿育王', '约前 268—前 232 年在位', -268, '南亚', '孔雀王朝君主；其石刻敕令让我们看到统治理念的公开表达。', source('国家地理教育：孔雀王朝', 'https://education.nationalgeographic.org/resource/mauryan-empire/')],
  ['rome', 'classical', 'world', '罗马帝国', '前 27 年—公元 476 年（西部）', -27, '欧洲与地中海', '以道路、城市和法律维系地中海世界，疆域与制度随时间变化。', wikipedia('Roman_Empire')],

  ['tang', 'postclassical', 'china', '唐王朝', '618—907 年', 618, '中国', '三省和政事堂拆开相权，科举取代九品中正；租庸调改为两税，府兵落到节度使。长安仍连着陆上商路。', wikipedia('Tang_dynasty')],
  ['xuanzang', 'postclassical', 'china', '玄奘', '602—664 年', 629, '中国—南亚', '唐代僧人，赴印度学习佛教并带回经籍，其旅行记录也是跨文化交流史料。', unescoSilk],
  ['song', 'postclassical', 'china', '宋代商业与技术', '960—1279 年', 960, '中国', '军事归枢密、财政归三司，君权更直接；科举扩大而官多，赋税加重，养兵多而边防弱。城市与海上贸易仍在发展。', wikipedia('Song_dynasty')],
  ['yuan', 'postclassical', 'china', '元王朝', '1271—1368 年', 1271, '中国', '蒙古统治者建立的王朝，是更广阔欧亚蒙古历史的一部分。', wikipedia('Yuan_dynasty')],
  ['ming', 'postclassical', 'china', '明王朝', '1368—1644 年', 1368, '中国', '废除丞相，内阁不是宰相；八股取士，地方靠省、督抚和胥吏，卫所后来败坏。后期商品仍进入跨太平洋贸易。', wikipedia('Ming_dynasty')],
  ['abbasid', 'postclassical', 'world', '阿拔斯王朝', '750—1258 年', 750, '西亚与北非', '巴格达成为学术和商业中心，翻译与知识流通十分活跃。', wikipedia('Abbasid_Caliphate')],
  ['mali', 'postclassical', 'world', '马里帝国', '约 13—16 世纪', 1235, '西非', '跨撒哈拉贸易与廷巴克图的学术网络呈现另一条交流路径。', wikipedia('Mali_Empire')],
  ['mongol', 'postclassical', 'world', '蒙古帝国', '1206 年起', 1206, '欧亚大陆', '征服与分治改变了欧亚政治版图，也重组了长距离交流条件。', wikipedia('Mongol_Empire')],

  ['ming-silver', 'early-modern', 'china', '晚明白银贸易', '约 16—17 世纪', 1550, '中国与东亚海域', '中国商品经马尼拉进入跨太平洋贸易，美洲白银流向亚洲。', metGalleon],
  ['qing', 'early-modern', 'china', '清前期', '1644—18 世纪末', 1644, '中国', '钱穆称之为部族政权：沿用明制，另设军机处，科举和兵权服从这套控制。疆域扩大，形成多族群帝国。', wikipedia('Qing_dynasty')],
  ['canton', 'early-modern', 'china', '广州贸易体系', '1757—1842 年', 1757, '中国广州', '清廷将西方海上贸易主要集中在广州，形成特定的商贸和管理制度。', wikipedia('Canton_System')],
  ['galleon', 'early-modern', 'world', '马尼拉大帆船贸易', '1565—1815 年', 1565, '美洲—菲律宾—东亚', '跨太平洋航线用美洲白银交换亚洲商品，连接多个大洲。', metGalleon],
  ['mughal', 'early-modern', 'world', '莫卧儿帝国', '1526—1857 年', 1526, '南亚', '南亚大帝国在行政、建筑和宗教政策上留下深远影响。', wikipedia('Mughal_Empire')],
  ['atlantic-slavery', 'early-modern', 'world', '跨大西洋奴隶贸易', '约 16—19 世纪', 1500, '非洲—美洲—欧洲', '数百万非洲人被强制运往美洲，不能把这段历史简化成普通商品贸易。', source('联合国教科文组织：奴隶之路项目', 'https://www.unesco.org/en/routes-enslaved-peoples')],

  ['opium', 'modern', 'china', '鸦片战争', '1839—1842、1856—1860 年', 1839, '中国与英国等国', '两次战争及随后条约改变了清朝的对外关系和主权处境。', wikipedia('Opium_Wars')],
  ['taiping', 'modern', 'china', '太平天国运动', '1850—1864 年', 1850, '中国', '大规模内战严重冲击清朝社会、财政和地方权力结构。', wikipedia('Taiping_Rebellion')],
  ['xinhai', 'modern', 'china', '辛亥革命', '1911 年', 1911, '中国', '清王朝统治结束，共和政体的建立开启新的政治实验。', wikipedia('1911_Revolution')],
  ['sun-yat-sen', 'modern', 'china', '孙中山', '1866—1925 年', 1911, '中国', '革命活动和共和理念的重要代表人物，参与推动清末政体变革。', wikipedia('Sun_Yat-sen')],
  ['industrial', 'modern', 'world', '工业革命', '约 18 世纪后期—19 世纪', 1800, '欧洲起源，影响全球', '机械化生产和交通变革扩大产能，也加深全球力量差距。', wikipedia('Industrial_Revolution')],
  ['meiji', 'modern', 'world', '明治维新', '1868 年起', 1868, '日本', '日本改革政治、军制和产业，在全球帝国竞争中改变自身位置。', wikipedia('Meiji_Restoration')],
  ['africa-partition', 'modern', 'world', '瓜分非洲', '约 1880—1914 年', 1880, '非洲', '欧洲列强加快殖民扩张，边界划分和强制统治产生长期影响。', wikipedia('Scramble_for_Africa')],

  ['may-fourth', 'contemporary', 'china', '五四运动', '1919 年', 1919, '中国', '围绕巴黎和会山东问题的抗议，发展为广泛的思想与社会运动。', wikipedia('May_Fourth_Movement')],
  ['prc', 'contemporary', 'china', '中华人民共和国成立', '1949 年', 1949, '中国', '内战后的国家政权重建，随后进入深刻的社会与经济变迁。', wikipedia('Proclamation_of_the_People%27s_Republic_of_China')],
  ['reform', 'contemporary', 'china', '改革开放', '1978 年起', 1978, '中国', '经济体制逐步调整，对外交流扩大，社会生活与全球联系随之变化。', wikipedia('Chinese_economic_reform')],
  ['wwi', 'contemporary', 'world', '第一次世界大战', '1914—1918 年', 1914, '欧洲起源，波及全球', '战争及战后安排改变帝国、边界与国际秩序。', wikipedia('World_War_I')],
  ['wwii', 'contemporary', 'world', '第二次世界大战', '1939—1945 年（欧洲战场）', 1939, '全球', '多战场的全球战争；亚洲战事始于 1939 年之前，战后秩序与去殖民化受其影响。', wikipedia('World_War_II')],
  ['decolonization', 'contemporary', 'world', '亚非去殖民化', '约 1945—1970 年代', 1945, '亚洲与非洲', '许多殖民地争取独立，独立进程与国家建设各不相同。', wikipedia('Decolonization')],
  ['globalization', 'contemporary', 'world', '全球化加速', '约 1990 年代起', 1990, '全球', '贸易、技术与信息网络进一步扩展，同时伴随不平等和新的依赖。', wikipedia('Globalization')],
]

const kinds = {
  culture: ['yangshao', 'liangzhu', 'indus'],
  person: ['zhang-qian', 'ashoka', 'xuanzang', 'sun-yat-sen'],
  event: ['opium', 'taiping', 'xinhai', 'meiji', 'may-fourth', 'wwi', 'wwii'],
  process: ['ming-silver', 'canton', 'galleon', 'atlantic-slavery', 'industrial', 'africa-partition', 'reform', 'decolonization', 'globalization'],
}

/** @type {Array<{id:string,period:string,track:Track,kind:HistoricalKind,title:string,date:string,year:number,place:string,summary:string,source:{title:string,url:string},link:string}>} */
export const nodes = rawNodes.map(([id, period, track, title, date, year, place, summary, reference]) => ({
  id, period, track, kind: Object.entries(kinds).find(([, ids]) => ids.includes(id))?.[0] ?? 'polity', title, date, year, place, summary, source: reference,
  link: `/History/${periods.find((item) => item.id === period).page}#${id}`,
}))

const compare = (id, from, to, note) => ({ id, from, to, type: 'comparison', note })
const link = (id, from, to, type, note, reference) => ({ id, from, to, type, note, reference })

// 比较关系只指出值得对读的共同问题，不宣称相互接触或单向因果。
export const relations = [
  compare('r01', 'yangshao', 'sumer', '比较定居农业与城市形成：两地时间和发展路径不同。'),
  compare('r02', 'liangzhu', 'egypt', '比较大型工程、权力组织与考古证据。'),
  compare('r03', 'shang', 'indus', '跨时段比较文字证据：甲骨文可释读，印度河文字仍有争议；两者并非同期。'),
  compare('r04', 'zhou', 'achaemenid', '比较不同地区如何组织广域政治秩序。'),
  compare('r05', 'qin', 'maurya', '比较公元前后南亚与东亚的帝国整合。'),
  link('r06', 'han', 'rome', 'exchange', '丝路网络间接连接汉与罗马世界；不等于两国之间有固定直达商队。', unescoSilk),
  link('r07', 'tang', 'abbasid', 'exchange', '丝路上的商人、宗教与知识流动，使两个世界参与相互连接的网络。', unescoSilk),
  compare('r08', 'song', 'mali', '比较海上贸易与跨撒哈拉贸易各自依赖的城市和商路。'),
  link('r09', 'yuan', 'mongol', 'part-of', '元朝由蒙古统治者建立，需同时放在中国史与欧亚蒙古史中理解。'),
  link('r10', 'ming-silver', 'galleon', 'exchange', '马尼拉大帆船将美洲白银与中国丝绸、瓷器等商品联系起来。', metGalleon),
  compare('r11', 'qing', 'mughal', '比较清与莫卧儿两个多族群帝国的统治方式和边界。'),
  compare('r12', 'canton', 'atlantic-slavery', '比较两种跨洋贸易制度，并区分商品交换与人口奴役。'),
  link('r13', 'industrial', 'opium', 'context', '将英国工业扩张与对华贸易放在同一背景下观察；战争原因仍需结合鸦片贸易和外交冲突。'),
  compare('r14', 'taiping', 'africa-partition', '比较同一世纪的内战与殖民扩张；二者不是因果链。'),
  compare('r15', 'xinhai', 'meiji', '比较东亚两种面对帝国竞争的政治改革路径。'),
  link('r16', 'wwi', 'may-fourth', 'context', '一战后的巴黎和会山东问题是五四运动的重要直接背景。'),
  compare('r17', 'prc', 'decolonization', '比较战后亚洲与非洲不同的政权更替和国家建设道路。'),
  link('r18', 'reform', 'globalization', 'part-of', '改革开放扩大中国与全球贸易网络的联系，是中国参与全球化的重要政策转折。'),
]

export const relationLabels = { comparison: '对照', exchange: '交流', context: '背景', 'part-of': '归属' }

export function relationSources(relation) {
  if (relation.reference) return [relation.reference]
  const from = nodes.find((item) => item.id === relation.from)
  const to = nodes.find((item) => item.id === relation.to)
  return [from?.source, to?.source].filter(Boolean)
}
