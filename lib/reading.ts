export const READING_WORDS = [
  { word: "quiet", at: 0.12 },
  { word: "weak", at: 0.28 },
  { word: "mixed", at: 0.52 },
  { word: "active", at: 0.82 },
] as const;

export type ReadingWord = (typeof READING_WORDS)[number]["word"];

export function wordFor(weight: number): ReadingWord {
  return READING_WORDS.reduce((best, item) =>
    Math.abs(item.at - weight) < Math.abs(best.at - weight) ? item : best,
  ).word;
}
