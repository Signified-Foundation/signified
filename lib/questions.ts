import { CATALOG, type CatalogFeature } from "@/lib/catalog";
import type { Question } from "@/lib/types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    slug: "georgia-sea",
    text: "What sea does Georgia sit on?",
    related_feature_ids: [3102],
  },
];

export function questionBySlug(slug: string) {
  return QUESTIONS.find((item) => item.slug === slug);
}

export const WIKI_PATH = "/research";

export function questionPath(_slug?: string) {
  return WIKI_PATH;
}

export const CONTINUATION_PATH = WIKI_PATH;

export function questionsForFeature(featureId: number) {
  return QUESTIONS.filter((item) =>
    item.related_feature_ids.includes(featureId),
  );
}

export function relatedFeatures(question: Question): CatalogFeature[] {
  return question.related_feature_ids
    .map((id) => CATALOG.find((item) => item.id === id))
    .filter((item): item is CatalogFeature => Boolean(item));
}

export const FIRST_QUESTION: Question = QUESTIONS[0];
