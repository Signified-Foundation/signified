const ACTOR_KEY = "signified.actor.v1";

export function loadActorId(userIds: number[]): number {
  const fallback = userIds[0] ?? 1;
  if (typeof window === "undefined") return fallback;
  const id = Number(window.localStorage.getItem(ACTOR_KEY));
  return userIds.includes(id) ? id : fallback;
}

export function saveActorId(id: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTOR_KEY, String(id));
}
