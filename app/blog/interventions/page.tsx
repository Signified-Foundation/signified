import type { Metadata } from "next";
import Link from "next/link";
import { BlogNav } from "@/components/BlogNav";

export const metadata: Metadata = {
  title: "Interventions · Signified",
  description:
    "A completion is an observation. An intervention is a test. Other models are other writers. A question is not a lead.",
};

const CLAIMS = [
  {
    id: "intervention",
    name: "Intervention ≠ extra completion",
    lead: "A completion is an observation. An intervention is a test.",
    body: [
      "The catalog is honest about what it has. A writer was given a public sentence. It wrote the next words. A fixture graph shows which prompt tokens and which internal units wrote into that output. Alex files a reading. Sam files another. Evidence is empty. The tests that would pull the two readings apart have been named. They have not been run.",
      "On Feature 3102 the completion is Georgia is a country in the Caucasus region on the coast of the, then Black Sea. The path from the name through 3102 into that coast is a fact about this run. It is not a cause, and it is not a category. Country versus name-token is still two hypotheses about the same path.",
      "An intervention asks the computer to do something to the unit and to measure what happens. Silence 3102; see whether Black Sea still writes. Clamp it; see whether the Caucasus frame moves and the American frame does not. Steer it up; see whether the model starts talking wine and the range, or any famous Georgia. Those are numbers. They attach to a claim. They do not replace it. Attribution is correlational until that has been run.",
    ],
    not: "Not another sample at temperature. Not a second writer on the same lead. Not a comment that names Atlanta.",
    example:
      "A contrastive prompt set is the cheaper cousin: same unit, two frames, two activation rates. Loud on Tbilisi, quiet on “Georgia is a state in the.” Correlational, not causal. Still a test. Still missing from the wiki. Naming Atlanta in talk is not running Atlanta.",
  },
  {
    id: "other-model",
    name: "Other model ≠ same feature",
    lead: "N completions from N APIs are N observations of N writers. They are not N graphs of one feature.",
    body: [
      "Why not give the same lead to N models? You can. That is 1→N at the behaviour layer. Gemma writes Black Sea. Another writer writes something else, or the same thing. The Iliad run now has a small version of this: GPT-OSS 20B wrote Achilles, and so did ALLaM 2 7B. Other open models only scored that pair. They did not write, and they did not produce a graph.",
      "Hosted chat APIs can cheapen prompt-in, text-out. They cannot produce hidden states, feature interventions, or an attribution graph. Feature 3102 lives on Gemma’s run. Feature 2104 lives on GPT-OSS. Another model’s completion does not tell you whether that unit is the country, or wrath. There is no shared feature id across weights. Cross-model feature mapping is parked in the founding memo for that reason.",
      "A different 1→N is N samples from the same writer: temperature, several completions of one lead. That is a distribution over outputs. Still not an intervention unless you also measure the unit on each sample. The article would then hold several observations of one model, not a verdict.",
    ],
    not: "Not a chorus that confirms Alex. Not evidence about 3102. “Everyone wrote Black Sea” is a fact about the prompt.",
    example:
      "Other models belong on the page as other runs, labelled writers, each with their own graph if you can make one. ALLaM has a completion and no graph. Preferring it is Choice. It is not a reading of Feature 2104.",
  },
  {
    id: "question",
    name: "Question ≠ lead",
    lead: "The wiki’s prompts are public sentences the model continues. A question is a different task.",
    body: [
      "Georgia is a country in the Caucasus region on the coast of the. That is a public utterance. Wikipedia’s gloss of the same sentence belongs in talk. The model’s job is to continue it. Next-token on a lead is close to the pretraining move the graph is about.",
      "A question — What sea does Georgia sit on? — is a different object. It pulls in answerhood, often a chat template, sometimes a refusal, often a little essay. Then you do not know whether 3102 is the country, or a geography-QA slot, or the habit of being helpful. The fight you wanted, country versus name-token, is no longer the fight you are having.",
      "Q&A also tempts the forbidden sentence: the model explains why it answered Black Sea. That caption is not evidence. The wiki exists so that sentence cannot migrate into the evidence list.",
    ],
    not: "Not the canonical observation. Not a shortcut to meaning. Not evidence, even if the answer is correct.",
    example:
      "Q&A can still appear as a test, not as the canonical run. If 3102 is the historical country, a state-framed question should go quieter than a Caucasus-framed one. Store the two rates. That is contrast, with a question mark on the prompt. The article’s observation stays the lead and the completion.",
  },
] as const;

export default function InterventionsPage() {
  return (
    <div className="blog-grid is-types-page">
      <h1 className="blog-hej">After</h1>

      <BlogNav current="interventions">
        <p className="blog-nav-label">Claims</p>
        <ul>
          {CLAIMS.map((claim) => (
            <li key={claim.id}>
              <a href={`#${claim.id}`}>{claim.name.split(" ≠ ")[0]}</a>
            </li>
          ))}
        </ul>
        <p className="blog-nav-label">On the page</p>
        <ul>
          <li>
            <a href="#leave">What remains</a>
          </li>
        </ul>
      </BlogNav>

      <div className="blog-copy">
        <p className="blog-dek">
          Completions can be 1→N. That is behavioural. An intervention is a
          test of a unit. A question is a different task unless it is filed as
          a contrast.
        </p>
        <p>
          The computer may complete, and later it may be intervened on. A
          person interprets. Another person contests. Until an intervention or
          a stored contrast sits under Georgia, the wiki is a catalog of
          contested completions. That is already a real object. It is not yet
          a test.
        </p>

        <ol className="blog-kinds">
          {CLAIMS.map((claim, index) => (
            <li key={claim.id} id={claim.id} className="blog-kind">
              <p className="blog-kind-num">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <h2>{claim.name}</h2>
                <p>{claim.lead}</p>
                {claim.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
                <p className="blog-kind-not">{claim.not}</p>
                <p className="blog-kind-ex">
                  <span>On this run.</span> {claim.example}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <section className="blog-close" id="leave">
          <h2>What remains</h2>
          <p>
            circuit-tracer is the measurement layer for the intervention.
            Signified’s job is to store the number next to the two readings,
            and not to pick a winner. Other models belong on the page as other
            runs. Q&A belongs as a contrast, if it belongs at all.
          </p>
          <p>
            Choice, on the Iliad line, is the cheap first-order field: two
            writers, one word, a vote that must not migrate into evidence.
            Reading stays second-order. The tests are still named, not run.
          </p>
        </section>

        <p>
          <Link href="/blog/dictionary" className="blog-cta">
            The two votes, named →
          </Link>
        </p>
      </div>

      <figure className="blog-plate" aria-label="After the completion">
        <figcaption>Signified</figcaption>
        <ul>
          <li>Completion</li>
          <li>Contrast</li>
          <li>Intervention</li>
          <li>Other model</li>
          <li>Question</li>
        </ul>
      </figure>
    </div>
  );
}
