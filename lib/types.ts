export type User = {
  id: number;
  name: string;
};

export type ModelRole = "writer" | "scorer";

export type Model = {
  id: number;
  name: string;
  slug: string;
  role: ModelRole;
};

export type Run = {
  id: number;
  model_id: number;
  prompt: string;
  output: string;
  created_at: string;
};

export type Feature = {
  id: number;
  run_id: number;
  node_id: string;
  feature_id: number;
  layer: number;
  label: string;
  attribution: number;
  activation: number;
};

export type EvidenceResult = {
  metric: string;
  condition_a: { name: string; value: number };
  condition_b: { name: string; value: number };
  n: number;
};

export type Evidence = {
  id: number;
  claim_id: number;
  challenge_id: number | null;
  author_id: number;
  stance: "supports" | "challenges";
  experiment_name: string;
  result: EvidenceResult;
  notes: string;
  intervention: boolean;
  created_at: string;
};

export type Challenge = {
  id: number;
  claim_id: number;
  author_id: number;
  alternative_text: string;
  created_at: string;
};

export type ClaimKind = "meaning" | "weight";

export type Claim = {
  id: number;
  feature_pk: number;
  run_id: number;
  author_id: number;
  kind: ClaimKind;
  weight: number | null;
  text: string;
  status: "unresolved" | "contested" | "supported";
  created_at: string;
  challenges: Challenge[];
  evidence: Evidence[];
  support_n: number;
  contest_n: number;
};

export type Comment = {
  id: number;
  feature_pk: number;
  author_id: number;
  text: string;
  created_at: string;
};

export type GraphNode = {
  id: string;
  kind: "token" | "feature" | "output";
  label: string;
  x: number;
  y: number;
  feature_id?: number;
  layer?: number;
  attribution?: number;
  activation?: number;
};

export type GraphEdge = {
  source: string;
  target: string;
  weight: number;
};

export type GraphPayload = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  prompt_tokens: string[];
  output_tokens: string[];
  note: string;
};

export type Score = {
  id: number;
  run_id: number;
  model_id: number;
  metric: string;
  value: number | null;
  notes: string;
};

export type Session = {
  models: Model[];
  runs: Run[];
  graphs: Record<number, GraphPayload>;
  scores: Score[];
  observation: { id: number; graph_path: string };
  users: User[];
  features: Feature[];
  claims: Claim[];
  comments: Comment[];
  notice: string;
  constraint: string;
};

export type EvidencePayload = {
  author_id: number;
  stance: "supports" | "challenges";
  experiment_name: string;
  notes: string;
  condition_a_name: string;
  condition_a_value: number;
  condition_b_name: string;
  condition_b_value: number;
  n: number;
  intervention: boolean;
};

export type ClaimPayload = {
  feature_pk: number;
  author_id: number;
  text: string;
  kind?: ClaimKind;
  weight?: number | null;
};
