import assert from "node:assert/strict";
import test from "node:test";
import { reorderDataGridItems } from "../src/components/data-grid/data-grid-reordering.ts";

const identity = (id) => id;

test("successive column moves preserve every ID, including hidden fields", () => {
  const original = ["no", "id", "name", "email", "gender", "role", "joinDate", "status"];
  const first = reorderDataGridItems(original, "email", "id", identity);
  const second = reorderDataGridItems(first, "id", "status", identity);
  assert.deepEqual(first, ["no", "email", "id", "name", "gender", "role", "joinDate", "status"]);
  assert.deepEqual(second, ["no", "email", "name", "gender", "role", "joinDate", "status", "id"]);
  assert.deepEqual(original, ["no", "id", "name", "email", "gender", "role", "joinDate", "status"]);
});

test("cancelled or stale column drops leave the order untouched", () => {
  const order = ["id", "name", "email"];
  for (const [active, over] of [["id", null], ["id", "id"], ["missing", "email"], ["id", "missing"]]) {
    assert.equal(reorderDataGridItems(order, active, over, identity), order);
  }
});
