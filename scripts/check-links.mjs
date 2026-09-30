import { readings } from "../app/data/readings.ts";

const urls = [...new Set(readings.flatMap((reading) => [reading.source, reading.pdf]).filter(Boolean))];
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (WeeklySecurityResearch-LinkChecker/1.0)";

const headers = {
  "User-Agent": USER_AGENT,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

// Checked a few at a time under one overall budget: one URL can take three
// 12-second requests, so a wide outage checked one by one (~150 URLs) used to
// outlast the job's 20-minute timeout, and a killed job reports nothing.
const CONCURRENCY = Number(process.env.LINK_CHECK_CONCURRENCY) || 6;
const BUDGET_MS = Number(process.env.LINK_CHECK_BUDGET_MS) || 12 * 60_000;
// A plain timer, not AbortSignal.timeout(): that one does not keep the event
// loop alive, so stalled requests could end the process with no JSON at all.
const budget = new AbortController();
const budgetTimer = setTimeout(() => budget.abort(new Error("link check time budget exceeded")), BUDGET_MS);
const deadline = budget.signal;
const requestSignal = () => AbortSignal.any([AbortSignal.timeout(12_000), deadline]);

async function check(url) {
  // Past the budget, a URL is reported as unchecked: a warning like any other
  // unreachable source, not a checker failure.
  if (deadline.aborted) return { url, error: "not checked: link check time budget exceeded" };
  try {
    // For DOI links, checking the 301/302 resolver redirect confirms handle validity
    if (url.includes("doi.org")) {
      const doiRes = await fetch(url, {
        method: "HEAD",
        redirect: "manual",
        headers,
        signal: requestSignal(),
      });
      if ([301, 302, 303, 307, 308].includes(doiRes.status) && doiRes.headers.get("location")) {
        return null; // DOI resolved successfully
      }
    }

    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers,
      signal: requestSignal(),
    });

    // Some sources serve valid files with GET but return 404 for HEAD; verify before classifying them.
    if (!response.ok && [400, 403, 404, 405].includes(response.status)) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: { ...headers, "Range": "bytes=0-1024" },
        signal: requestSignal(),
      });
    }

    // Status 403 on Cloudflare/Akamai/WAF indicates active host with bot challenge, not a broken link
    const isBotChallenge = response.status === 403 && (
      response.headers.get("server")?.toLowerCase().includes("cloudflare") ||
      response.headers.get("cf-ray") !== null ||
      url.includes("checkpoint.com")
    );

    if (!response.ok && response.status !== 405 && !isBotChallenge) {
      return { url, status: response.status };
    }
    return null;
  } catch (error) {
    return { url, error: error instanceof Error ? error.message : String(error) };
  }
}

const results = new Array(urls.length);
let next = 0;
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
  while (next < urls.length) {
    const index = next++;
    results[index] = await check(urls[index]);
  }
}));
clearTimeout(budgetTimer);
// Failures keep the order of the URL list, whatever order the requests finish in.
const failures = results.filter(Boolean);

// stdout is a machine-readable contract; Node/runtime diagnostics stay on stderr.
console.log(JSON.stringify({ checked: urls.length, failures }, null, 2));
process.exitCode = failures.length ? 1 : 0;

