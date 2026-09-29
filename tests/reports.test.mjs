import assert from "node:assert/strict";
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
      `${reportPath(week)} is out of date; run npm run build:report and commit the result`,
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
