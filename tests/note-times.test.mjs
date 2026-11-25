import test from "node:test";
import assert from "node:assert/strict";
import { createNoteTimeReader, parseGitHistory, parseGitStatus } from "../.vitepress/vault/note-times.mjs";

const log = (...commits) => commits.map(([time, ...changes]) =>
  `\x1e${time}\0\n${changes.map((change) => change.join("\0") + "\0").join("")}`).join("");

const original = "主题/旧 笔记.md", renamed = "主题/新\t笔记\n.md";
const history = log(
  [100, ["A", original], ["A", "重加.md"]],
  [200, ["M", original], ["D", "重加.md"]],
  [300, ["R100", original, renamed], ["A", "重加.md"]],
  [250, ["M", renamed]],
);

test("batch history preserves creation through renames, resets re-added paths and uses commit order", () => {
  const times = parseGitHistory(history);
  assert.equal(times.has(original), false);
  assert.deepEqual(times.get(renamed), { createdAt: 100000, updatedAt: 250000 });
  assert.deepEqual(times.get("重加.md"), { createdAt: 300000, updatedAt: 300000 });
});

test("a merge addition retains creation already recorded in reachable branch history", () => {
  const times = parseGitHistory(log([100, ["A", "分支笔记.md"]], [300, ["A", "分支笔记.md"]]));
  assert.deepEqual(times.get("分支笔记.md"), { createdAt: 100000, updatedAt: 300000 });
});

test("merge diffs repeating a branch rename do not erase the original creation time", () => {
  const times = parseGitHistory(log(
    [100, ["A", original]],
    [200, ["R091", original, renamed]],
    [300, ["R091", original, renamed]],
  ));
  assert.deepEqual(times.get(renamed), { createdAt: 100000, updatedAt: 300000 });
});

test("incomplete history and invalid dates remain unknown rather than inventing creation dates", () => {
  assert.deepEqual(parseGitHistory(log([200, ["M", "浅克隆.md"]])).get("浅克隆.md"), {
    createdAt: null, updatedAt: 200000,
  });
  assert.deepEqual(parseGitHistory(log(["invalid", ["A", "坏时间.md"]])).get("坏时间.md"), {
    createdAt: null, updatedAt: null,
  });
});

test("porcelain status handles staged renames and whitespace paths without trimming filenames", () => {
  const changes = parseGitStatus(`R  ${renamed}\0${original}\0 M 已修改.md\0?? 新笔记.md\0`);
  assert.deepEqual(changes.get(renamed), { status: "R ", original });
  assert.equal(changes.get("已修改.md").status, " M");
  assert.equal(changes.get("新笔记.md").status, "??");
});

function fixture() {
  const state = { head: "first", status: "", history, logCalls: 0, mtimeMs: 900000, birthtimeMs: 800000 };
  const read = createNoteTimeReader({
    runGit(root, args) {
      if (args[0] === "ls-files") return `${renamed}\0重加.md\0历史缺失.md\0`;
      if (args[0] === "status") return state.status;
      if (args[0] === "log") { state.logCalls++; return state.history; }
      if (args.includes("--show-toplevel")) return "/vault\n";
      if (args.includes("--verify")) return state.head;
      throw new Error("Unexpected command");
    },
    stat: () => ({ mtimeMs: state.mtimeMs, birthtimeMs: state.birthtimeMs }),
  });
  return { state, read: (...ids) => read("/vault", ids.map((id) => "/vault/" + id)) };
}

test("checkout mtime cannot replace committed dates; only dirty notes use local modification time", () => {
  const { state, read } = fixture();
  assert.deepEqual(read(renamed).get(renamed), { createdAt: 100000, updatedAt: 250000 });
  state.status = ` M ${renamed}\0`;
  assert.deepEqual(read(renamed).get(renamed), { createdAt: 100000, updatedAt: 900000 });
  state.status = `M  ${renamed}\0`;
  state.mtimeMs = 950000;
  assert.equal(read(renamed).get(renamed).updatedAt, 950000);
  assert.equal(state.logCalls, 1);
});

test("HEAD changes refresh history, while cached history never freezes workspace status", () => {
  const { state, read } = fixture();
  read(renamed);
  state.head = "second";
  state.history += log([1000, ["M", renamed]]);
  assert.equal(read(renamed).get(renamed).updatedAt, 1000000);
  assert.equal(state.logCalls, 2);
});

test("uncommitted rename keeps source creation and new or staged additions use local dates", () => {
  const { state, read } = fixture();
  state.status = `R  再次改名.md\0${renamed}\0?? 新建.md\0A  已暂存.md\0`;
  const times = read("再次改名.md", "新建.md", "已暂存.md", "历史缺失.md");
  assert.deepEqual(times.get("再次改名.md"), { createdAt: 100000, updatedAt: 900000 });
  assert.deepEqual(times.get("新建.md"), { createdAt: 800000, updatedAt: 900000 });
  assert.deepEqual(times.get("已暂存.md"), { createdAt: 800000, updatedAt: 900000 });
  assert.deepEqual(times.get("历史缺失.md"), { createdAt: null, updatedAt: null });
});

test("plain directories fall back to valid file times, including platforms without birthtime", () => {
  let info = { mtimeMs: 1000, birthtimeMs: 0 };
  const read = createNoteTimeReader({
    runGit() { throw new Error("Not a repository"); },
    stat: () => info,
  });
  assert.deepEqual(read("/plain", ["/plain/笔记.md"]).get("笔记.md"), { createdAt: 1000, updatedAt: 1000 });
  info = { mtimeMs: NaN, birthtimeMs: 0 };
  assert.deepEqual(read("/plain", ["/plain/笔记.md"]).get("笔记.md"), { createdAt: null, updatedAt: null });
});

test("a failed history query cannot turn tracked checkout times into writing times", () => {
  const read = createNoteTimeReader({
    runGit(root, args) {
      if (args[0] === "log") throw new Error("Unavailable history");
      if (args[0] === "ls-files") return "已跟踪.md\0";
      if (args[0] === "status") return "";
      return args.includes("--show-toplevel") ? "/vault" : "head";
    },
    stat: () => ({ mtimeMs: 9000, birthtimeMs: 8000 }),
  });
  assert.deepEqual(read("/vault", ["/vault/已跟踪.md"]).get("已跟踪.md"), { createdAt: null, updatedAt: null });
});
