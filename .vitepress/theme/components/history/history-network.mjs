import { nodes, relations, relationSources } from './history-data.mjs'

/** @typedef {'comparison' | 'exchange' | 'context' | 'part-of' | 'succession' | 'ended' | 'participated' | 'ruled' | 'theme'} GraphRelationType */

// 主题节点是本站的阅读分类，不是历史实体，也不代表史实因果。
export const themes = [
  { id: 'theme-power', title: '权力与制度', kind: 'theme', track: 'theme', summary: '观察国家、统治与制度变迁。' },
  { id: 'theme-exchange', title: '交流与贸易', kind: 'theme', track: 'theme', summary: '观察商品、人员和观念如何流动。' },
  { id: 'theme-knowledge', title: '知识与传播', kind: 'theme', track: 'theme', summary: '观察文字、宗教、技术与思想传播。' },
  { id: 'theme-conflict', title: '冲突与变革', kind: 'theme', track: 'theme', summary: '观察战争、殖民与社会运动。' },
]

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
]

const themeFor = {
  'theme-power': ['liangzhu', 'shang', 'egypt', 'zhou', 'qin', 'han', 'achaemenid', 'maurya', 'ashoka', 'rome', 'tang', 'song', 'yuan', 'ming', 'abbasid', 'mali', 'mongol', 'qing', 'mughal', 'canton', 'sun-yat-sen', 'xinhai', 'meiji', 'prc'],
  'theme-exchange': ['sumer', 'indus', 'han', 'zhang-qian', 'tang', 'xuanzang', 'song', 'mali', 'mongol', 'ming-silver', 'galleon', 'canton', 'atlantic-slavery', 'industrial', 'reform', 'globalization'],
  'theme-knowledge': ['yangshao', 'liangzhu', 'shang', 'sumer', 'indus', 'zhou', 'ashoka', 'zhang-qian', 'tang', 'xuanzang', 'song', 'abbasid', 'mali', 'industrial', 'may-fourth'],
  'theme-conflict': ['qin', 'rome', 'mongol', 'yuan', 'ming', 'qing', 'atlantic-slavery', 'opium', 'taiping', 'xinhai', 'industrial', 'meiji', 'africa-partition', 'wwi', 'may-fourth', 'wwii', 'decolonization', 'prc'],
}

export const themeRelations = Object.entries(themeFor).flatMap(([themeId, members]) => members.map((id) => ({
  id: `t-${themeId}-${id}`,
  from: id,
  to: themeId,
  type: 'theme',
  note: `本站将“${nodes.find((node) => node.id === id).title}”列为“${themes.find((theme) => theme.id === themeId).title}”的学习案例；这是编排分类，不表示历史因果。`,
})))

export const graphNodes = [...nodes, ...themes]
export const graphRelations = [...relations, ...factualRelations, ...themeRelations]
export const graphLabels = {
  comparison: '对照阅读', exchange: '交流', context: '历史背景', 'part-of': '属于',
  succession: '政权更替', ended: '结束', participated: '参与', ruled: '统治', theme: '学习主题',
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
