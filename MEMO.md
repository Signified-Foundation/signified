# Signified

Internal founding memo — 13 August 2026

Signified is an open collaborative layer for inspecting AI behaviour, testing interpretations of model internals, and recording the evidence and contestation through which those interpretations change. It is not a chatbot, not another model, and not a better graph renderer.

The unit of the product is an evolving epistemic object: an observation, plus interpretations, evidence, provenance, experiments, and disagreement.

## The loop

```
OBSERVE → INTERPRET → TEST → CONTEST → REVISE
```

These stages must stay distinct.

- A model-generated explanation is not evidence.
- A human interpretation is not a fact.
- An attribution graph is not automatically causal.
- A causal intervention is evidence, but not a complete explanation.

The computer produces observations and measurements. A person proposes what those measurements may mean. Another person may contest that reading. The system stores both, together with whatever experiment was actually run.

That is the whole product.

## The $0 stack

The first version stands on existing open-source work. Anthropic’s `circuit-tracer` already computes attribution graphs, visualises them, allows annotation, and supports feature interventions. Gemma 2 2B is a supported model; the tutorial runs on Colab’s free GPU tier.

| Piece | Choice |
| --- | --- |
| Model | Gemma 2 2B |
| Circuit tracing | `circuit-tracer` |
| Inspection | TransformerLens, where needed |
| Features / transcoders | Public GemmaScope / circuit-tracer weights |
| Experiments | Colab free tier, or a local machine |
| Frontend | Next.js |
| Backend | Python, SQLite |
| Graphs | JSON files |
| Auth | None |
| Hosting | Local |

Do not rebuild the attribution-graph UI. Embed or launch `circuit-tracer`’s existing browser visualiser. Signified’s job begins when someone selects a node and states a claim.

Hosted chat APIs such as Groq can later cheapen behavioural observation (prompt in, text out). They cannot produce attribution graphs, hidden states, or feature interventions. They are out of v1.

## The one-page product

Build exactly one page: **What happened inside the model?**

```
                    SIGNIFIED
                       │
             ┌─────────┴─────────┐
             │                   │
          PROMPT              QUESTION
             │                   │
             ▼                   ▼
          GEMMA 2B         "Why did it do this?"
             │
             ▼
      ATTRIBUTION GRAPH
             │
       ┌─────┴─────┐
       ▼           ▼
    FEATURE A   FEATURE B
       │           │
       └─────┬─────┘
             ▼
       INTERPRETATION
             │
       ┌─────┴─────┐
       ▼           ▼
    SUPPORT      CONTEST
       │           │
       └─────┬─────┘
             ▼
          EVIDENCE
             │
             ▼
       CURRENT VIEW
```

Canonical demo:

1. Prompt: `The capital of Australia is`
2. Output: `Canberra`
3. Trace — the attribution graph appears.
4. Select a node, e.g. Feature 18472.
5. Write an interpretation: “I think this represents Australian geography.”
6. A second person challenges: “I think this is capital-city retrieval.”
7. Run a contrastive experiment. Store the numerical result as evidence. Keep both interpretations visible.

The page does not force a winner.

## Schema

SQLite is enough. There is no graph database in v1.

**Objects**

`Model` · `Run` · `Observation` · `Feature` · `Claim` · `Evidence` · `Interpretation` · `Challenge` · `User`

**Edges**

```
Observation  → has          → AttributionGraph
Claim        → interprets   → Feature
Evidence     → supports     → Claim
Evidence     → challenges   → Claim
Claim        → challenges   → Claim
Claim        → derived_from → Run
```

JSON holds the raw graph and experiment artefacts. The database holds metadata and relationships.

A claim should read as a scientific hypothesis, not a post:

> **Claim:** Feature 18472 represents Australian geographic entities.
> **Status:** Contested
> **Evidence:** 3 experiments, 2 replications, 1 major counterexample
> **Alternative:** Capital-city retrieval
> **Current assessment:** Unresolved

## What the computer may do, and what it may not

This is the constraint that keeps the product honest.

**Computer produces observation.** Feature 4812 has attribution 0.37 to token X.

**Human proposes interpretation.** “I think this feature represents geographic entities.”

**System generates experiment.** Test prompts containing geographic versus non-geographic entities.

**Computer produces evidence.** Activation rate: 84% versus 11%.

**Another human contests it.** “I think this is actually capital-city retrieval.”

**System records both.**

Do not build “the model looks at the graph and tells you what it means.” That adds another unverifiable interpretation and collapses the distinction the platform exists to preserve. Machine-generated claims, if they appear later, must be labelled as such and must never count as evidence.

Attribution is correlational until an intervention has been run. The interface must say so.

## Position

`circuit-tracer` is the measurement layer. Neuronpedia is an existing public feature ecosystem. Signified is neither.

The differentiator is:

> Interpretations are not facts. They are objects that can be supported, challenged, tested, replicated, and revised.

A representation can be observed. What it signifies remains something to be argued over. That is the name.

## Success

A local website, at roughly zero cash cost, where one person can enter a prompt, run Gemma 2 2B, see an attribution graph, select a feature, write an interpretation, attach an experiment, and have somebody else contest it with a stored result.

The scarce resource is engineering time, not infrastructure.

## What we do not build yet

Preferences and judgement weighting. Reputation. Multi-model comparison. A generalised discourse-graph UI. Cross-model feature mapping. Automated discovery of contested claims. Accounts, search, and public hosting.

## What we build next

The one page, the SQLite schema, a fixture or Colab-produced graph for the Canberra demo, Support / Challenge / Test, and provenance from claim back to run.

That is already a real product.
