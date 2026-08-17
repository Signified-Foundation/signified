import type { GraphEdge, GraphNode, GraphPayload } from "@/lib/types";

export type FixtureGraph = GraphPayload & {
  prompt: string;
  output: string;
  model: string;
};

function node(
  partial: GraphNode,
): GraphNode {
  return partial;
}

export function makeFixture(args: {
  prompt: string;
  output: string;
  model: string;
  tokens: { id: string; label: string }[];
  features: {
    feature_id: number;
    layer: number;
    attribution: number;
    activation: number;
  }[];
  outputId: string;
  edges: GraphEdge[];
}): FixtureGraph {
  const tokens: GraphNode[] = args.tokens.map((item, i) =>
    node({
      id: item.id,
      kind: "token",
      label: item.label,
      x: 28,
      y: 48 + i * 110,
    }),
  );
  const features: GraphNode[] = args.features.map((item, i) =>
    node({
      id: `feat-${item.feature_id}`,
      kind: "feature",
      feature_id: item.feature_id,
      layer: item.layer,
      label: `F ${item.feature_id}`,
      attribution: item.attribution,
      activation: item.activation,
      x: 248,
      y: 36 + i * 104,
    }),
  );
  const output: GraphNode = node({
    id: args.outputId,
    kind: "output",
    label: args.output,
    x: 548,
    y: 160,
  });
  return {
    prompt: args.prompt,
    output: args.output,
    model: args.model,
    note: "Fixture · not circuit-tracer. Select a feature to open its article.",
    prompt_tokens: tokenize(args.prompt),
    output_tokens: [` ${args.output}`],
    nodes: [...tokens, ...features, output],
    edges: args.edges,
  };
}

function tokenize(prompt: string): string[] {
  return prompt.split(" ").map((word, i) => (i === 0 ? word : ` ${word}`));
}

export const GEORGIA = makeFixture({
  prompt: "Georgia is a country in the Caucasus region on the coast of the",
  output: "Black Sea",
  model: "Gemma 2 2B",
  tokens: [
    { id: "tok-georgia", label: "Georgia" },
    { id: "tok-caucasus", label: "Caucasus" },
    { id: "tok-coast", label: "coast" },
  ],
  features: [
    { feature_id: 3102, layer: 14, attribution: 0.39, activation: 3.71 },
    { feature_id: 3108, layer: 12, attribution: 0.22, activation: 2.08 },
  ],
  outputId: "tok-black-sea",
  edges: [
    { source: "tok-georgia", target: "feat-3102", weight: 0.52 },
    { source: "tok-caucasus", target: "feat-3102", weight: 0.24 },
    { source: "tok-caucasus", target: "feat-3108", weight: 0.41 },
    { source: "tok-coast", target: "feat-3108", weight: 0.18 },
    { source: "feat-3102", target: "tok-black-sea", weight: 0.48 },
    { source: "feat-3108", target: "tok-black-sea", weight: 0.33 },
  ],
});

export const PHLOGISTON = makeFixture({
  prompt: "Phlogiston was the substance supposed to be released in",
  output: "combustion",
  model: "GPT-OSS 20B",
  tokens: [
    { id: "tok-phlogiston", label: "Phlogiston" },
    { id: "tok-substance", label: "substance" },
    { id: "tok-released", label: "released" },
  ],
  features: [
    { feature_id: 4402, layer: 15, attribution: 0.44, activation: 4.01 },
    { feature_id: 4404, layer: 11, attribution: 0.17, activation: 1.62 },
  ],
  outputId: "tok-combustion",
  edges: [
    { source: "tok-phlogiston", target: "feat-4402", weight: 0.58 },
    { source: "tok-substance", target: "feat-4402", weight: 0.21 },
    { source: "tok-released", target: "feat-4404", weight: 0.36 },
    { source: "tok-phlogiston", target: "feat-4404", weight: 0.19 },
    { source: "feat-4402", target: "tok-combustion", weight: 0.55 },
    { source: "feat-4404", target: "tok-combustion", weight: 0.26 },
  ],
});

