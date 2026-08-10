import { readings } from "../app/data/readings.ts";

const urls = [...new Set(readings.flatMap((reading) => [reading.source, reading.pdf]).filter(Boolean))];
const failures = [];

for (const url of urls) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(12_000) });
    if (!response.ok && response.status !== 405) failures.push({ url, status: response.status });
  } catch (error) {
    failures.push({ url, error: error instanceof Error ? error.message : String(error) });
  }
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Checked ${urls.length} source/PDF links.`);
}
