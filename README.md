# Signified

Signified is a wiki about AI behavior. Read examples of what models do, examine the evidence, and see how people explain the results.

Each entry collects model responses, measurements, proposed explanations, and discussion. Contributors can question an explanation and suggest experiments to test it. Graphs are imported from Colab or `circuit-tracer`.

Type: **Montaga** for titles and roman serif, **Newsreader** for italics. No mono.

## Run

One process. Next.js is the wiki. Claims, challenges, evidence, and talk are stored in the browser.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/` — landing: several contested entries, then the rest by run
- `/wiki` — article index
- `/wiki/feature-3102` — Georgia (country versus state)
- `/wiki/method` — how a reading is held
- `/blog/types` — the five kinds of object the wiki holds

The Colab notebook in `notebooks/` is the measurement workshop. It is not the website. Convert a Neuronpedia / circuit-tracer export with `scripts/convert_neuronpedia_graph.py`.

## Deploy

This repo is a Next.js app at the root. Connect it to Vercel and deploy. Do not set a subdirectory as the root.

Edits you make on the live site stay in that browser. They are not shared. The seeded arguments ship with the site.
