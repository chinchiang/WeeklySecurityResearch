import Link from "next/link";
import { sitePath } from "../site-config";
import { ProgressConsole, ReadingRoom } from "../components/reading-room";
import { ReadingLibrary } from "../components/reading-library";
import {
  archiveTopicFilters,
  allWeeks,
  archiveDateRange,
  archiveReadings,
  archiveWeeks,
  currentReadings,
} from "../data/readings";

// The current issue is not part of the archive; its /archive/#reading-<id> links open on the homepage.
const elsewhere = Object.fromEntries(currentReadings.map((reading) => [reading.id, sitePath(`/#reading-${reading.id}`)]));

export default function ArchivePage() {
  return (
    <div className="site">
      <a className="skip-link" href="#main">跳到主要內容</a>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="返回最新一期">
          <span className="brand-mark">研</span>
          <span>
            <strong>科技・資安・架構週讀</strong>
            <small>READING INTELLIGENCE HUB</small>
          </span>
        </Link>
        <Link className="mobile-history-link" href="/">最新一期</Link>
        <nav aria-label="歷史資料導覽">
          <Link href="/">最新一期</Link>
          <a href="#archive-index">歷史索引</a>
          <a href="#archive-progress">閱讀進度</a>
        </nav>
        <div className="live-state"><i /> ARCHIVE VERIFIED</div>
      </header>

      <ReadingRoom readings={archiveReadings} elsewhere={elsewhere} titleId="archive-detail-title" dialogContext="week">
      <main id="main">
      <section className="archive-hero" id="top">
        <div>
          <p className="eyebrow">RESEARCH ARCHIVE · SINCE {allWeeks[0]}</p>
          <h1>歷史<span>閱讀資料庫</span></h1>
          <p>
            保存過往每週入選內容，與最新一期分開管理。可依主題、判定與關鍵字查詢，
            並直接開啟原始來源或 PDF。
          </p>
          <Link className="secondary-button" href="/">← 返回最新一期</Link>
        </div>
        <div className="archive-stat" role="group" aria-label="歷史資料統計">
          <b>{String(archiveReadings.length).padStart(2, "0")}</b>
          <span>ARCHIVED READINGS</span>
          <p>{archiveDateRange}</p>
        </div>
      </section>

      <section className="library archive-library" id="archive-index">
        <ReadingLibrary variant="archive" topicFilters={archiveTopicFilters} weeks={archiveWeeks} dateRange={archiveDateRange} />
      </section>

      <section className="archive-progress" id="archive-progress">
        <div>
          <p className="eyebrow">ARCHIVE READING PROGRESS</p>
          <h2>歷史資料閱讀進度</h2>
          <p>閱讀狀態與最新一期共用，僅儲存在目前瀏覽器。</p>
        </div>
        <ProgressConsole goalLabel="歷史清單閱讀目標" />
      </section>
      </main>
      </ReadingRoom>
      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark">研</span>
          <span>
            <strong>科技・資安・架構週讀</strong>
            <small>RESEARCH ARCHIVE</small>
          </span>
        </div>
        <p>歷史資料獨立保存 · 正體中文／臺灣慣用語</p>
        <Link href="/">返回最新一期 →</Link>
      </footer>
    </div>
  );
}
