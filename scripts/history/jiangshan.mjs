// Project-owned adapter. Upstream JavaScript is parsed as data, never evaluated.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { babelParse } from "@vue/compiler-sfc";
import { readVault } from "../../.vitepress/vault/build.mjs";
import { eventTime, auditHistoryMetadata } from "../../.vitepress/vault/history.mjs";

export const sourceRoot = "public/history/sources/jiangshan";
const output = ".vitepress/vault/history-references.mjs";
const reportPath = ".vitepress/reports/jiangshan-audit.json";

function literal(node) {
  if (["StringLiteral", "NumericLiteral", "BooleanLiteral"].includes(node?.type)) return node.value;
  if (node?.type === "NullLiteral") return null;
  if (node?.type === "UnaryExpression" && node.operator === "-" && node.argument.type === "NumericLiteral") return -node.argument.value;
  if (node?.type === "ArrayExpression") return node.elements.map(literal);
  if (node?.type === "ObjectExpression") return Object.fromEntries(node.properties.map((property) => {
    if (property.type !== "ObjectProperty" || property.computed || property.method)
      throw new Error("Only static data properties are accepted");
    const key = property.key.type === "Identifier" ? property.key.name : literal(property.key);
    if (["__proto__", "constructor", "prototype"].includes(key)) throw new Error("Unsafe data key");
    return [key, literal(property.value)];
  }));
  throw new Error(`Non-literal upstream data: ${node?.type}`);
}

export function parseUpstreamData(text, name) {
  const { program } = babelParse(text, { sourceType: "script" });
  const values = new Map();
  for (const statement of program.body) {
    const expression = statement.expression;
    const target = expression?.left;
    if (statement.type !== "ExpressionStatement" || expression?.type !== "AssignmentExpression" ||
      expression.operator !== "=" || target.type !== "MemberExpression" || target.computed ||
      target.object.type !== "Identifier" || target.object.name !== "window" ||
      !["DYNASTY_DATA", "CORRIDOR_DATA", "ATLAS_MILESTONE_SOURCES"].includes(target.property.name) || values.has(target.property.name))
      throw new Error("Unexpected upstream statement");
    values.set(target.property.name, literal(expression.right));
  }
  if (!values.has(name)) throw new Error(`Missing upstream data: ${name}`);
  return values.get(name);
}

// Content correspondence was reviewed against both records. This is NOT an
// assertion that the primary sources, dates or coordinates have been verified.
export const reviewedMappings = [
  { historyId: "event-163", upstreamKey: "qin:-221", title: "嬴政称皇帝",
    reason: "上游条目合写统一、称帝及制度措施；仅对应本地称帝事件，不自动合并同年的其他事件。" },
  { historyId: "event-361", upstreamKey: "tang:641", title: "文成公主入藏",
    reason: "年份与文成公主入藏、联姻主题一致；文献卷次作为上游线索保留，未据此确认地点坐标。" },
];

export function adaptReferences(dynasties, citations, notes, mappings = reviewedMappings) {
  const events = dynasties.flatMap((dynasty) => (dynasty.milestones || []).map((event, index) => ({
    key: `${dynasty.key}:${event.year}`, period: dynasty.title, index, ...event,
  })));
  const references = {};
  for (const mapping of mappings) {
    const local = notes.filter((note) => note.historyId === mapping.historyId);
    const matches = events.filter((event) => event.key === mapping.upstreamKey);
    const books = citations[mapping.upstreamKey];
    if (local.length !== 1 || local[0].title !== mapping.title || matches.length !== 1 || !books?.length)
      throw new Error(`Ambiguous or missing reviewed mapping: ${mapping.historyId}`);
    const time = eventTime(local[0]);
    if (!time || matches[0].year < time.from || matches[0].year > time.to || references[mapping.historyId])
      throw new Error(`Inconsistent reviewed mapping: ${mapping.historyId}`);
    if (books.some((item) => !Array.isArray(item) || typeof item[0] !== "string" ||
      !Array.isArray(item[1]) || item[1].some((volume) => typeof volume !== "string")))
      throw new Error(`Invalid citations: ${mapping.upstreamKey}`);
    references[mapping.historyId] = { ...mapping, headline: matches[0].headline,
      books: books.map(([title, volumes]) => ({ title, volumes })), status: "upstream-reference" };
  }
  const audit = events.map((event) => {
    const mapped = mappings.filter((mapping) => mapping.upstreamKey === event.key).map((mapping) => mapping.historyId);
    const candidates = notes.filter((note) => note.historyId && note.historyGroup === event.period &&
      eventTime(note)?.from <= event.year && eventTime(note)?.to >= event.year).map((note) => note.historyId);
    return { upstreamKey: event.key, index: event.index, headline: event.headline, year: event.year,
      mapped, candidates, status: mapped.length ? "reviewed-content-match" : candidates.length ? "candidate-only" : "unmatched",
      hasReferences: Boolean(citations[event.key]?.length), hasCoordinate: Array.isArray(event.coord) };
  });
  return { references, report: {
    periods: dynasties.length,
    referencedSnapshots: new Set(dynasties.flatMap((dynasty) => (dynasty.phases || []).map((phase) => phase.snap))).size,
    milestones: events.length, settlements: dynasties.reduce((count, dynasty) => count + (dynasty.settlements?.length || 0), 0),
    reviewedMappings: Object.keys(references).length,
    withoutReferences: audit.filter((item) => !item.hasReferences).length,
    ambiguousYearCandidates: audit.filter((item) => item.candidates.length > 1).length,
    localMetadataIssues: auditHistoryMetadata(notes), events: audit,
  } };
}

