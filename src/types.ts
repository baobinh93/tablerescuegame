export type Operation = "multiply" | "divide";

export interface Question {
  a: number;
  b: number;
  operation: Operation;
  answer: number;
  choices: number[];
}

export interface LevelResult {
  score: number;
  stars: number;
  correct: number;
  bestTime: number;
}

export interface GameProgress {
  unlockedLevel: number;
  totalScore: number;
  levels: Record<number, LevelResult>;
}