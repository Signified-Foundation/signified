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
    id: 3102,
    runId: 1,
    modelName: "Gemma 2 2B",
    nodeId: "feat-3102",
    label: "Feature 3102",
    lemma: "Georgia",
    status: "contested",
    field: "types",
    left: {
      text: "The historical country: wine, church, the range.",
      by: "Alex",
    },
    right: {
      text: "A name-token. It would also complete Atlanta in an American frame.",
      by: "Sam",
    },
    hold: "Country versus state, on purpose.",
  },
  {
    id: 3108,
    runId: 1,
    modelName: "Gemma 2 2B",
    nodeId: "feat-3108",
    label: "Feature 3108",
    lemma: "Caucasus",
    status: "contested",
    field: "paper",
    left: {
      text: "The mountain world the sentence is about, not a region-slot.",
      by: "Alex",
    },
    right: {
      text: "A place-noun after “region.” It would fire on Balkans, Andes, Alps.",
      by: "Sam",
    },
    hold: "Both remain.",
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
  {
    id: 4402,
    runId: 3,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-4402",
    label: "Feature 4402",
    lemma: "phlogiston",
    status: "contested",
    field: "types",
    left: {
      text: "A discarded ontology: the thing they thought fire was.",
      by: "Alex",
    },
    right: {
      text: "A “wrong theory” slot. It would also complete ether, caloric, humours.",
      by: "Sam",
    },
    hold: "Both remain.",
  },
  {
    id: 4404,
    runId: 3,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-4404",
    label: "Feature 4404",
    lemma: "caloric",
    status: "unresolved",
    field: "paper",
    left: {
      text: "A sister of phlogiston: heat as a fluid, also discarded.",
      by: "Alex",
    },
    right: null,
    hold: "No second reading yet.",
  },
  {
    id: 4408,
    runId: 4,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-4408",
    label: "Feature 4408",
    lemma: "the ether",
    status: "contested",
    field: "types",
    left: {
      text: "The negative result that made relativity thinkable.",
      by: "Alex",
    },
    right: {
      text: "The next word after “failed to detect” in a physics lead.",
      by: "Sam",
    },
    hold: "Both remain.",
  },
  {
    id: 5510,
    runId: 5,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-5510",
    label: "Feature 5510",
    lemma: "the passions",
    status: "contested",
    field: "types",
    left: {
      text: "Hume’s claim: reason as instrument, passion as master.",
      by: "Alex",
    },
    right: {
      text: "A quotation latch. It would fire on any “slave of Y” line.",
      by: "Sam",
    },
    hold: "Both remain.",
  },
  {
    id: 5520,
    runId: 6,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-5520",
    label: "Feature 5520",
    lemma: "archetypes",
    status: "contested",
    field: "types",
    left: {
      text: "A detector of the collective-unconscious idea, not the word.",
      by: "Alex",
    },
    right: {
      text: "A glossary slot for “Jungian.” It would complete shadow, anima, persona.",
      by: "Sam",
    },
    hold: "Both remain.",
  },
  {
    id: 5522,
    runId: 6,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-5522",
    label: "Feature 5522",
    lemma: "shadow",
    status: "unresolved",
    field: "paper",
    left: {
      text: "The repressed counterpart in the same Jungian set.",
      by: "Sam",
    },
    right: null,
    hold: "No second reading yet.",
  },
  {
    id: 6601,
    runId: 7,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-6601",
    label: "Feature 6601",
    lemma: "mountains",
    status: "contested",
    field: "types",
    left: {
      text: "Landscape as sacred field — Altai, sky, the painted world.",
      by: "Alex",
    },
    right: {
      text: "A place-noun after “shows.” It would also complete horses, Buddhas, clouds.",
      by: "Sam",
    },
    hold: "Image versus geography.",
  },
  {
    id: 6610,
    runId: 8,
    modelName: "GPT-OSS 20B",
    nodeId: "feat-6610",
    label: "Feature 6610",
    lemma: "diagram of power",
    status: "contested",
    field: "types",
    left: {
      text: "The disciplinary schema, not a prison.",
      by: "Alex",
    },
    right: {
      text: "A “Foucault essay” retrieval. It would fire on discipline, biopolitics, gaze.",
      by: "Sam",
    },
    hold: "Both remain.",
  },
];

export const CATALOG_RUNS = [
  {
    id: 1,
    modelName: "Gemma 2 2B",
    role: "Writer",
    prompt: "Georgia is a country in the Caucasus region on the coast of the",
    output: "Black Sea",
    kicker: "Georgia run",
  },
  {
    id: 2,
    modelName: "GPT-OSS 20B",
    role: "Writer",
    prompt: "Sing, goddess, the wrath of",
    output: "Achilles",
    kicker: "Iliad run",
  },
  {
    id: 3,
    modelName: "GPT-OSS 20B",
    role: "Writer",
    prompt: "Phlogiston was the substance supposed to be released in",
    output: "combustion",
    kicker: "Phlogiston run",
  },
  {
    id: 4,
    modelName: "GPT-OSS 20B",
    role: "Writer",
    prompt: "The Michelson–Morley experiment failed to detect",
    output: "the ether",
    kicker: "Ether run",
  },
  {
    id: 5,
    modelName: "GPT-OSS 20B",
    role: "Writer",
    prompt: "Reason is, and ought only to be the slave of",
    output: "the passions",
    kicker: "Hume run",
  },
  {
    id: 6,
    modelName: "GPT-OSS 20B",
    role: "Writer",
    prompt: "Jung called the inherited, universal patterns of the psyche",
    output: "archetypes",
    kicker: "Jung run",
  },
  {
    id: 7,
    modelName: "GPT-OSS 20B",
    role: "Writer",
    prompt: "A Mongolian thangka of the Altai often shows",
    output: "mountains",
    kicker: "Thangka run",
  },
  {
    id: 8,
    modelName: "GPT-OSS 20B",
    role: "Writer",
    prompt: "For Foucault, Bentham’s panopticon is a",
    output: "diagram of power",
    kicker: "Panopticon run",
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
