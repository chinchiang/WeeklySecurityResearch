# 每週社群內容創意存檔

正式網站：<https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/social-content/index.html>

主題涵蓋 AI Governance、AI Security、Electronic Manufacturing 與 OT／ICS Security。

## 結構

- `public/social-content/index.html`：最新一期與累積內容網站。
- `public/social-content/data/YYYY-MM-DD.json`：每週結構化資料，保留來源、日期、證據分類與所有管道草稿。
- `public/social-content/posts/YYYY-MM-DD/*.md`：當週每個選題的獨立 Markdown。

## 更新原則

1. 只追加新週次，不刪除或覆寫歷史週次。
2. 核心新聞以執行日前 7 天為限，舊資料只能作背景。
3. 官方／原始來源優先；明確區分已證實、研究者或廠商主張、第三方報導與分析。
4. 若無足夠新題材，建立 `NO-QUALIFIED-NEWS` 紀錄，不以常青內容補位。

目前最新週次：2026-08-10。主站 CTA 的 Ready 數量直接由最新一期 JSON 計算。

主持人輪值採 `hosts.json` 的 `iso-week-round-robin`：以 `anchorIsoWeek` 與 `anchorHostId` 為基準，按 ISO 週次差值對主持人陣列取餘數，不再每週手動修改 `currentHostId`。
