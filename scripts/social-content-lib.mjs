/**
 * Shared helpers for the social-content pipeline.
 *
 * `public/social-content/data/*.json` is the only source of truth. The two
 * standalone pages embed their item list so they still open straight from
 * disk without fetching anything, and that embedded copy is generated from
 * the JSON rather than maintained by hand.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export const EDITION_PATTERN = /^\d{4}-\d{2}-\d{2}\.json$/;
export const SOCIAL_PAGES = ["index.html", "archive.html"];
const ITEMS_MARKER = "const ITEMS=";

/** Editions sorted oldest to newest, validated against the canonical schema. */
export function readEditions(dataDir) {
  const files = readdirSync(dataDir).filter((file) => EDITION_PATTERN.test(file)).sort();
  if (!files.length) throw new Error("找不到任何以日期命名的社群內容期別。");

  return files.map((file) => {
    const edition = JSON.parse(readFileSync(path.join(dataDir, file), "utf8"));
    const week = file.replace(/\.json$/, "");
    if (week !== edition.week) throw new Error(`${file}: 檔名與內部 week 欄位不符（${edition.week}）`);
    if (!Array.isArray(edition.items) || edition.items.length === 0) throw new Error(`${file}: 缺少 items 陣列`);
    return { week, edition, file };
  });
}

/** The flat item list the pages render, newest week first. */
export function canonicalItems(editions) {
  return [...editions].reverse().flatMap(({ edition }) => edition.items);
}

/**
 * Locate the embedded `const ITEMS=[...],LATEST="..."` block. Returns the
 * parsed items plus the slice bounds so the generator can rewrite it and the
 * test can compare it without duplicating this parsing.
 */
export function findEmbeddedItems(html) {
  const start = html.indexOf(ITEMS_MARKER);
  if (start < 0) throw new Error("頁面中找不到 ITEMS 陣列");

  const arrayStart = start + ITEMS_MARKER.length;
  let depth = 0;
  let inString = false;
  let escaped = false;
  let arrayEnd = -1;
  for (let i = arrayStart; i < html.length; i++) {
    const char = html[i];
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
      if (depth === 0) { arrayEnd = i + 1; break; }
    }
  }
  if (arrayEnd < 0) throw new Error("無法解析頁面中的 ITEMS 陣列");

  const rest = html.slice(arrayEnd);
  const latestMatch = rest.match(/^,LATEST="(\d{4}-\d{2}-\d{2})"/);
  if (!latestMatch) throw new Error("ITEMS 之後找不到 LATEST 宣告");

  return {
    items: JSON.parse(html.slice(arrayStart, arrayEnd)),
    latest: latestMatch[1],
    arrayStart,
    arrayEnd,
    latestEnd: arrayEnd + latestMatch[0].length,
  };
}

/** Rewrite the embedded block from the canonical data. */
export function embedItems(html, items, latest) {
  const found = findEmbeddedItems(html);
  return (
    html.slice(0, found.arrayStart) +
    JSON.stringify(items) +
    `,LATEST="${latest}"` +
    html.slice(found.latestEnd)
  );
}
