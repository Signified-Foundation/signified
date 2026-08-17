import type { ReactNode } from "react";
import Link from "next/link";
import { CATALOG_RUNS, catalogForRun } from "@/lib/catalog";
import { featureSlug } from "@/lib/wiki";

export type TocItem = {
  href: string;
  label: string;
  current?: boolean;
};

export function WikiFrame({
  current,
  toc,
  activeHref,
  children,
}: {
  current?: "home" | "method" | "article" | "index";
  toc: TocItem[];
  activeHref?: string;
  children: ReactNode;
}) {
  return (
    <div className="wiki">
      <header className="mast">
        <Link href="/" className="wordmark">
          Signified
        </Link>
        <nav className="mast-nav" aria-label="Wiki">
          <Link
            href="/wiki"
            aria-current={current === "index" ? "page" : undefined}
          >
            Articles
          </Link>
          <Link
            href="/wiki/method"
            aria-current={current === "method" ? "page" : undefined}
          >
            Method
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
          {CATALOG_RUNS.map((run) => (
            <div key={run.id}>
              <p className="toc-label">
                {run.modelName} · {run.kicker}
              </p>
              <ul>
                {catalogForRun(run.id).map((item) => {
                  const href = `/wiki/${featureSlug(item.id)}`;
                  return (
                    <li key={item.id}>
                      <Link
                        href={href}
                        aria-current={activeHref === href ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <p className="toc-label">Articles</p>
          <ul>
            <li>
              <Link
                href="/wiki/method"
                aria-current={current === "method" ? "page" : undefined}
              >
                Method
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
