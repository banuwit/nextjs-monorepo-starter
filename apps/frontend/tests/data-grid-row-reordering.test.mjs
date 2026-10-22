import assert from "node:assert/strict";
import test from "node:test";

import { reorderDataGridItems } from "../src/components/data-grid/data-grid-reordering.ts";
import { users } from "../src/mocks/user.mock.ts";

const getRowId = (row) => row.id;

test("moving a user down preserves all records and leaves the source untouched", () => {
  const originalIds = users.map(getRowId);
  const result = reorderDataGridItems(users, users[0].id, users[2].id, getRowId);
  assert.deepEqual(result.slice(0, 3), [users[1], users[2], users[0]]);
  assert.deepEqual(users.map(getRowId), originalIds);
  assert.equal(result.length, users.length);
  assert.deepEqual(
    [...result].sort((a, b) => a.id.localeCompare(b.id)),
    users,
  );
});

test("moving the last user to the top supports the complete list", () => {
  const result = reorderDataGridItems(
    users,
    users.at(-1).id,
    users[0].id,
    getRowId,
  );
  assert.equal(result[0], users.at(-1));
  assert.deepEqual(result.slice(1), users.slice(0, -1));
});

test("cancelled, unchanged, and stale drops do not change the order", () => {
  for (const [active, over] of [
    [users[0].id, null],
    [users[0].id, users[0].id],
    ["missing", users[0].id],
    [users[0].id, "missing"],
  ]) {
    assert.equal(reorderDataGridItems(users, active, over, getRowId), users);
  }
  const empty = [];
  assert.equal(reorderDataGridItems(empty, "a", "b", getRowId), empty);
});
