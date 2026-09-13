import type { Provenance } from "./provenance";
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
  provenance?: Provenance;
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
  /** Optional stage diagram shown next to the featured reading on the home page. */
  spotlight?: { heading: string; text: string }[];
  lifecycle?: { label: string; stages: string[]; caption: string };
};

export const readings: Reading[] = [
{
  "action": "READ NOW，優先讀第 3、4、6 節，約 30 分鐘；電力模型細節由廠務專業人員複核。先選一個自有廠區，以既有資產、網路規則及維運契約核對能源 gateway、對外管理介面與廠商帳號；要求核准的存取路徑、停用帳號證據及復原演練紀錄。只在授權測試環境確認拒絕非核准來源，不掃描第三方或切換生產電力。",
  "authors": "Anna Raymaker、Samuel Talkington 等 11 人｜Georgia Institute of Technology",
  "batch": "本週新發",
  "caveat": "已接受狀態依 arXiv 稿件／作者資訊；ACM DOI 本次無法完整取得。公開全文有方法，但主機資料與搜尋管線未公開，電力分析網站本次不可讀，未獨立重現。IP 定位、分類錯誤及穩態假設限制外推；保護電驛與動態協調未完整建模。研究揭露 DOE／NSF 支持，不屬廠商產品效能證明。",
  "crossCheck": "Published at 2026-09-07；v2 更新 2026-09-09；Last verified at 2026-09-12。Confidence：Medium。Verification Status：論文數字／方法已核對，作者實驗尚未獨立重現；工廠適用性屬推論。另查核 Texas A&M 資料提供者，Hawaii40 明示為合成電網而非實際 Oahu 網路：https://electricgrids.engr.tamu.edu/ 。深入審閱理由：能轉成能源設備採購、整合商交付與遠端維運驗收條件；不把最壞情境模型當成事故率。",
  "date": "2026.09.07",
  "dateValue": "2026-09-07",
  "decision": "深入審閱",
  "evidenceLevel": "已接受",
  "findings": [
    "作者識別 66,379 個公開可達 DER hosts，11,826 個依揭露版本匹配潛在 CVE；這不是已成功入侵的數量，host 也不能直接等同實體逆變器。",
    "Oahu 情境將 571 個觀測對象映射為 41.1 MW，於合成 37-bus 模型分別求各元件最壞情境。18 個 bus、6 條線路的結果不是一次攻擊同時達成，也不是當地真實電網的停電預測。",
    "Snapshot 2 僅抽查 100 個預測陽性及 100 個預測陰性。後者 98/100 為正確排除，不能直接當成母體 recall；本期不採用表 2 將其列為 98% recall 的說法。"
  ],
  "id": 73,
  "provenance": {"origins":["chatgpt-enterprise"],"reviewedBy":"chatgpt-enterprise","checkedAt":"2026-09-12","evidence":"https://github.com/chinchiang/WeeklySecurityResearch/blob/main/public/reading-runs/2026-09-12-enterprise.json"},
  "kind": "學術論文",
  "pdf": "https://arxiv.org/pdf/2609.07783v2",
  "rank": 10,
  "relevance": "Inferred relevance：若跨國工廠有屋頂光電、能源管理或第三方遠端維運，應納入 OT 資產盤點、遠端存取、廠務變更與營運持續治理。本研究沒有證明任何特定 ODM/OEM 已暴露或受影響。",
  "scores": {
    "actionability": 3,
    "evidence": 2,
    "relevance": 3
  },
  "source": "https://arxiv.org/abs/2609.07783",
  "sourceLabel": "arXiv 2609.07783v2｜CCS 2026",
  "subtitle": "廠務能源設備的遠端管理介面，也應納入 OT 邊界與維運責任。",
  "summary": "研究從兩次相隔約四個月的 Internet 掃描資料識別太陽能 DER，再以合成電網量化潛在影響。值得採用的是部署者與整合商也須負責暴露面治理；設備原廠安全設定不能取代安裝後驗收。",
  "title": "Grid Trouble in Paradise",
  "topics": [
    "OT / ICS",
    "Remote Access",
    "供應鏈治理"
  ],
  "week": "2026.09.11"
},
{
  "id": 71,
  "provenance": {"origins":["chatgpt-ai"],"reviewedBy":"chatgpt-ai","checkedAt":"2026-09-12","evidence":"https://github.com/chinchiang/WeeklySecurityResearch/blob/main/public/reading-runs/2026-09-12-ai.json"},
  "rank": 8,
  "week": "2026.09.11",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "Signing the Transaction but Not the Decision",
  "subtitle": "AP2 Whisper：交易簽章有效，仍可能簽下被商家文字帶偏的決策。",
  "date": "2026.09.10",
  "dateValue": "2026-09-10",
  "authors": "Yedidel Louck、Amit Dvir、Ariel Stulman｜Ariel University／Jerusalem College of Technology",
  "source": "https://arxiv.org/abs/2609.11757",
  "sourceLabel": "arXiv 2609.11757v1",
  "pdf": "https://arxiv.org/pdf/2609.11757v1",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Agent Security",
    "AI System Threat Modeling",
    "Identity"
  ],
  "summary": "研究將商家控制的商品描述分成三種攻擊：跨帳戶憑證別名查詢、購物車內容竄改，以及以庫存／替代品說法誘導較昂貴的選擇。最後一種可讓購物車與展示資料完全一致，結構驗證仍會放行。",
  "findings": [
    "在 AP2 v0.2.0 human-present 參考部署，Vault／Branded 最後措辭輪分別為 45/50、28/50；Selection 在不同的 GA 模型為 66/90。三列分母與模型不同，不能當成共同基準排名。",
    "A-VIP 將憑證查詢綁定 session、購物車綁定展示快照與收款者；Selection 只能提示額外支出供使用者確認，不能宣稱已消除。",
    "AP2-WhisperBench 有 1,544 情境，但屬公開開發／回歸集，非 held-out 泛化測試；論文提供程式、TLA+ 規格與回應紀錄。"
  ],
  "relevance": "情境推論：採購 Agent 串接 ERP、供應商型錄與付款時，既有登入與有效簽章不足以證明替代料、收款者及額外支出符合原核准。公司是否採用 AP2 尚無部署證據。",
  "action": "優先讀第 4–7 節及第 11 節。以合成型錄及虛構帳戶比較 prompt-only 與外部 policy gate：跨帳戶查詢、未展示料號、未核准收款者必須拒絕；超出明確預算須阻擋或取得有效核准。保留 session、授權範圍、展示快照與實際工具結果；本次僅提出測試，未執行攻擊。",
  "caveat": "未經獨立重現的預印本；消費產品部分組別只有 8–13 次，部分跨模型觀察僅一次。主實驗不是 human-not-present 全流程驗證；作者所稱供應商接受弱點尚無可公開案號佐證。不能推定所有 AP2 部署目前均受影響。",
  "crossCheck": "2026-09-12 查核 v1 全文方法、表 3 及限制；另核對 AP2 v0.2 官方規格與公開 A-VIP repository。官方區分人員直接核准及自主模式，並明定自主模式的 constraint 驗證；因此本篇判定限於特定參考實作與商家輸入的決策風險。協定原文：https://ap2-protocol.org/ap2/specification/ 。實作：https://github.com/yedidel/avip_defense 。深入審閱理由：可轉成模型外的授權驗收條件。"
},
{
  "id": 72,
  "provenance": {"origins":["chatgpt-ai"],"reviewedBy":"chatgpt-ai","checkedAt":"2026-09-12","evidence":"https://github.com/chinchiang/WeeklySecurityResearch/blob/main/public/reading-runs/2026-09-12-ai.json"},
  "rank": 9,
  "week": "2026.09.11",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 2,
    "actionability": 3
  },
  "title": "Atlas: Efficient Verifiable Semantic Search",
  "subtitle": "讓 RAG 檢索對承諾的索引與演算法提出證明；資料本身的可信度仍須另管。",
  "date": "2026.09.10",
  "dateValue": "2026-09-10",
  "authors": "Nikolay Avramov、Hidde Lycklama、Alexander Viand、Anwar Hithnawi｜University of Toronto／Belfort Labs",
  "source": "https://arxiv.org/abs/2609.11841",
  "sourceLabel": "arXiv 2609.11841v1",
  "pdf": "https://arxiv.org/pdf/2609.11841v1",
  "decision": "選讀",
  "kind": "學術論文",
  "topics": [
    "RAG",
    "Data Lineage",
    "AI Data Protection"
  ],
  "summary": "Atlas 以零知識證明驗證 HNSW 查詢是否依約定程序操作已承諾的索引，將資料庫相關成本移到離線前處理。這能處理服務端偷減搜尋或換索引的風險，但不等於證明文件正確、最新或具合法存取權。",
  "findings": [
    "表 1 的 SIFT1M 證明時間為 0.80 秒、100M 向量為 1.98 秒；960 維 GIST1M 則為 36.66 秒。測試主機具 96 核 CPU、768 GB RAM，前處理使用 H100，不能把約 2 秒當成一般 RAG SLA。",
    "保證相對於承諾索引及固定搜尋預算；8-bit 量化在 GIST1M 某組態損失 5.2 個 recall@1 百分點。完整 RAG 評測的 proving time 另有 13.3 秒組態。",
    "查詢明文送至服務端；索引構造的正確性不在此證明範圍。沒有主張同時提供 query confidentiality、DLP 或來源真實性。"
  ],
  "relevance": "情境推論：跨公司託管的製造知識庫、設計 IP 檢索可將「服務確實查了指定索引」獨立驗收，並與資料版本、租戶 ACL、保留期限及來源證據結合。",
  "action": "優先讀第 4 節威脅模型與第 6 節效能／量化取捨。使用公開文件建立兩個索引版本及合成權限群組，比較普通 HNSW 與可驗證檢索；竄改 commitment 或回傳集合須驗證失敗，另量測召回與 p95 成本。查詢保密及 ACL 另列獨立測試；本次未重現實驗。",
  "caveat": "預印本、作者原型；Belfort Labs 有商業機構關聯，未取得更完整利益揭露。本次取得全文並檢視構造、威脅模型與評測，未驗證整套密碼學證明，也未定位可獨立執行的 Atlas 完整程式包。",
  "crossCheck": "2026-09-12 核對 v1 第 4–6 節與表 1。低維整數向量、量化後高維檢索及完整 RAG 的數字分別保留，不混成單一效能結論。選讀理由：可定義檢索完整性驗收，但成熟度與成本尚不足以形成採購建議。"
},
{
  "id": 64,
  "rank": 1,
  "week": "2026.09.11",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "VEX-Bench",
  "subtitle": "AI 能判斷是否受影響，卻未必能提出正確理由。",
  "date": "2026.09.07",
  "dateValue": "2026-09-07",
  "authors": "Jiahao Shi、Edward Tsien、Yifeng Di 等 13 人；Purdue University／Red Hat",
  "source": "https://arxiv.org/abs/2609.08040",
  "sourceLabel": "arXiv 2609.08040",
  "pdf": "https://arxiv.org/pdf/2609.08040",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Agent Security",
    "Product Security",
    "Threat Modeling"
  ],
  "summary": "75 個真實案例顯示，模型判斷 affected／not_affected 的能力高於辨識細部理由的能力。VEX 不應僅憑 AI 二元結論關案。",
  "findings": [
    "75 案涵蓋 67 個 CVE、35 個 Python／Java／Go 專案，並比較九個模型與三種 harness。",
    "Claude Opus 4.6、GPT-5.5 的 status F1 為 81.6%、79.9%；只有 GPT-5.5 的理由 macro-F1 超過 70%。",
    "70.7% 案例為 not_affected；資料不平衡與分類粒度會影響分數解讀。"
  ],
  "relevance": "適合 ODM/OEM 的產品軟體與供應商元件 triage；沒有 C/C++ 與韌體專屬驗證，因此 BMC／BIOS 的適用性須另測。",
  "action": "抽取 10 個既有 PSIRT 案件盲測；每案保存版本、call path、設定與引用證據，由人工核准 VEX 發布。",
  "caveat": "規模小，repository 證據無法涵蓋客戶部署與執行期輸入。作者包含 Red Hat 人員，具有供應鏈安全研究與產品利益；EMNLP 接受狀態依作者登錄，未另核對會議名單。",
  "crossCheck": "2026-09-12 重新取得 arXiv v1 全文並核對方法、結果與限制。研究數值屬作者回報，本次未重跑實驗。",
  "metric": "75 案 · status F1 最高 81.6%"
},
{
  "id": 65,
  "rank": 2,
  "week": "2026.09.11",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "Learning Intrusion Response Strategies for OT Systems",
  "subtitle": "先衡量回應風險，再討論自動隔離。",
  "date": "2026.09.09",
  "dateValue": "2026-09-09",
  "authors": "Duc Huy Le、Rolf Stadler；KTH",
  "source": "https://arxiv.org/abs/2609.10298",
  "sourceLabel": "arXiv 2609.10298",
  "pdf": "https://arxiv.org/pdf/2609.10298",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "OT / ICS",
    "Threat Modeling",
    "Agent Security"
  ],
  "summary": "以 POMDP 與 BF-PPO 處理有限網路觀測下的 OT 回應決策；作者明確承認尚未纳入 operational safety。",
  "findings": [
    "以 Purdue 網路情境與三類攻擊者策略評估學習式回應，BF-PPO 接近完全可觀察基準。",
    "動作被簡化為離散、同步且立即生效；尚未檢驗跨組態與攻擊類型的一般化。",
    "作者將 operational safety 列為後續工作，不能把實驗策略直接交給生產網路执行。"
  ],
  "relevance": "企業網路到 supervisory／control／physical subnet 的橫向移動，需要同時計入製程可用性與安全後果。",
  "action": "在既有 OT PoC 使用 shadow mode；保存建議動作、safety invariant、人工否決理由與錯誤隔離成本。",
  "caveat": "研究環境與產線仍有距離。本文不是 IEC 62443 符合性證明，也沒有證明自動封鎖 PLC 安全。",
  "crossCheck": "2026-09-12 重新取得 arXiv v1 全文並核對方法、結果與限制。研究數值屬作者回報，本次未重跑實驗。"
},
{
  "id": 66,
  "rank": 3,
  "week": "2026.09.11",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "Do AI Coding Assistants Check Before They Install?",
  "subtitle": "供應鏈證明必須由執行環境強制驗證。",
  "date": "2026.09.07",
  "dateValue": "2026-09-07",
  "authors": "Pengyin Shan",
  "source": "https://arxiv.org/abs/2609.07754",
  "sourceLabel": "arXiv 2609.07754",
  "pdf": "https://arxiv.org/pdf/2609.07754",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Product Security",
    "Agent Security",
    "Data Lineage"
  ],
  "summary": "安裝前很少讀取 SBOM、簽章或 attestation；研究中沒有觀察到真正執行驗證命令。提供證明不等於消費端有使用。",
  "findings": [
    "主實驗 1,920 次中有 9 次符合作者的複合陽性規則；Table 6 顯示 6 次在安裝前讀取，另 3 次讀取後未完成安裝。",
    "含補充模型共 2,114 次；讀取信號與執行驗證命令是不同事件，後者回報為零。",
    "六個研究軟體專案、離線容器及全部由腳本核准的 gated 模式，限制了企業流程外推。"
  ],
  "relevance": "ODM/OEM 即使已要求交付 SBOM 或 provenance，coding agent 仍可能直接安裝。CI、套件代理與 agent harness 應負責執行政策。",
  "action": "在測試容器放入有效與錯誤 issuer 的簽章及 attestation；驗證失敗須阻止安裝，並保存命令結果與制止證據。",
  "caveat": "預印本摘要把九次都描述為 before installing，與表 6 的時序分類不完全一致；本次採表格細分。合成信號及無套件索引環境，不代表一般開發者使用率。",
  "crossCheck": "2026-09-12 重新取得 arXiv v1 全文並核對方法、結果與限制。研究數值屬作者回報，本次未重跑實驗。",
  "metric": "6 次安裝前讀取＋3 次未完成安裝；0 次驗證命令",
  "corrections": [
    {
      "date": "2026.09.12",
      "type": "更正",
      "note": "修正 9/11 對話版：9 次為複合陽性，不全是安裝前讀取；以 Table 6 的 6＋3 分解呈現。",
      "source": "https://arxiv.org/abs/2609.07754"
    }
  ]
},
{
  "id": 70,
  "rank": 4,
  "week": "2026.09.11",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 2,
    "actionability": 3
  },
  "title": "A2ABreak: Systematic Security Analysis of the A2A Protocol",
  "subtitle": "Architecture Spotlight｜跨 Agent 委派仍需企業自己的授權邊界。",
  "date": "2026.09.09",
  "dateValue": "2026-09-09",
  "authors": "Alireza Lotfi、Mirza Masfiqur Rahman、Imtiaz Karim、Elisa Bertino；Purdue University／UT Dallas",
  "source": "https://arxiv.org/abs/2609.10871",
  "sourceLabel": "arXiv 2609.10871",
  "pdf": "https://arxiv.org/pdf/2609.10871",
  "decision": "選讀",
  "kind": "學術論文",
  "topics": [
    "Architecture",
    "Agent Security",
    "Threat Modeling",
    "DSPM / DLP"
  ],
  "summary": "以規格抽取狀態機，再以對抗檢查與人工審閱分析 A2A。本文適合用來檢查跨系統委派，但「所有合規部署都有弱點」並未獲本次核實。",
  "findings": [
    "作者由 929 條敘述產生 37 個狀態、76 個轉移；專家確認 11 項候選發現。",
    "核心情境是 context 所有權、跨跳身分與自述技能可信度；它們都是 ERP／PLM Agent 整合時應明確決策的事項。",
    "本次對照官方規格：§7.5 把授權政策交給實作；§7.6.3 已建議憑證綁定及保密；§7.6.4 明示 auth-required 不是操作授權。"
  ],
  "relevance": "最有價值的是把協定相容性和業務授權分開驗收。跨客戶 BOM、報價與 PLM 變更，不應只依賴 AgentCard 或共享 contextId 決定資料可見性。",
  "action": "選一條 ERP／PLM → Agent → 供應商路徑，驗證跨租戶 context 隔離、逐跳 audience／scope、撤銷後串流停止與實際副作用。",
  "caveat": "預印本未驗證 SAP／S/4HANA 或實廠部署。官方規格為動態頁，不能假設與作者使用快照相同；未重跑作者形式模型。作者稱沒有開源參考實作，但官方 Python SDK 已可取得，此理由不採納。",
  "crossCheck": "2026-09-12 完整取得並讀取 arXiv v1（正文、限制與附錄）；另對照 A2A 官方規格及官方 Python SDK。作者 artifact repository 已公開，聲稱 ACSAC 2026 接受；本次未核對會議官方名單，故仍以 Preprint 標示。",
  "spotlight": [
    {
      "heading": "為什麼選這篇",
      "text": "這篇把 Agent 通訊規格轉為可逐項反駁的安全假設，適合技術背景主管帶領架構評審。最近八週內的新研究，沒有回溯舊文；判定為選讀，因部署層主張仍超過現有證據。"
    },
    {
      "heading": "核心論點與證據品質",
      "text": "作者以規格抽取、狀態機與對抗式檢查串起論證，再由專家審閱候選。73.3% precision 是候選經人工判定的結果，不是產品攻擊成功率。模型化方法具可追溯性，但不等於完整形式證明，也不是企業部署安全驗證。"
    },
    {
      "heading": "已查證／作者主張／本次推論",
      "text": "已查證：原文有上述方法與數值，artifact repository 可讀，官方規格保留實作層授權责任。作者主張：11 項是完全合規下可利用的協定弱點。本次未獨立證實所有攻擊鏈；尤其憑證保護須與官方 §7.6.3 一起讀。本次推論：A2A 相容性驗收須另加企業授權與資料政策測試。"
    },
    {
      "heading": "對跨國 ODM／EMS 的實務意涵",
      "text": "以跨臺灣、中國、美國、墨西哥與捷克的部署為分析情境：每個區域應記錄資料擁有者、租戶、代理身分、用途及可用的下游服務。China zone 的資料與管理平面隔離屬待確認的公司架構要求；本文不證明 CSL／DSL／PIPL 的具體法律適用性，也不能由某次登入推定所有區域均可存取。"
    },
    {
      "heading": "標準與架構決策",
      "text": "以 NIST SP 800-207 的資源導向授權作概念對照；把 ERP／PLM 的業務權限保留在權威系統，Agent 僅持有限委派。IEC 62443 zones/conduits 可協助安排 OT 跨區執行點，卻不能取代對操作內容的授權。未取得 ISO 27001／IEC 62443 標準全文，本次不宣稱條號映射或符合性。"
    },
    {
      "heading": "四項最小驗證行動",
      "text": "① 以兩個測試客戶嘗試重用同一 contextId，保存拒絕與資料隔離證據。② 以三跳委派驗證原始主體、audience、scope 和期限都能追溯。③ 撤銷權限後測試既有串流與後續訊息，確認不再產生副作用。④ 用偽造技能描述測試 Agent 發現流程，要求資料提供前通過允許清單、用途限制與 DLP。這些是建議測試，未宣稱公司已執行。"
    },
    {
      "heading": "閱讀路線、盲點與利益衝突",
      "text": "建議架構、IAM、AI 平台、SAP／PLM 與 OT Security 人員閱讀，約 35–45 分鐘。細讀 III、VI、VIII 與官方規格 §7.5–7.6；熟悉 FSM 者可略讀 IV 的管線細節，採用率與成本敘事非必要。盲點包括實際 SDK 行為、SAP 授權物件、操作安全、跨境日誌與復原流程。研究由 NSF／學研資助等支持，未見產品銷售訴求；未找到完整獨立利益衝突審查。"
    },
    {
      "heading": "交叉查核來源",
      "text": "A2A 官方規格：https://a2a-protocol.org/latest/specification/ ；官方 Python SDK：https://github.com/a2aproject/a2a-python ；作者 artifact：https://github.com/arlotfi79/A2ABreak ；NIST SP 800-207：https://csrc.nist.gov/pubs/sp/800/207/final 。版本查核日期均為 2026-09-12；外部 Cowork 歷史全文不可讀，跨平台去重仍有缺口。"
    }
  ]
},
{
  "id": 67,
  "rank": 5,
  "week": "2026.09.11",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 2,
    "actionability": 3
  },
  "title": "MemSentry",
  "subtitle": "長期記憶寫入前的風險審查，仍須防範可信內部來源。",
  "date": "2026.09.08",
  "dateValue": "2026-09-08",
  "authors": "Ayan Roy、Kaustuvi Basu；Christopher Newport University／Independent Researcher",
  "source": "https://arxiv.org/abs/2609.08747",
  "sourceLabel": "arXiv 2609.08747",
  "pdf": "https://arxiv.org/pdf/2609.08747",
  "decision": "選讀",
  "kind": "學術論文",
  "topics": [
    "Agent Security",
    "Threat Modeling"
  ],
  "summary": "把來源信任、語意風險、依賴圖、存取風險與安全狀態變化，組合為 Accept／Review／Quarantine 的寫入前判定。",
  "findings": [
    "1,000 個 GPT-4 合成情境中，SBERT＋LR 回報 91.7% accuracy、0.908 macro-F1。",
    "signed security-state delta 表示正負變化：負值為弱化、正值為強化，不是數位簽章。",
    "細微語意對照中 SBERT、SetFit 的 pair accuracy 均為 0/10；可信內部來源還存在無法進入 quarantine 的結構限制。"
  ],
  "relevance": "採購、維修與 PLM Agent 的記憶可能把臨時核准寫成永久權限；記憶寫入應視為政策影響事件。",
  "action": "對已驗證／已授權、臨時／永久等成對情境測試 pre-commit gate；正式授權仍連回權威事件。",
  "caveat": "合成資料與靜態隨機資產圖；不能以整體 accuracy 當成企業防護率。來源已驗證不代表行為已授權。",
  "crossCheck": "2026-09-12 重新取得 arXiv v1 全文並核對方法、結果與限制。研究數值屬作者回報，本次未重跑實驗。",
  "corrections": [
    {
      "date": "2026.09.12",
      "type": "更正",
      "note": "修正 9/11 對話版：signed delta 為正負數值，不是「簽署後的」安全狀態。",
      "source": "https://arxiv.org/abs/2609.08747"
    }
  ]
},
{
  "id": 68,
  "rank": 6,
  "week": "2026.09.11",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 2,
    "actionability": 3
  },
  "title": "Benchmark Scores Are Pipeline-Dependent",
  "subtitle": "資安模型分數同時量到模型與評測管線。",
  "date": "2026.09.08",
  "dateValue": "2026-09-08",
  "authors": "Aymene Berriche、Cathrine Shalby、Mohannad Alhanahnah、Yazan Boshmaf",
  "source": "https://arxiv.org/abs/2609.08765",
  "sourceLabel": "arXiv 2609.08765",
  "pdf": "https://arxiv.org/pdf/2609.08765",
  "decision": "選讀",
  "kind": "學術論文",
  "topics": [
    "AI Governance",
    "Threat Modeling"
  ],
  "summary": "八個資安 benchmark、23 個任務與十個模型的稽核，揭露輸出截斷、抽取及評分慣例會大幅改變結果。",
  "findings": [
    "作者辨識 15 類管線問題，個別選擇可造成逾 80 個百分點分數差異。",
    "統一部分設定後，十個模型中九個在至少一項 benchmark 移動三個以上名次。",
    "結果檢驗 measurement reliability；不是對實際資安能力的完整 construct validity 驗證。"
  ],
  "relevance": "SOC、AppSec 與 VEX Agent 的採購應保存模型及整條評測管線組態，避免拿不同 harness 的分數直接排行。",
  "action": "讓 PoC 保存 evaluation manifest：模型版本、prompt、token budget、judge、抽取規則、分母及重跑結果。",
  "caveat": "研究限資安 benchmark，部分標準化選擇及 LLM judge 仍有爭議；不可推論任何指定模型一定較安全。",
  "crossCheck": "2026-09-12 重新取得 arXiv v1 全文並核對方法、結果與限制。研究數值屬作者回報，本次未重跑實驗。"
},
{
  "id": 69,
  "rank": 7,
  "week": "2026.09.11",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 2,
    "actionability": 3
  },
  "title": "Attestream",
  "subtitle": "資料交付、用途回報與衍生物，應有連續的 provenance。",
  "date": "2026.09.07",
  "dateValue": "2026-09-07",
  "authors": "Kentaro Oda",
  "source": "https://arxiv.org/abs/2609.07641",
  "sourceLabel": "arXiv 2609.07641",
  "pdf": "https://arxiv.org/pdf/2609.07641",
  "decision": "選讀",
  "kind": "學術論文",
  "topics": [
    "Data Lineage",
    "DSPM / DLP"
  ],
  "summary": "以雙方簽署交付、使用回報及衍生紀錄連結資料生命週期，再以資料指紋輔助追查外洩。",
  "findings": [
    "資料本體在鏈外交換；帳本保存交付、身分、時間、連結與簽章。",
    "使用回報可控制後续供應，但模型 hash 不能證明資料真的用於訓練。",
    "作者揭露自己為相關日本專利 JP 7894573 B2 發明人之一，屬重要利益關係。"
  ],
  "relevance": "品質影像、設備遙測、客戶設計與聯合訓練資料的交付，宜一起記錄收受方、用途、衍生物及再散布。",
  "action": "先用一份合成資料驗證雙方簽收、用途與版本的可追溯性，再評估指紋或帳本是否帶來額外價值。",
  "caveat": "單一作者原型，假設帳本可信；改寫、裁切、多方共謀與公開帳本活動模式仍有限制。不能當作 DSPM／DLP 產品效能證明。",
  "crossCheck": "2026-09-12 重新取得 arXiv v1 全文並核對方法、結果與限制。研究數值屬作者回報，本次未重跑實驗。"
},
{
  "id": 49,
  "rank": 1,
  "week": "2026.08.28",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "TrustShiftProbe",
  "subtitle": "MCP Server 階段式信任攻擊",
  "date": "2026.08.24",
  "dateValue": "2026-08-24",
  "authors": "Mehrdad Rostamzadeh、Sidhant Narula、Mohammad Ghasemigol、Daniel Takabi",
  "source": "https://arxiv.org/abs/2608.23763",
  "sourceLabel": "arXiv 2608.23763",
  "pdf": "https://arxiv.org/pdf/2608.23763",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Agent Security",
    "Threat Modeling",
    "DDR"
  ],
  "summary": "惡意 MCP Server 可先經歷 benign conditioning，再於信任臨界點切換成 schema-valid 操控、資料外洩或服務破壞。9 種攻擊變體的平均攻擊成功率為 69.5%；SHIELD runtime 防禦將其降至 42.7%，仍留下顯著殘餘風險。",
  "findings": [
    "惡意 MCP Server 可先經歷 benign conditioning，再於信任臨界點切換成 schema-valid 操控、資料外洩或服務破壞。9 種攻擊變體的平均攻擊成功率為 69.5%；SHIELD runtime 防禦將其降至 42.7%，仍留下顯著殘餘風險。"
  ],
  "relevance": "適用於串接 PLM、ERP、原始碼儲存庫、採購、工單與 OT 資料的 AI Agent。供應商通過上線前檢查，不代表後續 MCP 行為可信。",
  "action": "將 MCP Server 納入持續行為監控，重測信任建立後的資料外洩與破壞情境。",
  "caveat": "本次報告截點後新發布，直接改變 Agent/MCP 威脅模型；但仍是未經同儕審查的受控實驗。",
  "crossCheck": "依 2026-08-28 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 50,
  "rank": 2,
  "week": "2026.08.28",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "ICS Cybersecurity Datasets",
  "subtitle": "ICS 資料集結構性缺口",
  "date": "2026.08.25",
  "dateValue": "2026-08-25",
  "authors": "Konstantinos E. Kampourakis 等 7 人",
  "source": "https://arxiv.org/abs/2608.24757",
  "sourceLabel": "arXiv 2608.24757",
  "pdf": "https://arxiv.org/pdf/2608.24757",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Threat Modeling"
  ],
  "summary": "PRISMA-guided meta-review 彙整 18 項研究、83 個 ICS 資料集；85.5% 聚焦末期 OT disruption、只有 8.4% 涵蓋跨階段 IT/OT 攻擊、實際營運來源僅 15.7%，Purdue Level 0 證據幾乎缺席；沒有研究採 streaming evaluation，僅 2 項符合其重現性條件。",
  "findings": [
    "PRISMA-guided meta-review 彙整 18 項研究、83 個 ICS 資料集；85.5% 聚焦末期 OT disruption、只有 8.4% 涵蓋跨階段 IT/OT 攻擊、實際營運來源僅 15.7%，Purdue Level 0 證據幾乎缺席；沒有研究採 streaming evaluation，僅 2 項符合其重現性條件。"
  ],
  "relevance": "不能因 AI/ML IDS 在 SWaT、Edge-IIoT 等資料集取得高 F1-score，就推定能偵測真實產線橫向移動或 field-device 攻擊。",
  "action": "OT AI PoC 加入跨 IT／OT 階段、Purdue Level 0、時間切分與 streaming evaluation。",
  "caveat": "是本週製造／OT 關聯度最高的新研究，可直接用來強化 SIEM/XDR/OT AI PoC 驗收條件。",
  "crossCheck": "依 2026-08-28 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 51,
  "rank": 3,
  "week": "2026.08.28",
  "batch": "補遺",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "REDAgentBench",
  "subtitle": "可執行的 AI Agent 紅隊量測",
  "date": "2026.08.11",
  "dateValue": "2026-08-11",
  "authors": "Zixing Chen 等",
  "source": "https://arxiv.org/abs/2608.10669",
  "sourceLabel": "arXiv 2608.10669",
  "pdf": "https://arxiv.org/pdf/2608.10669",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Agent Security",
    "Threat Modeling"
  ],
  "summary": "1,661 個案例、5 種服務面、6 個模型及 3 種 agent harness，巨集平均攻擊成功率 65.69%；近五分之一已確認違規發生於 Agent 已辨識風險之後。Training-free policy reminder 在 matched replay 中降低超過 70 個百分點。",
  "findings": [
    "1,661 個案例、5 種服務面、6 個模型及 3 種 agent harness，巨集平均攻擊成功率 65.69%；近五分之一已確認違規發生於 Agent 已辨識風險之後。Training-free policy reminder 在 matched replay 中降低超過 70 個百分點。"
  ],
  "relevance": "AI 驗收應以沙箱中的實際狀態變更、service receipt、檔案差異與 API 副作用為證據，不能只檢查模型文字回答。",
  "action": "以沙箱狀態變更、service receipt 與 API 副作用驗收 Agent 紅隊結果。",
  "caveat": "適合改寫為企業 AI Agent 上線前紅隊與驗收 SOP；數字僅代表基準環境，不是生產事故率。",
  "crossCheck": "依 2026-08-28 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 52,
  "rank": 4,
  "week": "2026.08.28",
  "batch": "補遺",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "Foundation-Model-Powered Embodied Agents Security Survey",
  "subtitle": "依五層信任邊界盤點具身 Agent，保護長期記憶、世界狀態與實體動作路徑。",
  "date": "2026.08.17",
  "dateValue": "2026-08-17",
  "authors": "Jiawei Liu 等",
  "source": "https://arxiv.org/abs/2608.16843",
  "sourceLabel": "arXiv 2608.16843",
  "pdf": "https://arxiv.org/pdf/2608.16843",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Agent Security",
    "Threat Modeling"
  ],
  "summary": "以 first-compromised-trust-boundary 方法劃分 5 層、12 個攻擊面，彙整 58 筆攻擊與61 筆防禦紀錄。長期記憶、world-state integrity、middleware/networking 與 multi-agent trust 仍屬明顯研究缺口。",
  "findings": [
    "以 first-compromised-trust-boundary 方法劃分 5 層、12 個攻擊面，彙整 58 筆攻擊與61 筆防禦紀錄。長期記憶、world-state integrity、middleware/networking 與 multi-agent trust 仍屬明顯研究缺口。"
  ],
  "relevance": "可用於 AGV／AMR、機器手臂、AI 視覺檢測、Digital Twin 與 AI 控制決策的 OT×AI 威脅建模。",
  "action": "依五層信任邊界盤點具身 Agent，保護長期記憶、世界狀態與實體動作路徑。",
  "caveat": "能補強 IEC 62443 架構中「AI 決策如何傳導成實體動作」的分析空白；屬綜述而非新攻擊實驗。",
  "crossCheck": "依 2026-08-28 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 53,
  "rank": 5,
  "week": "2026.08.28",
  "batch": "補遺",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 2
  },
  "title": "Bounded Agents",
  "subtitle": "多代理委派安全",
  "date": "2026.08.16",
  "dateValue": "2026-08-16",
  "authors": "Xabier Muruaga",
  "source": "https://arxiv.org/abs/2608.15888",
  "sourceLabel": "arXiv 2608.15888",
  "pdf": "https://arxiv.org/pdf/2608.15888",
  "decision": "選讀",
  "kind": "學術論文",
  "topics": [
    "Agent Security",
    "DDR"
  ],
  "summary": "Agentic Principal Chain 將權限範圍、預算與先前動作納入六項授權檢查。3,154 個評估案例中，AgentDojo 資料外洩由 75–100% 降至 0%，並攔下 544 個 InjecAgent 外洩案例；但部分設定使任務效用下降 8.6～13.9 個百分點。",
  "findings": [
    "Agentic Principal Chain 將權限範圍、預算與先前動作納入六項授權檢查。3,154 個評估案例中，AgentDojo 資料外洩由 75–100% 降至 0%，並攔下 544 個 InjecAgent 外洩案例；但部分設定使任務效用下降 8.6～13.9 個百分點。"
  ],
  "relevance": "適用於多代理採購、供應商審查、程式修補與跨系統工單；應在模型外部強制執行 capability budget、scope attenuation 與組合動作限制。",
  "action": "在模型外強制委派 scope、budget 與組合動作限制，並量測任務效用損失。",
  "caveat": "量化完整且有公開實作，但仍是單一作者預印本，需在企業流程中重測效用損失。",
  "crossCheck": "依 2026-08-28 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 54,
  "rank": 6,
  "week": "2026.08.28",
  "batch": "補遺",
  "evidenceLevel": "政策報告",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 2
  },
  "title": "OWASP Top 10 for LLM Applications 2026＋事件資料分析",
  "subtitle": "以 OWASP 清單對照 DLP、Agent 權限、供應鏈與隱藏 context 控制，不以排名推估事故率。",
  "date": "2026.08.03",
  "dateValue": "2026-08-03",
  "authors": "OWASP GenAI Security Project",
  "source": "https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/",
  "sourceLabel": "OWASP 官方頁",
  "decision": "選讀",
  "kind": "政策研究",
  "topics": [
    "DSPM / DLP",
    "Threat Modeling"
  ],
  "summary": "最終排序為 Prompt Injection、Sensitive Information Disclosure、Excessive Agency、Supply Chain、Data and Model Poisoning、Unbounded Consumption、Misinformation、Hidden Context Exposure、Vector and Embedding Weaknesses、Improper Output Handling。排序採 75% 專家意見＋25% 事件資料；事件分析使用 7,714 筆快照、6,639 筆分類資料，但專家與事件排序的 Cohen’s κ 約 0.20，區間跨越零。",
  "findings": [
    "最終排序為 Prompt Injection、Sensitive Information Disclosure、Excessive Agency、Supply Chain、Data and Model Poisoning、Unbounded Consumption、Misinformation、Hidden Context Exposure、Vector and Embedding Weaknesses、Improper Output Handling。排序採 75% 專家意見＋25% 事件資料；事件分析使用 7,714 筆快照、6,639 筆分類資料，但專家與事件排序的 Cohen’s κ 約 0.20，區間跨越零。"
  ],
  "relevance": "應將 LLM02、LLM03、LLM04、LLM08 分別對應 DLP、Agent 權限控制、AI 供應鏈與 RAG／隱藏政策資訊保護。",
  "action": "以 OWASP 清單對照 DLP、Agent 權限、供應鏈與隱藏 context 控制，不以排名推估事故率。",
  "caveat": "適合作為控制完整性清單，不宜把排序直接解讀成企業事故發生率。",
  "crossCheck": "依 2026-08-28 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 55,
  "rank": 7,
  "week": "2026.08.28",
  "batch": "本週新發",
  "evidenceLevel": "政策報告",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 2
  },
  "title": "NIST IR 8611",
  "subtitle": "m-NGAC 資料庫細粒度存取控制",
  "date": "2026.08.27",
  "dateValue": "2026-08-27",
  "authors": "NIST",
  "source": "https://csrc.nist.gov/pubs/ir/8611/final",
  "sourceLabel": "NIST IR 8611",
  "decision": "選讀",
  "kind": "政策研究",
  "topics": [
    "DSPM / DLP",
    "Data Lineage"
  ],
  "summary": "把 ANSI/INCITS NGAC 直接嵌入資料庫，在 individual-column data 層強制執行集中式細粒度政策，不依賴查詢工具自身是否正確套用控制。",
  "findings": [
    "把 ANSI/INCITS NGAC 直接嵌入資料庫，在 individual-column data 層強制執行集中式細粒度政策，不依賴查詢工具自身是否正確套用控制。"
  ],
  "relevance": "可作為 RAG、AI data lake、PLM BOM、客戶設計資料與訓練資料的後端 enforcement 參考；能補足僅靠前端 DLP 或 Agent prompt policy 的不足。",
  "action": "評估在 RAG／PLM 資料庫層執行細粒度政策，避免只依賴前端工具。",
  "caveat": "本週新發布的 NIST Final，但並非 AI 專屬，也未提供企業規模量化成效。",
  "crossCheck": "依 2026-08-28 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 56,
  "rank": 8,
  "week": "2026.08.28",
  "batch": "補遺",
  "evidenceLevel": "政策報告",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 2
  },
  "title": "NIST IR 8613",
  "subtitle": "Multi-Cloud Security and Compliance",
  "date": "2026.08.21",
  "dateValue": "2026-08-21",
  "authors": "NIST",
  "source": "https://csrc.nist.gov/pubs/ir/8613/ipd",
  "sourceLabel": "NIST IR 8613 IPD",
  "decision": "選讀",
  "kind": "政策研究",
  "topics": [
    "DSPM / DLP",
    "Data Lineage"
  ],
  "summary": "整理 23 個多雲架構挑戰，最集中於 IAM、telemetry/logging、configuration/change management、data protection 與 compliance/authorization。意見徵集至 2026-10-05。",
  "findings": [
    "整理 23 個多雲架構挑戰，最集中於 IAM、telemetry/logging、configuration/change management、data protection 與 compliance/authorization。意見徵集至 2026-10-05。"
  ],
  "relevance": "適合用來檢查臺灣、美國、墨西哥、捷克與中國隔離環境的 AI/DSPM 可視性、資料邊界及控制一致性。",
  "action": "檢查跨區多雲 IAM、日誌、設定變更與資料保護的一致性。",
  "caveat": "官方且具多雲資料保護價值，但不是 AI Security 專屬文件。",
  "crossCheck": "依 2026-08-28 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 57,
  "rank": 9,
  "week": "2026.08.28",
  "batch": "補遺",
  "evidenceLevel": "政策報告",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 2
  },
  "title": "NIST SP 1353",
  "subtitle": "使用 AI 協助 CSF 2.0 分析與報告",
  "date": "2026.08.19",
  "dateValue": "2026-08-19",
  "authors": "NIST",
  "source": "https://csrc.nist.gov/pubs/sp/1353/ipd",
  "sourceLabel": "NIST SP 1353 IPD",
  "decision": "選讀",
  "kind": "政策研究",
  "topics": [
    "Threat Modeling"
  ],
  "summary": "提供 Governance Review、Current State Profile、Target State Profile 三種示範情境及結構化 prompts；意見徵集至 2026-10-15。",
  "findings": [
    "提供 Governance Review、Current State Profile、Target State Profile 三種示範情境及結構化 prompts；意見徵集至 2026-10-15。"
  ],
  "relevance": "可支援 AI 輔助稽核證據整理與 CSF 差距分析，但內部政策、訪談與證據輸入前仍須分類、去識別化及限制保留。",
  "action": "稽核資料送入 AI 前先分類與最小化；對生成的 CSF 分析逐項核對原始證據。",
  "caveat": "NIST 明確表示它不是 AI 安全最佳實務，也不是保證性稽核方法，不能把生成結果直接視為稽核證據。",
  "crossCheck": "依 2026-08-28 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 58,
  "rank": 1,
  "week": "2026.09.04",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "Agent Memory Is a Surface for Endogenous Authorization Laundering",
  "subtitle": "將記憶中的授權連回不可變核准事件，逐次驗證撤銷、期限與條件。",
  "date": "2026.09.01",
  "dateValue": "2026-09-01",
  "authors": "Tommaso Cerruti、Mika Okamoto、Ansel Kaplan Erol",
  "source": "https://arxiv.org/abs/2609.01836",
  "sourceLabel": "arXiv 2609.01836",
  "pdf": "https://arxiv.org/pdf/2609.01836",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Agent Security",
    "Threat Modeling"
  ],
  "summary": "EAL-Bench 涵蓋採購、資安與金融情境。增量式記憶更新使模型對未授權要求產生最高 50.2% 的虛假權限；一旦錯誤權限進入記憶，執行模型在 98.6% 的測試中依此採取行動。",
  "findings": [
    "EAL-Bench 涵蓋採購、資安與金融情境。增量式記憶更新使模型對未授權要求產生最高 50.2% 的虛假權限；一旦錯誤權限進入記憶，執行模型在 98.6% 的測試中依此採取行動。"
  ],
  "relevance": "採購代理、供應商資格審查、PLM 變更、弱點修補及工單代理都可能把已撤銷、限時或條件式核准錯記成永久權限。",
  "action": "將記憶中的授權連回不可變核准事件，逐次驗證撤銷、期限與條件。",
  "caveat": "直接改變 AI System Threat Modeling：Agent memory 應視為授權政策的一部分，不只是聊天紀錄。限制是工具與業務流程仍為模擬環境，不能推估實際企業事故率。",
  "crossCheck": "依 2026-09-04 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 59,
  "rank": 2,
  "week": "2026.09.04",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "Context Inference Attacks Without Jailbreaks",
  "subtitle": "AI DLP 測試加入推論式外洩，限制檢索範圍並偵測重複候選探測。",
  "date": "2026.08.31",
  "dateValue": "2026-08-31",
  "authors": "Prince Jha、Samuele Poppi、Nils Lukas",
  "source": "https://arxiv.org/abs/2609.01663",
  "sourceLabel": "arXiv 2609.01663",
  "pdf": "https://arxiv.org/pdf/2609.01663",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "DSPM / DLP",
    "Data Lineage"
  ],
  "summary": "攻擊者不必誘導模型直接吐出機密，也能從正常回答推斷隱藏 context。研究在小型候選集達 100% ASR、1,024 個候選時為 63%；Agent 自行檢索資料的情境仍達 81.8 AUROC。作者測試的禁止揭露指示、logit suppression 與 context dilution 都未消除洩漏。",
  "findings": [
    "攻擊者不必誘導模型直接吐出機密，也能從正常回答推斷隱藏 context。研究在小型候選集達 100% ASR、1,024 個候選時為 63%；Agent 自行檢索資料的情境仍達 81.8 AUROC。作者測試的禁止揭露指示、logit suppression 與 context dilution 都未消除洩漏。"
  ],
  "relevance": "即使 RAG／Agent 沒有逐字輸出 BOM、報價、客戶設計或設備資料，外部使用者仍可能藉重複查詢推斷某筆資料是否存在。",
  "action": "AI DLP 測試加入推論式外洩，限制檢索範圍並偵測重複候選探測。",
  "caveat": "這是傳統 DLP 容易漏掉的「推論式外洩」；但實驗使用受控候選集合與合成憑證，跨模型 transfer 也不是必然成功。",
  "crossCheck": "依 2026-09-04 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 60,
  "rank": 3,
  "week": "2026.09.04",
  "batch": "本週新發",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 3
  },
  "title": "Explainable Artificial Intelligence for Industrial Cybersecurity",
  "subtitle": "OT AI PoC 同時量測解釋穩定性、操作員判讀時間及誤動作成本。",
  "date": "2026.08.31",
  "dateValue": "2026-08-31",
  "authors": "Amr S. Mohamed、Charlotte Fritz、Ahmad Mohammad Saber 等 8 人",
  "source": "https://arxiv.org/abs/2609.00171",
  "sourceLabel": "arXiv 2609.00171",
  "pdf": "https://arxiv.org/pdf/2609.00171",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Threat Modeling"
  ],
  "summary": "系統性整理工業 SOC 中的特徵歸因、代理模型、規則與視覺化方法。研究指出現有 AI／XAI 驗證仍高度依賴公開 IT、IoT 或網路流量資料，對跨 Purdue 層級攻擊、產線時間限制與真實操作員決策支援的證據不足；局部解釋也不應直接轉成全域偵測規則。",
  "findings": [
    "系統性整理工業 SOC 中的特徵歸因、代理模型、規則與視覺化方法。研究指出現有 AI／XAI 驗證仍高度依賴公開 IT、IoT 或網路流量資料，對跨 Purdue 層級攻擊、產線時間限制與真實操作員決策支援的證據不足；局部解釋也不應直接轉成全域偵測規則。"
  ],
  "relevance": "有助於重新設計 OT AI PoC，不只比較 F1-score，也檢驗解釋穩定性、操作員判讀時間、誤動作成本及跨 IT／OT 攻擊鏈。",
  "action": "OT AI PoC 同時量測解釋穩定性、操作員判讀時間及誤動作成本。",
  "caveat": "製造業直接性高，適合 OT SOC 與模型風險團隊共同閱讀；屬綜述，沒有提供新的實廠部署成效。",
  "crossCheck": "依 2026-09-04 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 61,
  "rank": 4,
  "week": "2026.09.04",
  "batch": "補遺",
  "evidenceLevel": "同儕審查",
  "scores": {
    "evidence": 3,
    "relevance": 3,
    "actionability": 3
  },
  "title": "Zero Trust Architecture for Industry 5.0 and Industrial IoT",
  "subtitle": "Enterprise Security Architecture Spotlight",
  "date": "2026.08.27",
  "dateValue": "2026-08-27",
  "authors": "Ali Akhmetkaliyev、Mohammed Alaa Ala’anzy、Mahmoud Khalid Almsafir、Saleh Musleh；Computer Networks",
  "source": "https://doi.org/10.1016/j.comnet.2026.112695",
  "sourceLabel": "DOI 10.1016/j.comnet.2026.112695",
  "decision": "深入審閱",
  "kind": "學術論文",
  "topics": [
    "Threat Modeling",
    "Data Lineage"
  ],
  "summary": "PRISMA 2020 流程由 492 篇篩選出 45 篇同儕審查研究，建立五類 ZTA 架構：身分與存取、異常偵測、區塊鏈信任、聯邦／分割式學習、後量子與硬體安全。作者主張 brownfield 工廠較可行的方向，是以符合 IEC 62443 的 gateway／proxy 承接持續驗證，而不是直接改造所有舊 PLC。",
  "findings": [
    "PRISMA 2020 流程由 492 篇篩選出 45 篇同儕審查研究，建立五類 ZTA 架構：身分與存取、異常偵測、區塊鏈信任、聯邦／分割式學習、後量子與硬體安全。作者主張 brownfield 工廠較可行的方向，是以符合 IEC 62443 的 gateway／proxy 承接持續驗證，而不是直接改造所有舊 PLC。"
  ],
  "relevance": "適用於 brownfield 製造業 ERP／PLM／MES 與 OT 之間的信任邊界設計。",
  "action": "盤點 ERP／PLM／MES 至 OT 的資料與控制路徑；在 gateway 實作短效身分、逐次授權及稽核，量測 p95／p99 延遲並保留人工接管。",
  "caveat": "在最近 30 天內發布，方法透明且最貼近 brownfield 製造架構；須避免把區塊鏈或論文平均效能當成既定採購要求。 只搜尋 Scopus 與英文文獻；延遲、準確率等數字主要來自各論文自行回報，沒有統一測試床，因此只能做描述性比較。沒有直接評估 SAP、S/4HANA、ERP 或 PLM。",
  "crossCheck": "依 2026-09-04 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 62,
  "rank": 5,
  "week": "2026.09.04",
  "batch": "補遺",
  "evidenceLevel": "Preprint",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 2
  },
  "title": "Stealing Reasoning Traces from Proprietary LLM APIs",
  "subtitle": "清查 Git、工單與評測資料中的 raw API transcript 和 reasoning blocks；確認外流後評估撤除及憑證輪替。",
  "date": "2026.08.10",
  "dateValue": "2026-08-10",
  "authors": "Alexander Panfilov、David Schmotz、Ilia Shumailov 等 8 人",
  "source": "https://arxiv.org/abs/2608.09867",
  "sourceLabel": "arXiv 2608.09867",
  "pdf": "https://arxiv.org/pdf/2608.09867",
  "decision": "選讀",
  "kind": "學術論文",
  "topics": [
    "DSPM / DLP",
    "Agent Security"
  ],
  "summary": "研究者利用同一供應商內跨 session、使用者及模型可重放的加密 reasoning block，讓較弱模型充當解碼器。對 315,320 個公開 reasoning blocks 的掃描找到 367 筆 PII 與 182 筆憑證。",
  "findings": [
    "研究者利用同一供應商內跨 session、使用者及模型可重放的加密 reasoning block，讓較弱模型充當解碼器。對 315,320 個公開 reasoning blocks 的掃描找到 367 筆 PII 與 182 筆憑證。"
  ],
  "relevance": "Agent trajectory、除錯紀錄、API response dump 即使看似加密，仍不應提交到 Git、工單或供應商支援平台；若曾分享，應評估撤除、憑證輪替及資料外洩通報。",
  "action": "清查 Git、工單與評測資料中的 raw API transcript 和 reasoning blocks；確認外流後評估撤除及憑證輪替。",
  "caveat": "W36 報告的重要補錄且原始數字已核實，但不是本週發布，攻擊現況亦已改變。 作者表示研究測試發生於 2026 年 7 月初；揭露後各供應商均確認收件，研究者之後已無法用相同方式發動攻擊。因此這是已證實的架構缺陷與資料衛生教訓，不能宣稱目前 API 仍可被同法利用。",
  "crossCheck": "依 2026-09-04 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
{
  "id": 63,
  "rank": 6,
  "week": "2026.09.04",
  "batch": "本週新發",
  "evidenceLevel": "已接受",
  "scores": {
    "evidence": 2,
    "relevance": 3,
    "actionability": 2
  },
  "title": "Agent Flight Recorder",
  "subtitle": "先於一條 PLM／ERP 至 OT 流程試行結構化授權 provenance 與異地 hash-chain log，驗證紀錄完整性。",
  "date": "2026.09.01",
  "dateValue": "2026-09-01",
  "authors": "Laurent Bindschaedler、Quentin Botha、Christoph Siebenbrunner",
  "source": "https://arxiv.org/abs/2609.01931",
  "sourceLabel": "arXiv 2609.01931",
  "pdf": "https://arxiv.org/pdf/2609.01931",
  "decision": "選讀",
  "kind": "學術論文",
  "topics": [
    "Data Lineage",
    "DDR"
  ],
  "summary": "以八個語意欄位記錄 Agent 意圖、授權、執行及 provenance，再用 hash chain、Merkle batch 與鏈上 anchor 提供防竄改驗證。合成工作負載中，每事件增加約 48 微秒與 512 bytes，四類竄改偵測率為 100%。",
  "findings": [
    "以八個語意欄位記錄 Agent 意圖、授權、執行及 provenance，再用 hash chain、Merkle batch 與鏈上 anchor 提供防竄改驗證。合成工作負載中，每事件增加約 48 微秒與 512 bytes，四類竄改偵測率為 100%。"
  ],
  "relevance": "可用於追查 Agent 對 ERP、PLM、程式庫、工單與 OT gateway 的委派鏈和實際副作用，是 AI Data Lineage 與不可否認稽核的具體設計候選。",
  "action": "先於一條 PLM／ERP 至 OT 流程試行結構化授權 provenance 與異地 hash-chain log，驗證紀錄完整性。",
  "caveat": "已獲 BCCA 2026 接受且設計具可實作性；不過主要證據來自合成負載，若攻擊繞過被監控 gateway 或主機已遭控制，紀錄仍可能不完整。企業可先試行結構化、異地保存的 hash-chain log，不必直接採用區塊鏈。",
  "crossCheck": "依 2026-09-04 原期已完成的閱讀清單補登，保留當期研究結論與判讀限制；本次未重新執行文獻掃描。"
},
  {
    id: 40,
    rank: 1,
    week: "2026.08.21",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "HarnessRisk",
    subtitle: "A Lifecycle-Oriented Benchmark for Agent Harness Safety",
    date: "2026.08.18",
    dateValue: "2026-08-18",
    authors: "Yajing Bai、Jinhao Duan、Jie Peng、Xianfeng Wu、Sijia Liu、Song Wang、Tianlong Chen",
    source: "https://arxiv.org/abs/2608.17597",
    sourceLabel: "arXiv:2608.17597",
    pdf: "https://arxiv.org/pdf/2608.17597",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "DDR", "Data Lineage", "Threat Modeling"],
    summary: "把 Agent harness 拆成設定、能力擴充、執行、狀態持久化、動作控制與事故復原六個生命週期，證明只測 Prompt Injection 會漏掉設定與復原階段的高風險失敗。",
    findings: [
      "建立 128 個沙箱案例，每案把良性目標與藏在不受信任 workflow artifact 的攻擊指令配對。",
      "跨 3 套 harness、6 個模型、14 種配置，攻擊成功率介於 12.6% 至 80.9%，而任務效用仍維持 75.0% 至 97.6%。",
      "Harness Configuration 是三套 harness 共同最脆弱的階段；部分配置即使超過 90% 的執行能辨識風險，仍保有顯著攻擊成功率。",
    ],
    relevance: "工廠 edge Agent、研發助手與 PLM／ERP Copilot 的風險不只在模型回覆；設定檔、Skill、記憶、工具權限、提交動作與復原程序都可能改變製程或資料狀態。",
    action: "依六階段建立企業 Agent 驗收矩陣；每個 model×harness×權限配置都測 utility、ASR、持久性、偵測與復原，設定與記憶變更必須納入 DDR 與完整性監控。",
    caveat: "未經同儕審查；128 個沙箱案例與 14 種配置不代表企業實際發生率，且需以內部 Agent framework、工具與多語製造業 artifact 重測。",
    crossCheck: "與既有 Agent Skill Security、Self-State、Memory Poisoning 與 Runtime Contract 研究一致：部署安全取決於完整 harness 生命週期，而非模型單點。",
    metric: "128 案例｜14 配置｜ASR 12.6–80.9%",
  },
  {
    id: 41,
    rank: 2,
    week: "2026.08.21",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "Task-Conditioned Least-Privilege Learning",
    subtitle: "Executable Terminal and MCP Agents 的任務條件式最小權限",
    date: "2026.08.18",
    dateValue: "2026-08-18",
    authors: "Alexander Tu、Michael Tu",
    source: "https://arxiv.org/abs/2608.18351",
    sourceLabel: "arXiv:2608.18351",
    pdf: "https://arxiv.org/pdf/2608.18351",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Agent Security", "DDR", "Threat Modeling"],
    summary: "以任務所需的 sufficient-authority envelope 訓練 4B 模型，在 terminal 與 MCP 環境中降低『能完成但用了不必要權限』的 excess-authority error。",
    findings: [
      "在 1,500 個任務後訓練，並以 500 個保留任務、2,896 個 episodes 評估。",
      "作者報告 safe success 從 base policy 的 64.36% 提升至 98.48%，excess-authority events 從 4.56% 降至 0.79%。",
      "另以 400 任務 continuation study 觀察到超額權限事件下降 6.99 個百分點；作者明示不能取代 permission gate 與 sandbox。",
    ],
    relevance: "MCP Agent 連到 Git、PLM、ERP、資料湖或 OT 工具時，合法任務不應自動取得整個伺服器或服務帳號權限；任務層最小權限可降低橫向影響。",
    action: "為高風險任務定義 sufficient-authority envelope，執行前與觀察到效果後各稽核一次；仍保留 gateway、token audience、sandbox 與 commit-time reauthorization。",
    caveat: "已投稿 IEEE、尚未接受；僅在 Qwen3.5-4B 與作者任務集驗證，訓練效果是否能跨模型、跨企業工具與長流程維持仍待重現。",
    crossCheck: "與 Confused Deputy、MCP gateway 與 Temporary Authority 相互補強：學得的克制是額外控制層，不是授權基礎設施的替代品。",
    metric: "Safe success 64.36% → 98.48%｜超額權限 4.56% → 0.79%",
  },
  {
    id: 42,
    rank: 3,
    week: "2026.08.21",
    batch: "本週新發",
    evidenceLevel: "已接受",
    scores: { evidence: 3, relevance: 3, actionability: 3 },
    title: "COMA",
    subtitle: "Security-RAG 的組合式誤導攻擊與反事實防禦",
    date: "2026.08.18",
    dateValue: "2026-08-18",
    authors: "Chinmay Gondhalekar、Urjitkumar Patel",
    source: "https://arxiv.org/abs/2608.17960",
    sourceLabel: "IEEE GAISS 2026",
    pdf: "https://arxiv.org/pdf/2608.17960",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Data Lineage", "Agent Security", "DDR", "Threat Modeling"],
    summary: "證明每份被檢索文件都可以真實、無指令且互不矛盾，但文件組合仍可讓 Security Copilot 正確診斷漏洞後提出無效修補。",
    findings: [
      "Action-corruption 在 5 個受測模型、2 個合成領域與真實 CVE-2021-33813 的每次測試皆成功；verdict-flip 隨模型能力提升而下降但未消失。",
      "攻擊關鍵不是單份文件造假，而是讓區分事實必須由模型推論、無法直接讀取。",
      "Causal Counterfactual Defense 以 leave-one-out 估計每份檢索文件的因果影響，在 4 組良性多文件控制上零誤報，並能定位攻擊者控制文件。",
    ],
    relevance: "漏洞管理、設備維修與品質 RAG 可能同時讀取多份都『正確』的公告、手冊與例外規則；文件單件簽章與 DLP 不足以防止組合後的錯誤決策。",
    action: "對高風險建議加入文件級 trust label、來源 lineage 與 leave-one-out 影響測試；修補、停線或參數變更前，要求可直接引用的 disambiguating fact。",
    caveat: "已獲 IEEE GAISS 2026 接受，但實驗域與良性控制組有限；『每次成功』只能解讀為作者測試設定結果，不可外推所有 RAG 與模型。",
    crossCheck: "與 RAGuard 的文件影響分析及 Mind the Hook 的 active-path audit 相容，但新增『真實文件的組合仍可誤導』這條 threat-model 分支。",
    metric: "5 模型｜2 合成領域＋1 真實 CVE｜4 良性控制零誤報",
  },
  {
    id: 43,
    rank: 4,
    week: "2026.08.21",
    batch: "本週新發",
    evidenceLevel: "已接受",
    scores: { evidence: 3, relevance: 3, actionability: 3 },
    title: "Denoising-Aware Inversion",
    subtitle: "噪聲保護文字 Embedding 仍可能被自適應反演",
    date: "2026.08.19",
    dateValue: "2026-08-19",
    authors: "Yubo Wang、Shujie Cui、James Bailey、Hongzhi Yin、Wenyu Liang、Min Tang、Shiyue Qin、Weiqing Wang",
    source: "https://arxiv.org/abs/2608.18610",
    sourceLabel: "IEEE ICDM 2026",
    pdf: "https://arxiv.org/pdf/2608.18610",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["DSPM / DLP", "Data Lineage", "Threat Modeling"],
    summary: "提出 DAEI，讓攻擊者只觀察加過 Gaussian noise 的文字 embedding、沒有乾淨目標，也能先去噪再反演原文，挑戰『向量加噪即可保密』的假設。",
    findings: [
      "DAEI 結合 residual denoising autoencoder 與生成式文字反演，去噪器以 Stein unbiased risk estimate 無監督訓練。",
      "相較既有生成式反演 baseline，BLEU 相對改善約 154%，token-level F1 與 ROUGE-L 改善 32–60%。",
      "研究顯示保護向量資料必須假設攻擊者知道擾動機制並採自適應去噪，而非只測標準 inversion。",
    ],
    relevance: "製造業向量庫可能承載 BOM、維修手冊、客戶規格與故障描述；即使不存明文、只交換 embedding，仍可能暴露敏感語意或原文片段。",
    action: "將 embedding 納入 DSPM 資產分類與 DLP egress policy；以自適應 inversion 測試供應商宣稱，限制向量匯出、查詢率、跨租戶共享與長期保留。",
    caveat: "已接受 IEEE ICDM 2026，但改善百分比是相對特定 baseline 與資料集；不等同能完整還原企業文件，也不代表所有噪聲機制失效。",
    crossCheck: "與 RAG 資料外洩及 embedding inversion 研究方向一致；本研究的新增價值是明確以攻擊者適應噪聲保護作威脅模型。",
    metric: "BLEU 相對 +154%｜F1／ROUGE-L +32–60%",
  },
  {
    id: 44,
    rank: 5,
    week: "2026.08.21",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 2 },
    title: "Model Card for OpenAI Privacy Filter",
    subtitle: "本地端 PII／秘密偵測與遮蔽模型的能力及明確邊界",
    date: "2026.08.18",
    dateValue: "2026-08-18",
    authors: "Charles de Bourcy、Sahra Ghalebikesabi、Avi Schwarzschild 等 25 人／OpenAI",
    source: "https://arxiv.org/abs/2608.18274",
    sourceLabel: "arXiv:2608.18274",
    pdf: "https://arxiv.org/pdf/2608.18274",
    decision: "選讀",
    kind: "產業報告",
    topics: ["DSPM / DLP", "Data Lineage", "Threat Modeling"],
    summary: "公開一個 1.5B 總參數、每 token 啟用 50M 參數、支援 128K context 的雙向 token classifier，用於偵測與遮蔽八類 PII 及 secrets。",
    findings: [
      "以 constrained Viterbi decoder 產生一致 span，並提供可調 precision／recall operating points。",
      "設計目標包含高效率本地部署與領域微調，可作為資料最小化流程的一層。",
      "作者明確聲明它不是匿名化或法遵保證，應置於分層隱私控制流程。",
    ],
    relevance: "可作為研發工作站、瀏覽器、API gateway 或工廠 edge 的 GenAI DLP 元件，但 PII／secret 範圍不等於製造 IP、配方、圖面與 BOM。",
    action: "先用企業語料建立八類 PII／secret 加上 IP 類別的測試集，按情境調 operating point；保留規則、內容分類、目的地政策與人工覆核。",
    caveat: "模型卡由供應方作者撰寫且為 preprint；不能把模型卡中的評測視為獨立產品認證，亦不能把遮蔽等同不可逆匿名化。",
    crossCheck: "其自我限制與 Mind the Hook、SafeGPT 的結果一致：DLP 能力必須以實際資料流、資料類別與誤判成本驗收。",
    metric: "1.5B 總參數｜50M active/token｜128K context｜8 類別",
  },
  {
    id: 45,
    rank: 6,
    week: "2026.08.21",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 2, actionability: 2 },
    title: "The Model’s Tell",
    subtitle: "以 Behavior Gauges 偵測 Context Leakage 攻擊訊號",
    date: "2026.08.18",
    dateValue: "2026-08-18",
    authors: "Maosen Zhang、Jianshuo Dong、Boting Lu、Wenyue Li、Xiaoping Zhang、Tianwei Zhang、Jie Zhang、Han Qiu",
    source: "https://arxiv.org/abs/2608.17829",
    sourceLabel: "arXiv:2608.17829",
    pdf: "https://arxiv.org/pdf/2608.17829",
    decision: "選讀",
    kind: "學術論文",
    topics: ["DSPM / DLP", "Agent Security", "DDR"],
    summary: "LeakGauge 不需讀模型 hidden state，而是在解碼前附加行為探針，從 prefill token probabilities 估計 system prompt 或檢索內容外洩風險。",
    findings: [
      "跨 11 個 LLM，在未見攻擊上 AUROC 為 0.944–0.996。",
      "內容改變語言、攻擊從逐字洩漏轉成語意洩漏時，訊號仍相對穩定。",
      "可形成少於 0.5K 額外參數的輸入 detector，作者報告額外延遲 10.34 ms。",
    ],
    relevance: "適合研發 Copilot、RAG 與客服 Agent 的執行期 DLP／DDR PoC，特別是不能取得模型內部 activation 的 API 或封閉模型環境。",
    action: "用中英日製造業語料、間接 Prompt Injection 與語意改寫測試 AUROC、precision、recall、延遲及繞過率；只作風險訊號，不單獨決定封鎖。",
    caveat: "Preprint；高 AUROC 不等於部署時低誤報，測試模型與攻擊分布也可能與企業 API、長上下文及工具輸出不同。",
    crossCheck: "可與輸入／輸出 DLP、資料分類和 tool egress policy 結合；它偵測模型行為訊號，不能取代資料來源與目的地控制。",
    metric: "11 模型｜AUROC 0.944–0.996｜+10.34 ms",
  },
  {
    id: 46,
    rank: 7,
    week: "2026.08.21",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 2 },
    title: "Who Can Make the Action Happen?",
    subtitle: "高風險自動化系統的 Authority-Decomposition Framework",
    date: "2026.08.19",
    dateValue: "2026-08-19",
    authors: "Mengting Wu、Lin Wang、Yong Zhang",
    source: "https://arxiv.org/abs/2608.18965",
    sourceLabel: "arXiv:2608.18965",
    pdf: "https://arxiv.org/pdf/2608.18965",
    decision: "選讀",
    kind: "學術論文",
    topics: ["Threat Modeling", "Agent Security", "Data Lineage"],
    summary: "不再只問某元件是否『已授權』，而是找出哪些 trust-domain 組合實際足以造成受保護狀態轉移，並把執行控制與權威紀錄控制分開分析。",
    findings: [
      "模型涵蓋元件、權力、資源、邊界，以及更新、復原、override、停用與替代呼叫路徑。",
      "可導出 inclusion-minimal sufficient coalitions，檢查聲稱的執行邊界是否仍依賴上游 trust domain。",
      "作者明示框架不能認證實作、保證找出隱藏權力，或定義證據驗證語意。",
    ],
    relevance: "跨國製造業的高風險動作常跨越 IdP、Agent、MCP gateway、供應商服務、PLM／ERP 與 OT 執行器；名義上的雙人核准可能被更新或替代路徑繞過。",
    action: "對韌體發布、設備參數、採購與停線命令建立 authority graph，枚舉更新、復原、break-glass 與替代 API，驗證任何單一上游域是否仍能獨力造成動作。",
    caveat: "62 頁非同儕審查概念稿；案例用於說明分析方法，不是部署安全證明，完整性仍依賴企業能否盤出隱藏權力與旁路。",
    crossCheck: "與 commit-time authorization 和任務條件式最小權限互補：前者驗證當下權限，本框架追問哪些跨域組合能真正讓動作發生。",
    metric: "62 頁｜最小充分信任域組合",
  },
  {
    id: 47,
    rank: 8,
    week: "2026.08.21",
    batch: "本週新發",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 2, actionability: 2 },
    title: "MobileWorldSafety",
    subtitle: "真實 Android App 中的 GUI Agent 環境注入評測",
    date: "2026.08.18",
    dateValue: "2026-08-18",
    authors: "Sujin Chen、Lijun Li、Tianyi Du、Jing Shao",
    source: "https://arxiv.org/abs/2608.17659",
    sourceLabel: "arXiv:2608.17659",
    pdf: "https://arxiv.org/pdf/2608.17659",
    decision: "選讀",
    kind: "學術論文",
    topics: ["Agent Security", "Threat Modeling", "DDR"],
    summary: "建立 142 個真實 Android App 風險任務，將間接 Prompt Injection 與惡意指令藏進一般環境內容，分辨安全失敗與單純能力失敗。",
    findings: [
      "最終系統狀態先以規則判定，模糊案例才交由 LLM judge，降低只看文字軌跡的誤判。",
      "6 個通用與專用 GUI agents 的攻擊成功率介於 40.4% 至 66.9%。",
      "結果顯示把不受信任內容當作一般操作環境，仍會使 Agent 偏離使用者目的。",
    ],
    relevance: "行動裝置測試、倉儲、巡檢與現場維修 Agent 都會閱讀 QR code、App 畫面、郵件與網頁；這些環境內容必須視為外部不受信任輸入。",
    action: "在行動或 GUI Agent PoC 加入環境注入案例，對轉帳、下載、登入、設定與刪除操作使用可驗證 final-state policy 及人工確認。",
    caveat: "Preprint；Android 情境不等於工廠 HMI／SCADA，部分模糊案例仍依賴 LLM judge，需用企業裝置與實際 App 重測。",
    crossCheck: "與 indirect prompt injection、Browser／GUI Agent 研究方向一致；其可驗證最終狀態方法值得移植到現場設備流程。",
    metric: "142 任務｜6 Agents｜ASR 40.4–66.9%",
  },
  {
    id: 48,
    rank: 9,
    week: "2026.08.21",
    batch: "補遺",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 2 },
    title: "Correct Is Not Governed",
    subtitle: "Agentic Workflow 的 Provenance Integrity",
    date: "2026.08.13",
    dateValue: "2026-08-13",
    authors: "Jesus Salas",
    source: "https://arxiv.org/abs/2608.12761",
    sourceLabel: "arXiv:2608.12761",
    pdf: "https://arxiv.org/pdf/2608.12761",
    decision: "選讀",
    kind: "學術論文",
    topics: ["Data Lineage", "Agent Security", "DDR", "Threat Modeling"],
    summary: "指出 Agent 得到正確結果仍可能依賴錯誤權威、無證據的完成聲稱或已過期工作；Matrix 以因果狀態層記錄 authority／fact dependency、完成證據與選擇性失效。",
    findings: [
      "受控比較中，直接與 governed workflow 經常得到相同結果，但只有 governed path 穩定保留治理證據並拒絕無佐證的 closure。",
      "上游事實變更時，可只使依賴它的工作失效，而非整批重跑。",
      "角色分離 transfer challenge 失敗：確定性 completeness contract 對外部上下文產生的合成封包嚴重 over-block。",
    ],
    relevance: "跨廠區品質、採購與維修流程需要知道誰授權、依據哪個版本，以及資料變更後哪些決策必須重算；只保存 Agent transcript 不足以證明治理完整。",
    action: "在工作流記錄 authority、fact、artifact 與 completion evidence 的依賴圖；資料或核准變更時自動失效下游工作，並測試跨角色移交的誤擋率。",
    caveat: "由 Drive 週報補入；單一作者 preprint 且使用受控／合成 fixtures。原始論文已核實，也明示 transfer challenge 失敗，不能宣稱一般化提升準確率。",
    crossCheck: "與 Runtime Contract、AuditWeave 及 authority decomposition 互補：provenance 不只記錄事件，也要能表達授權與事實依賴及其失效傳播。",
    metric: "Drive 補遺｜Governed execution｜Transfer over-block",
  },
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
    lifecycle: {
      label: "搜尋代理證據鏈劫持生命週期",
      stages: ["Query", "Rank", "Retrieve", "Corroborate", "Decide"],
      caption: "COORDINATED EVIDENCE-CHAIN HIJACK",
    },
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
  {
    id: 35,
    rank: 9,
    week: "2026.08.14",
    batch: "補遺",
    evidenceLevel: "政策報告",
    scores: { evidence: 3, relevance: 3, actionability: 3 },
    title: "MITRE ATLAS Secure AI v2",
    subtitle: "把 Agentic AI 與 LLM 攻擊技術納入可維護的威脅知識庫",
    date: "2026.05.06",
    dateValue: "2026-05-06",
    authors: "Mike Cunningham、Marissa Dotter／MITRE CTID",
    source: "https://ctid.mitre.org/blog/2026/05/06/secure-ai-v2-release/",
    sourceLabel: "MITRE CTID",
    decision: "深入審閱",
    kind: "政策研究",
    topics: ["Threat Modeling", "Agent Security", "DDR", "Data Lineage"],
    summary:
      "MITRE 更新 Secure AI 與 ATLAS，擴充 Agentic AI／LLM 攻擊技術、緩解措施與案例，並加入 technique maturity，讓企業能把公開威脅情資轉成可追蹤的 AI System Threat Model。",
    findings: [
      "Secure AI v2 公開 45 項以上 techniques／sub-techniques、10 項以上 mitigations 與 20 項以上 case studies。",
      "以 technique maturity 區分概念、研究與實際觀察成熟度，避免把所有技術當成同等急迫。",
      "MITRE 表示將採每月更新節奏，以涵蓋快速演變的 Agentic AI 與 LLM 攻擊面。",
    ],
    relevance:
      "跨國製造業可把 ATLAS 技術映射到 PLM、ERP、研發 Git、工廠 edge AI 與 OT Agent，補足傳統 ATT&CK 對 AI 資料、模型、記憶與工具鏈描述不足的部分。",
    action:
      "以 ATLAS technique ID 擴充 AI threat model、紅隊案例與 SOC 偵測對照表；依成熟度、資產曝險與製程影響排序，而非一次性照單全收。",
    caveat:
      "屬 MITRE 官方框架更新而非控制效果研究；技術與緩解項目提供共同語言，但仍需依企業架構驗證可偵測性與控制成效。",
    crossCheck:
      "與本週 Runtime Contract、MCP 身分閘道及既有 Agent Skill／Memory 研究互補，可把個別攻擊證據收斂到一致的威脅建模語彙。",
    metric: "45+ 技術｜10+ 緩解｜20+ 案例",
  },
  {
    id: 36,
    rank: 10,
    week: "2026.08.14",
    batch: "補遺",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 3 },
    title: "STRIDE-AI",
    subtitle: "Extending STRIDE for the AI Lifecycle",
    date: "2026.05.16",
    dateValue: "2026-05-16",
    authors: "Tsafac Nkombong Regine Cyrille、Franziska Schwarz",
    source: "https://arxiv.org/abs/2605.17163",
    sourceLabel: "arXiv:2605.17163",
    pdf: "https://arxiv.org/pdf/2605.17163",
    decision: "深入審閱",
    kind: "學術論文",
    topics: ["Threat Modeling", "Agent Security", "Data Lineage", "DSPM / DLP"],
    summary:
      "把傳統 STRIDE 延伸到六階段 AI 生命週期，將資料、模型、推論、RAG、Agent 工具與部署風險納入同一套威脅分析流程。",
    findings: [
      "提出由需求與資料取得到部署監控的六階段方法，逐階段識別 AI 特有資產、信任邊界與濫用路徑。",
      "在一個 sandbox RAG chatbot 案例中，作者報告攻擊成功率由 80% 降至 15%。",
      "框架可把 prompt injection、資料污染、模型竄改與機密外洩對應回 Spoofing、Tampering、Repudiation、Information Disclosure、Denial of Service 與 Elevation of Privilege。",
    ],
    relevance:
      "製造業常已有 STRIDE／DFD 審查流程；此研究提供較低摩擦的延伸方式，把模型、RAG、Agent 與資料 lineage 納入既有產品安全與 OT 架構審查。",
    action:
      "選一個 PLM／品質知識庫 Agent 建立六階段 DFD，標示資料敏感度、模型與工具信任邊界，再用實際攻擊案例驗證每項 mitigation。",
    caveat:
      "Preprint；80% 降至 15% 來自單一模型與單一 RAG sandbox 案例，不能視為框架在不同企業、語言與 OT 情境的普遍防禦率。",
    crossCheck:
      "可與 MITRE ATLAS 的威脅技術及 Runtime Contract 的執行期證據結合：STRIDE-AI 負責架構層分類，ATLAS 與 runtime telemetry 負責具體技術與驗證。",
    metric: "6 階段｜ASR 80% → 15%",
  },
  {
    id: 37,
    rank: 11,
    week: "2026.08.14",
    batch: "補遺",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 2 },
    title: "SafeGPT",
    subtitle: "A Unified Framework for Privacy-Preserving and Secure LLM Inference",
    date: "2026.05.22",
    dateValue: "2026-05-22",
    authors: "Pratyush Desai、Luoxi Tang、Yuqiao Meng、Zhaohan Xi",
    source: "https://arxiv.org/abs/2601.06366",
    sourceLabel: "arXiv:2601.06366 v3",
    pdf: "https://arxiv.org/pdf/2601.06366",
    decision: "選讀",
    kind: "學術論文",
    topics: ["DSPM / DLP", "Threat Modeling", "Agent Security"],
    summary:
      "整合敏感資料辨識、遮蔽與安全推論控制；但最新版資料集分項結果顯示企業情境的誤判率很高，不能以報告中的整體摘要數字代替部署驗收。",
    findings: [
      "v3 表格中，PIIBench 的 precision／recall／FPR 為 100%／70%／0%，ToxicChat 為 100%／100%／0%。",
      "EnterpriseScenarios 只有 40.5% precision、68.2% recall，false-positive rate 高達 78.6%。",
      "不同資料集差異巨大，說明單一彙總數字無法代表原始碼、BOM、圖面、客戶規格與多語資料的真實 DLP 表現。",
    ],
    relevance:
      "製造企業若以通用 PII benchmark 驗收 GenAI DLP，可能在工程語料上大量誤擋或漏報，直接影響研發工作與資料外洩風險。",
    action:
      "用企業自有原始碼、BOM、圖面、配方、客戶規格與中英日多語 prompt 建立資料集，分情境量測 precision、recall、FPR、延遲與人工覆核成本。",
    caveat:
      "原始稿提交於 2026-01-10，本期依 2026-05-22 的 v3 補遺；報告所述約 92% precision、87% recall、低於 12% FPR 並非各資料集普遍結果，故只列選讀。",
    crossCheck:
      "已回查 v3 的資料集分項表；網站以分項數字取代不可驗證的廣泛彙總敘述，並明示 EnterpriseScenarios 的 78.6% FPR。",
    metric: "Enterprise FPR 78.6%",
  },
  {
    id: 38,
    rank: 12,
    week: "2026.08.14",
    batch: "補遺",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 3, actionability: 2 },
    title: "AuditWeave",
    subtitle: "Cryptographically Verifiable Data Lineage for AI Pipelines",
    date: "2026.06.14",
    dateValue: "2026-06-14",
    authors: "Vimal Nakrani",
    source: "https://arxiv.org/abs/2607.09682",
    sourceLabel: "arXiv:2607.09682",
    pdf: "https://arxiv.org/pdf/2607.09682",
    decision: "選讀",
    kind: "學術論文",
    topics: ["Data Lineage", "DDR", "Threat Modeling"],
    summary:
      "以六種事件型別與 append-only hash chain 記錄 AI pipeline 的來源、檢索、轉換、推論、決策與證明，讓稽核方可驗證事件序列是否遭竄改。",
    findings: [
      "定義 Source、Retrieval、Transformation、Inference、Decision、Attestation 六類 lineage events。",
      "2,000 次事件 mutation trials 全數被偵測；單核心平均約 22.42 微秒／事件，約 44,600 events／秒。",
      "Hash chain 能揭露變更，但不能阻止竄改、證明輸入內容為真，或在沒有外部錨點時抵抗完整儲存區被重算。",
    ],
    relevance:
      "適合跨廠區模型、品質資料、RAG 文件、推論與人工核准的可驗證 lineage；也能支援事故後重建與法規稽核。",
    action:
      "在 PoC 中把重要事件鏈定期錨定到獨立 WORM／簽章服務，並測試時鐘、身分、刪除、復原與完整儲存區失陷情境。",
    caveat:
      "單一作者 preprint；2,000 次變更全數偵測只證明指定 mutation 與 hash chain 完整性，不代表能防止攻擊或保證資料語意真實。",
    crossCheck:
      "與 AIBOM、Agent Memory lineage 與 Runtime Contract 的 evidence chain 一致，但補上『可偵測竄改不等於可阻止竄改，也不等於內容為真』的重要邊界。",
    metric: "2,000/2,000 變更偵測｜44.6K events/s",
  },
  {
    id: 39,
    rank: 13,
    week: "2026.08.14",
    batch: "補遺",
    evidenceLevel: "Preprint",
    scores: { evidence: 2, relevance: 2, actionability: 2 },
    title: "Tracing the Data Trail",
    subtitle: "A Systematic Review of Data Provenance for AI",
    date: "2026.01.19",
    dateValue: "2026-01-19",
    authors: "Richard Hohensinner、Belgin Mutlu、Inti Gabriel Mendoza Estrada、Matej Vukovic、Simone Kopeinik、Roman Kern",
    source: "https://arxiv.org/abs/2601.14311",
    sourceLabel: "arXiv:2601.14311",
    pdf: "https://arxiv.org/pdf/2601.14311",
    decision: "選讀",
    kind: "學術論文",
    topics: ["Data Lineage", "Threat Modeling", "DSPM / DLP"],
    summary:
      "系統性整理 AI 資料 provenance、transparency、traceability 與 lineage 的研究語彙與方法，提供建立企業共同資料治理語言的背景基線。",
    findings: [
      "回顧 95 篇出版品，整理 provenance、透明度、可追溯性與 accountability 等概念的重疊與差異。",
      "指出 AI 系統需同時描述資料來源、轉換、責任角色、技術 artifact 與可查核證據，而非只保存 dataset 名稱。",
      "分類可協助治理、法遵與工程團隊對 lineage 的目的、粒度與生命週期達成一致。",
    ],
    relevance:
      "跨國製造業的資料會流經供應商、工廠、資料湖、模型訓練與客戶交付；缺乏共同語彙時，AIBOM、DSPM 與稽核證據難以對齊。",
    action:
      "先定義企業 provenance minimum elements：來源、擁有者、法域、授權、轉換、版本、敏感標籤、模型用途、刪除與證據錨點，再映射到現有 catalog／DSPM。",
    caveat:
      "屬較早期的背景型 preprint，且為文獻分類而非控制實驗；適合建立治理語彙，不宜當作單一產品或架構的效果證據。",
    crossCheck:
      "可作為 MITRE ATLAS、AIBOM 與 AuditWeave 的概念底座，但具體欄位與技術選型仍需依企業系統與法規情境補充。",
    metric: "95 篇出版品",
  },
];

