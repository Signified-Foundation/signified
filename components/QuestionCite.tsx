import Link from "next/link";
import { questionsForFeature, questionPath } from "@/lib/questions";

export function QuestionChip({ featureId }: { featureId: number }) {
  const linked = questionsForFeature(featureId);
  if (linked.length === 0) return null;

  return (
    <aside className="rs-hatnote" aria-label="Disambiguation">
      This article is this unit on its run. For{" "}
      {linked.map((item, index) => (
        <span key={item.id}>
          {index > 0 ? "; " : null}
          <Link href={questionPath(item.slug)}>{item.text}</Link>
        </span>
      ))}
      , see the question.
    </aside>
  );
}
