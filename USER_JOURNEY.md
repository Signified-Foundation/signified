# User journey

Walked 17 August 2026 as two people poking the live wiki.

There is no login. User A and User B are **Alex** (id 1, default) and **Sam** (id 2). You only become Sam by clicking **As Sam** on the article talk box. Session is local (`signified.session.v4`). Same browser, two names.

Routes: `/`, `/articles`, `/wiki` (redirects to articles), `/wiki/method`, `/blog/types`, `/wiki/feature-3102` (Georgia, contested), `/wiki/feature-4404` (caloric, unresolved), `/wiki/feature-9999` (no article).

---

## Journey impression — User A (Alex)

I open `/`. Big **Signified**. A Wikipedia for language model preferences. Three chips from the gallery wall: discover, investigate, interpret. Pretty. I still don’t know what to click.

Oh, a link: **Explore what models prefer.** I click it. I am on `/articles`. “What happened inside the model.” A map of dots. Georgia is already selected. Find box. I type `zzzz`. The map dims. Caption: 0 of N shown. The card under the map goes blank-ish — no article to open. I clear the box. Georgia comes back. That works.

Run filters: Georgia, Iliad, Phlogiston… I click Iliad, then All. Fine. I click the Georgia dot. Card with two blockquotes (Alex / Sam) and **Open the article**. That is the first time the site tells me to *do* something.

I open Georgia.

Loading… then a folio. Lemma **Georgia**. Byline “Alex and Sam · people, not the model.” I did not pick Alex. I already *am* Alex.

**What the model did** is clear: given the sentence, wrote Black Sea. **What a person does** is a list of four links. I click **File a reading**. It jumps to Read. Alex’s country reading is already there. There is no button. The first instruction is a dead end. That is the first sour note.

Oh, a star in the dek. I click it. It jumps to Talk. Sam is already arguing. So the fight exists; I just couldn’t start it from Read.

Graph on the right. Dots. I click a prompt token. Note explains it. No slider. I click Feature 3102. Slider appears. Words: quiet, weak, mixed, active. I click **active**. The word updates. Observed stays a number. **Save this reading** — wait, another “reading”? I click it. It saves. The node now says `active` next to the observation. I thought I had filed a meaning. I have only saved a weight. The page does not show that claim in Read. Two things called reading. I would not know.

I click a neighbour feature that has its own article. **Open the article** in the note. That works. I go back.

**Attach evidence.** Oh, a form. Experiment name is prefilled. Stance: supports / challenges. Rate A and Rate B are empty. I hit Store result. Browser stops me (required). I put 0.8 and 0.1. n is 1. I leave the intervention box off. Store result. It appears: “Alex compared claimed category with unrelated nouns. The feature was active on the first and quiet on the second. Supports the claim. This is correlational, not causal.” That sentence works. I did not run a test. The form let me anyway. That is honest to the schema and fake as science.

I open Attach evidence again, then **File another reading** without cancelling. The evidence form vanishes. One compose slot. Easy to lose a half-filled form.

Talk: **File another reading**. Textarea, min 8 characters. I type `too short` — 9 chars, saves. I type `nope` — 4 chars, browser blocks. Good.

I type a second contest. Save. It shows under Sam’s. The first contest is not my words if I look closely — the canned `copy.contest` is what prints for the first one. My new one prints as I typed it. Edge case: the seed fight is frozen copy, live fights are live text.

Thread already has Sam’s Wikipedia comment and Alex’s reply. **Reply** on Sam’s. The composer moves under that comment. “Alex replying to Sam.” I post `ok`. It nests. Cancel on Reply returns the box to the bottom. That works.

**As a person** — Alex is lit, Sam is sitting there. I almost miss it. I do not click Sam. I am User A. I leave.

Home again. I scroll to Compare on the features list. “The same kind of preference, across models.” I cannot do that on Georgia. Scorers are on the home shelf, Iliad pair, “no number” or a tiny decimal, “not a measurement of the feature.” The list oversold me.

Method: essay. **Open a contested article** goes to Georgia. That is the best first-move on the whole site, and it is buried in Method.

Types: five objects. I learn the rules. I still have not been asked to be a person.

---

## Journey impression — User B (Sam)

I open the same home. Same stall. I go Articles → Georgia. I am Alex. The page does not say “switch.” I am User B in my head and User A in the form.

I look for login. None. I look for a prompt box. None. Good, I guess, but I wanted a job.

I scroll to Talk. **As a person: Alex | Sam.** Oh. A button. I click **Sam**. Alex dims. I am Sam now, only here. The mast still says Signified. Read still shows Alex’s claim. I have not “logged in.” I have flipped a comment switch.

**File another reading** as Sam. I write a third view. It files under Sam. Two Sam contests if I am not careful (seed already gave me one). No “you already contested.” No edit. No delete.