export function buildReferences(root = process.cwd()) {
  const directory = path.join(root, sourceRoot);
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, "manifest.json"), "utf8"));
  const files = new Map(manifest.files.map((file) => {
    if (!file.path || file.path.split("/").includes("..") || path.isAbsolute(file.path) || !file.url.includes(`/${manifest.commit}/`))
      throw new Error("Invalid source manifest");
    const data = fs.readFileSync(path.join(directory, file.path));
    if (createHash("sha256").update(data).digest("hex") !== file.sha256) throw new Error(`Source checksum mismatch: ${file.path}`);
    return [file.upstreamPath, data.toString("utf8")];
  }));
  const dynasties = parseUpstreamData(files.get("js/map_data.js"), "DYNASTY_DATA");
  const citations = parseUpstreamData(files.get("js/milestone_sources.js"), "ATLAS_MILESTONE_SOURCES");
  const { notes } = readVault(root);
  const result = adaptReferences(dynasties, citations, notes);
  const provenance = { repository: manifest.repository, commit: manifest.commit, license: "GPL-3.0-only",
    attribution: "DeanChensj/jiangshan-map and contributors", sourcePath: "/history/sources/jiangshan/" };
  return { module: `// Generated by scripts/history/jiangshan.mjs; do not edit.\n// Adapted data: GPL-3.0-only; original source and LICENSE under public/history/sources/jiangshan.\nexport const referenceSource = ${JSON.stringify(provenance, null, 2)};\nexport const historyReferences = ${JSON.stringify(result.references, null, 2)};\n`,
    report: JSON.stringify({ ...provenance, ...result.report }, null, 2) + "\n" };
}

export function downloadSources(root = process.cwd()) {
  const directory = path.join(root, sourceRoot);
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, "manifest.json"), "utf8"));
  if (!/^[a-f0-9]{40}$/.test(manifest.commit)) throw new Error("Invalid source commit");
  for (const file of manifest.files) {
    const expectedUrl = `https://raw.githubusercontent.com/DeanChensj/jiangshan-map/${manifest.commit}/${file.upstreamPath}`;
    if (file.url !== expectedUrl || path.isAbsolute(file.path) || file.path.split("/").includes(".."))
      throw new Error("Invalid download manifest");
    const destination = path.join(directory, file.path);
    const check = (data) => {
      if (createHash("sha256").update(data).digest("hex") !== file.sha256)
        throw new Error(`Source checksum mismatch: ${file.path}`);
    };
    if (fs.existsSync(destination)) { check(fs.readFileSync(destination)); continue; }
    // Every downloaded file gets a new empty staging directory. Neither the
    // interpreter nor a build tool is run from there, and existing data stays intact.
    const stage = fs.mkdtempSync(path.join(os.tmpdir(), "jiangshan-source-"));
    try {
      const temporary = path.join(stage, "source.txt");
      execFileSync("curl", ["--fail", "--silent", "--show-error", "--location", "--max-time", "60", file.url, "--output", temporary]);
      check(fs.readFileSync(temporary));
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(temporary, destination, fs.constants.COPYFILE_EXCL);
    } finally { fs.rmSync(stage, { recursive: true, force: true }); }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--download")) downloadSources();
  const result = buildReferences();
  for (const [file, content] of [[output, result.module], [reportPath, result.report]]) {
    if (process.argv.includes("--write")) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content);
    } else if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content) {
      throw new Error(`Generated file differs: ${file}; run with --write`);
    }
  }
  const summary = JSON.parse(result.report);
  console.log(JSON.stringify({ periods: summary.periods, referencedSnapshots: summary.referencedSnapshots,
    milestones: summary.milestones, reviewedMappings: summary.reviewedMappings,
    withoutReferences: summary.withoutReferences, localMetadataIssues: summary.localMetadataIssues }, null, 2));
}
