import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionReview } from "@/components/QuestionReview";
import { questionBySlug } from "@/lib/questions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const question = questionBySlug(slug);
  if (!question) return { title: "Question · Signified" };
  return {
    title: `${question.text} · Signified`,
    description: "Pick a completion and review that answer.",
  };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = questionBySlug(slug);
  if (!question) notFound();
  return <QuestionReview question={question} />;
}
