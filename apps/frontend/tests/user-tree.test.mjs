import assert from "node:assert/strict";
import test from "node:test";
import { users } from "../src/mocks/user.mock.ts";
import {
  buildUserTree,
  filterUserTree,
  flattenUserTree,
  getExpandedTreeIds,
  getTreeBranchIds,
  emptyTreeFilters,
} from "../src/features/table/group/tree/user-tree.ts";

test("reporting tree uses the same 36 users with direct and recursive totals", () => {
  const before = structuredClone(users);
  const tree = buildUserTree(users);
  assert.equal(tree.length, 1);
  assert.equal(tree[0].user.id, "USR-001");
  assert.equal(tree[0].directReports, 5);
  assert.equal(tree[0].totalReports, 35);
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

test("depth presets and branch collapse preserve the remaining hierarchy", () => {
  const tree = buildUserTree(users);
  assert.equal(flattenUserTree(tree, getExpandedTreeIds(tree, 0)).length, 1);
  assert.equal(flattenUserTree(tree, getExpandedTreeIds(tree, 1)).length, 6);
  assert.equal(flattenUserTree(tree, getExpandedTreeIds(tree, 2)).length, 26);
  assert.equal(flattenUserTree(tree, getExpandedTreeIds(tree, 3)).length, 36);
  const expanded = getExpandedTreeIds(tree, Infinity);
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
  assert.equal(rows[0].totalReports, 35);
  assert.deepEqual(
    filterUserTree(tree, { ...emptyTreeFilters, search: "not-a-user" }),
    [],
  );
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
  assert.equal(cycle.flatMap(getTreeBranchIds).length, 2);
  assert.deepEqual(buildUserTree([]), []);
});
