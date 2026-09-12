import { spawnSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
const env = { ...process.env, GITHUB_PAGES: "true", NEXT_PUBLIC_BASE_PATH: "/EveryWeekAIRead", NEXT_PUBLIC_SITE_URL: "https://chinchiang.github.io/EveryWeekAIRead", NEXT_TELEMETRY_DISABLED: "1" };
for (const args of [["--experimental-strip-types", "scripts/build-report.mjs"], ["node_modules/next/dist/bin/next", "build", "--webpack"]]) {
  const run = spawnSync(process.execPath, args, { stdio: "inherit", env });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
// public/social-content is retained as source data for the Worker build, but
// the site no longer links to it, so it must not ship on the public Pages URL.
rmSync("out/social-content", { recursive: true, force: true });
writeFileSync("out/.nojekyll", "");
