import { profileGradient, profileInitial } from "@/lib/profile";
import type { User } from "@/lib/types";

export function ProfileAvatar({
  user,
  size = "m",
}: {
  user: User;
  size?: "s" | "m" | "l";
}) {
  const photo = Boolean(user.image);
  return (
    <span
      className={`avatar is-${size} is-${user.kind}${photo ? " has-photo" : ""}`}
      style={{
        backgroundImage: photo
          ? `url(${user.image})`
          : profileGradient(user),
      }}
      aria-hidden="true"
    >
      {photo ? null : profileInitial(user.name)}
    </span>
  );
}
