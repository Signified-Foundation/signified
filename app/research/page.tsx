import type { Metadata } from "next";
import { ResearchDemo } from "@/components/ResearchDemo";
import { researchPayload } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research · typed links · Signified",
  description:
    "Same lemma is not the same computation. Hatnote, on this run, and see also are three relations.",
};

export default function ResearchPage() {
  return <ResearchDemo data={researchPayload()} />;
}
