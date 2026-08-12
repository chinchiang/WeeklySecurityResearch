/**
 * One-off migration that brings every weekly social edition onto a single
 * schema. Historical editions were written in three incompatible shapes
 * ({meta, ideas}, {week, window, ideas} with file pointers only, and
 * {week, range, qualified, items}), which made the stored data impossible to
 * validate and left one edition with no data file at all.
 *
 * Canonical shape:
 *   { week, range, qualified, items: [{ id, week, topic, status, title, hook,
 *     tags, linkedin, twitter, blog, newsletter, evidence, sources, legacy? }] }
 *
 * `sources` is always an array of objects. `url` and `publisher` are always
 * present; `title` and `date` only appear where the edition already recorded
 * them, because inferring them would attach unverified provenance to a link.
 * Every field an older edition carried that has no canonical home is kept
 * verbatim under `legacy`, so the migration never drops information.
 *
 * Draft bodies come from the ITEMS array embedded in index.html, which is what
 * the published page actually renders.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const socialDir = path.join(projectRoot, "public", "social-content");
const dataDir = path.join(socialDir, "data");

// Mirrors the publisher lookup used by index.html so both render the same name.
const PUBLISHERS = {
  "digital-strategy.ec.europa.eu": "European Commission",
  "cisa.gov": "CISA",
  "ic3.gov": "IC3 / FBI",
  "nist.gov": "NIST",
  "securityweek.com": "SecurityWeek",
  "thehackernews.com": "The Hacker News",
  "labs.zenity.io": "Zenity Labs",
  "aisi.gov.uk": "UK AISI",
  "reuters.com": "Reuters",
  "jvn.jp": "JPCERT/CC JVN",
  "berigo.no": "Berigo",
  "axios.com": "Axios",
  "theguardian.com": "The Guardian",
  "wired.com": "WIRED",
  "whitehouse.gov": "The White House",
};

const CANONICAL_KEYS = [
  "id",
  "week",
  "topic",
  "status",
  "title",
  "hook",
  "tags",
  "linkedin",
  "twitter",
  "blog",
  "newsletter",
  "evidence",
  "sources",
];

function publisherFor(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return PUBLISHERS[host] ?? host;
  } catch {
    return "Unknown";
  }
}

function normalizeSource(source) {
  if (typeof source === "string") {
    return { url: source, publisher: publisherFor(source) };
  }
  const normalized = { url: source.url, publisher: source.publisher ?? publisherFor(source.url) };
  // Older editions stored the source headline under `name`.
  const title = source.title ?? source.name;
  if (title) normalized.title = title;
  if (source.date) normalized.date = source.date;
  return normalized;
}

function embeddedItems() {
  const html = readFileSync(path.join(socialDir, "index.html"), "utf8");
  const marker = "const ITEMS=";
  const start = html.indexOf(marker);
  if (start < 0) throw new Error("index.html 內找不到 ITEMS 陣列");

  const tail = html.slice(start + marker.length);
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < tail.length; i++) {
    const char = tail[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "[" || char === "{") depth++;
    else if (char === "]" || char === "}") {
      depth--;
      if (depth === 0) return JSON.parse(tail.slice(0, i + 1));
    }
  }
  throw new Error("無法解析 index.html 的 ITEMS 陣列");
}

function existingEdition(week) {
  const file = path.join(dataDir, `${week}.json`);
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function rangeFor(week, edition) {
  // 2026-08-03 recorded the window as {start, end} rather than a string.
  const window = edition?.window;
  if (window && typeof window === "object" && window.start && window.end) {
    return `${window.start}–${window.end}`;
  }

  const recorded = edition?.range ?? (typeof window === "string" ? window : null) ?? edition?.meta?.researchWindow;
  if (recorded) return String(recorded).replace(/\s+—\s+/, "–").replace(/\s+/g, "");

  const end = new Date(`${week}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 7);
  return `${start.toISOString().slice(0, 10)}–${week}`;
}

const items = embeddedItems();
const weeks = [...new Set(items.map((item) => item.week))].sort();
const report = [];

for (const week of weeks) {
  const edition = existingEdition(week);
  const legacyEntries = edition?.items ?? edition?.ideas ?? [];
  const weekItems = items.filter((item) => item.week === week);

  const normalized = weekItems.map((item, index) => {
    // Legacy entries were written in the same order as the rendered items.
    const legacy = legacyEntries[index];
    if (legacy && legacy.title !== item.title) {
      throw new Error(`${week} 第 ${index + 1} 筆標題不一致，停止以免錯配：\n  舊: ${legacy.title}\n  新: ${item.title}`);
    }

    const canonical = {};
    for (const key of CANONICAL_KEYS) canonical[key] = item[key];
    canonical.sources = (legacy?.sources ?? item.sources ?? []).map(normalizeSource);

    // Anything the older edition held that the canonical item does not carry
    // verbatim is kept under `legacy`. That includes canonical keys whose old
    // value differs from the rendered one — 2026-07-27 stored single-language
    // drafts that the bilingual rebuild replaced, and those must not vanish.
    const extras = {};
    for (const [key, value] of Object.entries(legacy ?? {})) {
      if (key === "sources") continue;
      const isCanonical = CANONICAL_KEYS.includes(key);
      if (!isCanonical || JSON.stringify(canonical[key]) !== JSON.stringify(value)) {
        extras[key] = value;
      }
    }
    if (Object.keys(extras).length) canonical.legacy = extras;

    return canonical;
  });

  const output = { week, range: rangeFor(week, edition), qualified: normalized.filter((item) => item.status === "Ready").length, items: normalized };
  if (edition?.meta) output.meta = edition.meta;
  if (edition?.generatedAt) output.generatedAt = edition.generatedAt;

  writeFileSync(path.join(dataDir, `${week}.json`), `${JSON.stringify(output, null, 2)}\n`);
  const detailed = normalized.flatMap((item) => item.sources).filter((source) => source.title).length;
  const totalSources = normalized.reduce((sum, item) => sum + item.sources.length, 0);
  report.push(`${week}: ${normalized.length} 筆選題、${totalSources} 個來源（含標題與日期 ${detailed} 個）`);
}

const orphaned = readdirSync(dataDir)
  .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
  .map((name) => name.replace(/\.json$/, ""))
  .filter((week) => !weeks.includes(week));
if (orphaned.length) throw new Error(`data/ 有 index.html 未收錄的週次，請先確認：${orphaned.join(", ")}`);

console.log(report.join("\n"));
