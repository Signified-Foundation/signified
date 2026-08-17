import { CATALOG, CATALOG_RUNS, type CatalogFeature } from "@/lib/catalog";

export type AtlasPoint = CatalogFeature & {
  x: number;
  y: number;
};

/** Fixture layout of the wiki — neighbours share a run or a fight. Not a t-SNE of the weights. */
const PLACE: Record<number, { x: number; y: number }> = {
  3102: { x: 168, y: 148 },
  3108: { x: 238, y: 206 },
  2104: { x: 640, y: 92 },
  5560: { x: 738, y: 158 },
  7781: { x: 678, y: 228 },
  4402: { x: 156, y: 412 },
  4404: { x: 248, y: 468 },
  4408: { x: 332, y: 402 },
  5510: { x: 712, y: 392 },
  5520: { x: 802, y: 458 },
  5522: { x: 868, y: 522 },
  6601: { x: 468, y: 268 },
  6610: { x: 548, y: 338 },
};

export const ATLAS_WIDTH = 1000;
export const ATLAS_HEIGHT = 600;

export function atlasPoints(): AtlasPoint[] {
  return CATALOG.map((item) => {
    const place = PLACE[item.id] ?? { x: 500, y: 300 };
    return { ...item, ...place };
  });
}

export function atlasMatches(item: CatalogFeature, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    item.lemma,
    item.label,
    item.left.text,
    item.left.by,
    item.right?.text ?? "",
    item.right?.by ?? "",
    item.hold,
    item.modelName,
  ]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function atlasRunOf(runId: number) {
  return CATALOG_RUNS.find((run) => run.id === runId);
}

export function atlasEdges(points: AtlasPoint[]) {
  const byRun = new Map<number, AtlasPoint[]>();
  for (const point of points) {
    const group = byRun.get(point.runId) ?? [];
    group.push(point);
    byRun.set(point.runId, group);
  }
  const edges: { a: AtlasPoint; b: AtlasPoint }[] = [];
  for (const group of byRun.values()) {
    for (let i = 0; i < group.length; i += 1) {
      for (let j = i + 1; j < group.length; j += 1) {
        edges.push({ a: group[i], b: group[j] });
      }
    }
  }
  return edges;
}
