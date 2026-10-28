export type AgentSource = {
  id: string;
  name: string;
  kind: string;
  access: "read" | "edit" | "run";
};

export type AgentFile = {
  id: string;
  name: string;
  size: string;
};

export type PlanStep = {
  id: string;
  title: string;
  detail: string;
  /** Durasi simulasi langkah dalam milidetik. */
  runMs: number;
  tokens: number;
  /** Langkah cabang hanya berjalan bila pilihan fork yang sama dipilih. */
  branch?: string;
  /** Langkah gagal pada percobaan pertama untuk memperagakan retry. */
  failFirstRun?: boolean;
};

export type PlanStepStatus =
  "pending" | "skipped" | "running" | "done" | "error";

export type PlanStepState = PlanStep & {
  status: PlanStepStatus;
  attempts: number;
};

export type ForkChoice = {
  id: string;
  label: string;
  description: string;
};

export type AgentOwner = {
  value: string;
  label: string;
};

export type AgentArtifact = {
  id: string;
  name: string;
  size: string;
};

export type AgentPhase =
  "brief" | "plan" | "running" | "fork" | "failed" | "handoff" | "created";

export type AgentMessageMeta = {
  kind: "brief" | "plan" | "retry" | "fork" | "handoff" | "note";
};
