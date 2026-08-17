import type { User } from "@/lib/types";

export function randomHues(): { hue: number; hue2: number } {
  const hue = Math.floor(Math.random() * 360);
  const hue2 = (hue + 48 + Math.floor(Math.random() * 72)) % 360;
  return { hue, hue2 };
}

export function profileGradient(user: Pick<User, "kind" | "hue" | "hue2">): string {
  const sat = user.kind === "agent" ? 46 : 36;
  return `linear-gradient(148deg, hsl(${user.hue} ${sat}% 48%) 0%, hsl(${user.hue2} ${sat + 6}% 24%) 100%)`;
}

export function profileInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed[0].toLocaleUpperCase();
}

export function kindPhrase(user: Pick<User, "kind">): string {
  return user.kind === "agent" ? "an agent · not evidence" : "a person";
}

export function readingByline(
  user: Pick<User, "kind">,
  extra: "first" | "other",
): string {
  if (user.kind === "agent") {
    return extra === "first"
      ? "an agent · a reading, not evidence"
      : "an agent · another reading, not evidence";
  }
  return extra === "first"
    ? "a person · a reading, not a fact"
    : "a person · another reading";
}

export function resolveUser(users: User[], id: number): User {
  return (
    users.find((item) => item.id === id) ?? {
      id,
      name: `User ${id}`,
      kind: "person",
      hue: 220,
      hue2: 198,
      image: null,
      note: "",
    }
  );
}

export async function fileToProfileImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image");
  }
  if (file.size > 8_000_000) {
    throw new Error("Image is too large");
  }
  const bitmap = await createImageBitmap(file);
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read image");
  const min = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - min) / 2;
  const sy = (bitmap.height - min) / 2;
  ctx.drawImage(bitmap, sx, sy, min, min, 0, 0, size, size);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function clampHue(value: number | undefined, fallback: number): number {
  if (value == null || Number.isNaN(value)) return fallback;
  const rounded = Math.round(value);
  return ((rounded % 360) + 360) % 360;
}
