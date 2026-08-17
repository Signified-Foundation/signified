"use client";

import { useMemo, useState } from "react";
import type { GraphNode } from "@/lib/types";

type Props = {
  nodes: GraphNode[];
  selectedId: string | null;
  statusByNode?: Record<string, string | null>;
  savedRead?: Record<string, number>;
  pendingSave?: boolean;
  onSelect: (nodeId: string) => void;
  onSaveRead?: (nodeId: string, weight: number) => void;
};

type Placed = GraphNode & {
  px: number;
  py: number;
  r: number;
  observed: number;
  weight: number;
};

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
    const observed = seedWeight(node);
    const weight = weights[node.id] ?? observed;
    placed.push({
      ...node,
      observed,
      weight,
      r: radius(node.kind, weight),
      px: 22,
      py: 22 + i * 26,
    });
  });

  let y = 18;
  features.forEach((node, i) => {
    const observed = seedWeight(node);
    const weight = weights[node.id] ?? observed;
    const r = radius(node.kind, weight);
    const sway = i % 2 === 0 ? -10 : 12;
    placed.push({
      ...node,
      observed,
      weight,
      r,
      px: 132 + sway,
      py: y + r,
    });
    y += r * 2 + 16;
  });

  const mid = Math.max(y, tokens.length * 26) / 2 + 8;
  outputs.forEach((node) => {
    const observed = seedWeight(node);
    const weight = weights[node.id] ?? observed;
    placed.push({
      ...node,
      observed,
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
  savedRead = {},
  pendingSave = false,
  onSelect,
  onSaveRead,
}: Props) {
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const next: Record<string, number> = {};
    for (const node of nodes) {
      next[node.id] = savedRead[node.id] ?? seedWeight(node);
    }
    return next;
  });

  const placed = useMemo(() => layout(nodes, weights), [nodes, weights]);
  const height = Math.max(
    168,
    ...placed.map((node) => node.py + node.r + 22),
  );
  const selected = placed.find((node) => node.id === selectedId);
  const canWeigh = selected?.kind === "feature";
  const saved = selected ? savedRead[selected.id] : undefined;

  return (
    <div className="graph-wrap">
      <svg
        className="graph"
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label="Fixture graph. Observed attribution stays on each feature. A local reading may sit beside it."
      >
        {placed.map((node) => {
          const selectedNode = node.id === selectedId;
          const status = statusByNode[node.id];
          const read = savedRead[node.id];
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
                  ? `${node.label}, observed ${node.observed.toFixed(2)}${
                      read != null ? `, read ${read.toFixed(2)}` : ""
                    }`
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
              {node.kind === "feature" && (
                <text className="graph-meta" x={node.r + 5} y={15}>
                  {node.observed.toFixed(2)} obs
                  {read != null ? ` · ${read.toFixed(2)} read` : ""}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {canWeigh && selected && (
        <div className="graph-weight">
          <label>
            <span>
              Local reading — “I think this unit matters this much on this
              run.”
            </span>
            <span className="graph-weight-row">
              <input
                type="range"
                min={0.04}
                max={1}
                step={0.01}
                value={selected.weight}
                aria-label={`Local reading for ${selected.label}`}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setWeights((prev) => ({ ...prev, [selected.id]: value }));
                }}
              />
              <em>{selected.weight.toFixed(2)}</em>
            </span>
          </label>
          <p className="graph-weight-note">
            Not a measurement. Not evidence. Observed stays {selected.observed.toFixed(2)}.
            {saved != null ? ` Saved read ${saved.toFixed(2)}.` : ""}
          </p>
          {onSaveRead && (
            <button
              type="button"
              className="text-link"
              disabled={pendingSave}
              onClick={() => onSaveRead(selected.id, selected.weight)}
            >
              Save this reading
            </button>
          )}
        </div>
      )}
    </div>
  );
}