export const ETHER = makeFixture({
  prompt: "The Michelson–Morley experiment failed to detect",
  output: "the ether",
  model: "GPT-OSS 20B",
  tokens: [
    { id: "tok-michelson", label: "Michelson" },
    { id: "tok-failed", label: "failed" },
    { id: "tok-detect", label: "detect" },
  ],
  features: [
    { feature_id: 4408, layer: 16, attribution: 0.42, activation: 3.55 },
  ],
  outputId: "tok-ether",
  edges: [
    { source: "tok-failed", target: "feat-4408", weight: 0.47 },
    { source: "tok-detect", target: "feat-4408", weight: 0.38 },
    { source: "tok-michelson", target: "feat-4408", weight: 0.22 },
    { source: "feat-4408", target: "tok-ether", weight: 0.61 },
  ],
});

export const HUME = makeFixture({
  prompt: "Reason is, and ought only to be the slave of",
  output: "the passions",
  model: "GPT-OSS 20B",
  tokens: [
    { id: "tok-reason", label: "Reason" },
    { id: "tok-slave", label: "slave" },
    { id: "tok-of-hume", label: "of" },
  ],
  features: [
    { feature_id: 5510, layer: 14, attribution: 0.4, activation: 3.44 },
  ],
  outputId: "tok-passions",
  edges: [
    { source: "tok-reason", target: "feat-5510", weight: 0.29 },
    { source: "tok-slave", target: "feat-5510", weight: 0.44 },
    { source: "tok-of-hume", target: "feat-5510", weight: 0.2 },
    { source: "feat-5510", target: "tok-passions", weight: 0.57 },
  ],
});

export const JUNG = makeFixture({
  prompt: "Jung called the inherited, universal patterns of the psyche",
  output: "archetypes",
  model: "GPT-OSS 20B",
  tokens: [
    { id: "tok-jung", label: "Jung" },
    { id: "tok-inherited", label: "inherited" },
    { id: "tok-psyche", label: "psyche" },
  ],
  features: [
    { feature_id: 5520, layer: 13, attribution: 0.43, activation: 3.9 },
    { feature_id: 5522, layer: 10, attribution: 0.16, activation: 1.41 },
  ],
  outputId: "tok-archetypes",
  edges: [
    { source: "tok-jung", target: "feat-5520", weight: 0.49 },
    { source: "tok-inherited", target: "feat-5520", weight: 0.31 },
    { source: "tok-psyche", target: "feat-5522", weight: 0.37 },
    { source: "tok-jung", target: "feat-5522", weight: 0.18 },
    { source: "feat-5520", target: "tok-archetypes", weight: 0.54 },
    { source: "feat-5522", target: "tok-archetypes", weight: 0.23 },
  ],
});

export const THANGKA = makeFixture({
  prompt: "A Mongolian thangka of the Altai often shows",
  output: "mountains",
  model: "GPT-OSS 20B",
  tokens: [
    { id: "tok-thangka", label: "thangka" },
    { id: "tok-altai", label: "Altai" },
    { id: "tok-shows", label: "shows" },
  ],
  features: [
    { feature_id: 6601, layer: 12, attribution: 0.37, activation: 3.12 },
  ],
  outputId: "tok-mountains",
  edges: [
    { source: "tok-thangka", target: "feat-6601", weight: 0.28 },
    { source: "tok-altai", target: "feat-6601", weight: 0.41 },
    { source: "tok-shows", target: "feat-6601", weight: 0.33 },
    { source: "feat-6601", target: "tok-mountains", weight: 0.5 },
  ],
});

export const PANOPTICON = makeFixture({
  prompt: "For Foucault, Bentham’s panopticon is a",
  output: "diagram of power",
  model: "GPT-OSS 20B",
  tokens: [
    { id: "tok-foucault", label: "Foucault" },
    { id: "tok-panopticon", label: "panopticon" },
    { id: "tok-is-f", label: "is" },
  ],
  features: [
    { feature_id: 6610, layer: 15, attribution: 0.41, activation: 3.6 },
  ],
  outputId: "tok-diagram",
  edges: [
    { source: "tok-foucault", target: "feat-6610", weight: 0.36 },
    { source: "tok-panopticon", target: "feat-6610", weight: 0.48 },
    { source: "tok-is-f", target: "feat-6610", weight: 0.15 },
    { source: "feat-6610", target: "tok-diagram", weight: 0.56 },
  ],
});
