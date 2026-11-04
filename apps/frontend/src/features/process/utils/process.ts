import type { Connection } from "@xyflow/react";
import type {
  Graph,
  GraphHistory,
  GraphAction,
  RunEntry,
  StepNode,
} from "../types/process";

export function graphReducer(
  state: GraphHistory,
  action: GraphAction,
): GraphHistory {
  if (action.type === "preview") return { ...state, present: action.graph };
  if (action.type === "commit") {
    const before = action.before ?? state.present;
    if (JSON.stringify(before) === JSON.stringify(action.graph)) return state;
    return {
      past: [...state.past, before].slice(-50),
      present: action.graph,
      future: [],
    };
  }
  if (action.type === "undo") {
    const previous = state.past.at(-1);
    return previous
      ? {
          past: state.past.slice(0, -1),
          present: previous,
          future: [state.present, ...state.future],
        }
      : state;
  }
  const next = state.future[0];
  return next
    ? {
        past: [...state.past, state.present].slice(-50),
        present: next,
        future: state.future.slice(1),
      }
    : state;
}

export function removeStep(graph: Graph, id: string): Graph {
  return {
    nodes: graph.nodes.filter((node) => node.id !== id),
    edges: graph.edges.filter(
      (edge) => edge.source !== id && edge.target !== id,
    ),
  };
}

export function canConnect(
  graph: Graph,
  connection: Pick<Connection, "source" | "target">,
): boolean {
  const { source, target } = connection;
  const sourceNode = graph.nodes.find((node) => node.id === source);
  if (source === target || !sourceNode || sourceNode.data.category === "end")
    return false;
  const targetNode = graph.nodes.find((node) => node.id === target);
  if (!targetNode || targetNode.data.category === "start") return false;
  if (
    graph.edges.some((edge) => edge.source === source && edge.target === target)
  )
    return false;
  const pending = [target];
  const visited = new Set<string>();
  while (pending.length) {
    const id = pending.pop()!;
    if (id === source) return false;
    if (visited.has(id)) continue;
    visited.add(id);
    pending.push(
      ...graph.edges
        .filter((edge) => edge.source === id)
        .map((edge) => edge.target),
    );
  }
  return true;
}

export function serializeGraph(graph: Graph): string {
  return JSON.stringify({
    nodes: graph.nodes.map(({ id, type, data, position }) => ({
      id,
      type,
      data,
      position,
    })),
    edges: graph.edges.map(({ selected: _selected, ...edge }) => edge),
  });
}

/** Stages in the order they first appear along the happy path from the start step. */
export function stageOrder(graph: Graph): string[] {
  const stages: string[] = [];
  for (const entry of simulateRun(graph)) {
    const node = graph.nodes.find((item) => item.id === entry.id);
    if (node && !stages.includes(node.data.stage)) stages.push(node.data.stage);
  }
  for (const node of graph.nodes) {
    if (!stages.includes(node.data.stage)) stages.push(node.data.stage);
  }
  return stages;
}

function walkFrom(
  graph: Graph,
  node: StepNode,
): { taken: typeof graph.edges; skipped: typeof graph.edges } {
  const outgoing = graph.edges.filter((edge) => edge.source === node.id);
  if (node.data.category !== "decision") return { taken: outgoing, skipped: [] };
  // A decision follows its "yes" branch on the recorded run.
  return {
    taken: outgoing.filter((edge) => edge.sourceHandle !== "no"),
    skipped: outgoing.filter((edge) => edge.sourceHandle === "no"),
  };
}

/**
 * Recorded demo run from the start step to the end, in execution order.
 * Decisions follow their "Yes" branch; everything after a failure is skipped.
 */
export function simulateRun(graph: Graph): RunEntry[] {
  const entries: RunEntry[] = [];
  const seen = new Set<string>();
  const queue: { id: string; via?: string; active: boolean }[] = graph.nodes
    .filter((node) => node.data.category === "start")
    .map((node) => ({ id: node.id, active: true }));
  while (queue.length) {
    const current = queue.shift()!;
    if (seen.has(current.id)) continue;
    const node = graph.nodes.find((item) => item.id === current.id);
    if (!node) continue;
    seen.add(current.id);
    const status = !current.active
      ? "Skipped"
      : (node.data.outcome ?? "Done");
    entries.push({
      id: node.id,
      via: current.via,
      result: {
        status,
        duration: status === "Skipped" ? "—" : node.data.duration,
      },
    });
    const { taken, skipped } = walkFrom(graph, node);
    const next = current.active && status !== "Failed";
    for (const edge of taken) queue.push({ id: edge.target, via: edge.id, active: next });
    for (const edge of skipped) queue.push({ id: edge.target, via: edge.id, active: false });
  }
  // Steps never reached from the start are listed last so the timeline stays complete.
  for (const node of graph.nodes) {
    if (!seen.has(node.id))
      entries.push({ id: node.id, result: { status: "Skipped", duration: "—" } });
  }
  return entries;
}
