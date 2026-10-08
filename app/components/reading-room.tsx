"use client";

import { createContext, useContext } from "react";
import type { Reading } from "../data/readings";
import { editorialMethod } from "../data/rubric";
import { ReadingDialog, useReadingDialog } from "./reading-dialog";
import { useReadingProgress } from "./use-reading-progress";

type ReadingRoomValue = {
  readings: readonly Reading[];
  completed: number[];
  toggleComplete: (id: number) => void;
  openReading: (reading: Reading, trigger?: HTMLElement) => void;
};

const ReadingRoomContext = createContext<ReadingRoomValue | null>(null);

export function useReadingRoom() {
  const value = useContext(ReadingRoomContext);
  if (!value) throw new Error("useReadingRoom 必須在 <ReadingRoom> 之內使用");
  return value;
}

/**
 * 首頁與歷史頁共用的互動外殼：閱讀進度與摘要視窗。頁面本身是 server component，
 * 只把該頁需要的讀物以 props 傳進來，整份 readings.ts 不會進入瀏覽器的 JavaScript。
 */
export function ReadingRoom({
  readings,
  elsewhere,
  titleId,
  dialogContext,
  children,
}: {
  readings: readonly Reading[];
  /** 不在本頁的讀物 ID 與其所在頁面，見 useReadingDialog。 */
  elsewhere?: Readonly<Record<number, string>>;
  titleId: string;
  /** 視窗編號後的第三段：首頁顯示批次，歷史頁顯示週次。 */
  dialogContext: "batch" | "week";
  children: React.ReactNode;
}) {
  const { completed, toggleComplete } = useReadingProgress();
  const { selected, openReading, closeReading } = useReadingDialog(readings, elsewhere);

  return (
    <ReadingRoomContext.Provider value={{ readings, completed, toggleComplete, openReading }}>
      {children}
      {selected && (
        <ReadingDialog
          reading={selected}
          titleId={titleId}
          context={selected[dialogContext]}
          scoreNote={dialogContext === "batch" ? editorialMethod.decisionRule : undefined}
          isDone={completed.includes(selected.id)}
          onToggleComplete={() => toggleComplete(selected.id)}
          onClose={closeReading}
        />
      )}
    </ReadingRoomContext.Provider>
  );
}

export function OpenReadingButton({ id, className, children }: { id: number; className?: string; children: React.ReactNode }) {
  const { readings, openReading } = useReadingRoom();
  const reading = readings.find((item) => item.id === id);
  if (!reading) return null;
  return <button className={className} onClick={(event) => openReading(reading, event.currentTarget)}>{children}</button>;
}

/** 本頁讀物的完成比例；進度與其他頁共用同一份 Local Storage。 */
export function ProgressConsole({ goalLabel }: { goalLabel: string }) {
  const { readings, completed } = useReadingRoom();
  const done = readings.filter((reading) => completed.includes(reading.id)).length;
  const progress = readings.length ? Math.round((done / readings.length) * 100) : 0;
  return (
    <div className="progress-console">
      <div className="progress-value"><b>{progress}%</b><span>{done} / {readings.length} 已完成</span></div>
      <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
      <div className="progress-labels"><span>0%</span><span>{goalLabel}</span><span>100%</span></div>
    </div>
  );
}
