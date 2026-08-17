export type User = {
  id: number;
  name: string;
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

export type Claim = {
  id: number;
  feature_pk: number;
  run_id: number;
  author_id: number;
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

export type Session = {
  run: {
    id: number;
    prompt: string;
    output: string;
    model_name: string;
    created_at: string;
  };
  observation: { id: number; graph_path: string };
  users: User[];
  features: Feature[];
  claims: Claim[];
  comments: Comment[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    prompt_tokens: string[];
    output_tokens: string[];
    note: string;
  };
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
