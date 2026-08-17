"use client";

import { useEffect, useState } from "react";
import { clearActorId, loadActorId, saveActorId } from "@/lib/actor";
import { createProfile, getSession, setProfileImage } from "@/lib/api";
import { fileToProfileImage } from "@/lib/profile";
import type { ProfilePayload, Session, User } from "@/lib/types";

export function useActorSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [actorId, setActorId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getSession()
      .then((data) => {
        if (!alive) return;
        setSession(data);
        setActorId(loadActorId(data.users.map((user) => user.id)));
      })
      .catch(() => {
        if (alive) setLoadError("Could not load this run.");
      });
    return () => {
      alive = false;
    };
  }, []);

  const actor = session?.users.find((user) => user.id === actorId);

  function become(user: User) {
    setActorId(user.id);
    saveActorId(user.id);
  }

  function leave() {
    setActorId(null);
    clearActorId();
  }

  async function handleCreate(payload: ProfilePayload) {
    const { session: next, user } = await createProfile(payload);
    setSession(next);
    become(user);
  }

  async function handleSetImage(file: File) {
    if (!actor) return;
    const image = await fileToProfileImage(file);
    setSession(await setProfileImage(actor.id, image));
  }

  return {
    session,
    setSession,
    actorId,
    actor,
    become,
    leave,
    handleCreate,
    handleSetImage,
    loadError,
  };
}
