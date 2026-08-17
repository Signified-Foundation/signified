import canberra from "@/data/canberra_graph.json";
import iliad from "@/data/iliad_graph.json";
import { MODELS, RUNS, SCORES } from "@/lib/models";
import type { Claim, Comment, Feature, GraphPayload, Session } from "@/lib/types";

type GraphFile = {
  note: string;
  prompt_tokens: string[];
  output_tokens: string[];
  nodes: GraphPayload["nodes"];
  edges: GraphPayload["edges"];
};

function featuresFrom(graph: GraphFile, runId: number, startId: number): Feature[] {
  return graph.nodes
    .filter((node) => node.kind === "feature")
    .map((node, index) => ({
      id: startId + index,
      run_id: runId,
      node_id: node.id,
      feature_id: node.feature_id as number,
      layer: node.layer as number,
      label: node.label,
      attribution: node.attribution as number,
      activation: node.activation as number,
    }));
}

function asGraph(graph: GraphFile): GraphPayload {
  return {
    nodes: graph.nodes,
    edges: graph.edges,
    prompt_tokens: graph.prompt_tokens,
    output_tokens: graph.output_tokens,
    note: graph.note,
  };
}

const FEATURES: Feature[] = [
  ...featuresFrom(canberra as GraphFile, 1, 1),
  ...featuresFrom(iliad as GraphFile, 2, 7),
];

function featurePk(featureId: number) {
  const row = FEATURES.find((item) => item.feature_id === featureId);
  if (!row) throw new Error(`Missing feature ${featureId} in graph`);
  return row.id;
}

function evidence(
  id: number,
  claimId: number,
  authorId: number,
  stance: "supports" | "challenges",
  name: string,
  a: [string, number],
  b: [string, number],
  n: number,
  notes: string,
  challengeId: number | null = null,
): Claim["evidence"][number] {
  return {
    id,
    claim_id: claimId,
    challenge_id: challengeId,
    author_id: authorId,
    stance,
    experiment_name: name,
    result: {
      metric: "activation rate",
      condition_a: { name: a[0], value: a[1] },
      condition_b: { name: b[0], value: b[1] },
      n,
    },
    notes,
    intervention: false,
    created_at: "2026-08-13T10:00:00.000Z",
  };
}

