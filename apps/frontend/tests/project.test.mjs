import assert from "node:assert/strict";
import { test } from "node:test";

import {
  applyProjectChange,
  getProjectErrors,
  isOverdue,
  parseProjectStorage,
  selectProjects,
  sortProjects,
} from "../src/features/project/project-model.ts";

const project = {
  id: "one",
  name: "Customer portal",
  description: "Self-service accounts",
  client: "Acme",
  owner: "Nora Bennett",
  status: "active",
  priority: "high",
  startDate: "2026-10-01",
  dueDate: "2026-10-20",
  progress: 45,
};

test("both views sort all matches before pagination without mutating projects", () => {
  const projects = [
    project,
    { ...project, id: "two", priority: "low", progress: 100 },
    { ...project, id: "three", priority: "medium", progress: 10 },
  ];
  assert.deepEqual(
    sortProjects(projects, [{ id: "progress", desc: true }])
      .slice(0, 2)
      .map((item) => item.id),
    ["two", "one"],
  );
  assert.deepEqual(
    sortProjects(projects, [{ id: "priority", desc: false }]).map(
      (item) => item.id,
    ),
    ["one", "three", "two"],
  );
  assert.deepEqual(
    projects.map((item) => item.id),
    ["one", "two", "three"],
  );
});

test("create, edit and delete preserve unrelated projects and the original collection", () => {
  const original = [project];
  const created = applyProjectChange(original, {
    type: "save",
    project: { ...project, id: "two" },
    isNew: true,
  });
  assert.equal(created.length, 2);
  const edited = applyProjectChange(created, {
    type: "save",
    project: { ...project, name: "Updated portal" },
    isNew: false,
  });
  assert.equal(edited.find((item) => item.id === "one").name, "Updated portal");
  assert.equal(edited.find((item) => item.id === "two").name, project.name);
  assert.deepEqual(
    applyProjectChange(edited, { type: "delete", id: "one" }).map(
      (item) => item.id,
    ),
    ["two"],
  );
  assert.equal(original[0].name, project.name);
});

test("editing a project removed in another tab does not resurrect it", () => {
  assert.throws(
    () => applyProjectChange([], { type: "save", project, isNew: false }),
    /tidak ditemukan/,
  );
});

test("form validation rejects blank names, invalid dates and progress outside 0–100", () => {
  assert.deepEqual(getProjectErrors(project), {});
  assert.ok(getProjectErrors({ ...project, name: "  " }).name);
  assert.ok(getProjectErrors({ ...project, dueDate: "2026-02-30" }).dueDate);
  assert.ok(getProjectErrors({ ...project, dueDate: "2026-09-30" }).dueDate);
  assert.ok(getProjectErrors({ ...project, progress: 101 }).progress);
  assert.ok(getProjectErrors({ ...project, progress: NaN }).progress);
  assert.ok(
    getProjectErrors({ ...project, status: "completed", progress: 90 })
      .progress,
  );
});

test("search and filters intersect across name, owner and client", () => {
  const projects = [
    project,
    { ...project, id: "two", status: "completed", progress: 100 },
  ];
  assert.deepEqual(
    selectProjects(projects, "  NORA ", "active", "high").map(
      (item) => item.id,
    ),
    ["one"],
  );
  assert.equal(selectProjects(projects, "acme", "all", "all").length, 2);
  assert.equal(selectProjects(projects, "absent", "all", "all").length, 0);
});

test("overdue excludes completed projects and projects due today", () => {
  assert.equal(isOverdue(project, "2026-10-21"), true);
  assert.equal(isOverdue(project, "2026-10-20"), false);
  assert.equal(
    isOverdue({ ...project, status: "completed" }, "2026-10-21"),
    false,
  );
});

test("storage roundtrip preserves an empty list and rejects corrupt or incompatible data", () => {
  assert.deepEqual(
    parseProjectStorage(JSON.stringify({ version: 1, projects: [project] })),
    [project],
  );
  assert.deepEqual(parseProjectStorage('{"version":1,"projects":[]}'), []);
  for (const raw of [
    "{",
    '{"version":2,"projects":[]}',
    '{"version":1,"projects":[{}]}',
    JSON.stringify({ version: 1, projects: [project, project] }),
  ]) {
    assert.throws(() => parseProjectStorage(raw));
  }
});

test("storage rejects inherited object names as status or priority", () => {
  for (const patch of [{ status: "toString" }, { priority: "constructor" }]) {
    assert.throws(() =>
      parseProjectStorage(
        JSON.stringify({ version: 1, projects: [{ ...project, ...patch }] }),
      ),
    );
  }
});
