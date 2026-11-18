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
const contentReviewPath = fileURLToPath(new URL('../../.vitepress/reports/history-content-review.json', import.meta.url));
export const reviewedMappings = JSON.parse(fs.readFileSync(contentReviewPath, 'utf8')).events.flatMap(event =>
  event.matches.map(match => ({ ...match, upstreamKey: event.upstreamKey,
    sourceUrl: `https://github.com/DeanChensj/jiangshan-map/blob/897b9ad4e987fcface8728ffdfbe33e801a3dbae/js/map_data.js`,
    difference: match.difference || event.difference || undefined })));

export function adaptReferences(dynasties, citations, notes, mappings = reviewedMappings) {
  const events = dynasties.flatMap((dynasty) => (dynasty.milestones || []).map((event, index) => ({
    key: `${dynasty.key}:${event.year}`, period: dynasty.title, index, ...event,
  })));
  const references = {};
  const seen = new Set();
  for (const mapping of mappings) {
    const local = notes.filter((note) => note.historyId === mapping.historyId);
    const matches = events.filter((event) => event.key === mapping.upstreamKey);
    const books = citations[mapping.upstreamKey] || [];
    if (local.length !== 1 || local[0].title !== mapping.title || matches.length !== 1 || !mapping.reason)
      throw new Error(`Ambiguous or missing reviewed mapping: ${mapping.historyId}`);
    const time = eventTime(local[0]);
    // A compound headline can mention a different year in its prose. Such a
    // correspondence requires an explicit chronology difference and is
    // never inferred from a nearby date.
    const outside = !time || matches[0].year < time.from || matches[0].year > time.to;
    const identity = `${mapping.historyId}\0${mapping.upstreamKey}`;
    if (!time || (outside && !mapping.difference) || seen.has(identity))
      throw new Error(`Inconsistent reviewed mapping: ${mapping.historyId}`);
    seen.add(identity);
    if (books.some((item) => !Array.isArray(item) || typeof item[0] !== "string" ||
      !Array.isArray(item[1]) || item[1].some((volume) => typeof volume !== "string")))
      throw new Error(`Invalid citations: ${mapping.upstreamKey}`);
    const match = { upstreamKey: mapping.upstreamKey, headline: matches[0].headline,
      year: matches[0].year, reason: mapping.reason, scope: mapping.scope || mapping.title,
      status: "reviewed-content-match", ...(mapping.difference ? { difference: mapping.difference } : {}),
      sourceUrl: mapping.sourceUrl || "https://github.com/DeanChensj/jiangshan-map",
      books: books.map(([title, volumes]) => ({ title, volumes })) };
    const reference = references[mapping.historyId] ||= { historyId: mapping.historyId,
      title: mapping.title, upstreamKey: mapping.upstreamKey, headline: matches[0].headline,
      reason: mapping.reason, books: [], matches: [], status: "upstream-reference" };
    reference.matches.push(match);
    for (const book of match.books) {
      const existing = reference.books.find(item => item.title === book.title);
      if (existing) existing.volumes = [...new Set([...existing.volumes, ...book.volumes])];
      else reference.books.push({ title: book.title, volumes: [...book.volumes] });
    }
    if (reference.matches.length > 1)
      reference.reason = "本地笔记覆盖多个上游时间节点；各条对应的行动范围和纪年、地点差异见逐项说明。";
  }
  const audit = events.map((event) => {
    const reviewed = mappings.filter((mapping) => mapping.upstreamKey === event.key);
    const mapped = reviewed.map((mapping) => mapping.historyId);
    const candidates = notes.filter((note) => note.historyId && note.historyGroup === event.period &&
      eventTime(note)?.from <= event.year && eventTime(note)?.to >= event.year).map((note) => note.historyId);
    return { upstreamKey: event.key, index: event.index, headline: event.headline, year: event.year,
      mapped, matches: reviewed.map(mapping => ({ historyId: mapping.historyId, scope: mapping.scope || mapping.title,
        reason: mapping.reason, ...(mapping.difference ? { difference: mapping.difference } : {}) })),
      candidates, status: mapped.length ? "reviewed-content-match" : candidates.length ? "candidate-only" : "unmatched",
      hasReferences: Boolean(citations[event.key]?.length), hasCoordinate: Array.isArray(event.coord) };
  });
  return { references, report: {
    periods: dynasties.length,
    referencedSnapshots: new Set(dynasties.flatMap((dynasty) => (dynasty.phases || []).map((phase) => phase.snap))).size,
    milestones: events.length, settlements: dynasties.reduce((count, dynasty) => count + (dynasty.settlements?.length || 0), 0),
    reviewedMappings: Object.keys(references).length,
    reviewedCorrespondences: mappings.length,
    coveredMilestones: audit.filter(item => item.mapped.length).length,
    localChineseEvents: notes.filter(note => note.id?.startsWith('历史/中国史/') && note.historyId).length,
    addedEventIds: notes.filter(note => note.id?.startsWith('历史/中国史/') && note.historyId?.startsWith('event-jiangshan-')).map(note => note.historyId).sort(),
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
