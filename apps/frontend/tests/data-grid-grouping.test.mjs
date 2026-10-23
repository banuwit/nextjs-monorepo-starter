import assert from "node:assert/strict";
import test from "node:test";
import { groupDataGridRows } from "../src/components/data-grid/data-grid-grouping.ts";

test("grouping collects interleaved records without duplication or mutation", () => {
  const rows = [
    { id: "1", role: "editor" },
    { id: "2", role: "admin" },
    { id: "3", role: "editor" },
  ];
  const groups = groupDataGridRows(rows, (row) => row.role);
  assert.deepEqual(
    groups.map((group) => group.key),
    ["editor", "admin"],
  );
  assert.deepEqual(
    groups.map((group) => group.rows.map((row) => row.id)),
    [["1", "3"], ["2"]],
  );
  assert.equal(groups[0].rows[0], rows[0]);
  assert.deepEqual(
    rows.map((row) => row.id),
    ["1", "2", "3"],
  );
});

test("group counts follow the filtered row view and empty input creates no headers", () => {
  const rows = [
    { role: "admin", active: true },
    { role: "admin", active: false },
    { role: "viewer", active: false },
  ];
  assert.deepEqual(
    groupDataGridRows(
      rows.filter((row) => row.active),
      (row) => row.role,
    ).map((group) => [group.key, group.rows.length]),
    [["admin", 1]],
  );
  assert.deepEqual(
    groupDataGridRows([], () => "role"),
    [],
  );
});
