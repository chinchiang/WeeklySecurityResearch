import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { allWeeks } from "../app/data/readings.ts";
import { renderReport, reportPath } from "../scripts/build-report.mjs";

// Windows checkouts may turn LF into CRLF; the content is what must match.
const normalize = (text) => text.replaceAll("\r\n", "\n");

test("every week has exactly one committed report", () => {
  const expected = allWeeks.map((week) => `${week.replaceAll(".", "-")}.html`).sort();
  assert.deepEqual(readdirSync("public/reports").filter((name) => name.endsWith(".html")).sort(), expected);
});

// The site build no longer regenerates reports, so a data, CSS or template
// change that is not followed by `npm run build:report` fails here instead of
// silently rewriting every historical report on the next deploy.
test("committed reports match what the generator renders from current data", () => {
  for (const week of allWeeks) {
    assert.ok(existsSync(reportPath(week)), `${week}: missing report`);
    assert.ok(
      normalize(readFileSync(reportPath(week), "utf8")) === renderReport(week),
      `${reportPath(week)} 與目前資料不一致：請執行 npm run build:report -- ${week.replaceAll(".", "-")} 並提交產生的檔案（run npm run build:report and commit the result）。規則見 docs/run-instructions.md`,
    );
  }
});

test("reports do not carry run evidence that belongs to another week", () => {
  for (const week of allWeeks) {
    const html = renderReport(week);
    for (const [, date] of html.matchAll(/reading-runs\/(\d{4}-\d{2}-\d{2})/g)) {
      const next = allWeeks.find((w) => w > week);
      assert.ok(!next || date < next.replaceAll(".", "-"), `${week} report cites run receipt ${date} of a later week`);
    }
  }
});

// A Saturday run date (or any date without readings) used to write nothing and exit 0.
test("build:report rejects a week without readings and points at its Friday", () => {
  const run = (arg) => spawnSync(process.execPath, ["--experimental-strip-types", "scripts/build-report.mjs", arg], { encoding: "utf8" });
  const friday = allWeeks[0];
  const saturday = new Date(Date.parse(`${friday.replaceAll(".", "-")}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
  const wrongDay = run(saturday);
  assert.equal(wrongDay.status, 1);
  assert.match(wrongDay.stderr, new RegExp(`build:report -- ${friday.replaceAll(".", "-")}`));
  const unknown = run("1999-01-01");
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /找不到週次「1999-01-01」/);
});
