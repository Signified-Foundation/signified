import type { ReactNode } from "react";
import Link from "next/link";

export const BLOG_NAV = [
  { href: "/blog/types", label: "Types", id: "types" },
  { href: "/blog/dictionary", label: "Dictionary", id: "dictionary" },
  { href: "/blog/interventions", label: "Interventions", id: "interventions" },
  { href: "/articles", label: "Articles", id: "articles" },
  { href: "/wiki/method", label: "Method", id: "method" },
] as const;

export function BlogNav({
  current,
  children,
}: {
  current: (typeof BLOG_NAV)[number]["id"];
  children?: ReactNode;
}) {
  return (
    <nav className="blog-nav" aria-label="On this page">
      <span className="blog-dot" aria-hidden="true" />
      <ul>
        {BLOG_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.id === current ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </nav>
  );
}
