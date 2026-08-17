"use client";

import { FormEvent, useId, useState } from "react";
import { fileToProfileImage, randomHues } from "@/lib/profile";
import type { ProfilePayload, UserKind } from "@/lib/types";
import { ProfileAvatar } from "@/components/ProfileAvatar";

type Draft = {
  name: string;
  kind: UserKind;
  note: string;
  image: string | null;
  hue: number;
  hue2: number;
};

function emptyDraft(): Draft {
  const hues = randomHues();
  return {
    name: "",
    kind: "person",
    note: "",
    image: null,
    hue: hues.hue,
    hue2: hues.hue2,
  };
}

export function ProfileComposer({
  variant,
  onCreate,
}: {
  variant: "mast" | "page";
  onCreate: (payload: ProfilePayload) => Promise<void>;
}) {
  const photoId = useId();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const preview = {
    id: 0,
    name: draft.name.trim() || (draft.kind === "agent" ? "Agent" : "You"),
    kind: draft.kind,
    hue: draft.hue,
    hue2: draft.hue2,
    image: draft.image,
    note: draft.note,
  };

  async function pickPhoto(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const image = await fileToProfileImage(file);
      setDraft((current) => ({ ...current, image }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read image");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await onCreate({
        name: draft.name,
        kind: draft.kind,
        note: draft.note,
        image: draft.image,
        hue: draft.hue,
        hue2: draft.hue2,
      });
      setDraft(emptyDraft());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create profile");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className={`profile-composer is-${variant}`}
      onSubmit={submit}
    >
      <button
        type="button"
        className="profile-swatch"
        onClick={() => setDraft((current) => ({ ...current, ...randomHues() }))}
        aria-label="New gradient"
        title="New gradient"
      >
        <ProfileAvatar user={preview} size={variant === "page" ? "l" : "m"} />
      </button>

      <div className="profile-fields">
        <div className="profile-kind" role="group" aria-label="Profile kind">
          <button
            type="button"
            className={draft.kind === "person" ? "is-active" : undefined}
            onClick={() => setDraft((current) => ({ ...current, kind: "person" }))}
          >
            Person
          </button>
          <button
            type="button"
            className={draft.kind === "agent" ? "is-active" : undefined}
            onClick={() => setDraft((current) => ({ ...current, kind: "agent" }))}
          >
            Agent
          </button>
        </div>

        <label>
          {draft.kind === "agent" ? "Agent name" : "Your name"}
          <input
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
            required
            minLength={2}
            maxLength={40}
            autoComplete={draft.kind === "person" ? "nickname" : "off"}
            placeholder={draft.kind === "agent" ? "A labelled model" : "Your name"}
          />
        </label>

        {draft.kind === "agent" && (
          <label>
            Which model
            <input
              value={draft.note}
              onChange={(event) =>
                setDraft((current) => ({ ...current, note: event.target.value }))
              }
              maxLength={80}
              placeholder="Gemma 2 2B, GPT-OSS 20B…"
            />
          </label>
        )}

        <div className="profile-actions">
          <label className="profile-photo" htmlFor={photoId}>
            {draft.image ? "Change photo" : "Add a photo"}
            <input
              id={photoId}
              type="file"
              accept="image/*"
              onChange={(event) => {
                void pickPhoto(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
          <button className="btn-solid" type="submit" disabled={pending}>
            {draft.kind === "agent" ? "Create agent" : "Enter"}
          </button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
