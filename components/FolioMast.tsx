import Link from "next/link";
import type { User } from "@/lib/types";

export function FolioMast({
  current,
  users,
  actorId,
  onActor,
}: {
  current?: "articles" | "method" | "types";
  users?: User[];
  actorId?: number;
  onActor?: (id: number) => void;
}) {
  return (
    <header className="folio-mast">
      <Link href="/" className="wordmark">
        Signified
      </Link>
      <nav className="mast-nav" aria-label="Wiki">
        <Link
          href="/articles"
          aria-current={current === "articles" ? "page" : undefined}
        >
          Articles
        </Link>
        <Link
          href="/wiki/method"
          aria-current={current === "method" ? "page" : undefined}
        >
          Method
        </Link>
        <Link
          href="/blog/types"
          aria-current={current === "types" ? "page" : undefined}
        >
          Types
        </Link>
      </nav>
      {users && onActor && actorId != null && (
        <div className="actors mast-actors" role="group" aria-label="You are">
          <span>You are</span>
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              className={user.id === actorId ? "is-active" : undefined}
              onClick={() => onActor(user.id)}
            >
              {user.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
