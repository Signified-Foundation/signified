"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ClaimBody } from "@/components/ClaimBody";
import { FolioMast } from "@/components/FolioMast";
import { GraphSchematic } from "@/components/GraphSchematic";
import { Talk } from "@/components/Talk";
import { articleCopy, inspectCopy, neighborSentence } from "@/lib/articles";
import { CATALOG } from "@/lib/catalog";
import { createClaim, getSession } from "@/lib/api";
import {
  graphOf,
  meaningClaim,
  meaningStatus,
  runOf,
  weightClaims,
  writerNameOf,
} from "@/lib/session";
import type { GraphNode, Session, User } from "@/lib/types";
import { featureSlug } from "@/lib/wiki";

function kindLabel(node: GraphNode) {
  if (node.kind === "feature") return "Feature";
  if (node.kind === "output") return "Output token";
  return "Prompt token";
}

const PAGE_TOC = [
  { href: "#observation", label: "On this run" },
  { href: "#attribution", label: "Attribution" },
  { href: "#readings", label: "Readings" },
  { href: "#evidence", label: "Evidence" },
  { href: "#talk", label: "Talk" },
] as const;

function FolioToc() {
  return (
    <nav className="folio-toc" aria-label="On this page">
      <p className="toc-label">On this page</p>
      <ul>
        {PAGE_TOC.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function markedDek(about: string, pull: string): ReactNode {
  const at = about.indexOf(pull);
  if (at < 0) return about;
  return (
    <>
      {about.slice(0, at)}
      <a className="mark" href="#readings">
        <span className="mark-star" aria-hidden="true">
          ★
        </span>
        {pull}
      </a>
      {about.slice(at + pull.length)}
    </>
  );
}

export function Article({ featureId }: { featureId: number }) {
  const entry = CATALOG.find((item) => item.id === featureId);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actorId, setActorId] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(
    `feat-${featureId}`,
  );
  const [compose, setCompose] = useState<
    "claim" | "challenge" | "evidence" | null
  >(null);
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    setSelectedNode(`feat-${featureId}`);
  }, [featureId]);

  useEffect(() => {
    let alive = true;
    getSession()
      .then((data) => {
        if (alive) setSession(data);
      })
      .catch(() => {
        if (alive) {
          setError("Could not load this run.");
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const actor: User | undefined = session?.users.find((u) => u.id === actorId);
  const feature =
    session?.features.find((f) => f.feature_id === featureId) ?? null;
  const run = feature && session ? runOf(session, feature.run_id) : undefined;
  const graph = feature && session ? graphOf(session, feature.run_id) : undefined;
  const writer = feature && session ? writerNameOf(session, feature.run_id) : undefined;
  const claim = feature && session ? meaningClaim(session, feature.id) : undefined;
  const selected =
    graph?.nodes.find((n) => n.id === selectedNode) ?? null;
  const copy = articleCopy(featureId);
  const byline = [entry?.left.by, entry?.right?.by].filter(Boolean).join(" and ");
  const issue = String(CATALOG.findIndex((item) => item.id === featureId) + 1).padStart(
    2,
    "0",
  );

  const statusByNode = useMemo(() => {
    if (!session || !feature) return {};
    const map: Record<string, string | null> = {};
    for (const item of session.features.filter((row) => row.run_id === feature.run_id)) {
      map[item.node_id] = meaningStatus(session, item);
    }
    return map;
  }, [session, feature]);

  const savedRead = useMemo(() => {
    if (!session || !feature) return {};
    const map: Record<string, number> = {};
    for (const item of session.features.filter((row) => row.run_id === feature.run_id)) {
      const latest = weightClaims(session, item.id).at(-1);
      if (latest?.weight != null) map[item.node_id] = latest.weight;
    }
    return map;
  }, [session, feature]);

  const neighbors = selected
    ? graph?.edges
        .filter(
          (edge) => edge.source === selected.id || edge.target === selected.id,
        )
        .map((edge) => {
          const otherId =
            edge.source === selected.id ? edge.target : edge.source;
          return graph.nodes.find((n) => n.id === otherId);
        })
        .filter((node): node is GraphNode => Boolean(node)) ?? []
    : [];

  const selectedFeature = selected
    ? session?.features.find((f) => f.node_id === selected.id)
    : null;
  const selectedClaim =
    selectedFeature && session
      ? meaningClaim(session, selectedFeature.id)
      : undefined;
  const jumpId = selected?.feature_id;
  const isOtherArticle = Boolean(jumpId && jumpId !== featureId);
  const scores =
    session && feature
      ? session.scores.filter((item) => item.run_id === feature.run_id)
      : [];

  async function saveReading(nodeId: string, weight: number) {
    if (!session || !actor) return;
    const target = session.features.find((item) => item.node_id === nodeId);
    if (!target) return;
    setPendingSave(true);
    setError(null);
    try {
      const next = await createClaim({
        feature_pk: target.id,
        author_id: actor.id,
        kind: "weight",
        weight,
        text: `On this run I read Feature ${target.feature_id} as weight ${weight.toFixed(2)}.`,
      });
      setSession(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save reading");
    } finally {
      setPendingSave(false);
    }
  }

  const notes = selected ? (
    <>
      <h3>{selected.label.replace(/^F /, "Feature ")}</h3>
      <p className="reading-who">{kindLabel(selected)}</p>
      <p>{inspectCopy(selected)}</p>
      <p>{neighborSentence(selected, neighbors)}</p>
      {isOtherArticle && jumpId && (
        <p className="inspect-links">
          <Link
            href={`/wiki/${featureSlug(jumpId)}`}
            className={`text-link${selectedClaim ? "" : " is-stub"}`}
          >
            {selectedClaim ? "Open the article" : "No article yet"}
          </Link>
        </p>
      )}
    </>
  ) : (
    <p>Select a node on the graph.</p>
  );

  const graphCard = graph ? (
    <section
      id="attribution"
      className="float-card is-graph"
      aria-label="Attribution graph"
    >
      <p className="kicker">Graph</p>
      <GraphSchematic
        key={feature?.run_id ?? "graph"}
        nodes={graph.nodes}
        selectedId={selectedNode}
        statusByNode={statusByNode}
        savedRead={savedRead}
        pendingSave={pendingSave}
        onSelect={setSelectedNode}
        onSaveRead={saveReading}
      />
      <p className="float-caption">
        {graph.note} The number on the node is observed. The slider is a local
        reading.
      </p>
    </section>
  ) : (
    <section
      id="attribution"
      className="float-card is-graph"
      aria-label="Attribution graph"
    >
      <p className="kicker">Graph</p>
      <p className="quiet">Loading the graph…</p>
    </section>
  );

  const runCard = (
    <section id="observation" className="float-card is-read">
      <p className="kicker">On this run</p>
      {run && graph ? (
        <>
          <p className="prompt">
            <span>{graph.prompt_tokens.join("")}</span>
            <span className="output">{run.output}</span>
          </p>
          {writer && <p className="run-model">{writer} · writer</p>}
          <p>{copy.observation}</p>
          {scores.length > 0 && (
            <ul className="score-list">
              {scores.map((item) => {
                const name =
                  session?.models.find((model) => model.id === item.model_id)
                    ?.name ?? "Scorer";
                return (
                  <li key={item.id}>
                    <span>{name}</span>
                    <em>
                      {item.value == null ? "no number" : item.value.toFixed(5)}
                    </em>
                  </li>
                );
              })}
            </ul>
          )}
          {scores.length > 0 && (
            <p className="section-note">
              Not a measurement of the feature. Another open model scored the
              written pair.
            </p>
          )}
        </>
      ) : (
        <p className="quiet">Loading the run…</p>
      )}
    </section>
  );

  const notesCard = (
    <section className="float-card is-notes" aria-live="polite">
      <p className="kicker">Note</p>
      {notes}
    </section>
  );

  const head = (
    <header className="folio-head">
      <p className="folio-issue">
        {issue} / {copy.title}
        {writer ? ` · ${writer}` : ""}
      </p>
      <h1 className="folio-title">{entry?.lemma ?? copy.title}</h1>
      {byline && <p className="folio-by">{byline}</p>}
      <p className="folio-dek">{markedDek(copy.about, copy.pull)}</p>
    </header>
  );

  const rail = (
    <aside className="float-rail" aria-label="On this page, graph, and notes">
      <FolioToc />
      {runCard}
      {session && actor && (
        <ClaimBody
          session={session}
          actor={actor}
          feature={feature}
          claim={claim}
          compose={compose}
          onCompose={setCompose}
          onSession={setSession}
          part="readings"
        />
      )}
      {graphCard}
      {notesCard}
    </aside>
  );

  if (error && !session) {
    return (
      <div className="folio">
        <FolioMast />
        <div className="folio-stage">
          <article className="article folio-essay">
            {head}
            <p>{error}</p>
          </article>
          {rail}
        </div>
      </div>
    );
  }

  if (!session || !actor) {
    return (
      <div className="folio">
        <FolioMast />
        <div className="folio-stage">
          <article className="article folio-essay">
            {head}
            <p className="quiet">Loading the article…</p>
          </article>
          {rail}
        </div>
      </div>
    );
  }

  return (
    <div className="folio">
      <FolioMast />
      <div className="folio-stage">
        <article className="article folio-essay">
          {head}
          {error && <p className="form-error">{error}</p>}

          <ClaimBody
            session={session}
            actor={actor}
            feature={feature}
            claim={claim}
            compose={compose}
            onCompose={setCompose}
            onSession={setSession}
            part="evidence"
          />

          {feature && (
            <Talk
              session={session}
              featurePk={feature.id}
              actorId={actorId}
              onActor={setActorId}
              onSession={setSession}
            />
          )}
        </article>
        {rail}
      </div>
    </div>
  );
}
