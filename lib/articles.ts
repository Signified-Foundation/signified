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
};

export function articleCopy(featureId: number): ArticleCopy {
  return (
    ARTICLES[featureId] ?? {
      title: `Feature ${featureId}`,
      about:
        "This feature appears on the Canberra run. Nobody has written a reading yet.",
      pull: "Nobody has written a reading yet.",
      lead: [
        "This feature appears on the Canberra run. Nobody has written a reading yet. The graph below is the observation.",
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
