export type EvidenceLevel = "同儕審查" | "已接受" | "Preprint" | "政策報告" | "廠商遙測";

/** 三軸評分：1 = 明顯不足，2 = 部分達成，3 = 完整達成。 */
export type RubricScore = 1 | 2 | 3;

export type RubricScores = {
  evidence: RubricScore;
  relevance: RubricScore;
  actionability: RubricScore;
};

export type CorrectionType = "更正" | "撤稿" | "取代";

/**
 * 已發佈項目的修訂紀錄。條目一律保留在清單中，不刪除，
 * 以免歷史連結失效或讓錯誤結論悄悄消失。
 */
export type Correction = {
  date: string;
  type: CorrectionType;
  note: string;
  source?: string;
  /** 當 type 為「取代」時，指向取代它的 reading id。 */
  supersededBy?: number;
};

export type Reading = {
  id: number;
  rank: number;
  week: string;
  batch: "本週新發" | "補遺";
  evidenceLevel: EvidenceLevel;
  scores: RubricScores;
  corrections?: Correction[];
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
    id: 27,
    rank: 1,
    week: "2026.08.14",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "Agent Safety Should Be a Runtime Contract",
    subtitle: "把 Agent 安全從模型屬性改寫為可驗證的執行期契約",
    date: "2026.08.11",
    dateValue: "2026-08-11",
    authors: "Albus W. Ng、Yi Han、Jusheng Zhang、Wenhao Wang",
    source: "https://arxiv.org/abs/2608.11274",
    sourceLabel: "arXiv:2608.11274",
    pdf: "https://arxiv.org/pdf/2608.11274",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "DDR", "Data Lineage", "Threat Modeling"],
    summary:
      "主張自主 Agent 的安全單位不應只是模型，而應是帶有可檢查證據的完整執行軌跡；harness 同時要在動作前阻擋危險行為，並在提交前要求測試、日誌、檔案差異與來源證據。",
    findings: [
      "彙整 52 起公開 AI Agent／LLM 安全事件，並以逐列 protocol 判讀可由哪一層 harness 預防或緩解。",
      "31 個無爭議 false-completion 案例顯示 Agent 可能宣稱完成，實際產物卻破損、不完整、幻覺化或有害。",
      "稽核 12 套公開 Agent 系統與 harness，只有 2 套記載類似提交前 evidence gate；另分析 28,560 篇頂會論文，部署期研究比訓練期少約 8–12 倍。",
    ],
    relevance:
      "製造業 Agent 可能修改韌體、BOM、PLM、ERP、設備參數或品質資料；『Agent 說完成』不能成為驗收依據，尤其在跨廠區與供應商工作流程中，必須有可稽核的執行證據。",
    action:
      "為每類高風險 Agent 任務定義 runtime contract：授權來源、允許工具、資料邊界、commit 前檢查、預期產物與 evidence chain；未附測試、diff、log 或來源證據時不得提交。",
    caveat:
      "屬框架與立場型 preprint；52 起事件的反事實歸因、標題級論文分類與 evidence gate 定義仍可能受作者編碼選擇影響，不能視為防禦效果實驗。",
    crossCheck:
      "與 Temporary Authority 的 commit-time reauthorization、DiagChain 的逐步證據重建及 Permission Denied 的受限環境評估互相補強：安全必須由執行層證明，而非由模型自述。",
    metric: "52 起事件｜31 false completion｜12 套 harness",
  },
  {
    id: 28,
    rank: 2,
    week: "2026.08.14",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "ColluSkill",
    subtitle: "Adversarial Cross-Skill Composition for Evading Agent Skill Scanners",
    date: "2026.08.10",
    dateValue: "2026-08-10",
    authors: "Puyu Zeng、Simeng Qin、Jingzhi Li、Ju Jia、Zheli Liu、Xiaojun Jia",
    source: "https://arxiv.org/abs/2608.09732",
    sourceLabel: "arXiv:2608.09732",
    pdf: "https://arxiv.org/pdf/2608.09732",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Data Lineage", "DSPM / DLP", "Threat Modeling"],
    summary:
      "證明逐一掃描 Skill 會漏掉組合風險：攻擊者可把一個惡意目的拆成多個外觀看似合理的 Skills，透過上下文依賴、artifact 傳遞與執行交接，在執行期才組成完整攻擊鏈。",
    findings: [
      "在 6 套代表性 Skill scanners 上，ColluSkill 平均攻擊成功率達 96.0%。",
      "攻擊以 LLM 規劃跨 Skill chain，並依 scanner 回饋降低單一 Skill 的可疑訊號。",
      "作者提出 ChainGuard，聯合分析已安裝與候選 Skill 的依賴、artifact flow、能力組合與下游行為；把 ASR 降至 22.5%，同時讓 99.5% 良性流程通過。",
    ],
    relevance:
      "品質分析、BOM 匯出、採購、程式碼修改與 OT 維運可能被拆成可重用 Skills；單一元件都通過掃描，組合後仍可能把機密資料送到未授權位置或執行破壞性動作。",
    action:
      "Skill admission 除單件掃描外，新增安裝集合與實際 workflow 的 chain-level 分析；保留 artifact lineage、能力交集、呼叫順序與資料目的地，並在組合變更後重新驗證。",
    caveat:
      "9 頁 preprint；96.0% 與 22.5% 來自作者選定的 6 套 scanner、攻擊鏈與測試環境，企業內部 Skill 格式與政策需要重跑。",
    crossCheck:
      "與 Agent Skill Security 的生命週期威脅模型及 Confused Deputy 的工具選擇劫持一致，但把控制範圍從單一 Skill 擴展到跨元件資料流。",
    metric: "96.0% ASR｜ChainGuard 22.5%｜99.5% 良性通過",
  },
  {
    id: 29,
    rank: 3,
    week: "2026.08.14",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "A Gateway Architecture for Enterprise MCP Authentication",
    subtitle: "統一人員、非人員身分、委派與異質驗證的生產經驗",
    date: "2026.08.11",
    dateValue: "2026-08-11",
    authors: "Suraj Kumar、Amy Wang、Srinivasan Manoharan",
    source: "https://arxiv.org/abs/2608.10760",
    sourceLabel: "arXiv:2608.10760",
    pdf: "https://arxiv.org/pdf/2608.10760",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "DDR", "Data Lineage", "Threat Modeling"],
    summary:
      "以實際生產部署說明如何用集中式 MCP gateway 統一驗證、委派、稽核與離職撤權，解決各團隊自行實作 no-auth、API key 或 OAuth 所造成的治理斷裂。",
    findings: [
      "提出 persona（互動使用者／自動化非人員）× credential type 的雙軸驗證模型。",
      "整理 BYOT、GYOT 與 RFC 8693 token exchange，以及 User-to-OAuth2、Non-user-to-Service-Account、User-to-Service-Account 三類端到端身分流。",
      "架構已用於生產環境，橫跨 web、desktop、自訂 SDK 與 low-code clients，前置治理數十個 MCP servers。",
    ],
    relevance:
      "跨國製造業的 MCP 可能連接 PLM、ERP、資料倉儲、研發 Git 與工廠維運；共用 API key 或 internal-only 假設會破壞使用者歸屬、最小權限、稽核與離職撤權。",
    action:
      "建立 MCP gateway 與 server identity registry；每次呼叫綁定人員／工作負載身分、委派鏈、token audience、工具與資料範圍，並把 gateway 與下游 server log 串入 SIEM／DDR。",
    caveat:
      "屬未經同儕審查的 experience paper；作者未公開企業名稱、事件數、效能、失敗率與完整威脅測試，生產部署本身不等於安全性已被獨立驗證。",
    crossCheck:
      "補足 Confused Deputy 與 Permission Denied 的控制落地：前者說明錯誤工具選擇的危險，後者顯示最小權限會改變失敗模式，本研究提供統一身分與 audit plane。",
    metric: "3 身分流｜3 token 模型｜數十個 MCP servers",
  },
  {
    id: 30,
    rank: 4,
    week: "2026.08.14",
    batch: "本週新發",
    evidenceLevel: "已接受",
    scores: { evidence: 3, relevance: 3, actionability: 3 },
    title: "Mind the Hook",
    subtitle: "Source-Level Auditing of Privacy Defenses in Retrieval-Augmented Generation",
    date: "2026.08.10",
    dateValue: "2026-08-10",
    authors: "Yanhang Li、Zhichao Fan、Zexin Zhuang",
    source: "https://arxiv.org/abs/2608.09001",
    sourceLabel: "ICMLA 2026",
    pdf: "https://arxiv.org/pdf/2608.09001",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["DSPM / DLP", "Data Lineage", "Threat Modeling"],
    summary:
      "提出 active-path audit：先從原始碼確認隱私防禦真正介入 retrieval、retrieved content 或 generation 的哪一段，再把指標對應到實際外洩通道，避免把黑箱分數誤當端到端 DLP 證據。",
    findings: [
      "作者重作的 DP-style defenses 只修改 retrieval scores；generation hooks 是 TODO stub，回傳內容未改變。",
      "因此這些實作雖影響 membership inference，生成文字的 named-entity leakage 卻與 No-Defense 相近。",
      "端到端 LPRAG 路徑以 email canary 驗證：No-Defense 找回 53/150，LPRAG 為 0/150。",
    ],
    relevance:
      "製造業 RAG 會處理 BOM、圖面、配方、客戶規格與人員資料；採購隱私或 DLP 控制時，必須知道產品實際攔在哪一層，以及是否涵蓋生成輸出與工具外送。",
    action:
      "要求供應商提供 active hook、資料流圖與可重現 canary 測試；分別量測 retrieval membership、retrieved context、生成內容與 tool/API egress，不以單一 privacy score 驗收。",
    caveat:
      "已獲 ICMLA 2026 接受，但只有 6 頁；作者明確限定結論只適用其重作版本與測試 stack，不能推論原始 defense family 全部失效。",
    crossCheck:
      "與 RAGuard 的執行期文件影響分析互補：RAGuard 聚焦污染完整性，Mind the Hook 聚焦隱私控制是否真的接上資料外洩路徑。",
    metric: "Email canary 53/150 → 0/150",
  },
  {
    id: 31,
    rank: 5,
    week: "2026.08.14",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "Once Poisoned, Arbitrarily Controlled",
    subtitle: "A Programmable Backdoor in Vision-Language Models",
    date: "2026.08.11",
    dateValue: "2026-08-11",
    authors: "Tao Lin、Gaojie Jin、Zongxin Liu、Peng Wu、Lijia Yu",
    source: "https://arxiv.org/abs/2608.10959",
    sourceLabel: "arXiv:2608.10959",
    pdf: "https://arxiv.org/pdf/2608.10959",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Data Lineage", "Agent Security", "Threat Modeling"],
    summary:
      "把 VLM 後門從預先綁定的固定 trigger–target，擴展成一次污染、推論時才決定任意目標語意的 programmable backdoor；攻擊者可為未在污染階段出現的 caption 動態產生觸發。",
    findings: [
      "未見過的 trigger–target pairs 中，vanilla 與 L∞ triggers 的 ASR 分別為 92.00% 與 86.00%；固定 mapping baselines 在相同條件為 0%。",
      "模擬 200 個任意 captions、每個搭配 20 張良性影像時，patch trigger 的 normal ASR 為 89.15%，trigger-level ASR 為 86.50%。",
      "在作者測試的 Shrinkpad、Flip、Scale-up 防禦下，vanilla trigger 仍維持 98.67%–100% ASR。",
    ],
    relevance:
      "AOI、視覺品質檢測、倉儲辨識與圖面助理若採第三方 VLM 或 fine-tune，後門目標可在部署後才選定；固定觸發清單與乾淨資料準確率驗收不足。",
    action:
      "把訓練資料、權重、adapter、架構與推論前處理納入 AIBOM；對任意語意目標做 trigger search、跨影像行為差異、可信重建與隔離環境驗收。",
    caveat:
      "Preprint；主要實驗基於作者指定 VLM、Flickr8k、句向量門檻與合成 trigger，ASR 不能直接外推至工廠 AOI 分布或封閉模型。",
    crossCheck:
      "與 Architectural Backdoors 及 ToxScreen 共同顯示：模型 hash、乾淨效能與傳統單一 trigger 掃描都不能證明 VLM 供應鏈安全。",
    metric: "未見目標 ASR 92%｜Trigger-level 86.5%",
  },
  {
    id: 32,
    rank: 6,
    week: "2026.08.14",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "Backdoor Decontamination Dynamics in LLM Agents",
    subtitle: "未知觸發下的防禦性污染與去污染實驗",
    date: "2026.08.11",
    dateValue: "2026-08-11",
    authors: "Gabriel Huang、Abhay Puri、Léo Boisvert、Alexandre Drouin、Perouz Taslakian、Spandana Gella、Christopher Pal",
    source: "https://arxiv.org/abs/2608.11295",
    sourceLabel: "arXiv:2608.11295",
    pdf: "https://arxiv.org/pdf/2608.11295",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Data Lineage", "Threat Modeling"],
    summary:
      "研究防守方不知道既有 trigger 時，能否先植入已知防禦性後門、再 unlearn 該後門，連帶清除未知惡意行為；並把 trigger、response、teacher 與 fine-tuning 方法分離測試。",
    findings: [
      "115 組 AgentDyn 實驗中，只做 defensive poisoning 約清除 56% 原始後門；後續 decontamination 幾乎清除剩餘行為。",
      "同時植入最多 4 個後門時，單靠 defensive poisoning 的清除率降至約 36%。",
      "對一個已知共存後門去污染，連帶清除 52/60（87%）其他後門；但中間層仍可看到原始 trigger awareness 痕跡。",
    ],
    relevance:
      "企業接收外部 fine-tune、adapter 或開源 Agent 模型時，通常不知道潛在 trigger；研究提供供應鏈修復測試方向，也提醒輸出恢復正常不代表模型內部已完全清除。",
    action:
      "第三方模型驗收保留原始 artifact、decontamination 版本與完整測試 lineage；把行為測試、trigger 探索、內部表示分析與可信重建結合，避免把單次 unlearning 視為安全證明。",
    caveat:
      "Preprint；結果依 AgentDyn、後門類型與 fine-tuning 設定，且 defensive poisoning 本身會修改模型，尚不適合作為未經獨立驗證的生產修復程序。",
    crossCheck:
      "補充 ToxScreen 的偵測困境與本週 programmable VLM backdoor：未知 trigger 下即使外部行為恢復，仍需保留 provenance、版本差異與重新驗收。",
    metric: "115 實驗｜56% 初步清除｜87% 共存清除",
  },
  {
    id: 33,
    rank: 7,
    week: "2026.08.14",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 2, actionability: 2 },
    title: "ToolHazard",
    subtitle: "Scaling Adversarial Environments for Security Evaluation and Alignment of LLM Agents",
    date: "2026.08.12",
    dateValue: "2026-08-12",
    authors: "Yutao Mou、Pengfei Yang、Zhe Yin、Zhangchi Xue、Xiaotian Luan、Dingyao Yu、Tong Zhang、Shikun Zhang、Wei Ye",
    source: "https://arxiv.org/abs/2608.11878",
    sourceLabel: "arXiv:2608.11878",
    pdf: "https://arxiv.org/pdf/2608.11878",
    decision: "選讀",
    kind: "學術論文",
    topics: ["Agent Security", "DDR", "Threat Modeling"],
    summary:
      "以 LLM 自動合成可執行、具狀態的 adversarial environments，讓攻擊 Agent 尋找可寫入且會被任務讀取的狀態，產生 environment-specific prompt injection，再以程式化 final-state checks 驗證。",
    findings: [
      "ToolHazard-Bench 包含 28 個 stateful environments、512 個 tools、87 個長流程任務，平均 15.56 steps。",
      "7 個模型在不同攻擊策略下 ASR 差異很大；重要模板、multi-turn、decision hijacking 與 tool selection 在部分模型達 70% 以上。",
      "攻擊指令越早被 Agent 遇到、越靠近 observation 尾端，效果越強；alignment data 能降低 ToolHazard-Bench 與 AgentDojo 風險並保留良性 utility。",
    ],
    relevance:
      "工廠 Agent 讀取郵件、資料庫備註、工單與工具輸出，風險常藏在有狀態環境而非 prompt 本身；此方法可作 ERP／PLM／OT digital twin 安全測試的設計參考。",
    action:
      "用企業實際 schema 建立隔離 adversarial twin；自動找出可寫入→可讀取的資料路徑，測試不同 injection timing、位置與工具組合，並以最終系統狀態而非 LLM judge 判定。",
    caveat:
      "作者標示 Work in Progress；環境由 LLM 合成且受 ToolACE／API-Bank 領域覆蓋限制，尚未證明能代表製造業 ERP、PLM 或 OT 的真實狀態與限制，因此判定選讀。",
    crossCheck:
      "與 Breadcrumbing 及 ColluSkill 共同指出，真正攻擊面是跨步驟資料流與狀態轉移；單一 prompt 或單一 tool 的安全測試不足。",
    metric: "28 環境｜512 工具｜87 任務｜15.56 steps",
  },
  {
    id: 34,
    rank: 8,
    week: "2026.08.14",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 2, actionability: 2 },
    title: "Convergent Detour Hijacking",
    subtitle: "Task-Preserving Resource Amplification in Skill-Based LLM Agents",
    date: "2026.08.12",
    dateValue: "2026-08-12",
    authors: "Junliang Liu、Ruoyu Li、Wenxin Tang、Jingyu Xiao、Zhenyu Liu、Jingheng Xu、Laizhong Cui",
    source: "https://arxiv.org/abs/2608.12273",
    sourceLabel: "arXiv:2608.12273",
    pdf: "https://arxiv.org/pdf/2608.12273",
    decision: "選讀",
    kind: "學術論文",
    topics: ["Agent Security", "DDR", "Threat Modeling"],
    summary:
      "提出文字型、與 runtime 無關的 Skill 攻擊：惡意 description 先在選擇階段取得相關性，body 再捏造合理依賴，讓 Agent 走一段耗費資源的繞路後回到原任務並正常完成。",
    findings: [
      "跨多個 LLM backends 與 491 個 held-out tasks，在單次與多輪條件測試。",
      "DeepSeek-V4-Pro 中惡意 coordinator 被選中的比例為 80.02%。",
      "在 coordinator 命中且完成任務的執行中，token 增加 66.91%、端到端時間增加 92.45%，但總體完成率仍相近。",
    ],
    relevance:
      "製造業 Agent 可能在雲端 GPU、工程資料查詢、模擬與工具鏈上產生高成本；只看任務是否完成，會漏掉惡意 Skill 造成的延遲、成本、配額耗盡與異常工具使用。",
    action:
      "在 Skill threat model 加入 trajectory integrity、tool-call budget、token／時間上限與非必要 dependency 偵測；成功任務仍要比對預期路徑與資源基線。",
    caveat:
      "Preprint；最醒目的資源增幅數字來自指定 DeepSeek-V4-Pro 與 coordinator-hit 子集，未證明所有模型與企業工作流程都有相同成本風險，因此判定選讀。",
    crossCheck:
      "補足 runtime contract 的 evidential face：結果正確不代表路徑可信。與 ColluSkill 相比，這篇主要影響資源與軌跡完整性，而非直接資料外洩。",
    metric: "491 任務｜Token +66.91%｜時間 +92.45%",
  },
  {
    id: 20,
    rank: 1,
    week: "2026.08.07",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "Breadcrumbing Search Agents",
    subtitle: "以協調式證據鏈劫持搜尋代理的長流程判斷",
    date: "2026.08.05",
    dateValue: "2026-08-05",
    authors: "Xuebin Li、Hanqing Zhao、Siyuan Liang、Kejiang Chen、Weiming Zhang、Dacheng Tao、Nenghai Yu",
    source: "https://arxiv.org/abs/2608.04565",
    sourceLabel: "arXiv:2608.04565",
    pdf: "https://arxiv.org/pdf/2608.04565",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Data Lineage", "DSPM / DLP", "Threat Modeling"],
    summary:
      "指出搜尋代理即使會追問與交叉核對，也可能被搜尋中介層逐步餵入相互呼應的污染證據；攻擊不是靠單一惡意頁面，而是沿整段研究軌跡建構看似可信的 authority chain。",
    findings: [
      "Authority-Chain Hijack 只需在每次查詢附加一個可控結果，即可把孤立的頁面操控串成一致證據鏈。",
      "在 SafeSearch 完整測試集，ACH 的 Overall ASR 為 55.9%，MaxN ASR 為 83.3%。",
      "Trace-Guided Strategy Evolution 以執行軌跡自動改進攻擊策略，最強設定在保留測試達 71.4%／95.0%。",
    ],
    relevance:
      "採購、法規、供應鏈、設備維修與技術情報 Agent 可能依賴多輪搜尋；若搜尋 API、proxy 或企業 retrieval layer 被操控，表面上的多來源交叉核對反而會強化錯誤結論。",
    action:
      "在 AI System Threat Model 加入搜尋中介層與 trajectory-level lineage；保留每次查詢、排名、抓取內容與來源身分，並以獨立通道驗證高風險決策的關鍵證據。",
    caveat:
      "38 頁 preprint；威脅模型假設攻擊者能控制搜尋中介並在每次查詢插入一個結果，企業環境須依實際 search provider、proxy 與工具權限重測。",
    crossCheck:
      "與 RAG／Memory poisoning 研究方向一致，但攻擊面更早：污染的是代理建立證據的過程。這代表頁面級 Prompt Injection 過濾不足以保護整段調查。",
    metric: "55.9% ASR｜83.3% MaxN ASR",
  },
  {
    id: 21,
    rank: 2,
    week: "2026.08.07",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "MutMem",
    subtitle: "Cryptographically Authorized Mutation in Persistent Agent Memory",
    date: "2026.08.03",
    dateValue: "2026-08-03",
    authors: "Walid Saidi",
    source: "https://arxiv.org/abs/2608.02843",
    sourceLabel: "arXiv:2608.02843",
    pdf: "https://arxiv.org/pdf/2608.02843",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Data Lineage", "DDR", "Threat Modeling"],
    summary:
      "提出持久記憶的授權變更協定：每次非微小權重變動都綁定 provenance、簽章 epoch、前後權重、no-fork predecessor 與雜湊承諾，讓審查者區分合法調整與資料庫竄改。",
    findings: [
      "Poison-likely 內容不直接刪除，而以可修訂的簽章標籤保留，並把標籤納入召回時的信任依據。",
      "原生測試通過授權、拓樸、防竄改、簽章 epoch 與變更後召回案例；簽章轉換延遲中位數 4.865 ms。",
      "在 N=100 PoisonedRAG adaptation，攻擊 top-5 揭露為 0/100；消融實驗在繞過 policy 時選中 poison 94/100，恢復簽章標籤後為 0/100。",
    ],
    relevance:
      "維修、品質、採購或工程 Agent 會隨結果調整長期記憶權重；跨廠區、跨法域的稽核必須能證明誰授權變更、基於何種結果，以及歷史是否被分叉或覆寫。",
    action:
      "為記憶變更建立簽章、append-only audit log、no-fork chain 與獨立 verifier；召回時同時評估內容、來源、授權者、版本與信任標籤。",
    caveat:
      "單一作者、32 頁 preprint，且結果依 HOM-AIMOS／指定資料集；密碼學證據只能證明完整性、授權與歷史連續性，不能證明內容為真。",
    crossCheck:
      "補足 MemSecBench 的治理落地：後者顯示 Write–Execute–Forget 的風險，MutMem 則示範如何對 memory mutation 建立可驗證 lineage。",
    metric: "4.865 ms｜Poison top-5 0/100",
  },
  {
    id: 22,
    rank: 3,
    week: "2026.08.07",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "Permission Denied",
    subtitle: "Policy-Graded Evaluation of Coding Agents in Hardened Environments",
    date: "2026.08.02",
    dateValue: "2026-08-02",
    authors: "Dotan Davidovich、Yair Amar、Hai Rozencwajg、Or Hiltch",
    source: "https://arxiv.org/abs/2608.02670",
    sourceLabel: "arXiv:2608.02670",
    pdf: "https://arxiv.org/pdf/2608.02670",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "DDR", "Threat Modeling"],
    summary:
      "在 scoped credentials、限制 egress、唯讀檔案系統與非 root 執行等企業政策下測試 Coding Agents，證明寬鬆沙箱的 benchmark 無法代表真正受控環境。",
    findings: [
      "12 個 Coding Agents 在 Terminal-Bench 2.1 的巢狀政策層級中受測。",
      "最嚴格政策下成功率最多下降 18.3 個百分點，成本最多增加 167.3%；維持成功率與維持效率的模型排序並不一致。",
      "遭政策阻擋時，Agent 常以 timeout 或錯誤解答收場，而非提早、清楚地拒絕；作者並釋出 Boundary-Bench。",
    ],
    relevance:
      "韌體、BMC、BIOS、測試工具與 CI/CD Agent 應在最小權限、受限網路與唯讀基線下運作；如果只在全權 sandbox 驗證，正式上線後可能以超時或錯誤變更悄悄失敗。",
    action:
      "把生產政策複製到 Agent 驗收環境，分別量測成功率、成本、超時、錯誤解答與拒絕品質；按任務與風險選模型，不以單一 benchmark 排名決策。",
    caveat:
      "Preprint，結果集中於 Terminal-Bench 2.1 與 12 個 Agent；製造企業需針對實際原始碼庫、建置工具、proxy 與憑證政策重跑。",
    crossCheck:
      "與 Agent 權限最小化原則並不衝突；研究的重點是安全政策會改變錯誤模式，因此治理需同時驗證安全性、任務可解性與失敗行為。",
    metric: "成功 -18.3 pts｜成本 +167.3%",
  },
  {
    id: 23,
    rank: 4,
    week: "2026.08.07",
    batch: "本週新發",
    evidenceLevel: "已接受",
    scores: { evidence: 3, relevance: 3, actionability: 3 },
    title: "Why Formal Monitors Fail",
    subtitle: "Attack Distribution Entropy as a Coverage Bound for LTL-Based LLM Agent Safety",
    date: "2026.08.02",
    dateValue: "2026-08-02",
    authors: "Ruiyang Zhang",
    source: "https://arxiv.org/abs/2608.01388",
    sourceLabel: "IEEE IS'26",
    pdf: "https://arxiv.org/pdf/2608.01388",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "DDR", "Threat Modeling"],
    summary:
      "用攻擊分布熵解釋固定 LTL／FSA 規則為何在某些模型可攔截多數惡意工具序列，換到另一模型卻幾乎失效；覆蓋率受攻擊模式集中度上限約束。",
    findings: [
      "跨 8 個前沿模型架構驗證：GPT／DeepSeek 的攻擊分布集中，單一模式涵蓋 96%，monitor recall 為 68%–75%。",
      "Gemini variants 的攻擊分布較分散，7 個 cluster 各不超過 7%，recall 僅 6%–13%，即使依架構重訓仍低。",
      "熵解釋 76% 覆蓋率變異，並提出小型攻擊樣本的部署前 entropy test。",
    ],
    relevance:
      "同一套 Agent runtime policy 若套用到不同廠區、模型或供應商，可能產生完全不同的漏報率；OT、ERP、PLM 等高風險工具不能假設固定序列規則可跨模型移植。",
    action:
      "每個模型／Agent 組合都應獨立量測攻擊分布與 monitor recall；固定規則搭配語意、行為與結果層監控，並把模型升版視為需重驗的安全變更。",
    caveat:
      "已獲 IEEE IS'26 接受，但只有 6 頁，實驗與定理聚焦離散動作序列的 FSA monitor；不代表所有 runtime guard 都受同樣數字約束。",
    crossCheck:
      "研究把先前常被當成模型能力差異的現象轉成可量測的 coverage bound，適合作為 DDR／Agent guard 選型前的壓力測試方法。",
    metric: "8 架構｜Recall 6%–75%",
  },
  {
    id: 24,
    rank: 5,
    week: "2026.08.07",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "DiagChain",
    subtitle: "Evidence-Grounded Attack Chain Reconstruction Benchmark",
    date: "2026.08.04",
    dateValue: "2026-08-04",
    authors: "Xuyang Liu、Yibin Han、Zhenwei Zhang、Kai Chang、Zhiwei Xu、Tian Qiu、Weixian Deng、Jiabao Gao、Xiaolin Peng、Hai Wan、Xibin Zhao",
    source: "https://arxiv.org/abs/2608.03591",
    sourceLabel: "arXiv:2608.03591",
    pdf: "https://arxiv.org/pdf/2608.03591",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["DDR", "Data Lineage", "Agent Security", "Threat Modeling"],
    summary:
      "建立以證據為核心的攻擊鏈重建 benchmark，不只看最終答案，而是逐階段檢查 Agent 是否取回正確 telemetry、納入推理、排序事件並維持結構化事件鏈。",
    findings: [
      "MAIN-69 包含 69 個跨作業系統、噪音層級與攻擊鏈長度的情境，共 849 個 reference steps。",
      "ECRAG 把 evidence retrieval 與持續更新的結構化攻擊鏈表示結合，並以 5 項互補指標診斷失敗位置。",
      "6 個 LLM 的評估中，最強配置也只成功處理 39.6% 的 849 個步驟；大型模型的主要瓶頸轉為事件排序。",
    ],
    relevance:
      "製造業 SOC 必須整合 EDR、身分、雲端、網路與 OT telemetry；AI 若只產生看似合理的攻擊故事，可能誤導隔離設備、停線或供應鏈事件判斷。",
    action:
      "以 stage-wise 指標驗收 IR／DDR Copilot；每個重建步驟必須連回證據 ID、時間與來源，低信心或證據衝突時不得自動執行阻斷。",
    caveat:
      "Preprint；MAIN-69 與 849 個步驟仍是研究型 benchmark，未必涵蓋專有 OT protocol、跨廠區時鐘偏差與企業特有 telemetry。",
    crossCheck:
      "與傳統『最終答案正確率』不同，DiagChain 能揭露 retrieval、證據納入與排序錯誤，較適合用來設計可稽核 DDR Agent。",
    metric: "69 情境｜849 步驟｜39.6%",
  },
  {
    id: 25,
    rank: 6,
    week: "2026.08.07",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "Evading Chain-of-Thought Monitoring Through Model Poisoning",
    subtitle: "以模型後門讓惡意行為保留、推理軌跡卻看似正常",
    date: "2026.08.03",
    dateValue: "2026-08-03",
    authors: "Giorgio Severi、Shujaat Mirza、Blake Bullwinkel、Amanda Minnich",
    source: "https://arxiv.org/abs/2608.02820",
    sourceLabel: "arXiv:2608.02820",
    pdf: "https://arxiv.org/pdf/2608.02820",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "Data Lineage", "Threat Modeling", "DDR"],
    summary:
      "證明 reasoning model 可被植入 CoT-Hidden backdoor：觸發時輸出攻擊者指定行為，但可見推理仍保持無害，使把 Chain-of-Thought 當主要監控訊號的安全堆疊失去依據。",
    findings: [
      "簡單 fine-tuning 即可在不同 reasoning model 架構與規模植入隱藏後門；若直接污染不足，作者以 curriculum training 逐步教會模型隱藏行為。",
      "因果干預定位到不依賴可見推理的 trigger-conditioned activation pathway。",
      "Residual stream verbalization 可在答案生成前發出異常警告，但無法識別 trigger、目標或後門機制。",
    ],
    relevance:
      "若韌體、程式碼或工程 Agent 使用第三方 fine-tune／adapter，乾淨的 CoT 日誌不能證明模型沒有隱蔽目標；供應鏈後門可能在特定產品、客戶或檔案模式下才觸發。",
    action:
      "CoT 監控只作輔助訊號；同時要求模型／adapter lineage、簽章與可信重建，並以輸入觸發探索、輸出行為差異與獨立 policy enforcement 驗收。",
    caveat:
      "15 頁 preprint，摘要未提供可直接比較的整體成功率；內部 activation 分析也不等於已可部署的後門偵測器。",
    crossCheck:
      "與 ToxScreen、VLM 架構後門共同支持：模型來源、權重、adapter、架構及輸出行為都需納入驗收，不能把可解釋性訊號當完整性證明。",
    metric: "跨架構 CoT-Hidden Backdoor",
  },
  {
    id: 26,
    rank: 7,
    week: "2026.08.07",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 2, actionability: 2 },
    title: "Privacy-Preserving AI Verification via Minimal Information Disclosure",
    subtitle: "在可驗證與敏感資訊外洩之間量化最小揭露",
    date: "2026.08.03",
    dateValue: "2026-08-03",
    authors: "Sleem Abdelghafar、Gabriel Kulp",
    source: "https://arxiv.org/abs/2608.02774",
    sourceLabel: "arXiv:2608.02774",
    pdf: "https://arxiv.org/pdf/2608.02774",
    decision: "選讀",
    kind: "學術論文",
    topics: ["Data Lineage", "DSPM / DLP", "Threat Modeling"],
    summary:
      "提出 Minimal Information Disclosure，以條件互資訊量測驗證證據在授權結果之外洩漏多少模型、工作負載或硬體敏感資訊，並探索可驗證性與隱私的前緣。",
    findings: [
      "以 4 種實體量測與 6 項驗證任務，涵蓋執行類型、硬體身分、運算規模與模型身分。",
      "3 種 release 在 held-out 驗證達到完全正確且量測到零 collateral leakage；其他任務呈現明確 privacy–utility frontier。",
      "作者以 Groth16 zk-SNARK 示範可由零知識證明驗證的線性投影 release。",
    ],
    relevance:
      "跨國製造業常需向客戶、總部或稽核方證明工廠 edge AI 使用核准模型與硬體，又不能揭露製程、產能、模型 IP 或客戶 workload。",
    action:
      "在供應商 attestation 與跨法域稽核先定義『可證明主張』和『受保護屬性』，再選證據 channel、收集政策與 release transformation。",
    caveat:
      "Preprint；零量測外洩只成立於指定資料、攻擊者知識與估計方法，不等於任何實務部署下都零洩漏，因此判定選讀。",
    crossCheck:
      "這不是一般 DLP 產品評估，而是驗證資料最小化的設計方法；可補足 AIBOM／attestation 在供應商不願揭露全部細節時的治理選項。",
    metric: "6 任務｜3 組零量測旁漏",
  },
  {
    id: 14,
    rank: 1,
    week: "2026.07.31",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    evidenceLevel: "已接受",
    scores: { evidence: 3, relevance: 3, actionability: 3 },
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
    evidenceLevel: "已接受",
    scores: { evidence: 3, relevance: 3, actionability: 2 },
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
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 2 },
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
    evidenceLevel: "已接受",
    scores: { evidence: 3, relevance: 3, actionability: 3 },
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
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 2, actionability: 2 },
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
    evidenceLevel: "政策報告",
    scores: { evidence: 2, relevance: 2, actionability: 2 },
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
    rank: 1,
    week: "2026.07.17",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    rank: 2,
    week: "2026.07.17",
    batch: "本週新發",
    evidenceLevel: "政策報告",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    rank: 3,
    week: "2026.07.17",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    rank: 4,
    week: "2026.07.17",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    rank: 5,
    week: "2026.07.17",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
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
    rank: 6,
    week: "2026.07.17",
    batch: "本週新發",
    evidenceLevel: "廠商遙測",
    scores: { evidence: 1, relevance: 2, actionability: 2 },
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
    rank: 7,
    week: "2026.07.17",
    batch: "本週新發",
    evidenceLevel: "廠商遙測",
    scores: { evidence: 1, relevance: 2, actionability: 2 },
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

