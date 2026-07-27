# 別只問模型會不會做壞事：真正的風險，可能是誰能替你建立一個有權限的 Agent

> **本週主題：** AI Security  
> **研究期間：** 2026-07-20 — 2026-07-27  
> **重新執行：** 2026-07-27（Asia/Taipei）  
> **重跑結論：** 未發現更晚且足以取代本題的高可信度事件；已重新核實來源與限制。  
> **建議優先度：** P1 / 高討論度

## 標題／Hook

當惡意流程看起來像是員工本人建立、使用員工既有 connectors、沿用合法 identity，傳統「看帳號、看端點」的偵測邏輯就可能失焦。

## 切入點

把 AgentForger 揭露與 NIST／UK AISI 對 Kimi K3 的 cyber capability 評估放在同一張風險圖上：model capability 與 system authority 是兩個不同軸。企業既要測模型能做什麼，也要治理 Agent 能連到哪裡、用誰的權限、能否關閉核准、如何排程與留下 runtime evidence。

## 本週新聞支撐論點

- Zenity Labs 於 2026-07-23 揭露 AgentForger；研究者主張特定前提下可由 phishing link 驅動 Workspace Agent 建立流程並沿用既有 connectors。（原始研究者主張）
- The Hacker News 於 2026-07-24 報導問題已於 6 月 8 日修補、沒有已知濫用證據；未找到 OpenAI 對完整研究細節的獨立公開確認。（第三方報導）
- NIST／UK AISI 於 2026-07-23 發布 Kimi K3 初步評估：整體低於最前沿模型，但 safeguards 未阻止其嘗試 exploit development 或 offensive cyber operations；測試範圍有限。（官方初步評估）

## LinkedIn 草稿（繁體中文）

AI Agent 安全的盲點，不是模型答錯，而是 Agent 以合法身分做了不該做的事。

本週 AgentForger 揭露與 NIST／UK AISI 的 Kimi K3 初評共同提醒：model capability 與 system authority 必須分開看。能力較低，不代表 safeguards 足以阻擋 offensive cyber assistance；帳號合法，也不代表新建立的 Agent 應自動繼承所有 connectors 與排程權限。

企業需要 Agent inventory、connector allowlist、least privilege、獨立 approval policy，以及涵蓋建立、發布、權限變更與 tool calls 的 runtime detection。Prompt filter 只是其中一層。

你能否列出每個 Agent 的 owner、連線範圍與自動執行權限？

## Twitter / X 草稿（繁體中文）

1/4 AI Agent 風險不能只看模型能力；「合法身分 × connectors × 自動核准 × 排程」可能比單次 prompt 更危險。

2/4 Zenity Labs 本週揭露 AgentForger；研究者稱特定條件下，一個連結可驅動惡意 Agent 建立流程。媒體稱已修補、無已知濫用證據。

3/4 NIST／UK AISI 的 Kimi K3 初評顯示：能力低於前沿模型，不代表 safeguards 足以阻擋 offensive cyber assistance。

4/4 控制重點：Agent inventory、connector allowlist、least privilege、approval policy、schedule review、runtime telemetry。

## Blog 架構

### 從 AgentForger 到 Kimi K3：AI Security 必須同時治理能力與權限

- 建立 model cyber capability × deployed agent authority 雙軸評估。
- 記錄 owner、service identity、connected apps、data scope、approval mode 與 schedule。
- 對 Agent 建立、發布及權限擴張設定獨立核准。
- SOC 監看 Agent lifecycle 與 tool-call behavior。
- 模型或平台更新後重新做 adversarial evaluation。

## Newsletter／簡訊

Zenity Labs 於 7 月 23 日揭露 AgentForger，研究者主張特定條件下可透過單一連結建立並持續執行惡意 Workspace Agent；第三方報導稱問題已修補且無已知濫用證據。NIST／UK AISI 同日發布 Kimi K3 初步 cyber capability 評估，提醒企業應把模型能力與 Agent 權限、connectors、approval、schedule 分開治理。（來源：Zenity Labs、NIST／UK AISI，2026-07-23；The Hacker News，2026-07-24）

## Hashtags

#AgenticAI #AISecurity #IdentitySecurity #ZeroTrust #SOC

## 查核界線

- AgentForger 技術敘述主要來自發現者；不可視為廠商公開承認。
- Kimi K3 結果為 preliminary assessment，不能直接外推真實攻擊成功率。
- 「能力 × 權限」是本文分析框架。

## 完整來源

1. [AgentForger, Part 1: ChatGPT Cross-Site Agent Forgery](https://labs.zenity.io/p/agentforger-part-1-chatgpt-cross-site-agent-forgery) — Zenity Labs，2026-07-23
2. [ChatGPT AgentForger Flaw Could Deploy Rogue Workspace Agents via a Phishing Link](https://thehackernews.com/2026/07/chatgpt-agentforger-flaw-could-deploy.html) — The Hacker News，2026-07-24
3. [UK AISI / CAISI Preliminary Assessment of Kimi K3's Cyber Capabilities](https://www.nist.gov/news-events/news/2026/07/uk-aisi-caisi-preliminary-assessment-kimi-k3s-cyber-capabilities) — NIST / UK AISI，2026-07-23

