"use client";

import { FormEvent, useMemo, useState } from "react";
import { createChallenge, createClaim, createEvidence } from "@/lib/api";
import { articleCopy } from "@/lib/articles";
import { kindPhrase, readingByline, resolveUser } from "@/lib/profile";
import { meaningClaim } from "@/lib/session";
import type {
  Claim,
  Evidence,
  EvidencePayload,
  Feature,
  Session,
  User,
} from "@/lib/types";
import { ProfileAvatar } from "@/components/ProfileAvatar";

type Props = {
  session: Session;
  actor?: User;
  feature: Feature | null;
  claim: Claim | undefined;
  onSession: (session: Session) => void;
  composeClaim: boolean;
  composeChallenge: boolean;
  composeEvidence: boolean;
  onComposeClaim: (open: boolean) => void;
  onComposeChallenge: (open: boolean) => void;
  onComposeEvidence: (open: boolean) => void;
  onRetractChallenge?: (challengeId: number) => void;
  part?: "readings" | "evidence";
};

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
  const author = resolveUser(users, item.author_id);
  const a = item.result.condition_a;
  const b = item.result.condition_b;
  const stance = item.stance === "challenges" ? "Challenges the claim." : "Supports the claim.";
  const kind = item.intervention
    ? "This was an intervention."
    : "This is correlational, not causal.";

  return (
    <article className="evidence">
      <h4>{item.experiment_name}</h4>
      <p className="reading-who">
        <ProfileAvatar user={author} size="s" />
        {author.name}, {kindPhrase(author)}
      </p>
      <p>
        {author.name} compared {a.name} with {b.name}. The feature was{" "}
        {howActive(a.value)} on the first and {howActive(b.value)} on the
        second. {stance} {kind}
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
  composeClaim,
  composeChallenge,
  composeEvidence,
  onComposeClaim,
  onComposeChallenge,
  onComposeEvidence,
  onRetractChallenge,
  part = "evidence",
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const suggested: EvidencePayload = useMemo(
    () => ({
      author_id: actor?.id ?? 0,
      stance: "supports",
      experiment_name: "Contrastive: category vs matched unrelated nouns",
      notes: "Compare activation on the claimed category versus matched unrelated nouns.",
      condition_a_name: "claimed category",
      condition_a_value: 0,
      condition_b_name: "unrelated nouns",
      condition_b_value: 0,
      n: 1,
      intervention: false,
    }),
    [actor?.id],
  );

  async function onClaim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!feature || !actor) return;
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
      onComposeClaim(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save claim");
    } finally {
      setPending(false);
    }
  }

  async function onEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!claim || !actor) return;
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
      onComposeEvidence(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save evidence");
    } finally {
      setPending(false);
    }
  }

  async function onContest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!claim || !actor) return;
    const form = event.currentTarget;
    const alternative_text = String(
      new FormData(form).get("alternative_text") ?? "",
    );
    setPending(true);
    setError(null);
    try {
      const next = await createChallenge(claim.id, {
        author_id: actor.id,
        alternative_text,
      });
      onSession(next);
      onComposeChallenge(false);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save reading");
    } finally {
      setPending(false);
    }
  }

  if (!feature) return null;

  const meaning = meaningClaim(session, feature.id) ?? claim;
  const support = meaning?.evidence.filter((e) => e.stance === "supports") ?? [];
  const contest = meaning?.evidence.filter((e) => e.stance === "challenges") ?? [];
  const copy = articleCopy(feature.feature_id);

  if (part === "readings") {
    const contests = meaning?.challenges ?? [];
    const first = meaning
      ? resolveUser(session.users, meaning.author_id)
      : null;
    return (
      <section id="readings" className="claim-read">
        <p className="kicker">Read · not facts</p>
        {meaning && first ? (
          <div className="reading-pair">
            <div className="reading">
              <p className="reading-who">
                <ProfileAvatar user={first} size="s" />
                {first.name}, {readingByline(first, "first")}
              </p>
              <p>{copy.claim ?? meaning.text}</p>
            </div>
            {contests.map((item) => {
              const who = resolveUser(session.users, item.author_id);
              return (
                <div className="reading" key={item.id}>
                  <p className="reading-who">
                    <ProfileAvatar user={who} size="s" />
                    {who.name}, {readingByline(who, "other")}
                  </p>
                  <p>{item.alternative_text}</p>
                  {actor && item.author_id === actor.id && onRetractChallenge && (
                    <button
                      type="button"
                      className="comment-reply"
                      onClick={() => onRetractChallenge(item.id)}
                    >
                      Retract
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>
            No reading has been proposed. The graph is an observation. A person
            has to say what they think this unit is doing.
          </p>
        )}
        <div className="actions">
          {!actor ? (
            <a href="#login" className="text-link">
              Enter to file a reading
            </a>
          ) : !meaning ? (
            <button
              type="button"
              className="text-link"
              onClick={() => onComposeClaim(true)}
            >
              File a reading as {actor.name}
            </button>
          ) : (
            <button
              type="button"
              className="text-link"
              onClick={() => onComposeChallenge(true)}
            >
              File another reading as {actor.name}
            </button>
          )}
        </div>
        {actor?.kind === "agent" && (
          <p className="quiet">
            Filing as an agent. This reading is not evidence.
          </p>
        )}
        {error && <p className="form-error">{error}</p>}
        {composeClaim && (
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
                onClick={() => onComposeClaim(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {composeChallenge && meaning && (
          <form className="compose" onSubmit={onContest}>
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
                onClick={() => onComposeChallenge(false)}
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
              {!actor ? (
                <a href="#login" className="text-link">
                  Enter to attach evidence
                </a>
              ) : actor.kind === "agent" ? (
                <p className="quiet">
                  An agent cannot attach evidence.{" "}
                  <a href="/profiles" className="text-link">
                    Enter as a person
                  </a>
                  .
                </p>
              ) : (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => onComposeEvidence(true)}
                >
                  Attach evidence as {actor.name}
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="quiet">Evidence attaches to a reading.</p>
        )}
        {error && <p className="form-error">{error}</p>}
        {composeEvidence && claim && actor?.kind === "person" && (
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
                onClick={() => onComposeEvidence(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
  );
}