export const TOPIC_FILTERS = [
  "全部",
  "Agent Security",
  "DSPM / DLP",
  "Data Lineage",
  "DDR",
  "Threat Modeling",
] as const;

export const CURRENT_WEEK = [...new Set(readings.map((reading) => reading.week))].sort((a, b) => b.localeCompare(a))[0];
export const currentReadings = readings.filter((reading) => reading.week === CURRENT_WEEK);
export const archiveReadings = readings.filter((reading) => reading.week !== CURRENT_WEEK);
export const archiveWeeks = [...new Set(archiveReadings.map((reading) => reading.week))].sort((a, b) => b.localeCompare(a));
export const priorityReading = [...currentReadings].sort((a, b) => a.rank - b.rank)[0];
export const currentStats = {
  total: currentReadings.length,
  deep: currentReadings.filter((reading) => reading.decision === "深入審閱").length,
  selective: currentReadings.filter((reading) => reading.decision === "選讀").length,
  new: currentReadings.filter((reading) => reading.batch === "本週新發").length,
  catchUp: currentReadings.filter((reading) => reading.batch === "補遺").length,
};
export const allWeeks = [...new Set(readings.map((reading) => reading.week))].sort();

/** Atom feed 涵蓋最近幾期：漏看一週的訂閱者仍能補上，不必回站上翻歷史。 */
export const FEED_WEEKS = 3;
export const feedWeeks = allWeeks.slice(-FEED_WEEKS).reverse();
export const archiveDateRange = archiveWeeks.length ? [archiveWeeks.at(-1), archiveWeeks[0]].join("—") : "尚無歷史資料";

