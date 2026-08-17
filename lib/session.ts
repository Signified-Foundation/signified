import type { Claim, Feature, GraphPayload, Run, Session } from "@/lib/types";

export function runOf(session: Session, runId: number): Run | undefined {
  return session.runs.find((item) => item.id === runId);
}

export function graphOf(
  session: Session,
  runId: number,
): GraphPayload | undefined {
  return session.graphs[runId];
}

export function modelNameOf(session: Session, modelId: number) {
  return session.models.find((item) => item.id === modelId)?.name;
}

export function writerNameOf(session: Session, runId: number) {
  const run = runOf(session, runId);
  return run ? modelNameOf(session, run.model_id) : undefined;
}

export function meaningClaim(session: Session, featurePk: number) {
  return session.claims.find(
    (item) => item.feature_pk === featurePk && item.kind !== "weight",
  );
}

export function weightClaims(session: Session, featurePk: number) {
  return session.claims.filter(
    (item) => item.feature_pk === featurePk && item.kind === "weight",
  );
}

export function meaningStatus(
  session: Session,
  feature: Feature,
): Claim["status"] | null {
  return meaningClaim(session, feature.id)?.status ?? null;
}
