import type { ReactNode } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`blog ${inter.className}`}>
      <Link href="/" className="wordmark">
        Signified
      </Link>
      {children}
    </div>
  );
}
