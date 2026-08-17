import type { Model, Run, Score } from "@/lib/types";
import {
  ETHER,
  GEORGIA,
  HUME,
  JUNG,
  PANOPTICON,
  PHLOGISTON,
  THANGKA,
} from "@/lib/fixtures";

export const MODELS: Model[] = [
  { id: 1, name: "Gemma 2 2B", slug: "gemma-2-2b", role: "writer" },
  { id: 2, name: "GPT-OSS 20B", slug: "openai/gpt-oss-20b", role: "writer" },
  {
    id: 3,
    name: "Llama Prompt Guard 2 22M",
    slug: "meta-llama/llama-prompt-guard-2-22m",
    role: "scorer",
  },
  {
    id: 4,
    name: "Llama Prompt Guard 2 86M",
    slug: "meta-llama/llama-prompt-guard-2-86m",
    role: "scorer",
  },
  {
    id: 5,
    name: "GPT-OSS Safeguard 20B",
    slug: "openai/gpt-oss-safeguard-20b",
    role: "scorer",
  },
  {
    id: 6,
    name: "GPT-OSS 120B",
    slug: "openai/gpt-oss-120b",
    role: "scorer",
  },
  {
    id: 7,
    name: "Qwen 3.6 27B",
    slug: "qwen/qwen3.6-27b",
    role: "scorer",
  },
];

export const RUNS: Run[] = [
  {
    id: 1,
    model_id: 1,
    prompt: GEORGIA.prompt,
    output: GEORGIA.output,
    created_at: "2026-08-17T16:00:00.000Z",
  },
  {
    id: 2,
    model_id: 2,
    prompt: "Sing, goddess, the wrath of",
    output: "Achilles",
    created_at: "2026-08-17T12:00:00.000Z",
  },
  {
    id: 3,
    model_id: 2,
    prompt: PHLOGISTON.prompt,
    output: PHLOGISTON.output,
    created_at: "2026-08-17T16:10:00.000Z",
  },
  {
    id: 4,
    model_id: 2,
    prompt: ETHER.prompt,
    output: ETHER.output,
    created_at: "2026-08-17T16:12:00.000Z",
  },
  {
    id: 5,
    model_id: 2,
    prompt: HUME.prompt,
    output: HUME.output,
    created_at: "2026-08-17T16:14:00.000Z",
  },
  {
    id: 6,
    model_id: 2,
    prompt: JUNG.prompt,
    output: JUNG.output,
    created_at: "2026-08-17T16:16:00.000Z",
  },
  {
    id: 7,
    model_id: 2,
    prompt: THANGKA.prompt,
    output: THANGKA.output,
    created_at: "2026-08-17T16:18:00.000Z",
  },
  {
    id: 8,
    model_id: 2,
    prompt: PANOPTICON.prompt,
    output: PANOPTICON.output,
    created_at: "2026-08-17T16:20:00.000Z",
  },
];

export const SCORES: Score[] = [
  {
    id: 1,
    run_id: 2,
    model_id: 3,
    metric: "attack probability",
    value: 0.00093,
    notes: "Live Groq score of the written pair. Not a measurement of the feature.",
  },
  {
    id: 2,
    run_id: 2,
    model_id: 4,
    metric: "attack probability",
    value: 0.00057,
    notes: "Live Groq score of the written pair. Not a measurement of the feature.",
  },
  {
    id: 3,
    run_id: 2,
    model_id: 5,
    metric: "Iliad vs place",
    value: null,
    notes: "No number emitted.",
  },
  {
    id: 4,
    run_id: 2,
    model_id: 6,
    metric: "Iliad vs place",
    value: null,
    notes: "No number emitted.",
  },
  {
    id: 5,
    run_id: 2,
    model_id: 7,
    metric: "Iliad vs place",
    value: null,
    notes: "No number emitted.",
  },
];

export function modelById(id: number) {
  return MODELS.find((item) => item.id === id);
}

export function runById(id: number) {
  return RUNS.find((item) => item.id === id);
}

export function writerOf(runId: number) {
  const run = runById(runId);
  return run ? modelById(run.model_id) : undefined;
}

export const SCORERS = MODELS.filter((item) => item.role === "scorer");
