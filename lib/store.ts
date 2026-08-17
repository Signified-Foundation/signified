import { SEED } from "@/lib/seed";
import type {
  Claim,
  ClaimPayload,
  EvidencePayload,
  Session,
} from "@/lib/types";

const STORAGE_KEY = "signified.session.v6";

function clone<T>(value: T): T {
  return structuredClone(value);
}

function nextId(items: { id: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function stamp() {
  return new Date().toISOString();
}

function refreshClaim(claim: Claim): Claim {
  const support_n = claim.evidence.filter((item) => item.stance === "supports")
    .length;
  const contest_n = claim.evidence.filter((item) => item.stance === "challenges")
    .length;
  const status =
    contest_n || claim.challenges.length
      ? "contested"
      : support_n
        ? "supported"
        : "unresolved";
  return { ...claim, support_n, contest_n, status };
}

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== "object") return false;
  const session = value as Session;
  return Boolean(
    Array.isArray(session.models) &&
      Array.isArray(session.runs) &&
      session.graphs &&
      Array.isArray(session.scores) &&
      Array.isArray(session.users) &&
      Array.isArray(session.features) &&
      Array.isArray(session.claims) &&
      Array.isArray(session.comments) &&
      Array.isArray(session.choices),
  );
}

function load(): Session {
  if (typeof window === "undefined") return clone(SEED);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(SEED);
    const parsed: unknown = JSON.parse(raw);
    if (!isSession(parsed)) return clone(SEED);
    return parsed;
  } catch {
    return clone(SEED);
  }
}

function save(session: Session): Session {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return session;
}

function fail(message: string): never {
  throw new Error(message);
}

export async function getSession(): Promise<Session> {
  return load();
}

export async function createClaim(body: ClaimPayload): Promise<Session> {
  const kind = body.kind ?? "meaning";
  const weight =
    kind === "weight" ? Number(body.weight) : null;
  const text = body.text.trim();
  if (kind === "weight") {
    if (weight == null || Number.isNaN(weight) || weight < 0 || weight > 1) {
      fail("Weight must be a number between 0 and 1");
    }
  }
  if (text.length < 8 || text.length > 500) {
    fail("Claim must be between 8 and 500 characters");
  }
  const session = load();
  const feature = session.features.find((item) => item.id === body.feature_pk);
  if (!feature) fail("Feature not found");
  if (
    kind === "meaning" &&
    session.claims.some(
      (item) => item.feature_pk === body.feature_pk && item.kind !== "weight",
    )
  ) {
    fail("This feature already has a reading");
  }
  session.claims.push({
    id: nextId(session.claims),
    feature_pk: body.feature_pk,
    run_id: feature.run_id,
    author_id: body.author_id,
    kind,
    weight: kind === "weight" ? weight : null,
    text,
    status: "unresolved",
    created_at: stamp(),
    challenges: [],
    evidence: [],
    support_n: 0,
    contest_n: 0,
  });
  return save(session);
}

export async function createChallenge(
  claimId: number,
  body: { author_id: number; alternative_text: string },
): Promise<Session> {
  const alternative_text = body.alternative_text.trim();
  if (alternative_text.length < 8 || alternative_text.length > 500) {
    fail("Challenge must be between 8 and 500 characters");
  }
  const session = load();
  const claim = session.claims.find((item) => item.id === claimId);
  if (!claim) fail("Claim not found");
  claim.challenges.push({
    id: nextId(session.claims.flatMap((item) => item.challenges)),
    claim_id: claimId,
    author_id: body.author_id,
    alternative_text,
    created_at: stamp(),
  });
  const index = session.claims.findIndex((item) => item.id === claimId);
  session.claims[index] = refreshClaim(claim);
  return save(session);
}

