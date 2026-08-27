"use client";

import { FormEvent, useState } from "react";
import { createChoice, signIn } from "@/lib/api";
import {
  choiceTally,
  choicesForPrompt,
  modelNameOf,
  writerRunsForPrompt,
} from "@/lib/session";
import type { Session, User } from "@/lib/types";

export function CompletionsChoice({
  session,
  actor,
  prompt,
  graphRunId,
  onSession,
  onActor,
}: {
  session: Session;
  actor?: User;
  prompt: string;
  graphRunId: number;
  onSession: (session: Session) => void;
  onActor: (user: User) => void;
}) {
  const writers = writerRunsForPrompt(session, prompt);
  const choices = choicesForPrompt(session, prompt);
  const mine = actor
    ? choices.find((item) => item.author_id === actor.id)
    : undefined;
  const canChoose = writers.length >= 2;
  const [selectedId, setSelectedId] = useState(
    mine?.chosen_run_id ?? graphRunId,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected =
    writers.find((run) => run.id === selectedId) ?? writers[0] ?? null;
  const alreadyThis = Boolean(selected && mine?.chosen_run_id === selected.id);

  async function onVote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !canChoose) return;
    const form = event.currentTarget;
    const typed = String(new FormData(form).get("name") ?? "");
    setPending(true);
    setError(null);
    try {
      let user = actor;
      if (!user) {
        const signed = await signIn(typed);
        user = signed.user;
        onSession(signed.session);
        onActor(user);
      }
      onSession(
        await createChoice({
          author_id: user.id,
          prompt,
          chosen_run_id: selected.id,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record vote");
    } finally {
      setPending(false);
    }
  }

  function voteLabel() {
    if (!canChoose) return "Needs two writers";
    if (alreadyThis) return "Voted";
    if (mine) return "Change vote";
    return "Vote";
  }

  return (
    <section id="choice" className="choice-block" aria-label="Completions">
      <p className="kicker">Completions</p>

      <div className="q-picks" role="radiogroup" aria-label="Writers">
        {writers.map((run, index) => {
          const on = selected?.id === run.id;
          const tally = choiceTally(session, prompt, run.id);
          const name = modelNameOf(session, run.model_id) ?? "Writer";
          return (
            <label
              key={run.id}
              className={`q-pick${on ? " is-selected" : ""}${
                index % 2 ? " is-alt" : ""
              }`}
            >
              <input
                type="radio"
                name="choice-run"
                checked={on}
                onChange={() => setSelectedId(run.id)}
              />
              <span className="q-pick-writer">{name}</span>
              <span className="q-pick-output">{run.output}</span>
              <span className="q-pick-meta">
                Run {run.id}
                {run.id === graphRunId ? " · this graph" : ""}
                {tally === 0
                  ? " · no votes"
                  : ` · ${tally} ${tally === 1 ? "vote" : "votes"}`}
              </span>
            </label>
          );
        })}
      </div>

      {selected && (
        <form className="choice-form" onSubmit={onVote}>
          {!actor && canChoose && (
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

          <div className="choice-vote">
            <button
              className="btn-solid"
              type="submit"
              disabled={pending || !canChoose || alreadyThis}
            >
              {voteLabel()}
            </button>
            {mine && (
              <p className="choice-cast">
                {actor?.name} ·{" "}
                {modelNameOf(
                  session,
                  writers.find((run) => run.id === mine.chosen_run_id)
                    ?.model_id ?? 0,
                )}
              </p>
            )}
          </div>
        </form>
      )}

      {error && <p className="form-error">{error}</p>}
    </section>
  );
}
