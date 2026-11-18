// Exhaustive, per-note validation for the reviewed history content migration.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import { readVault, parseNote } from '../../.vitepress/vault/build.mjs';
import { resolveLink } from '../../.vitepress/vault/model.mjs';
import { geographicPlace, mapPlaces } from '../../.vitepress/vault/geo.mjs';
import { auditHistoryMetadata } from '../../.vitepress/vault/history.mjs';
import { parseUpstreamData } from './jiangshan.mjs';
import { sourceCoordinates } from './source-coordinates.mjs';
const root=process.cwd();
const review=JSON.parse(fs.readFileSync('.vitepress/reports/history-content-review.json','utf8'));
const vault=readVault(root);
const byId=new Map(vault.notes.map(n=>[n.id,n]));
const events=vault.notes.filter(n=>n.id.startsWith('历史/中国史/')&&n.historyId);
const failures=[];
const check=(condition,message)=>{if(!condition)failures.push(message);};
const checks=[];
const fixedCoordinates=sourceCoordinates(parseUpstreamData(fs.readFileSync('public/history/sources/jiangshan/map-data/source.js.txt','utf8'),'DYNASTY_DATA'));
const fixedSourceUrl=`https://github.com/DeanChensj/jiangshan-map/blob/${review.source.commit}/js/map_data.js`;
let checkedCoordinates=0;
for(const note of vault.notes)for(const variant of note.geo?.place?.variants||[]){
 if(!variant.coordinates || !(variant.source?.url===fixedSourceUrl || variant.source?.url?.startsWith(fixedSourceUrl+'#')))continue;
 checkedCoordinates++;
 check(fixedCoordinates.has(JSON.stringify(variant.coordinates)),`Unsubstantiated fixed-source coordinate: ${note.id} -> ${variant.id}`);
}
const allTouched=new Set([...review.created,...review.edits.map(e=>e.path)]);
for(const id of allTouched){
 const n=byId.get(id);
 check(Boolean(n),`Unindexed note: ${id}`);
 if(!n)continue;
 const raw=fs.readFileSync(id,'utf8'), parsed=parseNote(id,raw), p=matter(raw);
 let references=0;
 for(const r of parsed.references){
  if(r.image||/^(https?:|mailto:|\/\/)/.test(r.reference))continue;
  const resolved=resolveLink(vault.notes,id,r.reference,r.wiki);
  // Attachment links are handled by the vault's own attachment parser.
  if(/\.(png|jpe?g|gif|svg|pdf|webp)$/i.test(r.reference))continue;
  check(Boolean(resolved?.target)&&!resolved?.reason,`Unresolved reference: ${id} -> ${r.reference}`);
  check(resolved?.target!==id,`Self reference: ${id} -> ${r.reference}`);
  references++;
 }
 const seen=new Set();
 for(const r of p.data.relations||[]){
  const resolved=resolveLink(vault.notes,id,r.target,true);
  check(Boolean(resolved?.target),`Unresolved semantic relation: ${id} -> ${r.target}`);
  check(resolved?.target!==id,`Self semantic relation: ${id}`);
  const key=r.target+'|'+r.type;
  check(!seen.has(key),`Duplicate semantic relation: ${id} -> ${key}`);seen.add(key);
  check(['target','type','status','reason','evidence'].every(k=>typeof r[k]==='string'&&r[k]),`Incomplete relation: ${id}`);
 }
 const headings=[...p.content.matchAll(/^# (.+)$/gm)].map(match=>match[1].trim());
 check(headings.length===1 && headings[0]===(p.data.title||n.title),`Heading differs from title: ${id}`);
 const expected=review.expectedLinks.filter(l=>l.source===id);
 for(const link of expected)check(vault.links.some(l=>l.source===id&&l.target===link.target&&l.relationType===link.type),`Missing expected graph edge: ${id} -> ${link.target} (${link.type})`);
 if(review.created.includes(id)&&!id.endsWith('/index.md')){
  check(p.content.replace(/\s/g,'').length>=90,`Insufficient new note content: ${id}`);
  check(/https:\/\/|## 来源|## 参考资料/.test(p.content),`Missing sources: ${id}`);
  check(vault.links.some(l=>(l.source===id||l.target===id)&&l.label!=='分类归属'&&!l.source.endsWith('/index.md')&&!l.target?.endsWith('/index.md')),`New note lacks a substantive content link: ${id}`);
 }
 checks.push({path:id,historyId:n.historyId||null,indexed:true,references,expectedRelations:expected.length,occurrencePlaces:n.geo?.places?.filter(p=>p.role==='occurrence').length||0});
}
for(const n of events){
 const occurrences=(n.geo?.places||[]).filter(p=>p.role==='occurrence');
 check(occurrences.length>0,`Missing occurrence place: ${n.id}`);
 for(const p of occurrences){
   const target=p.target?resolveLink(vault.notes,n.id,p.target,true)?.target:null;
   check(p.place?Boolean(geographicPlace(p.place)):Boolean(target&&byId.get(target)?.geo?.place),`Invalid occurrence identity: ${n.id} -> ${p.target||p.place}`);
   const identity=p.place?geographicPlace(p.place)?.location?.id:byId.get(target)?.geo?.place?.id;
   check(mapPlaces(n,vault.notes).some(item=>item.role==='occurrence'&&(p.place?item.place===p.place:item.target===target)||identity&&item.role==='occurrence'&&item.location?.id===identity),`Occurrence role lost in model: ${n.id}`);
 }
}
for(const row of review.events){
 check(row.matches.length>0,`Unreviewed milestone: ${row.upstreamKey}`);
 for(const match of row.matches){const n=events.find(n=>n.historyId===match.historyId);check(n?.id===match.path&&n?.title===match.title,`Invalid explicit match: ${row.upstreamKey} -> ${match.historyId}`);check(Boolean(match.scope&&match.reason),`No semantic scope: ${row.upstreamKey}`);}
}
const issues=auditHistoryMetadata(vault.notes);
check(issues.length===0,`History metadata issues: ${JSON.stringify(issues)}`);
const expectedDuplicate=new Set();
for(const row of review.expectedLinks){const key=row.source+'|'+row.target+'|'+row.type;check(!expectedDuplicate.has(key),`Duplicate expected relationship: ${key}`);expectedDuplicate.add(key);}
const final={source:review.source,localBaselineCommit:review.localBaselineCommit,checkedCoordinates,discardedCoordinates:review.discardedCoordinates?.length||0,baselineEvents:review.baselineCount,chineseEvents:events.length,newEvents:events.length-review.baselineCount,upstreamMilestones:review.events.length,coveredMilestones:review.events.filter(e=>e.matches.length).length,explicitMatches:review.events.reduce((n,e)=>n+e.matches.length,0),localSupplements:review.localEvents.filter(e=>e.status==='local-supplement').length,createdNotes:review.created.length,newPeople:review.created.filter(id=>id.includes('/人物/')&&!id.endsWith('/index.md')).length,newPlaceNodes:review.created.filter(id=>byId.get(id)?.geo?.place).length,newConceptNodes:review.created.filter(id=>id.includes('/概念/')&&!id.endsWith('/index.md')).length,newDirectoryIndexes:review.created.filter(id=>id.endsWith('/index.md')).length,withOccurrence:events.filter(n=>n.geo?.places?.some(p=>p.role==='occurrence')).length,reviewedDifferences:review.events.filter(e=>e.difference).length,expectedRelations:review.expectedLinks.length,checkedNotes:checks.length,graph:{notes:vault.notes.length,links:vault.links.length},failures,notes:checks};
fs.writeFileSync('.vitepress/reports/history-content-validation.json',JSON.stringify(final,null,2)+'\n');
console.log(JSON.stringify({...final,notes:undefined},null,2));
assert.equal(failures.length,0,`Content validation failed (${failures.length}); see .vitepress/reports/history-content-validation.json`);
