import type { Metadata } from "next";
import Link from "next/link";
import { BlogNav } from "@/components/BlogNav";

export const metadata: Metadata = {
  title: "Dictionary · Signified",
  description:
    "Two human votes on two objects: which response, and what the feature is. They must not collapse.",
};

const LAYERS = [
  {
    id: "feature",
    name: "Feature",
    lead: "An internal unit on a run. The article’s subject.",
    body: [
      "A feature has an id, a layer, an activation, an attribution. It is not a word the model wrote, and it is not the lemma’s true name. The lemma — Georgia, wrath — is a short human handle for debate. The concept is what people are arguing the feature signifies: country, name-token, μῆνις. The feature is observed. The concept is proposed. They are not the same object.",
    ],
    not: "Not a completion. Not a proof of what the unit is. Not a vote on which model is better.",
    example:
      "Feature 3102 sits on Gemma’s Georgia run. Feature 2104 sits on GPT-OSS’s Iliad run. ALLaM writing Achilles on the same lead does not give you another 2104.",
  },
  {
    id: "completion",
    name: "Completion",
    lead: "What a writer emitted for a lead. One observation per prompt, model, and sample.",
    body: [
      "The prompt is a public utterance, not a chat question, unless the question is filed as a test. A writer is a model that emits a completion. A scorer is not a writer. Hosted chat APIs can cheapen this layer. They cannot produce a graph.",
      "One prompt, N writers, N completions. That is behavioural. “Everyone wrote Achilles” is a fact about the lead. It is not evidence about Feature 2104.",
    ],
    not: "Not evidence about a feature. Not an intervention. Not a graph of another model’s weights.",
    example:
      "GPT-OSS 20B was given “Sing, goddess, the wrath of,” and wrote Achilles. ALLaM 2 7B was given the same lead and also wrote Achilles. Two writers. One graph, of the first run only.",
  },
  {
    id: "choice",
    name: "Choice · vote 1",
    lead: "A person’s vote: I prefer this writer’s response to this prompt.",
    body: [
      "Choice points at runs, never at a feature. It is recorded and attributed. It is not a fact. It answers: which completion do people want in the world? It does not answer: what is Feature 3102?",
      "Alex prefers Gemma’s Black Sea to another model’s Atlantic. That is a judgement of outputs. N models on one lead belong here as N runs, labelled. A tally of choices has no path to evidence.",
    ],
    not: "Not a reading of the feature. Not evidence. Not consensus about meaning. Not a win for the country reading because Gemma wrote the coast.",
    example:
      "On the Iliad line you can prefer GPT-OSS or ALLaM. Both wrote Achilles. Preferring one does not make Feature 2104 wrath, and it does not make it a name-token.",
  },
  {
    id: "reading",
    name: "Reading · vote 2",
    lead: "A person’s hypothesis about the feature. Another person may contest it. Both stay.",
    body: [
      "This is the wiki you already have. It only starts when a completion has a graph, or another measurement of internals. The debate is about the unit, not about which sentence was nicer.",
      "Sam says 3102 is a name-token. That is a judgement of internals. It answers: what is this unit doing? It does not answer: which model should we ship? Choice can occasion the debate. Choice cannot settle it.",
    ],
    not: "Not a fact. Not a model caption. Not a Choice. Not a vote on which writer is better.",
    example:
      "Alex’s country reading and Sam’s name-token sit on Feature 3102. Status is contested because both are present. Contested is not failed. Averaging the two, or counting Choices, would be a different product.",
  },
  {
    id: "evidence",
    name: "Evidence",
    lead: "A number from a test that was run: a contrast, or an intervention. How vote 2 moves.",
    body: [
      "More writers are how vote 1 gets a field to choose in. Contrast and intervention are how vote 2 moves. A comment is not a test. A Choice tally is not a test. Another model’s explanation is not a test.",
      "Understanding — unresolved, contested, supported — follows from which types are present on the article. It is not the average of Choices.",
    ],
    not: "Not a Choice tally. Not a comment. Not an explanation from another model. Not Q&A unless the question is filed as a contrast.",
    example:
      "Silence 3102 and see whether Black Sea still writes. Loud on Tbilisi, quiet on “Georgia is a state in the.” Those numbers attach to a claim. They do not replace it.",
  },
] as const;

export default function DictionaryPage() {
  return (
    <div className="blog-grid is-types-page">
      <h1 className="blog-hej">Dictionary</h1>

      <BlogNav current="dictionary">
        <p className="blog-nav-label">Layers</p>
        <ul>
          {LAYERS.map((layer) => (
            <li key={layer.id}>
              <a href={`#${layer.id}`}>{layer.name.split(" · ")[0]}</a>
            </li>
          ))}
        </ul>
        <p className="blog-nav-label">On the page</p>
        <ul>
          <li>
            <a href="#two-votes">Two votes</a>
          </li>
        </ul>
      </BlogNav>

      <div className="blog-copy">
        <p className="blog-dek">
          Two human votes on two objects. First-order: which response.
          Second-order: what the feature is. A vote on one must not count as a
          vote on the other.
        </p>
        <p>
          You already have two products sharing one word, preference. Split
          them. The feature is the hinge. Models complete. People then do two
          different jobs.
        </p>
        <p>
          The landing line — a Wikipedia for language model preferences and
          human views — is these two votes, in order. Preferences are Choice.
          Views are Reading. The five kinds on Types are the second-order
          article taken apart. Choice is not a sixth kind of that article. It
          lives here, on a different object.
        </p>

        <ol className="blog-kinds">
          {LAYERS.map((layer, index) => (
            <li key={layer.id} id={layer.id} className="blog-kind">
              <p className="blog-kind-num">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <h2>{layer.name}</h2>
                <p>{layer.lead}</p>
                {layer.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
                <p className="blog-kind-not">{layer.not}</p>
                <p className="blog-kind-ex">
                  <span>On this run.</span> {layer.example}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <section className="blog-close" id="two-votes">
          <h2>Two votes</h2>
          <p>
            A feature is not a completion. N completions of one prompt are N
            observations of N writers. Choice is a human vote on responses. It
            has no path to evidence. Reading is a human vote on a feature. It
            has no path to “best model.”
          </p>
          <p>
            Intervention and contrast are how vote 2 moves. More writers are
            how vote 1 gets a field to choose in. Q&A may appear as a test
            prompt in vote 2, not as the canonical first-order lead. A
            model-generated explanation is still not evidence, even if people
            Choice-vote for that explanation.
          </p>
          <p>
            Georgia has one writer. You can see the completion. You cannot
            choose among writers. The Iliad line has two. Preferring Achilles
            from GPT-OSS or from ALLaM does not settle wrath versus name-token.
            That is already a real dictionary. It is the product, named.
          </p>
        </section>

        <p>
          <Link href="/wiki/feature-2104" className="blog-cta">
            Choose a response on the Iliad line →
          </Link>
        </p>
      </div>

      <figure className="blog-plate" aria-label="The two votes">
        <figcaption>Signified</figcaption>
        <ul>
          <li>Feature</li>
          <li>Completion</li>
          <li>Choice</li>
          <li>Reading</li>
          <li>Evidence</li>
        </ul>
      </figure>
    </div>
  );
}
