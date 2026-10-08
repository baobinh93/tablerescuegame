import type { GameProgress, LevelResult } from "../types";

const STORAGE_KEY = "princess-math-rescue-progress-v1";

const defaultProgress: GameProgress = {
  unlockedLevel: 1,
  totalScore: 0,
  levels: {},
};

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as GameProgress;
    return {
      unlockedLevel: Math.min(10, Math.max(1, parsed.unlockedLevel || 1)),
      totalScore: parsed.totalScore || 0,
      levels: parsed.levels || {},
    };
  } catch {
    return defaultProgress;
  }
}

export function saveLevelResult(
  current: GameProgress,
  level: number,
  result: LevelResult
): GameProgress {
  const old = current.levels[level];
  const merged: LevelResult = {
    score: Math.max(old?.score ?? 0, result.score),
    stars: Math.max(old?.stars ?? 0, result.stars),
    correct: Math.max(old?.correct ?? 0, result.correct),
    bestTime:
      old?.bestTime && old.bestTime > 0
        ? Math.min(old.bestTime, result.bestTime || old.bestTime)
        : result.bestTime,
  };

  const levels = { ...current.levels, [level]: merged };
  const totalScore = Object.values(levels).reduce((sum, item) => sum + item.score, 0);
  const unlockedLevel = Math.min(10, Math.max(current.unlockedLevel, level < 10 ? level + 1 : 10));

  const next = { unlockedLevel, totalScore, levels };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetProgress(): GameProgress {
  localStorage.removeItem(STORAGE_KEY);
  return defaultProgress;
}