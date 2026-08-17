#!/usr/bin/env python3
"""Collapse a circuit-tracer / Neuronpedia graph JSON into Signified’s schematic.

The raw export is {metadata, qParams, nodes, links} and is typically 1–20 MB.
Signified’s one-page schematic needs a handful of claimable nodes. This script
keeps supernodes (or the highest-influence features) and the prompt/output tokens.

Usage:
  python3 scripts/convert_neuronpedia_graph.py \\
    data/gemma-fact-dallas-austin.json \\
    data/dallas_austin_signified.json
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def parse_layer_feat(node_id: str) -> tuple[int | None, int | None]:
    m = re.match(r"^(\d+)_(\d+)_\d+$", node_id)
    if not m:
        return None, None
    return int(m.group(1)), int(m.group(2))


def convert(raw: dict, max_features: int = 6) -> dict:
    meta = raw["metadata"]
    nodes = {n["node_id"]: n for n in raw["nodes"]}
    prompt_tokens = list(meta["prompt_tokens"])
    prompt = meta.get("prompt", "")

    logits = [n for n in raw["nodes"] if n["feature_type"] == "logit"]
    logits.sort(key=lambda n: n.get("token_prob") or 0, reverse=True)
    target = next((n for n in logits if n.get("is_target_logit")), logits[0] if logits else None)
    output = "Austin"
    if target and target.get("clerp"):
        m = re.search(r'Output "([^"]*)"', target["clerp"])
        if m:
            output = m.group(1).strip() or output

    supernodes = raw.get("qParams", {}).get("supernodes") or []
    groups: list[tuple[str, list[str]]] = []
    if supernodes:
        for group in supernodes:
            label, *ids = group
            groups.append((label, ids))
    else:
        features = [
            n
            for n in raw["nodes"]
            if n["feature_type"] == "cross layer transcoder" and n.get("influence")
        ]
        features.sort(key=lambda n: n["influence"], reverse=True)
        for n in features[:max_features]:
            groups.append((f"L{n['layer']} F{n['feature']}", [n["node_id"]]))

    schematic_nodes = []
    token_ids = []
    interesting_ctx = set()
    for _, ids in groups:
        for nid in ids:
            if nid in nodes:
                interesting_ctx.add(nodes[nid]["ctx_idx"])

    skip = {"<bos>", "<eos>"}
    token_slots = []
    for ctx, tok in enumerate(prompt_tokens):
        if tok in skip:
            continue
        if interesting_ctx and ctx not in interesting_ctx:
            continue
        token_slots.append((ctx, tok.strip() or tok))

    if len(token_slots) > 5:
        token_slots = token_slots[:5]

    y_step = 80
    for i, (ctx, label) in enumerate(token_slots):
        nid = f"tok-{ctx}"
        token_ids.append((nid, ctx))
        schematic_nodes.append(
            {"id": nid, "kind": "token", "label": label, "x": 72, "y": 48 + i * y_step}
        )

    feature_ids = []
    for i, (label, ids) in enumerate(groups[:max_features]):
        members = [nodes[nid] for nid in ids if nid in nodes]
        if not members:
            continue
        best = max(members, key=lambda n: n.get("influence") or 0)
        layer, feat = parse_layer_feat(best["node_id"])
        if feat is None:
            feat = best.get("feature") or 0
            layer = int(best["layer"]) if str(best.get("layer", "")).isdigit() else 0
        nid = f"feat-{best['node_id']}"
        feature_ids.append((nid, set(m["node_id"] for m in members), set(m["ctx_idx"] for m in members)))
        schematic_nodes.append(
            {
                "id": nid,
                "kind": "feature",
                "feature_id": feat,
                "layer": layer or 0,
                "label": label,
                "attribution": round(best.get("influence") or 0, 3),
                "activation": round(best.get("activation") or 0, 2),
                "source_node_id": best["node_id"],
                "x": 320,
                "y": 48 + i * y_step,
            }
        )

    out_id = "tok-output"
    schematic_nodes.append(
        {"id": out_id, "kind": "output", "label": output, "x": 560, "y": 48 + (len(feature_ids) // 2) * y_step}
    )

    weights = {}
    for link in raw["links"]:
        key = (link["source"], link["target"])
        weights[key] = weights.get(key, 0) + abs(link["weight"])

    edges = []
    seen = set()
    for tok_id, ctx in token_ids:
        for feat_id, member_ids, member_ctx in feature_ids:
            if ctx not in member_ctx:
                # still connect if any embedding at this ctx hits a member
                pass
            score = 0.0
            for src, tgt in weights:
                if tgt in member_ids and (src.startswith("E_") and src.endswith(f"_{ctx}")):
                    score += weights[(src, tgt)]
                if src in member_ids and tgt in member_ids:
                    continue
            if score <= 0 and ctx in member_ctx:
                score = 0.2
            if score <= 0:
                continue
            key = (tok_id, feat_id)
            if key in seen:
                continue
            seen.add(key)
            edges.append({"source": tok_id, "target": feat_id, "weight": round(min(score / 20, 1.0), 2) or 0.1})

    for feat_id, member_ids, _ in feature_ids:
        score = 0.0
        if target:
            for src, tgt in weights:
                if src in member_ids and tgt == target["node_id"]:
                    score += weights[(src, tgt)]
        if score <= 0:
            score = 0.15
        edges.append(
            {
                "source": feat_id,
                "target": out_id,
                "weight": round(min(score / 5, 1.0), 2) or 0.1,
            }
        )

    return {
        "id": meta.get("slug", "imported"),
        "note": "Schematic derived from a circuit-tracer / Neuronpedia export. Not a substitute for the full graph.",
        "prompt": prompt.replace("<bos>", "").strip(),
        "output": output,
        "prompt_tokens": [t for t in prompt_tokens if t not in skip],
        "output_tokens": [f" {output}"],
        "model": meta.get("scan", "gemma-2-2b"),
        "source_graph": meta.get("slug"),
        "nodes": schematic_nodes,
        "edges": edges,
    }


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__.strip(), file=sys.stderr)
        sys.exit(1)
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    raw = json.loads(src.read_text())
    out = convert(raw)
    dst.write_text(json.dumps(out, indent=2) + "\n")
    print(f"wrote {dst} ({len(out['nodes'])} nodes, {len(out['edges'])} edges)")


if __name__ == "__main__":
    main()
