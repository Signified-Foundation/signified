import type { Metadata } from "next";
import { ResearchDemo } from "@/components/ResearchDemo";
import { researchPayload } from "@/lib/research";

export const metadata: Metadata = {
  title: "Wiki · Signified",
  description:
    "A question and a continuation on one desk. Units, readings, and an anti-debate.",
};

export default function WikiPage() {
  return <ResearchDemo data={researchPayload()} />;
}
