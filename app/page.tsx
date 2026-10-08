import Link from "next/link";
import { HalftonePlate } from "@/components/HalftonePlate";
import {
  articleState,
  articleStateLabel,
  CATALOG,
  CATALOG_RUNS,
  type CatalogFeature,
} from "@/lib/catalog";
import { MODELS, SCORES } from "@/lib/models";

function Entry({ item }: { item: CatalogFeature }) {
  const state = articleState(item);
  return (
    <li>
      <Link
        href="/research"
        className={`is-${state}`}
      >
        {item.label}
      </Link>
      <span>
        {item.lemma}
        <i className={`status is-${articleState(item)}`}>
          {articleStateLabel(item)}
        </i>
      </span>
    </li>
  );
}

function Spine({ item }: { item: CatalogFeature }) {
  return (
    <article className="front-entry">
      <p className="front-id">
        {item.label} · {item.modelName} · {item.status}
      </p>
      <div className="front-spine">
        <h2 className="front-a">{item.left.text}</h2>
        {item.right && <p className="front-b">{item.right.text}</p>}
        <p className="front-hold">{item.hold}</p>
        <Link href="/research" className="front-go">
          Open in the wiki
        </Link>
      </div>
    </article>
  );
}

export default function Home() {
  const featuredIds = [3102, 4402, 5510, 5520, 6601, 5560, 4408, 6610];
  const featured = featuredIds
    .map((id) => CATALOG.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="front">
      <header className="front-top">
        <Link href="/" className="wordmark">
          Signified
        </Link>
        <nav className="front-nav" aria-label="Wiki">
          <Link href="/research">Wiki</Link>
          <Link href="/wiki/method">Method</Link>
          <Link href="/profiles">Profiles</Link>
          <Link href="/blog/types">Types</Link>
          <Link href="/blog/dictionary">Dictionary</Link>
        </nav>
      </header>

      <section className="front-hero">
        <div className="front-stage">
          <h1 className="front-title">Why did the model say that?</h1>
          <p className="front-subtitle">
            Signified is a wiki about AI behavior. Read examples of what models
            do, examine the evidence, and see how people explain the results.
          </p>
          <p className="front-doors">
            <Link href="/research" className="front-go">
              Browse the wiki
            </Link>
          </p>
        </div>
        <HalftonePlate
          className="is-wall"
          image="/gallery-wall.jpg"
          label="The gallery wall."
        />
      </section>

      <section className="front-second">
        <footer className="front-foot">
          <div className="front-prompts">
            {CATALOG_RUNS.map((run) => (
              <p className="front-prompt" key={run.id}>
                <span className="front-prompt-model">
                  {run.modelName} · {run.role}
                </span>
                <span>{run.prompt}</span>
                <span className="output">{run.output}</span>
              </p>
            ))}
          </div>
          <Link href="/research" className="front-go">
            Open the wiki
          </Link>
        </footer>

        <section className="front-entries" aria-label="Features">
          {featured.map((item) => (
            <Spine key={item.id} item={item} />
          ))}
        </section>
      </section>

      <section className="front-lower">
        <HalftonePlate
          className="is-vault"
          image="/gallery-ceiling.jpg"
          label="The vault. Another plate of the same room."
        />
        <div className="front-shelves">
          {CATALOG_RUNS.map((run) => {
            const items = CATALOG.filter(
              (item) =>
                item.runId === run.id &&
                !featured.some((row) => row.id === item.id),
            );
            if (items.length === 0) return null;
            return (
              <section
                className="shelf"
                key={run.id}
                aria-label={`${run.kicker} features`}
              >
                <p className="shelf-label">
                  {run.modelName} · {run.kicker}
                </p>
                <ul className="article-index">
                  {items.map((item) => (
                    <Entry key={item.id} item={item} />
                  ))}
                </ul>
              </section>
            );
          })}
          <section className="shelf" aria-label="Open scorers on the Iliad pair">
            <p className="shelf-label">Model scores for the same text</p>
            <ul className="article-index score-index">
              {SCORES.map((score) => {
                const model = MODELS.find((item) => item.id === score.model_id);
                return (
                  <li key={score.id}>
                    <span className="score-name">{model?.name}</span>
                    <span>
                      {score.metric}
                      <i className="status is-unresolved">
                        {score.value == null
                          ? "no number"
                          : score.value.toFixed(5)}
                      </i>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="shelf-note">
              Each score shows how another model rates the same text pair.
            </p>
          </section>
        </div>
      </section>

      <section className="front-does" aria-labelledby="explore-title">
        <section className="does-chapter" aria-labelledby="explore-title">
          <h2 id="explore-title">What you can do here</h2>
          <p>
            Each wiki entry brings together an example of model behavior,
            the available evidence, and people’s explanations.
          </p>
          <ul className="does-list">
            <li>
              <strong>Explore</strong>
              <span>
                Read prompts and see how different models respond.
              </span>
            </li>
            <li>
              <strong>Compare</strong>
              <span>
                Look at measurements and the explanations they support.
              </span>
            </li>
            <li>
              <strong>Discuss</strong>
              <span>
                Add an explanation, ask a question, or challenge a claim.
              </span>
            </li>
          </ul>
        </section>

        <section className="does-chapter" aria-labelledby="evidence-title">
          <h2 id="evidence-title">How an explanation develops</h2>
          <p>
            Someone proposes an explanation for a model’s behavior. Others
            can question it, suggest a test, or offer another explanation.
            The entry records the results as the discussion develops.
          </p>
        </section>

        <p className="does-more">
          <Link href="/wiki/method" className="text-link">
            How the wiki works
          </Link>
          <Link href="/blog/types" className="text-link">
            What an entry contains
          </Link>
          <Link href="/blog/dictionary" className="text-link">
            How voting works
          </Link>
          <Link href="/blog/interventions" className="text-link">
            Testing model behavior
          </Link>
        </p>
      </section>
    </div>
  );
}
