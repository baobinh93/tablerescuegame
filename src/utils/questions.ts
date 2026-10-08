import type { Question, Operation } from "../types";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeChoices(answer: number): number[] {
  const set = new Set<number>([answer]);
  const offsets = shuffle([-2, -1, 1, 2, -3, 3, -4, 4, 5, -5]);

  for (const offset of offsets) {
    const candidate = answer + offset;
    if (candidate >= 1) set.add(candidate);
    if (set.size === 4) break;
  }
  return shuffle([...set]);
}

export function generateQuestion(): Question {
  const operation: Operation = Math.random() < 0.58 ? "multiply" : "divide";

  if (operation === "multiply") {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    const answer = a * b;
    return { a, b, operation, answer, choices: makeChoices(answer) };
  }

  const divisor = Math.floor(Math.random() * 8) + 2;
  const quotient = Math.floor(Math.random() * 9) + 1;
  const dividend = divisor * quotient;

  return {
    a: dividend,
    b: divisor,
    operation,
    answer: quotient,
    choices: makeChoices(quotient),
  };
}

export function generateQuestions(count = 10): Question[] {
  return Array.from({ length: count }, () => generateQuestion());
}