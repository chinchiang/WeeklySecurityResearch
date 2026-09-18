import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export function classifyResult(stdout, status) {
  try {
    const report = JSON.parse(stdout);
    const validFailure = (failure) => failure !== null && typeof failure === "object" &&
      typeof failure.url === "string" && failure.url.length > 0 &&
      ((Number.isInteger(failure.status) && failure.status >= 100 && failure.status <= 599) ||
        (typeof failure.error === "string" && failure.error.length > 0));
    if (!Number.isSafeInteger(report?.checked) || report.checked <= 0 ||
        !Array.isArray(report.failures) || report.failures.length > report.checked ||
        !report.failures.every(validFailure)) {
      throw new Error("Invalid checker JSON schema or empty URL set");
    }
    const checked = report.checked;
    const failures = report.failures;
    if (status === 0 && failures.length === 0) return { outcome: "pass", checked, failures };
    if (status === 1 && failures.length > 0) return { outcome: "unreachable", checked, failures };
    throw new Error(`Checker exit code ${status} disagrees with its JSON result`);
  } catch (error) {
    return { outcome: "error", reason: error instanceof Error ? error.message : String(error) };
  }
}

const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function renderSummary(result, stdout, stderr) {
  const titles = {
    pass: "連結檢查通過",
    unreachable: "⚠️ 有原始來源無法存取（僅提示，不阻擋 CI）",
    error: "❌ 連結檢查工具或結果契約失敗",
  };
  const title = titles[result.outcome] ?? titles.error;
  return `## ${title}\n\n<pre>${escapeHtml(JSON.stringify(result, null, 2))}</pre>\n\n` +
    `### Checker stdout (JSON)\n\n<pre>${escapeHtml(stdout)}</pre>\n\n` +
    `### Checker stderr (runtime diagnostics)\n\n<pre>${escapeHtml(stderr || "(empty)")}</pre>\n`;
}

function main() {
  const mode = process.argv[2];
  const stdout = readFileSync("links.json", "utf8");
  const stderr = readFileSync("links.stderr.log", "utf8");
  if (mode === "classify") {
    const result = classifyResult(stdout, Number(process.argv[3]));
    // Preserve both streams in the run log even if writing an output file fails.
    console.log("Checker stdout (JSON):\n" + stdout);
    console.error("Checker stderr (runtime diagnostics):\n" + (stderr || "(empty)"));
    writeFileSync("links-result.json", JSON.stringify(result, null, 2) + "\n");
    if (!process.env.GITHUB_OUTPUT) throw new Error("GITHUB_OUTPUT is not set");
    appendFileSync(process.env.GITHUB_OUTPUT, `outcome=${result.outcome}\n`);
    return;
  }
  if (mode === "summary") {
    if (!process.env.GITHUB_STEP_SUMMARY) throw new Error("GITHUB_STEP_SUMMARY is not set");
    const result = JSON.parse(readFileSync("links-result.json", "utf8"));
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, renderSummary(result, stdout, stderr));
    return;
  }
  throw new Error("Expected classify <exit-code> or summary");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    if (process.argv[2] === "summary") {
      console.log("::warning title=check:links summary::摘要未能寫入；來源判定不變，請查看獨立結果 gate 與 JSON/stderr log。");
    }
    process.exitCode = 1;
  }
}
