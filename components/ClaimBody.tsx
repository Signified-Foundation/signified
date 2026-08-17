"use client";

import { FormEvent, useMemo, useState } from "react";
import { createChallenge, createClaim, createEvidence } from "@/lib/api";
import { articleCopy } from "@/lib/articles";
import type {
  Claim,
  Evidence,
  EvidencePayload,
  Feature,
  Session,
  User,
} from "@/lib/types";

type Compose = "claim" | "challenge" | "evidence" | null;

type Props = {
  session: Session;
  actor: User;
  feature: Feature | null;
  claim: Claim | undefined;
  onSession: (session: Session) => void;
  onCompose: (compose: Compose) => void;
  compose: Compose;
  part?: "readings" | "evidence";
};

function nameOf(users: User[], id: number) {
  return users.find((u) => u.id === id)?.name ?? `User ${id}`;
}

function howActive(value: number) {
  if (value >= 0.7) return "active";
  if (value >= 0.4) return "mixed";
  if (value >= 0.2) return "weak";
  return "quiet";
}

function EvidenceEntry({
  item,
  users,
}: {
  item: Evidence;
  users: User[];
}) {
  const a = item.result.condition_a;
  const b = item.result.condition_b;
  const stance = item.stance === "challenges" ? "Challenges the claim." : "Supports the claim.";
  const kind = item.intervention
    ? "This was an intervention."
    : "This is correlational, not causal.";

  return (
    <article className="evidence">
      <h4>{item.experiment_name}</h4>
      <p>
        {nameOf(users, item.author_id)} compared {a.name} with {b.name}. The
        feature was {howActive(a.value)} on the first and {howActive(b.value)} on
        the second. {stance} {kind}
      </p>
      {item.notes && <p>{item.notes}</p>}
    </article>
  );
}

