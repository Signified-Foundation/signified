"use client";

import { PointerEvent, useCallback, useState } from "react";
import { HalftoneDots } from "@paper-design/shaders-react";

type Props = {
  image: string;
  label: string;
  className?: string;
};

export function HalftonePlate({ image, label, className }: Props) {
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);

  const onMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    setLens({
      x: event.clientX - box.left,
      y: event.clientY - box.top,
    });
  }, []);

  return (
    <figure
      className={`plate${className ? ` ${className}` : ""}`}
      aria-label={`${label} Hover to magnify the photograph.`}
      onPointerMove={onMove}
      onPointerLeave={() => setLens(null)}
    >
      <HalftoneDots
        className="plate-shader"
        image={image}
        colorBack="#d4d4d4"
        colorFront="#ffffff"
        originalColors
        type="holes"
        grid="square"
        inverted={false}
        size={0.44}
        radius={1.55}
        contrast={0.01}
        grainMixer={0}
        grainOverlay={0}
        grainSize={0.5}
        fit="cover"
        width="100%"
        height="100%"
      />
      <div
        className={`plate-reveal${lens ? " is-on" : ""}`}
        style={
          lens
            ? { clipPath: `circle(var(--lens) at ${lens.x}px ${lens.y}px)` }
            : undefined
        }
        aria-hidden="true"
      >
        <img
          src={image}
          alt=""
          style={
            lens
              ? { transformOrigin: `${lens.x}px ${lens.y}px` }
              : undefined
          }
        />
      </div>
      {lens && (
        <div
          className="plate-lens"
          style={{ left: lens.x, top: lens.y }}
          aria-hidden="true"
        />
      )}
    </figure>
  );
}
