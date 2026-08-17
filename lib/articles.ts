import type { GraphNode } from "./types";

export type ArticleCopy = {
  title: string;
  about: string;
  pull: string;
  lead: string[];
  observation: string;
  inspect: string;
  claim?: string;
  contest?: string;
};

const PUBLIC =
  "The prompt is a public sentence, the kind of lead Wikipedia would also print. That gloss belongs in talk. It is not the article.";

export const ARTICLES: Record<number, ArticleCopy> = {
  3102: {
    title: "Feature 3102",
    about:
      "Feature 3102 is the Georgia unit on this run. Alex reads it as the historical country: wine, church, the range. Sam reads it as a name-token that would also complete Atlanta in an American frame. Same word, different world. Country versus state, on purpose.",
    pull: "Country versus state, on purpose.",
    lead: [
      "Gemma 2 2B was given a public sentence: “Georgia is a country in the Caucasus region on the coast of the.” The fixture records Black Sea.",
      "Alex reads Feature 3102 as the country. Sam reads it as a name-token. It would fire on Georgia, USA. Both remain. The article does not pick a winner.",
    ],
    observation: `The prompt names Georgia and the Caucasus and asks for a coast. Feature 3102 takes its strongest path from Georgia into Black Sea. ${PUBLIC}`,
    inspect:
      "This is the feature the article is about. It sits on the name Georgia. Whether that is the Caucasus republic, or any famous Georgia, is the disagreement below.",
    claim:
      "Alex reads Feature 3102 as the historical country: wine, church, the range. On this view it should go quiet on “Georgia is a state in the,” and stay loud on Tbilisi, qvevri, Kartvelian names.",
    contest:
      "Sam reads it as a name-token. The same string completes an American frame with Atlanta. Country is one completion of Georgia, not the category.",
  },
  3108: {
    title: "Feature 3108",
    about:
      "Feature 3108 is tied to Caucasus on the Georgia run. Alex reads it as the mountain world the sentence is about. Sam reads it as a region-slot: Balkans, Andes, Alps would do as well.",
    pull: "Both remain.",
    lead: [
      "Feature 3108 takes a path from Caucasus into Black Sea. Alex reads it as the range. Sam reads it as the noun that follows “region.”",
    ],
    observation:
      "The word Caucasus is the only range named. That is a thin basis for a mountain-world reading, and a thin basis for a slot. The graph shows a path. It does not show a geography.",
    inspect:
      "If this is the Alpide belt as a world, swapping in “Balkans” should go quiet. If this is a region-slot, it should not. That test has been named. It has not been run as an intervention.",
    claim:
      "Alex reads Feature 3108 as the mountain world the sentence is about, not a region-slot. Caucasus here is a place with a history, not a blank after “in the.”",
    contest:
      "Sam reads it as a place-noun after “region.” The frame is encyclopedic. Balkans, Andes, Alps would light it up the same way.",
  },
  2104: {
    title: "Feature 2104",
    about:
      "Feature 2104 is the unit most strongly tied to wrath on the Iliad run. Alex reads it as a detector of heroic anger — μῆνις, the poem’s first word. Sam reads it as a completion cue for “Achilles,” not wrath as such. Both remain. The article does not pick a winner.",
    pull: "Both remain. The article does not pick a winner.",
    lead: [
      "When GPT-OSS 20B was given “Sing, goddess, the wrath of,” the fixture records Achilles. On the attribution graph for that run, Feature 2104 takes its strongest path from wrath into that completion.",
      "Alex reads the unit as a detector of heroic anger, the poem’s first word. Sam reads it as a completion cue for Achilles: the model would write the name whether or not it had a view of μῆνις. Both remain. The article does not pick a winner.",
    ],
    observation:
      "The prompt is the opening of the Iliad in English. Feature 2104 takes a strong path from wrath and writes into Achilles. That is the observation. It is not yet a meaning. ALLaM 2 7B was given the same lead and also wrote Achilles. That is another writer, not another graph of this unit. Other open models scored the GPT-OSS pair; those numbers are not measurements of this feature.",
    inspect:
      "This is the feature the article is about. It sits between wrath and Achilles. Whether that is the anger the poem names, or only the habit of finishing the line, is the disagreement below.",
    claim:
      "Alex reads Feature 2104 as a detector of heroic anger. μῆνις is the first word of the poem. On this view the unit is about wrath: it should fire when the prompt asks for anger, and stay quiet when the same line is completed by a name-token with the wrath stripped out.",
    contest:
      "Sam reads the same unit as a completion cue for Achilles. The English line is famous. A feature that writes Achilles here would also write it after “the wrath of,” even if the model had no view of the poem. Wrath is a cue, not the category.",
  },
  5560: {
    title: "Feature 5560",
    about:
      "Feature 5560 is the Paris unit on the Iliad run. Alex reads it as the prince who awards the apple: desire, not a place. Sam reads it as a name-token that would fire on Paris, France in a capital frame. Same word, different argument. Person versus city, on purpose.",
    pull: "Person versus city, on purpose.",
    lead: [
      "Paris is not a token in the prompt. Feature 5560 still sits on this fixture graph, with a path from goddess — the apple among goddesses — into Achilles.",
      "Alex reads it as the Trojan prince: desire, not a place. Sam reads it as a name-token. It would fire on Paris, France in a capital frame. That is the interesting fight. The article does not pick a winner.",
    ],
    observation:
      "On this run the prompt never names Paris. The graph still draws a path from goddess through this unit into Achilles. That is a thin basis for a person-reading, and a thin basis for a city-reading. The graph shows a path. It does not show which Paris.",
    inspect:
      "The two readings come apart on a capital-of frame that never mentions Troy. If this is the prince, that prompt should go quiet. If this is a name-token, Paris, France should light it up. Nobody has posted that contrast as an intervention.",
    claim:
      "Alex reads Feature 5560 as the prince who awards the apple. Desire, not a place. The path from goddess is the exhibit: the judgement among goddesses, not a capital city. Paris here is a person.",
    contest:
      "Sam reads it as a name-token. The same string completes “the capital of France is.” A feature that fires on Paris the Trojan would, on this view, also fire on Paris the city. Geography is waiting in the next frame. That is why the fight belongs here.",
  },
  7781: {
    title: "Feature 7781",
    about:
      "Feature 7781 is the Helen unit on the Iliad run. Alex reads it as the contested cause of the war. Sam reads it as a retrieval slot for “of Troy.” Desire, blame, fame. No second geography lemma.",
    pull: "Desire, blame, fame. No second geography lemma.",
    lead: [
      "Feature 7781 takes a path from of into Achilles. Alex reads it as Helen: the contested cause of the war. Sam reads it as a retrieval slot for “of Troy.”",
      "The article is contested. The disagreement is not about a city. It is about whether the unit holds a person as cause, or only the genitive that fetches her.",
    ],
    observation:
      "The word of is the hinge after wrath. Feature 7781 is the unit most attached to it on this graph, and a quieter writer into Achilles than wrath. Helen is not named in the prompt.",
    inspect:
      "A cause-reading predicts fire on blame and fame, not on place. A retrieval-slot reading predicts fire on “of Troy,” “of Argos,” any genitive that fetches a Homeric name. Distinguishing those needs prompts that never mention Helen.",
    claim:
      "Alex reads Feature 7781 as Helen, the contested cause of the war. Desire, blame, fame. On this view the unit is about a person as the argument of the poem, not a slot that fills “of X.”",
    contest:
      "Sam reads it as a retrieval slot for “of Troy.” The strongest path is from of, not from wrath. Helen is what English often puts after that genitive. That does not make the unit about Helen.",
  },
  4402: {
    title: "Feature 4402",
    about:
      "Feature 4402 is the phlogiston unit. Alex reads it as a discarded ontology: the thing they thought fire was. Sam reads it as a “wrong theory” slot — ether, caloric, humours would do as well. Arcane, and everyone can enter.",
    pull: "The thing they thought was there, and wasn’t.",
    lead: [
      "GPT-OSS 20B was given a public sentence: “Phlogiston was the substance supposed to be released in.” The fixture records combustion.",
      "Alex reads the unit as the old ontology of fire. Sam reads it as the encyclopedia’s slot for superseded theories. Both remain.",
    ],
    observation: `The prompt names phlogiston and asks what it was supposed to be released in. Feature 4402 takes its strongest path from that name into combustion. ${PUBLIC}`,
    inspect:
      "If this is the ontology, it should go quiet on caloric and ether. If this is a wrong-theory slot, those names should light it up. That is the disagreement.",
    claim:
      "Alex reads Feature 4402 as a discarded ontology: the substance they thought combustion released. On this view the unit is about fire as it was wrongly understood, not about the genre of scientific error.",
    contest:
      "Sam reads it as a retrieval slot for wrong theories. Ether, caloric, humours complete the same frame. Phlogiston is this week’s occupant.",
  },
  4404: {
    title: "Feature 4404",
    about:
      "Feature 4404 sits on the phlogiston run, quieter than 4402. Nobody has written a reading. The graph is still an observation.",
    pull: "The graph is still an observation.",
    lead: [
      "Feature 4404 takes a path from released into combustion. That is compatible with caloric, and with a generic “released in” slot. Until someone files a reading, this page is a stub.",
    ],
    observation:
      "The unit takes a path from released into combustion. That is compatible with a heat-fluid reading, and with a generic “released in” slot. The two have not been pulled apart.",
    inspect:
      "A caloric reading would predict fire on heat-as-substance prompts that never mention phlogiston. File a reading if that is what you think this unit is doing.",
  },
  4408: {
    title: "Feature 4408",
    about:
      "Feature 4408 writes into the ether. Alex reads it as the negative result that made relativity thinkable. Sam reads it as the next word after “failed to detect” in a physics lead.",
    pull: "Both remain.",
    lead: [
      "The public sentence is “The Michelson–Morley experiment failed to detect.” The fixture records the ether.",
      "Alex reads the unit as the result. Sam reads it as a completion habit. Both remain.",
    ],
    observation: `Feature 4408 takes paths from failed and detect into the ether. ${PUBLIC}`,
    inspect:
      "If this is the negative result, swapping the experiment for a different null detection should matter. If this is a “failed to detect” frame, it should not.",
    claim:
      "Alex reads Feature 4408 as the negative result that made relativity thinkable. The ether here is the thing the experiment did not find, and that absence is the point.",
    contest:
      "Sam reads it as the next word after “failed to detect” in a physics lead. The encyclopedia completes ether. So does the model. That is not yet an understanding of 1887.",
  },
  5510: {
    title: "Feature 5510",
    about:
      "Feature 5510 completes Hume’s line with the passions. Alex reads it as the claim: reason as instrument, passion as master. Sam reads it as a quotation latch.",
    pull: "Both remain.",
    lead: [
      "The utterance is Hume’s, and Wikipedia prints it: “Reason is, and ought only to be the slave of.” The fixture records the passions.",
      "Whether the unit holds the argument, or only the cadence, is the disagreement. The article does not pick a winner.",
    ],
    observation: `Feature 5510 takes its strongest path from slave into the passions. ${PUBLIC}`,
    inspect:
      "A Treatise-reading predicts silence on parody (“slave of the algorithm”). A quotation-latch predicts fire on any “slave of Y.”",
    claim:
      "Alex reads Feature 5510 as Hume’s claim. Reason is instrument. Passion is master. The unit is about that order, not about finishing a famous English sentence.",
    contest:
      "Sam reads it as a quotation latch. It would fire on any “X is the slave of Y” line. Hume is how this one ends, not what the unit is.",
  },
  5520: {
    title: "Feature 5520",
    about:
      "Feature 5520 writes archetypes. Alex reads it as the collective-unconscious idea. Sam reads it as a glossary slot for “Jungian.”",
    pull: "Both remain.",
    lead: [
      "The public sentence is “Jung called the inherited, universal patterns of the psyche.” The fixture records archetypes.",
      "Psychology as public language, not another proper name. Both readings stay.",
    ],
    observation: `Feature 5520 takes paths from Jung and inherited into archetypes. ${PUBLIC}`,
    inspect:
      "If this is the idea, it should fire on inherited patterns without the name Jung. If this is a glossary, shadow, anima, persona should light it in the same frame.",
    claim:
      "Alex reads Feature 5520 as a detector of the collective-unconscious idea, not the word. Archetype here is a claim about psyche, not a label in a Jung index.",
    contest:
      "Sam reads it as a glossary slot for “Jungian.” The same frame would complete shadow, anima, persona. The name Jung is doing the work.",
  },
  5522: {
    title: "Feature 5522",
    about:
      "Sam reads Feature 5522 as shadow: the repressed counterpart in the same Jungian set. No second reading has been filed.",
    pull: "No second reading has been filed.",
    lead: [
      "Feature 5522 is quieter, and closer to psyche than to Jung. Sam reads it as shadow. Nobody has contested that yet.",
    ],
    observation:
      "The path is from psyche into archetypes. That is compatible with a shadow reading, and with a generic psyche-slot. Unresolved is not weak. It is waiting.",
    inspect:
      "A shadow reading predicts fire on repressed-counterpart prompts that never say archetype. Until the second sentence is filed, this page is one reading.",
    claim:
      "Sam reads Feature 5522 as shadow: the repressed counterpart in the same Jungian set. It sits beside archetypes on this graph. That does not yet make it a second argument about the idea.",
  },
  6601: {
    title: "Feature 6601",
    about:
      "Feature 6601 writes mountains on a Mongolian thangka of the Altai. Alex reads it as landscape as sacred field. Sam reads it as the noun that follows “shows.” Image versus geography.",
    pull: "Image versus geography.",
    lead: [
      "The public sentence is “A Mongolian thangka of the Altai often shows.” The fixture records mountains.",
      "Alex reads the unit as the painted world. Sam reads it as a completion after “shows.” Both remain.",
    ],
    observation: `Feature 6601 takes paths from Altai and shows into mountains. ${PUBLIC}`,
    inspect:
      "If this is sacred landscape, “often shows horses” should matter. If this is a noun-after-shows, horses, Buddhas, clouds should light it the same way.",
    claim:
      "Alex reads Feature 6601 as landscape as sacred field — Altai, sky, the painted world. Mountains here are what the thangka holds, not a place-name in a gazetteer.",
    contest:
      "Sam reads it as a place-noun after “shows.” The frame is “an X of Y often shows.” Mountains are a likely occupant. So are horses.",
  },
  6610: {
    title: "Feature 6610",
    about:
      "Feature 6610 completes Foucault’s panopticon as a diagram of power. Alex reads it as the disciplinary schema, not a prison. Sam reads it as a “Foucault essay” retrieval.",
    pull: "Both remain.",
    lead: [
      "The public sentence is “For Foucault, Bentham’s panopticon is a.” The fixture records diagram of power.",
      "Building versus schema. Both remain. The article does not pick a winner.",
    ],
    observation: `Feature 6610 takes its strongest path from panopticon into diagram of power. ${PUBLIC}`,
    inspect:
      "If this is the schema, a prompt about Bentham’s prison as architecture should go quieter. If this is a Foucault-slot, discipline, biopolitics, gaze should fire in the same frame.",
    claim:
      "Alex reads Feature 6610 as the disciplinary schema, not a prison. The panopticon here is a diagram of power: how seeing is organised, not a building in a plan.",
    contest:
      "Sam reads it as a “Foucault essay” retrieval. The name Foucault plus panopticon completes diagram, power, gaze. That is a bibliography, not a view of discipline.",
  },
};

