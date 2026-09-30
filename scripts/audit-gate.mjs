/**
 * Security audit gate.
 *
 * `npm audit --audit-level=high` fails on any high or critical advisory and
 * offers no way to record a reviewed exception, so a single unfixable
 * transitive advisory leaves main permanently red. This wrapper keeps that
 * gate for everything else and narrows it to advisories written down in
 * scripts/audit-allowlist.json with a reason.
 *
 * Only advisories reachable from `dependencies` block. The site is a static
 * export: `devDependencies` (eslint, typescript, tailwind) run only on the
 * build machine and never reach readers, so their advisories are printed as
 * warnings instead. Otherwise a new advisory in a lint tool stops every
 * content PR and deploy until someone upgrades it.
 *
 * Exit codes: 0 clean, 1 blocking advisory, 2 stale, expired or invalid
 * allowlist, or npm audit returned no report.
 */
import { exec } from "node:child_process";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const BLOCKING = new Set(["high", "critical"]);
const allowlistPath = new URL("./audit-allowlist.json", import.meta.url);

const runAudit = (flags = "") =>
  new Promise((resolve, reject) => {
    // npm audit exits non-zero whenever it finds anything, so a non-zero code
    // is not an error here — only the absence of parsable JSON is.
    exec(`npm audit --json ${flags}`.trim(), { maxBuffer: 32 * 1024 * 1024 }, (error, stdout) => {
      if (stdout) {
        resolve(stdout);
        return;
      }
      reject(error ?? new Error("npm audit produced no output"));
    });
  });

const advisoryId = (url) => url?.match(/(GHSA-[\w-]+)/)?.[1] ?? url;

/** Flattens npm's nested `via` chains into one advisory record per GHSA id. */
export const collectAdvisories = (report) => {
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

/**
 * Splits advisories into blocking (production), dev-only warnings and
 * allowlisted ones. `all` and `production` are parsed `npm audit --json`
 * reports without and with `--omit=dev`.
 */
export function evaluate({ all, production, allow, today }) {
  const allowed = new Map(allow.map((entry) => [entry.advisory, entry]));
  const advisories = collectAdvisories(all);
  const productionIds = new Set(collectAdvisories(production).keys());
  const tolerated = [...advisories.values()].filter((advisory) => allowed.has(advisory.id));
  const open = [...advisories.values()].filter((advisory) => !allowed.has(advisory.id));
  return {
    tolerated,
    blocking: open.filter((advisory) => productionIds.has(advisory.id)),
    devOnly: open.filter((advisory) => !productionIds.has(advisory.id)),
    expired: tolerated.map((advisory) => allowed.get(advisory.id)).filter((entry) => entry.reviewBy < today),
    unused: allow.filter((entry) => !advisories.has(entry.advisory)),
  };
}

const fail = (message) => {
  console.error(message);
  process.exit(2);
};

// npm prints `{"error": {...}}` on registry, network or lockfile failures.
// That is not a clean report, so it must not pass the gate.
const parseReport = (stdout, label) => {
  const report = JSON.parse(stdout);
  if (report.error || typeof report.vulnerabilities !== "object" || report.vulnerabilities === null) {
    fail(`npm audit${label} did not return a vulnerability report: ${report.error?.summary ?? report.error?.code ?? "no \"vulnerabilities\" field"}.`);
  }
  return report;
};

async function main() {
  const { allow = [] } = JSON.parse(await readFile(allowlistPath, "utf8"));
  // Every exception must say why it is safe and when it expires; an entry
  // without a review date would otherwise stay tolerated forever.
  for (const entry of allow) {
    const missing = ["advisory", "reason", "blockedOn", "reviewBy"].filter((key) => typeof entry[key] !== "string" || entry[key].trim() === "");
    if (missing.length > 0) fail(`INVALID  allowlist entry ${entry.advisory ?? "(no advisory)"} is missing: ${missing.join(", ")}.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewBy)) fail(`INVALID  ${entry.advisory} reviewBy must be YYYY-MM-DD, got "${entry.reviewBy}".`);
  }

  const all = parseReport(await runAudit(), "");
  const production = parseReport(await runAudit("--omit=dev"), " --omit=dev");
  const { tolerated, blocking, devOnly, expired, unused } = evaluate({ all, production, allow, today: new Date().toISOString().slice(0, 10) });
  const allowed = new Map(allow.map((entry) => [entry.advisory, entry]));

  for (const advisory of tolerated) {
    const entry = allowed.get(advisory.id);
    console.log(`allowed  ${advisory.severity.padEnd(8)} ${advisory.id}  ${[...advisory.packages].join(", ")}`);
    console.log(`         ${entry.reason}`);
    console.log(`         blocked on: ${entry.blockedOn}  review by: ${entry.reviewBy}`);
  }

  for (const advisory of devOnly) {
    console.log(`DEV-ONLY ${advisory.severity.padEnd(8)} ${advisory.id}  ${[...advisory.packages].join(", ")}`);
    console.log(`         ${advisory.title}`);
    // Shown as an annotation on the run and the PR; upgrade it in a separate PR.
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::warning title=npm audit (dev only)::${advisory.id} ${[...advisory.packages].join(", ")}: ${advisory.title}`);
    }
  }

  for (const advisory of blocking) {
    console.error(`BLOCKING ${advisory.severity.padEnd(8)} ${advisory.id}  ${[...advisory.packages].join(", ")}`);
    console.error(`         ${advisory.title}`);
  }

  if (blocking.length > 0) {
    console.error(
      `\n${blocking.length} unreviewed high or critical ${blocking.length === 1 ? "advisory" : "advisories"} in production dependencies. ` +
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

  const devNote = devOnly.length > 0 ? `, ${devOnly.length} dev-only ${devOnly.length === 1 ? "advisory" : "advisories"} reported as warnings` : "";
  console.log(`\nNo unreviewed high or critical advisories in production dependencies (${tolerated.length} allowlisted${devNote}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
