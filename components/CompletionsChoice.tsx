"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
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
  const sameOutput =
    writers.length > 1 && writers.every((run) => run.output === writers[0].output);
  const [selectedId, setSelectedId] = useState(
    mine?.chosen_run_id ?? graphRunId,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected =
    writers.find((run) => run.id === selectedId) ?? writers[0] ?? null;
  const alreadyThis = Boolean(selected && mine?.chosen_run_id === selected.id);
  const selectedTally = selected
    ? choiceTally(session, prompt, selected.id)
    : 0;

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
    if (alreadyThis) return `Voted for this response${actor ? ` as ${actor.name}` : ""}`;
    if (mine) return "Change vote to this response";
    return "Vote for this response";
  }

  return (
    <section id="choice" className="choice-block" aria-label="Completions">
      <p className="kicker">Completions · first order</p>
      <p className="choice-lead">
        Pick a writer, then vote. A vote is a preference for a response, not a
        reading of this unit.
      </p>

      {selected && (
        <form className="choice-form" onSubmit={onVote}>
          <label>
            Model completion
            <select
              name="run_id"
              value={selected.id}
              onChange={(event) => setSelectedId(Number(event.target.value))}
            >
              {writers.map((run) => {
                const name = modelNameOf(session, run.model_id) ?? "Writer";
                const graph = run.id === graphRunId ? " · this graph" : "";
                return (
                  <option key={run.id} value={run.id}>
                    {name} — {run.output}
                    {graph}
                  </option>
                );
              })}
            </select>
          </label>

          <dl className="run-did-pair is-preview">
            <div className="is-wrote">
              <dt>Wrote</dt>
              <dd>{selected.output}</dd>
            </div>
          </dl>
          <p className="choice-meta">
            {modelNameOf(session, selected.model_id)}
            {selected.id === graphRunId ? " · this graph" : " · no graph"}
            {" · "}
            {selectedTally === 0
              ? "no votes yet"
              : `${selectedTally} ${selectedTally === 1 ? "vote" : "votes"}`}
          </p>

          {!actor && canChoose && (
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
                {actor?.name} voted for{" "}
                {modelNameOf(
                  session,
                  writers.find((run) => run.id === mine.chosen_run_id)?.model_id ??
                    0,
                )}
                .
              </p>
            )}
          </div>
        </form>
      )}

      {writers.length > 1 && (
        <ul className="choice-tally">
          {writers.map((run) => (
            <li key={run.id}>
              {modelNameOf(session, run.model_id)}
              <span>{choiceTally(session, prompt, run.id)}</span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="form-error">{error}</p>}
      <p className="choice-note">
        {canChoose ? (
          <>
            A tally is not evidence.
            {sameOutput ? " Both of these writers wrote the same word." : ""} The
            graph on the right measures one run. The other model is another
            writer, not the same feature.
          </>
        ) : (
          <>
            A vote needs two writers on this lead. This one has a single writer.
            The Iliad line has two:{" "}
            <Link href="/wiki/feature-2104" className="text-link">
              wrath / Feature 2104
            </Link>
            .
          </>
        )}
      </p>
    </section>
  );
}
