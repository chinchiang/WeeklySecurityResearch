# CLAUDE.md

給在這個 repo 工作的 Claude Code session 的入門摘要。細節以 README.md 與 docs/source-workflow.md 為準；這裡只放每次都會用到、而且容易弄錯的事。

## 這個 repo 是什麼

- 正式名稱：`chinchiang/WeeklySecurityResearch`（2026-09-13 由 EveryWeekAIRead 改名，中途曾誤拼為 WeeklySecurityReaseach／WeeklySecurityReseach，這兩個名字只會出現在歷史紀錄裡）。
- 正式站：https://chinchiang.github.io/WeeklySecurityResearch/ ，GitHub Pages 是唯一部署目標。Next.js 靜態匯出，沒有伺服器、沒有 Worker，Pages 也無法設定 HTTP 回應標頭。
- 舊的 ChatGPT Sites Worker 部署與 D1 範本已在 #22 全部移除，不要再引入 vinext、wrangler、Cloudflare vite plugin 或 drizzle。
- 內容供稿與發布的契約在 `docs/source-workflow.md`：三個內容來源、兩個 GitHub 寫入者、provenance 欄位規則。改內容流程前先讀它。

## 指令（與 CI 完全相同）

```bash
npm ci
npm test          # 先靜態匯出到 out/，再跑 tests/ 與 checks/ 全部測試
npm run lint
npm run typecheck # 先 next typegen 再 tsc --noEmit
npm run audit     # high/critical 一律擋下，例外必須列在 scripts/audit-allowlist.json 並附到期日
npm run build:pages && npm run test:pages
npm run check:links  # 檢查原始來源可達性；CI 每週一自動跑，失效只出 warning
```

- Node 版本以 `.nvmrc` 為準，CI 也讀同一個檔。本機版本不同時，型別剝除等預設差異會在本機測不出來。
- 所有讀 `.ts` 的腳本都要 `node --experimental-strip-types`，否則在 CI 的 Node 22.13 會直接崩潰。
- `npm run build` 與 `npm run build:pages` 是同一件事。Pages base path 由 CI 的 `GITHUB_REPOSITORY` 推導（`scripts/pages-config.mjs`），程式裡的 fallback 只供本機使用。

## 資料模型

- 所有讀物在 `app/data/readings.ts`，來源標示在 `app/data/provenance.ts`。新增一期只需加 `Reading` 資料，週次、KPI、feed、sitemap 全部自動推導。
- 已發佈的項目不刪除、不改週次；CI 的 `scripts/check-history.mjs` 會擋。撤稿或更正用 `corrections` 欄位。
- `decision` 必須能由 `scores` 經 `deriveDecision()` 重現，改分數要同步改判定。
- 新文章必填 `provenance`；同一週同一研究只能有一筆（以 URL／DOI／arXiv 識別碼去重）。
- `public/social-content/` 只是歷史資料，網站沒有入口，`build:pages` 會把它從 `out/` 移除。

## 修改與合併

- 每個變更開 PR，squash 合併；main 的 push 會自動建置並部署 Pages。
- 分支自動刪除設定目前不生效，合併後 head 分支會留在遠端，需手動清。
- GitHub 網頁上的操作（刪分支、合併、改名）今天多次第一次沒生效，做完後重新整理確認。
- 這個 session 的 GitHub 寫入權限不含 repo 設定、分支刪除、Pages 設定；這些請使用者在 GitHub 上做。
- 沙箱的網路 proxy 封鎖 github.io 與大多數外部網站，無法從 session 內打開正式站或執行真實的連結檢查；以 CI 結果與部署 log 為準。
