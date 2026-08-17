import Link from "next/link";
import { FolioMast } from "@/components/FolioMast";
import { articleCopy } from "@/lib/articles";
import {
  articleState,
  articleStateLabel,
  CATALOG,
  CATALOG_RUNS,
  catalogForRun,
  type CatalogFeature,
  type FeatureStatus,
} from "@/lib/catalog";
import { MODELS, SCORES } from "@/lib/models";
import { featureSlug } from "@/lib/wiki";

const GROUPS: { status: FeatureStatus | "none"; label: string; note: string }[] =
  [
    {
      status: "contested",
      label: "Contested",
      note: "Two readings are held. The article does not pick a winner.",
    },
    {
      status: "supported",
      label: "Supported",
      note: "A reading is held and unchallenged. Supported is not settled.",
    },
    {
      status: "unresolved",
      label: "Unresolved",
      note: "One reading, no contest yet. A proposed test is not an intervention.",
    },
    {
      status: "none",
      label: "Stubs",
      note: "The graph is still an observation. Nobody has written a reading.",
    },
  ];

function Entry({ item, index }: { item: CatalogFeature; index: number }) {
  const copy = articleCopy(item.id);
  const state = articleState(item);
  const href = `/wiki/${featureSlug(item.id)}`;

  return (
    <li className="issue-entry">
      <span className="issue-num">{String(index + 1).padStart(2, "0")}</span>
      <div className="issue-body">
        <p className="issue-kicker">
          {item.label}
          <i
            className={`status is-${item.status === "none" ? "loading" : item.status}`}
          >
            {articleStateLabel(item)}
          </i>
        </p>
        <h2>
          <Link href={href} className={`issue-title is-${state}`}>
            {item.lemma}
          </Link>
        </h2>
        <div className={`issue-pair${item.right ? "" : " is-single"}`}>
          <blockquote>
            <cite>{item.left.by}</cite>
            <p>{item.left.text}</p>
          </blockquote>
          {item.right ? (
            <blockquote>
              <cite>{item.right.by}</cite>
              <p>{item.right.text}</p>
            </blockquote>
          ) : (
            <p className="issue-empty">{item.hold}</p>
          )}
        </div>
        <p className="issue-obs">{copy.observation}</p>
        <p className="issue-go">
          <Link href={href} className="text-link">
            {state === "loading" ? "Open the stub" : "Open the article"}
          </Link>
        </p>
      </div>
    </li>
  );
}

export default function WikiIndexPage() {
  const counts = {
    contested: CATALOG.filter((i) => i.status === "contested").length,
    supported: CATALOG.filter((i) => i.status === "supported").length,
    unresolved: CATALOG.filter((i) => i.status === "unresolved").length,
    stubs: CATALOG.filter((i) => i.status === "none").length,
  };

  return (
    <div className="folio is-issue">
      <FolioMast current="articles" />
      <div className="issue-stage">
        <article className="issue">
          <header className="folio-head">
            <p className="folio-issue">Two runs · two writers</p>
            <h1 className="folio-title">What happened inside the model</h1>
            <p className="folio-by">Canberra, then the Iliad</p>
            <p className="folio-dek">
              Gemma 2 2B wrote Canberra. GPT-OSS 20B wrote Achilles. Other open
              models scored that second pair; they did not write. These
              articles record contested readings of the units on each run.
              Interpretations stay claims. Evidence stays numbers. The wiki
              does not pick a winner.
            </p>
          </header>

          {CATALOG_RUNS.map((run) => {
            const items = catalogForRun(run.id);
            const featured =
              items.find((item) =>
                run.id === 1 ? item.id === 18472 : item.id === 5560,
              ) ?? items[0];
            const featuredCopy = articleCopy(featured.id);
            return (
              <section key={run.id} className="issue-run" id={`run-${run.id}`}>
                <p className="issue-prompt">
                  <span className="front-prompt-model">
                    {run.modelName} · {run.role} · {run.kicker}
                  </span>
                  <span>{run.prompt}</span>
                  <span className="output">{run.output}</span>
                </p>

                <section
                  className="issue-feature"
                  aria-labelledby={`featured-${run.id}`}
                >
                  <p className="kicker">
                    Featured · {featured.status} · {run.modelName}
                  </p>
                  <h2 id={`featured-${run.id}`}>
                    <Link href={`/wiki/${featureSlug(featured.id)}`}>
                      {featured.lemma}
                    </Link>
                  </h2>
                  <div className="issue-pair">
                    <blockquote>
                      <cite>{featured.left.by}</cite>
                      <p>{featured.left.text}</p>
                    </blockquote>
                    {featured.right && (
                      <blockquote>
                        <cite>{featured.right.by}</cite>
                        <p>{featured.right.text}</p>
                      </blockquote>
                    )}
                  </div>
                  <p className="issue-obs">{featuredCopy.observation}</p>
                  <p className="issue-go">
                    <Link
                      href={`/wiki/${featureSlug(featured.id)}`}
                      className="text-link"
                    >
                      Open the article
                    </Link>
                  </p>
                </section>

                {GROUPS.map((group) => {
                  const groupItems = items.filter(
                    (item) =>
                      item.status === group.status && item.id !== featured.id,
                  );
                  if (groupItems.length === 0) return null;
                  return (
                    <section
                      key={`${run.id}-${group.status}`}
                      id={`${run.id}-${group.status}`}
                      className="issue-group"
                      aria-labelledby={`${run.id}-${group.status}-title`}
                    >
                      <p className="kicker">{group.label}</p>
                      <h2 id={`${run.id}-${group.status}-title`}>
                        {group.label}
                      </h2>
                      <p className="issue-note">{group.note}</p>
                      <ol className="issue-list">
                        {groupItems.map((item) => (
                          <Entry
                            key={item.id}
                            item={item}
                            index={CATALOG.findIndex(
                              (row) => row.id === item.id,
                            )}
                          />
                        ))}
                      </ol>
                    </section>
                  );
                })}
              </section>
            );
          })}
        </article>

        <aside className="issue-rail" aria-label="On this page">
          <nav className="folio-toc">
            <p className="toc-label">On this page</p>
            <ul>
              {CATALOG_RUNS.map((run) => (
                <li key={run.id}>
                  <a href={`#run-${run.id}`}>{run.kicker}</a>
                </li>
              ))}
            </ul>
          </nav>
          <section className="issue-facts">
            <p className="toc-label">These runs</p>
            <dl>
              {CATALOG_RUNS.map((run) => (
                <div key={run.id}>
                  <dt>{run.modelName}</dt>
                  <dd>
                    {run.prompt} {run.output}
                  </dd>
                </div>
              ))}
              <div>
                <dt>Articles</dt>
                <dd>{CATALOG.length} features</dd>
              </div>
              <div>
                <dt>Held</dt>
                <dd>
                  {counts.contested} contested · {counts.supported} supported ·{" "}
                  {counts.unresolved} unresolved · {counts.stubs} stub
                </dd>
              </div>
            </dl>
            <p className="toc-label">Open scorers</p>
            <dl>
              {SCORES.map((score) => {
                const model = MODELS.find((item) => item.id === score.model_id);
                return (
                  <div key={score.id}>
                    <dt>{model?.name}</dt>
                    <dd>
                      {score.value == null
                        ? "no number emitted"
                        : score.value.toFixed(5)}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="issue-note">
              Not a measurement of the feature. Another open model scored the
              written pair.
            </p>
            <p>
              <Link href="/wiki/method" className="text-link">
                How a reading is held
              </Link>
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
