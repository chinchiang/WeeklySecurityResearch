import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { classifyResult, renderSummary } from "../scripts/report-links.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const workflow = readFileSync(path.join(root, ".github/workflows/check-links.yml"), "utf8");
const failure = { url: "https://source.example/missing", status: 404 };
const report = (failures = []) => JSON.stringify({ checked: 2, failures });

function stepBody(name) {
  const part = workflow.split(`      - name: ${name}\n`)[1]?.split("\n      - name:")[0];
  assert.ok(part, `Missing workflow step ${name}`);
  return part;
}

function stepRun(name) {
  const block = stepBody(name).split("        run: |\n")[1];
  assert.ok(block, `Missing shell body ${name}`);
  return block.split("\n").filter(line => line.startsWith("          ")).map(line => line.slice(10)).join("\n");
}

function fixture(t, behavior) {
  const dir = mkdtempSync(path.join(tmpdir(), "wsr-link-check-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(path.join(dir, "scripts"));
  mkdirSync(path.join(dir, "app/data"), { recursive: true });
  for (const script of ["check-links.mjs", "report-links.mjs"]) {
    copyFileSync(path.join(root, "scripts", script), path.join(dir, "scripts", script));
  }
  writeFileSync(path.join(dir, "package.json"), '{"type":"module"}');
  writeFileSync(path.join(dir, "app/data/readings.ts"), `export const readings: {source: string; pdf?: string}[] = [
    {source: "https://source.example/one", pdf: "https://source.example/two"},
    {source: "https://source.example/one"}
  ];`);
  const stub = path.join(dir, "mock-fetch.mjs");
  // No test reaches the network: all fetch calls use this process-local stub.
  writeFileSync(stub, `
    if (process.argv[1]?.endsWith("check-links.mjs")) {
      ${behavior}
    }
  `);
  return {
    dir,
    env: {
      ...process.env,
      NODE_OPTIONS: `--import=${pathToFileURL(stub).href}`,
      GITHUB_OUTPUT: path.join(dir, "output"),
      GITHUB_STEP_SUMMARY: path.join(dir, "summary"),
    },
  };
}

function runStep(name, context, extraEnv = {}) {
  return spawnSync("bash", ["--noprofile", "--norc", "-e", "-o", "pipefail", "-c", stepRun(name)], {
    cwd: context.dir, env: { ...context.env, ...extraEnv }, encoding: "utf8",
  });
}

test("classify valid success and unreachable reports with matching exit codes", () => {
  assert.equal(classifyResult(report(), 0).outcome, "pass");
  assert.equal(classifyResult(report([failure]), 1).outcome, "unreachable");
  assert.equal(classifyResult(report([{ url: failure.url, error: "fetch failed" }]), 1).outcome, "unreachable");
});

test("malformed, contaminated, empty and inconsistent reports fail closed", () => {
  const invalid = [
    ["", 0], ["not JSON", 1], ["ExperimentalWarning\n" + report([failure]), 1],
    [report() + "\nextra log", 0], ["[]", 1], ["null", 0],
    [JSON.stringify({ checked: 0, failures: [] }), 0],
    [JSON.stringify({ checked: 1, failures: [{ status: 404 }] }), 1],
    [JSON.stringify({ checked: 1, failures: [failure, failure] }), 1],
    [report([failure]), 0], [report(), 1], [report([failure]), 2],
  ];
  for (const [stdout, status] of invalid) {
    assert.equal(classifyResult(stdout, status).outcome, "error", `${status}: ${stdout}`);
  }
  assert.equal(classifyResult(JSON.stringify({ checked: 2, failures: [failure], outcome: "pass" }), 1).outcome, "unreachable");
});

test("real checker success produces one JSON document and deduplicates source/PDF URLs", (t) => {
  const context = fixture(t, "globalThis.fetch = async () => new Response(null, {status: 200});");
  const run = runStep("Check source and PDF links", context);
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(JSON.parse(readFileSync(path.join(context.dir, "links.json"), "utf8")), { checked: 2, failures: [] });
  assert.equal(readFileSync(context.env.GITHUB_OUTPUT, "utf8"), "outcome=pass\n");
  assert.equal(runStep("Enforce link checker result", context, { LINK_OUTCOME: "pass" }).status, 0);
});

test("HEAD 404 falls back to GET before declaring a source unreachable", async (t) => {
  for (const status of [200, 206]) {
    await t.test(`GET ${status}`, (t) => {
      const context = fixture(t, `
        const { appendFileSync } = await import("node:fs");
        globalThis.fetch = async (url, options) => {
          appendFileSync("fetch-calls.jsonl", JSON.stringify({ url, method: options.method, range: options.headers.Range }) + "\\n");
          return new Response(null, { status: options.method === "HEAD" ? 404 : ${status} });
        };
      `);
      const run = runStep("Check source and PDF links", context);
      assert.equal(run.status, 0, run.stderr);
      assert.deepEqual(JSON.parse(readFileSync(path.join(context.dir, "links.json"), "utf8")), { checked: 2, failures: [] });
      assert.equal(readFileSync(context.env.GITHUB_OUTPUT, "utf8"), "outcome=pass\n");
      const calls = readFileSync(path.join(context.dir, "fetch-calls.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
      assert.deepEqual(calls, ["one", "two"].flatMap(name => [
        { url: `https://source.example/${name}`, method: "HEAD" },
        { url: `https://source.example/${name}`, method: "GET", range: "bytes=0-1024" },
      ]));
    });
  }
});

test("HEAD 404 followed by GET 404 remains an unreachable source", (t) => {
  const context = fixture(t, `
    const { appendFileSync } = await import("node:fs");
    globalThis.fetch = async (url, options) => {
      appendFileSync("fetch-calls.jsonl", JSON.stringify({ url, method: options.method }) + "\\n");
      return new Response(null, { status: 404 });
    };
  `);
  const run = runStep("Check source and PDF links", context);
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(JSON.parse(readFileSync(path.join(context.dir, "links.json"), "utf8")), {
    checked: 2,
    failures: ["one", "two"].map(name => ({ url: `https://source.example/${name}`, status: 404 })),
  });
  assert.equal(readFileSync(context.env.GITHUB_OUTPUT, "utf8"), "outcome=unreachable\n");
  const calls = readFileSync(path.join(context.dir, "fetch-calls.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  assert.deepEqual(calls, ["one", "two"].flatMap(name => [
    { url: `https://source.example/${name}`, method: "HEAD" },
    { url: `https://source.example/${name}`, method: "GET" },
  ]));
});

test("Type Stripping warning stays on stderr while real 404s remain source warnings", (t) => {
  const context = fixture(t, `
    process.emitWarning("Type Stripping is an experimental feature and might change at any time", "ExperimentalWarning");
    globalThis.fetch = async () => new Response(null, {status: 404});
  `);
  const run = runStep("Check source and PDF links", context);
  assert.equal(run.status, 0, run.stderr);
  const stdout = readFileSync(path.join(context.dir, "links.json"), "utf8");
  const stderr = readFileSync(path.join(context.dir, "links.stderr.log"), "utf8");
  assert.doesNotMatch(stdout, /ExperimentalWarning/);
  assert.equal(JSON.parse(stdout).failures.length, 2);
  assert.match(stderr, /ExperimentalWarning.*Type Stripping/);
  assert.equal(readFileSync(context.env.GITHUB_OUTPUT, "utf8"), "outcome=unreachable\n");
  const gate = runStep("Enforce link checker result", context, { LINK_OUTCOME: "unreachable" });
  assert.equal(gate.status, 0);
  assert.match(gate.stdout, /::warning/);
  const summary = spawnSync(process.execPath, ["scripts/report-links.mjs", "summary"], { cwd: context.dir, env: context.env, encoding: "utf8" });
  assert.equal(summary.status, 0, summary.stderr);
  assert.match(readFileSync(context.env.GITHUB_STEP_SUMMARY, "utf8"), /原始來源無法存取/);
  assert.match(readFileSync(context.env.GITHUB_STEP_SUMMARY, "utf8"), /ExperimentalWarning/);
});

test("source network exceptions remain unreachable, not checker crashes", (t) => {
  const context = fixture(t, "globalThis.fetch = async () => { throw new Error('fetch failed'); };");
  const run = runStep("Check source and PDF links", context);
  assert.equal(run.status, 0, run.stderr);
  const result = JSON.parse(readFileSync(path.join(context.dir, "links-result.json"), "utf8"));
  assert.equal(result.outcome, "unreachable");
  assert.equal(result.failures[0].error, "fetch failed");
});

test("checker startup crash and stdout contamination fail the independent gate", async (t) => {
  for (const behavior of [
    "throw new Error('checker startup failed');",
    "console.log('unexpected stdout'); globalThis.fetch = async () => new Response(null, {status: 200});",
  ]) {
    await t.test(behavior.startsWith("throw") ? "startup crash" : "stdout contamination", (t) => {
      const context = fixture(t, behavior);
      const run = runStep("Check source and PDF links", context);
      assert.equal(run.status, 0, run.stderr);
      assert.equal(readFileSync(context.env.GITHUB_OUTPUT, "utf8"), "outcome=error\n");
      assert.equal(runStep("Enforce link checker result", context, { LINK_OUTCOME: "error" }).status, 1);
    });
  }
});

test("missing outcome cannot bypass checker validity gate", () => {
  const gate = spawnSync("bash", ["-e", "-o", "pipefail", "-c", stepRun("Enforce link checker result")], { env: { ...process.env, LINK_OUTCOME: "" }, encoding: "utf8" });
  assert.equal(gate.status, 1);
  assert.match(gate.stdout, /::error/);
});

test("summary write failure is visible but cannot change a successful or failed gate", async (t) => {
  assert.match(stepBody("Publish result to the job summary"), /if: always\(\)/);
  assert.match(stepBody("Publish result to the job summary"), /continue-on-error: true/);
  assert.match(stepBody("Enforce link checker result"), /if: always\(\)/);
  assert.doesNotMatch(stepBody("Enforce link checker result"), /continue-on-error: true/);
  for (const outcome of ["pass", "error"]) {
    await t.test(outcome, (t) => {
      const context = fixture(t, "globalThis.fetch = async () => new Response(null, {status: 200});");
      assert.equal(runStep("Check source and PDF links", context).status, 0);
      const gate = runStep("Enforce link checker result", context, { LINK_OUTCOME: outcome });
      assert.equal(gate.status, outcome === "pass" ? 0 : 1);
      const summary = spawnSync(process.execPath, ["scripts/report-links.mjs", "summary"], {
        cwd: context.dir, env: { ...context.env, GITHUB_STEP_SUMMARY: context.dir }, encoding: "utf8",
      });
      assert.equal(summary.status, 1);
      assert.match(summary.stdout, /::warning title=check:links summary/);
    });
  }
});

test("summary keeps diagnostics separate and escapes markup from source errors", () => {
  const summary = renderSummary({ outcome: "error", reason: "bad JSON" }, "<script>stdout</script>", "<script>stderr</script>");
  assert.match(summary, /Checker stdout \(JSON\)/);
  assert.match(summary, /Checker stderr \(runtime diagnostics\)/);
  assert.doesNotMatch(summary, /<script>/);
  assert.match(summary, /&lt;script&gt;/);
});
