/**
 * Published history may grow or be corrected, never silently shrink.
 *
 * Compared with the base commit: readings keep their id and week, keep their
 * provenance and every correction they had; every week keeps its editorial
 * record and report integration; committed receipts and report snapshots
 * are not deleted (receipts may be edited, e.g. to backfill evidence).
 *
 * The base readings.ts is imported from a temp copy, which works because it
 * only has `import type` imports. If it ever needs a value import from a
 * sibling module, extract the whole app/data directory instead.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { readings, weeklyEditorials, weeklyReportIntegrations } from "../app/data/readings.ts";
const ref = process.argv[2];
if (!ref || !/^[a-f0-9]{40}$/.test(ref)) throw new Error("Pass a verified full base commit SHA");
const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
const filesAt = (tree, dir) => git("ls-tree", "--name-only", `${tree}:${dir}`).split("\n").filter(Boolean);
const errors = [];
const dir = mkdtempSync(join(tmpdir(), "reading-history-"));
try {
  const file = join(dir, "baseline.mts");
  writeFileSync(file, git("show", `${ref}:app/data/readings.ts`));
  const base = await import(pathToFileURL(file).href);
  const current = new Map(readings.map(r => [r.id, r]));
  for (const r of base.readings) {
    const now = current.get(r.id);
    if (!now) { errors.push(`Published reading ${r.id} was deleted`); continue; }
    if (now.week !== r.week) errors.push(`Published reading ${r.id} changed week`);
    if (r.provenance && !now.provenance) errors.push(`Published reading ${r.id} lost its provenance`);
    const kept = new Set((now.corrections ?? []).map(c => JSON.stringify(c)));
    for (const c of r.corrections ?? []) {
      if (!kept.has(JSON.stringify(c))) errors.push(`Published reading ${r.id} lost or rewrote correction ${c.date} ${c.type}`);
    }
  }
  for (const week of Object.keys(base.weeklyEditorials ?? {})) {
    if (!weeklyEditorials[week]) errors.push(`Editorial record for ${week} was deleted`);
  }
  for (const week of Object.keys(base.weeklyReportIntegrations ?? {})) {
    if (!weeklyReportIntegrations[week]) errors.push(`Report integration for ${week} was deleted`);
  }
  for (const folder of ["public/reading-runs", "public/reports"]) {
    for (const name of filesAt(ref, folder)) {
      if (!existsSync(join(folder, name))) errors.push(`${folder}/${name} was deleted`);
    }
  }
  if (errors.length > 0) {
    for (const message of errors) console.error(message);
    process.exit(1);
  }
  console.log(`Preserved ${base.readings.length} existing readings (ids, weeks, provenance, corrections), editorial records, receipts and reports.`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
