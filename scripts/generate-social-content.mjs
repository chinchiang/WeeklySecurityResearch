/**
 * Generates everything derived from public/social-content/data/*.json:
 *
 *   - data/latest.json                       edition manifest
 *   - index.html / archive.html              the embedded ITEMS array
 *
 * The pages keep their item list inline so they still open directly from disk,
 * but the inline copy is written from the JSON here: edit the JSON and rerun
 * `node scripts/generate-social-content.mjs`. The site build does not run it;
 * this is frozen historical data with no entry point on the site.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SOCIAL_PAGES, canonicalItems, embedItems, readEditions } from "./social-content-lib.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const socialDir = path.join(projectRoot, "public", "social-content");
const dataDir = path.join(socialDir, "data");

const editions = readEditions(dataDir);
const items = canonicalItems(editions);
const latestWeek = editions.at(-1).week;

const manifestEditions = editions.map(({ week, edition, file }) => ({
  week,
  readyCount: edition.items.filter((item) => item.status === "Ready").length,
  dataUrl: `/social-content/data/${file}`,
}));
const latest = manifestEditions.at(-1);

const latestManifest =
  `${JSON.stringify({ generatedFrom: "public/social-content/data/YYYY-MM-DD.json", latest, editions: manifestEditions.toReversed() }, null, 2)}\n`;

writeFileSync(path.join(dataDir, "latest.json"), latestManifest);

for (const page of SOCIAL_PAGES) {
  const publicFile = path.join(socialDir, page);
  const rewritten = embedItems(readFileSync(publicFile, "utf8"), items, latestWeek);
  if (readFileSync(publicFile, "utf8") !== rewritten) writeFileSync(publicFile, rewritten);
}

console.log(`Social content: ${editions.length} 期、${items.length} 則選題，最新 ${latest.week}（${latest.readyCount} ready）`);
