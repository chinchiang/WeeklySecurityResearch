# 每週社群內容

本目錄是社群內容的唯一正式資料來源；歷史期別只追加、不覆寫。

## 結構

- `data/YYYY-MM-DD.json`：每週結構化資料。
- `data/latest.json`：建置時依日期檔名自動產生的最新期別 manifest。
- `posts/YYYY-MM-DD/*.md`：各週貼文草稿。
- `index.html`、`archive.html`：最新一期與歷史內容網站。
- `assets/`：社群網站共用圖像。

首頁 CTA 的週次與 Ready 數量由 `scripts/generate-social-manifest.mjs` 掃描 `data/` 後自動推導，不需修改首頁程式碼。

主持人輪值採 `data/hosts.json` 的 `iso-week-round-robin`：以 `anchorIsoWeek` 與 `anchorHostId` 為基準，按 ISO 週次差值對主持人陣列取餘數。

每期內容應保留來源、證據邊界與 `NO-QUALIFIED-NEWS` 狀態，避免為湊數而發布缺乏查核的社群貼文。
