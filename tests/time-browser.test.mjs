import test from "node:test";
import assert from "node:assert/strict";
import { sortTimeNotes, formatNoteTime, noteTimeISO } from "../.vitepress/vault/time-browser.mjs";

const notes = [
  { id: "乙.md", title: "乙", createdAt: 1000, updatedAt: 3000 },
  { id: "甲.md", title: "甲", createdAt: 2000, updatedAt: 1000 },
  { id: "丙.md", title: "丙", createdAt: 3000, updatedAt: 2000 },
  { id: "未知.md", title: "未知", createdAt: null, updatedAt: NaN },
];

test("creation and modification sorting each support both directions, with unknown dates always last", () => {
  const ids = (key, direction) => sortTimeNotes(notes, key, direction).map((note) => note.id);
  assert.deepEqual(ids("createdAt", "asc"), ["乙.md", "甲.md", "丙.md", "未知.md"]);
  assert.deepEqual(ids("createdAt", "desc"), ["丙.md", "甲.md", "乙.md", "未知.md"]);
  assert.deepEqual(ids("updatedAt", "asc"), ["甲.md", "丙.md", "乙.md", "未知.md"]);
  assert.deepEqual(ids("updatedAt", "desc"), ["乙.md", "丙.md", "甲.md", "未知.md"]);
  assert.deepEqual(notes.map((note) => note.id), ["乙.md", "甲.md", "丙.md", "未知.md"]);
});

test("equal dates and duplicate titles have deterministic order independent of sort direction", () => {
  const ties = [
    { id: "b.md", title: "A", updatedAt: 100 },
    { id: "c.md", title: "B", updatedAt: 100 },
    { id: "a.md", title: "A", updatedAt: 100 },
  ];
  for (const direction of ["asc", "desc"]) {
    assert.deepEqual(sortTimeNotes(ties, "updatedAt", direction).map((note) => note.id), ["a.md", "b.md", "c.md"]);
  }
});

test("full lists exceed the search limit and hide navigation indexes while retaining history overviews", () => {
  const full = Array.from({ length: 120 }, (_, i) => ({ id: `${i}.md`, title: String(i), updatedAt: i }));
  const indexes = ["index.md", "主题/index.md", "历史/中国史/index.md", "历史/世界史/index.md"]
    .map((id) => ({ id, title: id, updatedAt: 500 }));
  const sorted = sortTimeNotes([...full, ...indexes]);
  assert.equal(sorted.length, 122);
  assert.ok(sorted.some((note) => note.id === "119.md"));
  assert.ok(sorted.some((note) => note.id === "0.md"));
  assert.ok(sorted.some((note) => note.id === "历史/中国史/index.md"));
  assert.ok(!sorted.some((note) => note.id === "主题/index.md"));
});

test("dates use Shanghai time, standard machine-readable instants and safe unknown values", () => {
  const instant = Date.parse("2025-12-31T16:05:00Z");
  assert.equal(formatNoteTime(instant), "2026/01/01 00:05");
  assert.equal(noteTimeISO(instant), "2025-12-31T16:05:00.000Z");
  for (const value of [null, undefined, NaN, Infinity, "2026-01-01", 9e15]) {
    assert.equal(formatNoteTime(value), "时间未知");
    assert.equal(noteTimeISO(value), undefined);
  }
});
