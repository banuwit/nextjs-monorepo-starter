import type { Edge, Node } from "@xyflow/react";

export type StepCategory = "start" | "task" | "decision" | "end";

export type StepStatus = "Pending" | "Active" | "Done" | "Failed" | "Skipped";

export type StepIcon =
  | "order"
  | "payment"
  | "branch"
  | "picking"
  | "packing"
  | "snowflake"
  | "truck"
  | "check"
  | "alert"
  | "message";

export type StepData = {
  title: string;
  detail: string;
  category: StepCategory;
  /** Phase of the process the step belongs to; drives the timeline strip. */
  stage: string;
  owner: string;
  status: StepStatus;
  /** Recorded duration for the demo run, e.g. "4m 20s"; "—" when it did not run. */
  duration: string;
  icon: StepIcon;
  /** Demo outcome when the step is reached; `Done` unless set. */
  outcome?: "Done" | "Failed";
};

export type StepNode = Node<StepData, "step">;

export type Graph = { nodes: StepNode[]; edges: Edge[] };

export type RunResult = Pick<StepData, "status" | "duration">;

/** One stop on the replay: the step reached and the edge that led to it. */
export type RunEntry = { id: string; via?: string; result: RunResult };

export type GraphHistory = { past: Graph[]; present: Graph; future: Graph[] };

export type GraphAction =
  | { type: "commit"; graph: Graph; before?: Graph }
  | { type: "preview"; graph: Graph }
  | { type: "undo" | "redo" };
