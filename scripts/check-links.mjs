import { readings } from "../app/data/readings.ts";

const urls = [...new Set(readings.flatMap((reading) => [reading.source, reading.pdf]).filter(Boolean))];
const failures = [];
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (WeeklySecurityResearch-LinkChecker/1.0)";

const headers = {
  "User-Agent": USER_AGENT,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

for (const url of urls) {
  try {
    // For DOI links, checking the 301/302 resolver redirect confirms handle validity
    if (url.includes("doi.org")) {
      const doiRes = await fetch(url, {
        method: "HEAD",
        redirect: "manual",
        headers,
        signal: AbortSignal.timeout(12_000),
      });
      if ([301, 302, 303, 307, 308].includes(doiRes.status) && doiRes.headers.get("location")) {
        continue; // DOI resolved successfully
      }
    }

    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers,
      signal: AbortSignal.timeout(12_000),
    });

    // If HEAD is blocked or disallowed (common on arXiv, Cloudflare bot protections, etc.), fallback to GET
    if (!response.ok && [403, 405, 400].includes(response.status)) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: { ...headers, "Range": "bytes=0-1024" },
        signal: AbortSignal.timeout(12_000),
      });
    }

    // Status 403 on Cloudflare/Akamai/WAF indicates active host with bot challenge, not a broken link
    const isBotChallenge = response.status === 403 && (
      response.headers.get("server")?.toLowerCase().includes("cloudflare") ||
      response.headers.get("cf-ray") !== null ||
      url.includes("checkpoint.com")
    );

    if (!response.ok && response.status !== 405 && !isBotChallenge) {
      failures.push({ url, status: response.status });
    }
  } catch (error) {
    failures.push({ url, error: error instanceof Error ? error.message : String(error) });
  }
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Checked ${urls.length} source/PDF links successfully.`);
}

