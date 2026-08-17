import Link from "next/link";

export function FolioMast({
  current,
}: {
  current?: "articles" | "method" | "types";
}) {
  return (
    <header className="folio-mast">
      <Link href="/" className="wordmark">
        Signified
      </Link>
      <nav className="mast-nav" aria-label="Wiki">
        <Link
          href="/wiki"
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
    </header>
  );
}
