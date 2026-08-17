import Link from "next/link";
import { HalftonePlate } from "@/components/HalftonePlate";
import { articleState, articleStateLabel, CATALOG } from "@/lib/catalog";
import { featureSlug } from "@/lib/wiki";

export default function Home() {
  const featured = CATALOG[0];
  const others = CATALOG.slice(1);

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
          <p className="front-id">{featured.label} · contested</p>
          <div className="front-spine">
            <h1 className="front-a">{featured.left.text}</h1>
            {featured.right && (
              <p className="front-b">{featured.right.text}</p>
            )}
            <p className="front-hold">{featured.hold}</p>
          </div>
        </div>
        <HalftonePlate
          className="is-wall"
          image="/gallery-wall.jpg"
          label="The gallery wall, looking down the run."
        />
      </section>

      <footer className="front-foot">
        <p className="front-prompt">
          <span>The capital of Australia is</span>
          <span className="output">Canberra</span>
        </p>
        <Link href={`/wiki/${featureSlug(featured.id)}`} className="front-go">
          Open the article
        </Link>
      </footer>

      <section className="front-lower">
        <HalftonePlate
          className="is-vault"
          image="/gallery-ceiling.jpg"
          label="The vault. Another plate of the same room."
        />
        <section className="shelf" aria-label="Other features on this run">
          <p className="shelf-label">Also on this run</p>
          <ul className="article-index">
            {others.map((item) => {
              const state = articleState(item);
              return (
                <li key={item.id}>
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
            })}
          </ul>
        </section>
      </section>

      <section className="front-does" aria-labelledby="does-title">
        <p className="shelf-label">What this does</p>
        <h2 id="does-title">The computer measures. People interpret.</h2>
        <p>
          Signified is a wiki of contested readings of what happens inside
          models, and of how those readings meet public ones. It does not
          complete the sentence “this feature represents…” for you.
        </p>
        <ul className="does-list">
          <li>
            <strong>Articles</strong>
            <span>
              One page per internal unit on a run. Six features from this
              Canberra completion already have a place.
            </span>
          </li>
          <li>
            <strong>Attribution</strong>
            <span>
              Hold the graph as an observation. Select a node. A path is not a
              meaning, and attribution is correlational until someone
              intervenes.
            </span>
          </li>
          <li>
            <strong>Readings</strong>
            <span>
              Propose what a unit is doing. Another person may file a second
              reading. Both stay. The article does not pick a winner.
            </span>
          </li>
          <li>
            <strong>Evidence</strong>
            <span>
              Attach a numerical result from an experiment that was actually
              run. Notes may accompany the number. They do not replace it.
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
