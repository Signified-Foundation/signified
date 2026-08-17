export type FeatureStatus = "contested" | "unresolved" | "supported" | "none";
export type ArticleField = "types" | "paper";

export type CatalogFeature = {
  id: number;
  runId: number;
  modelName: string;
  nodeId: string;
  label: string;
  lemma: string;
  status: FeatureStatus;
  field: ArticleField;
  left: { text: string; by: string };
  right: { text: string; by: string } | null;
  hold: string;
};

export const CATALOG: CatalogFeature[] = [
  {
    id: 18472,
    runId: 1,
    modelName: "Gemma 2 2B",
    nodeId: "feat-18472",
    label: "Feature 18472",
    lemma: "Australian geographic entities",
    status: "contested",
    field: "types",
    left: {
      text: "Feature 18472 represents Australian geographic entities.",
      by: "Alex",
    },
    right: {
      text: "Feature 18472 is capital-city retrieval, not Australian geography.",
      by: "Sam",
    },
    hold: "Both remain.",
  },
  {
    id: 2201,
    runId: 1,
    modelName: "Gemma 2 2B",
    nodeId: "feat-2201",
    label: "Feature 2201",
    lemma: "‘capital of [country]’ frame",
    status: "unresolved",
    field: "paper",
    left: {
      text: "Detects the ‘capital of [country]’ syntactic frame.",
      by: "Sam",
    },
    right: null,
    hold: "No second reading yet.",
  },
  {
    id: 3308,
    runId: 1,
    modelName: "Gemma 2 2B",
    nodeId: "feat-3308",
    label: "Feature 3308",
    lemma: "Canberra as a lexical unit",
    status: "contested",
    field: "types",
    left: {
      text: "A Canberra-specific lexical feature.",
      by: "Sam",
    },
    right: {
      text: "Would fire on any Australian capital name.",
      by: "Alex",
    },
    hold: "Both remain.",
  },
  {
    id: 4410,
    runId: 1,
    modelName: "Gemma 2 2B",
    nodeId: "feat-4410",
    label: "Feature 4410",
    lemma: "Named geopolitical entities",
    status: "supported",
    field: "types",
    left: {
      text: "Fires on named geopolitical entities.",
      by: "Alex",
    },
    right: null,
    hold: "Supported. Uncontested is not settled.",
  },
  {
    id: 6701,
    runId: 1,
    modelName: "Gemma 2 2B",
    nodeId: "feat-6701",
    label: "Feature 6701",
    lemma: "Genitive ‘of [country]’",
    status: "unresolved",
    field: "paper",
    left: {
      text: "Tracks the genitive ‘of [country]’, independent of ‘capital’.",
      by: "Alex",
    },
    right: null,
    hold: "A proposed test. Not an intervention.",
  },
  {
    id: 8834,
    runId: 1,
    modelName: "Gemma 2 2B",
    nodeId: "feat-8834",
    label: "Feature 8834",
    lemma: "No reading yet",
    status: "none",
    field: "paper",
    left: {
      text: "This feature has no article yet.",
      by: "A reading begins when someone writes one.",
    },
    right: null,
    hold: "Select it, then propose a reading.",
  },
  {
    id: 2104,
    runId: 2,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-2104",
    label: "Feature 2104",
    lemma: "wrath / μῆνις",
    status: "contested",
    field: "types",
    left: {
      text: "A detector of heroic anger, the poem’s first word.",
      by: "Alex",
    },
    right: {
      text: "A completion cue for “Achilles,” not wrath as such.",
      by: "Sam",
    },
    hold: "Both remain.",
  },
  {
    id: 5560,
    runId: 2,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-5560",
    label: "Feature 5560",
    lemma: "Paris",
    status: "contested",
    field: "types",
    left: {
      text: "The prince who awards the apple; desire, not a place.",
      by: "Alex",
    },
    right: {
      text: "A name-token. It would fire on Paris, France in a capital frame.",
      by: "Sam",
    },
    hold: "Person versus city, on purpose.",
  },
  {
    id: 7781,
    runId: 2,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-7781",
    label: "Feature 7781",
    lemma: "Helen",
    status: "contested",
    field: "types",
    left: {
      text: "The contested cause of the war.",
      by: "Alex",
    },
    right: {
      text: "A retrieval slot for “of Troy.”",
      by: "Sam",
    },
    hold: "Desire, blame, fame. Not geography.",
  },
];

export const CATALOG_RUNS = [
  {
    id: 1,
    modelName: "Gemma 2 2B",
    role: "Writer",
    prompt: "The capital of Australia is",
    output: "Canberra",
    kicker: "Canberra run",
  },
  {
    id: 2,
    modelName: "GPT-OSS 20B",
    role: "Writer",
    prompt: "Sing, goddess, the wrath of",
    output: "Achilles",
    kicker: "Iliad run",
  },
] as const;

export function catalogForRun(runId: number) {
  return CATALOG.filter((item) => item.runId === runId);
}

export function articleState(item: CatalogFeature): "approved" | "loading" {
  return item.status === "none" ? "loading" : "approved";
}

export function articleStateLabel(item: CatalogFeature) {
  if (articleState(item) === "loading") return "loading";
  return item.status;
}

export function articleField(featureId: number): ArticleField {
  return CATALOG.find((item) => item.id === featureId)?.field ?? "paper";
}
