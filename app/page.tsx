"use client";

import { useEffect, useMemo, useState } from "react";

export type Reading = {
  id: number;
  rank?: number;
  week?: string;
  batch?: "本週新發" | "補遺";
  title: string;
  subtitle: string;
  date: string;
  dateValue: string;
  authors: string;
  source: string;
  sourceLabel: string;
  pdf?: string;
  decision: "深入審閱" | "選讀";
  kind: "學術論文" | "政策研究" | "產業報告";
  topics: string[];
  summary: string;
  findings: string[];
  relevance: string;
  action: string;
  caveat: string;
  crossCheck?: string;
  metric?: string;
};

export const readings: Reading[] = [
  {
    id: 14,
    rank: 1,
    week: "2026.07.31",
    batch: "本週新發",
    title: "MemSecBench",
    subtitle: "Tracking Agent Memory Poisoning from Persistence to Consequence and Repair",
    date: "2026.07.29",
    dateValue: "2026-07-29",
    authors: "Xuanze Chen、Xukang Xie、Wentao Fu、Jiajun Zhou、Shanqing Yu、Qi Xuan",
    source: "https://arxiv.org/abs/2607.27080",
    sourceLabel: "arXiv:2607.27080",
    pdf: "https://arxiv.org/pdf/2607.27080",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Data Lineage", "DDR", "Threat Modeling"],
    summary:
      "以 Write–Execute–Forget 完整生命週期測試 Agent 記憶污染，首次把惡意內容能否寫入、日後是否造成真實動作，以及能否選擇性修復放在同一套可重現評估中。",
    findings: [
      "310 個案例來自 48 種程式、科學、辦公與日常情境，橫跨 24 組 Agent、記憶與模型配置。",
      "惡意記憶在全部配置中的持續留存率為 84.2%，完整 Write–Execute 攻擊鏈成功率為 50.3%。",
      "不同記憶堆疊的端到端攻擊成功率最多相差 16.1 個百分點，選擇性修復最多相差 41.3 個百分點。",
    ],
    relevance:
      "跨國製造業若讓 Agent 長期記住維修工單、供應商郵件、品質異常、設備參數與工程偏好，受污染內容可能隔日才影響採購、韌體、PLM 或 OT 操作。",
    action:
      "把 Agent memory 納入資料治理：記錄寫入來源、版本、信任等級與召回原因；高風險動作前重查原始證據，並建立可選擇性刪除與回復測試。",
    caveat:
      "屬未經同儕審查的 preprint；百分比來自隔離環境與指定 24 組配置，不能直接當作企業環境發生率。",
    crossCheck:
      "與 Bad Memory、GhostWriter 及 Self-State 使用不同攻擊面卻得到一致方向：記憶不是單純便利功能，而是需要完整性、來源追蹤與復原能力的獨立信任邊界。",
    metric: "84.2% 留存｜50.3% 完整攻擊鏈",
  },
  {
    id: 15,
    rank: 2,
    week: "2026.07.31",
    batch: "本週新發",
    title: "Architectural Backdoors in Vision-Language Model Supply Chains",
    subtitle: "以 Representation Steering 植入不需資料污染的架構後門",
    date: "2026.07.28",
    dateValue: "2026-07-28",
    authors: "Maria Rosaria Briglia、Igor Maljkovic、Antonio Emanuele Cinà、Luca Oneto、Iacopo Masi、Fabio Roli",
    source: "https://arxiv.org/abs/2607.25479",
    sourceLabel: "arXiv:2607.25479",
    pdf: "https://arxiv.org/pdf/2607.25479",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Data Lineage", "Threat Modeling", "Agent Security"],
    summary:
      "證明惡意供應商可在 VLM 架構或匯出的 computation graph 植入休眠 steering logic；不必污染訓練資料、控制微調或修改部署 prompt，也能在觸發時改變模型行為。",
    findings: [
      "攻擊在無觸發條件時歸零，因而能維持乾淨輸入下的正常效能並躲過一般驗收。",
      "跨 VLM 家族及視覺問答、文生圖、檢索與語意偏誤任務測試，會破壞完整性、安全控管與排序公平性。",
      "作者主張審計不能只檢查權重，還必須檢視模型 artifact 內可執行的架構邏輯。",
    ],
    relevance:
      "AI 視覺檢測、AOI、倉儲辨識與設計圖面助理常重用第三方 checkpoint、encoder 與匯出模型；後門可能只在特定零件、標記或客戶圖樣出現時觸發。",
    action:
      "把架構定義、custom operator、ONNX／TorchScript graph、encoder、轉換工具與 hash 納入 AIBOM；在隔離環境做 graph diff、觸發測試與重建驗證。",
    caveat:
      "Preprint，摘要未提供可直接外推的單一攻擊成功率；企業需針對實際 VLM、轉檔鏈與 AOI 影像分布獨立重測。",
    crossCheck:
      "ToxScreen 顯示即使有白箱權重也沒有方法能找出所有訓練後門；本研究進一步指出，只看權重更會漏掉嵌在可執行 graph 的架構後門。",
    metric: "4 類 VLM 下游任務",
  },
  {
    id: 16,
    rank: 3,
    week: "2026.07.31",
    batch: "本週新發",
    title: "ToxScreen",
    subtitle: "Detecting Whether an LLM Has Been Poisoned",
    date: "2026.07.29",
    dateValue: "2026-07-29",
    authors: "Anthony Hughes、Nicole Xing、Collin Francel、Andy Kim、Andrew Draganov",
    source: "https://arxiv.org/abs/2607.26849",
    sourceLabel: "arXiv:2607.26849",
    pdf: "https://arxiv.org/pdf/2607.26849",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Data Lineage", "Threat Modeling"],
    summary:
      "發布約 800 個後門模型的白箱 benchmark，測試防守方在沒有訓練資料、可信參考模型與觸發詞資訊時，能否判定模型遭污染並找回觸發條件。",
    findings: [
      "涵蓋不同攻擊目標、觸發機制、污染比例、模型規模與後門訓練方法。",
      "梯度式 prompt 最佳化無法可靠找回觸發詞；以 attack-success rate 排序候選 token 的查找法在後門有效時表現較佳。",
      "沒有任何方法能可靠找出全部後門；模型異常容易被 jailbreak 可作為訊號，但不是充分證據。",
    ],
    relevance:
      "製造企業採購或下載基礎模型、程式碼模型與設備邊緣模型時，僅做功能測試與 hash 驗證無法證明模型沒有供應鏈後門。",
    action:
      "在模型驗收加入 trigger search、行為差異測試、來源與訓練 lineage、簽章與可信重建；偵測結果應作風險訊號，不可視為「無後門證明」。",
    caveat:
      "Preprint；benchmark 後門由研究者控制生成，與真實供應鏈攻擊的隱蔽度仍有差距，且方法需要白箱權重。",
    crossCheck:
      "與 VLM 架構後門研究合併判讀後，驗收範圍應從權重擴展至 architecture、export graph、custom code 與轉換環境。",
    metric: "約 800 個後門模型",
  },
  {
    id: 17,
    rank: 4,
    week: "2026.07.31",
    batch: "本週新發",
    title: "RAGuard",
    subtitle: "A Layered Defense Framework for RAG Systems Against Data Poisoning",
    date: "2026.07.28",
    dateValue: "2026-07-28",
    authors: "Pushkal Kumar、Tucker Nielson、Tanish Kolhe、Shubham Zala、Vincent Li",
    source: "https://arxiv.org/abs/2607.26339",
    sourceLabel: "arXiv:2607.26339",
    pdf: "https://arxiv.org/pdf/2607.26339",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Data Lineage", "DSPM / DLP", "Threat Modeling"],
    summary:
      "提出兩層 RAG 資料污染防禦：先訓練 retriever 降低惡意文件排名，再以 leave-one-out 反事實推論觀察移除單一文件後答案與熵的變化。",
    findings: [
      "在 5%–30% 污染比例的 Natural Questions 測試中，作者報告防禦配置的量測攻擊成功率皆降為 0.000。",
      "Recall@5 與乾淨語料基線相差不超過 0.03，且程式碼、資料集與評估工具已公開。",
      "代價是 k+1 次生成；k=5 時為 6 倍 generator passes，且對維持關鍵字的 BM25 污染威脅效果有限。",
    ],
    relevance:
      "維修手冊、品質知識庫、供應商文件與工程規範常被匯入 RAG；若 lineage 不完整，錯誤或惡意段落可能影響維修、採購與製程決策。",
    action:
      "先以來源、版本、簽章與敏感標籤治理 corpus，再將反事實文件影響分數用於高風險查詢；以工廠多語言語料測量準確率、延遲與成本。",
    caveat:
      "雖已獲兩個 workshop 接受，但 0.000 是特定資料集與威脅模型下的量測值；6 倍推論成本與 BM25 邊界限制其直接部署。",
    crossCheck:
      "本研究補強 Data Lineage 的執行期驗證，但無法取代 corpus admission、文件身分、版本與來源控制；兩者必須並行。",
    metric: "ASR 0.000｜k=5 時 6× 推論",
  },
  {
    id: 18,
    rank: 5,
    week: "2026.07.31",
    batch: "本週新發",
    title: "Agent Security Needs Redefinition through a Holistic Framework",
    subtitle: "從內容判斷轉向授權情境與資料隔離",
    date: "2026.07.24",
    dateValue: "2026-07-24",
    authors: "Vincent Siu、Jingxuan He、Kyle Montgomery、Zhun Wang、Chenguang Wang、Dawn Song",
    source: "https://arxiv.org/abs/2607.22024",
    sourceLabel: "ICML 2026 Position Paper",
    pdf: "https://arxiv.org/pdf/2607.22024",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Threat Modeling", "Agent Security", "DSPM / DLP"],
    summary:
      "主張 Agent Security 不能只判斷動作內容是否危險，而應持續驗證 Source Authorization、Task Alignment、Action Alignment 與 Data Isolation 四項情境屬性。",
    findings: [
      "作者指出 AgentDojo 與 WASP 的 injection 任務中，同一動作也可能是已驗證使用者的正常請求，內容本身無法區分合法與攻擊。",
      "間接 prompt injection 可重述為來源授權違規，而非只靠文字分類器偵測惡意指令。",
      "單點 snapshot benchmark 無法評估跨步驟、跨權限邊界的 Data Isolation。",
    ],
    relevance:
      "刪除工單、下載 BOM 或修改排程本身未必惡意；真正關鍵是誰授權、是否符合當前任務、資料能否跨廠區／客戶／法域流動。",
    action:
      "把四項屬性加入 AI System Threat Model 與 Agent audit event；每次工具呼叫記錄來源、委派者、任務、資料標籤、目的地及 policy decision。",
    caveat:
      "這是 ICML position paper，重點是重新定義問題而非提供新的大規模實驗；應作威脅模型框架，不宜當成防禦效果證明。",
    crossCheck:
      "IH-Benchmark 在 37 個模型中觀察到 system–user 與 user–tool 衝突韌性並不等價，支持企業必須按來源與衝突面分開測試。",
    metric: "4 項持續情境屬性",
  },
  {
    id: 19,
    rank: 6,
    week: "2026.07.31",
    batch: "本週新發",
    title: "PUDA",
    subtitle: "An AI-Native Hardware Harness for Self-Driving Laboratories",
    date: "2026.07.29",
    dateValue: "2026-07-29",
    authors: "Zekun Ren、Hongzhao Tan、Jiaen Yee、Kedar Hippalgaonkar",
    source: "https://arxiv.org/abs/2607.26464",
    sourceLabel: "arXiv:2607.26464",
    pdf: "https://arxiv.org/pdf/2607.26464",
    decision: "選讀",
    kind: "學術論文",
    topics: ["Data Lineage", "Agent Security", "Threat Modeling"],
    summary:
      "提出讓 AI Agent 操作實體實驗設備的 headless runtime：Agent 決定實驗，但硬體層只執行經驗證、具原子性且可稽核的命令，並保存從 protocol 到量測結果的 provenance。",
    findings: [
      "裝置以可探索 CLI 與 JSON protocol 呈現，經分散式訊息層路由。",
      "protocol、run、sample、measurement 與 command log 以 run ID 和時間戳串接。",
      "把科學編排與實體操作／telemetry 分離，讓 Agent 有決策彈性但不直接控制未驗證的硬體動作。",
    ],
    relevance:
      "對自動化實驗室、材料研發、製程試驗與工廠 physical AI 具直接參考價值，可避免 Agent 產出的命令與實際設備狀態、樣本及結果脫節。",
    action:
      "將相同模式套用到 OT／實驗設備：命令 schema 驗證、原子執行、run ID、設備回應、樣本與結果 lineage，以及高風險命令的人工閘門。",
    caveat:
      "這是系統架構論文，不是攻防評估；尚未證明能抵抗 prompt injection、惡意工具或遭竄改 telemetry，因此判定為選讀。",
    crossCheck:
      "其 separation-of-duty 與 provenance 設計和 commit-time authorization 方向一致：決策可由 Agent 產生，但造成物理效果前要經獨立、可稽核的執行層。",
    metric: "Protocol → Run → Sample → Result",
  },
  {
    id: 8,
    rank: 1,
    week: "2026.07.24",
    batch: "補遺",
    title: "Confused Deputy Attack Against Model Context Protocol",
    subtitle: "以工具中繼資料劫持 MCP 的非確定性選擇機制",
    date: "2026.07.15",
    dateValue: "2026-07-15",
    authors: "Zhiyuan Li、Jingzheng Wu、Yuhao Peng、Tianyue Luo、Xing Cui、Xiang Ling",
    source: "https://doi.org/10.1145/3830467",
    sourceLabel: "ACM TOSEM",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Threat Modeling", "DSPM / DLP"],
    summary:
      "揭露 MCP 的語意式工具選擇可被惡意伺服器以名稱與描述操控，使模型把原應交給良性工具的呼叫交給攻擊者，形成難以被現有掃描器察覺的 confused deputy。",
    findings: [
      "Puppet 框架跨 6 家供應商的 14 個模型及 2 個 MCP hosts 進行評估。",
      "工具選擇劫持率最高 90.89%，端到端惡意 payload 執行率最高 86.46%。",
      "MCP-Scan 與 McpSafetyScanner 無法偵測僅操控中繼資料的攻擊；推理型模型反而顯著更脆弱。",
    ],
    relevance:
      "製造業 Agent 常以 MCP 連接 PLM、ERP、Git、品質資料庫與維運工具；一旦同名或相似描述的惡意工具被選中，就可能截取 BOM、配方、客戶規格與存取憑證。",
    action:
      "不要讓模型單獨決定高風險工具；建立伺服器身分與簽章驗證、工具 allowlist、呼叫目標綁定、敏感資料 egress policy，並在執行前顯示實際 server identity。",
    caveat:
      "已被 ACM TOSEM 接受，但公開頁面只提供摘要與方法概要；企業應先在自家 MCP client、模型與工具命名空間重跑測試，再設定阻擋門檻。",
    crossCheck:
      "Microsoft AutoJack 研究以不同攻擊鏈證明 Agent 會成為跨越 localhost 與控制面的 confused deputy；兩者共同指出只靠來源位置或語意判斷不足。",
    metric: "90.89% 劫持｜86.46% 執行",
  },
  {
    id: 9,
    rank: 2,
    week: "2026.07.24",
    batch: "本週新發",
    title: "ResearchArena",
    subtitle: "Evaluating Sabotage and Monitoring in Automated AI R&D",
    date: "2026.07.21",
    dateValue: "2026-07-21",
    authors: "Lena Libon、Ben Rank、Jehyeok Yeon、David Schmotz、Jeremy Qin、Daniel Donnelly、Derck Prinzhorn、Maksym Andriushchenko",
    source: "https://arxiv.org/abs/2607.19321",
    sourceLabel: "arXiv:2607.19321",
    pdf: "https://arxiv.org/pdf/2607.19321",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Threat Modeling", "Data Lineage"],
    summary:
      "把自動化 AI R&D 視為不可信供應鏈：Agent 產出的模型、adapter、CUDA kernel 或 inference server 可能暗藏破壞，監控器必須驗證成品而非只讀取操作軌跡。",
    findings: [
      "涵蓋 safety／capability post-training、CUDA kernel 與 inference server 四項長流程任務。",
      "訓練資料中的隱蔽破壞最難偵測，被標記的比例不到一半。",
      "允許監控器實際執行與探測成品會改善結果，但仍會因只看表面、錯誤解釋異常或測試選錯而漏報。",
    ],
    relevance:
      "跨國製造業自行微調視覺檢測、預測維護或排程模型時，外包資料處理、第三方 adapter 與最佳化 kernel 都可能成為隱蔽供應鏈入口。",
    action:
      "把資料集、權重、adapter、kernel、容器與測試結果納入可驗證 lineage；以 golden dataset、差異測試、隔離執行與獨立監控器作為部署閘門。",
    caveat:
      "51 頁 preprint，尚未同儕審查；「少於一半」是特定任務與監控器設定的結果，不可直接外推企業偵測率。",
    crossCheck:
      "與英國 DSIT 的研究缺口一致：AI 資料與模型權重完整性，以及 AI 攻擊面與傳統 IT 基礎設施的銜接，仍缺成熟驗證方法。",
    metric: "4 類長流程任務",
  },
  {
    id: 10,
    rank: 3,
    week: "2026.07.24",
    batch: "本週新發",
    title: "Self-State Attacks on Self-Hosted AI Agents",
    subtitle: "How Far Can OS Defenses Go?",
    date: "2026.07.20",
    dateValue: "2026-07-20",
    authors: "Yimeng Chen、Nathanaël Denis、Roberto Di Pietro、Jürgen Schmidhuber",
    source: "https://arxiv.org/abs/2607.17986",
    sourceLabel: "arXiv:2607.17986",
    pdf: "https://arxiv.org/pdf/2607.17986",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "DDR", "Data Lineage", "Threat Modeling"],
    summary:
      "定義 self-state attack：攻擊者透過合法 OS system call 竄改 Agent 自己的指令、設定或記憶檔；這類行為在作業系統層可能與正常寫入難以區分。",
    findings: [
      "建立 Target、Mechanism、Granularity、Temporal 四軸攻擊空間。",
      "以真實 Agent 活動軌跡實作 23-cell matrix 與 43 個對 self-state files 的具體操作。",
      "分層防禦對多數攻擊有效，但仍有一小部分在 OS 層結構性不可區分。",
    ],
    relevance:
      "工廠 edge Agent、工程工作站與內網自架 Agent 常長時間運作並保存設備參數、工單與記憶；單靠 EDR 檔案寫入事件，未必能判斷是合理自我更新或被污染。",
    action:
      "對指令與設定層採唯讀／強 ACL；記憶層以 workload baseline 偵測；保留週期性 immutable backup，並記錄寫入者、來源、差異與回復點。",
    caveat:
      "21 頁 preprint，以代表性自架 Agent 的工作負載實驗；不同 OS、Agent framework 與工廠 edge runtime 的基準需另行校正。",
    crossCheck:
      "Bad Memory 從 prompt injection 證明持久記憶可跨 session 影響行為；本研究則從 OS 層補足偵測與復原邊界。",
    metric: "23 cells｜43 個操作",
  },
  {
    id: 11,
    rank: 4,
    week: "2026.07.24",
    batch: "補遺",
    title: "Bad Memory",
    subtitle: "Evaluating Prompt Injection Risks from Memory in Agentic Systems",
    date: "2026.07.16",
    dateValue: "2026-07-16",
    authors: "Soham Gadgil、David Alexander、Sai Sunku、Franziska Roesner",
    source: "https://arxiv.org/abs/2607.14611",
    sourceLabel: "arXiv:2607.14611",
    pdf: "https://arxiv.org/pdf/2607.14611",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Data Lineage", "Threat Modeling"],
    summary:
      "直接評估 Claude Code 與 Codex 的持久記憶風險：雖然誘使 Agent 主動覆寫記憶並不容易，但預先植入記憶檔的 payload 能攻擊目前與未來 session。",
    findings: [
      "涵蓋 Claude Code、OpenAI Codex 與四個模型，在沙箱化合成 workspace 測試。",
      "已植入的記憶 payload 可跨 session 生效；成功率與持久性受系統、模型、目標與多階段流程影響。",
      "持久記憶使 prompt injection 從單次輸入事件轉為需要版本、來源與寫入治理的狀態風險。",
    ],
    relevance:
      "研發 Agent 讀取 repository instruction、維修手冊與工作偏好後，受污染的記憶可能在日後改動韌體、CI/CD 或設備設定時才觸發。",
    action:
      "記憶檔納入變更審查、簽章、來源標籤、版本差異與回復；外部內容不得自動升級為長期指令，高風險工具呼叫前重查原始依據。",
    caveat:
      "Preprint 與合成 workspace；模型版本與 Agent 記憶機制更新很快，結果應視為攻擊可行性證據，不是固定產品風險分數。",
    crossCheck:
      "與 GhostWriter、FARMA 及本週 Self-State 三組不同實驗共同支持：Memory integrity 應被視為獨立 trust boundary。",
    metric: "2 Agent 系統｜4 模型",
  },
  {
    id: 12,
    rank: 5,
    week: "2026.07.24",
    batch: "補遺",
    title: "Multi-Agent Firewall Architecture",
    subtitle: "Privacy Protection of Sensitive Data in Interactions with Language Models",
    date: "2026.07.09",
    dateValue: "2026-07-09",
    authors: "Hugo García Cuesta、Pablo Mateo Torrejón、Alfonso Sánchez-Macián",
    source: "https://arxiv.org/abs/2607.08282",
    sourceLabel: "arXiv:2607.08282",
    pdf: "https://arxiv.org/pdf/2607.08282",
    decision: "選讀",
    kind: "學術論文",
    topics: ["DSPM / DLP", "Agent Security"],
    summary:
      "提出瀏覽器延伸套件加 proxy 的開源 LLM firewall，以確定性偵測器與 LLM 語意分析混合檢查 HTTP(S)、WebSocket 及專有程式碼外洩。",
    findings: [
      "同時攔截網頁與程式化 LLM 互動，涵蓋 HTTP(S) 及 WebSocket。",
      "以分層 pipeline 在成本、延遲與語意深度之間做部署取捨。",
      "最佳設定的 F1 最高 94.93%，但不同資料類型與場景仍需分開看待。",
    ],
    relevance:
      "可作為研發網段、工程師瀏覽器、IDE Agent 與 API gateway 的 GenAI DLP PoC 參考，保護原始碼、BOM、配方與客戶圖面。",
    action:
      "以工廠與研發真實語料重測 precision／recall、延遲、加密流量處理與誤擋；決定哪些類別採確定性規則、哪些送語意模型。",
    caveat:
      "Preprint；摘要只揭露最佳 F1，不能用單一數字判斷對各種敏感資料、語言及混淆手法的實際效果。",
    crossCheck:
      "研究方向與既有 Network／Endpoint DLP 一致，但它補上 WebSocket 與語意型程式碼洩漏；正式採用前仍須以企業資料集獨立驗證。",
    metric: "F1 最高 94.93%",
  },
  {
    id: 13,
    rank: 6,
    week: "2026.07.24",
    batch: "補遺",
    title: "Thematic Review and Gap Analysis on AI Security",
    subtitle: "英國 DSIT 委託的 AI Security 系統性文獻與缺口分析",
    date: "2026.07.10",
    dateValue: "2026-07-10",
    authors: "Lancaster University｜UK Department for Science, Innovation & Technology",
    source: "https://www.gov.uk/government/publications/thematic-review-and-gap-analysis-on-ai-security/thematic-review-and-gap-analysis-on-ai-security",
    sourceLabel: "GOV.UK / DSIT",
    decision: "選讀",
    kind: "政策研究",
    topics: ["Data Lineage", "Threat Modeling", "Agent Security"],
    summary:
      "以 PRISMA 流程整理 2021 至 2026 年初的 9,109 篇同儕審查研究，辨識 12 個主題與五大缺口，適合作為企業研究投資與控制藍圖的基線。",
    findings: [
      "缺口包括 AI 資料／權重完整性驗證、第三方模型來源追蹤，以及 AI 與傳統 IT 攻擊面的銜接。",
      "另外指出 end-user 風險、模型安全退役，以及 Agent 本身、工具與 agent-to-agent 通訊研究不足。",
      "方法使用 Scopus、Web of Science、語意比對與抽樣人工查核；只收英文與指定高品質場域。",
    ],
    relevance:
      "可把五項缺口直接對照跨國製造業的模型供應商管理、AIBOM／lineage、IT／OT SOC 整合、使用者治理與模型退役程序。",
    action:
      "做一次控制缺口工作坊：逐項指定 owner、現有證據、缺少的 telemetry／lineage、補強期限與驗證方式。",
    caveat:
      "雖具方法透明度，但限制於英文、Scopus／WoS 與指定場域；大規模分類包含語意嵌入與 LLM 輔助，未逐篇人工審查。",
    crossCheck:
      "ResearchArena、MCP confused deputy、Self-State 與 Bad Memory 正好落在報告列出的資料完整性、工具安全及 Agent 基礎設施缺口。",
    metric: "9,109 篇｜12 主題｜5 缺口",
  },
  {
    id: 1,
    title: "Agent Skill Security",
    subtitle: "Threat Models, Attacks, Defenses, and Evaluation",
    date: "2026.07.15",
    dateValue: "2026-07-15",
    authors: "Sanket Badhe、Priyanka Tiwari",
    source: "https://arxiv.org/abs/2607.13987",
    sourceLabel: "arXiv:2607.13987",
    pdf: "https://arxiv.org/pdf/2607.13987",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Threat Modeling"],
    summary:
      "提出 SkillSec-Eval，將 Agent Skill 的風險從單次 Prompt Injection 擴展到儲存庫收錄、語意檢索、規劃器選擇、執行與技能演進的完整生命週期。",
    findings: [
      "以 327 個真實 Agent Skills 進行生命週期安全評估。",
      "弱點不只出現在執行階段；Skills 的收錄、搜尋與版本更新均可能遭操控。",
      "需要把 Skill manifest、來源、版本、工具權限與行為納入持續驗證。",
    ],
    relevance:
      "製造企業可能把 BOM 查詢、品質分析、韌體檢測、採購或 OT 維運封裝為 Skills；惡意技能可能接觸 PLM、ERP、NAS、原始碼庫與管理工具。",
    action:
      "建立 Skill 來源白名單、簽章驗證、版本鎖定、權限審查、沙箱測試與更新後重新驗證機制。",
    caveat:
      "尚未經同儕審查；327 個公開 Skills 是否能代表企業內部技能，仍須檢查資料集與抽樣方式。",
    metric: "327 個真實 Skills",
  },
  {
    id: 2,
    title: "Driving AI Transparency",
    subtitle: "Supply- and Demand-Based Paths Toward AIBOM",
    date: "2026.06.16",
    dateValue: "2026-06-16",
    authors: "Allan Friedman、Nick Leiserson｜Institute for Security and Technology",
    source:
      "https://securityandtechnology.org/virtual-library/policy-memo/driving-ai-transparency/",
    sourceLabel: "Institute for Security and Technology",
    pdf: "https://securityandtechnology.org/wp-content/uploads/2026/06/Driving-AI-Transparency-Supply-and-Demand-Based-Paths-Toward-AIBOM-FULL.pdf",
    decision: "深入審閱",
    kind: "政策研究",
    topics: ["Data Lineage", "DSPM / DLP"],
    summary:
      "以 AIBOM 建立 AI 供應鏈透明度，記錄模型、資料集、軟體、Agent middleware、工具層、版本、完整性識別、敏感等級與 Data Lineage。",
    findings: [
      "AIBOM 應與完整 SBOM 結合，而不是只記錄模型名稱。",
      "SPDX 與 CycloneDX 已能表示部分模型、資料集、來源與 lineage 資訊。",
      "目前仍沒有被廣泛接受、可一致交換的 AIBOM minimum elements。",
    ],
    relevance:
      "可直接轉為 AI 視覺檢測、Digital Twin、PLM／ERP Copilot、第三方模型與資料集的採購及驗收要求。",
    action:
      "在 RFP 與合約要求模型／資料集版本、hash、來源、敏感等級、地理來源、處理歷程、RAG 來源及第三方依賴。",
    caveat:
      "商用基礎模型通常不揭露完整訓練資料；無法取得的欄位應明確標為 known unknown，不應以供應商保證替代證據。",
    crossCheck:
      "文件對照 NIST AI RMF、G7 SBOM for AI、SPDX、CycloneDX 與 EU AI Act Annex IV。",
    metric: "AIBOM × Data Lineage",
  },
  {
    id: 3,
    title: "Trust but Verify?",
    subtitle: "Uncovering the Security Debt of Autonomous Coding Agents",
    date: "2026.07.14",
    dateValue: "2026-07-14",
    authors: "A H M Nazmus Sakib、Dipayan Banik、Murtuza Jadliwala",
    source: "https://arxiv.org/abs/2607.12428",
    sourceLabel: "arXiv:2607.12428",
    pdf: "https://arxiv.org/pdf/2607.12428",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Threat Modeling", "DSPM / DLP"],
    summary:
      "大型實證研究量化 autonomous coding agents 帶來的 security debt，並指出人機協作本身會形成新的憑證與供應鏈風險。",
    findings: [
      "分析 4,022 個 PR、16,112 個檔案變更；38.9% PR 至少含一項 security smell。",
      "供應鏈完整性問題占 82.3%；硬編碼憑證占重大問題的 99.6%。",
      "67.6% 真實憑證洩漏由人類協作者加入，81.1% 在合併前未被發現。",
    ],
    relevance:
      "BMC、BIOS、韌體、設備控制程式與客戶客製化原始碼屬高價值 IP；AI Agent 變更 CI/CD、dependency 或簽署流程會把風險直接帶入產品供應鏈。",
    action:
      "對 workflow、IaC、package manifest、secret-bearing files 與韌體簽署流程強制人工核准，並在人類修改後再次執行秘密掃描。",
    caveat:
      "部分分類採 LLM-as-a-judge；雖有人工驗證，仍須審閱標註一致性、false positive 與資料集代表性。",
    metric: "38.9% PR 含風險訊號",
  },
  {
    id: 4,
    title: "When Agents Remember Too Much",
    subtitle: "Memory Poisoning Attacks on Large Language Model Agents",
    date: "2026.07.06",
    dateValue: "2026-07-06",
    authors: "George Torres、Sharad Shrestha、Satyajayant Misra",
    source: "https://arxiv.org/abs/2607.06595",
    sourceLabel: "arXiv:2607.06595",
    pdf: "https://arxiv.org/pdf/2607.06595",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Data Lineage", "Threat Modeling"],
    summary:
      "提出 GhostWriter 兩階段攻擊：先把隱藏指令注入長期記憶，再等待未來工作檢索並啟動惡意行為。",
    findings: [
      "實驗報告約 98% 注入率及約 60% 平均啟動率。",
      "風險根源是 Agent memory 缺少來源、信任與寫入治理。",
      "作者提出 memory-saving policy 與 retrieval screen 的 AM-Sentry 防禦。",
    ],
    relevance:
      "供應商郵件、工單、維修手冊、品質異常紀錄或 RAG 文件都可能先污染記憶，之後在採購、維修或設備操作時觸發。",
    action:
      "記憶項目應保存來源、時間、信任等級、敏感標籤與完整性證據；外部內容不得自動進入長期記憶。",
    caveat:
      "攻擊成功率尚未經獨立重現，不能直接視為企業真實環境發生率。",
    crossCheck:
      "同期 FARMA 研究亦證明 reasoning history 可被偽造；兩篇設計不同，數字不可直接比較，但結論互相支持。",
    metric: "98% 注入｜60% 啟動",
  },
  {
    id: 5,
    title: "Temporary Authority, Permanent Effects",
    subtitle: "Commit-Time Authorization for LLM Agents",
    date: "2026.07.11",
    dateValue: "2026-07-11",
    authors: "Igor Santos-Grueiro",
    source: "https://arxiv.org/abs/2607.10487",
    sourceLabel: "arXiv:2607.10487",
    pdf: "https://arxiv.org/pdf/2607.10487",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Threat Modeling"],
    summary:
      "定義 commit-time authorization：Agent 造成永久效果前，必須重新確認先前的授權證據仍新鮮、有效且綁定同一動作。",
    findings: [
      "216 個授權關係已失效的案例中，有 207 個仍完成 commit。",
      "只在任務開始時核准，無法控制長時間、多工具與多代理工作流程。",
      "有效防禦必須在 durability boundary 重新驗證、重新綁定、重規劃或拒絕。",
    ],
    relevance:
      "適用於 Agent 建立採購單、修改 ERP、發布韌體、調整防火牆、下達排程或執行 OT 維護等不可逆動作。",
    action:
      "在 commit boundary 重查身分、核准狀態、資料版本、作用範圍、目標與時間有效性。",
    caveat:
      "單一作者與受控測試環境；對不同 Agent framework、ERP 與 OT workflow 的適用性仍需驗證。",
    metric: "207 / 216 未授權 Commit",
  },
  {
    id: 6,
    title: "2026 State of AI Security",
    subtitle: "AI Is in Production. Security Isn’t.",
    date: "2026.07.09",
    dateValue: "2026-07-09",
    authors: "Tyler Woo、Orca Research Pod",
    source:
      "https://orca.security/resources/blog/2026-state-of-ai-security-report-summary/",
    sourceLabel: "Orca Security Research",
    decision: "選讀",
    kind: "產業報告",
    topics: ["DSPM / DLP", "DDR", "Agent Security"],
    summary:
      "以超過 1,200 個生產環境的 2026 Q2 雲端遙測，呈現 Agent、Vector Database、AI credentials 與雲端設定的實際曝險。",
    findings: [
      "56% AI 採用者已部署 Agent framework；64% 使用連接企業資料的 vector database。",
      "29.5% 至少有一組 AI credential 儲存在不安全位置。",
      "報告主張把 AI 資產、權限、資料與 runtime activity 納入持續偵測與回應。",
    ],
    relevance:
      "跨國製造業常同時存在 AWS、Azure、GCP、私有雲與工廠 edge AI，可作為 shadow AI infrastructure 與 Agent cloud permissions 盤點基準。",
    action:
      "把模型端點、Vector DB、RAG 權限、Secrets、公開曝露與 Agent runtime telemetry 串接至 DSPM／DDR／SIEM。",
    caveat:
      "資料來自 Orca 客戶環境，可能存在產品覆蓋與客戶組成偏差；百分比不宜直接推估整體產業。",
    metric: "1,200+ 生產環境",
  },
  {
    id: 7,
    title: "AI Security Report 2026",
    subtitle: "From AI Assistant to Attack Operator",
    date: "2026.07.14",
    dateValue: "2026-07-14",
    authors: "Check Point Research",
    source: "https://research.checkpoint.com/2026/ai-security-report-2026/",
    sourceLabel: "Check Point Research",
    decision: "選讀",
    kind: "產業報告",
    topics: ["DSPM / DLP", "DDR", "Agent Security"],
    summary:
      "彙整 AI 輔助攻擊、Agent configuration abuse、間接 Prompt Injection 與 GenAI 資料外洩遙測，觀察 AI 從輔助者轉向攻擊操作角色。",
    findings: [
      "2026 年 3 至 5 月，較長的惡意 Prompt Payload 偵測量約增加五倍。",
      "高風險 GenAI Prompt 比例由約 2% 上升至 4%。",
      "攻擊者逐漸利用 Agent 架構與持久設定，而非只進行單次 jailbreak。",
    ],
    relevance:
      "支持在瀏覽器、Endpoint、Network 與 API 層檢查員工輸入 AI 的原始碼、BOM、客戶規格、測試結果及設備設定。",
    action:
      "以 Network／Endpoint DLP 控制資料外流，並把 Prompt、Agent configuration 與 tool invocation 納入 DDR／SOC 可視性。",
    caveat:
      "公開頁面未充分揭露組織數、Prompt 分類標準、誤判率與產業分布；數字只能代表 Check Point 可見範圍。",
    crossCheck:
      "風險方向與 Orca、Cyberhaven 遙測大致一致，但母體與定義不同，百分比不能直接相加或比較。",
    metric: "高風險 Prompt 2% → 4%",
  },
];