export const TOPIC_FILTERS = [
  "全部",
  "Architecture",
  "Product Security",
  "OT / ICS",
  "AI Governance",
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
  sourceScope: ["arXiv 與已接受／同儕審查論文", "政府與權威政策研究", "具方法揭露的安全研究團隊報告", "製造業 AI Security、企業架構、OT／ICS、產品安全與資料保護主題來源"],
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
  "2026.09.11": {"scanned": null, "shortlisted": null, "note": "W37 修訂版 r4｜2026-09-12 分別完成 AI Read 與企業資安綜合閱讀增補。新增 2 篇 AI 研究、1 篇 OT 研究，保留原有 7 篇與更正；全期 10 篇（5 深入審閱、5 選讀）。架構 1 篇、產品安全 2 篇沿用本期已入選內容，不重複推薦。本期無合格的新 DSPM／DDR 專題實證研究。", "skipped": [{"title": "From Intent to Execution Grant", "source": "https://arxiv.org/abs/2609.11596", "reason": "2026-09-10 新提案，驗證範圍主要為小型參考實作；本次不取代更貼近跨 Agent 協定評審的 Spotlight。"}, {"title": "Industry 5.0 Zero Trust 回顧", "source": "https://doi.org/10.1016/j.comnet.2026.112695", "reason": "9/4 已推薦，沒有本次實質更新，不重複計數。"}]},
  "2026.09.04": { scanned: null, shortlisted: null, note: "2026.09.07 依原期已完成閱讀清單補登：6 項，深入審閱 4 項、選讀 2 項；整合 2026W36 週報。原稿未保留完整掃描與初篩數，不以推估補填。Architecture Spotlight 與早期研究列為補遺。", skipped: [] },
  "2026.08.28": { scanned: null, shortlisted: null, note: "2026.09.07 依原期已完成閱讀清單補登：9 項，深入審閱 4 項、選讀 5 項；整合 2026W35 週報。原稿未保留完整掃描與初篩數，不以推估補填。舊研究依原發布日期標示補遺。", skipped: [{ title: "PolicyGuard", source: "https://arxiv.org/abs/2608.02687", reason: "原期查核記錄指出作者撤稿，未納入。" }, { title: "NIST SP 1347", source: "https://csrc.nist.gov/pubs/sp/1347/final", reason: "原期判定 AI Security 關聯不足。" }] },
  "2026.08.21": {
    scanned: 215,
    shortlisted: 18,
    note: "公開來源掃描 215 項、18 項進入全文初篩並入選 8 項本週新發；另依 Google Drive modified_time 讀取 2026W34 最新週報，從其 8 項候選中納入 1 項未曾收錄的高價值補遺，合計 9 項。補遺不重複計入本週新發布數。",
    skipped: [
      { title: "NIST SP 800-239 Initial Public Draft", source: "https://csrc.nist.gov/pubs/sp/800/239/ipd", reason: "權威且可作 AI 資料中心基線，但發布於 2026-07-27，亦非 DSPM／lineage 專題；本週保留為徵詢意見背景，不冒充新發布研究。" },
      { title: "State of AI in OT Cybersecurity 2026", source: "https://www.nozominetworks.com/resources/state-of-ai-in-ot-cybersecurity-2026-industrial-cyber-industry-survey-report", reason: "OT 主題直接，但公開頁面不足以獨立核實樣本結構、問題設計與分母；87.7% 等比例只列為報告轉述，不作核心證據。" },
      { title: "Multi-Agent Firewall Architecture for Privacy Protection", source: "https://arxiv.org/abs/2607.08282", reason: "已於 2026.07.24 清單收錄；本期僅作 DLP 交叉背景，不重複入選。" },
      { title: "SARC-DQ", source: "https://arxiv.org/abs/2607.26313", reason: "2026-07-28 單一作者合成研究，較本週新出的 DLP／embedding inversion 證據弱，暫不補入。" },
      { title: "Multi-Agent Digital Twins for Predictive Maintenance", source: "https://arxiv.org/abs/2607.21873", reason: "屬 2026-07-24 系統性回顧，安全只是一部分；沒有本週實質更新，不列核心。" },
    ],
  },
  "2026.08.14": {
    scanned: 188,
    shortlisted: 14,
    note: "公開來源掃描 188 項、14 項進入全文初篩並入選 8 項本週新發；再讀取 Google Drive 的 2026W33 最新週報，從 7 項候選中納入 5 項高價值補遺，合計 13 項。補遺不重複計入本週新發布數。",
    skipped: [
      { title: "From Prompt Injection to Web Exploitation", source: "https://arxiv.org/abs/2608.10281", reason: "攻擊分類值得追蹤，但公開摘要僅揭露 5 個情境與 7 個模型，缺少可比較的整體結果，暫不列核心證據。" },
      { title: "When Agents Talk", source: "https://arxiv.org/abs/2608.11436", reason: "屬單一作者理論型 preprint，且部分論證依賴尚未有完整官方事故報告的事件敘事，待更多原始證據。" },
      { title: "2026 AI Adoption & Risk Report — Manufacturing", source: "https://www.cyberhaven.com/resources/report/2026-ai-adoption-risk-report-manufacturing", reason: "公開頁面未揭露完整方法、樣本與製造業分層，且完整內容需留下資料下載；不以廠商行銷頁替代可查核研究。" },
      { title: "ASTRIDE", source: "https://arxiv.org/abs/2512.04785", reason: "屬 2025 年 12 月的既有框架，公開資料缺少可比較的量化驗證；本期只保留追蹤，不列核心補遺。" },
      { title: "NIST AI Agent Security RFI", source: "https://www.federalregister.gov/documents/2026/01/08/2026-00206/request-for-information-regarding-security-considerations-for-artificial-intelligence-agents", reason: "屬意見徵詢而非正式控制框架，且 2026-03-09 截止日已過；不作本期實務控制證據。" },
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

export const weeklyReportIntegration = {
  "title": "GSMD-WATCH-2026-0908-01_製造業AI_Security週報_2026W37",
  "modifiedAt": "2026.09.08 15:38:50（臺北時間）",
  "candidates": 8,
  "selected": 0,
  "adopted": [
    "2026-09-12 重新列出 5 份直接檔案、按 Drive modified_time 排序並讀取最新全文；未以檔名推定。",
    "沿用 W37 的授權連續性、runtime 監控、資料 provenance 與 RAG 管線邊界作待核實背景；不把舊論文計為本期新發。"
  ],
  "corrections": [
    "A2ABreak 與官方 A2A 規格交叉閱讀；協定缺少統一機制，不等於企業一定未實施授權。",
    "安裝研究的 9 次陽性包含 3 次未完成安裝；MemSentry signed delta 不是數位簽章。",
    "原期關於 OWASP 排序權重、事故數與特定攻擊最高成功率，本次不提升為普遍事實。"
  ]
} as const;

export function readingSearchText(reading: Reading) {
  return [reading.title, reading.subtitle, reading.authors, reading.summary, reading.relevance, reading.action, reading.metric ?? "", ...reading.findings, ...reading.topics].join(" ").toLowerCase();
}

