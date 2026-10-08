"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { ClaimBody } from "@/components/ClaimBody";
import { DensityPlot } from "@/components/DensityPlot";
import { FolioMast } from "@/components/FolioMast";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { Talk } from "@/components/Talk";
import { TileMap } from "@/components/TileMap";
import {
  createReview,
  retractChallenge,
  retractComment,
  signIn,
} from "@/lib/api";
import { resolveUser } from "@/lib/profile";
import type {
  ResearchComment,
  ResearchPayload,
  ResearchReview,
  ResearchSeeAlso,
  ResearchWriter,
  TrialId,
} from "@/lib/research";
import { commentsForFeature, contrastPath } from "@/lib/research";
import { meaningClaim, reviewsForRun } from "@/lib/session";
import type { ReviewStance, User } from "@/lib/types";
import { useActorSession } from "@/lib/useActorSession";

const STANCES: { id: ReviewStance; label: string }[] = [
  { id: "agrees", label: "Agrees" },
  { id: "contests", label: "Another view" },
  { id: "incomplete", label: "Incomplete" },
];

const ANTI_LEAD =
  "An anti-debate: we read this unit together and try to understand it more fully.";

function stanceLabel(stance: string) {
  if (stance === "contests") return "Another view";
  return stance.charAt(0).toUpperCase() + stance.slice(1);
}

