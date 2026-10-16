import assert from "node:assert/strict";
import { test } from "node:test";

import {
  moveTask,
  selectTasks,
  mergeVisibleBoard,
} from "../src/features/task/task-board.js";

const board = {
  ideas: [
    {
      id: "a",
      title: "Alpha",
      description: "First",
      priority: "Low",
      dueDate: "2026-06-16",
    },
  ],
  planned: [
    {
      id: "b",
      title: "Beta",
      description: "Second",
      priority: "High",
      dueDate: "2026-06-14",
    },
  ],
};

test("moving a task between columns preserves the other tasks", () => {
  const moved = moveTask(board, "a", "planned", 0);
  assert.deepEqual(moved.ideas, []);
  assert.deepEqual(
    moved.planned.map((task) => task.id),
    ["a", "b"],
  );
  assert.deepEqual(
    board.ideas.map((task) => task.id),
    ["a"],
  );
});

test("search matches the owner profile used by all Kanban views", () => {
  const tasks = {
    ideas: [{ ...board.ideas[0], owner: { name: "Nora Bennett" } }],
  };
  assert.equal(selectTasks(tasks, { query: "nora" }).length, 1);
});

test("editing a filtered board preserves hidden tasks and applies moves and deletions", () => {
  const original = { ideas: [...board.ideas, ...board.planned], planned: [] };
  const visible = { ideas: [board.ideas[0]], planned: [] };
  const updated = {
    ideas: [],
    planned: [{ ...board.ideas[0], title: "Updated" }],
  };
  const merged = mergeVisibleBoard(original, visible, updated);
  assert.deepEqual(merged.ideas, board.planned);
  assert.equal(merged.planned[0].title, "Updated");
  assert.deepEqual(
    mergeVisibleBoard(original, visible, { ideas: [], planned: [] }).ideas,
    board.planned,
  );
  assert.equal(original.ideas.length, 2);
});

test("task search, priority filter, and due-date sort apply to the same set", () => {
  assert.deepEqual(
    selectTasks(board, { query: "second", priority: "High", sort: "due" }).map(
      (item) => item.task.id,
    ),
    ["b"],
  );
  assert.deepEqual(
    selectTasks(board, { query: "", priority: "All", sort: "due" }).map(
      (item) => item.task.id,
    ),
    ["b", "a"],
  );
});
