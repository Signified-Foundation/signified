"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { FolioMast } from "@/components/FolioMast";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { createReview, signIn } from "@/lib/api";
import { MODELS, RUNS } from "@/lib/models";
import { kindPhrase, resolveUser } from "@/lib/profile";
import {
  modelNameOf,
  reviewsForRun,
  writerRunsForQuestion,
} from "@/lib/session";
import type { Question, ReviewStance, User } from "@/lib/types";
import { useActorSession } from "@/lib/useActorSession";
import { featureSlug } from "@/lib/wiki";

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
      <div className="q-stage">
        <article className="q-page">
          <header className="q-head">
            <p className="kicker">Question · pick a completion</p>
            <h1 className="q-title">{question.text}</h1>
            <p className="q-dek">
              Two writers answered. Choose one, then review that answer. This is
              not a reading of a unit.
            </p>
          </header>

          {banner && <p className="form-error">{banner}</p>}

          <div
            className="q-picks"
            role="radiogroup"
            aria-label="Completions"
          >
            {writers.map((run) => {
              const active = selected?.id === run.id;
              const count = session
                ? reviewsForRun(session, run.id).length
                : 0;
              return (
                <label
                  key={run.id}
                  className={`q-pick${active ? " is-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="completion"
                    checked={active}
                    onChange={() => setSelectedId(run.id)}
                  />
                  <span className="q-pick-writer">{writerLabel(run.model_id)}</span>
                  <span className="q-pick-output">{run.output}</span>
                  <span className="q-pick-meta">
                    {count === 0
                      ? "No reviews yet"
                      : `${count} ${count === 1 ? "review" : "reviews"}`}
                  </span>
                </label>
              );
            })}
          </div>

          {selected && (
            <section className="q-review" aria-label="Review this answer">
              <p className="kicker">Review this answer</p>
              <p className="q-review-who">
                {writerLabel(selected.model_id)} wrote this. A review is of the
                completion, not of a feature.
              </p>

                  <form className="compose q-form" onSubmit={onReview}>
                    <fieldset className="q-stances">
                      <legend>Stance</legend>
                      {STANCES.map((item) => (
                        <label key={item.id}>
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
                      Your reading of this answer
                      <textarea
                        name="text"
                        required
                        minLength={8}
                        maxLength={500}
                        rows={3}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="What does this completion get right or wrong?"
                      />
                    </label>

                    {!actor && (
                      <label>
                        Your name
                        <input
                          name="name"
                          required
                          minLength={2}
                          maxLength={40}
                          autoComplete="nickname"
                          placeholder="What should we call you?"
                        />
                      </label>
                    )}

                    <button
                      className="btn-solid"
                      type="submit"
                      disabled={pending || !session}
                    >
                      {mine
                        ? `Update review${actor ? ` as ${actor.name}` : ""}`
                        : "Review this answer"}
                    </button>
                  </form>

                  <ol className="q-reviews">
                    {reviews.length === 0 && (
                      <li className="quiet">No reviews of this answer yet.</li>
                    )}
                    {session &&
                      reviews.map((item) => {
                        const who = resolveUser(session.users, item.author_id);
                        return (
                          <li key={item.id}>
                            <p className="thread-who">
                              <ProfileAvatar user={who} size="s" />
                              <strong>{who.name}</strong>
                              <span>{kindPhrase(who)}</span>
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

          <p className="q-next">
            The unit this question is not about lives on a feature page.{" "}
            <Link href={`/wiki/${featureSlug(3102)}`} className="text-link">
              Open Georgia
            </Link>
            {" · "}
            <Link href="/articles" className="text-link">
              All articles
            </Link>
          </p>
        </article>
      </div>
    </div>
  );
}
