"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ai-security-reading-progress";

/**
 * 閱讀進度只存在使用者瀏覽器。讀取完成前不寫回，否則初始的空陣列會先覆蓋
 * 已存進度（StrictMode 重新掛載、或延後讀取尚未執行就離開頁面）。
 * 儲存被封鎖時頁面照常可用，只是進度不保留。
 */
export function useReadingProgress() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
        setCompleted(Array.isArray(parsed) ? parsed.filter(Number.isInteger) : []);
      } catch {
        setCompleted([]);
      }
      setLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // Storage blocked or full: keep the in-memory progress for this visit.
    }
  }, [completed, loaded]);

  const toggleComplete = (id: number) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return { completed, toggleComplete };
}
