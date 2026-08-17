"use client";

import { FormEvent, useState } from "react";
import { createComment } from "@/lib/api";
import type { Comment, Session } from "@/lib/types";

function nameOf(users: Session["users"], id: number) {
  return users.find((u) => u.id === id)?.name ?? `User ${id}`;
}

function when(iso: string) {
  const date = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function Talk({
  session,
  featurePk,
  actorId,
  onActor,
  onSession,
}: {
  session: Session;
  featurePk: number;
  actorId: number;
  onActor: (id: number) => void;
  onSession: (session: Session) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const comments =
    session.comments?.filter((c) => c.feature_pk === featurePk) ?? [];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const text = String(new FormData(form).get("text") ?? "");
    setPending(true);
    setError(null);
    try {
      const next = await createComment({
        feature_pk: featurePk,
        author_id: actorId,
        text,
      });
      onSession(next);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="talk" className="talk-section">
      <h2>
        Talk
        <span className="section-note">A comment is not evidence.</span>
      </h2>

      {comments.length === 0 && <p className="quiet">No comments yet.</p>}
      <ol className="comments">
        {comments.map((item: Comment) => (
          <li key={item.id}>
            <p>
              <span className="comment-meta">
                <strong>{nameOf(session.users, item.author_id)}</strong>
                <span>{when(item.created_at)}</span>
              </span>
              {item.text}
            </p>
          </li>
        ))}
      </ol>

      <form className="comment-form" onSubmit={onSubmit}>
        <div className="comment-bar">
          <div className="actors" role="group" aria-label="Comment as">
            <span>As</span>
            {session.users.map((user) => (
              <button
                key={user.id}
                type="button"
                className={user.id === actorId ? "is-active" : undefined}
                onClick={() => onActor(user.id)}
              >
                {user.name}
              </button>
            ))}
          </div>
          <button className="btn-solid" disabled={pending} type="submit">
            Post
          </button>
        </div>
        <textarea
          name="text"
          required
          minLength={2}
          rows={2}
          aria-label="Comment"
          placeholder="Write a comment"
        />
        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  );
}
