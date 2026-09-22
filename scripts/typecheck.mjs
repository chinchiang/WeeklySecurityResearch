import { execSync } from "node:child_process";

process.env.NEXT_TELEMETRY_DISABLED = "1";

try {
  execSync("next typegen", { stdio: "inherit" });
  execSync("tsc --noEmit", { stdio: "inherit" });
} catch (error) {
  process.exit(error.status ?? 1);
}
