# EveryWeekAIRead

製造業 AI Security 每週必讀清單網站，聚焦 DSPM／DLP、Data Lineage、DDR、AI System Threat Modeling、Agent／MCP／Memory Security。

## 線上網站

- [最新一期](https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/)
- [歷史資料庫](https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/archive)
- [Atom Feed](https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/feed.xml)
- [每週社群內容](https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/social-content/index.html)

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
- `npm run check:links`：檢查原始來源與 PDF 是否仍可達。
- `npm run audit`：依賴漏洞稽核（`.npmrc` 關閉了安裝時的自動稽核，因此需要明確執行）。
- `npm test`：正式建置與全部測試，包含以實際 HTTP 回應驗證安全標頭、各路由 canonical 與未知週次回 404。

## 安全基準

- `worker/index.ts` 對所有回應加上 `X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`、HSTS 與一組 CSP（`frame-ancestors`／`base-uri`／`object-src`／`form-action`）。因 RSC payload 以 inline script 傳遞，CSP 未限制 `script-src`；要加上需改用 per-request nonce。
- `/week/<週次>` 只接受 `app/data/readings.ts` 既有的週次，其餘一律 404，避免任意字串以自我 canonical 被搜尋引擎收錄。
- 依賴漏洞目前未全數修復；`npm audit fix` 會連帶升級 esbuild／miniflare 等建置鏈套件，需另行評估後再處理。

閱讀進度只儲存在使用者瀏覽器的 Local Storage，不會傳送至外部服務。
