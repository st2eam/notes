import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const git = (root, args) => execFileSync("git", ["-C", root, ...args], {
  encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"],
});
const relative = (root, file) => path.relative(root, file).replaceAll("\\", "/");
const timestamp = (value) => typeof value === "number" && Number.isFinite(value) &&
  Math.abs(value) <= 8.64e15 ? value : null;
const unknown = () => ({ createdAt: null, updatedAt: null });

// NUL-delimited paths preserve Chinese, whitespace, tabs and newlines in filenames.
// Input is in reverse topological order, so additions and renames are applied forward.
export function parseGitHistory(output) {
  const times = new Map();
  const tokens = output.split("\0");
  let at = null;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].replace(/^\n/, "");
    if (token.startsWith("\x1e")) {
      at = timestamp(Number(token.slice(1)) * 1000);
      continue;
    }
    if (!/^[AMDTCR](?:\d+)?$/.test(token)) continue;
    const from = tokens[++i];
    const to = /^[RC]/.test(token) ? tokens[++i] : from;
    if (token === "D") times.delete(from);
    else if (token.startsWith("R")) {
      // A merge diff can repeat a rename already seen on its branch.
      const previous = times.get(from) || times.get(to);
      times.delete(from);
      times.set(to, { createdAt: previous?.createdAt ?? null, updatedAt: at });
    } else if (token === "A" || token.startsWith("C")) {
      times.set(to, { createdAt: times.get(to)?.createdAt ?? at, updatedAt: at });
    } else times.set(to, { createdAt: times.get(to)?.createdAt ?? null, updatedAt: at });
  }
  return times;
}

export function parseGitStatus(output) {
  const changes = new Map();
  const tokens = output.split("\0");
  for (let i = 0; i < tokens.length; i++) {
    if (!tokens[i]) continue;
    const status = tokens[i].slice(0, 2);
    const file = tokens[i].slice(3);
    const original = /[RC]/.test(status) ? tokens[++i] : null;
    changes.set(file, { status, original });
  }
  return changes;
}

// Only immutable committed history is cached. Status and file times are always fresh.
export function createNoteTimeReader({ runGit = git, stat = fs.statSync } = {}) {
  const cache = new Map();
  return (root, files) => {
    let repository;
    try { repository = runGit(root, ["rev-parse", "--show-toplevel"]).trim(); }
    catch { /* A plain directory can still be previewed without Git. */ }
    let history = new Map(), changes = new Map(), tracked = new Set();
    let stateAvailable = !repository;
    if (repository) {
      try {
        tracked = new Set(runGit(repository, ["ls-files", "-z", "--cached", "--", "*.md"]).split("\0"));
        changes = parseGitStatus(runGit(repository, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]));
        stateAvailable = true;
        let head;
        try { head = runGit(repository, ["rev-parse", "--verify", "HEAD"]).trim(); }
        catch { /* An unborn branch has no committed history yet. */ }
        if (head) {
          const cached = cache.get(repository);
          if (cached?.head === head) history = cached.history;
          else {
            history = parseGitHistory(runGit(repository, [
              "log", "--reverse", "--topo-order", "--format=%x1e%ct", "-z", "--name-status",
              "--find-renames", "--diff-merges=first-parent", head, "--", "*.md",
            ]));
            cache.set(repository, { head, history });
          }
        }
      } catch { /* Known tracked files with missing history retain unknown dates. */ }
    }
    return new Map(files.map((file) => {
      let info;
      try { info = stat(file); } catch { /* File may have been removed during a refresh. */ }
      const modified = timestamp(info?.mtimeMs);
      const born = info?.birthtimeMs > 0 ? timestamp(info.birthtimeMs) : null;
      const id = relative(root, file);
      if (!stateAvailable) return [id, unknown()];
      const gitPath = repository && relative(repository, file);
      const change = changes.get(gitPath);
      const committed = history.get(gitPath) || history.get(change?.original);
      if (committed) return [id, {
        createdAt: committed.createdAt,
        updatedAt: change ? modified ?? committed.updatedAt : committed.updatedAt,
      }];
      const localOnly = !repository || !tracked.has(gitPath) || change?.status.includes("A");
      return [id, localOnly ? { createdAt: born ?? modified, updatedAt: modified } : unknown()];
    }));
  };
}
export const readNoteTimes = createNoteTimeReader();

// Vite's normal watcher ignores .git. Watch the actual ref files, including worktrees.
export function watchGitTimes(root, changed) {
  let gitFile;
  try {
    gitFile = (name) => git(root, ["rev-parse", "--path-format=absolute", "--git-path", name]).trim();
    gitFile("HEAD");
  } catch { return () => {}; }
  const watched = new Map();
  function bind() {
    const head = gitFile("HEAD");
    let ref;
    try { ref = fs.readFileSync(head, "utf8").trim().match(/^ref: (.+)$/)?.[1]; } catch {}
    const files = new Set([head, gitFile("packed-refs"), ...(ref ? [gitFile(ref)] : [])]);
    for (const [file, listener] of watched) if (!files.has(file)) {
      fs.unwatchFile(file, listener);
      watched.delete(file);
    }
    for (const file of files) if (!watched.has(file)) {
      const listener = (current, previous) => {
        if (current.mtimeMs === previous.mtimeMs && current.ino === previous.ino) return;
        bind();
        changed();
      };
      watched.set(file, listener);
      fs.watchFile(file, { persistent: false, interval: 1000 }, listener);
    }
  }
  bind();
  return () => {
    for (const [file, listener] of watched) fs.unwatchFile(file, listener);
    watched.clear();
  };
}
