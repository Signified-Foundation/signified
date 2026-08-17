import type { Metadata } from "next";
import Link from "next/link";
import { articleState, CATALOG } from "@/lib/catalog";
import { featureSlug } from "@/lib/wiki";

export const metadata: Metadata = {
  title: "Types · Signified",
  description:
    "The five kinds of thing the wiki holds: observation, claim, evidence, challenge, and talk.",
};

const NAV = [
  { href: "/blog/types", label: "Types", current: true },
  { href: "/wiki", label: "Articles" },
  { href: "/wiki/method", label: "Method" },
] as const;

const KINDS = [
  {
    id: "observation",
    name: "Observation",
    what: "What the computer produced on a run: a prompt, a completion, an attribution graph, a measured activation.",
    not: "Not a meaning. A path on the graph is not a cause until an intervention has been run.",
    example:
      "Gemma 2 2B completed “The capital of Australia is” with Canberra. Feature 18472 takes a strong path from the token Australia into that completion.",
  },
  {
    id: "claim",
    name: "Claim",
    what: "A person’s reading of a feature. It should read as a hypothesis, not a post.",
    not: "Not a fact. A human interpretation is not evidence, and neither is a model-generated explanation.",
    example:
      "Alex: Feature 18472 represents Australian geographic entities. That sentence is held as a claim. It can be supported, challenged, or left unresolved.",
  },
  {
    id: "evidence",
    name: "Evidence",
    what: "A numerical result from an experiment that was actually run. Notes may accompany the number. They do not replace it.",
    not: "Not an explanation from another model. Not a comment. Not a graph, until someone has intervened.",
    example:
      "A contrast: the feature is active on place names and quiet on matched unrelated nouns. The rates are the evidence. The story around them is not.",
  },
  {
    id: "challenge",
    name: "Challenge",
    what: "Another reading of the same unit. Both stay on the page. The article does not pick a winner.",
    not: "Not a deletion of the first claim. Not a vote. Not a reputation score.",
    example:
      "Sam: Feature 18472 is capital-city retrieval, not Australian geography. The two readings come apart on prompts that never mention Canberra.",
  },
  {
    id: "talk",
    name: "Talk",
    what: "What people say. A comment can disagree with the article, or bring a public view to the same feature.",
    not: "Never proof. Talk is stored so the argument has a place. It does not count as evidence.",
    example:
      "A reader may say the public Neuronpedia label already treats this unit as geography. That belongs in talk, next to the claim, not in the evidence list.",
  },
] as const;

export default function TypesPage() {
  return (
    <div className="blog-grid is-types-page">
      <h1 className="blog-hej">Types</h1>

      <nav className="blog-nav" aria-label="On this page">
        <span className="blog-dot" aria-hidden="true" />
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={"current" in item && item.current ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="blog-nav-label">Kinds</p>
        <ul>
          {KINDS.map((kind) => (
            <li key={kind.id}>
              <a href={`#${kind.id}`}>{kind.name}</a>
            </li>
          ))}
        </ul>
        <p className="blog-nav-label">Articles</p>
        <ul>
          {CATALOG.map((item) => {
            const state = articleState(item);
            return (
              <li key={item.id}>
                <Link
                  href={`/wiki/${featureSlug(item.id)}`}
                  className={`is-${state}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="blog-copy">
        <p>
          The wiki holds five kinds of thing. They have to stay distinct. A
          graph is an observation. A person proposes what it might mean. Another
          person may disagree. An experiment produces a number. People talk.
          The page stores all of that, and does not collapse it into a single
          verdict.
        </p>
        <p>
          You can call this a schema if you want. It is really a way of keeping
          those sentences from collapsing into each other.
        </p>

        <ol className="blog-kinds">
          {KINDS.map((kind, index) => (
            <li key={kind.id} id={kind.id} className="blog-kind">
              <p className="blog-kind-num">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <h2>{kind.name}</h2>
                <p>{kind.what}</p>
                <p className="blog-kind-not">{kind.not}</p>
                <p className="blog-kind-ex">
                  <span>On this run.</span> {kind.example}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p>
          <Link href="/wiki/feature-18472" className="blog-cta">
            See the types held in one article →
          </Link>
        </p>
      </div>

      <figure className="blog-plate" aria-label="The five types">
        <figcaption>Signified</figcaption>
        <ul>
          {KINDS.map((kind) => (
            <li key={kind.id}>{kind.name}</li>
          ))}
        </ul>
      </figure>
    </div>
  );
}
