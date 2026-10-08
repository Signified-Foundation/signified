import iliad from "@/data/iliad_graph.json";
import {
  ETHER,
  GEORGIA,
  HUME,
  JUNG,
  PANOPTICON,
  PHLOGISTON,
  THANGKA,
  type FixtureGraph,
} from "@/lib/fixtures";
import { MODELS, RUNS, SCORES } from "@/lib/models";
import { QUESTIONS } from "@/lib/questions";
import type { Claim, Comment, Feature, GraphPayload, Review, Session } from "@/lib/types";

type GraphFile = FixtureGraph | GraphPayload;

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
  ...featuresFrom(GEORGIA, 1, 1),
  ...featuresFrom(iliad as GraphFile, 2, 3),
  ...featuresFrom(PHLOGISTON, 3, 6),
  ...featuresFrom(ETHER, 4, 8),
  ...featuresFrom(HUME, 5, 9),
  ...featuresFrom(JUNG, 6, 10),
  ...featuresFrom(THANGKA, 7, 12),
  ...featuresFrom(PANOPTICON, 8, 13),
];

const REVIEWS: Review[] = [
  {
    id: 1,
    run_id: 11,
    author_id: 2,
    stance: "contests",
    text: "The question names a coast. Gemma’s answer sits on that coast.",
    created_at: "2026-08-27T09:10:00.000Z",
  },
];

function featurePk(featureId: number) {
  const row = FEATURES.find((item) => item.feature_id === featureId);
  if (!row) throw new Error(`Missing feature ${featureId} in graph`);
  return row.id;
}

function contested(
  id: number,
  featureId: number,
  runId: number,
  text: string,
  alternative: string,
  created: string,
  challengeId: number,
  challengedAt: string,
): Claim {
  return {
    id,
    feature_pk: featurePk(featureId),
    run_id: runId,
    author_id: 1,
    kind: "meaning",
    weight: null,
    text,
    status: "contested",
    created_at: created,
    challenges: [
      {
        id: challengeId,
        claim_id: id,
        author_id: 2,
        alternative_text: alternative,
        created_at: challengedAt,
      },
    ],
    evidence: [],
    support_n: 0,
    contest_n: 0,
  };
}

function unresolved(
  id: number,
  featureId: number,
  runId: number,
  authorId: number,
  text: string,
  created: string,
): Claim {
  return {
    id,
    feature_pk: featurePk(featureId),
    run_id: runId,
    author_id: authorId,
    kind: "meaning",
    weight: null,
    text,
    status: "unresolved",
    created_at: created,
    challenges: [],
    evidence: [],
    support_n: 0,
    contest_n: 0,
  };
}

const CLAIMS: Claim[] = [
  contested(
    1,
    3102,
    1,
    "The historical country: wine, church, the range.",
    "A name-token. It would also complete Atlanta in an American frame.",
    "2026-08-17T16:01:00.000Z",
    1,
    "2026-08-17T16:08:00.000Z",
  ),
  contested(
    2,
    3108,
    1,
    "The mountain world the sentence is about.",
    "A place-noun after “region.” It would fire on Balkans, Andes, Alps.",
    "2026-08-17T16:09:00.000Z",
    2,
    "2026-08-17T16:12:00.000Z",
  ),
  contested(
    3,
    2104,
    2,
    "A detector of heroic anger, the poem’s first word.",
    "A completion cue for Achilles.",
    "2026-08-17T12:10:00.000Z",
    3,
    "2026-08-17T12:18:00.000Z",
  ),
  contested(
    4,
    5560,
    2,
    "The prince who awards the apple; desire.",
    "A name-token. It would fire on Paris, France in a capital frame.",
    "2026-08-17T12:22:00.000Z",
    4,
    "2026-08-17T12:28:00.000Z",
  ),
  contested(
    5,
    7781,
    2,
    "The contested cause of the war.",
    "A retrieval slot for “of Troy.”",
    "2026-08-17T12:32:00.000Z",
    5,
    "2026-08-17T12:38:00.000Z",
  ),
  contested(
    6,
    4402,
    3,
    "A discarded ontology: the thing they thought fire was.",
    "A “wrong theory” slot. It would also complete ether, caloric, humours.",
    "2026-08-17T16:20:00.000Z",
    6,
    "2026-08-17T16:24:00.000Z",
  ),
  contested(
    8,
    4408,
    4,
    "The negative result that made relativity thinkable.",
    "The next word after “failed to detect” in a physics lead.",
    "2026-08-17T16:28:00.000Z",
    7,
    "2026-08-17T16:31:00.000Z",
  ),
  contested(
    9,
    5510,
    5,
    "Hume’s claim: reason as instrument, passion as master.",
    "A quotation latch. It would fire on any “slave of Y” line.",
    "2026-08-17T16:33:00.000Z",
    8,
    "2026-08-17T16:36:00.000Z",
  ),
  contested(
    10,
    5520,
    6,
    "A detector of the collective-unconscious idea.",
    "A glossary slot for “Jungian.” It would complete shadow, anima, persona.",
    "2026-08-17T16:38:00.000Z",
    9,
    "2026-08-17T16:41:00.000Z",
  ),
  unresolved(
    11,
    5522,
    6,
    2,
    "The repressed counterpart in the same Jungian set.",
    "2026-08-17T16:43:00.000Z",
  ),
  contested(
    12,
    6601,
    7,
    "Landscape as sacred field — Altai, sky, the painted world.",
    "A place-noun after “shows.” It would also complete horses, Buddhas, clouds.",
    "2026-08-17T16:45:00.000Z",
    10,
    "2026-08-17T16:48:00.000Z",
  ),
  contested(
    13,
    6610,
    8,
    "The disciplinary schema.",
    "A “Foucault essay” retrieval. It would fire on discipline, biopolitics, gaze.",
    "2026-08-17T16:50:00.000Z",
    11,
    "2026-08-17T16:53:00.000Z",
  ),
];

