"use client";

import type { ResearchTile } from "@/lib/research";

type PathStrip = {
  prompt: string;
  output: string;
  unitIds: number[];
  traced: boolean;
};

type Hop = "question" | "continuation";

type Props = {
  tiles: ResearchTile[];
  selectedId: number;
  path: PathStrip;
  compact?: boolean;
  currentHop?: Hop;
  onHop?: (hop: Hop) => void;
  onSelect?: (id: number) => void;
};

function shortPrompt(text: string, compact: boolean) {
  const max = compact ? 18 : 42;
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function TileChip({
  item,
  selected,
  onSelect,
}: {
  item: ResearchTile;
  selected: boolean;
  onSelect?: (id: number) => void;
}) {
  return (
    <button
      type="button"
      className={`rs-tile is-${item.series}${selected ? " is-selected" : ""}`}
      aria-pressed={selected}
      title={item.label}
      onClick={() => onSelect?.(item.id)}
    >
      <em>{item.lemma}</em>
    </button>
  );
}

export function TileMap({
  tiles,
  selectedId,
  path,
  compact = false,
  currentHop,
  onHop,
  onSelect,
}: Props) {
  const groups: { runId: number; kicker: string; items: ResearchTile[] }[] = [];
  for (const tile of tiles) {
    const last = groups.at(-1);
    if (last && last.runId === tile.runId) last.items.push(tile);
    else groups.push({ runId: tile.runId, kicker: tile.kicker, items: [tile] });
  }
  const pathTiles = path.unitIds
    .map((id) => tiles.find((item) => item.id === id))
    .filter((item): item is ResearchTile => Boolean(item));
  const hops = (
    <>
      <button
        type="button"
        className={`rs-tile is-nav${currentHop === "question" ? " is-selected" : ""}`}
        aria-pressed={currentHop === "question"}
        onClick={() => onHop?.("question")}
      >
        <em>Question</em>
      </button>
      <button
        type="button"
        className={`rs-tile is-nav${currentHop === "continuation" ? " is-selected" : ""}`}
        aria-pressed={currentHop === "continuation"}
        onClick={() => onHop?.("continuation")}
      >
        <em>Continuation</em>
      </button>
    </>
  );

  return (
    <section className={`rs-map${compact ? " is-compact" : ""}`} aria-label="Tile map">
      <p className="kicker">{compact ? "Map" : "On this path"}</p>
      {compact ? (
        <p className="rs-path is-line">
          <span className="rs-path-end">{shortPrompt(path.prompt, compact)}</span>
          <span className="rs-path-arrow" aria-hidden="true">
            →
          </span>
          <span className="rs-path-end is-out">{path.output}</span>
        </p>
      ) : (
        <ol className="rs-path">
          <li>
            <span className="rs-path-end">{shortPrompt(path.prompt, compact)}</span>
          </li>
          <li className="rs-path-arrow" aria-hidden="true">
            →
          </li>
          {path.traced && pathTiles.length > 0 ? (
            pathTiles.map((item) => (
              <li key={item.id}>
                <TileChip
                  item={item}
                  selected={item.id === selectedId}
                  onSelect={onSelect}
                />
              </li>
            ))
          ) : (
            <li className="rs-path-gap">Completions</li>
          )}
          <li className="rs-path-arrow" aria-hidden="true">
            →
          </li>
          <li className="rs-path-end is-out">{path.output}</li>
        </ol>
      )}

      <div className="rs-tile-sheet">
        {compact ? (
          <div className="rs-tile-row">
            {hops}
            {tiles.map((item) => (
              <TileChip
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="rs-tile-run">
              <p className="rs-tile-run-name">Trials</p>
              <div className="rs-tile-row">{hops}</div>
            </div>
            {groups.map((group) => (
              <div key={group.runId} className="rs-tile-run">
                <p className="rs-tile-run-name">
                  {group.kicker.replace(/ run$/, "")}
                </p>
                <div className="rs-tile-row">
                  {group.items.map((item) => (
                    <TileChip
                      key={item.id}
                      item={item}
                      selected={item.id === selectedId}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