const TOKEN_COPY: Record<string, string> = {
  "tok-georgia":
    "The name the two readings fight over. Country or state: same word.",
  "tok-caucasus":
    "The range named in the public sentence. Feature 3108 takes a path from here.",
  "tok-coast":
    "The hinge that asks for a sea. The completion is Black Sea. That is not yet a meaning.",
  "tok-black-sea":
    "The writer’s completion on this fixture. A path into this token is not a cause.",
  "tok-goddess":
    "The addressee of the line. Feature 5560 takes a path from here: the apple among goddesses, if that reading holds.",
  "tok-wrath":
    "The English for μῆνις. Feature 2104 takes its strongest incoming path from this token.",
  "tok-of":
    "The genitive hinge. Feature 7781 is the unit most tied to it on this run.",
  "tok-achilles":
    "The writer’s completion on this fixture. The features on the graph are the units that most strongly write into this token. That is not the same as causing it.",
  "tok-phlogiston":
    "The discarded name. Feature 4402 takes its strongest path from here.",
  "tok-substance":
    "What the theory said it was. A noun, not yet an ontology.",
  "tok-released":
    "The verb of the old chemistry. Feature 4404 sits closer to this than to the name.",
  "tok-combustion":
    "The completion. Fire as the public page files it.",
  "tok-michelson":
    "The experiment named. A proper name in a physics lead.",
  "tok-failed":
    "The negative. Feature 4408 takes a path from here.",
  "tok-detect":
    "What the experiment did not do. The ether is what public prose puts next.",
  "tok-ether":
    "The writer’s completion. The thing that was not found.",
  "tok-reason":
    "Hume’s subject. Feature 5510 takes a weaker path from here than from slave.",
  "tok-slave":
    "The metaphor the line is famous for. The strongest path into the passions.",
  "tok-of-hume":
    "The genitive that fetches the passions. A hinge, not a treatise.",
  "tok-passions":
    "The completion of the public quotation.",
  "tok-jung":
    "The name that may be doing all the work. Feature 5520 takes a path from here.",
  "tok-inherited":
    "The adjective of the idea, if the idea is what the unit holds.",
  "tok-psyche":
    "Closer to Feature 5522. A psyche-slot, or the thing archetypes are of.",
  "tok-archetypes":
    "The writer’s completion. Glossary word, or the idea.",
  "tok-thangka":
    "The painted object. A Tibetan and Mongolian form. Not yet a landscape.",
  "tok-altai":
    "The range. Sacred field, or a place-name in the prompt.",
  "tok-shows":
    "The verb that wants a noun. Feature 6601 sits on this frame.",
  "tok-mountains":
    "The completion. Image, or geography.",
  "tok-foucault":
    "The name that may retrieve the essay. Feature 6610 takes a path from here.",
  "tok-panopticon":
    "Bentham’s prison, Foucault’s diagram. The fight is which.",
  "tok-is-f":
    "The copula. A hinge, not a theory.",
  "tok-diagram":
    "The writer’s completion: diagram of power.",
};