const CLAIMS: Claim[] = [
  {
    id: 1,
    feature_pk: featurePk(18472),
    run_id: 1,
    author_id: 1,
    kind: "meaning",
    weight: null,
    text: "Represents Australian geographic entities.",
    status: "contested",
    created_at: "2026-08-13T10:00:00.000Z",
    challenges: [
      {
        id: 1,
        claim_id: 1,
        author_id: 2,
        alternative_text: "Capital-city retrieval, not Australian geography.",
        created_at: "2026-08-13T10:12:00.000Z",
      },
    ],
    evidence: [
      evidence(
        1,
        1,
        1,
        "supports",
        "Australian places vs unrelated nouns",
        ["Australian places", 0.84],
        ["unrelated nouns", 0.11],
        50,
        "Sydney, Melbourne, Canberra vs chair, theory, Thursday.",
      ),
      evidence(
        2,
        1,
        1,
        "supports",
        "Replication: held-out toponyms",
        ["held-out Australian places", 0.81],
        ["matched nouns", 0.14],
        40,
        "Same contrast, new word list.",
      ),
      evidence(
        3,
        1,
        2,
        "challenges",
        "Capital-of constructions abroad",
        ["capital of France/Japan/Norway", 0.79],
        ["Australian geography, no capital frame", 0.22],
        36,
        "Strong on Paris, Tokyo, Oslo. Weak on rivers and deserts.",
        1,
      ),
    ],
    support_n: 2,
    contest_n: 1,
  },
  {
    id: 2,
    feature_pk: featurePk(2201),
    run_id: 1,
    author_id: 2,
    kind: "meaning",
    weight: null,
    text: "Detects the ‘capital of [country]’ syntactic frame.",
    status: "unresolved",
    created_at: "2026-08-13T10:20:00.000Z",
    challenges: [],
    evidence: [
      evidence(
        4,
        2,
        2,
        "supports",
        "Hypothetical: ‘capital of X’ vs ‘largest city in X’",
        ["capital of [country] is", 0.91],
        ["largest city in [country] is", 0.17],
        28,
        "Proposed contrast. Not an intervention.",
      ),
    ],
    support_n: 1,
    contest_n: 0,
  },
  {
    id: 3,
    feature_pk: featurePk(3308),
    run_id: 1,
    author_id: 2,
    kind: "meaning",
    weight: null,
    text: "A Canberra-specific lexical feature.",
    status: "contested",
    created_at: "2026-08-13T10:30:00.000Z",
    challenges: [
      {
        id: 2,
        claim_id: 3,
        author_id: 1,
        alternative_text: "Would fire on any Australian capital name.",
        created_at: "2026-08-13T10:36:00.000Z",
      },
    ],
    evidence: [
      evidence(
        5,
        3,
        2,
        "supports",
        "Canberra vs other city names",
        ["Canberra", 0.88],
        ["Paris, Tokyo, Oslo", 0.09],
        24,
        "Quiet on foreign capitals. Loud on Canberra.",
      ),
      evidence(
        6,
        3,
        1,
        "challenges",
        "Sydney in a capital frame",
        ["Sydney as Australian capital", 0.71],
        ["Sydney as a harbour city", 0.19],
        20,
        "If the frame is ‘Australian capital’, Sydney lights it up.",
      ),
    ],
    support_n: 1,
    contest_n: 1,
  },
  {
    id: 4,
    feature_pk: featurePk(4410),
    run_id: 1,
    author_id: 1,
    kind: "meaning",
    weight: null,
    text: "Fires on named geopolitical entities.",
    status: "supported",
    created_at: "2026-08-13T10:40:00.000Z",
    challenges: [],
    evidence: [
      evidence(
        7,
        4,
        1,
        "supports",
        "Country and city names vs common nouns",
        ["named geopolitical entities", 0.86],
        ["matched common nouns", 0.08],
        60,
        "Australia, France, Canberra, Paris. Quiet on chair, theory, Thursday.",
      ),
    ],
    support_n: 1,
    contest_n: 0,
  },
  {
    id: 5,
    feature_pk: featurePk(6701),
    run_id: 1,
    author_id: 1,
    kind: "meaning",
    weight: null,
    text: "Tracks the genitive ‘of [country]’, independent of ‘capital’.",
    status: "unresolved",
    created_at: "2026-08-13T10:50:00.000Z",
    challenges: [],
    evidence: [
      evidence(
        8,
        5,
        1,
        "supports",
        "Hypothetical: ‘of France’ vs ‘in France’",
        ["of [country]", 0.64],
        ["in [country]", 0.21],
        30,
        "Proposed contrast. Not an intervention.",
      ),
    ],
    support_n: 1,
    contest_n: 0,
  },
  {
    id: 6,
    feature_pk: featurePk(2104),
    run_id: 2,
    author_id: 1,
    kind: "meaning",
    weight: null,
    text: "A detector of heroic anger, the poem’s first word.",
    status: "contested",
    created_at: "2026-08-17T12:10:00.000Z",
    challenges: [
      {
        id: 3,
        claim_id: 6,
        author_id: 2,
        alternative_text: "A completion cue for “Achilles,” not wrath as such.",
        created_at: "2026-08-17T12:18:00.000Z",
      },
    ],
    evidence: [],
    support_n: 0,
    contest_n: 0,
  },
  {
    id: 7,
    feature_pk: featurePk(5560),
    run_id: 2,
    author_id: 1,
    kind: "meaning",
    weight: null,
    text: "The prince who awards the apple; desire, not a place.",
    status: "contested",
    created_at: "2026-08-17T12:22:00.000Z",
    challenges: [
      {
        id: 4,
        claim_id: 7,
        author_id: 2,
        alternative_text:
          "A name-token. It would fire on Paris, France in a capital frame.",
        created_at: "2026-08-17T12:28:00.000Z",
      },
    ],
    evidence: [],
    support_n: 0,
    contest_n: 0,
  },
  {
    id: 8,
    feature_pk: featurePk(7781),
    run_id: 2,
    author_id: 1,
    kind: "meaning",
    weight: null,
    text: "The contested cause of the war.",
    status: "contested",
    created_at: "2026-08-17T12:32:00.000Z",
    challenges: [
      {
        id: 5,
        claim_id: 8,
        author_id: 2,
        alternative_text: "A retrieval slot for “of Troy.”",
        created_at: "2026-08-17T12:38:00.000Z",
      },
    ],
    evidence: [],
    support_n: 0,
    contest_n: 0,
  },
];

