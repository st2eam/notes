import { nodes, relations, relationSources } from './history-data.mjs'

/** @typedef {'comparison' | 'exchange' | 'context' | 'part-of' | 'succession' | 'ended' | 'participated' | 'ruled' | 'institution' | 'theme'} GraphRelationType */

// 主题节点是本站的阅读分类，不是历史实体，也不代表史实因果。
export const themes = [
  { id: 'theme-power', title: '权力与制度', kind: 'theme', track: 'theme', summary: '观察共同规则、行政记录与统治如何支持大规模合作，也追问谁能制定规则。' },
  { id: 'theme-exchange', title: '交流与贸易', kind: 'theme', track: 'theme', summary: '观察货币信任、商路与人员流动，并区分交易、征服和强制迁移。' },
  { id: 'theme-knowledge', title: '知识与传播', kind: 'theme', track: 'theme', summary: '观察文字、宗教、科学与技术如何传播，以及谁保存和使用知识。' },
  { id: 'theme-conflict', title: '冲突与变革', kind: 'theme', track: 'theme', summary: '观察战争、殖民与社会运动如何重分配权力及其代价。' },
  { id: 'theme-ecology', title: '农业与生态', kind: 'theme', track: 'theme', summary: '比较定居、粮食生产与工业化对人口、劳动和其他物种的影响。' },
  { id: 'theme-welfare', title: '增长与福祉', kind: 'theme', track: 'theme', summary: '把产量、财富和技术能力与健康、自由、分配及主观感受分开衡量。' },
]

// 赫拉利《人类简史》的分析问题嵌入相关史实节点；章节是观点出处，节点来源仍用于核对史实。
export const readingLenses = {
  yangshao: { chapters: '第 5 章', question: '农业能供养更多人口，是否也让每个家庭更省力、更安全？从作物、居址与健康证据分别回答。' },
  liangzhu: { chapters: '第 6 章', question: '大型水利工程显示组织能力；若要进一步推断共同规则和权力结构，还需要哪些证据？' },
  egypt: { chapters: '第 6 章', question: '大型工程与王权叙事怎样组织劳动？从遗址和文字寻找证据，避免只用自然环境解释统一。' },
  sumer: { chapters: '第 7 章', question: '早期账簿保存了哪些行政信息？只从留下的文字看城市，会漏掉哪些人的生活？' },
  shang: { chapters: '第 7 章', question: '甲骨文让哪些王室事务变得可见？普通人的经历还需借助哪些非文字材料？' },
  indus: { chapters: '第 7 章', question: '当文字尚未可靠释读，城市规划和器物能回答什么，政治制度又有哪些仍无法确认？' },
  qin: { chapters: '第 2、6 章', question: '统一后的法令、行政与共同秩序如何协调陌生人？制度的延续不能只由秦朝的短暂统治推断。' },
  maurya: { chapters: '第 11 章', question: '帝国的公开敕令怎样说明统治理想？地方社会的实践是否与宣示一致，仍需分别查证。' },
  han: { chapters: '第 10—11 章', question: '跨地区交换需要哪些信任、制度与中间商？商品流动不等于两个帝国直接交易。' },
  rome: { chapters: '第 11 章', question: '道路、城市和法律如何维系统治？同时考察被统治者的选择、抵抗与地方差异。' },
  xuanzang: { chapters: '第 12 章', question: '宗教网络如何促成旅行、翻译和知识传递？把沿途的商人、译者及地方政权也纳入视野。' },
  mali: { chapters: '第 10 章', question: '远距离贸易如何建立信任？跨撒哈拉网络还依赖哪些城市、统治者和地方参与者？' },
  mongol: { chapters: '第 11 章', question: '帝国扩张可能重组商路，也造成战争破坏；两种后果在何时、何地发生？' },
  'ming-silver': { chapters: '第 10 章', question: '白银为什么能跨洋被接受？追踪参与者与制度，别把货币流动误写成平等交易。' },
  galleon: { chapters: '第 10、16 章', question: '信用、投资与白银贸易怎样连接跨洋生产？谁提供劳动，谁得到收益？' },
  'atlantic-slavery': { chapters: '第 8、16、19 章', question: '经济增长由谁获得，又由谁承受强制劳动的代价？总产值不能替代被奴役者的经历。' },
  industrial: { chapters: '第 4、17、19 章', question: '把工业时代的生态压力与更早的人类扩张对读；能源与机械化提高产量后，劳动和生活感受是否同步改善？' },
  'africa-partition': { chapters: '第 14—16 章', question: '测绘、科学调查、资本与殖民权力如何结合？当地知识与抵抗是否出现在材料中？' },
  reform: { chapters: '第 16、18—19 章', question: '经济增长与对外开放带来哪些收益？比较地区、行业和群体，避免只看平均值。' },
  decolonization: { chapters: '第 11 章', question: '政治独立后，哪些帝国时代的制度和经济关系仍在延续，哪些由新国家主动改变？' },
  globalization: { chapters: '第 9、13、19 章', question: '联系更密切是否等于生活更相似或更幸福？分别观察网络、地方选择和分配结果。' },
}

