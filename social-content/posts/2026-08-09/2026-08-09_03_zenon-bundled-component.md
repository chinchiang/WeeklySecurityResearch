# 你盤點的是 Zenon，漏洞卻藏在它帶進來的 MongoDB

- **週次：** 2026-08-09
- **研究範圍：** 2026-08-02 至 2026-08-09
- **選題 03／主題：** OT / Manufacturing
- **發布狀態：** Ready

## Hook

CISA 的 ABB Ability Zenon advisory 提醒製造業：產品名稱層級的 asset inventory，看不到被工業軟體一起帶入的 EOL components。

## 切入點

把 OT asset inventory 從產品名稱提升到 embedded components、feature usage 與 lifecycle ownership。

## 本週支撐論點與查核

1. **風險位於 bundled component，而非單純產品名稱。** CISA 於 2026-08-06 發布 ICSA-26-218-01：ABB Ability Zenon 的 IIoT Services 安裝 MongoDB 4.2；advisory 涵蓋 13 個漏洞，最高 CVSS v3 7.8，並指出相關部署包含 Critical Manufacturing 等多個領域。（CISA，2026-08-06）  
   https://www.cisa.gov/news-events/ics-advisories/icsa-26-218-01

2. **處置取決於功能是否真的使用。** ABB／CISA 建議：若 IIoT Services 必須保留，手動更換為受支援且已修補的 MongoDB；若不需要，透過 Control Panel 移除 IIoT Services。CISA 表示目前沒有已知針對這些漏洞的公開利用。（CISA，2026-08-06）  
   https://www.cisa.gov/news-events/ics-advisories/icsa-26-218-01

3. **本週有跨區域交叉確認。** JPCERT/CC 的 JVN 於 2026-08-07 列入同一批三項 CISA ICS／medical advisories；Berigo 於 2026-08-07 說明 Zenon 案例的核心是 EOL database dependency，而不是被描述成已發生的製造業入侵。（JVN，2026-08-07；Berigo，2026-08-07）  
   https://jvn.jp/vu/JVNVU92842469/
   https://berigo.no/en/news/industrial-software-with-an-outdated-database

| 來源 | 原始標題 | 發布／更新日期 | 事件日期 | 支持的論點 |
|---|---|---:|---:|---|
| CISA | ABB Ability Zenon (ICSA-26-218-01) | 2026-08-06 | 2026-08-06 | 產品、bundled MongoDB、漏洞、CVSS、產業、mitigation、無已知公開利用 |
| JPCERT/CC JVN | CISA ICS Advisory / ICS Medical Advisory（2026年08月06日） | 2026-08-07 | 2026-08-06 | 日本官方協調機構確認 advisory 發布 |
| Berigo | The industrial software shipped with a database that went out of date years ago | 2026-08-07 | 2026-08-06 | 第三方分析 dependency 與 asset/SBOM 決策意義 |

- **已證實事實：** MongoDB 4.2、13 漏洞、最高 CVSS v3 7.8、mitigation 與無已知公開利用來自 CISA advisory。
- **不是事件通報：** 來源描述 vulnerability exposure，不代表 ABB、特定工廠、Inventec 或臺灣電子製造業已遭入侵。
- **第三方分析：** Berigo 對 dependency／SBOM 的解讀屬分析，不是 CISA 的法規要求。
- **分析判斷：** 將 asset inventory 擴成 component inventory、feature usage、maintenance owner 與 removal path，是針對跨國製造環境提出的控制建議。

## LinkedIn 草稿｜繁體中文

OT vulnerability management 最危險的盲點，常不是沒有產品清單，而是清單只寫「ABB Ability Zenon」。

CISA 於 8 月 6 日發布 advisory：安裝 Zenon IIoT Services 時會帶入 MongoDB 4.2；這個 EOL component 涉及 13 個已知漏洞，最高 CVSS v3 7.8。ABB 的處置不是一般 hotfix：若功能需要，手動換成受支援的 MongoDB；若不需要，就移除 IIoT Services。CISA 表示目前無已知公開利用。

對工廠的決策意義很直接：asset inventory 必須延伸到 embedded components、feature usage、維護責任與 removal path。你的 OT inventory 能查出每套工業軟體實際帶了哪些第三方元件嗎？

#OTSecurity #ManufacturingSecurity #SBOM #ICS #SupplyChainSecurity

## LinkedIn draft | English

The most dangerous blind spot in OT vulnerability management is often not the absence of a product inventory. It is an inventory that stops at “ABB Ability Zenon.”

