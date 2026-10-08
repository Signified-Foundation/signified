"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ClaimBody } from "@/components/ClaimBody";
import { CompletionsChoice } from "@/components/CompletionsChoice";
import { FolioMast } from "@/components/FolioMast";
import { GraphSchematic } from "@/components/GraphSchematic";
import { QuestionChip } from "@/components/QuestionCite";
import { Talk } from "@/components/Talk";
import { TileMap } from "@/components/TileMap";
import { articleCopy, inspectCopy, neighborSentence } from "@/lib/articles";
import { CATALOG, articleGround, folioGroundClass } from "@/lib/catalog";
import { createClaim, retractChallenge, retractComment } from "@/lib/api";
import { useActorSession } from "@/lib/useActorSession";
import { wordFor } from "@/lib/reading";
import {
  observationPath,
  researchTiles,
} from "@/lib/research";
import {
  graphOf,
  meaningClaim,
  meaningStatus,
  runOf,
  weightClaims,
  writerNameOf,
} from "@/lib/session";
import type { GraphNode } from "@/lib/types";
import { featureSlug } from "@/lib/wiki";

function kindLabel(node: GraphNode) {
  if (node.kind === "feature") return "Feature";
  if (node.kind === "output") return "Output";
  return "Prompt";
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
  const ground = articleGround(entry);
  const folioClass = folioGroundClass(ground);
  const {
    session,
    setSession,
    actorId,
    actor,
    become,
    leave,
    handleCreate,
    handleSetImage,
    loadError,
  } = useActorSession();
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(
    `feat-${featureId}`,
  );
  const [composeClaim, setComposeClaim] = useState(false);
  const [composeChallenge, setComposeChallenge] = useState(false);
  const [composeEvidence, setComposeEvidence] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    setSelectedNode(`feat-${featureId}`);
  }, [featureId]);
  const banner = error ?? loadError;
  const feature =
    session?.features.find((f) => f.feature_id === featureId) ?? null;
  const run = feature && session ? runOf(session, feature.run_id) : undefined;
  const graph = feature && session ? graphOf(session, feature.run_id) : undefined;
  const writer = feature && session ? writerNameOf(session, feature.run_id) : undefined;
  const claim = feature && session ? meaningClaim(session, feature.id) : undefined;
  const selected = graph?.nodes.find((n) => n.id === selectedNode) ?? null;
  const copy = articleCopy(featureId);
  const byline = [entry?.left.by, entry?.right?.by].filter(Boolean).join(" and ");

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

  async function saveReading(nodeId: string, weight: number) {
    if (!session || !actor) return;
    const target = session.features.find((item) => item.node_id === nodeId);
    if (!target) return;
    const word = wordFor(weight);
    setPendingSave(true);
    setError(null);
    try {
      const next = await createClaim({
        feature_pk: target.id,
        author_id: actor.id,
        kind: "weight",
        weight,
        text: `On this run I weigh Feature ${target.feature_id} as ${word}.`,
      });
      setSession(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save weight");
    } finally {
      setPendingSave(false);
    }
  }

  const contests = claim?.challenges ?? [];

  const head = (
    <header className="folio-head">
      <p className="folio-issue">
        Feature
        {writer ? ` · ${writer}` : ""}
        {claim && contests.length > 0
          ? " · two readings"
          : claim
            ? " · one reading"
            : " · no reading yet"}
      </p>
      <h1 className="folio-title">{entry?.lemma ?? copy.title}</h1>
      {byline && (
        <p className="folio-by">
          {byline}
        </p>
      )}
      <p className="folio-dek">{markedDek(copy.about, copy.pull)}</p>
      <QuestionChip featureId={featureId} />
    </header>
  );

  const runDid =
    run && graph ? (
      <section className="run-did" aria-label="This run">
        <p className="kicker">This run</p>
        <dl className="run-did-pair">
          <div>
            <dt>Given</dt>
            <dd>{graph.prompt_tokens.join("")}</dd>
          </div>
          <div className="is-wrote">
            <dt>Wrote</dt>
            <dd>{run.output}</dd>
          </div>
        </dl>
      </section>
    ) : null;

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
  const hasArticle = Boolean(
    jumpId && CATALOG.some((item) => item.id === jumpId),
  );

  const notes = selected ? (
    <>
      <h3>{selected.label.replace(/^F /, "Feature ")}</h3>
      <p className="reading-who">{kindLabel(selected)}</p>
      <p>{inspectCopy(selected)}</p>
      <p>{neighborSentence(selected, neighbors)}</p>
      {isOtherArticle && jumpId && hasArticle && (
        <p className="inspect-links">
          <Link
            href={`/wiki/${featureSlug(jumpId)}`}
            className={`text-link${selectedClaim ? "" : " is-stub"}`}
          >
            {selectedClaim ? "Open the feature" : "No feature yet"}
          </Link>
        </p>
      )}
    </>
  ) : (
    <p>Select a node on the graph.</p>
  );

  const graphRail = (
    <aside className="float-rail" aria-label="Graph and notes">
      <section id="attribution" className="float-card is-graph">
        <p className="kicker">Graph</p>
        {graph ? (
          <GraphSchematic
            compact
            key={feature?.run_id ?? "graph"}
            nodes={graph.nodes}
            edges={graph.edges}
            selectedId={selectedNode}
            statusByNode={statusByNode}
            savedRead={savedRead}
            pendingSave={pendingSave}
            onSelect={setSelectedNode}
            onSaveRead={actor ? saveReading : undefined}
            asName={actor?.name}
          />
        ) : (
          <p className="quiet">Loading the graph…</p>
        )}
      </section>
      <section className="float-card is-map">
        <TileMap
          compact
          tiles={researchTiles()}
          selectedId={featureId}
          path={observationPath(entry?.runId ?? 1)}
        />
      </section>
      <section className="float-card is-notes" aria-live="polite">
        <p className="kicker">Note</p>
        {notes}
      </section>
    </aside>
  );

  function shell(body: ReactNode) {
    return (
      <div className={folioClass}>
        <FolioMast
          current="articles"
          actor={actor}
          onCreate={session ? handleCreate : undefined}
          onLeave={session ? leave : undefined}
          onSetImage={session && actor ? handleSetImage : undefined}
        />
        <div className="folio-stage">
          <article className="article folio-essay">
            {head}
            {body}
          </article>
          {graphRail}
        </div>
      </div>
    );
  }

  if (banner && !session) {
    return shell(<p>{banner}</p>);
  }

  if (!session) {
    return shell(<p className="quiet">Loading the article…</p>);
  }

  return shell(
    <>
      {banner && <p className="form-error">{banner}</p>}
      {runDid}
      {run && (
        <CompletionsChoice
          session={session}
          actor={actor}
          prompt={run.prompt}
          graphRunId={run.id}
          onSession={setSession}
          onActor={become}
        />
      )}
      <ClaimBody
        session={session}
        actor={actor}
        feature={feature}
        claim={claim}
        composeClaim={composeClaim}
        composeChallenge={composeChallenge}
        composeEvidence={composeEvidence}
        onComposeClaim={setComposeClaim}
        onComposeChallenge={setComposeChallenge}
        onComposeEvidence={setComposeEvidence}
        onSession={setSession}
        onRetractChallenge={async (challengeId) => {
          if (!claim || !actor) return;
          try {
            setSession(await retractChallenge(claim.id, challengeId, actor.id));
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not retract");
          }
        }}
        part="readings"
      />
      <ClaimBody
        session={session}
        actor={actor}
        feature={feature}
        claim={claim}
        composeClaim={composeClaim}
        composeChallenge={composeChallenge}
        composeEvidence={composeEvidence}
        onComposeClaim={setComposeClaim}
        onComposeChallenge={setComposeChallenge}
        onComposeEvidence={setComposeEvidence}
        onSession={setSession}
        part="evidence"
      />
      {feature && (
        <Talk
          session={session}
          featurePk={feature.id}
          actorId={actorId}
          onSession={setSession}
          onBecome={become}
          onRetractComment={async (commentId) => {
            if (!actor) return;
            try {
              setSession(await retractComment(commentId, actor.id));
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not retract");
            }
          }}
        />
      )}
    </>,
  );
}
