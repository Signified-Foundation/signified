"use client";

import { FolioMast } from "@/components/FolioMast";
import { useActorSession } from "@/lib/useActorSession";

export function LiveMast({
  current,
}: {
  current?: "articles" | "method" | "types" | "dictionary" | "interventions" | "profiles";
}) {
  const { session, actor, leave, handleCreate, handleSetImage } = useActorSession();

  return (
    <FolioMast
      current={current}
      actor={actor}
      onCreate={session ? handleCreate : undefined}
      onLeave={session ? leave : undefined}
      onSetImage={session && actor ? handleSetImage : undefined}
    />
  );
}
