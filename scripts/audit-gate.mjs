/**
 * Security audit gate.
 *
 * `npm audit --audit-level=high` fails on any high or critical advisory and
 * offers no way to record a reviewed exception, so a single unfixable
 * transitive advisory leaves main permanently red. This wrapper keeps that
 * gate for everything else and narrows it to advisories written down in
 * scripts/audit-allowlist.json with a reason.
 *
 * Exit codes: 0 clean, 1 blocking advisory, 2 stale or expired allowlist.
 */
import { exec } from "node:child_process";
import { readFile } from "node:fs/promises";

const BLOCKING = new Set(["high", "critical"]);
const allowlistPath = new URL("./audit-allowlist.json", import.meta.url);

const runAudit = () =>
  new Promise((resolve, reject) => {
    // npm audit exits non-zero whenever it finds anything, so a non-zero code
    // is not an error here — only the absence of parsable JSON is.
    exec("npm audit --json", { maxBuffer: 32 * 1024 * 1024 }, (error, stdout) => {
      if (stdout) {
        resolve(stdout);
        return;
      }
      reject(error ?? new Error("npm audit produced no output"));
    });
  });

const advisoryId = (url) => url?.match(/(GHSA-[\w-]+)/)?.[1] ?? url;

/** Flattens npm's nested `via` chains into one advisory record per GHSA id. */
const collectAdvisories = (report) => {
  const found = new Map();

  for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      // A string `via` is a parent package, not an advisory of its own.
      if (typeof via === "string" || !BLOCKING.has(via.severity)) continue;

      const id = advisoryId(via.url);
      const existing = found.get(id);
      if (existing) {
        existing.packages.add(vulnerability.name);
        continue;
      }
      found.set(id, {
        id,
        title: via.title,
        severity: via.severity,
        packages: new Set([vulnerability.name]),
      });
    }
  }

  return found;
};

const { allow = [] } = JSON.parse(await readFile(allowlistPath, "utf8"));
const allowed = new Map(allow.map((entry) => [entry.advisory, entry]));
const advisories = collectAdvisories(JSON.parse(await runAudit()));

const blocking = [...advisories.values()].filter((advisory) => !allowed.has(advisory.id));
const tolerated = [...advisories.values()].filter((advisory) => allowed.has(advisory.id));
const unused = allow.filter((entry) => !advisories.has(entry.advisory));

const today = new Date().toISOString().slice(0, 10);
const expired = tolerated
  .map((advisory) => allowed.get(advisory.id))
  .filter((entry) => entry.reviewBy && entry.reviewBy < today);

for (const advisory of tolerated) {
  const entry = allowed.get(advisory.id);
  console.log(`allowed  ${advisory.severity.padEnd(8)} ${advisory.id}  ${[...advisory.packages].join(", ")}`);
  console.log(`         ${entry.reason}`);
  console.log(`         blocked on: ${entry.blockedOn}  review by: ${entry.reviewBy ?? "n/a"}`);
}

for (const advisory of blocking) {
  console.error(`BLOCKING ${advisory.severity.padEnd(8)} ${advisory.id}  ${[...advisory.packages].join(", ")}`);
  console.error(`         ${advisory.title}`);
}

if (blocking.length > 0) {
  console.error(
    `\n${blocking.length} unreviewed high or critical ${blocking.length === 1 ? "advisory" : "advisories"}. ` +
      "Upgrade the dependency, or add an entry to scripts/audit-allowlist.json explaining why it does not apply.",
  );
  process.exit(1);
}

if (expired.length > 0) {
  for (const entry of expired) {
    console.error(`EXPIRED  ${entry.advisory} was due for review by ${entry.reviewBy}.`);
  }
  console.error("\nRe-check whether the exception still holds, then move the review date or drop the entry.");
  process.exit(2);
}

if (unused.length > 0) {
  for (const entry of unused) {
    console.error(`STALE    ${entry.advisory} is allowlisted but no longer reported. Remove it.`);
  }
  process.exit(2);
}

console.log(`\nNo unreviewed high or critical advisories (${tolerated.length} allowlisted).`);
