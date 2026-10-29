/** Whether a change is good news, bad news, or neither for the reader. */
export type DeltaSentiment = "good" | "bad" | "neutral";

export type DeltaDirection = "up" | "down" | "flat";

export type Delta = {
  value: string;
  direction: DeltaDirection;
  sentiment: DeltaSentiment;
};

export type KpiItem = {
  label: string;
  value: string;
  delta?: Delta;
  /** Short comparison text shown after the delta, e.g. "vs last month". */
  context?: string;
  /** Recent values for a sparkline, oldest first. */
  trend?: readonly number[];
};
