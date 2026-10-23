import type { Connection } from "@xyflow/react";
import type { Graph, GraphHistory, GraphAction } from "../types/flow";

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
  if (source === target || !graph.nodes.some((node) => node.id === source))
    return false;
  const targetNode = graph.nodes.find((node) => node.id === target);
  if (!targetNode || targetNode.data.category === "trigger") return false;
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