function talk(
  id: number,
  featureId: number,
  authorId: number,
  text: string,
  created: string,
  parentId: number | null = null,
): Comment {
  return {
    id,
    feature_pk: featurePk(featureId),
    author_id: authorId,
    parent_id: parentId,
    text,
    created_at: created,
  };
}

const COMMENTS: Comment[] = [
  talk(
    1,
    3102,
    2,
    "The public Wikipedia lead is almost this sentence: country in the Caucasus, coast of the Black Sea. That belongs here as public context. The American state is another frame still to try.",
    "2026-08-17T17:00:00.000Z",
  ),
  talk(
    2,
    3102,
    1,
    "Same word, different world — like Paris. If the unit goes quiet on “Georgia is a state in the,” the country reading holds. Until that contrast is run, both remain.",
    "2026-08-17T17:06:00.000Z",
    1,
  ),
  talk(
    14,
    3102,
    3,
    "Added context: the continuation names a Caucasus coast; the question asks which sea. Both belong to Georgia. Readers can hold both trials while they read Feature 3102.",
    "2026-08-27T18:00:00.000Z",
  ),
  talk(
    3,
    2104,
    1,
    "Wrath is the first word of the poem in this English line. If this unit is doing anything, it is doing that.",
    "2026-08-17T12:45:00.000Z",
  ),
  talk(
    4,
    2104,
    2,
    "GPT-OSS 20B named Achilles in reasoning. The Prompt Guard scores sit near zero. Those numbers are observations of a scorer, useful as context for this completion.",
    "2026-08-17T12:52:00.000Z",
    3,
  ),
  talk(
    5,
    5560,
    2,
    "The prompt leaves Paris unnamed. Person and city are both live readings: the same token would complete a capital of France.",
    "2026-08-17T13:01:00.000Z",
  ),
  talk(
    6,
    7781,
    1,
    "Helen as cause is a reading of the poem. Helen as “of Troy” is a retrieval slot. Desire, blame, fame.",
    "2026-08-17T13:08:00.000Z",
  ),
  talk(
    7,
    4402,
    1,
    "Wikipedia files phlogiston under a superseded theory of combustion. That public gloss sits here as context while the two readings stay on the page.",
    "2026-08-17T17:10:00.000Z",
  ),
  talk(
    8,
    4402,
    2,
    "Everyone can enter this one: the thing they thought was there. That is Signified in miniature. It is still a reading.",
    "2026-08-17T17:14:00.000Z",
    7,
  ),
  talk(
    9,
    4408,
    2,
    "The public article on Michelson–Morley will complete “ether” for you. Filing that lead here is talk, a public gloss next to the readings.",
    "2026-08-17T17:18:00.000Z",
  ),
  talk(
    10,
    5510,
    1,
    "The line is Hume’s, and Wikipedia prints it. A public utterance is a good prompt. The Treatise is a separate object from this feature.",
    "2026-08-17T17:22:00.000Z",
  ),
  talk(
    11,
    5520,
    2,
    "The public page on Jungian archetypes will give you shadow, anima, persona in the same paragraph. That is Sam’s glossary reading, filed as talk.",
    "2026-08-17T17:26:00.000Z",
  ),
  talk(
    12,
    6601,
    1,
    "A thangka is a painted world. The Altai is a range. Wikipedia will tell you both. The fight on this unit is whether mountains here are sacred field or the noun that follows “shows.”",
    "2026-08-17T17:30:00.000Z",
  ),
  talk(
    13,
    6610,
    2,
    "The public Foucault page will say “diagram” and “power” in the same breath as “prison.” That meeting belongs in talk, next to the two readings.",
    "2026-08-17T17:34:00.000Z",
  ),
];

export const SEED: Session = {
  models: MODELS,
  runs: RUNS,
  graphs: {
    1: asGraph(GEORGIA),
    2: asGraph(iliad as GraphFile),
    3: asGraph(PHLOGISTON),
    4: asGraph(ETHER),
    5: asGraph(HUME),
    6: asGraph(JUNG),
    7: asGraph(THANGKA),
    8: asGraph(PANOPTICON),
  },
  scores: SCORES,
  observation: {
    id: 1,
    graph_path: "data/iliad_graph.json",
  },
  users: [
    {
      id: 1,
      name: "Alex",
      kind: "person",
      hue: 28,
      hue2: 8,
      image: null,
      note: "",
    },
    {
      id: 2,
      name: "Sam",
      kind: "person",
      hue: 208,
      hue2: 164,
      image: null,
      note: "",
    },
    {
      id: 3,
      name: "Community Notes",
      kind: "agent",
      hue: 152,
      hue2: 208,
      image: null,
      note: "Adds shared context to a unit.",
    },
  ],
  features: FEATURES,
  claims: CLAIMS,
  comments: COMMENTS,
  choices: [],
  questions: QUESTIONS,
  reviews: REVIEWS,
  notice: "Attribution is correlational until an intervention has been run.",
  constraint:
    "Evidence is a stored result. A reading is a human proposal.",
};
