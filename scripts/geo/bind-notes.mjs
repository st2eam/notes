import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { scanFiles, parseNote, wikiPlugin } from "../../.vitepress/vault/build.mjs";
import { geographicPlaces } from "../../.vitepress/vault/geo-places.mjs";
import { existingPlaceSources, siteDefinitions } from "./place-definitions.mjs";

const md = new MarkdownIt({ html: true }).use(wikiPlugin);
const root = fileURLToPath(new URL("../../", import.meta.url));
export function locationFields(content) {
  // Only Markdown prose tokens: fenced code, HTML attributes and link URLs are
  // never geographic evidence. Preserve wiki labels for the readable audit trail.
  return md.parse(content, {}).filter((t) => t.type === "inline")
    .flatMap((t) => t.content.split("\n"))
    .map((line) => line.match(/^\s*(?:\*\*)?地点(?:\*\*)?\s*[：:]\s*(.+)$/)?.[1])
    .filter(Boolean);
}
export const readableLocation = (text) => text
  .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => label || target.split("/").pop())
  .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*/g, "");

export function replaceGeo(raw, geo) {
  const newline = raw.includes("\r\n") ? "\r\n" : "\n";
  const block = matter.stringify("", { geo }, { language: "yaml", lineWidth: -1, noRefs: true, quotingType: '"' })
    .replace(/^---\n/, "").replace(/\n---\s*$/, "").replace(/\n/g, newline);
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/);
  if (!match) return `---${newline}${block}${newline}---${newline}${raw}`;
  const lines = match[1].split(/\r?\n/);
  const start = lines.findIndex((line) => /^geo\s*:/.test(line));
  if (start < 0) lines.push(block);
  else {
    let end = start + 1;
    while (end < lines.length && (!lines[end].trim() || /^\s|^#/.test(lines[end]))) end++;
    lines.splice(start, end - start, block);
  }
  return `---${newline}${lines.join(newline)}${newline}---` + raw.slice(match[0].length);
}

export function createBinder(notes, catalog = geographicPlaces) {
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const placeNotes = notes.filter((n) => n.geo?.place || n.tags.includes("地点"));
  const noteByTitle = new Map(placeNotes.map((n) => [n.title, n]));
  const aliases = new Map();
  const put = (name, value) => {
    const candidates = aliases.get(name) || [];
    if (!candidates.some((c) => c.target === value.target && c.place === value.place)) candidates.push(value);
    aliases.set(name, candidates);
  };
  for (const place of catalog) for (const alias of [place.title, ...place.aliases]) {
    if (alias.length >= 2) put(alias, { place: place.id });
  }
  for (const note of placeNotes) for (const alias of [note.title, ...note.aliases]) {
    if (alias.length >= 2) aliases.set(alias, [{ target: note.id }]);
  }
  const names = [...aliases.keys()].sort((a, b) => b.length - a.length || a.localeCompare(b, "zh"));
  function reference(key) {
    if (key.endsWith(".md")) {
      if (!placeNotes.some((n) => n.id === key)) throw new Error("Unknown place note: " + key);
      return { target: key };
    }
    if (!byId.has(key)) throw new Error("Unknown geographic identity: " + key);
    const record = byId.get(key);
    return noteByTitle.has(record.title) ? { target: noteByTitle.get(record.title).id } : { place: key };
  }
  function match(text, note, { explicit = true } = {}) {
    const readable = readableLocation(text).replace(/《[^》]*》/g, "");
    const occupied = [];
    const matches = [];
    const found = [];
    if (explicit && note.id.startsWith("历史/中国史/") && /全国/.test(readable)) found.push({ place: "region-china" });
    if (explicit && /帝国全境/.test(readable)) {
      if (note.id.includes("/波斯/")) found.push({ place: "region-persia" });
      else if (note.id.includes("/罗马与地中海/")) found.push({ place: "region-roman-world" });
    }
    if (explicit && /印度北部、中部/.test(readable)) found.push({ place: "region-central-india" });
    if (explicit && /沿海沿江通商口岸与京师/.test(readable)) found.push({ place: "region-china-coast" }, { place: "region-yangtze" }, { place: "city-beijing" });
    for (const name of names) {
      let from = 0, at;
      while ((at = readable.indexOf(name, from)) >= 0) {
        from = at + name.length;
        if (occupied.some(([a, b]) => at < b && from > a)) continue;
        let candidates = aliases.get(name);
        // Geography is related-place evidence, never proof of an occurrence site.
        if (!explicit) {
          const before = readable.slice(0, at).split(/[。；\n]/).at(-1);
          if (/(?:不是|并非|不在|不能|不等同|不足以|没有(?:明确)?(?:记载|说明|证据)|未(?:明确)?(?:记载|说明))[^。；]*$/.test(before)) continue;
          if (name === "大都" && !note.id.includes("/元/")) continue;
          if (name === "武昌" && !/\/(?:三国|清|中华民国|中华人民共和国)\//.test(note.id)) continue;
          if (name === "江西" && /(?:溯|渡|沿|顺|长)$/.test(before) && /^[进行上下]/.test(readable.slice(from))) continue;
          if (name.length < 2 || ["罗马", "东京", "应天", "赤壁", "平原", "世界", "多国"].includes(name)) continue;
          if (name === "华盛顿" && !/(?:在|到|迁往|定都|首都|迁至)$/.test(before) && !/^市|^特区/.test(readable.slice(from))) continue;
        }
        const year = Number(String(note.historyDate || "").match(/\d{3,4}/)?.[0]);
        if (name === "武昌" && (year >= 1000 || /\/(?:清|晚清|中华民国|中华人民共和国)\//.test(note.id))) candidates = [{ place: "city-wuhan", name: "武昌" }];
        if (name === "南京" && year >= 960 && year <= 1127) candidates = [{ target: "历史/中国史/南京应天府.md" }];
        if (name === "东京" && note.id.startsWith("历史/中国史/")) candidates = [{ target: "历史/中国史/开封.md" }];
        if (candidates.length !== 1) continue;
        let ref = candidates[0];
        if (ref.place) {
          const record = byId.get(ref.place);
          // Canonicalize an alias to a dedicated note when the note describes
          // that entity (汴州 -> 开封), while preserving modern-city identities.
          const canonical = noteByTitle.get(record.title);
          if (canonical) ref = { target: canonical.id };
          else if (name !== record.title) ref = { ...ref, name };
        }
        found.push(ref); occupied.push([at, from]);
        matches.push({ ref, at, end: from });
      }
    }
    const kind = (ref) => ref.place ? byId.get(ref.place)?.location.kind
      : placeNotes.find((n) => n.id === ref.target)?.geo?.place?.kind;
    const key = (ref) => ref.target || ref.place;
    return dedupe(found).filter((ref) => {
      if (kind(ref) === "point") return true;
      const occurrences = matches.filter((m) => key(m.ref) === key(ref));
      // “法国巴黎” and “永州（今湖南永州）” use a country/province to qualify
      // a city, rather than independently associating its entire territory.
      return !occurrences.length || !occurrences.every((m) => matches.some((p) => p.at === m.end && kind(p.ref) === "point"));
    });
  }
  return { match, reference, byId, noteByTitle };
}
export function dedupe(refs) {
  return [...new Map(refs.map((r) => [r.target || r.place, r])).values()];
}

export async function bindNotes({ write = false, projectRoot = root } = {}) {
  const { locationOverrides } = await import("./location-overrides.mjs");
  const catalog = geographicPlaces;
  const files = scanFiles(projectRoot);
  const entries = files.map((file) => {
    const raw = fs.readFileSync(file, "utf8"), id = path.relative(projectRoot, file).split(path.sep).join("/");
    const parsed = matter(raw);
    return { file, raw, id, ...parsed, note: parseNote(id, raw).note };
  });
  // Prepare every entity first so an initial migration resolves the same canonical
  // targets as subsequent runs, including newly geographical overview notes.
  for (const entry of entries) {
    const { note, data } = entry;
    const geo = structuredClone(data.geo || {});
    if (note.tags.includes("地点") && !geo.place) {
      const [sourceId, kind] = existingPlaceSources[note.title] || ["site-" + siteDefinitions.find((s) => s[1] === note.title)?.[0], "region"];
      const record = catalog.find((p) => p.id === sourceId);
      if (!record) throw new Error("Place note requires a curated identity: " + note.id);
      geo.scope = "china";
      geo.place = { ...structuredClone(record.location), kind,
        variants: kind === "region" ? [] : record.location.variants.map((v) => ({ ...v, name: note.title })) };
    }
    if (note.id.startsWith("历史/世界史/") && note.id.endsWith("/index.md")) {
      const name = note.id.split("/").at(-2);
      const exact = catalog.find((p) => p.location.kind === "region" && [p.title, ...p.aliases].includes(name));
      if (exact && !geo.place) geo.place = structuredClone(exact.location);
    }
    entry.preparedGeo = geo;
    entry.note = { ...note, geo };
  }
  const binder = createBinder(entries.map((e) => e.note), catalog);
  const exclusions = {
    "九品中正制确立": ["邺城", "洛阳"], "诸葛瑾致书刘备": ["成都"],
    "吕布殒命白门楼": ["许昌", "建康"], "东兴之战": ["合肥"],
    "石亭之战": ["合肥"], "孙策平定江东": ["建康"],
    "曹魏灭燕": ["襄阳"], "汉献帝禅让": ["许昌"],
  };
  const report = { notes: entries.length, changed: 0, explicitFields: 0, explicitBound: 0, uncertain: [], placeNotes: 0, otherBound: 0, changes: [] };
  for (const entry of entries) {
    const { note, content, data, raw } = entry;
    const geo = entry.preparedGeo;
    const fields = locationFields(content);
    const refs = [];
    if (note.tags.includes("地点")) report.placeNotes++;
    if (fields.length) {
      report.explicitFields++;
      const override = locationOverrides[note.id];
      refs.push(...(override ? override.places.map(binder.reference) : fields.flatMap((f) => binder.match(f, note))));
      geo.locationNote = fields.map(readableLocation).join("；");
      geo.bindingStatus = override?.uncertain || !refs.length ? "uncertain" : "bound";
      if (override?.reason) geo.locationNote += " 关联说明：" + override.reason;
      if (exclusions[note.title]) geo.excludePlaces = exclusions[note.title].map((title) => binder.noteByTitle.get(title).id);
      if (refs.length) report.explicitBound++;
      if (geo.bindingStatus === "uncertain") report.uncertain.push({ id: note.id, location: geo.locationNote });
    } else if (note.tags.includes("人物") || note.id.startsWith("读书笔记/人类简史/")) {
      // Deliberately scoped prose matching. Code examples and general technical
      // definitions are not occurrence/location evidence.
      const tokens = md.parse(content, {});
      let inHeading = false, inSources = false;
      const paragraphs = [];
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === "heading_open") {
          inHeading = true;
          inSources = /^(?:参考|资料来源|引用来源)/.test(tokens[i + 1]?.content || "");
        }
        if (token.type === "heading_close") inHeading = false;
        if (token.type === "inline" && !inHeading && !inSources) paragraphs.push(token.content
          .replace(/\[\[[^\]]+\]\]/g, "").replace(/!?\[[^\]]*\]\([^)]*\)/g, "").replace(/`[^`]*`/g, ""));
      }
      const prose = paragraphs.join("\n");
      refs.push(...binder.match(prose, note, { explicit: false }));
      if (refs.length) report.otherBound++;
    }
    if (refs.length || geo.places) {
      const canonical = (geo.places || []).map((r) => r.place ? {
        ...binder.reference(r.place), ...(r.variant ? { variant: r.variant } : {}), ...(r.name ? { name: r.name } : {}),
      } : r);
      const reconciled = fields.length || note.tags.includes("人物") || note.id.startsWith("读书笔记/人类简史/")
        ? canonical.filter((r) => refs.some((next) => (next.target || next.place) === (r.target || r.place)))
        : canonical;
      // Keep deliberate historical-variant choices on surviving identities.
      const previous = new Map(reconciled.map((r) => [r.target || r.place, r]));
      geo.places = dedupe([...reconciled, ...refs.map((r) => ({ ...previous.get(r.target || r.place), ...r }))])
        .filter((r) => r.target !== note.id);
    }
    if (Object.keys(geo).length && JSON.stringify(data.geo) !== JSON.stringify(geo)) {
      report.changed++;
      const updated = replaceGeo(raw, geo);
      // The migration may only change geography, not prose or other frontmatter.
      const checked = matter(updated);
      const { geo: beforeGeo, ...before } = data;
      const { geo: afterGeo, ...after } = checked.data;
      if (checked.content !== content || JSON.stringify(before) !== JSON.stringify(after)) throw new Error("Non-geographic content changed: " + note.id);
      if (write) fs.writeFileSync(entry.file, updated);
      report.changes.push(note.id);
    }
  }
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await bindNotes({ write: process.argv.includes("--write") });
  const reportPath = process.argv.indexOf("--report");
  if (reportPath >= 0) fs.writeFileSync(process.argv[reportPath + 1], JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ ...report, changes: undefined }, null, 2));
}