export function articleCopy(featureId: number): ArticleCopy {
  return (
    ARTICLES[featureId] ?? {
      title: `Feature ${featureId}`,
      about:
        "This feature appears on the run. Nobody has written a reading yet.",
      pull: "Nobody has written a reading yet.",
      lead: [
        "This feature appears on the run. Nobody has written a reading yet. The graph below is the observation.",
      ],
      observation:
        "An article begins when someone says what they think this unit is doing. The wiki will not complete that sentence.",
      inspect:
        "Select neighbours to see how this unit sits on the graph. A path is not a meaning.",
    }
  );
}

export function inspectCopy(node: GraphNode): string {
  if (node.kind === "feature" && node.feature_id != null) {
    return articleCopy(node.feature_id).inspect;
  }
  return TOKEN_COPY[node.id] ?? "A token on this run. Select it to see what it connects to.";
}

export function neighborSentence(node: GraphNode, neighbors: GraphNode[]): string {
  if (neighbors.length === 0) return "No connections are drawn for this node on the fixture graph.";
  const names = neighbors.map((n) =>
    n.kind === "feature" ? n.label.replace(/^F /, "Feature ") : n.label,
  );
  if (names.length === 1) {
    return `On this graph it connects to ${names[0]}.`;
  }
  const last = names[names.length - 1];
  return `On this graph it connects to ${names.slice(0, -1).join(", ")}, and ${last}.`;
}
