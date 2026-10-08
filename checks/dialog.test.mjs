import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { archiveReadings, currentReadings } from "../app/data/readings.ts";
import { pagesConfig } from "../scripts/pages-config.mjs";

// The summary dialog only exists after hydration, so the static HTML checks cannot see
// it. This drives the exported site in headless Chrome over the DevTools protocol.
// Without Chrome it is skipped (local machines, the ChatGPT task sandboxes); on GitHub
// Actions, where Chrome is preinstalled, a missing browser is a failure.
const { base } = pagesConfig();

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.CHROME_BIN,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ];
  return candidates.find((file) => file && existsSync(file));
}

const chromePath = findChrome();
if (!chromePath && process.env.GITHUB_ACTIONS) throw new Error("GitHub Actions 找不到 Chrome，無法檢查摘要視窗行為；請設定 CHROME_PATH");
const skip = chromePath ? false : "找不到 Chrome（可設定 CHROME_PATH）";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml" };

let server, chrome, profile, socket, origin;
let nextId = 0;
const pending = new Map();

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, (message) => (message.error ? reject(new Error(`${method}: ${message.error.message}`)) : resolve(message.result)));
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const { result, exceptionDetails } = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (exceptionDetails) throw new Error(`${expression}: ${exceptionDetails.text}`);
  return result.value;
}

async function waitFor(expression, message, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await sleep(50);
  }
  assert.fail(`${message}（等待逾時：${expression}）`);
}

async function press(key, { shift = false } = {}) {
  const code = { Tab: 9, Escape: 27 }[key];
  for (const type of ["keyDown", "keyUp"]) {
    await send("Input.dispatchKeyEvent", { type, key, code: key, windowsVirtualKeyCode: code, modifiers: shift ? 8 : 0 });
  }
}

