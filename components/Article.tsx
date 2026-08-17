"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ClaimBody } from "@/components/ClaimBody";
import { FolioMast } from "@/components/FolioMast";
import { GraphSchematic } from "@/components/GraphSchematic";
import { Talk } from "@/components/Talk";
import { articleCopy, inspectCopy, neighborSentence } from "@/lib/articles";
import { CATALOG } from "@/lib/catalog";
import { getSession } from "@/lib/api";
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
  const claim = session?.claims.find((c) => c.feature_pk === feature?.id);
  const selected =
    session?.graph.nodes.find((n) => n.id === selectedNode) ?? null;
  const copy = articleCopy(featureId);
  const byline = [entry?.left.by, entry?.right?.by].filter(Boolean).join(" and ");
  const issue = String(CATALOG.findIndex((item) => item.id === featureId) + 1).padStart(
    2,
    "0",
  );

  const statusByNode = useMemo(() => {
    if (!session) return {};
    const map: Record<string, string | null> = {};
    for (const item of session.features) {
      map[item.node_id] =
        session.claims.find((c) => c.feature_pk === item.id)?.status ?? null;
    }
    return map;
  }, [session]);

  const neighbors = selected
    ? session?.graph.edges
        .filter(
          (edge) => edge.source === selected.id || edge.target === selected.id,
        )
        .map((edge) => {
          const otherId =
            edge.source === selected.id ? edge.target : edge.source;
          return session.graph.nodes.find((n) => n.id === otherId);
        })
        .filter((node): node is GraphNode => Boolean(node)) ?? []
    : [];

  const selectedFeature = selected
    ? session?.features.find((f) => f.node_id === selected.id)
    : null;
  const selectedClaim = selectedFeature
    ? session?.claims.find((c) => c.feature_pk === selectedFeature.id)
    : undefined;
  const jumpId = selected?.feature_id;
  const isOtherArticle = Boolean(jumpId && jumpId !== featureId);

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

  const graphCard = session ? (
    <section
      id="attribution"
      className="float-card is-graph"
      aria-label="Attribution graph"
    >
      <p className="kicker">Graph</p>
      <GraphSchematic
        nodes={session.graph.nodes}
        selectedId={selectedNode}
        statusByNode={statusByNode}
        onSelect={setSelectedNode}
      />
      <p className="float-caption">
        Weights, not meanings. Drag a feature’s weight. The constellation
        reflows. Attribution is correlational until an intervention has been
        run.
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
      {session ? (
        <>
          <p className="prompt">
            <span>{session.graph.prompt_tokens.join("")}</span>
            <span className="output">{session.run.output}</span>
          </p>
          <p>{copy.observation}</p>
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
        {session ? ` · ${session.run.model_name}` : ""}
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

  if (error) {
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
