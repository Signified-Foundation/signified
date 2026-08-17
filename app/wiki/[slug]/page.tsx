import { notFound } from "next/navigation";
import { Article } from "@/components/Article";
import { parseFeatureSlug } from "@/lib/wiki";

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const featureId = parseFeatureSlug(slug);
  if (featureId === null) notFound();

  return <Article featureId={featureId} />;
}
