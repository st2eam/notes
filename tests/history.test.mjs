import test from 'node:test';
import assert from 'node:assert/strict';
import {historyDateOrder,sortHistory} from '../.vitepress/vault/history.mjs';
test('history ordering handles BCE, month, day, centuries and date ranges',()=>{
 assert.ok(historyDateOrder('约前 5000 年')<historyDateOrder('前 221 年'));
 assert.ok(historyDateOrder('前 221 年')<historyDateOrder('公元 25 年'));
 assert.ok(historyDateOrder('1919 年 4 月')<historyDateOrder('1919 年 5 月 4 日'));
 assert.ok(historyDateOrder('14 世纪')<historyDateOrder('约 15 世纪末'));
 assert.equal(historyDateOrder('16 世纪末—17 世纪初'),15900000);
 assert.equal(historyDateOrder('755 年—763 年'),7550000);
 assert.equal(historyDateOrder('日期未知'),null);
 const notes=[{title:'甲',historyDate:'2001 年'},{title:'乙',historyDate:'前 221 年'},{title:'丙',historyDate:'未知'}];
 assert.deepEqual(sortHistory(notes).map(n=>n.title),['乙','甲','丙']);
 assert.deepEqual(sortHistory(notes,true).map(n=>n.title),['甲','乙','丙']);
});
