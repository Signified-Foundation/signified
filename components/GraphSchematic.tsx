"use client";

import { useMemo, useState } from "react";
import type { GraphNode } from "@/lib/types";

type Props = {
  nodes: GraphNode[];
  selectedId: string | null;
  statusByNode?: Record<string, string | null>;
  onSelect: (nodeId: string) => void;
};

type Placed = GraphNode & { px: number; py: number; r: number; weight: number };

const WIDTH = 280;

function seedWeight(node: GraphNode) {
  if (node.kind === "feature") return node.attribution ?? 0.12;
  if (node.kind === "output") return 0.55;
  return 0.18;
}

function radius(kind: GraphNode["kind"], weight: number) {
  if (kind === "feature") return 6 + weight * 18;
  if (kind === "output") return 7;
  return 4.5;
}

function shortLabel(node: GraphNode) {
  if (node.kind === "feature") return node.label.replace(/^F\s*/, "");
  return node.label;
}

function layout(nodes: GraphNode[], weights: Record<string, number>): Placed[] {
  const tokens = nodes.filter((n) => n.kind === "token");
  const features = nodes
    .filter((n) => n.kind === "feature")
    .slice()
    .sort((a, b) => (weights[b.id] ?? 0) - (weights[a.id] ?? 0));
  const outputs = nodes.filter((n) => n.kind === "output");

  const placed: Placed[] = [];

  tokens.forEach((node, i) => {
    const weight = weights[node.id] ?? seedWeight(node);
    placed.push({
      ...node,
      weight,
      r: radius(node.kind, weight),
      px: 22,
      py: 22 + i * 26,
    });
  });

  let y = 18;
  features.forEach((node, i) => {
    const weight = weights[node.id] ?? seedWeight(node);
    const r = radius(node.kind, weight);
    const sway = i % 2 === 0 ? -10 : 12;
    placed.push({
      ...node,
      weight,
      r,
      px: 132 + sway,
      py: y + r,
    });
    y += r * 2 + 7;
  });

  const mid = Math.max(y, tokens.length * 26) / 2 + 8;
  outputs.forEach((node) => {
    const weight = weights[node.id] ?? seedWeight(node);
    placed.push({
      ...node,
      weight,
      r: radius(node.kind, weight),
      px: 248,
      py: mid,
    });
  });

  return placed;
}

export function GraphSchematic({
  nodes,
  selectedId,
  statusByNode = {},
  onSelect,
}: Props) {
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const next: Record<string, number> = {};
    for (const node of nodes) next[node.id] = seedWeight(node);
    return next;
  });

  const placed = useMemo(() => layout(nodes, weights), [nodes, weights]);
  const height = Math.max(
    168,
    ...placed.map((node) => node.py + node.r + 16),
  );
  const selected = placed.find((node) => node.id === selectedId);
  const canWeigh = selected?.kind === "feature";

  return (
    <div className="graph-wrap">
      <svg
        className="graph"
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label="Attribution weights. Select a feature to change its weight. No paths are drawn."
      >
        {placed.map((node) => {
          const selectedNode = node.id === selectedId;
          const status = statusByNode[node.id];
          return (
            <g
              key={node.id}
              className={`graph-node is-${node.kind}${selectedNode ? " is-selected" : ""} is-selectable`}
              transform={`translate(${node.px}, ${node.py})`}
              role="button"
              tabIndex={0}
              aria-pressed={selectedNode}
              aria-label={
                node.kind === "feature"
                  ? `${node.label}, weight ${node.weight.toFixed(2)}`
                  : node.label
              }
              onClick={() => onSelect(node.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(node.id);
                }
              }}
            >
              <circle r={node.r} />
              {node.kind === "feature" && status && status !== "none" && (
                <circle
                  className={`graph-dot is-${status}`}
                  cx={node.r * 0.55}
                  cy={-node.r * 0.55}
                  r={2.4}
                />
              )}
              <text className="graph-label" x={node.r + 5} y={3}>
                {shortLabel(node)}
              </text>
            </g>
          );
        })}
      </svg>

      {canWeigh && selected && (
        <label className="graph-weight">
          <span>Weight</span>
          <input
            type="range"
            min={0.04}
            max={1}
            step={0.01}
            value={selected.weight}
            aria-label={`Weight for ${selected.label}`}
            onChange={(event) => {
              const value = Number(event.target.value);
              setWeights((prev) => ({ ...prev, [selected.id]: value }));
            }}
          />
          <em>{selected.weight.toFixed(2)}</em>
        </label>
      )}
    </div>
  );
}
