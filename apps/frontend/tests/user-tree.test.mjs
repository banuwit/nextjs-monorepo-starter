import assert from "node:assert/strict";
import test from "node:test";
import { users } from "../src/mocks/user.mock.ts";
import {
  buildUserTree,
  emptyTreeFilters,
  filterUserTree,
  flattenUserTree,
  getExpandedTreeIds,
} from "../src/features/table/group/tree/user-tree.ts";

test("reporting tree uses the same 36 users with direct and recursive totals", () => {
  const before = structuredClone(users);
  const tree = buildUserTree(users);
  assert.equal(tree.length, 5);
  assert.equal(tree[0].user.id, "USR-001");
  assert.equal(tree[0].directReports, 1);
  assert.equal(tree[0].totalReports, 7);
  assert.equal(tree[0].children[0].totalReports, 6);
  assert.equal(tree[0].children[0].directReports, 4);
  assert.equal(tree[0].children[0].children[0].directReports, 2);
  const all = flattenUserTree(tree, getExpandedTreeIds(tree, Infinity));
  assert.equal(all.length, 36);
  assert.equal(Math.max(...all.map((node) => node.depth)), 3);
  assert.equal(new Set(all.map((node) => node.user.id)).size, 36);
  assert.ok(all.every((node) => users.includes(node.user)));
  assert.deepEqual(users, before);
});

test("expanding branches preserves the remaining hierarchy", () => {
  const tree = buildUserTree(users);
  assert.equal(flattenUserTree(tree, getExpandedTreeIds(tree, 1)).length, 22);
  const expanded = getExpandedTreeIds(tree, Infinity);
  assert.equal(flattenUserTree(tree, expanded).length, 36);
  expanded.delete("USR-002");
  const rows = flattenUserTree(tree, expanded);
  assert.equal(rows.length, 30);
  assert.ok(rows.some((node) => node.user.id === "USR-003"));
});

test("search retains ancestor paths while excluding unrelated reporting lines", () => {
  const tree = buildUserTree(users);
  const filtered = filterUserTree(tree, {
    ...emptyTreeFilters,
    search: " ANISA.ZAHRA@EXAMPLE.COM ",
  });
  const rows = flattenUserTree(
    filtered,
    getExpandedTreeIds(filtered, Infinity),
  );
  assert.deepEqual(
    rows.map((node) => node.user.id),
    ["USR-001", "USR-006", "USR-011", "USR-036"],
  );
  assert.deepEqual(
    rows.map((node) => node.matchesFilter),
    [false, false, false, true],
  );
  assert.equal(rows[0].totalReports, 7);
  assert.deepEqual(
    filterUserTree(tree, { ...emptyTreeFilters, search: "not-a-user" }),
    [],
  );
});

test("gender, role, and status facets retain ancestor context", () => {
  const tree = buildUserTree(users);
  const filtered = filterUserTree(tree, {
    ...emptyTreeFilters,
    gender: ["female"],
    role: ["viewer"],
    status: ["pending"],
  });
  const nodes = flattenUserTree(
    filtered,
    getExpandedTreeIds(filtered, Infinity),
  );
  const matches = nodes.filter((node) => node.matchesFilter);
  assert.ok(matches.length > 0);
  assert.ok(
    matches.every(
      ({ user }) =>
        user.gender === "female" &&
        user.role === "viewer" &&
        user.status === "pending",
    ),
  );
  assert.ok(nodes.length > matches.length);
});

test("orphan managers, cycles and arbitrary depth remain finite and retain every user once", () => {
  const chain = Array.from({ length: 6 }, (_, index) => ({
    ...users[0],
    id: String(index),
    managerId: index ? String(index - 1) : "missing",
  }));
  const tree = buildUserTree(chain);
  assert.equal(
    flattenUserTree(tree, getExpandedTreeIds(tree, Infinity)).at(-1).depth,
    5,
  );
  const cycle = buildUserTree([
    { ...users[0], id: "a", managerId: "b" },
    { ...users[1], id: "b", managerId: "a" },
  ]);
  assert.equal(
    flattenUserTree(cycle, getExpandedTreeIds(cycle, Infinity)).length,
    2,
  );
  assert.deepEqual(buildUserTree([]), []);
});
