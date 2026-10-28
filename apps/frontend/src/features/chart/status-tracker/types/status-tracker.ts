export type DayStatus = "operational" | "degraded" | "outage";

/** An incident day: worst status and minutes of downtime. */
export type Incident = {
  status: Exclude<DayStatus, "operational">;
  downtime: number;
};

export type DailyStatus = { date: string; status: DayStatus; downtime: number };

export type StageStatus = "success" | "running" | "failed" | "pending";

export type PipelineStage = {
  stage: string;
  label: string;
  status: StageStatus;
  /** Seconds; omitted for stages that have not started. */
  duration?: number;
};

export type RunStatus = "success" | "failed" | "running" | "cancelled";

export type RunRecord = {
  id: number;
  status: RunStatus;
  duration: number;
  branch: string;
};
