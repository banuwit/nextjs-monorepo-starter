import type { Edge, Node } from "@xyflow/react";

export type StepData = {
  title: string;
  detail: string;
  category: "trigger" | "condition" | "action";
  owner: string;
  status: "Success" | "Failed" | "Skipped" | "Idle";
  duration: string;
  icon: "webhook" | "branch" | "search" | "message" | "deal";
};

export type StepNode = Node<StepData, "step">;

export type Graph = { nodes: StepNode[]; edges: Edge[] };

export type GraphHistory = { past: Graph[]; present: Graph; future: Graph[] };

export type GraphAction =
  | { type: "commit"; graph: Graph; before?: Graph }
  | { type: "preview"; graph: Graph }
  | { type: "undo" | "redo" };