export function ClaimBody({
  session,
  actor,
  feature,
  claim,
  onSession,
  onCompose,
  compose,
  part = "evidence",
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const suggested: EvidencePayload = useMemo(
    () => ({
      author_id: actor.id,
      stance: "supports",
      experiment_name: "Contrastive: geographic entities vs unrelated nouns",
      notes: "Compare activation on place names versus matched unrelated nouns.",
      condition_a_name: "geographic entities",
      condition_a_value: 0,
      condition_b_name: "unrelated nouns",
      condition_b_value: 0,
      n: 1,
      intervention: false,
    }),
    [actor.id],
  );

  async function onClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!feature) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const next = await createClaim({
        feature_pk: feature.id,
        author_id: actor.id,
        text: String(form.get("text") ?? ""),
      });
      onSession(next);
      onCompose(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save claim");
    } finally {
      setPending(false);
    }
  }

  async function onChallenge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!claim) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const next = await createChallenge(claim.id, {
        author_id: actor.id,
        alternative_text: String(form.get("alternative_text") ?? ""),
      });
      onSession(next);
      onCompose(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save challenge");
    } finally {
      setPending(false);
    }
  }

  async function onEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!claim) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const next = await createEvidence(claim.id, {
        author_id: actor.id,
        stance: String(form.get("stance")) as "supports" | "challenges",
        experiment_name: String(form.get("experiment_name") ?? ""),
        notes: String(form.get("notes") ?? ""),
        condition_a_name: String(form.get("condition_a_name") ?? ""),
        condition_a_value: Number(form.get("condition_a_value")),
        condition_b_name: String(form.get("condition_b_name") ?? ""),
        condition_b_value: Number(form.get("condition_b_value")),
        n: Number(form.get("n") || 1),
        intervention: form.get("intervention") === "on",
      });
      onSession(next);
      onCompose(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save evidence");
    } finally {
      setPending(false);
    }
  }

  if (!feature) return null;

  const support = claim?.evidence.filter((e) => e.stance === "supports") ?? [];
  const contest = claim?.evidence.filter((e) => e.stance === "challenges") ?? [];
  const alternative = claim?.challenges[0];
  const copy = articleCopy(feature.feature_id);

  if (part === "readings") {
    return (
      <section id="readings" className="float-card is-read">
        <p className="kicker">Read</p>
        {claim ? (
          <>
            <div className="reading">
              <p className="reading-who">
                {nameOf(session.users, claim.author_id)} · a reading, not a fact
              </p>
              <p>{copy.claim ?? claim.text}</p>
            </div>
            {alternative && (
              <div className="reading">
                <p className="reading-who">
                  {nameOf(session.users, alternative.author_id)} · contest
                </p>
                <p>{copy.contest ?? alternative.alternative_text}</p>
              </div>
            )}
            {alternative && (
              <p className="section-note">
                Both remain. Neither has been retired.
              </p>
            )}
          </>
        ) : (
          <p>
            No reading has been proposed. The graph is an observation. A reading
            begins when someone says what they think this unit is doing.
          </p>
        )}
        <div className="actions">
          {!claim && (
            <button
              type="button"
              className="text-link"
              onClick={() => onCompose("claim")}
            >
              Propose a reading
            </button>
          )}
          {claim && (
            <button
              type="button"
              className="text-link"
              onClick={() => onCompose("challenge")}
            >
              Add another reading
            </button>
          )}
        </div>
        {error && <p className="form-error">{error}</p>}
        {compose === "claim" && (
          <form className="compose" onSubmit={onClaim}>
            <label>
              Interpretation
              <textarea
                name="text"
                required
                minLength={8}
                rows={3}
                placeholder="I think this feature represents…"
              />
            </label>
            <div className="form-row">
              <button className="btn-solid" disabled={pending} type="submit">
                Save
              </button>
              <button
                className="text-link"
                type="button"
                onClick={() => onCompose(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {compose === "challenge" && claim && (
          <form className="compose" onSubmit={onChallenge}>
            <label>
              Alternative reading
              <textarea
                name="alternative_text"
                required
                minLength={8}
                rows={3}
                placeholder="I think this is actually…"
              />
            </label>
            <div className="form-row">
              <button className="btn-solid" disabled={pending} type="submit">
                Save
              </button>
              <button
                className="text-link"
                type="button"
                onClick={() => onCompose(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    );
  }

  return (
    <section id="evidence">
      <h2>Evidence</h2>
        <p className="section-note">
          What was actually tried. Notes may accompany a result. They do not
          replace it. A model-generated explanation is not evidence.
        </p>
        {claim ? (
          <>
            {claim.evidence.length === 0 && <p className="quiet">None yet.</p>}
            {support.map((item) => (
              <EvidenceEntry key={item.id} item={item} users={session.users} />
            ))}
            {contest.map((item) => (
              <EvidenceEntry key={item.id} item={item} users={session.users} />
            ))}
            <div className="actions">
              <button
                type="button"
                className="text-link"
                onClick={() => onCompose("evidence")}
              >
                Attach evidence
              </button>
            </div>
          </>
        ) : (
          <p className="quiet">Evidence attaches to a reading.</p>
        )}
        {error && <p className="form-error">{error}</p>}
        {compose === "evidence" && claim && (
          <form className="compose" onSubmit={onEvidence}>
            <p>
              Store a numerical result. Do not attach an explanation from
              another model as evidence.
            </p>
            <label>
              Experiment
              <input
                name="experiment_name"
                required
                defaultValue={suggested.experiment_name}
              />
            </label>
            <label>
              Stance
              <select name="stance" defaultValue="supports">
                <option value="supports">Supports the claim</option>
                <option value="challenges">Challenges the claim</option>
              </select>
            </label>
            <div className="form-grid">
              <label>
                Condition A
                <input
                  name="condition_a_name"
                  required
                  defaultValue={suggested.condition_a_name}
                />
              </label>
              <label>
                Rate A
                <input
                  name="condition_a_value"
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  required
                />
              </label>
              <label>
                Condition B
                <input
                  name="condition_b_name"
                  required
                  defaultValue={suggested.condition_b_name}
                />
              </label>
              <label>
                Rate B
                <input
                  name="condition_b_value"
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  required
                />
              </label>
              <label>
                n
                <input name="n" type="number" min={1} defaultValue={1} />
              </label>
              <label className="check">
                <input name="intervention" type="checkbox" />
                This was a causal intervention
              </label>
            </div>
            <label>
              Notes
              <textarea name="notes" rows={2} defaultValue={suggested.notes} />
            </label>
            <div className="form-row">
              <button className="btn-solid" disabled={pending} type="submit">
                Store result
              </button>
              <button
                className="text-link"
                type="button"
                onClick={() => onCompose(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
  );
}
