import type { Question } from "@/lib/types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    slug: "georgia-sea",
    text: "What sea does Georgia sit on?",
  },
];

export function questionBySlug(slug: string) {
  return QUESTIONS.find((item) => item.slug === slug);
}

export function questionPath(slug: string) {
  return `/wiki/q/${slug}`;
}

export const FIRST_QUESTION: Question = QUESTIONS[0];