CISA published an advisory on 6 August covering Zenon installations where IIoT Services bundle MongoDB 4.2. The end-of-life component is associated with 13 known vulnerabilities, with a highest CVSS v3 score of 7.8. ABB’s remediation is not a normal product hotfix: manually replace MongoDB with a supported release when IIoT Services are required, or uninstall the services when they are not. CISA reported no known public exploitation targeting the issue.

For manufacturers, the decision lesson is simple: extend the asset inventory to embedded components, feature usage, maintenance ownership and a safe removal path. A product name alone is not enough to answer exposure.

Could your OT inventory identify every third-party component actually shipped inside industrial software?

#OTSecurity #ManufacturingSecurity #SBOM #ICS #SupplyChainSecurity

## Twitter／X 草稿｜繁體中文

1/4 你的 OT inventory 可能寫「ABB Ability Zenon」，但真正需要修的是隨 IIoT Services 安裝的 EOL MongoDB 4.2。

2/4 CISA 8/6 advisory 列出 13 個已知漏洞，最高 CVSS v3 7.8；目前無已知公開利用。

3/4 ABB 建議：需要 IIoT 就手動換成受支援 MongoDB；不需要就移除 IIoT Services。

4/4 產品清單要升級成 component inventory＋feature usage＋maintenance owner＋removal path。

#OTSecurity #ManufacturingSecurity #SBOM #ICS #SupplyChainSecurity

## Twitter/X draft | English

1/4 Your OT inventory may say “ABB Ability Zenon,” but the component requiring action is EOL MongoDB 4.2 bundled with IIoT Services.

2/4 CISA’s 6 Aug advisory lists 13 known vulnerabilities, highest CVSS v3 7.8; no known public exploitation.

3/4 ABB: replace MongoDB manually if IIoT is required, or remove IIoT Services if it is not.

4/4 Upgrade product inventory to component inventory + feature use + maintenance owner + removal path.

#OTSecurity #ManufacturingSecurity #SBOM #ICS #SupplyChainSecurity

## Blog 要點｜繁體中文

**標題：產品清單看不到的風險：從 ABB Zenon 的 EOL MongoDB 談 OT Component Inventory**

- 分辨 product、optional feature 與 bundled third-party component。
- 對每個工廠確認 IIoT Services 是否實際安裝與使用。
- 要求 vendor／integrator 提供 component inventory、support window 與更新責任。
- 對必要功能規劃受控 replacement；對不用功能建立安全 removal path。
- 將 component EOL 納入採購、FAT／SAT、MOC 與 lifecycle review。

#OTSecurity #ManufacturingSecurity #SBOM #ICS #SupplyChainSecurity

## Blog outline | English

**Title: The Risk Your Product List Cannot See: OT Component Inventory after the ABB Zenon Advisory**

- Distinguish the product, optional feature and bundled third-party component.
- Confirm whether IIoT Services are installed and actually used at each site.
- Require vendors and integrators to provide component inventory, support windows and update ownership.
- Plan controlled replacement for required functions and a safe removal path for unused ones.
- Add component EOL to procurement, FAT/SAT, management of change and lifecycle reviews.

#OTSecurity #ManufacturingSecurity #SBOM #ICS #SupplyChainSecurity

## Newsletter／簡訊｜繁體中文

CISA 於 2026-08-06 發布 ABB Ability Zenon advisory：IIoT Services 會帶入 EOL MongoDB 4.2，涉及 13 個已知漏洞，最高 CVSS v3 7.8；目前無已知公開利用。處置取決於功能需求——換成受支援版本，或在不需要時移除 IIoT Services，凸顯 OT component inventory 的必要性。（來源：CISA，2026-08-06；JPCERT/CC JVN，2026-08-07）

#OTSecurity #ManufacturingSecurity #SBOM #ICS #SupplyChainSecurity

## Newsletter / message | English

CISA’s 6 August 2026 ABB Ability Zenon advisory says IIoT Services bundle end-of-life MongoDB 4.2, exposing 13 known vulnerabilities with a highest CVSS v3 score of 7.8; no known public exploitation was reported. Remediation depends on actual feature use—replace MongoDB with a supported version or remove unused IIoT Services—highlighting the need for OT component inventory. (Sources: CISA, 6 August 2026; JPCERT/CC JVN, 7 August 2026)

#OTSecurity #ManufacturingSecurity #SBOM #ICS #SupplyChainSecurity
