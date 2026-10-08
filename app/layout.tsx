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
    "A wiki for understanding how AI models behave. Explore model responses, look at the evidence, and compare explanations.",
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
