export type Answer = { text: string; points: number; aliases?: string[] };
export type Question = { prompt: string; answers: Answer[] };

export const QUESTIONS: Question[];
export const BONUS_QUESTIONS: Question[];
export function pickQuestionIds(
  poolSize: number,
  count: number,
  excluded?: number[],
  random?: () => number,
): number[];
