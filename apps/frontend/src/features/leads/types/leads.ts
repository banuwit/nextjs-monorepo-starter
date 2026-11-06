export type StageKind = "open" | "won" | "lost";

/** Palette key; full Tailwind classes live in `utils/stage-tones.ts`. */
export type StageTone =
  | "slate"
  | "sky"
  | "indigo"
  | "violet"
  | "amber"
  | "orange"
  | "teal"
  | "emerald"
  | "rose";

export type PipelineStage = {
  id: string;
  name: string;
  kind: StageKind;
  /** Chance to close as won, 0–100; used for the weighted forecast. */
  probability: number;
  tone: StageTone;
};

/**
 * `flexible`: a lead may jump to any stage.
 * `sequential`: one step forward/back, Won only from the last open stage,
 * Lost from any open stage, and closed leads reopen to their last open stage.
 */
export type MovementRule = "flexible" | "sequential";

export type Pipeline = {
  id: string;
  name: string;
  description: string;
  movement: MovementRule;
  stages: PipelineStage[];
};

export type LeadSource = "website" | "referral" | "event" | "outbound" | "partner";

export type LeadPriority = "high" | "medium" | "low";

export type LeadMove = {
  stageId: string;
  /** ISO timestamp of when the lead entered the stage. */
  at: string;
  by: string;
  note?: string;
};

export type Lead = {
  id: string;
  pipelineId: string;
  stageId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  /** Deal value in rupiah. */
  value: number;
  source: LeadSource;
  owner: string;
  priority: LeadPriority;
  /** `yyyy-MM-dd` */
  expectedClose: string;
  lostReason?: string;
  history: LeadMove[];
};

export type LeadsView = "kanban" | "list";
