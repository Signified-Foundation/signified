const ACTOR_KEY = "signified.actor.v1";

export function loadActorId(userIds: number[]): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ACTOR_KEY);
  if (raw == null) return null;
  const id = Number(raw);
  return userIds.includes(id) ? id : null;
}

export function saveActorId(id: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTOR_KEY, String(id));
}

export function clearActorId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACTOR_KEY);
}
