"use client";

import { useState } from "react";
import Link from "next/link";
import { createChoice } from "@/lib/api";
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
}: {
  session: Session;
  actor: User;
  prompt: string;
  graphRunId: number;
  onSession: (session: Session) => void;
}) {
  const writers = writerRunsForPrompt(session, prompt);
  const choices = choicesForPrompt(session, prompt);
  const mine = choices.find((item) => item.author_id === actor.id);
  const canChoose = writers.length >= 2;
  const sameOutput =
    writers.length > 1 && writers.every((run) => run.output === writers[0].output);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function prefer(runId: number) {
    if (!canChoose) return;
    setPending(true);
    setError(null);
    try {
      onSession(
        await createChoice({
          author_id: actor.id,
          prompt,
          chosen_run_id: runId,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record choice");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="choice" className="choice-block" aria-label="Completions">
      <p className="kicker">Completions · first order</p>
      <p className="choice-lead">
        One lead. {writers.length === 1 ? "One writer." : `${writers.length} writers.`} A
        choice is a vote on a response, not a reading of the feature.
      </p>
      <ul className="choice-list">
        {writers.map((run) => {
          const name = modelNameOf(session, run.model_id) ?? "Writer";
          const tally = choiceTally(session, prompt, run.id);
          const selected = mine?.chosen_run_id === run.id;
          const hasGraph = run.id === graphRunId;
          return (
            <li key={run.id} className={selected ? "is-chosen" : undefined}>
              <p className="choice-writer">
                {name}
                {hasGraph ? " · this graph" : " · no graph"}
              </p>
              <p className="choice-output">{run.output}</p>
              <p className="choice-meta">
                {tally === 0
                  ? "No choices yet"
                  : `${tally} ${tally === 1 ? "choice" : "choices"}`}
                {selected ? ` · ${actor.name} prefers this` : ""}
              </p>
              {canChoose && (
                <button
                  type="button"
                  className={selected ? "btn-solid" : "text-link"}
                  disabled={pending || selected}
                  onClick={() => prefer(run.id)}
                >
                  {selected
                    ? `Preferred as ${actor.name}`
                    : `Prefer this response as ${actor.name}`}
                </button>
              )}
            </li>
          );
        })}
      </ul>
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
            A choice needs two writers on this lead. This one has a single
            writer. The Iliad line has two:{" "}
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
