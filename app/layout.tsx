import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Montaga, Newsreader } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
});

const montaga = Montaga({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Signified",
  description:
    "Signified is a wiki about AI behavior. Read examples of what models do, examine the evidence, and see how people explain the results.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${montaga.variable} ${newsreader.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
