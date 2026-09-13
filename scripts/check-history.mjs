import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { readings } from "../app/data/readings.ts";
const ref = process.argv[2];
if (!ref || !/^[a-f0-9]{40}$/.test(ref)) throw new Error("Pass a verified full base commit SHA");
const dir = mkdtempSync(join(tmpdir(),"reading-history-"));
try {
  const file = join(dir,"baseline.mts");
  writeFileSync(file,execFileSync("git",["show",`${ref}:app/data/readings.ts`],{encoding:"utf8"}));
  const {readings:before} = await import(pathToFileURL(file).href);
  const current = new Map(readings.map(r=>[r.id,r]));
  for (const r of before) {
    if (!current.has(r.id)) throw new Error(`Published reading ${r.id} was deleted`);
    if (current.get(r.id).week !== r.week) throw new Error(`Published reading ${r.id} changed week`);
  }
  console.log(`Preserved ${before.length} existing reading IDs and weekly links.`);
} finally {
  const file = join(dir,"baseline.mts");
  if (existsSync(file)) unlinkSync(file);
  rmdirSync(dir);
}
