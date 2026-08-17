export function featureSlug(featureId: number) {
  return `feature-${featureId}`;
}

export function parseFeatureSlug(slug: string): number | null {
  const match = /^feature-(\d+)$/.exec(slug);
  return match ? Number(match[1]) : null;
}
