import Link from "next/link";
import { WikiFrame } from "@/components/WikiFrame";

export default function MethodPage() {
  return (
    <WikiFrame
      current="method"
      ground="field"
      toc={[
        { href: "#loop", label: "Developing an explanation" },
        { href: "#counts", label: "Recording evidence" },
        { href: "#not", label: "Open questions" },
      ]}
    >
      <article className="article">
        <p className="kicker">Method</p>
        <h1>How the wiki works</h1>
        <p className="lede">
          Each entry starts with something a model did. It brings together the
          prompt, the response, and any measurements of the model’s internal
          activity. Contributors use these to propose and discuss explanations.
        </p>

        <h2 id="loop">Developing an explanation</h2>
        <p>
          A contributor writes a claim about what an internal feature might
          represent. Other contributors can question it, offer another
          explanation, or suggest an experiment. Results from those experiments
          help people revise their claims.
        </p>
        <p>
          You can also vote for the response you prefer. Response votes record
          preferences; claim votes record support for an explanation. Read about{" "}
          <Link href="/blog/dictionary" className="text-link">
            how voting works
          </Link>
          .
        </p>

        <h2 id="counts">Recording evidence</h2>
        <p>
          Evidence records a measured result and the experiment that produced
          it. An attribution graph shows connections between internal activity
          and the response. Testing whether a feature causes a change requires
          an intervention: changing that feature and measuring the effect.
          Read more about{" "}
          <Link href="/blog/interventions" className="text-link">
            testing model behavior
          </Link>
          .
        </p>
        <p>
          The discussion holds questions, alternative explanations, and
          relevant context. Community Notes adds context written by an AI
          agent. Experiment results have their own place in the evidence list.
        </p>

        <h2 id="not">Open questions</h2>
        <p>
          Contributors write the explanations attached to each feature. When
          several explanations remain plausible, the entry keeps them available
          alongside the evidence and the tests people have suggested.
        </p>

        <p>
          <Link href="/research" className="text-link">
            Open the wiki
          </Link>
        </p>
      </article>
    </WikiFrame>
  );
}
