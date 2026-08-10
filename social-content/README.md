# Weekly Social Content

目前最新週次：2026-08-10。

網站資料位於 `public/social-content/data/`。首頁 CTA 的 Ready 數量直接由最新一期 JSON 中 `status === "Ready"` 的項目計算，不再手動填寫。

主持人輪值採 `hosts.json` 的 `iso-week-round-robin`：以 `anchorIsoWeek` 與 `anchorHostId` 為基準，按 ISO 週次差值對主持人陣列取餘數；新增主持人後不需每週修改 `currentHostId`。

每期內容應保留來源、證據邊界與 `NO-QUALIFIED-NEWS` 狀態，避免為湊數而發布缺乏查核的社群貼文。