// A real pointer click: on non-focusable text it moves focus to <body>, which a
// keydown listener on the dialog element would no longer hear.
async function clickOn(selector) {
  const { x, y } = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return { x: r.left + 5, y: r.top + 5 }; })()`);
  for (const type of ["mousePressed", "mouseReleased"]) {
    await send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 });
  }
}

async function open(page, hash = "") {
  await send("Page.navigate", { url: `${origin}${base}${page}${hash}` });
  // The buttons are already in the static HTML; clicks only work once React has hydrated them.
  await waitFor(`(() => { const button = document.querySelector(".card-actions button"); return !!button && Object.keys(button).some((key) => key.startsWith("__reactProps")); })()`, `${page} 未完成 hydration`);
}

before(async () => {
  if (skip) return;
  server = createServer((request, response) => {
    const url = decodeURIComponent(request.url.split("?")[0]);
    let file = url.startsWith(`${base}/`) ? path.join("out", url.slice(base.length)) : "";
    if (file && existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !existsSync(file)) return response.writeHead(404).end();
    response.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;

  profile = mkdtempSync(path.join(tmpdir(), "dialog-check-"));
  const args = ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--window-size=1280,900"];
  if (process.env.GITHUB_ACTIONS && process.platform === "linux") args.push("--no-sandbox");
  chrome = spawn(chromePath, [...args, "about:blank"], { stdio: "ignore" });

  // Chrome writes its chosen port to DevToolsActivePort once it is listening.
  const portFile = path.join(profile, "DevToolsActivePort");
  const deadline = Date.now() + 20_000;
  while (!existsSync(portFile) || !readFileSync(portFile, "utf8").includes("\n")) {
    if (Date.now() > deadline) throw new Error("Chrome 未啟動 DevTools");
    await sleep(100);
  }
  const port = readFileSync(portFile, "utf8").split("\n")[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket = new WebSocket(targets.find((target) => target.type === "page").webSocketDebuggerUrl);
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve);
    socket.addEventListener("error", reject);
  });
  await send("Page.enable");
});

after(async () => {
  socket?.close();
  if (chrome && chrome.exitCode === null) {
    const exited = new Promise((resolve) => chrome.once("exit", resolve));
    chrome.kill();
    await Promise.race([exited, sleep(5_000)]);
  }
  server?.close();
  // On Windows Chrome's helper processes can hold the profile a little longer; a
  // leftover temp directory is not a test failure.
  try {
    if (profile) rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {}
});

for (const [page, list, titleId] of [["/", currentReadings, "detail-title"], ["/archive/", archiveReadings, "archive-detail-title"]]) {
  const reading = list[1] ?? list[0];
  const title = `document.getElementById(${JSON.stringify(titleId)})?.textContent`;
  const closed = `!document.querySelector(".detail-modal")`;

  test(`${page}: a #reading- link opens the dialog with focus trapped inside and scrolling locked`, { skip }, async () => {
    await open(page, `#reading-${reading.id}`);
    await waitFor(`${title} === ${JSON.stringify(reading.title)}`, "帶 hash 進站應開啟該篇");
    assert.equal(await evaluate(`document.body.style.overflow`), "hidden", "開啟期間應鎖住頁面捲動");
    assert.equal(await evaluate(`document.activeElement?.className`), "modal-close", "焦點應在關閉按鈕");

    await press("Tab", { shift: true });
    assert.ok(await evaluate(`document.activeElement?.classList.contains("reading-button")`), "Shift+Tab 應從第一個跳到最後一個");
    assert.equal(await evaluate(`document.activeElement?.getAttribute("aria-pressed")`), "false");
    await press("Tab");
    assert.equal(await evaluate(`document.activeElement?.className`), "modal-close", "Tab 應從最後一個回到第一個");

    await press("Escape");
    await waitFor(closed, "Esc 應關閉視窗");
    assert.equal(await evaluate(`location.hash`), "", "關閉後應移除 hash");
    assert.equal(await evaluate(`document.body.style.overflow`), "", "關閉後應恢復捲動");
  });

  test(`${page}: a card opens the dialog and a backdrop click returns focus to that card`, { skip }, async () => {
    await open(page);
    await evaluate(`(() => { const button = document.querySelector(".card-actions button"); button.id = "dialog-trigger"; button.focus(); button.click(); })()`);
    await waitFor(`!!document.querySelector(".detail-modal") && location.hash.startsWith("#reading-")`, "卡片按鈕應開啟視窗並寫入 hash");
    await evaluate(`document.querySelector(".modal-backdrop").dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))`);
    await waitFor(closed, "點背景應關閉視窗");
    await waitFor(`document.activeElement?.id === "dialog-trigger"`, "焦點應回到開啟視窗的按鈕");

    await evaluate(`location.hash = "#reading-${reading.id}"`);
    await waitFor(`${title} === ${JSON.stringify(reading.title)}`, "hash 改變時應開啟該篇");
  });

  test(`${page}: after clicking the dialog text, Tab stays inside and Esc still closes`, { skip }, async () => {
    await open(page, `#reading-${reading.id}`);
    await waitFor(`${title} === ${JSON.stringify(reading.title)}`, "帶 hash 進站應開啟該篇");
    await clickOn(".detail-modal .detail-section p");
    await press("Tab");
    assert.ok(await evaluate(`!!document.activeElement?.closest(".detail-modal")`), "點內文後按 Tab，焦點仍應留在視窗內");
    await clickOn(".detail-modal .detail-section p");
    await press("Escape");
    await waitFor(closed, "點內文後按 Esc 仍應關閉視窗");
    // Opened from the URL there is no trigger button; focus goes to that reading's card instead of being lost.
    await waitFor(`!!document.activeElement?.closest("#reading-${reading.id}-card")`, "以網址開啟的視窗關閉後，焦點應回到該篇卡片");
  });
}

// Shared /#reading-<id> links outlive the week they were shared in.
test("a homepage link to an archived reading opens it on that week's page", { skip }, async () => {
  const old = archiveReadings[0];
  const slug = old.week.replaceAll(".", "-");
  await send("Page.navigate", { url: `${origin}${base}/#reading-${old.id}` });
  await waitFor(`location.pathname === ${JSON.stringify(`${base}/week/${slug}/`)} && location.hash === "#reading-${old.id}"`, "舊期的首頁分享連結應轉到該週固定網址");
  await waitFor(`!!document.getElementById("reading-${old.id}")`, "週次頁應有該篇");
});

test("an archive link to a current reading opens it on the homepage", { skip }, async () => {
  const current = currentReadings[0];
  await send("Page.navigate", { url: `${origin}${base}/archive/#reading-${current.id}` });
  await waitFor(`location.pathname === ${JSON.stringify(`${base}/`)} && document.getElementById("detail-title")?.textContent === ${JSON.stringify(current.title)}`, "本期讀物的歷史頁連結應在首頁開啟");
});
