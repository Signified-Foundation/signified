"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CompactGraph } from "@/components/CompactGraph";
import { FolioMast } from "@/components/FolioMast";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { createReview, signIn } from "@/lib/api";
import { MODELS, RUNS } from "@/lib/models";
import {
  catalogFeature,
  featureHref,
  HATNOTE_FEATURE_ID,
  seeAlsoForTrial,
} from "@/lib/research";
import { resolveUser } from "@/lib/profile";
import {
  graphOf,
  modelNameOf,
  reviewsForRun,
  writerRunsForQuestion,
} from "@/lib/session";
import type { Question, ReviewStance, User } from "@/lib/types";
import { useActorSession } from "@/lib/useActorSession";

const STANCES: { id: ReviewStance; label: string }[] = [
  { id: "agrees", label: "Agrees" },
  { id: "contests", label: "Contests" },
  { id: "incomplete", label: "Incomplete" },
];

function when(iso: string) {
  const date = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function stanceLabel(stance: ReviewStance) {
  return STANCES.find((item) => item.id === stance)?.label ?? stance;
}

export function QuestionReview({ question }: { question: Question }) {
  const {
    session,
    setSession,
    actor,
    become,
    leave,
    handleCreate,
    handleSetImage,
    loadError,
  } = useActorSession();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [stance, setStance] = useState<ReviewStance>("contests");
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const writers = session
    ? writerRunsForQuestion(session, question.text)
    : RUNS.filter(
        (run) =>
          run.prompt === question.text &&
          (run.prompt_kind ?? "lead") === "question",
      );
  const selected =
    writers.find((run) => run.id === selectedId) ?? writers[0] ?? null;
  const reviews = session && selected ? reviewsForRun(session, selected.id) : [];
  const mine =
    actor && selected && session
      ? reviewsForRun(session, selected.id).find(
          (item) => item.author_id === actor.id,
        )
      : undefined;
  const graph =
    session && selected ? (graphOf(session, selected.id) ?? null) : null;
  const hatnote = catalogFeature(HATNOTE_FEATURE_ID);
  const seeAlso = seeAlsoForTrial("question");
  const sameSea = selected ? /black sea/i.test(selected.output) : false;

  function writerLabel(modelId: number) {
    if (session) return modelNameOf(session, modelId) ?? "Writer";
    return MODELS.find((item) => item.id === modelId)?.name ?? "Writer";
  }

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

  const banner = error ?? loadError;

  return (
    <div className="folio is-paper">
      <FolioMast
        current="question"
        actor={actor}
        onCreate={session ? handleCreate : undefined}
        onLeave={session ? leave : undefined}
        onSetImage={session && actor ? handleSetImage : undefined}
      />
      <div className="rs-stage">
        <article className="rs-page">
          <header className="rs-head">
            <p className="kicker">Question</p>
            <h1 className="rs-title">{question.text}</h1>
          </header>

          {banner && <p className="form-error">{banner}</p>}

          <div className="q-picks" role="radiogroup" aria-label="Writers">
            {writers.map((run, index) => {
              const active = selected?.id === run.id;
              const count = session
                ? reviewsForRun(session, run.id).length
                : 0;
              return (
                <label
                  key={run.id}
                  className={`q-pick${active ? " is-selected" : ""}${
                    index % 2 ? " is-alt" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="completion"
                    checked={active}
                    onChange={() => setSelectedId(run.id)}
                  />
                  <span className="q-pick-writer">
                    {writerLabel(run.model_id)}
                  </span>
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

          {selected && (
            <aside className="rs-hatnote" aria-label="Disambiguation">
              This answer is {writerLabel(selected.model_id)} on this question.{" "}
              {sameSea ? (
                <>The continuation that also wrote “Black Sea” is </>
              ) : (
                <>The continuation on Georgia as country and as name is </>
              )}
              <Link href={featureHref(HATNOTE_FEATURE_ID)}>
                {hatnote?.label ?? `Feature ${HATNOTE_FEATURE_ID}`}
              </Link>
              .
            </aside>
          )}

          {selected && (
            <CompactGraph
              key={selected.id}
              runId={selected.id}
              writer={writerLabel(selected.model_id)}
              graph={graph}
            />
          )}

          {selected && (
            <section className="rs-reviews" aria-label="Reviews">
              <p className="kicker">
                Reviews · {writerLabel(selected.model_id)}
              </p>
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
                  <label>
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
              </form>

              <ol className="thread">
                {reviews.length === 0 && (
                  <li className="quiet">No reviews yet</li>
                )}
                {session &&
                  reviews.map((item) => {
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
                  })}
              </ol>
            </section>
          )}

          {seeAlso.length > 0 && (
            <nav className="rs-also" aria-labelledby="q-also">
              <p className="kicker" id="q-also">
                See also
              </p>
              <ul>
                {seeAlso.map((item) => (
                  <li key={item.id}>
                    <Link href={featureHref(item.id)}>{item.label}</Link>
                    <span>{item.lemma}</span>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>
      </div>
    </div>
  );
}
