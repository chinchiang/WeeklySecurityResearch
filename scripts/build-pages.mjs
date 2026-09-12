import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const env = { ...process.env, GITHUB_PAGES: "true", NEXT_PUBLIC_BASE_PATH: "/EveryWeekAIRead", NEXT_PUBLIC_SITE_URL: "https://chinchiang.github.io/EveryWeekAIRead", NEXT_TELEMETRY_DISABLED: "1" };
for (const args of [["--experimental-strip-types", "scripts/build-report.mjs"], ["node_modules/next/dist/bin/next", "build", "--webpack"]]) {
  const run = spawnSync(process.execPath, args, { stdio: "inherit", env });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
writeFileSync("out/.nojekyll", "");
