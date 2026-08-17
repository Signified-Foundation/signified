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

export const ARTICLES: Record<number, ArticleCopy> = {
  18472: {
    title: "Feature 18472",
    about:
      "Feature 18472 is an internal unit that strongly feeds the Canberra completion. One reading treats it as a detector of Australian geographic entities. The other treats it as capital-city retrieval: the same machinery that would complete Paris or Tokyo in the same frame. Both remain. The article does not pick a winner.",
    pull: "Both remain. The article does not pick a winner.",
    lead: [
      "When Gemma 2 2B was asked to complete “The capital of Australia is,” it wrote Canberra. On the attribution graph for that run, Feature 18472 is one of the internal units that most strongly feeds that completion.",
      "This article records two readings of what the feature is doing. One treats it as a detector of Australian geographic entities. The other treats it as capital-city retrieval: the same machinery that would complete Paris or Tokyo in the same frame. Both remain. The article does not pick a winner.",
    ],
    observation:
      "The prompt names a country and asks for a capital. Feature 18472 takes a strong path from the token Australia, a weaker path from capital, and writes into Canberra. That is the observation. It is not yet a meaning.",
    inspect:
      "This is the feature the article is about. It sits between the country named in the prompt and the city the model wrote. Whether that is geography, or the act of fetching a capital, is the disagreement below.",
    claim:
      "Alex reads Feature 18472 as a detector of Australian geographic entities. On this view the unit is about place: it should fire on Sydney and Tasmania as well as Canberra, and stay quiet on words that are not places. The path from the token Australia is the main exhibit. The word capital in the prompt is incidental.",
    contest:
      "Sam reads the same unit as capital-city retrieval. The prompt is a capital-of frame. A feature that completes Canberra here would also complete Paris, Tokyo, or Oslo in the same frame, and would go quiet on Australian rivers and deserts. Geography is a confound, not the category.",
  },
  2201: {
    title: "Feature 2201",
    about:
      "Feature 2201 is the unit most strongly tied to the word capital. Sam reads it as a detector of the frame “capital of [country],” rather than of any particular place. No second reading has been filed. The article is unresolved, not because the claim is weak, but because nobody has contested it yet.",
    pull: "No second reading has been filed.",
    lead: [
      "Feature 2201 is the unit most strongly tied to the word capital on this run. Sam reads it as a detector of the frame “capital of [country],” rather than of any particular place.",
      "No second reading has been filed. The article is unresolved, not because the claim is weak, but because nobody has contested it yet.",
    ],
    observation:
      "The word capital is the question-word in the prompt. Feature 2201 takes its strongest incoming path from that token, and a weaker one from Australia, then writes into Canberra.",
    inspect:
      "If this is a frame detector, it should fire on “the capital of France is” as readily as on Australia, and stay quiet when the sentence asks for a largest city instead of a capital. That test has been proposed. It has not been run as an intervention.",
    claim:
      "Sam reads Feature 2201 as detecting the syntactic frame “capital of [country].” The strongest path on this run is from the word capital, not from Australia. If the reading is right, swapping the country should not matter, and swapping “capital” for “largest city” should.",
  },
  3308: {
    title: "Feature 3308",
    about:
      "Feature 3308 writes strongly into the output token Canberra. Sam reads it as a lexical unit for that city. Alex reads it as something that would fire on any Australian capital name, not Canberra in particular. Distinguishing a city name from a class of capital names needs prompts that never mention Canberra.",
    pull: "Distinguishing a city name from a class of capital names needs prompts that never mention Canberra.",
    lead: [
      "Feature 3308 writes strongly into the output token Canberra. Sam reads it as a lexical unit for that city. Alex reads it as something that would fire on any Australian capital name, not Canberra in particular.",
      "The article is contested. Distinguishing a city name from a class of capital names needs prompts that never mention Canberra.",
    ],
    observation:
      "Unlike Feature 18472, this unit’s story on the graph is mostly downstream: it is one of the louder writers into Canberra. The prompt tokens are quieter on the way in.",
    inspect:
      "A lexical-Canberra reading predicts silence on Sydney and Melbourne. A capital-name reading predicts the opposite. Nobody has posted that contrast yet.",
    claim:
      "Sam reads Feature 3308 as a lexical unit for Canberra: a city name, not a class. The graph mostly shows this unit writing into the output token, which is compatible with a local, late feature.",
    contest:
      "Alex reads it as a feature that would fire on any Australian capital name. Canberra is what the model wrote this time. That does not make the unit about Canberra. The two readings come apart on prompts that never mention the city.",
  },
  4410: {
    title: "Feature 4410",
    about:
      "Alex reads Feature 4410 as a detector of named geopolitical entities: countries, states, named places. The reading is supported by one contrast and has not been challenged. Supported is not settled. An uncontested article is still a claim.",
    pull: "Supported is not settled.",
    lead: [
      "Feature 4410 takes a path from the token Australia and writes into Canberra. Alex reads it as a detector of named geopolitical entities: countries, states, named places.",
      "The reading is supported by one contrast and has not been challenged. Supported is not settled. An uncontested article is still a claim.",
    ],
    observation:
      "On this run the only named place in the prompt is Australia. That is a thin basis for a geopolitical-entity reading. The graph shows a path. It does not show a category.",
    inspect:
      "The claim would be stronger if the feature also fired on France, Japan, and Tasmania in prompts that are not asking for a capital. That has not been shown here.",
    claim:
      "Alex reads Feature 4410 as a detector of named geopolitical entities — countries, states, named places. On this run the only such name in the prompt is Australia, so the reading is underdetermined. It has not been challenged. An uncontested article is still a claim.",
  },
  6701: {
    title: "Feature 6701",
    about:
      "Alex reads Feature 6701 as tracking the genitive “of [country],” independent of the word capital itself. The article is unresolved. A test has been sketched — swap “capital of” for “coast of” or “people of” — and not run.",
    pull: "A test has been sketched — swap “capital of” for “coast of” or “people of” — and not run.",
    lead: [
      "Feature 6701 takes a path from the word capital. Alex reads it as tracking the genitive “of [country],” independent of the word capital itself.",
      "The article is unresolved. A test has been sketched — swap “capital of” for “coast of” or “people of” — and not run.",
    ],
    observation:
      "On the graph this unit is closer to capital than to Australia. That is compatible with a syntactic reading, and also with a capital-frame reading. The two have not been pulled apart.",
    inspect:
      "If the genitive reading is right, the feature should still fire when the prompt is “the people of Australia are.” If it is really about capitals, that prompt should go quiet.",
    claim:
      "Alex reads Feature 6701 as tracking the genitive “of [country],” independent of the word capital. On the graph the unit is closer to capital than to Australia, which does not yet decide the case. The test that would decide it has been named and not run.",
  },
  8834: {
    title: "Feature 8834",
    about:
      "Feature 8834 is tied to the copula. Nobody has proposed a reading. This page is a stub. A stub is not empty of fact; it is empty of interpretation.",
    pull: "This page is a stub.",
    lead: [
      "Feature 8834 is tied to the copula is on this run. Nobody has proposed a reading. This page is a stub.",
      "The graph is still an observation. A stub is not empty of fact; it is empty of interpretation.",
    ],
    observation:
      "The token is is the hinge of the sentence. Feature 8834 is the unit most attached to it, and the weakest writer into Canberra of the features on this graph.",
    inspect:
      "A reading might treat this as a copula or completion-cue feature. Until someone writes that sentence, the article should not pretend to know.",
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
      "The prompt is the opening of the Iliad in English. Feature 2104 takes a strong path from wrath and writes into Achilles. That is the observation. It is not yet a meaning. Other open models scored the same written pair; those numbers are not measurements of this feature.",
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
};

const TOKEN_COPY: Record<string, string> = {
  "tok-capital":
    "The word that sets the question. Several features take a path from here, most strongly Feature 2201.",
  "tok-australia":
    "The only country named in the prompt. Feature 18472 takes its strongest incoming path from this token.",
  "tok-is":
    "The copula. Feature 8834 is the unit most tied to it. On this run it is a hinge, not a place.",
  "tok-canberra":
    "The model’s completion. The features on the graph are the units that most strongly write into this token. That is not the same as causing it.",
  "tok-goddess":
    "The addressee of the line. Feature 5560 takes a path from here: the apple among goddesses, if that reading holds.",
  "tok-wrath":
    "The English for μῆνις. Feature 2104 takes its strongest incoming path from this token.",
  "tok-of":
    "The genitive hinge. Feature 7781 is the unit most tied to it on this run.",
  "tok-achilles":
    "The writer’s completion on this fixture. The features on the graph are the units that most strongly write into this token. That is not the same as causing it.",
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
