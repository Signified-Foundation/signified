import Link from "next/link";
import {
  articleStateLabel,
  type CatalogFeature,
} from "@/lib/catalog";
import {
  questionPath,
  questionsForFeature,
  relatedFeatures,
} from "@/lib/questions";
import type { Question } from "@/lib/types";
import { featureSlug } from "@/lib/wiki";

export function FeatureOverview({ question }: { question: Question }) {
  const features = relatedFeatures(question);
  if (features.length === 0) return null;

  return (
    <section className="q-explore" aria-label="Explore inside the model">
      <p className="kicker">Explore · inside the model</p>
      <p className="q-explore-lead">
        What might the model be representing when it did things like this? A
        review of an answer does not settle the unit.
      </p>
      <ul>
        {features.map((item) => (
          <li key={item.id}>
            <FeaturePeek item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function QuestionChip({ featureId }: { featureId: number }) {
  const linked = questionsForFeature(featureId);
  if (linked.length === 0) return null;

  return (
    <aside className="q-cite" aria-label="Related question">
      <p className="kicker">Outside · what the model did</p>
      {linked.map((item) => (
        <p key={item.id}>
          There is a question in the same neighborhood. Reviewing those
          answers is behavior, not a reading of this unit.{" "}
          <Link href={questionPath(item.slug)} className="text-link">
            {item.text}
          </Link>
        </p>
      ))}
    </aside>
  );
}

function FeaturePeek({ item }: { item: CatalogFeature }) {
  return (
    <article className="q-peek">
      <p className="q-peek-id">
        {item.label} · {item.lemma} · {articleStateLabel(item)}
      </p>
      <p className="q-peek-a">{item.left.text}</p>
      {item.right && <p className="q-peek-b">{item.right.text}</p>}
      <p className="q-peek-hold">{item.hold}</p>
      <Link href={`/wiki/${featureSlug(item.id)}`} className="text-link">
        See the feature
      </Link>
    </article>
  );
}
