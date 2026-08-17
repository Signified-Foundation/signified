"use client";

import { useMemo, useState } from "react";
import { READING_WORDS, wordFor } from "@/lib/reading";
import type { GraphEdge, GraphNode } from "@/lib/types";

type Props = {
  nodes: GraphNode[];
  edges?: GraphEdge[];
  selectedId: string | null;
  statusByNode?: Record<string, string | null>;
  savedRead?: Record<string, number>;
  pendingSave?: boolean;
  asName?: string;
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

const WIDTH = 300;
const PAD = 22;

function seedWeight(node: GraphNode) {
  if (node.kind === "feature") return node.attribution ?? 0.12;
  if (node.kind === "output") return 0.55;
  return 0.18;
}

function radius(kind: GraphNode["kind"], observed: number) {
  if (kind === "feature") return 5 + observed * 12;
  if (kind === "output") return 6;
  return 4;
}

function shortLabel(node: GraphNode) {
  if (node.kind === "feature") return node.label.replace(/^F\s*/, "");
  return node.label;
}

function layout(
  nodes: GraphNode[],
  weights: Record<string, number>,
): { placed: Placed[]; height: number } {
  const minX = Math.min(...nodes.map((n) => n.x));
  const maxX = Math.max(...nodes.map((n) => n.x));
  const minY = Math.min(...nodes.map((n) => n.y));
  const maxY = Math.max(...nodes.map((n) => n.y));
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scale = (WIDTH - PAD * 2) / spanX;
  const height = Math.max(168, spanY * scale + PAD * 2);

  const placed = nodes.map((node) => {
    const observed = seedWeight(node);
    const weight = weights[node.id] ?? observed;
    return {
      ...node,
      observed,
      weight,
      r: radius(node.kind, observed),
      px: PAD + (node.x - minX) * scale,
      py: PAD + (node.y - minY) * scale,
    };
  });

  return { placed, height };
}

export function GraphSchematic({
  nodes,
  edges = [],
  selectedId,
  statusByNode = {},
  savedRead = {},
  pendingSave = false,
  asName,
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

  const { placed, height } = useMemo(
    () => layout(nodes, weights),
    [nodes, weights],
  );
  const byId = useMemo(
    () => Object.fromEntries(placed.map((node) => [node.id, node])),
    [placed],
  );
  const selected = placed.find((node) => node.id === selectedId);
  const canWeigh = selected?.kind === "feature";
  const saved = selected ? savedRead[selected.id] : undefined;
  const currentWord = selected ? wordFor(selected.weight) : null;

  function setWeight(nodeId: string, value: number) {
    setWeights((prev) => ({ ...prev, [nodeId]: value }));
  }

  return (
    <div className="graph-wrap">
      <ul className="graph-key" aria-label="What the dots are">
        <li className="is-token">Prompt · given</li>
        <li className="is-feature">Feature · internal</li>
        <li className="is-output">Output · written</li>
      </ul>
      <svg
        className="graph"
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label="Measurement of the run. Prompt tokens the model was given, internal features that were active, and the output token it wrote."
      >
        {edges.map((edge) => {
          const from = byId[edge.source];
          const to = byId[edge.target];
          if (!from || !to) return null;
          const hot =
            from.id === selectedId || to.id === selectedId;
          return (
            <line
              key={`${edge.source}-${edge.target}`}
              className={`graph-edge${hot ? " is-hot" : ""}`}
              x1={from.px}
              y1={from.py}
              x2={to.px}
              y2={to.py}
              strokeWidth={0.8 + edge.weight * 2.2}
            />
          );
        })}
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
                      read != null ? `, read ${wordFor(read)}` : ""
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
                  r={2.6}
                />
              )}
              <text className="graph-label" x={node.r + 7} y={3}>
                {shortLabel(node)}
              </text>
              {node.kind === "feature" && (
                <text className="graph-meta" x={node.r + 7} y={16}>
                  {node.observed.toFixed(2)} obs
                  {read != null ? ` · ${wordFor(read)}` : ""}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {canWeigh && selected && (
        <div className="graph-weight">
          <p className="graph-weight-lead">
            How much this internal unit matters on this run, as {asName ?? "a person"}.
            Not a meaning, and not a measurement.
          </p>
          <div className="graph-words" role="group" aria-label="Reading words">
            {READING_WORDS.map((item) => (
              <button
                key={item.word}
                type="button"
                className={currentWord === item.word ? "is-active" : undefined}
                onClick={() => setWeight(selected.id, item.at)}
              >
                {item.word}
              </button>
            ))}
          </div>
          <label>
            <span className="graph-weight-row">
              <input
                type="range"
                min={0.04}
                max={1}
                step={0.01}
                value={selected.weight}
                aria-label={`Local reading for ${selected.label}`}
                onChange={(event) => {
                  setWeight(selected.id, Number(event.target.value));
                }}
              />
              <em>{currentWord}</em>
            </span>
          </label>
          <p className="graph-weight-note">
            Not a measurement. Observed stays {selected.observed.toFixed(2)}.
            {saved != null ? ` Saved as ${wordFor(saved)}.` : ""}
          </p>
          {onSaveRead && (
            <button
              type="button"
              className="text-link"
              disabled={pendingSave}
              onClick={() => onSaveRead(selected.id, selected.weight)}
            >
              Save this weight{asName ? ` as ${asName}` : ""}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
