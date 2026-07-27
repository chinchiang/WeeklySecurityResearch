# PLC 被攻擊時，最危險的不是停機，而是產線仍在跑、保護邏輯卻已被改掉

> **本週主題：** OT / Manufacturing  
> **研究期間：** 2026-07-20 — 2026-07-27  
> **重新執行：** 2026-07-27（Asia/Taipei）  
> **重跑結論：** 未發現更晚且足以取代本題的高可信度事件；已重新核實官方警報。  
> **建議優先度：** P0 / 高衝擊

## 標題／Hook

美國最新聯合警報描述的不只是 Internet-exposed PLC：攻擊者會拿走 project files、用原廠 configuration software 修改邏輯，甚至讓 shutdown 與 alarm 不再可信。

## 切入點

從 2026-07-22 更新的美國聯合資安警報，提醒電子製造業把 PLC project files、engineering workstations、vendor configuration tools 與 safety logic 納入 crown jewels。官方確認受害領域是美國政府設施、水務與能源，不應誤稱製造業已受害；但 PLC 品牌、工具與攻擊路徑對工廠高度可轉移。

## 本週新聞支撐論點

- FBI、CISA、NSA、EPA、DOE、USCYBERCOM 與 Treasury 於 2026-07-22 更新 AA26-097A，新增／擴大 Rockwell Automation／Allen-Bradley、Schneider Electric、Siemens 及可能其他 PLC 品牌的觀察目標。（政府聯合警報）
- 警報描述攻擊者以原廠 configuration software 取得、外洩、修改或刪除 PLC project files，操弄 HMI／SCADA；個案中新增邏輯覆寫維持安全參數的 instruction sets。（IC3／CISA，2026-07-22）
- SecurityWeek 於 2026-07-23 交叉報導 Studio 5000、EcoStruxure Control Expert 與 TIA Portal，並指出變更可能停用 shutdown／alarm logic。（第三方交叉報導）

## LinkedIn 草稿（English）

The most dangerous OT incident may not be the plant stopping. It may be the plant continuing to run after its protection logic has been changed.

On 22 July, U.S. agencies updated joint advisory AA26-097A on Iranian-affiliated actors targeting internet-connected PLCs. The update expands observed targeting to Rockwell Automation/Allen-Bradley, Schneider Electric and Siemens devices. It describes project-file theft and modification, HMI/SCADA manipulation, and changes that could disable critical shutdown and alarm logic.

Important boundary: the confirmed affected sectors named in the advisory are U.S. government facilities, water/wastewater and energy—not manufacturing. But the PLC families, engineering tools and attack path are highly transferable to factories.

For manufacturers, PLC project files and vendor configuration tools should be treated as crown jewels: remove direct exposure, baseline and sign project files, monitor engineering-tool use, validate safety logic independently, and rehearse trusted restoration.

Could your plant prove that the logic running today is the logic engineering approved yesterday?

## Twitter / X 草稿（English）

1/4 The worst OT incident may not stop the plant. It may let the plant keep running after shutdown and alarm logic has been altered.

2/4 Updated U.S. advisory AA26-097A describes project-file theft/modification and HMI/SCADA manipulation.

3/4 Confirmed sectors are U.S. government facilities, water/wastewater and energy—not manufacturing. The tooling and attack path are nevertheless transferable.

4/4 Treat PLC projects as crown jewels: remove exposure, baseline files, monitor configuration tools, independently validate safety logic, and rehearse trusted restore.

## Blog 架構

### 當 PLC 還在運轉但邏輯已不可信：製造業應從 AA26-097A 學到什麼

- 清楚標示官方確認受害領域不含製造業。
- 將 PLC project files、HMI／SCADA configuration 與 engineering workstation 納入完整性管理。
- 比對 running logic、approved golden copy、hash／signature 與最後修改者。
- 監看 Studio 5000、EcoStruxure Control Expert、TIA Portal 的使用情形。
- 讓 safety validation 與 cyber recovery 聯動。

## Newsletter／簡訊

美國多個聯邦機關於 7 月 22 日更新 AA26-097A，警告 Iranian-affiliated actors 針對 Internet-connected PLCs，並新增 Schneider Electric 與 Siemens 等觀察目標。雖然官方確認受影響領域為政府設施、水務與能源，而非製造業，但 project-file 竄改、HMI／SCADA 操弄及 safety logic 失效的攻擊路徑，對使用相同工具的工廠具有直接參考價值。（來源：CISA／IC3，2026-07-22；SecurityWeek，2026-07-23）

## Hashtags

#OTSecurity #ICSSecurity #ManufacturingSecurity #OperationalResilience #PLC

## 查核界線

- 對電子製造業的可轉移性是專業分析；沒有證據顯示臺灣電子製造商或一般 manufacturing sector 已遭此波行動入侵。
- 安全邏輯可能被停用是警報個案，不代表所有受影響型號均遭相同修改。

## 完整來源

1. [Iranian-Affiliated Cyber Actors Exploit Programmable Logic Controllers Across US Critical Infrastructure (AA26-097A)](https://www.ic3.gov/CSA/2026/260722.pdf) — FBI / CISA / NSA / EPA / DOE / CNMF / Treasury via IC3，2026-07-22
2. [CISA AA26-097A advisory](https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-097a) — CISA，2026-07-22 update
3. [US Warns of Iranian Hackers Targeting Siemens, Schneider, and Rockwell ICS Devices](https://www.securityweek.com/us-warns-of-iranian-hackers-targeting-siemens-schneider-and-rockwell-ics-devices/) — SecurityWeek，2026-07-23

