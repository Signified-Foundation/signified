import type { Metadata } from "next";
import Link from "next/link";
import { LiveMast } from "@/components/LiveMast";
import { WikiAtlas } from "@/components/WikiAtlas";
import {
  articleState,
  articleStateLabel,
  CATALOG,
  CATALOG_RUNS,
  catalogForRun,
} from "@/lib/catalog";
import { featureSlug } from "@/lib/wiki";

export const metadata: Metadata = {
  title: "Articles · Signified",
  description:
    "A map of the catalog. Nearby lemmas share a run or a fight. Not a measurement of the model.",
};

export default function ArticlesPage() {
  const contested = CATALOG.filter((item) => item.status === "contested").length;
  const stubs = CATALOG.filter((item) => item.status === "none").length;

  return (
    <div className="folio is-issue is-field">
      <LiveMast current="articles" />
      <div className="issue-stage is-single">
        <article className="issue">
          <header className="folio-head">
            <p className="folio-issue">Eight runs · three writers</p>
            <h1 className="folio-title">What happened inside the model</h1>
            <p className="folio-by">Georgia, then the Iliad, then the rest</p>
            <p className="folio-dek">
              Find a lemma on the map. Nearby articles share a run or a fight.
              {` ${contested} contested`}
              {stubs ? ` · ${stubs} stub` : ""}. The wiki does not pick a winner.
            </p>
          </header>

          <WikiAtlas />

          <ol className="atlas-index">
            {CATALOG_RUNS.map((run) => {
              const items = catalogForRun(run.id);
              return (
                <li key={run.id}>
                  <p className="atlas-index-run">
                    {run.modelName} · {run.kicker}
                    <span>
                      {run.prompt} {run.output}
                    </span>
                  </p>
                  <ul>
                    {items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/wiki/${featureSlug(item.id)}`}
                          className={`is-${articleState(item)}`}
                        >
                          {item.lemma}
                        </Link>
                        <i
                          className={`status is-${
                            item.status === "none" ? "loading" : item.status
                          }`}
                        >
                          {articleStateLabel(item)}
                        </i>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </article>
      </div>
    </div>
  );
}
