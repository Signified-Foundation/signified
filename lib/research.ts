import { CATALOG, type CatalogFeature } from "@/lib/catalog";
import { FIRST_QUESTION, questionPath } from "@/lib/questions";
import { SEED } from "@/lib/seed";
import type { GraphPayload } from "@/lib/types";
import { featureSlug } from "@/lib/wiki";

export const RESEARCH_QUESTION = FIRST_QUESTION;
export const CONTINUATION_RUN_ID = 1;
export const HATNOTE_FEATURE_ID = 3102;
export const SEE_ALSO_ON_QUESTION = [3108];

export type TrialId = "question" | "lead";

export type MeasuredUnit = {
  id: number;
  label: string;
  lemma: string;
  attribution: number | null;
  activation: number | null;
  layer: number | null;
};

export function questionRuns() {
  return SEED.runs.filter(
    (run) =>
      run.prompt === RESEARCH_QUESTION.text &&
      (run.prompt_kind ?? "lead") === "question",
  );
}

export function continuationRun() {
  const run = SEED.runs.find((item) => item.id === CONTINUATION_RUN_ID);
  if (!run) throw new Error("Missing continuation run");
  return run;
}

export function writerName(modelId: number) {
  return SEED.models.find((item) => item.id === modelId)?.name ?? "Writer";
}

export function featureHref(featureId: number) {
  return `/wiki/${featureSlug(featureId)}`;
}

export function catalogFeature(id: number): CatalogFeature | undefined {
  return CATALOG.find((item) => item.id === id);
}

/** Units from the graph on this run only. Empty if the run was not traced. */
export function measuredOnRun(runId: number): MeasuredUnit[] {
  const graph = SEED.graphs[runId];
  if (!graph) return [];
  return graph.nodes
    .filter(
      (node) => node.kind === "feature" && typeof node.feature_id === "number",
    )
    .map((node) => {
      const id = node.feature_id as number;
      const item = catalogFeature(id);
      return {
        id,
        label: item?.label ?? `Feature ${id}`,
        lemma: item?.lemma ?? node.label,
        attribution: node.attribution ?? null,
        activation: node.activation ?? null,
        layer: node.layer ?? null,
      };
    });
}

export function seeAlsoForTrial(trial: TrialId): CatalogFeature[] {
  if (trial !== "question") return [];
  const items: CatalogFeature[] = [];
  for (const id of SEE_ALSO_ON_QUESTION) {
    if (id === HATNOTE_FEATURE_ID) continue;
    const item = catalogFeature(id);
    if (item) items.push(item);
  }
  return items;
}

export function reviewsForRun(runId: number) {
  return SEED.reviews.filter((item) => item.run_id === runId);
}

export function userName(userId: number) {
  return SEED.users.find((item) => item.id === userId)?.name ?? "Someone";
}

export function questionHref() {
  return questionPath(RESEARCH_QUESTION.slug);
}

export type ResearchReview = {
  id: number;
  stance: string;
  text: string;
  author: string;
};

export type ResearchWriter = {
  id: number;
  writer: string;
  output: string;
  units: MeasuredUnit[];
  reviews: ResearchReview[];
  graph: GraphPayload | null;
};

export type ResearchSeeAlso = {
  id: number;
  label: string;
  lemma: string;
  href: string;
};

export type ResearchPayload = {
  question: { text: string; href: string };
  hatnote: { id: number; label: string; href: string };
  writers: ResearchWriter[];
  lead: {
    id: number;
    writer: string;
    prompt: string;
    output: string;
    units: MeasuredUnit[];
    graph: GraphPayload | null;
  };
  seeAlso: ResearchSeeAlso[];
};

export function researchPayload(): ResearchPayload {
  const hatnoteItem = catalogFeature(HATNOTE_FEATURE_ID);
  return {
    question: {
      text: RESEARCH_QUESTION.text,
      href: questionHref(),
    },
    hatnote: {
      id: HATNOTE_FEATURE_ID,
      label: hatnoteItem?.label ?? `Feature ${HATNOTE_FEATURE_ID}`,
      href: featureHref(HATNOTE_FEATURE_ID),
    },
    writers: questionRuns().map((run) => ({
      id: run.id,
      writer: writerName(run.model_id),
      output: run.output,
      units: measuredOnRun(run.id),
      graph: SEED.graphs[run.id] ?? null,
      reviews: reviewsForRun(run.id).map((item) => ({
        id: item.id,
        stance: item.stance,
        text: item.text,
        author: userName(item.author_id),
      })),
    })),
    lead: (() => {
      const run = continuationRun();
      return {
        id: run.id,
        writer: writerName(run.model_id),
        prompt: run.prompt,
        output: run.output,
        units: measuredOnRun(run.id),
        graph: SEED.graphs[run.id] ?? null,
      };
    })(),
    seeAlso: seeAlsoForTrial("question").map((item) => ({
      id: item.id,
      label: item.label,
      lemma: item.lemma,
      href: featureHref(item.id),
    })),
  };
}

