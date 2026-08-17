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
import { featureSlug } from "@/lib/wiki";

function Entry({ item }: { item: CatalogFeature }) {
  const state = articleState(item);
  return (
    <li>
      <Link
        href={`/wiki/${featureSlug(item.id)}`}
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
        <Link href={`/wiki/${featureSlug(item.id)}`} className="front-go">
          Open the article
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
          <Link href="/articles">Articles</Link>
          <Link href="/wiki/method">Method</Link>
          <Link href="/profiles">Profiles</Link>
          <Link href="/blog/types">Types</Link>
          <Link href="/blog/dictionary">Dictionary</Link>
        </nav>
      </header>

      

      <section className="front-hero">
        <div className="front-stage">
          <h1 className="front-title">Signified</h1>
          <p className="front-subtitle">
            A Wikipedia for language model preferences and human views.
          </p>
          <p className="front-why">
          
          
          Language models have preferences, tendencies, representations, and behaviors.

Signified is a place to discover them, investigate them, and see how people interpret them.
          </p>
          <p className="front-acts">
            Discover{" "}
            <span className="front-chip">
              <img
                src="/gallery-wall.jpg"
                alt=""
                className="is-observe"
              />
            </span>{" "}
            investigate{" "}
            <span className="front-chip">
              <img
                src="/gallery-wall.jpg"
                alt=""
                className="is-interpret"
              />
            </span>{" "}
            interpret{" "}
            <span className="front-chip">
              <img
                src="/gallery-wall.jpg"
                alt=""
                className="is-debate"
              />
            </span>
          </p>
          <Link href="/wiki/feature-3102" className="front-go">
            Open a contested article
          </Link>
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
          <Link href="/articles" className="front-go">
            All articles
          </Link>
        </footer>

        <section className="front-entries" aria-label="Articles">
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
            <p className="shelf-label">Open scorers · same pair, no writing</p>
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
              Not a measurement of the feature. Another open model scored the
              written pair.
            </p>
          </section>
        </div>
      </section>

      <section className="front-does" aria-labelledby="explore-title">
        <section className="does-chapter" aria-labelledby="explore-title">
          <h2 id="explore-title">Explore what models prefer</h2>
          <p>
            Models can be measured from the inside. Features can be identified.
            Behaviors can be tested. Preferences can be compared across models.
          </p>
          <p>
            Signified turns those observations into a shared, searchable body of
            knowledge. Each entry brings together the model behavior, the
            evidence behind it, and the views people have formed around it.
          </p>
          <ul className="does-list">
            <li>
              <strong>Discover</strong>
              <span>
                Preferences, tendencies, representations, and behaviors —
                collected as entries.
              </span>
            </li>
            <li>
              <strong>Investigate</strong>
              <span>
                Measure from the inside. Identify features. Test behaviors.
              </span>
            </li>
            <li>
              <strong>Compare</strong>
              <span>
                Scorers can look at the same written pair. That is not a
                measurement of the feature.
              </span>
            </li>
            <li>
              <strong>Evidence</strong>
              <span>
                The measurable behavior, and the test behind it, on the same
                page as the view.
              </span>
            </li>
            <li>
              <strong>Interpret</strong>
              <span>The views people have formed around an entry.</span>
            </li>
            <li>
              <strong>Challenge</strong>
              <span>
                Discuss and contest. Some views converge. Others stay open.
                That disagreement is part of the knowledge.
              </span>
            </li>
          </ul>
        </section>

        <section className="does-chapter" aria-labelledby="evidence-title">
          <h2 id="evidence-title">Where evidence meets interpretation</h2>
          <p>
            A model can consistently prefer one answer over another. What that
            preference means is another question.
          </p>
          <p>
            Signified makes room for both: the measurable behavior and the human
            interpretation. People can discuss and challenge the views attached
            to a model. Some will converge. Others will remain contested. That
            disagreement is part of the knowledge.
          </p>
        </section>

        <section className="does-chapter" aria-labelledby="vocab-title">
          <h2 id="vocab-title">Building the vocabulary of AI</h2>
          <p>
            As models become more capable, we need better ways to describe what
            they do—and what we think is happening inside them. Signified is
            building that vocabulary in public.
          </p>
          <p>
            A living map of model preferences, features, behaviors, and
            interpretations.
          </p>
        </section>

        <p className="front-signal">
          The model produces the signal.
          <br />
          Signified captures what it comes to mean.
        </p>
        <p className="does-more">
          <Link href="/wiki/method" className="text-link">
            How a reading is held
          </Link>
          <Link href="/blog/types" className="text-link">
            The five kinds of object
          </Link>
          <Link href="/blog/dictionary" className="text-link">
            The two votes
          </Link>
          <Link href="/blog/interventions" className="text-link">
            After the completion
          </Link>
        </p>
      </section>
    </div>
  );
}