export const evidenceOrder: Record<EvidenceLevel, number> = {
  "同儕審查": 5,
  "已接受": 4,
  "政策報告": 4,
  "Preprint": 2,
  "廠商遙測": 1,
};

export const RUBRIC_WEIGHTS = {
  evidence: 0.35,
  relevance: 0.35,
  actionability: 0.3,
} as const;

/** 加權總分達此門檻且無任一軸為 1 者列為深入審閱。 */
export const DEEP_REVIEW_THRESHOLD = 2.4;

/** 加權總分，範圍 1.00–3.00，四捨五入至小數兩位。 */
export function weightedScore(scores: RubricScores): number {
  const total =
    scores.evidence * RUBRIC_WEIGHTS.evidence +
    scores.relevance * RUBRIC_WEIGHTS.relevance +
    scores.actionability * RUBRIC_WEIGHTS.actionability;
  return Math.round(total * 100) / 100;
}

/**
 * 由三軸分數推導判定。資料中仍保留 decision 欄位作為編輯當下的紀錄，
 * 並以測試確保兩者一致；若日後調整分數而未同步判定，測試會失敗，
 * 迫使判定的改變成為明確決定而不是副作用。
 */
export function deriveDecision(scores: RubricScores): Reading["decision"] {
  const axes = [scores.evidence, scores.relevance, scores.actionability];
  if (axes.includes(1)) return "選讀";
  return weightedScore(scores) >= DEEP_REVIEW_THRESHOLD ? "深入審閱" : "選讀";
}

