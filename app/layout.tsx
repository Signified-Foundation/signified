import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Montaga, Newsreader } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
    "A wiki of contested readings of what happens inside models, and of how those readings meet public ones.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${montaga.variable} ${newsreader.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