const filters = [
  "全部",
  "Agent Security",
  "DSPM / DLP",
  "Data Lineage",
  "DDR",
  "Threat Modeling",
];

function Mark({ children }: { children: React.ReactNode }) {
  return <span className="mark">{children}</span>;
}

export default function Home() {
  const [topic, setTopic] = useState("全部");
  const [decision, setDecision] = useState("全部判定");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("priority");
  const [selected, setSelected] = useState<Reading | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-security-reading-progress");
    if (!saved) return;
    const frame = window.requestAnimationFrame(() => {
      setCompleted(JSON.parse(saved));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "ai-security-reading-progress",
      JSON.stringify(completed),
    );
  }, [completed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleReadings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = readings.filter((reading) => {
      const matchesCurrentWeek = reading.week === "2026.07.31";
      const matchesTopic = topic === "全部" || reading.topics.includes(topic);
      const matchesDecision =
        decision === "全部判定" || reading.decision === decision;
      const haystack = [
        reading.title,
        reading.subtitle,
        reading.authors,
        reading.summary,
        reading.relevance,
        ...reading.topics,
      ]
        .join(" ")
        .toLowerCase();
      return matchesCurrentWeek && matchesTopic && matchesDecision && haystack.includes(normalized);
    });

    return result.sort((a, b) =>
      sort === "newest"
        ? b.dateValue.localeCompare(a.dateValue)
        : (a.rank ?? a.id) - (b.rank ?? b.id),
    );
  }, [decision, query, sort, topic]);

  const toggleComplete = (id: number) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const currentReadings = readings.filter((reading) => reading.week === "2026.07.31");
  const currentCompleted = completed.filter((id) =>
    currentReadings.some((reading) => reading.id === id),
  );
  const progress = Math.round((currentCompleted.length / currentReadings.length) * 100);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到頁首">
          <span className="brand-mark">AI</span>
          <span>
            <strong>Manufacturing AI Security</strong>
            <small>READING INTELLIGENCE HUB</small>
          </span>
        </a>
        <a className="mobile-history-link" href="/archive">過去必讀</a>
        <nav aria-label="主要導覽">
          <a href="#weekly">本週精選</a>
          <a href="#index">主題索引</a>
          <a href="#progress">閱讀進度</a>
          <a href="/archive">歷史資料</a>
          <a href="/social-content/index.html">社群內容</a>
        </nav>
        <div className="live-state"><i /> VERIFIED SOURCES</div>
      </header>

      <section className="hero" id="top">
        <div className="grid-noise" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">WEEKLY INTELLIGENCE · 2026.07.31</p>
          <h1>AI Security <span>必讀清單</span></h1>
          <p className="hero-subtitle">
            聚焦製造業 AI Security、DSPM、DLP、Data Lineage、DDR
            與 AI System Threat Modeling
          </p>
          <div className="kpi-row" aria-label="本週清單統計">
            <div className="kpi"><b>06</b><span>本週入選</span><i>6 NEW · 0 CATCH-UP</i></div>
            <div className="kpi purple"><b>05</b><span>深入審閱</span><i>HIGH PRIORITY</i></div>
            <div className="kpi blue"><b>01</b><span>選讀</span><i>SELECTIVE</i></div>
          </div>
          <a className="social-content-cta" href="/social-content/index.html">
            <span><b>每週社群內容創意</b><small>AI Governance · AI Security · Electronic Manufacturing</small></span>
            <i>3 READY POSTS</i>
            <strong>→</strong>
          </a>
        </div>

        <div className="hero-intel" aria-label="本週安全態勢摘要">
          <div className="intel-head"><span>WEEKLY SECURITY POSTURE</span><i /></div>
          <div className="posture-row">
            <div className="donut"><span>92%</span><small>實務關聯</small></div>
            <div className="posture-stats">
              <p><span>查核來源</span><b>15</b></p>
              <p><span>高風險訊號</span><b className="risk">05</b></p>
              <p><span>核心控制</span><b>12</b></p>
            </div>
          </div>
          <div className="trend-head"><span>RESEARCH SIGNAL (7D)</span><b>+31%</b></div>
          <div className="trend-bars" aria-hidden="true">
            {[35, 48, 42, 61, 52, 68, 73, 58, 86, 74, 96, 81].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="threat-route" aria-hidden="true">
          <span className="route-node n1" />
          <span className="route-node n2" />
          <span className="route-node n3" />
          <span className="route-node n4" />
          <i className="route-line l1" />
          <i className="route-line l2" />
          <i className="route-line l3" />
        </div>
      </section>

      <section className="featured" id="weekly">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PRIORITY TARGET · #01</p>
            <h2>本週最高優先閱讀</h2>
          </div>
          <span className="verified-badge">✓ 原始來源已確認</span>
        </div>
        <article className="featured-card">
          <div className="rank-panel"><b>#01</b><small>CRITICAL READ</small></div>
          <div className="featured-copy">
            <div className="meta-line">
              <span>原始研究</span><i />2026.07.29<i />arXiv
            </div>
            <h3>MemSecBench</h3>
            <p className="featured-subtitle">Agent memory poisoning lifecycle benchmark</p>
            <p className="featured-summary">{readings[0].summary}</p>
            <div className="featured-actions">
              <button className="primary-button" onClick={() => setSelected(readings[0])}>
                閱讀摘要 <span>→</span>
              </button>
              <a className="secondary-button" href={readings[0].source} target="_blank" rel="noreferrer">
                原始論文 ↗
              </a>
              <a className="text-link" href={readings[0].pdf} target="_blank" rel="noreferrer">PDF ↓</a>
            </div>
          </div>
          <div className="lifecycle-map" aria-label="Agent 記憶污染生命週期">
            <div className="risk-core"><span>!</span><small>RISK</small></div>
            <div className="stage-row">
              {[
                ["01", "Write"],
                ["02", "Persist"],
                ["03", "Recall"],
                ["04", "Execute"],
                ["05", "Forget"],
              ].map(([num, label], index) => (
                <div className="stage" key={label}>
                  <span>{num}</span><small>{label}</small>{index < 4 && <i>→</i>}
                </div>
              ))}
            </div>
            <div className="map-caption">MEMORY POISONING LIFECYCLE</div>
          </div>
        </article>
      </section>

      <section className="library" id="index">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED RESEARCH LIBRARY</p>
            <h2>完整必讀名單</h2>
          </div>
          <p className="result-count">顯示 <b>{visibleReadings.length}</b> / {currentReadings.length} 項 · <a href="/archive">查看歷史資料 →</a></p>
        </div>

        <div className="control-panel">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜尋論文、作者、控制或風險…"
              aria-label="搜尋閱讀清單"
            />
            {query && <button onClick={() => setQuery("")} aria-label="清除搜尋">×</button>}
          </label>
          <div className="filter-row" role="group" aria-label="主題篩選">
            {filters.map((filter) => (
              <button
                key={filter}
                className={topic === filter ? "active" : ""}
                onClick={() => setTopic(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <select value={decision} onChange={(event) => setDecision(event.target.value)} aria-label="判定篩選">
            <option>全部判定</option>
            <option>深入審閱</option>
            <option>選讀</option>
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="排序方式">
            <option value="priority">依優先順序</option>
            <option value="newest">依發布日期</option>
          </select>
        </div>

        <div className="reading-grid">
          {visibleReadings.map((reading) => {
            const isDone = completed.includes(reading.id);
            return (
              <article className={`reading-card ${isDone ? "completed" : ""}`} key={reading.id}>
                <div className="card-topline">
                  <span className="card-rank">#{String(reading.rank ?? reading.id).padStart(2, "0")}</span>
                  <span className={`decision ${reading.decision === "深入審閱" ? "deep" : "select"}`}>
                    {reading.decision === "深入審閱" ? "◇" : "▢"} {reading.decision}
                  </span>
                </div>
                <div className="card-kind"><span>{reading.kind}</span><i />{reading.date}{reading.batch && <><i />{reading.batch}</>}</div>
                <h3>{reading.title}</h3>
                <p className="card-subtitle">{reading.subtitle}</p>
                <p className="card-summary">{reading.summary}</p>
                {reading.metric && <div className="metric">{reading.metric}</div>}
                <div className="topic-list">
                  {reading.topics.map((item) => <span key={item}>{item}</span>)}
                </div>
                <div className="card-actions">
                  <button onClick={() => setSelected(reading)}>摘要與查核 <span>→</span></button>
                  <a href={reading.source} target="_blank" rel="noreferrer" aria-label={`開啟 ${reading.title} 原始來源`}>來源 ↗</a>
                  {reading.pdf && <a href={reading.pdf} target="_blank" rel="noreferrer" aria-label={`下載 ${reading.title} PDF`}>PDF ↓</a>}
                </div>
                <button
                  className={`progress-toggle ${isDone ? "done" : ""}`}
                  onClick={() => toggleComplete(reading.id)}
                >
                  <span>{isDone ? "✓" : ""}</span>{isDone ? "已閱讀" : "標記為已閱讀"}
                </button>
              </article>
            );
          })}
        </div>
        {visibleReadings.length === 0 && (
          <div className="empty-state"><b>NO MATCHING INTELLIGENCE</b><p>沒有符合目前條件的資料，請調整搜尋或篩選條件。</p></div>
        )}
      </section>

      <section className="progress-section" id="progress">
        <div>
          <p className="eyebrow">READING OPERATIONS</p>
          <h2>本週閱讀進度</h2>
          <p>進度只儲存在目前瀏覽器，不會傳送到外部服務。</p>
        </div>
        <div className="progress-console">
          <div className="progress-value"><b>{progress}%</b><span>{currentCompleted.length} / {currentReadings.length} COMPLETED</span></div>
          <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
          <div className="progress-labels"><span>0</span><span>READING TARGET</span><span>100</span></div>
        </div>
        <div className="next-actions">
          <h3>建議下一步</h3>
          <ol>
            <li><b>01</b><span>以 Write–Execute–Forget 測試企業 Agent memory，驗證來源、召回與選擇性刪除。</span></li>
            <li><b>02</b><span>把模型架構、custom operator 與 export graph 納入 AIBOM 與可驗證 lineage。</span></li>
            <li><b>03</b><span>用工廠 RAG 語料測試文件污染、反事實影響分數、延遲與推論成本。</span></li>
            <li><b>04</b><span>在工具呼叫與實體設備執行前記錄授權來源、任務、資料標籤與目的地。</span></li>
          </ol>
        </div>
      </section>

      <section className="about" id="about">
        <div>
          <p className="eyebrow">EDITORIAL & VERIFICATION POLICY</p>
          <h2>篩選與查核原則</h2>
        </div>
        <div className="method-grid">
          <article><span>01</span><h3>原始來源優先</h3><p>優先採用原始論文、官方報告、權威機構與可查核的技術研究。</p></article>
          <article><span>02</span><h3>證據與限制並陳</h3><p>區分實證結果、作者主張與推論；明列樣本偏差及未經同儕審查等限制。</p></article>
          <article><span>03</span><h3>製造業實務映射</h3><p>對應 IP、BOM、PLM、ERP、韌體、OT、供應鏈與跨國資料治理情境。</p></article>
          <article><span>04</span><h3>排除行銷雜訊</h3><p>不以產品排行、無方法論的廠商文章或重複轉述填補閱讀清單。</p></article>
        </div>
        <div className="method-note"><Mark>判讀提醒</Mark> Preprint 的攻擊成功率尚未經獨立重現；廠商遙測僅代表其可見範圍，不能直接外推整體產業。</div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">AI</span><span><strong>Manufacturing AI Security</strong><small>SECURE · RELIABLE · RESPONSIBLE AI</small></span></div>
        <p>本週更新：2026.07.31 · 正體中文／臺灣慣用語</p>
        <a href="/archive">歷史資料庫 →</a>
      </footer>

      {selected && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
          <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="關閉摘要">×</button>
            <div className="modal-rank">#{String(selected.rank ?? selected.id).padStart(2, "0")} · {selected.kind}{selected.batch ? ` · ${selected.batch}` : ""}</div>
            <h2 id="detail-title">{selected.title}</h2>
            <p className="modal-subtitle">{selected.subtitle}</p>
            <div className="modal-meta"><span>{selected.date}</span><i />{selected.authors}</div>
            <div className="modal-tags">
              <span className={selected.decision === "深入審閱" ? "deep" : "select"}>{selected.decision}</span>
              {selected.topics.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="detail-section">
              <h3>核心摘要</h3><p>{selected.summary}</p>
            </div>
            <div className="detail-section">
              <h3>主要發現</h3>
              <ul>{selected.findings.map((finding) => <li key={finding}>{finding}</li>)}</ul>
            </div>
            <div className="detail-grid">
              <article><h3>製造業實務關聯</h3><p>{selected.relevance}</p></article>
              <article><h3>建議控制／行動</h3><p>{selected.action}</p></article>
            </div>
            {selected.crossCheck && <div className="cross-check"><b>交叉核實</b><p>{selected.crossCheck}</p></div>}
            <div className="caveat"><b>查核注意事項</b><p>{selected.caveat}</p></div>
            <div className="modal-actions">
              <a className="primary-button" href={selected.source} target="_blank" rel="noreferrer">開啟原始來源 ↗</a>
              {selected.pdf && <a className="secondary-button" href={selected.pdf} target="_blank" rel="noreferrer">下載／開啟 PDF ↓</a>}
              <button className={`reading-button ${completed.includes(selected.id) ? "done" : ""}`} onClick={() => toggleComplete(selected.id)}>
                {completed.includes(selected.id) ? "✓ 已完成閱讀" : "標記為已閱讀"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