const COMMENTS: Comment[] = [
  {
    id: 1,
    feature_pk: featurePk(18472),
    author_id: 1,
    text: "The geography reading is too broad. It also fires on capital-of prompts that never mention Australia.",
    created_at: "2026-08-13T11:00:00.000Z",
  },
  {
    id: 2,
    feature_pk: featurePk(18472),
    author_id: 2,
    text: "Then the claim in the article should say that, or we retire it. Right now the lead overstates what we know.",
    created_at: "2026-08-13T11:08:00.000Z",
  },
  {
    id: 3,
    feature_pk: featurePk(18472),
    author_id: 1,
    text: "Agreed it is contested. I still want a held-out Australian river list before we drop the geography reading entirely.",
    created_at: "2026-08-13T11:15:00.000Z",
  },
  {
    id: 4,
    feature_pk: featurePk(3308),
    author_id: 1,
    text: "If Sydney lights it up under a capital frame, this is not a Canberra atom.",
    created_at: "2026-08-13T11:22:00.000Z",
  },
  {
    id: 5,
    feature_pk: featurePk(2104),
    author_id: 1,
    text: "μῆνις is the first word of the poem. If this unit is doing anything, it is doing that. A completion habit would not need the wrath.",
    created_at: "2026-08-17T12:45:00.000Z",
  },
  {
    id: 6,
    feature_pk: featurePk(2104),
    author_id: 2,
    text: "GPT-OSS 20B named Achilles in reasoning and wrote nothing. That is a completion habit under a chat API, not a view of the poem. The Prompt Guard scores are near zero. Those numbers are observations of a scorer. They are not evidence about wrath.",
    created_at: "2026-08-17T12:52:00.000Z",
  },
  {
    id: 7,
    feature_pk: featurePk(5560),
    author_id: 2,
    text: "Paris is not in the prompt. The interesting fight is still person versus city: the same token would complete a capital of France. We put that fight here on purpose.",
    created_at: "2026-08-17T13:01:00.000Z",
  },
  {
    id: 8,
    feature_pk: featurePk(7781),
    author_id: 1,
    text: "Helen as cause is a reading of the poem. Helen as “of Troy” is a retrieval slot. Desire, blame, fame — not a second geography lemma.",
    created_at: "2026-08-17T13:08:00.000Z",
  },
];

export const SEED: Session = {
  models: MODELS,
  runs: RUNS,
  graphs: {
    1: asGraph(canberra as GraphFile),
    2: asGraph(iliad as GraphFile),
  },
  scores: SCORES,
  observation: {
    id: 1,
    graph_path: "data/canberra_graph.json",
  },
  users: [
    { id: 1, name: "Alex" },
    { id: 2, name: "Sam" },
  ],
  features: FEATURES,
  claims: CLAIMS,
  comments: COMMENTS,
  notice: "Attribution is correlational until an intervention has been run.",
  constraint:
    "A model-generated explanation is not evidence. A human interpretation is not a fact.",
};