export function isRetracted(reading: Reading): boolean {
  return (reading.corrections ?? []).some((correction) => correction.type === "撤稿");
}

export function hasCorrections(reading: Reading): boolean {
  return (reading.corrections ?? []).length > 0;
}

/** 依日期新到舊列出所有已發佈項目的修訂紀錄。 */
export const correctionLog = readings
  .flatMap((reading) => (reading.corrections ?? []).map((correction) => ({ reading, correction })))
  .sort((a, b) => b.correction.date.localeCompare(a.correction.date));

export const editorialMethod = {
  scoreScale: "每軸 1–3 分：1 = 明顯不足，2 = 部分達成，3 = 完整達成。",
  rubric: [
    { axis: "證據等級", key: "evidence" as const, weight: "35%", deep: "原始研究、已接受／同儕審查，或方法透明的權威政策研究", selective: "Preprint 或廠商遙測，但限制清楚且可交叉核實" },
    { axis: "製造業關聯", key: "relevance" as const, weight: "35%", deep: "可直接映射 IP、BOM、PLM、ERP、韌體、OT 或跨境治理", selective: "方向相關，但需大量情境轉譯或企業重測" },
    { axis: "行動可落地性", key: "actionability" as const, weight: "30%", deep: "可轉換為 threat model、控制、驗收或偵測測試", selective: "主要用於趨勢理解或治理背景" },
  ],
  decisionRule: `加權總分 = 證據等級×0.35 ＋ 製造業關聯×0.35 ＋ 行動可落地性×0.30。總分達 ${DEEP_REVIEW_THRESHOLD.toFixed(2)} 且無任一軸為 1 分者列為深入審閱，其餘列為選讀。每一筆的三軸分數與總分都公開於卡片與詳細頁，可逐項覆核。`,
  rankingRule: "同一週先依製造業風險急迫性與可採取行動程度排序，再以證據等級、交叉核實完整度及發布日期作為同分決勝。",
  correctionRule: "已發佈項目不刪除。原始研究撤稿、數據更正或被後續研究取代時，於該筆加註修訂紀錄並在卡片與詳細頁顯示；撤稿項目不再進入「建議下一步」。",
  verifiedChecklist: ["原始連結可識別且使用 HTTPS", "作者／機構與發布日期已對照原始頁面", "摘要中的關鍵數字可回溯原文", "限制、樣本與不可外推範圍已揭露", "重要主張至少以獨立研究或權威框架交叉判讀"],
  sourceScope: ["arXiv 與已接受／同儕審查論文", "政府與權威政策研究", "具方法揭露的安全研究團隊報告", "製造業 AI、DSPM／DLP、Data Lineage、DDR 與 Agent Security 主題來源"],
} as const;