const fact = (id, from, to, type, note, reference) => ({ id, from, to, type, note, reference })
const wiki = (title, path) => ({ title, url: `https://en.wikipedia.org/wiki/${path}` })

// 有方向的史实关系。背景关系只陈述一个条件，不能读成充分原因。
export const factualRelations = [
  fact('f01', 'shang', 'zhou', 'succession', '周取代商；此边表示王朝更替，不表示制度完全断裂。', wiki('周王朝', 'Zhou_dynasty')),
  fact('f02', 'zhou', 'qin', 'succession', '秦统一六国，结束战国列国格局。', wiki('秦王朝', 'Qin_dynasty')),
  fact('f03', 'qin', 'han', 'succession', '秦亡后经历楚汉之争，汉王朝建立；两者不是无间隔的直接交接。', wiki('汉王朝', 'Han_dynasty')),
  fact('f04', 'zhang-qian', 'han', 'participated', '张骞受汉武帝派遣出使西域，是汉代对中亚交流的参与者。', wiki('张骞', 'Zhang_Qian')),
  fact('f05', 'ashoka', 'maurya', 'ruled', '阿育王是孔雀王朝君主，其敕令是研究该王朝的重要材料。', wiki('阿育王', 'Ashoka')),
  fact('f06', 'xuanzang', 'tang', 'participated', '玄奘在唐代赴南亚取经并翻译佛经。', wiki('玄奘', 'Xuanzang')),
  fact('f07', 'mongol', 'yuan', 'context', '元朝由蒙古统治者建立，是蒙古帝国分化后的政权之一。', wiki('元王朝', 'Yuan_dynasty')),
  fact('f08', 'mongol', 'abbasid', 'ended', '蒙古军队于 1258 年攻陷巴格达，结束阿拔斯王朝在巴格达的统治。', wiki('巴格达之战', 'Siege_of_Baghdad_(1258)')),
  fact('f09', 'song', 'yuan', 'succession', '元军在 1279 年结束南宋统治；宋、元政权曾长期并存。', wiki('宋元战争', 'Mongol_conquest_of_the_Song_dynasty')),
  fact('f10', 'yuan', 'ming', 'succession', '明建立后取代元在中国大部的统治；元的残余政权仍继续存在。', wiki('明王朝', 'Ming_dynasty')),
  fact('f11', 'ming-silver', 'ming', 'part-of', '白银贸易发生在明后期，是理解明代经济与跨洋联系的一个切面。', wiki('明王朝', 'Ming_dynasty')),
  fact('f12', 'ming', 'qing', 'succession', '清在明清战争与政权更替中逐步取得中国大部；过渡历时数十年。', wiki('明清战争', 'Transition_from_Ming_to_Qing')),
  fact('f13', 'canton', 'qing', 'part-of', '广州贸易体系是清廷管理西方海上贸易的制度安排。', wiki('广州贸易体系', 'Canton_System')),
  fact('f14', 'galleon', 'ming-silver', 'exchange', '马尼拉航线用美洲白银交换包括中国丝绸、瓷器在内的亚洲商品。', { title: '大都会艺术博物馆：马尼拉大帆船贸易', url: 'https://www.metmuseum.org/essays/the-manila-galleon-trade-1565-1815' }),
  fact('f15', 'opium', 'canton', 'ended', '第一次鸦片战争后的南京条约开放多个通商口岸，广州一口通商制度结束。', wiki('南京条约', 'Treaty_of_Nanking')),
  fact('f16', 'opium', 'qing', 'context', '两次鸦片战争发生于清朝，其条约改变了清朝的对外关系。', wiki('鸦片战争', 'Opium_Wars')),
  fact('f17', 'taiping', 'qing', 'context', '太平天国运动是清朝中期的大规模内战。', wiki('太平天国运动', 'Taiping_Rebellion')),
  fact('f18', 'sun-yat-sen', 'xinhai', 'participated', '孙中山长期参与革命组织和活动，是辛亥革命的重要人物之一。', wiki('孙中山', 'Sun_Yat-sen')),
  fact('f19', 'xinhai', 'qing', 'ended', '辛亥革命后清帝于 1912 年退位，清朝帝制结束。', wiki('辛亥革命', '1911_Revolution')),
  fact('f20', 'wwi', 'may-fourth', 'context', '一战后巴黎和会对山东问题的处理，是五四运动的重要直接背景。', wiki('五四运动', 'May_Fourth_Movement')),
  fact('f21', 'wwii', 'decolonization', 'context', '第二次世界大战削弱多个殖民帝国；战后独立运动还有各地自身原因。', wiki('去殖民化', 'Decolonization')),
  fact('f22', 'africa-partition', 'decolonization', 'context', '非洲去殖民化回应此前殖民统治形成的政治秩序，不能视为单一线性过程。', wiki('非洲去殖民化', 'Decolonisation_of_Africa')),
  fact('f23', 'reform', 'prc', 'part-of', '改革开放是中华人民共和国自 1978 年起逐步推行的政策转向。', wiki('改革开放', 'Chinese_economic_reform')),
  fact('f24', 'han', 'tang', 'institution', '钱穆《中国历代政治得失》第一讲、第二讲以汉、唐对读：丞相主持的政府变成中书、门下、尚书三省和政事堂；察举变成科举；划一的轻税变成租庸调，后来又改为两税；人人服役的兵役变成府兵，再落到节度使。这是制度比较，不是两朝直接交接。'),
  fact('f25', 'tang', 'song', 'institution', '钱穆《中国历代政治得失》第二讲、第三讲认为宋大体沿袭唐制，再把相权拆开：中书单独取旨，军事归枢密院，财政归三司。科举扩大而官多，两税继续征收而负担加重，府兵式的义务兵变成长期养兵，边防转弱。'),
  fact('f26', 'song', 'ming', 'institution', '宋、明之间还有元朝。钱穆《中国历代政治得失》第三讲、第四讲只比较制度：明太祖废除丞相，内阁只是皇帝的秘书；考试收成八股；地方变成布政、按察与都指挥，再加督抚和胥吏；卫所模仿府兵，后来一样败坏。'),
  fact('f27', 'ming', 'qing', 'institution', '钱穆《中国历代政治得失》第四讲、第五讲把清看成部族政权：废宰相和内阁沿自明，雍正又设军机处，科举、赋税和兵权都加上满洲统治集团的控制。他用这个解释后来的变法。这是一家之言，不是政权更替本身。'),
]

