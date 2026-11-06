// Reviewed against /tmp/notes-location-fields.json and the corresponding notes.
// These arrays replace automatic field matching, including links in negated text.
// A place may be a base, route node or later political center; reasons distinguish
// those roles from the event site. No coordinates are inferred here.
export const locationOverrides = {
  "历史/中国史/三国/东兴之战.md": {
    places: ["历史/中国史/东兴堤.md"],
    reason: "指安徽含山西南、巢湖出水通道的东兴堤；原文明排广西东兴及合肥旧城。",
  },
  "历史/中国史/三国/九品中正制确立.md": {
    places: ["region-cao-wei"],
    uncertain: true,
    reason: "《陈群传》未明载创制城市，仅关联曹氏魏国军政体系及州郡施行范围；不据中枢背景推定邺城或洛阳为创制地。",
  },
  "历史/中国史/三国/关羽失荆州.md": {
    places: ["历史/中国史/荆州.md", "历史/中国史/襄阳.md", "site-gong-an", "历史/中国史/江陵.md", "site-maicheng", "site-linju"],
    uncertain: true,
    reason: "分别关联历史荆州州域、襄樊北线、公安江陵后方、麦城败退据点与临沮被擒地区；临沮具体地望待考，不将麦城标作被杀地点。",
  },
  "历史/中国史/三国/刘备入蜀.md": {
    places: ["region-yizhou", "历史/中国史/成都.md", "site-fuling", "site-jiameng", "site-luocheng"],
    reason: "益州为历史州域，成都为政治中心，涪、葭萌、雒城为不同阶段据点；不以各现代省域替代古州域。",
  },
  "历史/中国史/三国/刘备称帝.md": {
    places: ["历史/中国史/成都.md"],
    reason: "本条关联221年成都称帝；219年沔阳设坛是原文用于区分的另一仪式。",
  },
  "历史/中国史/三国/司马昭弑君.md": {
    places: ["历史/中国史/洛阳.md"],
    reason: "冲突发生在洛阳宫门及城内道路，不增加边境战区。",
  },
  "历史/中国史/三国/吕布殒命白门楼.md": {
    places: ["历史/中国史/下邳.md"],
    reason: "白门楼属于今江苏睢宁古邳一带的下邳故城；南京白下门与许昌均为原文明排地点。",
  },
  "历史/中国史/三国/吴蜀重建联盟.md": {
    places: ["历史/中国史/白帝城.md", "历史/中国史/成都.md", "历史/中国史/武昌.md"],
    reason: "正文人物表明确永安接待吴使、成都辅政通吴及武昌吴方驻地，三处对应先后外交阶段，不表示同场会盟；武昌为今鄂州。",
  },
  "历史/中国史/三国/夷陵之战.md": {
    places: ["历史/中国史/夷陵.md", "历史/中国史/白帝城.md"],
    reason: "夷陵笔记涵盖夷陵、猇亭战区；鱼复改名永安并与奉节白帝城地区相关，是战后败退驻地。",
  },
  "历史/中国史/三国/姜维北伐.md": {
    places: ["历史/中国史/汉中.md", "site-longxi", "site-didao", "site-duangu", "site-houhe", "site-tazhong", "region-longyou"],
    uncertain: true,
    reason: "保留汉中基地、陇西狄道段谷侯和各战区、沓中屯田驻地及陇右交通范围；侯和、沓中具体地望待考，不把关中当作每次实际进抵地点。",
  },
  "历史/中国史/三国/孙权称帝.md": {
    places: ["历史/中国史/武昌.md", "历史/中国史/建康.md"],
    reason: "229年在今鄂州的武昌称帝，同年迁都建业；武汉市武昌区为原文明排地点，建康笔记承接建业历史身份。",
  },
  "历史/中国史/三国/孙策平定江东.md": {
    places: ["历史/中国史/江东.md"],
    reason: "关联长江下游南岸的江东区域，不因说明文字提及建业而缩为南京单城，也不将现代省界作为古地域边界。",
  },
  "历史/中国史/三国/官渡之战.md": {
    places: ["历史/中国史/官渡.md", "site-baima", "site-yanjin", "site-wuchao"],
    uncertain: true,
    reason: "官渡、白马、延津、乌巢分别为战役节点，乌巢具体地望待考，不合并成一个战场。",
  },
  "历史/中国史/三国/晋灭吴统一.md": {
    places: ["region-yangtze", "历史/中国史/江陵.md", "历史/中国史/武昌.md", "city-wuhan", "历史/中国史/建康.md"],
    reason: "关联沿江进军范围及江陵、武昌、夏口、建业诸节点；孙吴武昌对应今鄂州，夏口对应今武汉相关地区，建业为受降终点。",
  },
  "历史/中国史/三国/曹操北征乌桓.md": {
    places: ["历史/中国史/白狼山.md", "city-chaoyang"],
    uncertain: true,
    reason: "白狼山关联今辽宁喀左等相关古战场，柳城关联今辽宁朝阳；古战场范围不能据现代县界精确划定。",
  },
  "历史/中国史/三国/曹操受九锡.md": {
    places: ["历史/中国史/邺城.md", "region-cao-wei"],
    reason: "邺为魏国政治中心，区域条目表示曹氏魏国相关封域背景，不把汉廷册命来源或整个封域等同邺城。",
  },
  "历史/中国史/三国/曹操推行屯田制.md": {
    places: ["历史/中国史/许昌.md"],
    reason: "许都周边是明确记载的初行重点；后来推行州郡未逐一列明，不把此关联解释为全部范围或已知决策地点。",
  },
  "历史/中国史/三国/曹操攻取邺城.md": {
    places: ["历史/中国史/邺城.md"],
    reason: "关联今河北临漳一带邺城；对审配降曹的否定不产生额外地点。",
  },
  "历史/中国史/三国/曹魏灭燕.md": {
    places: ["历史/中国史/襄平.md", "region-liaodong"],
    reason: "燕指公孙氏辽东政权，襄平对应今辽宁辽阳；原文明确区别湖北襄阳及后来的慕容氏诸燕。",
  },
  "历史/中国史/三国/李傕郭汜之乱.md": {
    places: ["历史/中国史/长安.md", "region-guanzhong", "region-henan", "region-shanxi"],
    reason: "长安、关中为主要战区，河南、山西相关地区为献帝东归行程范围；不把全部过程压在长安城内。",
  },
  "历史/中国史/三国/汉中之战.md": {
    places: ["历史/中国史/汉中.md", "site-dingjunshan", "site-xunyang", "历史/中国史/成都.md"],
    reason: "汉中为战区，定军山为关键战斗地，沔阳为汉中王设坛处，成都仅为后方中心；此处沔阳对应陕西勉县，与湖北仙桃旧称沔阳不同。",
  },
  "历史/中国史/三国/江陵之战.md": {
    places: ["历史/中国史/江陵.md", "历史/中国史/夷陵.md"],
    reason: "关联江陵与夷陵两个不同作战据点，分别对应今荆州古城与宜昌相关地区。",
  },
  "历史/中国史/三国/淮南三叛.md": {
    places: ["历史/中国史/寿春.md", "site-xiang", "site-lejia", "region-huainan", "region-huai-river"],
    uncertain: true,
    reason: "寿春为三次事件的核心军镇，项、乐嘉及淮河流域为相关据点和战区；乐嘉具体范围待考，寿春不代表全部战斗地点。",
  },
  "历史/中国史/三国/渭南之战.md": {
    places: ["历史/中国史/潼关.md", "site-weinan"],
    reason: "关联潼关及渭水南岸古战场，不以现代渭南市全域替代战区。",
  },
  "历史/中国史/三国/湘水划界.md": {
    places: ["历史/中国史/荆州.md", "region-xiang-river", "city-changsha", "site-jiangxia", "site-guiyang", "site-nanjun", "site-lingling", "site-wuling"],
    reason: "保留荆州州域、湘水与六郡各自的相关地区；湘水为概括分界，长沙等现代对应地点不代表古郡完整疆界。",
  },
  "历史/中国史/三国/白帝城托孤.md": {
    places: ["历史/中国史/白帝城.md", "历史/中国史/成都.md"],
    uncertain: true,
    reason: "托孤及去世记于永安，白帝城笔记承接相关地区；永安宫与白帝城城址不能精确等同，成都仅为继位及辅政中心。",
  },
  "历史/中国史/三国/石亭之战.md": {
    places: ["site-wancheng", "site-shiting", "site-jiashi"],
    uncertain: true,
    reason: "关联安徽西南皖、石亭、夹石一线，石亭具体古址有争议；原文明排合肥战场，江淮及长江说明交通联系。",
  },
  "历史/中国史/三国/蜀汉灭亡.md": {
    places: ["历史/中国史/汉中.md", "历史/中国史/剑阁.md", "site-yinping", "历史/中国史/绵竹.md", "历史/中国史/成都.md"],
    reason: "保留汉中防区、剑阁主道、阴平迂回、汉晋绵竹屏障与成都受降中心，各地对应不同军事及政治阶段。",
  },
  "历史/中国史/三国/街亭之战.md": {
    places: ["历史/中国史/街亭.md", "region-longyou"],
    uncertain: true,
    reason: "采用今甘肃秦安一带的通常街亭定位并保留古址争议；陇右为相关交通与主力作战区域，不据道路方向认定关中已经成为战场。",
  },
  "历史/中国史/三国/诸葛亮北伐.md": {
    places: ["历史/中国史/汉中.md", "site-qishan", "site-chencang", "region-longyou", "历史/中国史/五丈原.md"],
    reason: "汉中为基地，祁山、陈仓、陇右、五丈原分属各次出兵相关战区；祁山对应甘肃，五丈原对应陕西，不统一归作陕西。",
  },
  "历史/中国史/三国/诸葛亮南征.md": {
    places: ["region-nanzhong", "历史/中国史/成都.md"],
    reason: "南中区域涵盖云南、贵州及四川西南部，成都为后方决策调度中心；引用北伐笔记不意味着北伐战场属于本次南征。",
  },
  "历史/中国史/三国/诸葛瑾致书刘备.md": {
    places: ["历史/中国史/白帝城.md"],
    uncertain: true,
    reason: "《诸葛瑾传》未说明致书准确地点；白帝仅为信中刘备军到达消息所涉地区，不是会面证据，成都为原文明排推定。",
  },
  "历史/中国史/三国/赤壁之战.md": {
    places: ["历史/中国史/赤壁.md"],
    uncertain: true,
    reason: "采用湖北赤壁及乌林相关地区的通常定位，保留古战场范围考证；排除苏轼诗赋创作的黄州赤壁。",
  },
  "历史/中国史/三国/逍遥津之战.md": {
    places: ["历史/中国史/合肥.md", "site-xiaoyaojin"],
    reason: "合肥为围城对象，逍遥津为撤退追击的渡口节点，两者承担不同阶段职能。",
  },
  "历史/中国史/三国/邓艾偷渡阴平.md": {
    places: ["site-yinping", "site-jiangyou", "历史/中国史/绵竹.md", "历史/中国史/成都.md"],
    reason: "阴平对应甘肃文县及相关通道，江由对应四川平武南坝，绵竹沿用汉晋地点笔记；不定位现代江油城区或今日绵竹市中心。",
  },
  "历史/中国史/三国/钟会之乱.md": {
    places: ["历史/中国史/成都.md", "历史/中国史/长安.md", "历史/中国史/洛阳.md"],
    reason: "成都为拘禁将领及兵变中心，长安、洛阳为增兵路线与设想东进方向的相关据点，不表示兵变在三城同时发生。",
  },
  "历史/中国史/三国/隆中对.md": {
    places: ["site-longzhong", "历史/中国史/襄阳.md"],
    uncertain: true,
    reason: "采用襄阳城西隆中的通常定位，保留谈话原址考证；不把古南阳郡、邓县套为现代河南南阳市或将纪念场所等同原址。",
  },
  "历史/中国史/三国/高平陵之变.md": {
    places: ["历史/中国史/洛阳.md", "site-gupingling"],
    uncertain: true,
    reason: "洛阳城与洛水浮桥周边为主要夺权及施压空间，高平陵为曹芳祭陵目的地；陵址有争议，不把全部政变行动定位陵墓现场。",
  },
  "历史/中国史/唐/怛罗斯之战.md": {
    places: ["历史/中国史/怛罗斯.md"],
    uncertain: true,
    reason: "关联中亚怛罗斯城附近塔拉斯河流域，保留具体古战场位置讨论，不把现代塔拉兹城市点当作已经确定的战场。",
  },
  "历史/中国史/唐/朱温废唐.md": {
    places: ["历史/中国史/洛阳.md", "历史/中国史/开封.md"],
    reason: "洛阳与汴州分别承接不同政治行动，汴州沿用开封笔记。",
  },
  "历史/中国史/唐/玄奘西行.md": {
    places: ["历史/中国史/长安.md", "region-hexizoulang", "region-western-regions", "region-india"],
    reason: "长安为出发地，河西、西域为经过地区，印度为求学目的地；原文讨论的是出发纪年，并非这些地理关联存疑。",
  },
  "历史/中国史/宋/嘉定和议.md": {
    places: ["历史/中国史/临安.md", "region-jin-territory"],
    reason: "临安与金朝廷分别为使节交涉相关中枢，金方采用区域条目，不推定一座双方皇帝会面的城市。",
  },
  "历史/中国史/宋/宋高宗即位.md": {
    places: ["历史/中国史/南京应天府.md", "region-jianghuai", "region-liangzhe", "历史/中国史/临安.md"],
    reason: "即位地点为今河南商丘的宋南京应天府，江淮、两浙及临安为此后朝廷行止与长期行在，不关联江苏南京。",
  },
  "历史/中国史/宋/资治通鉴成书.md": {
    places: ["历史/中国史/洛阳.md", "历史/中国史/开封.md"],
    reason: "洛阳为重要编修地，开封为接收进呈的朝廷所在，不据进呈一词推定司马光当年亲返开封。",
  },
  "历史/中国史/宋/雍熙北伐.md": {
    places: ["region-hebei", "region-shanxi", "历史/中国史/幽州.md"],
    reason: "河北、山西北部及幽州外围为相关战区；区域关联不表示覆盖现代两省全境，也不缩为幽州城下一处。",
  },
  "历史/中国史/汉/汉献帝禅让.md": {
    places: ["历史/中国史/繁阳亭.md", "历史/中国史/洛阳.md"],
    reason: "繁阳亭为受禅坛所在，洛阳为曹丕随后营建的都城；不将许县城内或退位汉帝封邑山阳列为受禅地点。",
  },
  "历史/中国史/清/武昌起义.md": {
    places: ["city-wuhan"],
    reason: "1911年武昌指今武汉市武昌地区，与孙吴武昌所在今鄂州不同，不使用三国武昌笔记。",
  },
  "历史/中国史/中华人民共和国/邓小平南方谈话.md": {
    places: ["city-wuhan", "city-shanghai"],
    reason: "字段中的武昌指今武汉市武昌地区；本条保留所列行程两端，不使用今鄂州的孙吴武昌身份。",
  },
};

// Regional identity only: the notes establish a governing system and its changing
// jurisdiction, not a proven creation city, historical polygon or map centroid.
export const extraPlaces = [
  {
    id: "region-cao-wei",
    title: "曹氏魏国与曹魏相关州郡",
    aliases: ["曹氏魏国", "魏王政权", "魏国军政体系", "曹魏统治区"],
    location: {
      id: "cao-wei",
      kind: "region",
      modernName: "今中国北方及相关历史州郡，指曹氏魏国至曹魏的军政范围，随时期变化，不等同战国魏国",
      variants: [],
    },
  },
];
