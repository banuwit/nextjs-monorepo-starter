export type SpendMetric = "cost" | "tokens";

export type SpendDimension = "models" | "teams" | "agents" | "apiKeys";

/** Icon keys: vendor logos for models, lucide icons for everything else. */
export type SpendItemIcon =
  | "claude"
  | "openai"
  | "gemini"
  | "code"
  | "shield"
  | "flask"
  | "briefcase"
  | "bot"
  | "key";

export type SpendRecommendation = {
  id: string;
  kind: "savings" | "cap" | "anomaly";
  title: string;
  detail: string;
  /** Estimated monthly saving in USD; omitted for alerts without one. */
  savings?: number;
};

export type SpendItem = {
  id: string;
  name: string;
  /** Second line under the name, e.g. the vendor or owner. */
  meta: string;
  icon: SpendItemIcon;
  cost: number;
  tokens: number;
  /** Fractional change versus the previous month, e.g. 0.14 for +14%. */
  change: number;
  /** Daily cost from the first day of the period to today. */
  series: number[];
  runs: number;
  cacheHitRate: number;
  monthlyCap: number | null;
  summary: string;
  recommendations: SpendRecommendation[];
  /**
   * Set on items scoped to one model: their cost across all models, which is
   * what `monthlyCap` is measured against.
   */
  allModelsCost?: number;
};

/** Share of each item's usage per model: `mix[itemId][modelId]`, as fractions. */
export type SpendModelMix = Record<string, Record<string, number>>;

export type SpendGroup = {
  id: SpendDimension;
  label: string;
  singular: string;
  items: SpendItem[];
};

export type SpendWorkspace = {
  name: string;
  startLabel: string;
  endLabel: string;
  day: number;
  daysInMonth: number;
  previousMonthLabel: string;
  budget: number;
  /** Full previous month, for month-over-month comparisons. */
  previous: { cost: number; tokens: number; runs: number };
  updatedAt: string;
};
