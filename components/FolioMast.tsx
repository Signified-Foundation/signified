"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { kindPhrase } from "@/lib/profile";
import type { ProfilePayload, User } from "@/lib/types";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { ProfileComposer } from "@/components/ProfileComposer";

export function FolioMast({
  current,
  actor,
  onCreate,
  onLeave,
  onSetImage,
}: {
  current?: "articles" | "method" | "types" | "dictionary" | "interventions" | "profiles" | "question" | "research";
  actor?: User | null;
  onCreate?: (payload: ProfilePayload) => Promise<void>;
  onLeave?: () => void;
  onSetImage?: (file: File) => Promise<void>;
}) {
  const photoId = useId();
  const [photoError, setPhotoError] = useState<string | null>(null);
  const showIdentity = Boolean(onCreate || onLeave || actor);

  async function changePhoto(file: File | undefined) {
    if (!file || !onSetImage) return;
    setPhotoError(null);
    try {
      await onSetImage(file);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Could not save photo");
    }
  }

  return (
    <header className="folio-mast">
      <Link href="/" className="wordmark">
        Signified
      </Link>
      <nav className="mast-nav" aria-label="Wiki">
        <Link
          href="/research"
          aria-current={current === "research" ? "page" : undefined}
        >
          Wiki
        </Link>
        <Link
          href="/wiki/method"
          aria-current={current === "method" ? "page" : undefined}
        >
          Method
        </Link>
        <Link
          href="/profiles"
          aria-current={current === "profiles" ? "page" : undefined}
        >
          Profiles
        </Link>
        <Link
          href="/blog/types"
          aria-current={current === "types" ? "page" : undefined}
        >
          Types
        </Link>
        <Link
          href="/blog/dictionary"
          aria-current={current === "dictionary" ? "page" : undefined}
        >
          Dictionary
        </Link>
      </nav>
      {showIdentity && (
        <div className="mast-actors" id="login">
          {actor ? (
            <div className="mast-who is-chip">
              {onSetImage ? (
                <label className="mast-face" htmlFor={photoId} title="Change photo">
                  <ProfileAvatar user={actor} size="s" />
                  <span className="sr-only">Change photo</span>
                  <input
                    id={photoId}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      void changePhoto(event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
              ) : (
                <ProfileAvatar user={actor} size="s" />
              )}
              <p title={kindPhrase(actor)}>
                You are <strong>{actor.name}</strong>
              </p>
              {onLeave && (
                <button type="button" className="mast-leave" onClick={onLeave}>
                  Leave
                </button>
              )}
            </div>
          ) : onCreate ? (
            <ProfileComposer variant="mast" onCreate={onCreate} />
          ) : null}
          {photoError && <p className="form-error">{photoError}</p>}
        </div>
      )}
    </header>
  );
}
