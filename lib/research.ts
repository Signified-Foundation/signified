import {
  CATALOG,
  CATALOG_RUNS,
  type CatalogFeature,
  type FeatureStatus,
} from "@/lib/catalog";
import { CONTINUATION_PATH, FIRST_QUESTION, questionPath } from "@/lib/questions";
import { SEED } from "@/lib/seed";
import type { GraphPayload, UserKind } from "@/lib/types";
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

export function continuationHref() {
  return CONTINUATION_PATH;
}

/** Prompt → units → output for a catalogued run, with a hop back to its page. */
export function observationPath(runId: number) {
  const catalog = CATALOG_RUNS.find((row) => row.id === runId);
  const units = measuredOnRun(runId);
  return {
    prompt: catalog?.prompt ?? "",
    output: catalog?.output ?? "",
    unitIds: units.map((item) => item.id),
    traced: units.length > 0,
    promptHref: runId === CONTINUATION_RUN_ID ? CONTINUATION_PATH : undefined,
  };
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

export type DensityBin = {
  log10: number;
  continuation: number;
  other: number;
};

export type DensityMark = {
  id: number;
  label: string;
  log10: number;
  series: "continuation" | "other";
};

export type DensityFigure = {
  bins: DensityBin[];
  marks: DensityMark[];
};

export type ResearchTile = {
  id: number;
  lemma: string;
  label: string;
  runId: number;
  kicker: string;
  status: FeatureStatus;
  series: "continuation" | "other";
  activation: number | null;
  href: string;
  hold: string;
  left: { text: string; by: string };
  right: { text: string; by: string } | null;
};

export type ResearchComment = {
  id: number;
  author: string;
  kind: UserKind;
  text: string;
  parent_id: number | null;
  created_at: string;
};

export type EvidencePath = {
  left: string;
  unit: string;
  right: string;
  note: string;
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
  tiles: ResearchTile[];
  density: DensityFigure;
};

function gauss(log10: number, mean: number, sigma: number, amp: number) {
  const z = (log10 - mean) / sigma;
  return Math.max(0, Math.round(amp * Math.exp(-0.5 * z * z)));
}

/** Fixture SAE-style histogram. Not circuit-tracer. */
export function densityFigure(): DensityFigure {
  const bins: DensityBin[] = [];
  for (let step = -52; step <= -4; step += 2) {
    const log10 = step / 10;
    bins.push({
      log10,
      continuation: gauss(log10, -2.45, 0.82, 40) + (log10 < -4.6 ? 18 : 0),
      other: gauss(log10, -2.15, 0.9, 34) + (log10 < -4.8 ? 12 : 0),
    });
  }
  return {
    bins,
    marks: [
      { id: 3102, label: "3102", log10: -1.8, series: "continuation" },
      { id: 3108, label: "3108", log10: -2.4, series: "continuation" },
      { id: 2104, label: "2104", log10: -2.0, series: "other" },
    ],
  };
}

export function researchTiles(): ResearchTile[] {
  return CATALOG.map((item) => {
    const feat = SEED.features.find((row) => row.feature_id === item.id);
    const run = CATALOG_RUNS.find((row) => row.id === item.runId);
    return {
      id: item.id,
      lemma: item.lemma,
      label: item.label,
      runId: item.runId,
      kicker: run?.kicker ?? `Run ${item.runId}`,
      status: item.status,
      series: item.runId === CONTINUATION_RUN_ID ? "continuation" : "other",
      activation: feat?.activation ?? null,
      href: featureHref(item.id),
      hold: item.hold,
      left: item.left,
      right: item.right,
    };
  });
}

export function commentsForFeature(featureId: number): ResearchComment[] {
  const row = SEED.features.find((item) => item.feature_id === featureId);
  if (!row) return [];
  return SEED.comments
    .filter((item) => item.feature_pk === row.id)
    .map((item) => ({
      id: item.id,
      author: userName(item.author_id),
      kind: SEED.users.find((user) => user.id === item.author_id)?.kind ?? "person",
      text: item.text,
      parent_id: item.parent_id,
      created_at: item.created_at,
    }));
}

export function contrastPath(tile: ResearchTile): EvidencePath {
  return {
    left: `${tile.left.by}'s frame`,
    unit: tile.label,
    right: tile.right ? `${tile.right.by}'s frame` : "An unmatched frame",
    note: "The test to run: two frames on this unit.",
  };
}

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
    tiles: researchTiles(),
    density: densityFigure(),
  };
}

