"use client";

import type { DensityFigure } from "@/lib/research";

const WIDTH = 640;
const HEIGHT = 168;
const LEFT = 28;
const RIGHT = 12;
const TOP = 18;
const BOTTOM = 28;

type Props = {
  figure: DensityFigure;
  activeId?: number | null;
  compact?: boolean;
  onSelect?: (id: number) => void;
};

export function DensityPlot({
  figure,
  activeId,
  compact = false,
  onSelect,
}: Props) {
  const height = compact ? 108 : HEIGHT;
  const innerW = WIDTH - LEFT - RIGHT;
  const innerH = height - TOP - BOTTOM;
  const max = Math.max(
    1,
    ...figure.bins.flatMap((bin) => [bin.continuation, bin.other]),
  );
  const step = innerW / figure.bins.length;
  const bar = Math.max(2, step * 0.42);

  function xAt(log10: number) {
    const first = figure.bins[0]?.log10 ?? -5;
    const last = figure.bins.at(-1)?.log10 ?? -0.4;
    return LEFT + ((log10 - first) / (last - first)) * innerW;
  }

  return (
    <figure className="rs-den">
      <p className="kicker">Log feature density</p>
      <svg
        className="rs-den-svg"
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label="How often units fire, log ten scale. Green is the continuation. Slate is the other catalogued runs."
      >
        <line
          className="rs-den-axis"
          x1={LEFT}
          y1={TOP + innerH}
          x2={LEFT + innerW}
          y2={TOP + innerH}
        />
        {figure.bins.map((bin, index) => {
          const x = LEFT + index * step + step * 0.12;
          const hA = (bin.continuation / max) * innerH;
          const hB = (bin.other / max) * innerH;
          return (
            <g key={bin.log10}>
              <rect
                className="rs-den-a"
                x={x}
                y={TOP + innerH - hA}
                width={bar}
                height={hA}
              />
              <rect
                className="rs-den-b"
                x={x + bar * 0.55}
                y={TOP + innerH - hB}
                width={bar}
                height={hB}
              />
            </g>
          );
        })}
        {figure.marks.map((mark) => {
          const x = xAt(mark.log10);
          const on = mark.id === activeId;
          return (
            <g
              key={mark.id}
              className={`rs-den-mark is-${mark.series}${on ? " is-on" : ""}${
                onSelect ? " is-pick" : ""
              }`}
              transform={`translate(${x}, ${TOP + innerH})`}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              onClick={() => onSelect?.(mark.id)}
              onKeyDown={(event) => {
                if (!onSelect) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(mark.id);
                }
              }}
            >
              {on && (
                <line
                  className="rs-den-stem"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-innerH * 0.82}
                />
              )}
              <path d={on ? "M0 0 L-6 11 L6 11 Z" : "M0 0 L-4 8 L4 8 Z"} />
              <text y={on ? 22 : 20}>{mark.label}</text>
            </g>
          );
        })}
        <text className="rs-den-x" x={LEFT} y={height - 2}>
          rare
        </text>
        <text
          className="rs-den-x"
          x={LEFT + innerW}
          y={height - 2}
          textAnchor="end"
        >
          log₁₀ density
        </text>
      </svg>
      <figcaption>
        <span className="rs-swatch is-a">Continuation</span>
        <span className="rs-swatch is-b">Other runs</span>
      </figcaption>
    </figure>
  );
}
