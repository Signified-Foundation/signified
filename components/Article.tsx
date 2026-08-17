"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ClaimBody } from "@/components/ClaimBody";
import { CompletionsChoice } from "@/components/CompletionsChoice";
import { FolioMast } from "@/components/FolioMast";
import { GraphSchematic } from "@/components/GraphSchematic";
import { Talk } from "@/components/Talk";
import { articleCopy, inspectCopy, neighborSentence } from "@/lib/articles";
import { CATALOG, articleGround, folioGroundClass } from "@/lib/catalog";
import { createClaim, retractChallenge, retractComment } from "@/lib/api";
import { kindPhrase } from "@/lib/profile";
import { useActorSession } from "@/lib/useActorSession";
import { wordFor } from "@/lib/reading";
import {
  graphOf,
  meaningClaim,
  meaningStatus,
  runOf,
  weightClaims,
  writerNameOf,
  writerRunsForPrompt,
} from "@/lib/session";
import type { GraphNode } from "@/lib/types";
import { featureSlug } from "@/lib/wiki";

function kindLabel(node: GraphNode) {
  if (node.kind === "feature") return "Internal unit · not a word the model wrote";
  if (node.kind === "output") return "Output token · the model wrote this";
  return "Prompt token · given to the model";
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
  const siblingWriters =
    session && run ? writerRunsForPrompt(session, run.prompt) : [];
  const canChoose = siblingWriters.length >= 2;

  const head = (
    <header className="folio-head">
      <p className="folio-issue">
        {issue} / {copy.title}
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
          {byline} <span className="folio-by-kind">· people, not the model</span>
        </p>
      )}
      <p className="folio-dek">{markedDek(copy.about, copy.pull)}</p>
    </header>
  );

  const runDid =
    run && graph ? (
      <section className="run-did" aria-label="What the model did">
        <p className="kicker">What the model did</p>
        <p className="run-did-who">
          <strong>{writer ?? "The writer"}</strong>
          completed the prompt. It did not label the graph, and it did not file
          a reading.
        </p>
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
        <ul className="run-did-key">
          <li>Left · prompt tokens</li>
          <li>Middle · features</li>
          <li>Right · the output</li>
        </ul>
        <p className="run-did-note">
          The graph is a fixture of this run, not live circuit-tracer. The
          writer did not draw it. Features are not extra tokens.
        </p>
      </section>
    ) : null;

  const personDoes = (
    <nav className="person-does" aria-label="What a person does">
      <p className="kicker">What a person does</p>
      <p className="person-does-who">
        {actor ? (
          <>
            You are {actor.name}, {kindPhrase(actor)}. Not the writer on this
            run.
          </>
        ) : (
          <>
            <a href="#login">Enter</a> as a person, or create an agent, to vote
            or file a reading.
          </>
        )}
      </p>
      <ol>
        <li>
          <a href="#choice">
            {canChoose ? "Choose a response" : "See the completions"}
          </a>
          {canChoose
            ? " — which writer’s completion you prefer. That is not a reading of this unit."
            : ". A choice needs two writers. This lead has one."}
        </li>
        {!claim ? (
          <li>
            <a href="#readings">File a reading</a> of this unit — a hypothesis,
            not a caption from the model.
          </li>
        ) : (
          <li>
            <a href="#readings">File another reading</a>
            {contests.length === 0
              ? ". This article is waiting for a second person."
              : ". Both stay. The page does not pick a winner."}
          </li>
        )}
        <li>
          <a href="#thread">Reply in the thread</a>. A comment is not evidence.
        </li>
        <li>
          <a href="#evidence">Attach a number</a> only if you ran the test.
        </li>
      </ol>
    </nav>
  );

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
            {selectedClaim ? "Open the article" : "No article yet"}
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
        <p className="kicker">Graph · a measurement</p>
        {graph ? (
          <>
            <GraphSchematic
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
            <p className="float-caption">
              The writer did not draw this. A tracer measured which given
              tokens and internal units wrote into the output. Observed stays on
              the node. The words are a person’s local weight, not a meaning.
            </p>
          </>
        ) : (
          <p className="quiet">Loading the graph…</p>
        )}
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
      {personDoes}
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