export async function createEvidence(
  claimId: number,
  body: EvidencePayload,
): Promise<Session> {
  if (body.stance !== "supports" && body.stance !== "challenges") {
    fail("stance must be supports or challenges");
  }
  const session = load();
  const claim = session.claims.find((item) => item.id === claimId);
  if (!claim) fail("Claim not found");
  claim.evidence.push({
    id: nextId(session.claims.flatMap((item) => item.evidence)),
    claim_id: claimId,
    challenge_id: null,
    author_id: body.author_id,
    stance: body.stance,
    experiment_name: body.experiment_name.trim(),
    result: {
      metric: "activation rate",
      condition_a: {
        name: body.condition_a_name.trim(),
        value: body.condition_a_value,
      },
      condition_b: {
        name: body.condition_b_name.trim(),
        value: body.condition_b_value,
      },
      n: body.n,
    },
    notes: body.notes.trim(),
    intervention: body.intervention,
    created_at: stamp(),
  });
  const index = session.claims.findIndex((item) => item.id === claimId);
  session.claims[index] = refreshClaim(claim);
  return save(session);
}

export async function retractChallenge(
  claimId: number,
  challengeId: number,
  author_id: number,
): Promise<Session> {
  const session = load();
  const claim = session.claims.find((item) => item.id === claimId);
  if (!claim) fail("Claim not found");
  const challenge = claim.challenges.find((item) => item.id === challengeId);
  if (!challenge) fail("Reading not found");
  if (challenge.author_id !== author_id) fail("Only the author can retract");
  claim.challenges = claim.challenges.filter((item) => item.id !== challengeId);
  const index = session.claims.findIndex((item) => item.id === claimId);
  session.claims[index] = refreshClaim(claim);
  return save(session);
}

export async function retractComment(
  id: number,
  author_id: number,
): Promise<Session> {
  const session = load();
  const comment = session.comments.find((item) => item.id === id);
  if (!comment) fail("Comment not found");
  if (comment.author_id !== author_id) fail("Only the author can retract");
  const drop = new Set<number>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const item of session.comments) {
      if (item.parent_id != null && drop.has(item.parent_id) && !drop.has(item.id)) {
        drop.add(item.id);
        grew = true;
      }
    }
  }
  session.comments = session.comments.filter((item) => !drop.has(item.id));
  return save(session);
}

export async function createComment(body: {
  feature_pk: number;
  author_id: number;
  text: string;
  parent_id?: number | null;
}): Promise<Session> {
  const text = body.text.trim();
  if (text.length < 2 || text.length > 2000) {
    fail("Comment must be between 2 and 2000 characters");
  }
  const session = load();
  const feature = session.features.find((item) => item.id === body.feature_pk);
  if (!feature) fail("Feature not found");
  const parentId = body.parent_id ?? null;
  if (parentId != null) {
    const parent = session.comments.find((item) => item.id === parentId);
    if (!parent || parent.feature_pk !== body.feature_pk) {
      fail("Parent comment not found");
    }
  }
  session.comments.push({
    id: nextId(session.comments),
    feature_pk: body.feature_pk,
    author_id: body.author_id,
    parent_id: parentId,
    text,
    created_at: stamp(),
  });
  return save(session);
}

export async function createChoice(body: {
  author_id: number;
  prompt: string;
  chosen_run_id: number;
}): Promise<Session> {
  const session = load();
  const chosen = session.runs.find((item) => item.id === body.chosen_run_id);
  if (!chosen) fail("Run not found");
  if (chosen.prompt !== body.prompt) {
    fail("Choice must pick a response to this prompt");
  }
  const writer = session.models.find((item) => item.id === chosen.model_id);
  if (writer?.role !== "writer") fail("A choice picks a writer, not a scorer");
  const among = session.runs.filter((item) => {
    if (item.prompt !== body.prompt) return false;
    const model = session.models.find((row) => row.id === item.model_id);
    return model?.role === "writer";
  });
  if (among.length < 2) fail("A choice needs two writers on this lead");
  const existing = session.choices.find(
    (item) => item.author_id === body.author_id && item.prompt === body.prompt,
  );
  if (existing) {
    existing.chosen_run_id = body.chosen_run_id;
    existing.among_run_ids = among.map((item) => item.id);
    existing.created_at = stamp();
  } else {
    session.choices.push({
      id: nextId(session.choices),
      author_id: body.author_id,
      prompt: body.prompt,
      chosen_run_id: body.chosen_run_id,
      among_run_ids: among.map((item) => item.id),
      created_at: stamp(),
    });
  }
  return save(session);
}
