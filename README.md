# 科技・資安・架構週讀

## 來源分工（2026-09-13）

三個內容來源、兩個網站更新流程：Claude 週二 15:00 提供 AI Security 與企業資安架構／產品安全兩部分週報，Google Doc 存於 Weekly Security Reports；ChatGPT 週五 08:00 接手 AI 研究，週六 01:00 接手企業資安研究。時間均為臺北。每個 ChatGPT 任務查核上游原始來源、另搜新研究、去重後合併同一網站，不整期覆蓋。

詳見 [供稿與發布契約](docs/source-workflow.md)。文章的原始研究連結與產製來源分開；歷史來源無證據者明示待確認。現有手動研究收據不代表到點自動觸發已驗證。公開版不包含私人 Drive 連結與內部 WORK 證據。

正式網址（GitHub Pages）：https://chinchiang.github.io/WeeklySecurityResearch/

網站改採淺色資訊介面，參考 DailySOCVitamin 的導覽與資訊密度，以及 CyberRegulationWatch 的淺色／紫色視覺語彙。保留搜尋、篩選、閱讀進度、歷史週次、Atom feed 與更正紀錄。

## GitHub Pages 發布

1. Repository Settings → Pages → Build and deployment → Source 選擇 **GitHub Actions**。
2. 此 repository 目前為 private。GitHub Pages 對 private repository 需要支援的付費方案；請保留原有可見性，不以改公開整個 repository 處理限制。
3. main 的 CI 通過測試、lint、typecheck、安全稽核與靜態輸出檢查後，才會由 Publish GitHub Pages 發布 `out`。
4. 首次設定尚未完成時，建置可成功但 Pages 部署會失敗。完成第 1 步後重跑該 workflow 的失敗工作即可。以實際 deployment 結果與公開網址驗證，不能把 commit 視為已發布。
5. `public/social-content/` 只作為歷史資料保留，`npm run build:pages` 會把它從 `out/` 移除，`npm run test:pages` 會確認它沒有出現在公開輸出中。

Node 版本以 `.nvmrc` 為準（CI 兩個 workflow 都讀同一個檔）；本機版本不同時，CI 才會表現出的差異（例如 22.18 之前不會預設剝除 TypeScript 型別）會在本機測不出來。本機 `npm ci` 後使用 `npm run build:pages`（`npm run build` 是同一件事）與 `npm run test:pages`。網站是 Next.js 靜態匯出，GitHub Pages 不支援自訂 HTTP 回應標頭。

每期自足 HTML 位於 `public/reports/YYYY-MM-DD.html`，由 `npm run build:report` 產生，與網頁共用資料和 CSS。原始來源優先，私人 WORK 證據不放入公開報告。

## 本次資料修訂

`AISEC-ARCH-2026-W37-20260911` r5（2026-09-13 更名及來源標示版），沿用 2026-09-12 r4 的研究查核，共 10 篇（深入審閱 5、選讀 5），含 1 篇 Architecture Spotlight、2 篇 Product Security。安裝研究的陽性時序與 MemSentry signed delta 已明文更正。

`package.json` 以 override 將 sharp（next 的選用依賴）固定在修補版 0.35.4，保留既有稽核門檻。來源：https://github.com/advisories/GHSA-rgj7-g3m4-5g8c 。

2026-09-13 起移除 ChatGPT Sites 的 Worker 建置（vinext、wrangler、Cloudflare vite plugin，以及從未使用的 D1／drizzle 範本），網站只以 Next.js 靜態匯出發布到 GitHub Pages，`scripts/audit-allowlist.json` 維持清空。未知週次由 `app/week/[week]/layout.tsx` 擋下，`app/not-found.tsx` 產生 Pages 的 `404.html`。


製造業科技、資安與架構閱讀網站，涵蓋 AI Security、企業架構、OT／ICS、產品安全、資料保護、AppSec 與供應鏈治理。

## 原 Sites 部署（已移除）

GitHub Pages 是唯一正式站。原本部署在 ChatGPT Sites 的 Worker 版本（`https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/`）已停止更新，其建置與工具鏈已於 2026-09-13 從 repo 移除。canonical、Atom feed 與 sitemap 一律指向 GitHub Pages 網址（`app/site-config.ts` 的 `SITE_URL`，CI 由 `GITHUB_REPOSITORY` 推導）。

