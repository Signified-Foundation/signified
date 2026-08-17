import Link from "next/link";
import { WikiFrame } from "@/components/WikiFrame";

export default function MethodPage() {
  return (
    <WikiFrame
      current="method"
      ground="field"
      toc={[
        { href: "#loop", label: "The loop" },
        { href: "#counts", label: "What counts" },
        { href: "#not", label: "What we will not do" },
      ]}
    >
      <article className="article">
        <p className="kicker">Method</p>
        <h1>How a reading is held</h1>
        <p className="lede">
          The computer measures. A person interprets. Another person may contest
          that reading. This wiki stores those as separate objects. A
          representation can be observed. What it signifies remains something to
          be argued over.
        </p>

        <h2 id="loop">The loop</h2>
        <p>
          Observe, interpret, test, contest, revise. An attribution graph is an
          observation, not a verdict. A human interpretation is a claim, not a
          fact. A model-generated explanation is not evidence. A public view that
          meets the model’s is still a reading, not a measurement.
        </p>

        <h2 id="counts">What counts</h2>
        <p>
          Evidence is a numerical result from an experiment that was actually
          run. Notes may accompany the number. They do not replace it.
          Attribution is correlational until an intervention has been run.
        </p>
        <p>
          Talk is for people. A comment can disagree with the article, or bring
          a public view to the same feature. It still is not evidence.
        </p>

        <h2 id="not">What we will not do</h2>
        <p>
          The wiki will not complete the sentence “this feature represents…” for
          you. It will not pick a winner when two readings remain.
        </p>

        <p>
          <Link href="/wiki/feature-3102" className="text-link">
            Open a contested article
          </Link>
        </p>
      </article>
    </WikiFrame>
  );
}
