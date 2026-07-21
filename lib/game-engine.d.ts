export type SurveyAnswer = { text: string; points: number; aliases?: string[] };
export type Difficulty = "easy" | "medium" | "hard";
export function normalizeAnswer(value: unknown): string;
export function similarity(leftValue: unknown, rightValue: unknown): number;
export function findMatchingAnswer(input: string, answers: SurveyAnswer[], revealedIndexes?: number[], difficulty?: Difficulty): number;
export function chooseCpuAnswer(answers: SurveyAnswer[], revealedIndexes?: number[], difficulty?: Difficulty, random?: () => number): string;
export function makeLobbyCode(length?: number): string;
