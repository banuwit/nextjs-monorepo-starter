import type {
  SpendGroup,
  SpendItem,
  SpendModelMix,
  SpendWorkspace,
} from "@/features/ai-usage/types/ai-usage";

export const spendWorkspace: SpendWorkspace = {
  name: "Northwind Studio",
  startLabel: "Oct 1",
  endLabel: "Oct 30",
  day: 30,
  daysInMonth: 31,
  previousMonthLabel: "Sep",
  budget: 1600,
  previous: { cost: 1104, tokens: 241_000_000, runs: 19_800 },
  updatedAt: "Updated Oct 30, 08:15",
};

const DAYS = spendWorkspace.day;

/** Spreads `total` over the period with a weekly rhythm, so each item's daily chart differs. */
function dailySeries(total: number, seed: number) {
  const weights = Array.from({ length: DAYS }, (_, day) => {
    const weekday = (day + seed) % 7;
    const base = weekday >= 5 ? 0.45 : 1;
    return base + 0.35 * Math.sin((day + seed * 1.7) / 2.1);
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map(
    (weight) => Math.round(((total * weight) / sum) * 100) / 100,
  );
}

type ItemSeed = Omit<SpendItem, "series"> & { seed: number };

function item({ seed, ...rest }: ItemSeed): SpendItem {
  return { ...rest, series: dailySeries(rest.cost, seed) };
}

const models: SpendItem[] = [
  item({
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    meta: "Anthropic",
    icon: "claude",
    cost: 475,
    tokens: 85_400_000,
    change: 0.14,
    runs: 3920,
    cacheHitRate: 0.58,
    monthlyCap: null,
    seed: 1,
    summary:
      "Runs here average $0.105, 22% above the $0.086 workspace average. Code Reviewer moved its long-context reviews to this model on Oct 9.",
    recommendations: [
      {
        id: "cache-system-prompt",
        kind: "savings",
        title: "Cache the Code Reviewer system prompt",
        detail:
          "Cache hits would rise from 58% to about 80% on the longest runs.",
        savings: 70,
      },
      {
        id: "no-cap",
        kind: "cap",
        title: "No monthly cap on the largest model",
        detail:
          "At the current pace it reaches $426 by Oct 31. A $650 cap would flag it a week early.",
      },
    ],
  }),
  item({
    id: "gpt-5-1",
    name: "GPT-5.1",
    meta: "OpenAI",
    icon: "openai",
    cost: 302,
    tokens: 59_000_000,
    change: 0.06,
    runs: 2610,
    cacheHitRate: 0.44,
    monthlyCap: 300,
    seed: 2,
    summary:
      "Spend is steady; weekday volume is 2.1× the weekend level. Support Triage added about 180 runs a day from Oct 4.",
    recommendations: [
      {
        id: "route-short-tickets",
        kind: "savings",
        title: "Route short tickets to a smaller model",
        detail:
          "Tickets under 400 tokens are 40% of Support Triage runs and do not need the larger model.",
        savings: 45,
      },
    ],
  }),
  item({
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    meta: "Google",
    icon: "gemini",
    cost: 206,
    tokens: 39_800_000,
    change: 0.22,
    runs: 1480,
    cacheHitRate: 0.31,
    monthlyCap: null,
    seed: 3,
    summary:
      "Fastest-growing model this month. The Research agent started attaching full PDFs instead of extracted text on Oct 12, tripling input tokens per run.",
    recommendations: [
      {
        id: "pdf-input",
        kind: "anomaly",
        title: "Input tokens per run tripled since Oct 12",
        detail: "Research runs now average 20k input tokens, up from 6.4k.",
      },
      {
        id: "extract-text",
        kind: "savings",
        title: "Extract PDF text before the call",
        detail: "Cuts input tokens by about 60% on Research runs.",
        savings: 55,
      },
    ],
  }),
];

const teams: SpendItem[] = [
  item({
    id: "engineering",
    name: "Engineering",
    meta: "14 members",
    icon: "code",
    cost: 371,
    tokens: 71_900_000,
    change: 0.11,
    runs: 5810,
    cacheHitRate: 0.52,
    monthlyCap: 600,
    seed: 6,
    summary:
      "Largest team by spend at 38% of the workspace. Code Reviewer adoption doubled after it was enabled on every pull request.",
    recommendations: [
      {
        id: "skip-drafts",
        kind: "savings",
        title: "Skip reviews on draft pull requests",
        detail:
          "Drafts are about 20% of reviewed pull requests and are reviewed again when marked ready.",
        savings: 50,
      },
    ],
  }),
  item({
    id: "product",
    name: "Product",
    meta: "6 members",
    icon: "briefcase",
    cost: 274,
    tokens: 48_300_000,
    change: 0.19,
    runs: 2940,
    cacheHitRate: 0.38,
    monthlyCap: null,
    seed: 7,
    summary:
      "The Research agent drives 80% of this team's spend, and its PDF inputs grew sharply after Oct 12.",
    recommendations: [
      {
        id: "product-cap",
        kind: "cap",
        title: "No monthly cap set",
        detail:
          "Projected $283 this month, up 19% on September. A cap around $400 matches last quarter's plan.",
      },
    ],
  }),
  item({
    id: "support",
    name: "Support",
    meta: "9 members",
    icon: "shield",
    cost: 229,
    tokens: 45_600_000,
    change: 0.04,
    runs: 5120,
    cacheHitRate: 0.61,
    monthlyCap: 300,
    seed: 8,
    summary:
      "Highest cache hit rate of any team. Ticket volume rose 5% with the release.",
    recommendations: [
      {
        id: "support-route",
        kind: "savings",
        title: "Route short tickets to a mini model",
        detail: "Short tickets are 40% of triage runs.",
        savings: 45,
      },
    ],
  }),
  item({
    id: "data",
    name: "Data",
    meta: "4 members",
    icon: "flask",
    cost: 109,
    tokens: 18_400_000,
    change: -0.05,
    runs: 1100,
    cacheHitRate: 0.24,
    monthlyCap: 150,
    seed: 9,
    summary:
      "Nightly batch jobs on the discounted tier; spend is flat week to week.",
    recommendations: [],
  }),
];

const agents: SpendItem[] = [
  item({
    id: "code-reviewer",
    name: "Code Reviewer",
    meta: "Engineering",
    icon: "bot",
    cost: 263,
    tokens: 39_200_000,
    change: 0.18,
    runs: 1880,
    cacheHitRate: 0.58,
    monthlyCap: null,
    seed: 10,
    summary:
      "Reviews every pull request and has the longest runs in the workspace since moving to Claude Sonnet 5 on Oct 9.",
    recommendations: [
      {
        id: "cr-cache",
        kind: "savings",
        title: "Cache the system prompt",
        detail: "The 9k-token review rubric is resent on every run.",
        savings: 70,
      },
      {
        id: "cr-drafts",
        kind: "savings",
        title: "Skip draft pull requests",
        detail:
          "About 20% of runs review drafts that are reviewed again later.",
        savings: 50,
      },
    ],
  }),
  item({
    id: "research",
    name: "Research",
    meta: "Product",
    icon: "bot",
    cost: 219,
    tokens: 36_100_000,
    change: 0.24,
    runs: 960,
    cacheHitRate: 0.29,
    monthlyCap: null,
    seed: 11,
    summary:
      "Input tokens per run tripled since Oct 12, when full PDFs replaced extracted text.",
    recommendations: [
      {
        id: "rs-anomaly",
        kind: "anomaly",
        title: "Input tokens per run tripled",
        detail: "20k input tokens per run, up from 6.4k.",
      },
      {
        id: "rs-extract",
        kind: "savings",
        title: "Extract PDF text first",
        detail: "Cuts input tokens by about 60%.",
        savings: 55,
      },
    ],
  }),
  item({
    id: "support-triage",
    name: "Support Triage",
    meta: "Support",
    icon: "bot",
    cost: 166,
    tokens: 33_800_000,
    change: 0.07,
    runs: 4210,
    cacheHitRate: 0.64,
    monthlyCap: 250,
    seed: 12,
    summary:
      "Most runs of any agent, with short prompts and a high cache hit rate.",
    recommendations: [
      {
        id: "st-route",
        kind: "savings",
        title: "Route short tickets to a mini model",
        detail: "Tickets under 400 tokens are 40% of runs.",
        savings: 45,
      },
    ],
  }),
  item({
    id: "copilot",
    name: "Copilot",
    meta: "Engineering",
    icon: "bot",
    cost: 108,
    tokens: 32_700_000,
    change: -0.09,
    runs: 5340,
    cacheHitRate: 0.71,
    monthlyCap: 200,
    seed: 13,
    summary:
      "On-device completions handle 30% of requests since Oct 6, so spend is down 9%.",
    recommendations: [],
  }),
  item({
    id: "doc-writer",
    name: "Doc Writer",
    meta: "Product",
    icon: "bot",
    cost: 103,
    tokens: 17_600_000,
    change: 0.03,
    runs: 620,
    cacheHitRate: 0.41,
    monthlyCap: null,
    seed: 14,
    summary: "Steady weekly cadence with no notable change.",
    recommendations: [],
  }),
  item({
    id: "batch-summaries",
    name: "Batch Summaries",
    meta: "Data",
    icon: "bot",
    cost: 78,
    tokens: 14_900_000,
    change: -0.04,
    runs: 540,
    cacheHitRate: 0.22,
    monthlyCap: 100,
    seed: 15,
    summary: "Nightly batch on the discounted tier.",
    recommendations: [],
  }),
  item({
    id: "sales-assistant",
    name: "Sales Assistant",
    meta: "Support",
    icon: "bot",
    cost: 46,
    tokens: 9_900_000,
    change: 0.12,
    runs: 1420,
    cacheHitRate: 0.49,
    monthlyCap: 80,
    seed: 16,
    summary: "Small but growing after the pilot expanded to a second region.",
    recommendations: [],
  }),
];

const apiKeys: SpendItem[] = [
  item({
    id: "copilot-prod",
    name: "Copilot prod",
    meta: "Production",
    icon: "key",
    cost: 697,
    tokens: 128_400_000,
    change: 0.13,
    runs: 10_900,
    cacheHitRate: 0.57,
    monthlyCap: 1000,
    seed: 17,
    summary:
      "Carries 71% of spend and is shared by four agents, so a single cap covers very different workloads.",
    recommendations: [
      {
        id: "split-key",
        kind: "cap",
        title: "Split the key per agent",
        detail:
          "Code Reviewer and Research both grew on this key; separate keys allow separate caps.",
      },
    ],
  }),
  item({
    id: "internal-tools",
    name: "Internal tools",
    meta: "Internal",
    icon: "key",
    cost: 211,
    tokens: 42_600_000,
    change: 0.05,
    runs: 2890,
    cacheHitRate: 0.46,
    monthlyCap: 300,
    seed: 18,
    summary: "Doc Writer and Batch Summaries share this key; usage is steady.",
    recommendations: [],
  }),
  item({
    id: "staging",
    name: "Staging",
    meta: "Staging",
    icon: "key",
    cost: 75,
    tokens: 13_200_000,
    change: 0.31,
    runs: 1180,
    cacheHitRate: 0.35,
    monthlyCap: 100,
    seed: 19,
    summary: "Evaluation runs doubled in the week before the Oct 14 release.",
    recommendations: [
      {
        id: "staging-anomaly",
        kind: "anomaly",
        title: "Spend up 31% on September",
        detail:
          "Release evals ran twice as often; the key is at 75% of its $100 cap.",
      },
      {
        id: "sample-evals",
        kind: "savings",
        title: "Sample the eval set",
        detail: "Run a 25% sample on every push and the full set nightly.",
        savings: 20,
      },
    ],
  }),
];

export const spendGroups: SpendGroup[] = [
  { id: "models", label: "Models", singular: "model", items: models },
  { id: "teams", label: "Teams", singular: "team", items: teams },
  { id: "agents", label: "Agents", singular: "agent", items: agents },
  { id: "apiKeys", label: "API keys", singular: "API key", items: apiKeys },
];

const C = "claude-sonnet-5";
const G = "gpt-5-1";
const J = "gemini-3-pro";

/** How each team, agent and API key splits its usage across models. */
export const spendModelMix: SpendModelMix = {
  engineering: { [C]: 0.66, [G]: 0.2, [J]: 0.14 },
  product: { [C]: 0.36, [G]: 0.36, [J]: 0.29 },
  support: { [C]: 0.36, [G]: 0.46, [J]: 0.18 },
  data: { [C]: 0.25, [G]: 0.12, [J]: 0.63 },

  "code-reviewer": { [C]: 0.88, [G]: 0.12 },
  research: { [C]: 0.21, [G]: 0.37, [J]: 0.42 },
  "support-triage": { [C]: 0.5, [G]: 0.5 },
  copilot: { [C]: 0.57, [G]: 0.43 },
  "doc-writer": { [C]: 0.37, [G]: 0.62 },
  "batch-summaries": { [J]: 1.0 },
  "sales-assistant": { [C]: 0.43, [G]: 0.57 },

  "copilot-prod": { [C]: 0.59, [G]: 0.29, [J]: 0.12 },
  "internal-tools": { [C]: 0.22, [G]: 0.35, [J]: 0.43 },
  staging: { [C]: 0.27, [G]: 0.4, [J]: 0.33 },
};
