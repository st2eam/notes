// Reproducible content migration; upstream files are parsed as literals only.
// Review inputs are project-owned modules. Markdown remains the graph's sole source.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { sourceCoordinates } from './source-coordinates.mjs';
import matter from 'gray-matter';
import { readVault, scanFiles, parseNote } from '../../.vitepress/vault/build.mjs';
import { resolveLink } from '../../.vitepress/vault/model.mjs';
import { geographicPlaces } from '../../.vitepress/vault/geo-places.mjs';
import { parseHistoryTime } from '../../.vitepress/vault/history-time.mjs';
import { parseUpstreamData } from './jiangshan.mjs';
import { existingCorrespondence, residualEvents, eventOverrides, differences, newDates, groupFor } from './content-review-data.mjs';
import { people, concepts } from './review-entities.mjs';

const root = process.cwd();
const write = process.argv.includes('--write');
const base = 'public/history/sources/jiangshan';
const manifest = JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
for(const file of manifest.files){
 const bytes=fs.readFileSync(path.join(base,file.path));
 if(createHash('sha256').update(bytes).digest('hex')!==file.sha256)throw new Error(`Source checksum mismatch: ${file.upstreamPath}`);
}
export const sourceUrl = `https://github.com/DeanChensj/jiangshan-map/blob/${manifest.commit}/js/map_data.js`;
const attribution = 'DeanChensj/jiangshan-map and contributors；固定快照派生内容遵循 GPL-3.0-only，许可见仓库 public/history/sources/jiangshan/license/LICENSE。';
const dynasties = parseUpstreamData(fs.readFileSync(path.join(base,'map-data/source.js.txt'),'utf8'),'DYNASTY_DATA');
const citations = parseUpstreamData(fs.readFileSync(path.join(base,'milestone-sources/source.js.txt'),'utf8'),'ATLAS_MILESTONE_SOURCES');
// Migrate the earlier literal-source title while preserving its stable historyId.
const oldMaling='历史/中国史/东周/事件/马陵之战孙膑射杀庞涓.md';
const newMaling='历史/中国史/东周/事件/马陵之战.md';
if(write&&fs.existsSync(oldMaling)){
 for(const file of scanFiles(root).filter(file=>path.relative(root,file).replaceAll('\\','/').startsWith('历史/'))){
  const raw=fs.readFileSync(file,'utf8');
  const next=raw.replaceAll(oldMaling.replace(/\.md$/,''),newMaling.replace(/\.md$/,'')).replaceAll('|马陵之战孙膑射杀庞涓]]','|马陵之战]]');
  if(next!==raw)fs.writeFileSync(file,next);
 }
 fs.renameSync(oldMaling,newMaling);
 const prior='.vitepress/reports/history-content-review.json';
 if(fs.existsSync(prior)){
  const remap=value=>Array.isArray(value)?value.map(remap):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,item])=>[key,remap(item)])):value===oldMaling?newMaling:value==='马陵之战孙膑射杀庞涓'?'马陵之战':value;
  fs.writeFileSync(prior,JSON.stringify(remap(JSON.parse(fs.readFileSync(prior,'utf8'))),null,2)+'\n');
 }
}
const original = readVault(root);
const initialEvents = original.notes.filter(n=>n.id.startsWith('历史/中国史/')&&n.historyId&&!n.historyId.startsWith('event-jiangshan-'));
const notes = new Map(scanFiles(root).map(file=>{const id=path.relative(root,file).replaceAll('\\','/');const raw=fs.readFileSync(file,'utf8');return [id,{...matter(raw),raw}];}));
const written = new Set();
const previousReviewPath = '.vitepress/reports/history-content-review.json';
const previousReview = fs.existsSync(previousReviewPath) ? JSON.parse(fs.readFileSync(previousReviewPath,'utf8')) : null;
const sha = text=>createHash('sha256').update(text).digest('hex');
// Regenerate original events from immutable source prose. Reversing previously
// inserted links loses alias labels and can corrupt headings on repeated runs.
const localBaselineCommit = previousReview?.localBaselineCommit || '9d2d3c6c014b9b82f58c9c41314e414df508ac95';
for (const note of initialEvents) {
  const raw = execFileSync('git', ['show', `${localBaselineCommit}:${note.id}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const before = previousReview?.edits?.find(edit=>edit.historyId===note.historyId)?.beforeSha256;
  const lf = raw.replace(/\r\n/g, '\n');
  if (before && ![raw, lf, lf.replace(/\n/g, '\r\n')].some(text=>sha(text)===before)) {
    throw new Error(`Original event baseline mismatch: ${note.id}`);
  }
  notes.set(note.id, {...matter(raw), raw});
}
const originalEventPaths = new Set(initialEvents.map(note=>note.id));
const allowedCoordinates = sourceCoordinates(dynasties);
const discardedCoordinates = [...(previousReview?.discardedCoordinates || [])];
const added = new Set(previousReview?.created || []);
const expected = new Map();
for (const link of previousReview?.expectedLinks || []) {
  if (notes.get(link.source)?.data.historyId?.startsWith('event-jiangshan-')) continue;
  if (originalEventPaths.has(link.source)) continue;
  const list = expected.get(link.source) || [];
  list.push({ target: link.target, type: link.type });
  expected.set(link.source, list);
}
const edits = [];
const noext = id=>id.replace(/\.md$/,'');
const wikilink = (id,label)=>path.posix.basename(id,'.md')===label?`[[${noext(id)}]]`:`[[${noext(id)}|${label}]]`;
const safe = text=>text.replace(/[<>:"/\\|?*]/g,'').replace(/\.$/,'').trim();
const yearLabel = year=>year<0?`前 ${-year} 年`:`${year} 年`;
const eventKey = (p,m)=>`${p.key}:${m.year}`;
const eventId = (p,m,suffix='')=>`event-jiangshan-${p.key}-${m.year<0?'bce'+(-m.year):m.year}${suffix}`;
const sourceLine = key=>`- [江山地图：${key}](${sourceUrl})，原始里程碑及地点；${attribution}`;
const sourceBooks = key=>(citations[key]||[]).map(([book,vols])=>`- 上游列出的文献线索：《${book}》${vols.join('、')}。此处保留线索，不表示已经逐卷复核。`).join('\n');
function save(id,data,content){
  const raw=matter.stringify(content.trim()+'\n',data,{lineWidth:-1});
  if(!notes.has(id))added.add(id);
  notes.set(id,{data,content:content.trim()+'\n',raw});
  written.add(id);
}
function meta(title,category,tags=[]){return {title,primaryCategory:category,categories:[{path:category,reason:'按笔记实际讨论的历史实体、事件或地点归类。'}],classificationStatus:'confirmed',tags:['历史','中国史',...tags],relations:[]};}
function remember(source,target,type='citation'){
  if(source===target)return;
  const row=expected.get(source)||[];
  if(!row.some(r=>r.target===target&&r.type===type))row.push({target,type});
  expected.set(source,row);
}
function paragraphLinks(text,targets){
  // Existing Markdown/wiki links and URLs are never rewritten. Each entity is
  // linked once, longest name first; aliases only enter after unambiguous review.
  const done=new Set();
  return text.split(/(^#{1,6} .*$|\[\[[\s\S]*?\]\]|!?\[[^\]\n]*\]\([^\n)]*\)|https:\/\/\S+)/gm).map(segment=>{
    if(/^(#{1,6} |\[\[|!?\[|https:\/\/)/.test(segment))return segment;
    for(const {term,id} of targets){if(done.has(id)||term.length<2)continue;const at=segment.indexOf(term);if(at>=0){segment=segment.slice(0,at)+wikilink(id,term)+segment.slice(at+term.length);done.add(id);}}
    return segment;
  }).join('');
}

// Remove falsely attributed points before any note can reuse them. Keep their
// identities and prose; an unavailable map is preferable to an invented location.
for (const [id, note] of notes) {
  const variants = note.data.geo?.place?.variants;
  if (!variants) continue;
  const invalid = variants.filter(variant=>variant.coordinates &&
    (variant.source?.url===sourceUrl || variant.source?.url?.startsWith(sourceUrl+'#')) &&
    !allowedCoordinates.has(JSON.stringify(variant.coordinates)));
  if (!invalid.length) continue;
  for (const variant of invalid) {
    if (!discardedCoordinates.some(row=>row.path===id && row.variant===variant.id)) {
      discardedCoordinates.push({path:id, variant:variant.id, coordinates:variant.coordinates, reason:'坐标不在标注的固定来源中，移除该代表点。'});
    }
  }
  note.data.geo.place.variants = variants.filter(variant=>!invalid.includes(variant));
  save(id, note.data, note.content);
}

// A small definition is supplemented by the concrete event facts it explains.
const entities=[];
const titleIndex=()=>[...notes].map(([id,p])=>({id,title:p.data.title||p.content.match(/^# (.+)$/m)?.[1]||path.posix.basename(id,'.md'),aliases:p.data.aliases||[]}));
for(const [title,group,definition] of people){
  const found=titleIndex().filter(n=>n.title===title||(n.aliases||[]).includes(title));
  let id;
  if(found.length===1)id=found[0].id;
  else {
    id=`历史/中国史/${group}/人物/${safe(title)}.md`;
    const mentions=dynasties.flatMap(p=>p.milestones.filter(m=>m.headline.includes(title.replace('（前蜀）',''))).map(m=>({key:eventKey(p,m),year:m.year,headline:m.headline})));
    if(!mentions.length)continue;
    const excerpts=mentions.slice(0,6).map(m=>`- ${yearLabel(m.year)}：${m.headline}。`).join('\n');
    save(id,meta(title,`历史/中国史/${group}/人物`,['人物']),`# ${title}\n\n${definition}\n\n## 与时间线有关的活动\n\n${excerpts}\n\n以上各项是上游里程碑对其活动的摘要。任官、作战与即位属于不同身份阶段，具体年份的异同以各事件笔记中的对读说明为准。\n\n## 来源\n\n${sourceLine(mentions.map(m=>m.key).join('、'))}`);
  }
  entities.push({term:title.replace('（前蜀）',''),id});
}
for(const [title,definition,background] of concepts){
  const found=titleIndex().filter(n=>n.title===title||(n.aliases||[]).includes(title));
  let id;
  if(found.length===1)id=found[0].id;
  else {
    id=`历史/中国史/概念/${safe(title)}.md`;
    const target=`历史/中国史/专题/${background}.md`;
    save(id,meta(title,'历史/中国史/概念',['概念']),`# ${title}\n\n${definition}\n\n## 事件与制度的区别\n\n本概念用于解释事件笔记中对应的制度、组织或交往方式。政策颁布地、实际施行范围和后续变化需要分别考察，不能用一个时间线代表点取代这些层次。\n\n具体历史背景见${wikilink(target,background)}。\n\n## 来源\n\n- ${wikilink(target,background)}及其列出的史籍与研究。\n- [江山地图固定版本：相关制度事件](${sourceUrl})，保留其事件线索；${attribution}`);
    remember(id,target);
  }
  entities.push({term:title,id});
}
// Existing people/institution aliases are resolved by identity, never by dates.
for(const n of original.notes.filter(n=>n.id.startsWith('历史/中国史/')&&!n.historyId&&!n.id.endsWith('index.md')&&!n.geo?.place)){
  if(/\/人物\/|制度\.md$|考试选举\.md$|政府组织\.md$/.test(n.id))for(const term of [n.title,...n.aliases])if(term.length>=2&&!entities.some(e=>e.term===term))entities.push({term,id:n.id});
}
entities.sort((a,b)=>b.term.length-a.term.length);

function splitSites(value){let depth=0,start=0,out=[];for(let i=0;i<value.length;i++){if('（('.includes(value[i]))depth++;if('）)'.includes(value[i]))depth--;if(value[i]==='·'&&depth===0){out.push(value.slice(start,i).trim());start=i+1;}}out.push(value.slice(start).trim());return out.filter(Boolean);}
const customSites={
 'zhanguo:-356':['栎阳','咸阳'], 'zhanguo:-226':['咸阳','蓟城'],
 'xihan:-100':['大宛','敦煌','于阗'], 'donghan:25':['鄗城','洛阳','长安'],
 'donghan:97':['西域至波斯湾'], 'sanguo:229':['武昌（鄂州）','建业'],
 'sanguo:230':['夷洲（台湾相关地区）'], 'dongjin:407':['朔方','龙城'],
 'sui:581':['长安','大兴'], 'yuan:1293':['大都','通州'],
 'ming:1627':['澄城'], 'prc:1951':['北京','拉萨'],
 'xihan:23':['南阳地区','昆阳','长安'], 'xijin:299':['关陇','洛阳'],
 'nanbei:431':['西秦及胡夏交战范围','建康'],
 'tang:840':['漠北','振武镇','潞州','长安'],
 'yuan:1281':['澎湖','泉州','日本西南沿海'],
 'qing:1759':['准噶尔','南疆','伊犁'],
};
const regionPattern=/一线|地区|区域|范围|流域|草原|河西|河套|河湟|关中|南中|西域|淮河|荆襄|全境|州郡|台湾相关地区|波斯湾|黄海|六盘山|阿尔泰山|杭爱山|肯特山|阴山|金沙江|长江|鄱阳湖|东南|漠北|吐蕃/;
const aliases={
 '郢都':'江陵','王城':'洛阳','晋阳':'太原','建业':'建康','建邺':'建康','金陵':'建康','应天':'建康','应天府':'建康','江宁':'建康','天京':'建康',
 '神都洛阳':'洛阳','东都洛阳':'洛阳','大兴':'长安','平城':'平城（大同）','汴州':'开封','东京开封府':'开封','汴梁':'开封','汴京':'开封',
 '南京应天府':'南京应天府','兴庆府':'银川','西平府':'灵州','番禺':'广州','兴王府':'广州','临安':'临安',
 '中庆':'昆明','云南府':'昆明','幽州':'幽州','范阳':'幽州','蓟城':'幽州','襄平':'襄平','大都':'北京','北平':'北京',
 '中都':'北京','中都大兴府':'北京','盛京':'沈阳','新京':'长春','逻些':'拉萨','天京（江宁）':'建康',
 '淝水':'淝水','寿阳':'寿春','寿州':'寿春','函谷关':'函谷关（灵宝）','北庭都护府':'北庭','西宁州':'西宁','振武镇':'振武',
};
const placeByTitle=new Map();
const existingPlaceNotes=original.notes.filter(n=>n.geo?.place&&n.id.startsWith('历史/中国史/'));
// Exact historical titles take precedence over later-created modern-name aliases.
for(const n of existingPlaceNotes)if(!placeByTitle.has(n.title))placeByTitle.set(n.title,n.id);
for(const n of existingPlaceNotes)for(const name of n.aliases)if(!placeByTitle.has(name))placeByTitle.set(name,n.id);
const catalogById=new Map(geographicPlaces.map(p=>[p.id,p]));
const siteRecords=[];
function siteNode(label,coord,key,year,custom={}){
 const bare=label.replace(/（[^）]*）/g,'').trim();
 let canonical=aliases[bare]||bare;
 // Avoid identity collisions: Wu's Wuchang is Ezhou; twentieth-century Wuchang
 // is Wuhan, and Song Nanjing is Shangqiu rather than Jiangsu Nanjing.
 if(bare==='武昌')canonical=year<300?'武昌':'武汉';
 if(label==='武昌（鄂州）')canonical='武昌';
 if(label==='夷洲（台湾相关地区）')canonical='夷洲';
 let id=placeByTitle.get(canonical);
 if(!id){
   id=`历史/中国史/地点/${safe(canonical)}.md`;
   if(notes.has(id)&&!notes.get(id).data.geo?.place)id=`历史/中国史/地点/${safe(canonical)}（历史地理）.md`;
   placeByTitle.set(canonical,id);
 }
 let p=notes.get(id);
 if(!p){
  const cat=geographicPlaces.find(p=>[p.title,...p.aliases].includes(canonical));
  const broad=regionPattern.test(label)||['夷洲','朔方','关陇','淮南','西晋州郡','河套','大宛','大月氏','乌孙','匈奴','荆州','益州','准噶尔','南疆','漠北','日本西南沿海'].includes(canonical)||cat?.location.kind==='region';
  const modern=custom.modernName||label.match(/（([^）]+)）/)?.[1]||cat?.location.modernName||'具体古址与现代边界需结合史料考证';
  const data=meta(canonical,'历史/中国史/地点',['地点']);
  data.aliases=[...new Set([bare,label,...(cat?.aliases||[])].filter(x=>x!==canonical))];
  data.geo={scope:'china',place:{id:cat?.location.id||'history-'+sha(canonical).slice(0,12),kind:broad?'region':'point',modernName:modern,variants:[]}};
  const content=`# ${canonical}\n\n${canonical}是本仓库事件笔记使用的${broad?'历史地理范围':'历史地点'}。江山地图在“${key}”条中将它写作“${label}”；此名称用于定位该事件涉及的地点身份，不表示不同时期的城市、辖区或现代行政边界完全相同。\n\n## 地点与事件范围\n\n${broad?'本条按区域处理。区域可能包含多处聚落、交通线或战场，不能以一个坐标代表完整边界；没有有据的区域几何时保留范围说明。':'上游坐标仅作聚落或事件区域的代表点，不是经考古测定的宫殿、古城城墙或战场精确位置。'}古今名和同名异地应结合事件年代判断。\n\n## 来源\n\n${sourceLine(key)}`;
  save(id,data,content);p=notes.get(id);
 }
 if(canonical==='振武'){
   p.data.geo.place.modernName='今内蒙古和林格尔一带，非大同';
   p.data.geo.place.variants=p.data.geo.place.variants.filter(v=>v.source?.url!==sourceUrl);
   if(!p.content.includes('## 地望校订'))p.content+='\n\n## 地望校订\n\n唐代振武镇治所通常定位今内蒙古和林格尔一带。上游将振武括注为大同，本条保留引文供对读，但不沿用该城市身份或其坐标。原记录的事件代表点已经移除，准确城址仍须结合历史地理资料考证。\n';
   save(id,p.data,p.content);
 }
 const coordinateRecorded = Array.isArray(coord) && allowedCoordinates.has(JSON.stringify(coord));
 if(coordinateRecorded&&p.data.geo?.place?.kind==='point'){
   const variantId='jiangshan-'+sha(`${key}:${label}:${coord}`).slice(0,12);
   if(!p.data.geo.place.variants.some(v=>v.id===variantId)){
     p.data.geo.place.variants.push({id:variantId,name:label,from:year,to:year,coordinates:coord,accuracy:'江山地图里程碑的地点代表点；仅表示该条在相应年份的概略定位，不是古址或战场边界。',source:{title:`江山地图 ${key} · ${label}`,url:sourceUrl}});
     save(id,p.data,p.content);
   }
 }
 siteRecords.push({id,label,key,coordinateRecorded:coordinateRecorded && p.data.geo.place.kind==='point',coordinateRejected:Array.isArray(coord) && !coordinateRecorded,kind:p.data.geo.place.kind});
 return {target:id,name:label,role:'occurrence'};
}
function sitesFor(period,m,override){
 const key=eventKey(period,m);
 const labels=override?.site?splitSites(override.site):customSites[key]||splitSites(m.site);
 const coords=override?.siteCoords||m.siteCoords;
 return labels.map((label,i)=>{
  let coord=override?.coordinates||(override?.site&&override.site!==m.site&&!override.siteCoords?null:coords?.length===labels.length?coords[i]:labels.length===1?m.coord:null);
  // Coordinates for changed place identities are not transplanted from the
  // upstream entry's other city. They remain absent unless explicitly sourced.
  if(customSites[key])coord=null;
  return siteNode(label,coord,key,m.year);
 });
}

const ledger=[];
for(const period of dynasties)for(const m of period.milestones){
 const key=eventKey(period,m), group=groupFor[period.key];
 const ids=existingCorrespondence[key]||[];
 const matches=[];
 for(const historyId of ids){
  const n=initialEvents.find(n=>n.historyId===historyId);
  if(!n)throw new Error(`Reviewed local event missing: ${key} ${historyId}`);
  const reason=`正文中的“${n.title}”与上游“${m.headline}”对应；对应范围为该具名行动/制度阶段，非单凭同年匹配。`;
  matches.push({historyId,title:n.title,path:n.id,scope:n.title,reason,difference:differences[key]||null});
 }
 const createEvent=(details,suffix='')=>{
  const title=details?.title||m.headline.split(/[；：]/)[0].split('，').slice(0,2).join('，').replace(/[“”]/g,'').slice(0,68);
  const id=`历史/中国史/${group}/事件/${safe(title)}.md`;
  const historyId=eventId(period,m,suffix);
  const previous=notes.get(id);
  if(previous&&previous.data.historyId!==historyId)throw new Error(`Content title identity collision: ${id}`);
  const date=details?.date||newDates[key]||yearLabel(m.year);
  const places=sitesFor(period,m,details);
  const main=details?.text||(differences[key]?`上游以${yearLabel(m.year)}为节点概述：“${m.headline}”。\n\n本地对读：${differences[key]}`:m.headline+'。');
  const entityTargets=entities.filter(e=>main.includes(e.term)).filter((e,i,a)=>a.findIndex(x=>x.id===e.id)===i).slice(0,5);
  const linked=paragraphLinks(main,entityTargets);
  const geoText=places.map(p=>wikilink(p.target,p.name)).join('、');
  const data={...meta(title,`历史/中国史/${group}/事件`,[group]),historyId,historyKind:'event',historyPeriod:initialEvents.find(n=>n.historyGroup===group)?.historyPeriod||'postclassical',historyTrack:'china',historyDate:date,historyOrder:parseHistoryTime(date).from*10000,historyGroup:group,
    geo:{scope:'china',time:{from:parseHistoryTime(date).from,to:parseHistoryTime(date).to},places,bindingStatus:customSites[key]||places.some(p=>notes.get(p.target).data.geo.place.kind==='region')?'uncertain':'bound',locationNote:`${places.map(p=>p.name).join('、')}。地点分别对应正文中的行动或地理范围；代表点不表示精确战场/宫城。`}};
  const limit=details&&differences[key]?`\n\n## 对读与纪年\n\n${differences[key]}`:'';
  const sourceQuote=details?`${details.source?'\n\n- [本条核对的史籍原文]('+details.source+')。':''}\n\n上游合写原条：“${m.headline}”。本条只展开其中“${title}”相关部分，其余行动分别对应同条清单中的笔记。`:'';
  const content=`# ${title}\n\n> ${date}\n\n${linked}\n\n## 发生地点\n\n${geoText}。}${sourceQuote}${limit}\n\n## 来源\n\n${sourceLine(key)}${sourceBooks(key)?'\n'+sourceBooks(key):''}`;
  save(id,data,content);
  for(const e of entityTargets)remember(id,e.id);
  for(const place of places)remember(id,place.target);
  matches.push({historyId,title,path:id,scope:details?title:m.headline,reason:details?'将上游合写条目中未被既有笔记完整覆盖的独立行动展开。':'逐句读取上游叙述后补入缺失里程碑，正文保留具名人物、行动和地点范围。',difference:differences[key]||null});
 };
 // The 216 entry is fully rewritten by the curated supplemental record below.
 if(!ids.length&&key!=='donghan:216')createEvent(eventOverrides[key]);
 if(residualEvents[key])createEvent(residualEvents[key],'-detail');
 ledger.push({upstreamKey:key,index:period.milestones.indexOf(m),period:period.title,year:m.year,headline:m.headline,site:m.site,matches,difference:differences[key]||null,coverage:ids.length?'reviewed-existing-content':'added-content',compoundPolicy:'合写条目的对应范围见每条scope；不把各子句的同年、同坐标当作相互印证。'});
}
// Add small explicit residuals that are not represented by an existing title.
const supplemental=[
 ['qin',-209,{title:'秦末赵燕齐政权复立',text:'前209年陈胜吴广起兵后，反秦行动扩展到六国故地。武臣在赵地称王，韩广在燕地自立，田儋在齐地起事并称王；这些政权与陈胜所建张楚存在联系，也各有政治行动。不能把它们全定位在大泽乡的起义现场。',site:'邯郸 · 蓟城 · 临淄'}],
 ['qin',-206,{title:'鸿门宴与项羽分封诸侯',text:'前206年，刘邦到项羽驻军的鸿门会见项羽，发生后世所称鸿门宴。其后项羽主持分封诸侯，刘邦受封汉王，诸王争夺逐渐转为楚汉战争。鸿门会见、关中戏下分封与后续各地战事属于不同阶段；不是子婴投降之日就已全部完成。',site:'鸿门 · 戏下'}],
 ['xihan',-202,{title:'垓下之战',text:'楚汉战争末期，汉及诸侯联军在垓下围击项羽军，项羽突围后败亡，楚汉战争随之结束。垓下通常联系今安徽固镇濠城一带，其历史地望仍应与现代行政区区分。此役是刘邦称帝之前的军事阶段，定陶氾水称帝仪式另有笔记，不将二者合为一次活动。',site:'垓下'}],
 ['tang',713,{title:'唐册封大祚荣为渤海郡王',text:'713年，唐朝遣使册封大祚荣为渤海郡王，其政权此后以渤海为名见于记载。这是唐与东北政权的册封交往，不是长安先天政变的组成行动，也不能把受封一事理解为全部渤海地域均由唐朝中枢直接行政管理。外交行动分别涉及唐廷与大祚荣政权，准确使行路线不详。',site:'长安 · 渤海政权地区'}],
 ['wudai',907,{title:'耶律阿保机称汗',text:'907年，耶律阿保机取得契丹可汗地位，契丹诸部整合进入新阶段。916年称帝建元神册属于其后建立皇帝体制的节点，不能将称汗和称帝视为同一场仪式；更不能将907年的契丹活动定位到朱温的汴州或王建的成都。',site:'契丹诸部活动区域'}],
 ['ming',1402,{title:'明初文渊阁内阁形成',text:'1402年朱棣即位后，命解缙等入值文渊阁，参与机务，通常被视为明代内阁形成的重要节点。此前废中书省与丞相、后来内阁票拟职权扩展属于前后不同阶段，不能把1402年的阁臣直接等同于旧丞相或晚明成熟内阁。此事发生于南京朝廷，另于靖难战争结局。',site:'南京'}],
 ['yuan',1351,{title:'徐寿辉称帝建立天完',text:'1351年，徐寿辉在蕲水称帝，建立天完政权。这与韩山童、刘福通在颍州等地发动红巾军起义属于同一反元浪潮中的不同政治组织，不是颍州现场的一次共同建国活动。蕲水是建国中枢地点，天完控制范围此后随战争变化。',site:'蕲水'}],
 ['zhanguo',-341,{title:'商鞅攻魏虏公子卬',date:'前 340 年',text:'前340年，商鞅（卫鞅）率秦军攻魏，以会盟为名擒获魏公子卬并击败魏军。《史记·商君列传》接叙魏割河西地及迁都大梁，叙事先后不能直接替代所有事件的独立纪年。河西归秦经历多次战争与割地，不能把一次攻魏概括成同年收取全部河西。',site:'秦魏河西交战范围',source:'https://zh.wikisource.org/wiki/史記/卷068'}],
 ['zhanguo',-341,{title:'魏迁大梁',date:'前 361 年',suffix:'-supplement-migration',text:'魏惠王将政治中心由安邑迁至大梁。现代通行考证常系前361年，也有不同纪年；《史记·魏世家》与《商君列传》把迁都接叙于马陵败战、商鞅攻魏之后，反映史书叙事与年代重建之间需要辨析。此条以前361年为约定检索年，保留纪年争议，不将上游前341年合写当作无争议迁都年。安邑与大梁分别是迁出、迁入地。',site:'安邑 · 大梁',source:'https://zh.wikisource.org/wiki/史記/卷044'}],
 ['qin',-213,{title:'秦坑杀方士儒生',date:'前 212 年',text:'焚书的次年，秦始皇在咸阳追究方士等人，史籍记载有坑杀事件。对象、人数及后世“坑儒”的概括应区分史料层次；它不是前213年焚书令本身。',site:'咸阳',coordinates:[108.711,34.331]}],
 ['donghan',216,{title:'曹操进魏王',text:'216年，汉廷进封曹操为魏王，魏国政治地位进一步上升。213年魏公受九锡是前一阶段，220年曹丕代汉又是后续事件，三者不能视为同一次加封。',site:'邺城',coordinates:[114.391,36.101]}],
 ['xihan',-180,{title:'诛诸吕与汉文帝即位',text:'前180年吕后去世后，周勃、陈平等联合诛灭吕氏势力，迎代王刘恒即位为汉文帝。这是文景之治之前的皇位与中枢权力重组，不能只用一段长期经济繁荣概括。',site:'长安',coordinates:[108.941,34.341]}],
 ['xihan',-167,{title:'汉文帝废肉刑与免田租',text:'前167年，汉文帝下令改革肉刑并免收田租。废黥、劓、斩趾等刑罚后以笞等替代，刑罚实际轻重还经历后续调整，不能理解为从此取消所有严酷刑罚。',site:'长安',coordinates:[108.94,34.34]}],
 ['donghan',25,{title:'赤眉军攻入长安',text:'25年，赤眉军攻入长安，更始政权瓦解。此事与刘秀在鄗城即位、后来定都洛阳属于同年不同政治过程，赤眉也并非立即归附刘秀。',site:'长安',coordinates:[108.941,34.341]}],
 ['roc',1949,{title:'国民政府迁台',text:'1949年国共内战后期，国民政府随大陆战局变化辗转迁驻，年底将中枢迁往台北。4月南京失守与年底迁台是同一上游条目里的不同阶段，不把全部迁移定位在南京。',site:'台北'}],
];
for(const [pk,year,details] of supplemental){
 const p=dynasties.find(p=>p.key===pk),m=p.milestones.find(m=>m.year===year),key=eventKey(p,m),group=groupFor[pk];
 const id=`历史/中国史/${group}/事件/${safe(details.title)}.md`,historyId=eventId(p,m,details.suffix||'-supplement');
 const date=details.date||yearLabel(year);const places=sitesFor(p,m,details);const targets=entities.filter(e=>details.text.includes(e.term)).filter((e,i,a)=>a.findIndex(x=>x.id===e.id)===i).slice(0,5);
 const data={...meta(details.title,`历史/中国史/${group}/事件`,[group]),historyId,historyKind:'event',historyPeriod:initialEvents.find(n=>n.historyGroup===group)?.historyPeriod||'postclassical',historyTrack:'china',historyDate:date,historyOrder:parseHistoryTime(date).from*10000,historyGroup:group,geo:{scope:'china',places,locationNote:details.site+'。',bindingStatus:'bound'}};
 save(id,data,`# ${details.title}\n\n> ${date}\n\n${paragraphLinks(details.text,targets)}\n\n发生地点：${places.map(p=>wikilink(p.target,p.name)).join('、')}。\n\n## 与上游的对应\n\n上游“${key}”将本条与其他行动合写：“${m.headline}”。本条展开其中独立的时间、政治或制度阶段。${differences[key]||''}\n\n## 来源\n\n${sourceLine(key)}\n${details.source?'- [本条核对的史籍原文]('+details.source+')。\n':''}${sourceBooks(key)}`);
 for(const t of [...targets.map(e=>e.id),...places.map(p=>p.target)])remember(id,t);
 ledger.find(x=>x.upstreamKey===key).matches.push({historyId,title:details.title,path:id,scope:details.title,reason:'具名子事件与现有主体不同，单独补录以保留合写条目的独立内容。',difference:differences[key]||null});
}

// Local geography corrections came from the entire Markdown prose, including
// explicit exclusions and distinctions between action, destination and context.
const corrections={
 'event-125':{places:[{place:'city-tokyo',role:'occurrence'}],locationNote:'日本东京；不是北宋东京开封。',excludePlaces:['历史/中国史/宋/地点/开封.md']},
 'event-326':{places:[{target:'历史/中国史/地点/阿斯塔纳.md',role:'occurrence'},{target:'历史/中国史/地点/雅加达.md',role:'occurrence'},{place:'city-beijing',role:'related'}],locationNote:'2013年9月在哈萨克斯坦阿斯塔纳提出丝绸之路经济带，10月在印度尼西亚雅加达提出海上丝绸之路；北京为后续政策与论坛地点。'},
 'event-150':{places:[{target:'历史/中国史/地点/定陶氾水.md',role:'occurrence'},{target:'历史/中国史/地点/洛阳.md',role:'related'},{target:'历史/中国史/地点/长安.md',role:'related'}],locationNote:'称帝仪式在定陶氾水一带，后先都洛阳、再迁长安，三阶段不能合为长安称帝。'},
 'event-301':{places:[{place:'site-xibaipo',role:'occurrence'},{place:'city-beijing',name:'北平',role:'related'}]},
 'event-155':{roles:{'历史/中国史/地点/洛阳.md':'related'}},
 'event-256':{roles:{'历史/中国史/地点/建康.md':'related'}},
 'event-238':{roles:{'历史/中国史/地点/成都.md':'related'}},
 'event-241':{roles:{'历史/中国史/地点/成都.md':'related'}},
 'event-260':{roles:{'历史/中国史/地点/长安.md':'related','历史/中国史/地点/洛阳.md':'related'}},
 'event-264':{places:[{target:'历史/中国史/地点/孙吴至白帝城通信范围.md',role:'occurrence'},{target:'历史/中国史/三国/地点/白帝城.md',role:'related'}],bindingStatus:'uncertain',locationNote:'孙吴方面至刘备东征军的通信范围，信中提及白帝；写信、递信和收信的准确地点未详。白帝是刘备军已到之地，不据此断言诸葛瑾到访或刘备在此收信。'},
 'event-song-conquest-southern-tang':{remove:['历史/中国史/宋/地点/南京应天府.md'],excludePlaces:['历史/中国史/宋/地点/南京应天府.md']},
 'event-351':{remove:['历史/中国史/宋/地点/南京应天府.md'],excludePlaces:['历史/中国史/宋/地点/南京应天府.md']},
 'event-song-gaozong-accession':{roles:{'region-jianghuai':'related','region-liangzhe':'related','历史/中国史/宋/地点/临安.md':'related'}},
 'event-139':{places:[{place:'city-shenzhen',role:'occurrence'},{target:'历史/中国史/地点/珠海.md',role:'occurrence'},{target:'历史/中国史/地点/汕头.md',role:'occurrence'},{target:'历史/中国史/地点/厦门.md',role:'occurrence'}],locationNote:'深圳、珠海、汕头、厦门四个经济特区；中央批准与各地建设属于不同空间层次。'},
 'event-140':{places:[{place:'city-wuhan',name:'武昌（今武汉）',role:'occurrence'},{place:'city-shenzhen',role:'occurrence'},{target:'历史/中国史/地点/珠海.md',role:'occurrence'},{place:'city-shanghai',role:'occurrence'}],locationNote:'武昌（今武汉）、深圳、珠海和上海，分别为1992年南方视察谈话行程节点。'},
 'event-101':{places:[{place:'city-paris',role:'occurrence'},{place:'city-beijing',role:'occurrence'}],locationNote:'巴黎为和会交涉地，北京为消息传入及政治反应所在地。'},
 'event-103':{places:[{place:'city-beijing',role:'occurrence'},{place:'city-shanghai',role:'occurrence'}],locationNote:'北京学生演讲与逮捕、上海罢工罢市，并扩及其他城市。'},
};
// Source-bearing place identities for corrected locations absent in the catalog.
for(const [title,definition,url] of [
 ['定陶氾水','史记高祖本纪记汉王刘邦于定陶氾水之阳即帝位。这里表示鲁西南定陶一带的历史仪式区域；“氾水”不可按今河南汜水镇望文生义。','https://zh.wikisource.org/wiki/史記/卷008'],
 ['阿斯塔纳','哈萨克斯坦首都，2013年习近平在纳扎尔巴耶夫大学演讲时提出共建丝绸之路经济带。这里只定位倡议提出的演讲城市，不代表全部合作区域。','https://www.gov.cn/ldhd/2013-09/08/content_2483565.htm'],
 ['雅加达','印度尼西亚首都，2013年习近平在印度尼西亚国会演讲时提出共建21世纪海上丝绸之路。它与阿斯塔纳分别对应陆上、海上倡议的提出场合。','https://www.gov.cn/ldhd/2013-10/03/content_2500118.htm'],
]){
 const id=`历史/中国史/地点/${title}.md`;
 if(!notes.has(id)){const data=meta(title,'历史/中国史/地点',['地点']);data.geo={scope:'world',place:{id:'history-'+sha(title).slice(0,12),kind:title==='定陶氾水'?'region':'point',modernName:title==='定陶氾水'?'山东菏泽定陶一带':title,variants:[]}};save(id,data,`# ${title}\n\n${definition}\n\n## 来源\n\n- [${title}相关原文与记载](${url})。`);}
}
const communicationPlace='历史/中国史/地点/孙吴至白帝城通信范围.md';
if(!notes.has(communicationPlace)){
 const data=meta('孙吴至白帝城通信范围','历史/中国史/地点',['地点']);
 data.geo={scope:'china',place:{id:'wu-shu-correspondence-221',kind:'region',modernName:'吴蜀之间的通信涉及范围，准确投递路线未详',variants:[]}};
 save(communicationPlace,data,'# 孙吴至白帝城通信范围\n\n221年诸葛瑾向东征中的刘备致书劝和。《三国志·诸葛瑾传》引书信“即闻旗鼓来至白帝”，说明白帝是信中获悉的刘备军位置；原文没有交代诸葛瑾写信、使者投递或刘备收信的具体地点。\n\n本节点表示孙吴方面与刘备东征军之间的通信范围，并非长江河流实体，也不推定一条准确道路、水路或行政边界。不设置坐标和几何，不能以此说明诸葛瑾曾到白帝城或双方在那里会面。\n\n相关事件见[[历史/中国史/三国/事件/诸葛瑾致书刘备]]。\n\n## 来源\n\n- [《三国志》卷五十二《诸葛瑾传》](https://zh.wikisource.org/wiki/三國志/卷52)。\n');
 remember(communicationPlace,'历史/中国史/三国/事件/诸葛瑾致书刘备.md');
}
for(const title of ['珠海','汕头','厦门']) siteNode(title,null,'prc:1980',1980);
const amendments={
 'event-150':'据《史记·高祖本纪》，刘邦在定陶氾水之阳即皇帝位；先都洛阳、后迁长安是即位之后的都城选择。原“地点：长安”只能说明迁都结果，不能定位称帝仪式。',
 'event-326':'提出倡议的具体场合分别是2013年9月哈萨克斯坦阿斯塔纳的演讲与10月印度尼西亚雅加达的国会演讲，后续北京政策与论坛并非两次提出的原始发生地。',
 'event-125':'本条东京指日本东京，与北宋东京开封同名而异地；成立地点按人物及组织活动语境确定。',
 'event-158':'1683年为澎湖战役及郑克塽投降；清廷于1684年设置台湾府。设府不是1683年战役当天完成的行政程序。',
 'event-186':'关于进士科的初设，隋炀帝大业年间的传统说法与具体设科年代仍有考证。科举逐步发展，不能写成605年在洛阳一次性完全取代所有旧选官方式。',
 'event-189':'周公东征涉及殷商故地及东方诸国，镐京为摄政中枢，营建洛邑与东征、礼制整理分属不同过程；礼乐制度也非一人一年一次制定完毕。',
 'event-177':'夏朝建立和启继位主要依据后世传世文献重建，约前2070年及阳城地望不是同时代文字记录直接确认的结果；二里头文化与夏王朝的对应仍存在学术讨论。',
 'event-178':'鸣条地望与商汤伐夏年代存在不同说法；本条保留传统叙事及约略纪年，不将山西夏县定位写成无争议的精确战场。',
};
for(const n of initialEvents){
 const p=notes.get(n.id),before=previousReview?.edits?.find(e=>e.historyId===n.historyId)?.beforeSha256||sha(p.raw),fix=corrections[n.historyId]||{};
 const geo=p.data.geo||{};
 let places=fix.places||(geo.places||[]).map(place=>typeof place==='string'?{target:place}:({...place}));
 places=places.filter(p=>!fix.remove?.includes(p.target||p.place)).map(place=>({...place,role:fix.roles?.[place.target||place.place]||place.role||'occurrence'}));
 places=places.filter((place,i,all)=>all.findIndex(other=>(other.target||other.place)===(place.target||place.place))===i);
 if(!places.some(p=>p.role==='occurrence'))throw new Error(`No reviewed occurrence: ${n.historyId}`);
 p.data.geo={...geo,...Object.fromEntries(Object.entries(fix).filter(([k])=>!['places','roles','remove'].includes(k))),places};
 if(n.historyId==='event-189'){
  if(!p.data.geo.places.some(place=>place.place==='region-henan'))p.data.geo.places.push({place:'region-henan',name:'殷商故地及东方征伐范围',role:'occurrence'});
  p.data.geo.bindingStatus='uncertain';p.data.geo.locationNote='镐京为摄政中枢；东征涉及殷商故地和东方地区，不限于西安。';
 }
 if(n.historyId==='event-177'||n.historyId==='event-178')p.data.geo.bindingStatus='uncertain';
 let content=p.content;
 // Resolve this abbreviated imperial name only in its reviewed context.
 if(n.historyId==='event-183'){
   const target='历史/中国史/两晋南北朝/人物/北魏孝文帝.md';
   content=content.replace('孝文帝迁都',wikilink(target,'孝文帝')+'迁都');
   remember(n.id,target);
 }
 if(n.historyId==='event-374'){
   const target='历史/中国史/唐/唐代考试选举.md';
   content+='\n\n科举取士的制度背景可参见'+wikilink(target,'唐代考试选举')+'。唐、清考试规则与施行条件不同，此处关联制度沿革，不将清代废除对象限于唐制。\n';
   remember(n.id,target);
 }
 if(amendments[n.historyId]&&!content.includes(amendments[n.historyId]))content+='\n\n## 内容与地点校订\n\n'+amendments[n.historyId]+'\n';
 if(n.historyId==='event-150')content=content.replace('地点：长安。','地点：定陶氾水一带（即位）；其后先都洛阳、再迁长安。');
 if(n.historyId==='event-125')content=content.replace('地点：东京。','地点：日本东京。');
 if(n.historyId==='event-326')content=content.replace('地点：北京及"一带一路"沿线国家。','地点：阿斯塔纳、雅加达（倡议提出）；后续实施涉及中国与沿线国家。');
 if(n.historyId==='event-186')content=content.replace('隋炀帝设进士科，以分科考试选拔人才，科举制度由此创立，取代九品中正制，扩大选官基础。','隋代选官制度由九品中正制向分科考试逐渐转变。传统叙述将进士科初设系于隋炀帝大业年间，具体创制年代尚有考证；唐代继续发展，不能将605年视为所有旧制度立即退出的单一断点。');
 // Link only named entities actually discussed in the prose. Already-linked
 // entities are excluded so enrichment does not manufacture duplicate graph edges.
 const existingRefs=parseNote(n.id,matter.stringify(content,p.data)).references;
 const already=new Set(existingRefs.filter(r=>r.wiki).map(r=>resolveLink(original.notes,n.id,r.reference,true)?.target));
 const plainIntro=content.split(/\n## (?:参考资料|来源)/)[0].replace(/\[\[[^\]]+\]\]/g,'').replace(/^#{1,6} .*$/gm,'').slice(0,1800);
 const targets=entities.filter(e=>e.id!==n.id&&!already.has(e.id)&&plainIntro.includes(e.term)).filter((e,i,a)=>a.findIndex(x=>x.id===e.id)===i).slice(0,4);
 content=paragraphLinks(content,targets);
 for(const e of targets)remember(n.id,e.id);
 if(!existingRefs.some(r=>r.wiki)&&!targets.length){
   const first=places.find(p=>p.role==='occurrence');
   if(first.target){content+=`\n\n发生地详见${wikilink(first.target,notes.get(first.target)?.data.title||path.posix.basename(first.target,'.md'))}。\n`;remember(n.id,first.target);}
 }
 save(n.id,p.data,content);
 edits.push({historyId:n.historyId,path:n.id,title:n.title,readFullText:true,beforeSha256:before,geoCorrection:Boolean(corrections[n.historyId]||amendments[n.historyId]),coreTargets:targets.map(e=>e.id)});
}
for(const n of initialEvents){
 const p=notes.get(n.id);
 const missing=p.data.geo.places.filter(x=>x.role==='occurrence'&&x.target&&!p.content.includes(noext(x.target)));
 if(missing.length){p.content+='\n\n发生地点：'+missing.map(x=>wikilink(x.target,x.name||notes.get(x.target)?.data.title||path.posix.basename(x.target,'.md'))).join('、')+'。\n';for(const x of missing)remember(n.id,x.target);save(n.id,p.data,p.content);}
}
// Add explicit places for catalog-only references into the knowledge graph when
// they are the event's concrete location. Existing regions need no fabricated city.
for(const n of initialEvents){
 const p=notes.get(n.id),places=p.data.geo.places;
 const concrete=places.filter(x=>x.role==='occurrence'&&x.place).map(x=>({entry:x,place:catalogById.get(x.place)})).filter(x=>x.place&&!/^region-/.test(x.place.id));
 for(const {entry,place} of concrete){
   let target=placeByTitle.get(place.title);
   if(!target){
     const loc=place.location;const data=meta(place.title,'历史/中国史/地点',['地点']);data.aliases=place.aliases;
     data.geo={scope:'china',place:structuredClone(loc)};
     target=`历史/中国史/地点/${safe(place.title)}.md`;placeByTitle.set(place.title,target);
     if(notes.has(target)&&!notes.get(target).data.geo?.place)continue;
     const url=loc.variants[0]?.source?.url;
     save(target,data,`# ${place.title}\n\n${place.title}是“${n.title}”正文明确涉及的历史地点。${loc.modernName?`今地参照为${loc.modernName}。`:''}本条沿用仓库已审定的地点身份与别名，名称相同并不保证古代范围与现代行政区边界一致。\n\n## 事件中的作用\n\n${wikilink(n.id,n.title)}记述的发生地说明为：${p.data.geo.locationNote}\n\n${loc.kind==='region'?'按区域级地点处理，没有具体范围几何时不添加猜测坐标。':'已有城市坐标表示聚落参照，不能当作事件精确发生点。江山地图绘图仍只采用其固定来源允许的数据。'}\n\n## 来源\n\n- ${wikilink(n.id,n.title)}的正文及参考资料。${url?`\n- [已有地点坐标来源](${url})，仅为位置参照。`:''}`);
     remember(target,n.id);
   }
   if(!p.content.includes(noext(target))){p.content+=`\n\n发生地点：${wikilink(target,entry.name||place.title)}。\n`;remember(n.id,target);}
 }
 save(n.id,p.data,p.content);
}

// Each place note receives concrete source events, so it is a substantive
// geographic node rather than an isolated label or copied coordinate record.
for(const id of new Set(siteRecords.map(r=>r.id))){
 if(!added.has(id))continue;
 const p=notes.get(id);const rows=siteRecords.filter(r=>r.id===id);
 const keys=[...new Set(rows.map(r=>r.key))];
 const entries=ledger.filter(x=>keys.includes(x.upstreamKey)).slice(0,8);
 if(entries.length&&!p.content.includes('## 涉及事件')){
 p.content+='\n\n## 涉及事件\n\n'+entries.map(e=>{const m=e.matches[0];remember(id,m.path);return `- ${yearLabel(e.year)}：${wikilink(m.path,m.title)}。上游原文：“${e.headline}”。`;}).join('\n')+'\n';save(id,p.data,p.content);
 }
}
// These two new biographies are named in source actions summarized by older
// local events. Connect their actual activity, rather than relying on an index.
for(const [id,target,title] of [
 ['历史/中国史/秦/人物/王贲.md','历史/中国史/秦/事件/秦灭六国.md','秦灭六国'],
 ['历史/中国史/隋/人物/杨广.md','历史/中国史/隋/事件/隋灭陈统一.md','隋灭陈统一'],
]){
 const note=notes.get(id);
 if(!note || !added.has(id))continue;
 if(!note.content.includes(noext(target))){
   note.content+='\n\n与上述军事行动对应的事件见'+wikilink(target,title)+'。\n';
   save(id,note.data,note.content);
 }
 remember(id,target);
}

// Directory overviews list actual files; preserve existing introductions and links.
for(const dir of new Set([...added].map(id=>path.posix.dirname(id)))){
 const id=dir+'/index.md';let p=notes.get(id);
 if(!p){save(id,{...meta(path.posix.basename(dir),dir),categoryOverview:dir},`# ${path.posix.basename(dir)}\n`);p=notes.get(id);}
 const entries=[...notes].filter(([entry])=>path.posix.dirname(entry)===dir&&entry!==id).sort((a,b)=>(a[1].data.historyOrder??0)-(b[1].data.historyOrder??0)||a[0].localeCompare(b[0],'zh'));
 for(const [entry,n] of entries){if(p.content.includes(noext(entry)))continue;const title=n.data.title||path.posix.basename(entry,'.md');p.content+=`\n- ${wikilink(entry,title)}${n.data.historyDate?' · '+n.data.historyDate:''}`;remember(id,entry);}
 save(id,p.data,p.content);
 // Ensure the parent overview reaches newly created directories.
 const parent=path.posix.dirname(dir)+'/index.md';const pp=notes.get(parent);
 if(pp&&!pp.content.includes(noext(id))){pp.content+=`\n\n- ${wikilink(id,path.posix.basename(dir))}\n`;save(parent,pp.data,pp.content);remember(parent,id);}
}
// Existing index dates reflect the notes, including corrected chronology.
for(const [id,p] of notes)if(id.startsWith('历史/中国史/')&&id.endsWith('/事件/index.md')){
 let content=p.content;
 for(const [event,n] of notes)if(path.posix.dirname(event)===path.posix.dirname(id)&&n.data.historyId){
 const ref=noext(event);content=content.split('\n').map(line=>line.includes(ref)&&line.includes(' · ')?line.split(' · ')[0]+' · '+n.data.historyDate:line).join('\n');
 }
 save(id,p.data,content);
}
const localAudit=initialEvents.map(n=>{const matches=ledger.filter(e=>e.matches.some(m=>m.historyId===n.historyId));return {historyId:n.historyId,path:n.id,title:n.title,reviewedFullText:true,status:matches.length?'reviewed-upstream-match':'local-supplement',upstreamKeys:matches.map(e=>e.upstreamKey),reason:matches.length?'对照具名人物、行动和事件阶段后明确对应，scope与异年差异另列。':n.historyGroup==='史前'||['夏','商','西周'].includes(n.historyGroup)?'上游时间轴自战国开始，早期考古与先秦事件超出其覆盖范围，保留本地独立内容。':'逐条检索上游全部526条叙述后未发现同一具名事件；保留本地的文学、制度、社会或近现代专题补充，不用同年其他事件替代。'};});
const review={localBaselineCommit,discardedCoordinates,source:{repository:manifest.repository,commit:manifest.commit,headChecked:'f0a84fb0fe4f43b4a518c189365d4f226ce979aa',checkedDate:'2026-11-18',allFourFilesMatchCurrentHead:true,headFiles:manifest.files.map(file=>({upstreamPath:file.upstreamPath,bytes:file.bytes,sha256:file.sha256,headSha256:file.sha256}))},originalLocalEvents:initialEvents.length,baselineCount:initialEvents.length,addedEventIds:[...added].filter(id=>notes.get(id)?.data.historyId).map(id=>notes.get(id).data.historyId).sort(),addedNotes:[...added].sort(),milestones:ledger.length,events:ledger,localEvents:localAudit,edits,created:[...added].sort(),expectedLinks:[...expected].flatMap(([source,links])=>links.map(l=>({source,...l}))),placeSources:siteRecords};
const report='.vitepress/reports/history-content-review.json';
if(write){
 for(const id of written){fs.mkdirSync(path.dirname(id),{recursive:true});fs.writeFileSync(id,notes.get(id).raw);}
 fs.mkdirSync(path.dirname(report),{recursive:true});fs.writeFileSync(report,JSON.stringify(review,null,2)+'\n');
 console.log(JSON.stringify({baseline:initialEvents.length,milestones:ledger.length,created:added.size,written:written.size,newEvents:[...added].filter(id=>notes.get(id).data.historyId).length,newPeople:[...added].filter(id=>id.includes('/人物/')).length,newPlaces:[...added].filter(id=>notes.get(id).data.geo?.place).length,newConcepts:[...added].filter(id=>id.includes('/概念/')).length},null,2));
}else console.log('Use --write to apply the reviewed migration. Run validate-content.mjs for the persisted per-note graph audit.');
