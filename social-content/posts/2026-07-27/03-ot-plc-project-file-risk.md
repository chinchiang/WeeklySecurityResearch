# PLC 被攻擊時，最危險的不是停機，而是產線仍在跑、保護邏輯卻已被改掉

> **本週主題：** OT / Manufacturing  
> **研究期間：** 2026-07-20 — 2026-07-27  
> **產出日期：** 2026-07-27  
> **建議優先度：** P0 / 高衝擊  
> **證據狀態：** Ready

## 標題／Hook

美國最新聯合警報描述的不只是 Internet-exposed PLC：攻擊者會拿走 project files、用原廠 configuration software 修改邏輯，甚至讓 shutdown 與 alarm 不再可信。

## 切入點

從 2026-07-22 更新的美國聯合資安警報，提醒電子製造業把 PLC project files、engineering workstations、vendor configuration tools 與 safety logic 納入 crown jewels。此警報確認的受害領域是美國政府設施、水務與能源，不應誤稱製造業已受害；但其 PLC 品牌、工具與攻擊路徑對工廠高度可轉移。

### 發布價值

同時兼顧攻擊實證、OT safety 與製造業治理，不落入「看到 CVE 就叫停機修補」的簡化敘事。

## 本週新聞支撐論點

| 論點 | 來源 | 日期 | 資訊性質 |
|---|---|---|---|
| FBI、CISA、NSA、EPA、DOE、USCYBERCOM 與 Treasury 於 2026-07-22 更新 AA26-097A，擴大納入 Rockwell Automation／Allen-Bradley、Schneider Electric、Siemens 及可能其他 PLC 品牌；警報指出已造成營運中斷與財務損失。 | CISA / IC3 — Iranian-Affiliated Cyber Actors Exploit Programmable Logic Controllers Across US Critical Infrastructure | 2026-07-22 update | 已證實／政府聯合警報 |
| 警報描述攻擊者使用原廠 configuration software 取得、外洩、修改或刪除 PLC project files，並操弄 HMI／SCADA 顯示；個案中新增邏輯覆寫維持安全操作參數的 instruction sets。 | CISA — AA26-097A advisory page and July 2026 update | 2026-07-22 update | 已證實／官方 |
| SecurityWeek 交叉報導指出，更新內容涵蓋 Rockwell Studio 5000 Logix Designer、Schneider EcoStruxure Control Expert 與 Siemens TIA Portal，並引述警報稱變更可能停用關鍵 shutdown／alarm logic，使系統進入不安全狀態而未告警。 | SecurityWeek — US Warns of Iranian Hackers Targeting Siemens, Schneider, and Rockwell ICS Devices | 2026-07-23 | 第三方交叉報導 |

## LinkedIn 草稿（English）

```
The most dangerous OT incident may not be the plant stopping. It may be the plant continuing to run after its protection logic has been changed.

On 22 July, U.S. agencies updated joint advisory AA26-097A on Iranian-affiliated actors targeting internet-connected PLCs. The update expands observed targeting to Rockwell Automation/Allen-Bradley, Schneider Electric and Siemens devices. It describes project-file theft and modification, HMI/SCADA manipulation, and changes that could disable critical shutdown and alarm logic.

Important boundary: the confirmed affected sectors named in the advisory are U.S. government facilities, water/wastewater and energy—not manufacturing. But the PLC families, engineering tools and attack path are highly transferable to factories.

For manufacturers, PLC project files and vendor configuration tools should be treated as crown jewels: remove direct exposure, baseline and sign project files, monitor engineering-tool use, validate safety logic independently, and rehearse trusted restoration.

Could your plant prove that the logic running today is the logic engineering approved yesterday?
```

## Twitter / X 草稿（English）

> 1/4 The worst OT incident may not stop the plant. It may let the plant keep running after shutdown and alarm logic has been altered.

> 2/4 Updated U.S. advisory AA26-097A describes Iranian-affiliated actors stealing/modifying PLC project files and manipulating HMI/SCADA data.

> 3/4 Confirmed sectors: U.S. government facilities, water/wastewater and energy—not manufacturing. But the affected PLC families and engineering tools are common across industrial environments.

> 4/4 Treat PLC projects as crown jewels: remove direct exposure, sign/baseline files, monitor configuration tools, independently validate safety logic, and rehearse trusted restore.

## Blog 架構

### 當 PLC 還在運轉但邏輯已不可信：製造業應從 AA26-097A 學到什麼

- 事實邊界：官方確認的受害領域不含製造業；本文談的是可轉移至工廠的 PLC／engineering tool 攻擊模式。
- 將 PLC project files、AOI／reusable code、HMI／SCADA configuration 與 engineering workstation 納入完整性管理與備份。
- 比對 running logic、approved golden copy、hash／signature 與最後修改者，不只依賴設備「仍在線」或製程數值看似正常。
- 監看 Studio 5000、EcoStruxure Control Expert、TIA Portal 等 configuration software 的來源主機、使用者、時間與變更內容。
- 讓 safety validation 與 cyber recovery 聯動：隔離 Internet exposure、保護遠端存取、演練 clean project restore，並由 OT engineering 確認安全條件。

## Newsletter／簡訊

美國多個聯邦機關於 7 月 22 日更新 AA26-097A，警告 Iranian-affiliated actors 正針對 Internet-connected PLCs，並新增 Schneider Electric 與 Siemens 等觀察目標。雖然官方確認受影響領域為美國政府設施、水務與能源，而非製造業，但 project-file 外洩／竄改、HMI／SCADA 操弄及 safety logic 失效的攻擊路徑，對使用相同 PLC 與工程工具的工廠具有直接參考價值。（來源：CISA／IC3，2026-07-22；SecurityWeek，2026-07-23）

## Hashtags

#OTSecurity #ICSSecurity #ManufacturingSecurity #OperationalResilience #PLC

## 查核與限制

- 攻擊活動、受影響領域、PLC 品牌、project-file 操弄與主要緩解措施來自美國政府聯合警報及其 2026-07-22 更新。
- 「對電子製造業高度可轉移」是基於相同 PLC 家族與工程工具的專業分析；本次來源沒有證實 Inventec、臺灣電子製造商或一般 manufacturing sector 已遭此波行動入侵。
- 安全邏輯可能被停用是警報及 SecurityWeek 引述的個案描述，不表示每一台受影響型號都已遭同樣修改。
- 文章不提供 IOCs、攻擊步驟或可操作的 PLC 修改方式；發布前可依組織政策決定是否保留 actor attribution。

## 完整來源

1. [Iranian-Affiliated Cyber Actors Exploit Programmable Logic Controllers Across US Critical Infrastructure (AA26-097A, July update)](https://www.ic3.gov/CSA/2026/260722.pdf) — FBI / CISA / NSA / EPA / DOE / CNMF / Treasury via IC3，2026-07-22
2. [Iranian-Affiliated Cyber Actors Exploit Programmable Logic Controllers Across US Critical Infrastructure](https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-097a) — CISA，2026-07-22 update
3. [US Warns of Iranian Hackers Targeting Siemens, Schneider, and Rockwell ICS Devices](https://www.securityweek.com/us-warns-of-iranian-hackers-targeting-siemens-schneider-and-rockwell-ics-devices/) — SecurityWeek，2026-07-23

---

本文件僅使用公開來源，不代表任何公司官方立場；涉及法規適用或 OT 緊急處置時，仍應由法務、產品／內容 owner 與 OT engineering 依實際情境確認。