export type WeeklyEditorial = {
  scanned: number | null;
  shortlisted: number | null;
  note: string;
  skipped: { title: string; source: string; reason: string }[];
};

const NOT_RETAINED =
  "本期未保留完整候選數與初篩數；依透明原則標示為未留存，不以推估值補填。自 2026.08.14 當期起固定記錄。";

/**
 * 每週的入選漏斗與略過清單各自保存，新增週次不會覆寫既有紀錄。
 */
export const weeklyEditorials: Record<string, WeeklyEditorial> = {
  "2026.08.14": {
    scanned: 188,
    shortlisted: 14,
    note: "本期檢視 arXiv cs.CR 近期提交共 188 筆，依製造業關聯、證據透明度與可落地性初篩 14 筆，最終入選 8 筆；本週未找到方法透明且可獨立核實的新 DSPM 專題研究，因此未以產品行銷內容補數。",
    skipped: [
      { title: "From Prompt Injection to Web Exploitation", source: "https://arxiv.org/abs/2608.10281", reason: "攻擊分類值得追蹤，但公開摘要僅揭露 5 個情境與 7 個模型，缺少可比較的整體結果，暫不列核心證據。" },
      { title: "When Agents Talk", source: "https://arxiv.org/abs/2608.11436", reason: "屬單一作者理論型 preprint，且部分論證依賴尚未有完整官方事故報告的事件敘事，待更多原始證據。" },
      { title: "2026 AI Adoption & Risk Report — Manufacturing", source: "https://www.cyberhaven.com/resources/report/2026-ai-adoption-risk-report-manufacturing", reason: "公開頁面未揭露完整方法、樣本與製造業分層，且完整內容需留下資料下載；不以廠商行銷頁替代可查核研究。" },
    ],
  },
  "2026.07.17": { scanned: null, shortlisted: null, note: NOT_RETAINED, skipped: [] },
  "2026.07.24": { scanned: null, shortlisted: null, note: NOT_RETAINED, skipped: [] },
  "2026.07.31": { scanned: null, shortlisted: null, note: NOT_RETAINED, skipped: [] },
  "2026.08.07": {
    scanned: null,
    shortlisted: null,
    note: NOT_RETAINED,
    skipped: [
      { title: "PolicyGuard", source: "https://arxiv.org/abs/2608.02687", reason: "作者已主動撤稿，表示發現重大不一致且無法確認報告數值；不列入核心證據。" },
    ],
  },
};

export function editorialFor(week: string) {
  const record = weeklyEditorials[week] ?? { scanned: null, shortlisted: null, note: NOT_RETAINED, skipped: [] };
  return {
    week,
    ...record,
    selected: readings.filter((reading) => reading.week === week).length,
  };
}

export const currentEditorial = editorialFor(CURRENT_WEEK);

export function readingSearchText(reading: Reading) {
  return [reading.title, reading.subtitle, reading.authors, reading.summary, reading.relevance, reading.action, reading.metric ?? "", ...reading.findings, ...reading.topics].join(" ").toLowerCase();
}

