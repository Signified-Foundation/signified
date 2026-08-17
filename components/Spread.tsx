import type { ReactNode } from "react";

type Reading = {
  text: string;
  by?: string;
};

type Props = {
  featureId: string;
  prompt?: string;
  output?: string;
  left: Reading;
  right: Reading | null;
  hold?: string;
  compact?: boolean;
  children?: ReactNode;
};

export function Spread({
  featureId,
  prompt,
  output,
  left,
  right,
  hold,
  compact = false,
  children,
}: Props) {
  return (
    <div className={`spread${compact ? " is-compact" : ""}`}>
      {(prompt || output) && (
        <p className="spread-prompt">
          {prompt && <span>{prompt}</span>}
          {output && <span className="output">{output}</span>}
        </p>
      )}
      <p className="spread-id">{featureId}</p>
      <div className="spread-pages">
        <div className="spread-page is-a">
          {compact ? (
            <p className="spread-claim">{left.text}</p>
          ) : (
            <h1 className="spread-claim">{left.text}</h1>
          )}
          {left.by && <p className="spread-by">{left.by}</p>}
        </div>
        <div className="spread-page is-b">
          {right ? (
            <>
              <p className="spread-claim">{right.text}</p>
              {right.by && <p className="spread-by">{right.by}</p>}
            </>
          ) : (
            <p className="spread-empty">No second reading yet.</p>
          )}
        </div>
      </div>
      {hold && <p className="spread-hold">{hold}</p>}
      {children}
    </div>
  );
}
