"use client";

import { useState } from "react";
import { GraphSchematic } from "@/components/GraphSchematic";
import type { GraphPayload } from "@/lib/types";

export function CompactGraph({
  runId,
  writer,
  graph,
}: {
  runId: number;
  writer: string;
  graph: GraphPayload | null;
}) {
  const firstFeature =
    graph?.nodes.find((node) => node.kind === "feature")?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(firstFeature);
  const selected = graph?.nodes.find((node) => node.id === selectedId);
  const featureId = selected?.feature_id;

  return (
    <section className="rs-run" aria-labelledby="rs-run-title">
      <p className="kicker" id="rs-run-title">
        On this run
      </p>
      <p className="rs-run-meta">
        Run {runId} · {writer}
      </p>
      {graph ? (
        <>
          <GraphSchematic
            compact
            nodes={graph.nodes}
            edges={graph.edges}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          {featureId != null && (
            <p className="rs-run-note">
              Feature {featureId}
              {selected?.label ? ` · ${selected.label.replace(/^F\s*/, "")}` : ""}
            </p>
          )}
        </>
      ) : (
        <p className="rs-run-empty">Not traced</p>
      )}
    </section>
  );
}
