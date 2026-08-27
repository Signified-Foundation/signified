"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CompactGraph } from "@/components/CompactGraph";
import { FolioMast } from "@/components/FolioMast";
import type {
  ResearchPayload,
  ResearchReview,
  ResearchSeeAlso,
  ResearchWriter,
  TrialId,
} from "@/lib/research";
import { useActorSession } from "@/lib/useActorSession";

function stanceLabel(stance: string) {
  return stance.charAt(0).toUpperCase() + stance.slice(1);
}

function Hatnote({ children }: { children: ReactNode }) {
  return (
    <aside className="rs-hatnote" aria-label="Disambiguation">
      {children}
    </aside>
  );
}

function SeeAlso({ items }: { items: ResearchSeeAlso[] }) {
  if (items.length === 0) return null;

  return (
    <nav className="rs-also" aria-labelledby="rs-also-title">
      <p className="kicker" id="rs-also-title">
        See also
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link href={item.href}>{item.label}</Link>
            <span>{item.lemma}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function QuestionHatnote({
  writer,
  output,
  hatnote,
}: {
  writer: string;
  output: string;
  hatnote: ResearchPayload["hatnote"];
}) {
  const sameSea = /black sea/i.test(output);

  return (
    <Hatnote>
      This answer is {writer} on this question.{" "}
      {sameSea ? (
        <>For the continuation that also wrote “Black Sea,” see </>
      ) : (
        <>
          For the continuation where Georgia was read as country versus
          name-token, see{" "}
        </>
      )}
      <Link href={hatnote.href}>{hatnote.label}</Link>
      . That trial is not this one.
    </Hatnote>
  );
}

function Reviews({
  writer,
  reviews,
  questionHref,
}: {
  writer: string;
  reviews: ResearchReview[];
  questionHref: string;
}) {
  return (
    <section className="rs-reviews" aria-label="Reviews">
      <p className="kicker">Reviews · {writer}</p>
      <ol className="thread">
        {reviews.length === 0 && (
          <li className="quiet">No reviews yet</li>
        )}
        {reviews.map((item) => (
          <li key={item.id} className="thread-item">
            <p className="thread-who">
              <strong>{item.author}</strong>
              <span>{stanceLabel(item.stance)}</span>
            </p>
            <p className="thread-body">{item.text}</p>
          </li>
        ))}
      </ol>
      <p className="rs-review-go">
        <Link href={questionHref} className="btn-field">
          Review
        </Link>
      </p>
    </section>
  );
}

export function ResearchDemo({ data }: { data: ResearchPayload }) {
  const { session, actor, leave, handleCreate, handleSetImage } =
    useActorSession();
  const [trial, setTrial] = useState<TrialId>("question");
  const [selectedId, setSelectedId] = useState(data.writers[0]?.id ?? 0);
  const selected: ResearchWriter =
    data.writers.find((run) => run.id === selectedId) ?? data.writers[0];

  return (
    <div className="folio is-paper">
      <FolioMast
        current="research"
        actor={actor}
        onCreate={session ? handleCreate : undefined}
        onLeave={session ? leave : undefined}
        onSetImage={session && actor ? handleSetImage : undefined}
      />

      <div className="rs-stage">
        <article className="rs-page">
          <header className="rs-head">
            <p className="kicker">Research</p>
            <h1 className="rs-title">This trial, or a related one</h1>
          </header>

          <div className="rs-trials" role="group" aria-label="Trial">
            <button
              type="button"
              aria-pressed={trial === "question"}
              className={trial === "question" ? "is-current" : undefined}
              onClick={() => setTrial("question")}
            >
              This question
            </button>
            <button
              type="button"
              aria-pressed={trial === "lead"}
              className={trial === "lead" ? "is-current" : undefined}
              onClick={() => setTrial("lead")}
            >
              Continuation
            </button>
          </div>

          {trial === "question" && selected && (
            <>
              <p className="kicker">Question</p>
              <h2 className="rs-prompt">{data.question.text}</h2>

              <div
                className="q-picks"
                role="radiogroup"
                aria-label="Writers"
              >
                {data.writers.map((run, index) => {
                  const on = selected.id === run.id;
                  const count = run.reviews.length;
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
              />
              <CompactGraph
                key={selected.id}
                runId={selected.id}
                writer={selected.writer}
                graph={selected.graph}
              />
              <Reviews
                writer={selected.writer}
                reviews={selected.reviews}
                questionHref={data.question.href}
              />
              <SeeAlso items={data.seeAlso} />
            </>
          )}

          {trial === "lead" && (
            <>
              <p className="kicker">Continuation</p>
              <h2 className="rs-prompt">{data.lead.prompt}</h2>
              <Hatnote>
                This article is about Gemma’s continuation “Georgia is a
                country…” → Black Sea. For the question, see{" "}
                <Link href={data.question.href}>{data.question.text}</Link>
                . Same output string is not the same trial.
              </Hatnote>
              <p className="rs-wrote">
                <span>Wrote</span>
                <strong>{data.lead.output}</strong>
              </p>
              <CompactGraph
                key={data.lead.id}
                runId={data.lead.id}
                writer={data.lead.writer}
                graph={data.lead.graph}
              />
            </>
          )}
        </article>
      </div>
    </div>
  );
}