const themeFor = {
  'theme-power': ['liangzhu', 'shang', 'egypt', 'zhou', 'qin', 'han', 'achaemenid', 'maurya', 'ashoka', 'rome', 'tang', 'song', 'yuan', 'ming', 'abbasid', 'mali', 'mongol', 'qing', 'mughal', 'canton', 'sun-yat-sen', 'xinhai', 'meiji', 'prc'],
  'theme-exchange': ['sumer', 'indus', 'han', 'zhang-qian', 'tang', 'xuanzang', 'song', 'mali', 'mongol', 'ming-silver', 'galleon', 'canton', 'atlantic-slavery', 'industrial', 'reform', 'globalization'],
  'theme-knowledge': ['yangshao', 'liangzhu', 'shang', 'sumer', 'indus', 'zhou', 'ashoka', 'zhang-qian', 'tang', 'xuanzang', 'song', 'abbasid', 'mali', 'industrial', 'may-fourth'],
  'theme-conflict': ['qin', 'rome', 'mongol', 'yuan', 'ming', 'qing', 'atlantic-slavery', 'opium', 'taiping', 'xinhai', 'industrial', 'meiji', 'africa-partition', 'wwi', 'may-fourth', 'wwii', 'decolonization', 'prc'],
  'theme-ecology': ['yangshao', 'liangzhu', 'sumer', 'egypt', 'indus', 'industrial'],
  'theme-welfare': ['yangshao', 'atlantic-slavery', 'industrial', 'africa-partition', 'reform', 'globalization'],
}

export const themeRelations = Object.entries(themeFor).flatMap(([themeId, members]) => members.map((id) => {
  const lens = ['theme-ecology', 'theme-welfare'].includes(themeId) ? readingLenses[id] : null
  return {
    id: `t-${themeId}-${id}`,
    from: id,
    to: themeId,
    type: 'theme',
    note: lens
      ? `参考赫拉利《人类简史》${lens.chapters}：${lens.question} 这是学习问题，不表示两个节点之间存在史实因果。`
      : `本站将“${nodes.find((node) => node.id === id).title}”列为“${themes.find((theme) => theme.id === themeId).title}”的学习案例；这是编排分类，不表示历史因果。`,
  }
}))

export const graphNodes = [...nodes, ...themes]
export const graphRelations = [...relations, ...factualRelations, ...themeRelations]
export const graphLabels = {
  comparison: '对照阅读', exchange: '交流', context: '历史背景', 'part-of': '属于',
  succession: '政权更替', ended: '结束', participated: '参与', ruled: '统治', institution: '制度演变', theme: '学习主题',
}
export const graphRelationSources = (relation) => relation.type === 'theme'
  ? [nodes.find((node) => node.id === relation.from)?.source].filter(Boolean)
  : relationSources(relation)

export function findPath(from, to, edges = graphRelations) {
  if (!from || !to || from === to) return []
  const queue = [[from, []]]
  const seen = new Set([from])
  while (queue.length) {
    const [current, path] = queue.shift()
    for (const edge of edges) {
      if (edge.from !== current && edge.to !== current) continue
      const next = edge.from === current ? edge.to : edge.from
      if (seen.has(next)) continue
      const nextPath = [...path, edge]
      if (next === to) return nextPath
      seen.add(next)
      queue.push([next, nextPath])
    }
  }
  return []
}