## 每週更新

所有讀物集中在 `app/data/readings.ts`。新增一期時只需新增 `Reading` 資料；最新週次、首頁 KPI、最高優先項目、歷史區間、固定週次網址、Feed 與 Sitemap 都會自動推導。

每筆資料必填 `week`、`rank`、`batch`、`evidenceLevel` 與 `scores`。評鑑 Rubric、排名邏輯、Verified Sources 定義、來源範圍、入選漏斗與略過項目也由同一資料模組驅動。

## 評鑑方法

- `scores` 為三軸各 1–3 分：證據等級（35%）、製造業關聯（35%）、行動可落地性（30%）。
- 加權總分達 2.40 且無任一軸為 1 分者列為深入審閱，其餘列為選讀；`deriveDecision()` 實作此規則，測試確保每一筆的 `decision` 都能由分數重現。改動分數而未同步判定會讓測試失敗，使判定的改變成為明確決定。
- 每一筆的三軸分數與加權總分都顯示在卡片與詳細頁，可逐項覆核。
- 入選漏斗與略過清單以 `weeklyEditorials` 按週保存，新增週次不會覆寫既有紀錄；各週固定網址會顯示該週的漏斗。
- 已發佈項目不刪除。撤稿、數據更正或被後續研究取代時，於該筆加註 `corrections` 並在卡片、詳細頁與首頁「更正紀錄」顯示；撤稿項目不再進入「建議下一步」。
- Atom feed 涵蓋最近 `FEED_WEEKS`（3）期，漏看一週的訂閱者仍能補上。加註修訂的項目會同時更新 entry 的 `updated` 並在摘要標示，讓更正也送達訂閱者，而不是只有回站上的人才看得到。

## 驗證

```bash
npm ci
npm run test:data
npm run build
npm run lint
```

- `npm run test:data`：ID、排名、必填欄位、HTTPS URL、合法枚舉及 KPI 一致性。
- `npm run check:links`：檢查原始來源與 PDF 是否仍可達。`.github/workflows/check-links.yml` 每週一 09:00（台北）自動執行並把結果寫入 job summary；失效連結只以 warning 標示，不會讓 workflow 轉紅；但腳本本身無法執行時會轉紅，避免工具壞掉被誤判為連結全部正常。也可用 workflow_dispatch 手動觸發。
- 連結檢查的 stdout 固定為 `{ checked, failures }` JSON，Node Type Stripping 警告等診斷保留在 stderr。workflow 分別保存並顯示 `links.json`、`links.stderr.log`，獨立的結果 gate 驗證 JSON 與 exit code 一致性；摘要寫入失敗只提示，不會改寫來源檢查判定，也不會掩蓋工具錯誤。離線回歸測試：`node --test tests/check-links.test.mjs`（亦包含在 `npm test`）。
- `npm run audit`：依賴漏洞稽核（`.npmrc` 關閉了安裝時的自動稽核，因此需要明確執行）。
- `npm test`：先靜態匯出，再對 `out/` 跑全部測試：資料完整性、來源與歷史保存、各路由 canonical 與 base path、feed 涵蓋週數與連結、404 頁不索引且無 canonical、robots 與 sitemap 指向正式站。
- `npm run typecheck`：先執行 `next typegen` 重新產生 `.next/types`，再跑 `tsc --noEmit`。

## 安全基準

- 網站是 GitHub Pages 靜態輸出，無法設定自訂 HTTP 回應標頭（CSP、HSTS 等由 GitHub 決定）。安全性依賴內容本身：公開輸出不含私人 Drive 連結與 WORK 證據、不含原始碼與 source map（`checks/pages-export.test.mjs` 守護）。
- 靜態匯出只產生 `app/data/readings.ts` 既有週次的頁面；其他路徑由 Pages 回 `404.html`，該頁 `noindex` 且不宣告 canonical（`tests/static-export.test.mjs` 守護），避免任意字串被搜尋引擎收錄。
- 依賴漏洞以 `npm run audit`（`scripts/audit-gate.mjs`）把關：high／critical 一律擋下，除非列在 `scripts/audit-allowlist.json` 並附理由與 `reviewBy` 到期日（目前無例外）。

閱讀進度只儲存在使用者瀏覽器的 Local Storage，不會傳送至外部服務。
