# AI Security 與架構閱讀清單

正式網址（GitHub Pages）：https://chinchiang.github.io/EveryWeekAIRead/

網站改採淺色資訊介面，參考 DailySOCVitamin 的導覽與資訊密度，以及 CyberRegulationWatch 的淺色／紫色視覺語彙。保留搜尋、篩選、閱讀進度、歷史週次、Atom feed 與更正紀錄。

## GitHub Pages 發布

1. Repository Settings → Pages → Build and deployment → Source 選擇 **GitHub Actions**。
2. 此 repository 目前為 private。GitHub Pages 對 private repository 需要支援的付費方案；請保留原有可見性，不以改公開整個 repository 處理限制。
3. main 的 CI 通過測試、lint、typecheck、安全稽核與靜態輸出檢查後，才會由 Publish GitHub Pages 發布 `out`。
4. 首次設定尚未完成時，建置可成功但 Pages 部署會失敗。完成第 1 步後重跑該 workflow 的失敗工作即可。以實際 deployment 結果與公開網址驗證，不能把 commit 視為已發布。
5. `public/social-content/` 只作為 Worker 建置的來源資料保留，`npm run build:pages` 會把它從 `out/` 移除，`npm run test:pages` 會確認它沒有出現在公開輸出中。

本機 `npm ci` 後使用 `npm run build:pages` 與 `npm run test:pages`。這是 GitHub Pages 靜態輸出，原本 Sites 的 Worker build 仍由 `npm run build` 保留。Pages 不執行 Worker，因此不能宣稱它具有 Worker 自訂的 HTTP 安全標頭。

每期自足 HTML 位於 `public/reports/YYYY-MM-DD.html`，由 `npm run build:report` 產生，與網頁共用資料和 CSS。原始來源優先，私人 WORK 證據不放入公開報告。

## 本次資料修訂

`AISEC-ARCH-2026-W37-20260911` r2，查核日期 2026-09-12，共 7 篇（深入審閱 3、選讀 4），含 1 篇 Architecture Spotlight、2 篇 Product Security。安裝研究的陽性時序與 MemSentry signed delta 已明文更正。

安全稽核發現 Miniflare 間接使用 sharp 0.35.2；本次以 override 統一至修補版 0.35.4，保留既有稽核門檻。來源：https://github.com/advisories/GHSA-rgj7-g3m4-5g8c 。

vinext 已升級至 1.0.0-beta.9，image-size 的兩筆 high 公告（GHSA-w3rx-r6r6-pgpr、GHSA-5p2g-fcmc-qvqq）隨之消失，`scripts/audit-allowlist.json` 已清空。vinext 1.x 將 metadata 改為串流，`generateMetadata()` 內的 `notFound()` 不再產生 HTTP 404，因此未知週次的檢查改在 `app/week/[week]/layout.tsx` 的 layout 元件本體執行，並新增 `app/not-found.tsx` 讓 404 頁不再繼承首頁 canonical。


製造業 AI Security 每週必讀清單網站，聚焦 DSPM／DLP、Data Lineage、DDR、AI System Threat Modeling、Agent／MCP／Memory Security。

## 原 Sites 部署（已停止同步）

GitHub Pages 是唯一持續更新的正式站。原本部署在 ChatGPT Sites 的 Worker 版本（`https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/`）不再同步內容；`npm run build` 仍保留 Worker 建置供本機測試與安全標頭驗證，其 canonical、Atom feed 與 sitemap 已改為指向 GitHub Pages 網址（`app/site-config.ts` 的 `SITE_URL` 預設值），避免兩個網址在搜尋引擎與訂閱端互相競爭。

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
- `npm run audit`：依賴漏洞稽核（`.npmrc` 關閉了安裝時的自動稽核，因此需要明確執行）。
- `npm test`：正式建置與全部測試，包含以實際 HTTP 回應驗證安全標頭、各路由 canonical 與未知週次回 404。
- `npm run typecheck`：先執行 `next typegen` 重新產生 `.next/types`，再跑 `tsc --noEmit`。vinext 建置也會寫入 `.next/types/routes.d.ts`，先重新產生可避免兩者交錯後型別不一致。

## 安全基準

- `worker/index.ts` 對所有回應加上 `X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`、HSTS 與一組 CSP（`frame-ancestors`／`base-uri`／`object-src`／`form-action`／`img-src`／`font-src`／`style-src`／`connect-src`）。因 RSC payload 與 client bootstrap 以 inline script 傳遞，CSP 刻意不設 `script-src` 與 `default-src`（後者是前者的後備，設了同樣會擋 hydration）；`tests/rendered-html.test.mjs` 有回歸測試守護。要收緊需改用 per-request nonce。
- `/week/<週次>` 只接受 `app/data/readings.ts` 既有的週次，其餘一律 404，避免任意字串以自我 canonical 被搜尋引擎收錄。
- 依賴漏洞以 `npm run audit`（`scripts/audit-gate.mjs`）把關：high／critical 一律擋下，除非列在 `scripts/audit-allowlist.json` 並附理由與 `reviewBy` 到期日（目前無例外）。

閱讀進度只儲存在使用者瀏覽器的 Local Storage，不會傳送至外部服務。
