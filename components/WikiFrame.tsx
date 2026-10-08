import type { ReactNode } from "react";
import Link from "next/link";

export type TocItem = {
  href: string;
  label: string;
  current?: boolean;
};

export function WikiFrame({
  current,
  toc,
  ground = "paper",
  children,
}: {
  current?: "home" | "method" | "article" | "index" | "types" | "dictionary" | "profiles" | "question" | "research";
  toc: TocItem[];
  activeHref?: string;
  ground?: "field" | "paper";
  children: ReactNode;
}) {
  return (
    <div className={`wiki is-${ground}`}>
      <header className="mast">
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
      </header>

      <div className="wiki-body">
        <div className="wiki-main">{children}</div>
        <nav className="toc" aria-label="Contents">
          {toc.length > 0 && (
            <>
              <p className="toc-label">On this page</p>
              <ul>
                {toc.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
