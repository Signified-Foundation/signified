# Signified

A wiki of contested readings of what happens inside models, and of how those readings meet public ones.

Interpretations stay claims. Evidence stays numbers. Talk is for people, not proof. The article does not pick a winner. Graphs are made elsewhere (Colab / `circuit-tracer`); this site holds the argument.

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