I click **Attach evidence** without looking at As. I am still Sam from the talk toggle. The evidence will be Sam’s, attached to Alex’s claim. That is correct for a contest of numbers, but I did not see my name on the evidence button. Identity lives in the wrong place.

I Reply to Alex’s thread as Sam. Nested reply works. I click Alex, post a comment, click Sam, post another. Two names, one sitting. It feels like a costume trunk, not two users.

I try caloric (`/wiki/feature-4404`). Unresolved. Read has Alex’s caloric line. **File a reading** still missing. “No second reading yet.” **File another reading** is the real job, and it is in Talk. The four-step list still says file a reading first. I would bounce.

I try `/wiki/feature-9999`. Not found. Fine.

I search the atlas for `caloric`. The caloric dot lights, card says no second reading. **Open the article.** That path is good.

I never see **File a reading** (the empty state). Every featured unit already has a meaning. The button I was promised in “What a person does” is a ghost.

I refresh. I am Alex again. The toggle does not persist. My comments as Sam are still there in the thread. The next post will be Alex unless I notice. That is the sharpest edge.

---

## Edge cases poked

| Probe | What happens |
| --- | --- |
| Atlas search `zzzz` | 0 shown. Card can have no useful open. Recover by clearing. |
| `/wiki` | Redirects to `/articles`. Works. |
| `/wiki/feature-9999` | notFound. Works. |
| File a reading on Georgia | Button absent. Jump from the four-step list lands on a filled Read. |
| File a reading on caloric | Still absent (meaning exists). Contest is in Talk. |
| Comment `a` (1 char) | Blocked (min 2). |
| Contest `short` (5 chars) | Blocked (min 8). |
| Contest 8+ chars | Saves. First seed contest displays canned copy, not typed text. Later contests display typed text. |
| Open evidence form, then File another reading | Shared `compose` state. First form discarded. |
| Evidence with empty rates | Native `required` stops submit. |
| Evidence rates 0–1 | Accepted. No proof you ran a test. |
| Intervention checkbox | Toggles the sentence “This was an intervention.” |
| Graph: prompt/output node | Note, no slider. |
| Graph: feature node | Words + slider + Save this reading (a weight, not a meaning). |
| Save graph reading | Authored as current actor. Not listed under Read. |
| Reply | Composer moves under the comment; mast name in “X replying to Y.” |
| Switch Sam, navigate away, come back | Actor resets to Alex. Writes go to the wrong person. |
| Two people, one laptop | Same localStorage. They share a session. They clobber each other. |
| Edit / delete / retract | None. |
| Rate / upvote a view | Promised on home. Not in the article. |
| Compare across models | Promised on home. Not on the article. |
| Prompt an agent | Does not exist. Correct. |

---

## What works

- Home looks like a place. Plate, type, chips from the same wall.
- Atlas is a real finder: search, run filters, card with both readings, open link.
- `/wiki` → `/articles` does not 404 old links.
- Invalid feature slug 404s.
- Article split is right in principle: model did / person does / graph is a fixture.
- “What the model did” (given / wrote) is the clearest object on the page.
- Graph legend (prompt / feature / output) and observed-vs-worded slider are teachable.
- Saving a weight does not overwrite the observation.
- Evidence sentence (who compared X with Y, active/quiet, correlational vs intervention) is plain.
- Talk vs comment vs evidence is labelled, even if the layout fights it.
- Thread reply nesting and “replying to” work.
- Comment/contest length checks work.
- Pending buttons disable on save.
- Method’s “open a contested article” is the one honest onboarding link.
- No chatbot on the door. The founding split survives that.

---

## What we changed after this walk

- Home first move is **Open a contested article** (Georgia). Catalogue stays **All articles**.
- Mast says **You are Alex / Sam**. The choice persists in `localStorage`.
- Read holds both people side by side. Live contest text, not canned copy. **File another reading as Sam** sits there.
- Graph save is **Save this weight as Alex**, not a second “reading.”
- Compose forms are independent. Evidence and a contest can both be open.
- Caloric is a stub: **File a reading** actually shows. Session key bumped to `v5`.
- Atlas search with no hits says **Nothing matches. Clear the search.**
- You can **Retract** your own comments (and nested replies) and your own extra readings.
- Home no longer promises rate / compare-across-models on the article.
- The four-step list matches the page: first reading, or another reading, then thread, then a number.

## What still does not

- **No real login.** Two names, one browser. A demo of disagreement, not two accounts.
- **No edit.** Retract only, and only as the author.
- **Evidence is still a form.** You can store a number you did not measure.
- **Compare across models** is still the Iliad scorer shelf, not an article tool.

---

## First thing each person should be asked to do

**User A:** Home → Open a contested article. You should see **You are Alex**. Read both views. Attach a number, or comment. Weights on the graph are not meanings.

**User B:** Click **Sam** in the mast *before* you type. File another reading beside Alex, or reply in the thread. To see a blank first-claim, open caloric.

Still no agent on the door.
