# ChatGPT 排程任務的已儲存指示補充

本文件是兩個排程任務的已儲存指示要附加的內容：AI 研究任務（`chatgpt-ai`，週五 08:00）與企業資安任務（`chatgpt-enterprise`，週六 01:00）。持續整合規則改變時，先改這裡，再把對應區塊貼回兩個任務。內容流程的完整約定見 `docs/source-workflow.md`。

以下的「週次日期」是該週週五的日期：讀物的 `week` 欄位寫成 `YYYY.MM.DD`，報告檔名寫成 `YYYY-MM-DD`。範例一律以第 40 週（`2026.10.02`）說明。程式碼格式標示的檔名、欄位、指令與檢查名稱必須原樣使用，不可翻譯。

## 區塊甲：AI Security 技術研究簡報（`chatgpt-ai`，週五 08:00）

```markdown
## 持續整合強制規則（2026-09-29 起，第 40 週起適用）

本儲存庫的主分支已受保護：只能透過拉取請求合併，必要檢查 `Build and data integrity` 必須通過，而且拉取請求必須與最新的主分支同步。違反以下三條規則時無法合併。

### 一、主題標籤（`topics`）
- 每篇讀物的 `topics` 只能使用 `app/data/readings.ts` 中 `TOPICS` 詞彙表的字串，拼法、空白與大小寫完全一致（例如 `OT / ICS`，不是 `OT/ICS`）。每次執行都先讀取當下的 `TOPICS`，不要依賴記憶中的清單。
- 優先沿用既有標籤。確實需要新標籤時，在同一個拉取請求中把它加進 `TOPICS`，並至少讓一篇讀物使用它（詞彙表不得有未使用的標籤）。不得修改已發布讀物的標籤。
- 同一篇讀物的標籤不可重複，也不可為空。

### 二、報告編號與版次
- 同一週的兩個任務共用一個報告編號（`report_id`），格式為 `AISEC-ARCH-<ISO 年>-W<ISO 週>-<週次日期 YYYYMMDD>`。日期取讀物的 `week`（週五），不可使用執行當天的日期。範例：`week` 為 `2026.10.02`，報告編號為 `AISEC-ARCH-2026-W40-20261002`。
- 版次以 `weeklyEditorials[<週次>].revision` 為準：本週第一個寫入的任務設為 1；若另一個任務已先寫入，就在現值上加 1。收據的 `revision` 必須等於寫入後的值，同一報告編號的版次不可重複。
- 收據的 `workflow` 填 `chatgpt-ai`（識別碼，不是中文標題）。收據檔名可以使用執行日期，例如 `2026-10-02-ai-w40.json`；只有報告編號綁定週五的週次日期。
- 收據與讀物必須互相對應：
  - `added_reading_ids` 與 `revised_reading_ids` 列出的讀物都必須存在，而且同屬一週。
  - 新增讀物的 `provenance.reviewedBy` 為 `chatgpt-ai`。
  - `provenance.evidence` 為 `https://github.com/chinchiang/WeeklySecurityResearch/blob/main/public/reading-runs/<收據檔名>`。
  - `provenance.checkedAt` 等於收據 `checked_at` 的日期。
  - 若填了 `inputReportId`，必須等於收據的 `input_report_id`。
  - `new_research_total` 加 `background_total` 等於新增篇數。
  - `issue_total` 介於新增篇數與該週總篇數之間。

### 三、報告快照必須重新產生並提交
- `public/reports/*.html` 是提交進儲存庫的快照，網站建置不會改寫。
- 修改讀物、編輯紀錄、更正或 `app/globals.css` 之後，執行 `npm run build:report -- <週次日期 YYYY-MM-DD>`，並把 `public/reports/<YYYY-MM-DD>.html` 一起提交。
- 若也修改了其他週次（例如為舊期加上更正），那一週同樣要重新產生並提交；不確定時執行 `npm run build:report` 全部重新產生。
- 未重新產生時，`tests/reports.test.mjs` 會失敗，並要求重新產生報告後提交。

### 提交前
- 依序執行 `npm ci`、`npm test`、`npm run lint`、`npm run typecheck`，全部通過才開拉取請求。
- 公開內容不得含內部 WORK 編號、Google Drive 或 Google 文件連結、私人姓名；持續整合會掃描。
```

## 區塊乙：企業資安綜合閱讀清單（`chatgpt-enterprise`，週六 01:00）

貼上區塊甲的全文，並做以下替換與補充：

- `workflow` 與 `provenance.reviewedBy` 改為 `chatgpt-enterprise`。收據檔名例如 `2026-10-03-enterprise-w40.json`。
- 報告編號仍使用週五的週次日期（第 40 週為 `AISEC-ARCH-2026-W40-20261002`），不是週六的執行日期。第 39 週曾誤寫為 `…20260926`，已於 2026-09-29 更正。
- 版次：週五的 AI 研究任務通常已寫入 1，本任務把編輯紀錄的版次改為 2，收據也填 2。若本週 AI 研究任務沒有發布，就填 1，並在收據的 `input_note` 說明原因。
- 在「提交前」加上：

```markdown
- 週五 AI 研究任務的拉取請求通常已先合併。開拉取請求前，先把最新的主分支合併進來（或在拉取請求頁面按「更新分支」），再以同步後的內容重新執行 `npm run build:report -- <週次日期 YYYY-MM-DD>` 與 `npm test`，讓報告快照包含兩個任務的全部讀物。不得以強制推送解決衝突。
```