function when(iso: string) {
  const date = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function Hatnote({ children }: { children: ReactNode }) {
  return (
    <aside className="rs-hatnote" aria-label="Disambiguation">
      {children}
    </aside>
  );
}

function SeeAlso({
  items,
  onPick,
}: {
  items: ResearchSeeAlso[];
  onPick: (id: number) => void;
}) {
  if (items.length === 0) return null;

  return (
    <nav className="rs-also" aria-labelledby="rs-also-title">
      <p className="kicker" id="rs-also-title">
        See also
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => onPick(item.id)}>
              {item.label}
            </button>
            <span>{item.lemma}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SeedThread({ comments }: { comments: ResearchComment[] }) {
  const roots = comments.filter((item) => item.parent_id == null);
  const kidsOf = (id: number) =>
    comments.filter((item) => item.parent_id === id);

  if (comments.length === 0) {
    return <p className="quiet">No comments yet</p>;
  }

  return (
    <ol className="thread">
      {roots.map((item) => (
        <li key={item.id} className="thread-item">
            <p className="thread-who">
              <strong>{item.author}</strong>
              {item.kind === "agent" ? <span>adds context</span> : null}
              <span>{when(item.created_at)}</span>
            </p>
          <p className="thread-body">{item.text}</p>
          {kidsOf(item.id).length > 0 && (
            <ol className="thread is-nested">
              {kidsOf(item.id).map((kid) => (
                <li key={kid.id} className="thread-item">
                  <p className="thread-who">
                    <strong>{kid.author}</strong>
                    {kid.kind === "agent" ? <span>adds context</span> : null}
                    <span>to {item.author}</span>
                    <span>{when(kid.created_at)}</span>
                  </p>
                  <p className="thread-body">{kid.text}</p>
                </li>
              ))}
            </ol>
          )}
        </li>
      ))}
    </ol>
  );
}

function QuestionHatnote({
  writer,
  output,
  hatnote,
  onOpen,
}: {
  writer: string;
  output: string;
  hatnote: ResearchPayload["hatnote"];
  onOpen: () => void;
}) {
  const sameSea = /black sea/i.test(output);

  return (
    <Hatnote>
      This answer is {writer} on this question.{" "}
      {sameSea ? (
        <>The continuation that also wrote “Black Sea” is </>
      ) : (
        <>The continuation on Georgia as country and as name is </>
      )}
      <button type="button" className="rs-inline" onClick={onOpen}>
        {hatnote.label}
      </button>
      .
    </Hatnote>
  );
}

export function ResearchDemo({ data }: { data: ResearchPayload }) {
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
  const [trial, setTrial] = useState<TrialId>("question");
  const [selectedId, setSelectedId] = useState(
    data.writers.find((run) => run.reviews.length > 0)?.id ??
      data.writers[0]?.id ??
      0,
  );
  const [tileId, setTileId] = useState(data.hatnote.id);
  const [stance, setStance] = useState<ReviewStance>("contests");
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [composeClaim, setComposeClaim] = useState(false);
  const [composeChallenge, setComposeChallenge] = useState(false);
  const [composeEvidence, setComposeEvidence] = useState(false);
  const selected: ResearchWriter =
    data.writers.find((run) => run.id === selectedId) ?? data.writers[0];
  const tile = data.tiles.find((item) => item.id === tileId) ?? data.tiles[0];
  const feature =
    session?.features.find((item) => item.feature_id === tileId) ?? null;
  const claim =
    session && feature ? meaningClaim(session, feature.id) : undefined;
  const liveReviews =
    session && selected ? reviewsForRun(session, selected.id) : [];
  const seedReviews = selected?.reviews ?? [];
  const mine =
    actor && selected && session
      ? liveReviews.find((item) => item.author_id === actor.id)
      : undefined;
  const seedComments = commentsForFeature(tileId);
  const contrast = tile ? contrastPath(tile) : null;
  const banner = error ?? loadError;

  useEffect(() => {
    if (mine) {
      setStance(mine.stance);
      setText(mine.text);
    } else {
      setStance("contests");
      setText("");
    }
  }, [selected?.id, mine?.id, mine?.stance, mine?.text]);

  async function onReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = event.currentTarget;
    const typed = String(new FormData(form).get("name") ?? "");
    setPending(true);
    setError(null);
    try {
      let user: User | undefined = actor;
      if (!user) {
        const signed = await signIn(typed);
        user = signed.user;
        setSession(signed.session);
        become(user);
      }
      setSession(
        await createReview({
          author_id: user.id,
          run_id: selected.id,
          stance,
          text,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save review");
    } finally {
      setPending(false);
    }
  }

  const path =
    trial === "lead"
      ? {
          prompt: data.lead.prompt,
          output: data.lead.output,
          unitIds: data.lead.units.map((item) => item.id),
          traced: data.lead.units.length > 0,
        }
      : {
          prompt: data.question.text,
          output: selected?.output ?? "",
          unitIds: selected?.units.map((item) => item.id) ?? [],
          traced: (selected?.units.length ?? 0) > 0,
        };

  function openUnit(id: number) {
    setTileId(id);
  }

  function openContinuation(id = data.hatnote.id) {
    setTileId(id);
    setTrial("lead");
  }

  const dossier =
    session && feature ? (
      <>
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
              setSession(
                await retractChallenge(claim.id, challengeId, actor.id),
              );
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Could not retract",
              );
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
      </>
    ) : tile ? (
      <>
        <section className="claim-read">
          <p className="kicker">Read</p>
          <div className={`issue-pair${tile.right ? "" : " is-single"}`}>
            <blockquote>
              <cite>{tile.left.by}</cite>
              <p>{tile.left.text}</p>
            </blockquote>
            {tile.right ? (
              <blockquote>
                <cite>{tile.right.by}</cite>
                <p>{tile.right.text}</p>
              </blockquote>
            ) : (
              <p className="issue-empty">{tile.hold}</p>
            )}
          </div>
        </section>
        <section id="evidence">
          <h2>Evidence</h2>
          <p className="quiet">The path above is the test to run.</p>
        </section>
      </>
    ) : null;

  const instrument = (
    <aside className="rs-rail" aria-label="Graphs">
      <div className="rs-instrument">
        {tile && (
          <p className="rs-pin" key={tile.id}>
            <em>{tile.lemma}</em>
            <span>{tile.label}</span>
          </p>
        )}
        <DensityPlot
          compact
          figure={data.density}
          activeId={tileId}
          onSelect={openUnit}
        />
        <TileMap
          compact
          tiles={data.tiles}
          selectedId={tileId}
          path={path}
          currentHop={trial === "question" ? "question" : "continuation"}
          onHop={(hop) => setTrial(hop === "question" ? "question" : "lead")}
          onSelect={openUnit}
        />
      </div>
    </aside>
  );

  return (
    <div className="folio is-paper">
      <FolioMast
        current="research"
        actor={actor}
        onCreate={session ? handleCreate : undefined}
        onLeave={session ? leave : undefined}
        onSetImage={session && actor ? handleSetImage : undefined}
      />

      <div className="folio-stage rs-desk">
        {instrument}

        <article className="folio-essay rs-page">
          <section className="rs-room is-run">
            <header className="rs-head">
              <div className="rs-head-row">
                <p className="kicker">
                  {trial === "question" ? "Question" : "Continuation"}
                </p>
                <nav
                  className="rs-trials"
                  data-current={trial}
                  aria-label="Trial"
                >
                  <button
                    type="button"
                    className={trial === "question" ? "is-current" : undefined}
                    aria-pressed={trial === "question"}
                    onClick={() => setTrial("question")}
                  >
                    Question
                  </button>
                  <button
                    type="button"
                    className={trial === "lead" ? "is-current" : undefined}
                    aria-pressed={trial === "lead"}
                    onClick={() => setTrial("lead")}
                  >
                    Continuation
                  </button>
                  <span className="rs-trials-on" aria-hidden="true">
                    <span>Question</span>
                    <span>Continuation</span>
                  </span>
                </nav>
              </div>
              <h1 className="rs-title">
                {trial === "question" ? data.question.text : data.lead.prompt}
              </h1>
            </header>

            {banner && <p className="form-error">{banner}</p>}

            {trial === "question" && selected && (
              <>
                <div className="q-picks" role="radiogroup" aria-label="Writers">
                  {data.writers.map((run, index) => {
                    const on = selected.id === run.id;
                    const count = session
                      ? reviewsForRun(session, run.id).length
                      : run.reviews.length;
                    return (
                      <label
                        key={run.id}
                        className={`q-pick${on ? " is-selected" : ""}${
                          index % 2 ? " is-alt" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="research-completion"
                          checked={on}
                          onChange={() => setSelectedId(run.id)}
                        />
                        <span className="q-pick-writer">{run.writer}</span>
                        <span className="q-pick-output">{run.output}</span>
                        <span className="q-pick-meta">
                          Run {run.id}
                          {count === 0
                            ? " · no reviews"
                            : ` · ${count} ${count === 1 ? "review" : "reviews"}`}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <QuestionHatnote
                  writer={selected.writer}
                  output={selected.output}
                  hatnote={data.hatnote}
                  onOpen={() => openContinuation(data.hatnote.id)}
                />
              </>
            )}

            {trial === "lead" && (
              <>
                <Hatnote>
                  Gemma wrote <em>{data.lead.output}</em>. The question is{" "}
                  <button
                    type="button"
                    className="rs-inline"
                    onClick={() => setTrial("question")}
                  >
                    {data.question.text}
                  </button>
                  .
                </Hatnote>
                <p className="rs-wrote">
                  <span>Wrote</span>
                  <strong>{data.lead.output}</strong>
                </p>
              </>
            )}

            {trial === "question" && selected && (
              <section className="rs-reviews" aria-label="Reviews">
                <p className="kicker">Reviews · {selected.writer}</p>
                <p className="rs-map-note">A review of this answer.</p>
                <form className="compose q-form" onSubmit={onReview}>
                  <fieldset className="q-stances">
                    <legend>Stance</legend>
                    {STANCES.map((item) => (
                      <label
                        key={item.id}
                        className={stance === item.id ? "is-on" : undefined}
                      >
                        <input
                          type="radio"
                          name="stance"
                          checked={stance === item.id}
                          onChange={() => setStance(item.id)}
                        />
                        {item.label}
                      </label>
                    ))}
                  </fieldset>
                  <div className="q-form-band">
                    <label>
                      Review
                      <textarea
                        name="text"
                        required
                        minLength={8}
                        maxLength={500}
                        rows={2}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                      />
                    </label>
                    {!actor && (
                      <label className="q-form-name">
                        Name
                        <input
                          name="name"
                          required
                          minLength={2}
                          maxLength={40}
                          autoComplete="nickname"
                        />
                      </label>
                    )}
                    <button
                      className="btn-solid"
                      type="submit"
                      disabled={pending || !session}
                    >
                      {mine ? "Update" : "Review"}
                    </button>
                  </div>
                </form>

                <ol className="thread">
                  {session
                    ? liveReviews.length === 0 && (
                        <li className="quiet">No reviews yet</li>
                      )
                    : seedReviews.length === 0 && (
                        <li className="quiet">No reviews yet</li>
                      )}
                  {session
                    ? liveReviews.map((item) => {
                        const who = resolveUser(session.users, item.author_id);
                        return (
                          <li key={item.id} className="thread-item">
                            <p className="thread-who">
                              <ProfileAvatar user={who} size="s" />
                              <strong>{who.name}</strong>
                              <span>{stanceLabel(item.stance)}</span>
                              <span>{when(item.created_at)}</span>
                            </p>
                            <p className="thread-body">{item.text}</p>
                          </li>
                        );
                      })
                    : seedReviews.map((item: ResearchReview) => (
                        <li key={item.id} className="thread-item">
                          <p className="thread-who">
                            <strong>{item.author}</strong>
                            <span>{stanceLabel(item.stance)}</span>
                          </p>
                          <p className="thread-body">{item.text}</p>
                        </li>
                      ))}
                </ol>
              </section>
            )}
          </section>

          <section
            className="rs-room is-specimen rs-dossier"
            aria-labelledby="rs-dossier-title"
          >
            <header className="rs-specimen-head">
              <p className="kicker">Read and evidence</p>
              {tile ? (
                <h2
                  id="rs-dossier-title"
                  className="rs-pin-title"
                  key={tile.id}
                >
                  {tile.lemma}
                  <span>{tile.label}</span>
                </h2>
              ) : (
                <h2 id="rs-dossier-title">Read and evidence</h2>
              )}
              <p className="rs-dek">
                Two readings held together, with whatever result has been stored.
              </p>
            </header>
            {contrast && (
              <div className="rs-evpath">
                <p className="kicker">Evidence path</p>
                <ol className="rs-path is-contrast">
                  <li className="rs-path-end is-a">{contrast.left}</li>
                  <li className="rs-path-arrow" aria-hidden="true">
                    →
                  </li>
                  <li>
                    <span className="rs-tile is-continuation is-selected">
                      <span>{contrast.unit}</span>
                    </span>
                  </li>
                  <li className="rs-path-arrow" aria-hidden="true">
                    →
                  </li>
                  <li className="rs-path-end is-b">{contrast.right}</li>
                </ol>
                <p className="rs-map-note">{contrast.note}</p>
              </div>
            )}
            {dossier}
          </section>

          <section className="rs-room is-talk">
            {session && feature ? (
              <Talk
                session={session}
                featurePk={feature.id}
                actorId={actorId}
                variant="anti"
                title="Anti-debate"
                lead={ANTI_LEAD}
                onSession={setSession}
                onBecome={become}
                onRetractComment={async (commentId) => {
                  if (!actor) return;
                  try {
                    setSession(await retractComment(commentId, actor.id));
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "Could not retract",
                    );
                  }
                }}
              />
            ) : (
              <section id="talk" className="talk-section is-anti">
                <h2>Anti-debate</h2>
                <p className="talk-lead">{ANTI_LEAD}</p>
                <SeedThread comments={seedComments} />
              </section>
            )}

            <SeeAlso items={data.seeAlso} onPick={openUnit} />
          </section>
        </article>
      </div>
    </div>
  );
}
