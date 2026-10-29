/** Whether a change is good news, bad news, or neither for the reader. */
export type DeltaSentiment = "good" | "bad" | "neutral";

export type DeltaDirection = "up" | "down" | "flat";

export type Delta = {
  value: string;
  direction: DeltaDirection;
  sentiment: DeltaSentiment;
};

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";
