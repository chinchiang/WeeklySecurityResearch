# EveryWeekAIRead

製造業 AI Security 每週必讀清單網站，聚焦 DSPM／DLP、Data Lineage、DDR、AI System Threat Modeling、Agent／MCP／Memory Security。

## 線上網站

- [最新一期](https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/)
- [歷史資料庫](https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/archive)
- [Atom Feed](https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/feed.xml)
- [每週社群內容](https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site/social-content/index.html)

## 每週更新

所有讀物集中在 `app/data/readings.ts`。新增一期時只需新增 `Reading` 資料；最新週次、首頁 KPI、最高優先項目、歷史區間、固定週次網址、Feed 與 Sitemap 都會自動推導。

每筆資料必填 `week`、`rank`、`batch` 與 `evidenceLevel`。評鑑 Rubric、排名邏輯、Verified Sources 定義、來源範圍、入選漏斗與略過項目也由同一資料模組驅動。

## 驗證

```bash
npm ci
npm run test:data
npm run build
npm run lint
```

- `npm run test:data`：ID、排名、必填欄位、HTTPS URL、合法枚舉及 KPI 一致性。
- `npm run check:links`：檢查原始來源與 PDF 是否仍可達。
- `npm test`：正式建置與全部測試。

閱讀進度只儲存在使用者瀏覽器的 Local Storage，不會傳送至外部服務。
