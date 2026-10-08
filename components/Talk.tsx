"use client";

import { FormEvent, type ReactNode, useState } from "react";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { createComment, signIn } from "@/lib/api";
import { resolveUser } from "@/lib/profile";
import type { Comment, Session, User } from "@/lib/types";

function when(iso: string) {
  const date = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function Thread({
  comments,
  parentId,
  parentAuthor,
  users,
  actorId,
  replyTo,
  onReply,
  onRetract,
  replyForm,
}: {
  comments: Comment[];
  parentId: number | null;
  parentAuthor?: string;
  users: Session["users"];
  actorId: number | null;
  replyTo: number | null;
  onReply: (id: number | null) => void;
  onRetract?: (id: number) => void;
  replyForm: ReactNode;
}) {
  const kids = comments.filter((item) => (item.parent_id ?? null) === parentId);
  if (kids.length === 0) return null;

  return (
    <ol className={parentId == null ? "thread" : "thread is-nested"}>
      {kids.map((item) => {
        const who = resolveUser(users, item.author_id);
        return (
          <li key={item.id} className="thread-item">
            <p className="thread-who">
              <ProfileAvatar user={who} size="s" />
              <strong>{who.name}</strong>
              {who.kind === "agent" ? <span>adds context</span> : null}
              {parentAuthor ? <span>to {parentAuthor}</span> : null}
              <span>{when(item.created_at)}</span>
            </p>
            <p className="thread-body">{item.text}</p>
            <button
              type="button"
              className="comment-reply"
              onClick={() => onReply(replyTo === item.id ? null : item.id)}
            >
              {replyTo === item.id ? "Cancel" : "Reply"}
            </button>
            {item.author_id === actorId && onRetract && (
              <button
                type="button"
                className="comment-reply"
                onClick={() => onRetract(item.id)}
              >
                Retract
              </button>
            )}
            {replyTo === item.id && replyForm}
            <Thread
              comments={comments}
              parentId={item.id}
              parentAuthor={who.name}
              users={users}
              actorId={actorId}
              replyTo={replyTo}
              onReply={onReply}
              onRetract={onRetract}
              replyForm={replyForm}
            />
          </li>
        );
      })}
    </ol>
  );
}

export function Talk({
  session,
  featurePk,
  actorId,
  onSession,
  onBecome,
  onRetractComment,
  title = "Talk",
  lead,
  variant = "talk",
}: {
  session: Session;
  featurePk: number;
  actorId: number | null;
  onSession: (session: Session) => void;
  onBecome?: (user: User) => void;
  onRetractComment?: (id: number) => void;
  title?: string;
  lead?: string;
  variant?: "talk" | "anti";
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const comments =
    session.comments?.filter((c) => c.feature_pk === featurePk) ?? [];
  const replyParent = comments.find((item) => item.id === replyTo);
  const actor = actorId != null ? resolveUser(session.users, actorId) : null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const text = String(new FormData(form).get("text") ?? "");
    const typed = String(new FormData(form).get("name") ?? "");
    setPending(true);
    setError(null);
    try {
      let user = actor ?? undefined;
      if (!user) {
        const signed = await signIn(typed);
        user = signed.user;
        onSession(signed.session);
        onBecome?.(user);
      }
      const next = await createComment({
        feature_pk: featurePk,
        author_id: user.id,
        text,
        parent_id: replyTo,
      });
      onSession(next);
      form.reset();
      setReplyTo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post");
    } finally {
      setPending(false);
    }
  }

  const commentForm = (
    <form className="comment-form" onSubmit={onSubmit}>
      <div className="comment-bar">
        <p className="actors">
          {actor ? (
            <>
              <ProfileAvatar user={actor} size="s" />
              As {actor.name}
            </>
          ) : (
            "As a person"
          )}
        </p>
        <button className="btn-solid" disabled={pending} type="submit">
          {replyTo ? "Continue" : variant === "anti" ? "Add" : "Post"}
        </button>
      </div>
      {replyParent && actor && (
        <p className="comment-replying">
          {actor.name} replying to{" "}
          {resolveUser(session.users, replyParent.author_id).name}
        </p>
      )}
      {actor?.kind === "agent" && (
        <p className="quiet">Agent · adds context, not evidence</p>
      )}
      {!actor && (
        <label>
          Name
          <input
            name="name"
            required
            minLength={2}
            maxLength={40}
            autoComplete="nickname"
            placeholder="Your name"
          />
        </label>
      )}
      <textarea
        name="text"
        required
        minLength={2}
        rows={2}
        aria-label={
          replyTo
            ? "Continue"
            : variant === "anti"
              ? "Add to the reading"
              : "Comment"
        }
        placeholder={
          replyTo
            ? "Continue this thread"
            : variant === "anti"
              ? "Add to the reading"
              : "Write a comment"
        }
      />
      {error && <p className="form-error">{error}</p>}
    </form>
  );

  return (
    <section
      id="talk"
      className={`talk-section${variant === "anti" ? " is-anti" : ""}`}
    >
      <h2>{title}</h2>
      {lead ? <p className="talk-lead">{lead}</p> : null}

      <div id="thread" className="talk-thread">
        {comments.length === 0 && <p className="quiet">No comments yet</p>}
        <Thread
          comments={comments}
          parentId={null}
          users={session.users}
          actorId={actorId}
          replyTo={replyTo}
          onReply={setReplyTo}
          onRetract={onRetractComment}
          replyForm={commentForm}
        />
        {replyTo == null && commentForm}
      </div>
    </section>
  );
}
