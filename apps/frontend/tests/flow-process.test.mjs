import assert from "node:assert/strict";
import { test } from "node:test";
import {
  graphReducer,
  removeStep,
  canConnect,
  serializeGraph,
} from "../src/features/flow-process/flow-model.ts";

const graph = {
  nodes: ["a", "b", "c"].map((id) => ({
    id,
    position: { x: 0, y: 0 },
    data: { title: id, category: id === "a" ? "trigger" : "action" },
  })),
  edges: [
    { id: "ab", source: "a", target: "b" },
    { id: "bc", source: "b", target: "c" },
  ],
};

test("deleting a step removes its connections without changing the original graph", () => {
  const next = removeStep(graph, "b");
  assert.deepEqual(
    next.nodes.map((n) => n.id),
    ["a", "c"],
  );
  assert.deepEqual(next.edges, []);
  assert.equal(graph.edges.length, 2);
});

test("connections reject cycles, duplicates, missing endpoints and incoming triggers", () => {
  assert.equal(canConnect(graph, { source: "a", target: "c" }), true);
  for (const connection of [
    { source: "a", target: "a" },
    { source: "a", target: "b" },
    { source: "c", target: "b" },
    { source: "c", target: "a" },
    { source: "a", target: "missing" },
  ]) {
    assert.equal(canConnect(graph, connection), false);
  }
});

test("undo and redo restore graph edits and a new edit clears redo", () => {
  const initial = { past: [], present: graph, future: [] };
  const changed = removeStep(graph, "b");
  const committed = graphReducer(initial, { type: "commit", graph: changed });
  const undone = graphReducer(committed, { type: "undo" });
  assert.deepEqual(undone.present, graph);
  assert.deepEqual(graphReducer(undone, { type: "redo" }).present, changed);
  assert.equal(
    graphReducer(undone, { type: "commit", graph: removeStep(graph, "c") })
      .future.length,
    0,
  );
});

test("history retains at most fifty edits and ignores unchanged commits", () => {
  let state = { past: [], present: graph, future: [] };
  assert.equal(graphReducer(state, { type: "commit", graph }), state);
  for (let i = 0; i < 60; i++) {
    state = graphReducer(state, {
      type: "commit",
      graph: {
        ...graph,
        nodes: [{ ...graph.nodes[0], position: { x: i + 1, y: 0 } }],
      },
    });
  }
  assert.equal(state.past.length, 50);
});

test("drag previews become one undoable edit when committed", () => {
  const initial = { past: [], present: graph, future: [] };
  const moved = {
    ...graph,
    nodes: graph.nodes.map((node) => ({
      ...node,
      position: { x: 100, y: 200 },
    })),
  };
  const preview = graphReducer(initial, { type: "preview", graph: moved });
  assert.equal(preview.past.length, 0);
  const committed = graphReducer(preview, {
    type: "commit",
    graph: moved,
    before: graph,
  });
  assert.equal(committed.past.length, 1);
  assert.deepEqual(graphReducer(committed, { type: "undo" }).present, graph);
});

test("selection and measured dimensions do not mark a workflow as edited", () => {
  const selected = {
    nodes: graph.nodes.map((node) => ({
      ...node,
      selected: true,
      measured: { width: 240, height: 88 },
    })),
    edges: graph.edges.map((edge) => ({ ...edge, selected: true })),
  };
  assert.equal(serializeGraph(selected), serializeGraph(graph));
});

test("dashboard route renders the new workflow and its navigation link", async () => {
  const response = await fetch("http://localhost:3000/dashboard/flow-process");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Flow Process/);
  assert.match(html, /Lead Routing/);
  assert.match(html, /href="\/dashboard\/flow-process"/);
  assert.match(html, /Demo workflow/);
});
