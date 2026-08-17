"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ATLAS_HEIGHT,
  ATLAS_WIDTH,
  atlasEdges,
  atlasMatches,
  atlasPoints,
  atlasRunOf,
} from "@/lib/atlas";
import { articleState, articleStateLabel, CATALOG_RUNS } from "@/lib/catalog";
import { featureSlug } from "@/lib/wiki";

export function WikiAtlas() {
  const [query, setQuery] = useState("");
  const [runId, setRunId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(3102);
  const points = useMemo(() => atlasPoints(), []);
  const visible = points.filter((item) => {
    if (runId != null && item.runId !== runId) return false;
    return atlasMatches(item, query);
  });
  const visibleIds = new Set(visible.map((item) => item.id));
  const active =
    points.find((item) => item.id === activeId && visibleIds.has(item.id)) ??
    visible[0];
  const edges = useMemo(() => atlasEdges(points), [points]);

  return (
    <section className="atlas" aria-label="Find an article">
      <div className="atlas-bar">
        <label className="atlas-search">
          <span>Find</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Georgia, wrath, ether…"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <div className="atlas-runs" role="group" aria-label="Runs">
          <button
            type="button"
            className={runId == null ? "is-active" : undefined}
            onClick={() => setRunId(null)}
          >
            All
          </button>
          {CATALOG_RUNS.map((run) => (
            <button
              key={run.id}
              type="button"
              className={runId === run.id ? "is-active" : undefined}
              onClick={() => setRunId(run.id === runId ? null : run.id)}
            >
              {run.kicker.replace(/ run$/, "")}
            </button>
          ))}
        </div>
      </div>

      <svg
        className="atlas-map"
        viewBox={`0 0 ${ATLAS_WIDTH} ${ATLAS_HEIGHT}`}
        role="img"
        aria-label="A map of the catalog. Nearby lemmas share a run or a fight."
      >
        {edges.map(({ a, b }) => (
          <line
            key={`${a.id}-${b.id}`}
            className={`atlas-edge${
              visibleIds.has(a.id) && visibleIds.has(b.id) ? "" : " is-dim"
            }`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
          />
        ))}
        {points.map((item) => {
          const on = visibleIds.has(item.id);
          const selected = item.id === active?.id;
          const contested = item.status === "contested";
          return (
            <g
              key={item.id}
              className={`atlas-node is-${item.status}${on ? "" : " is-dim"}${
                selected ? " is-selected" : ""
              }`}
              transform={`translate(${item.x}, ${item.y})`}
              role="button"
              tabIndex={on ? 0 : -1}
              aria-label={`${item.lemma}, ${articleStateLabel(item)}`}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveId(item.id);
                }
              }}
            >
              <circle r={contested ? 7.5 : 5.5} />
              <text x={12} y={4}>
                {item.lemma}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="atlas-caption">
        A t-SNE of the wiki, not the model. Neighbours share a run or an
        argument. {visible.length} of {points.length} shown.
      </p>
      {visible.length === 0 && (
        <p className="atlas-empty">Nothing matches. Clear the search.</p>
      )}

      {active && (
        <div className="atlas-card">
          <p className="atlas-kicker">
            {active.label} · {atlasRunOf(active.runId)?.kicker} ·{" "}
            {articleStateLabel(active)}
          </p>
          <h2>
            <Link
              href={`/wiki/${featureSlug(active.id)}`}
              className={`issue-title is-${articleState(active)}`}
            >
              {active.lemma}
            </Link>
          </h2>
          <div className={`issue-pair${active.right ? "" : " is-single"}`}>
            <blockquote>
              <cite>{active.left.by}</cite>
              <p>{active.left.text}</p>
            </blockquote>
            {active.right ? (
              <blockquote>
                <cite>{active.right.by}</cite>
                <p>{active.right.text}</p>
              </blockquote>
            ) : (
              <p className="issue-empty">{active.hold}</p>
            )}
          </div>
          <p className="issue-go">
            <Link href={`/wiki/${featureSlug(active.id)}`} className="text-link">
              Open the article
            </Link>
          </p>
        </div>
      )}
    </section>
  );
}
