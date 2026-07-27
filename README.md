# EveryWeekAIRead

製造業 AI Security 每週必讀清單網站，聚焦：

- DSPM / DLP
- Data Lineage
- Data Detection and Response (DDR)
- AI System Threat Modeling
- Agent / MCP / Memory Security

## 線上網站

目前正式網站：<https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site>

每週社群內容：<https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/social-content/index.html>

- `/`：最新一期閱讀清單
- `/archive`：歷史閱讀資料庫
- `/social-content/index.html`：每週社群媒體／內容創意存檔

## 本機開發

需求：Node.js 22.13.0 以上版本。

```bash
npm ci
npm run dev
```

## 建置與驗證

```bash
npm run build
npm test
```

閱讀進度儲存在使用者瀏覽器的 Local Storage，不會傳送至外部服務。
