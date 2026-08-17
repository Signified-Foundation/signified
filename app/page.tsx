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

function Spine({
  item,
  asHero = false,
}: {
  item: CatalogFeature;
  asHero?: boolean;
}) {
  const Title = asHero ? "h1" : "h2";
  return (
    <article className="front-entry">
      <p className="front-id">
        {item.label} · {item.modelName} · {item.status}
      </p>
      <div className="front-spine">
        <Title className="front-a">{item.left.text}</Title>
        {item.right && <p className="front-b">{item.right.text}</p>}
        <p className="front-hold">{item.hold}</p>
      </div>
      <Link href={`/wiki/${featureSlug(item.id)}`} className="front-go">
        Open the article
      </Link>
    </article>
  );
}

export default function Home() {
  const featuredIds = [18472, 5560, 2104, 7781, 3308];
  const featured = featuredIds
    .map((id) => CATALOG.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const hero = featured[0];
  const more = featured.slice(1);

  return (
    <div className="front">
      <header className="front-top">
        <Link href="/" className="wordmark">
          Signified
        </Link>
        <nav className="front-nav" aria-label="Wiki">
          <Link href="/wiki">Articles</Link>
          <Link href="/wiki/method">Method</Link>
          <Link href="/blog/types">Types</Link>
        </nav>
      </header>

      

      <section className="front-hero">

        
        <div className="front-stage">


          <h3 className="front-title">
            Signified  </h3>
            
           <h2 className="front-subtitle">
            A wikipedia for language model preferences and human views <br/>
          <span className=" front-subtitle-books" > Evaluate  <img src="books/book-1.png" alt="Book 2" />, discuss <img src="books/book-2.png" alt="Book 1" />, and understand AI  subjective views <img src="books/book-3.png" alt="Book 2" />
          </span>

            
           </h2>  
          <Spine item={hero} asHero />
        </div>
        <HalftonePlate
          className="is-wall"
          image="/gallery-wall.jpg"
          label="The gallery wall, looking down the run."
        />
      </section>

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
        <Link href="/wiki" className="front-go">
          All articles
        </Link>
      </footer>

      <section className="front-entries" aria-label="More entries">
        {more.map((item) => (
          <Spine key={item.id} item={item} />
        ))}
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

      <section className="front-does" aria-labelledby="does-title">
        <p className="shelf-label">What this does</p>
        <h2 id="does-title">The computer measures. People interpret.</h2>
        <p>
          Signified is a wiki of contested readings of what happens inside
          models, and of how those readings meet public ones. It does not
          complete the sentence “this feature represents…” for you. One model
          writes. Other open models may score that pair. Those scores are not
          evidence about a feature.
        </p>
        <ul className="does-list">
          <li>
            <strong>Articles</strong>
            <span>
              One page per internal unit on a run. Canberra and the Iliad both
              have a place. The article does not pick a winner.
            </span>
          </li>
          <li>
            <strong>Attribution</strong>
            <span>
              Hold the graph as a fixture. Select a node. A path is not a
              meaning, and a local reading is not a measurement.
            </span>
          </li>
          <li>
            <strong>Readings</strong>
            <span>
              Propose what a unit is doing. Another person may file a second
              reading. Both stay.
            </span>
          </li>
          <li>
            <strong>Evidence</strong>
            <span>
              Attach a numerical result from an experiment that was actually
              run. A score from another model is not that.
            </span>
          </li>
          <li>
            <strong>Talk</strong>
            <span>
              Comment, dissent, or bring a public view to the same feature. A
              comment is never proof.
            </span>
          </li>
          <li>
            <strong>Status</strong>
            <span>
              Contested, supported, unresolved, or a stub. Supported is not
              settled. Uncontested is still a claim.
            </span>
          </li>
        </ul>
        <p className="does-more">
          <Link href="/wiki/method" className="text-link">
            How a reading is held
          </Link>
          <Link href="/blog/types" className="text-link">
            The five kinds of object
          </Link>
        </p>
      </section>
    </div>
  );
}
