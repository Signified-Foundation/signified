import graph from "@/data/canberra_graph.json";
import type { Claim, Comment, Feature, GraphNode, Session } from "@/lib/types";

const FEATURES: Feature[] = graph.nodes
  .filter((node) => node.kind === "feature")
  .map((node, index) => ({
    id: index + 1,
    run_id: 1,
    node_id: node.id,
    feature_id: node.feature_id as number,
    layer: node.layer as number,
    label: node.label,
    attribution: node.attribution as number,
    activation: node.activation as number,
  }));

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
];

export const SEED: Session = {
  run: {
    id: 1,
    prompt: graph.prompt,
    output: graph.output,
    model_name: graph.model,
    created_at: "2026-08-13T10:00:00.000Z",
  },
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
  graph: {
    nodes: graph.nodes as GraphNode[],
    edges: graph.edges,
    prompt_tokens: graph.prompt_tokens,
    output_tokens: graph.output_tokens,
    note: graph.note,
  },
  notice: "Attribution is correlational until an intervention has been run.",
  constraint:
    "A model-generated explanation is not evidence. A human interpretation is not a fact.",
};
