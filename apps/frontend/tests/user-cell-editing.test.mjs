import assert from "node:assert/strict";
import test from "node:test";
import { users } from "../src/mocks/user.mock.ts";
import { getUserCellColumnOrder } from "../src/features/table/editable/cell/user-cell-columns.ts";

test("column coordinates follow pin regions, moves and visibility without dropping hidden column order", () => {
  const ids = ["no", "id", "name", "email", "role", "status"];
  const order = ["no", "id", "role", "name", "email", "status"];
  assert.deepEqual(
    getUserCellColumnOrder(
      ids,
      order,
      { name: false },
      { start: ["status", "role"], end: ["email"] },
    ),
    ["status", "role", "no", "id", "email"],
  );
  assert.deepEqual(
    getUserCellColumnOrder(
      ids,
      order,
      {},
      { start: ["role", "status"], end: [] },
    ),
    ["role", "status", "no", "id", "name", "email"],
  );
  assert.deepEqual(
    getUserCellColumnOrder(
      ids,
      [],
      { name: false, email: false, role: false, status: false },
      { start: [], end: [] },
    ),
    ["no", "id"],
  );
});
import {
  applyUserCellChanges,
  userCellHistoryReducer,
  createUserCellDraft,
} from "../src/features/table/editable/user-editing.ts";
import {
  copyCellRange,
  fillCellRange,
  getCellRange,
  pasteCellRange,
  parseClipboardText,
  moveCellFocus,
  isCellInRange,
} from "../src/components/data-grid/data-grid-cell-range.ts";
import {
  filterUserCells,
  sortUserCells,
} from "../src/features/table/editable/cell/user-cell-filters.ts";

test("sorting preserves snapshots and clipboard changes target the visible user", () => {
  const filtered = filterUserCells(users, [
    { field: "role", operator: "equals", value: "admin" },
  ]);
  const sorted = sortUserCells(filtered, { field: "name", desc: true });
  assert.notEqual(sorted[0].id, users[0].id);
  assert.equal(filtered[0], users[0]);
  assert.ok(
    sorted.every(
      (row, index) =>
        index === 0 ||
        sorted[index - 1].name.localeCompare(row.name, "en", {
          numeric: true,
          sensitivity: "base",
        }) >= 0,
    ),
  );
  const pasted = pasteCellRange(
    "Edited after sort",
    range(0, 0),
    sorted.length,
    6,
  );
  const result = applyUserCellChanges(
    users,
    pasted.changes.map(({ row, value }) => ({
      id: sorted[row].id,
      field: "name",
      value,
    })),
  );
  assert.equal(
    result.rows.find((row) => row.id === sorted[0].id).name,
    "Edited after sort",
  );
  assert.equal(result.rows[0].name, users[0].name);
  assert.deepEqual(
    sortUserCells(filtered, { field: "no", desc: true }),
    [...filtered].reverse(),
  );
  assert.equal(sortUserCells(filtered, null), filtered);
});

const range = (r1, c1, r2 = r1, c2 = c1) => ({
  anchor: { row: r1, column: c1 },
  focus: { row: r2, column: c2 },
});
const name = (value) => ({ id: "USR-001", field: "name", value });

test("no cells belong to an empty selection; explicit selections still match", () => {
  assert.equal(isCellInRange({ row: 0, column: 0 }, null), false);
  assert.equal(isCellInRange({ row: 0, column: 0 }, range(0, 0)), true);
  assert.equal(isCellInRange({ row: 1, column: 0 }, range(0, 0)), false);
});

test("cell save normalizes values; no-op changes keep the original snapshot", () => {
  const result = applyUserCellChanges(users, [name("  Updated User  ")]);
  assert.equal(result.rows[0].name, "Updated User");
  assert.equal(users[0].name, "Andi Pratama");
  assert.equal(
    applyUserCellChanges(users, [name(" Andi Pratama ")]).rows,
    users,
  );
});

test("range transactions are atomic and enforce required values, dates, enums, unique emails and read-only IDs", () => {
  for (const invalid of [
    { id: "USR-002", field: "email", value: users[0].email.toUpperCase() },
    { id: "USR-002", field: "email", value: "invalid" },
    { id: "USR-002", field: "name", value: "" },
    { id: "USR-002", field: "role", value: "owner" },
    { id: "USR-002", field: "joinDate", value: "2026-02-30" },
    { id: "USR-002", field: "id", value: "USR-999" },
    { id: "missing", field: "name", value: "Unknown" },
  ]) {
    const result = applyUserCellChanges(users, [
      name("Must not save"),
      invalid,
    ]);
    assert.ok(result.error);
    assert.equal(result.rows, users);
  }
});

test("undo and redo restore a whole paste transaction; a new change clears redo", () => {
  const initial = { rows: users, past: [], future: [] };
  const saved = userCellHistoryReducer(initial, {
    type: "apply",
    changes: [
      name("Updated"),
      { id: "USR-002", field: "status", value: "inactive" },
    ],
  });
  assert.equal(saved.past.length, 1);
  const undone = userCellHistoryReducer(saved, { type: "undo" });
  assert.equal(undone.rows, users);
  const redone = userCellHistoryReducer(undone, { type: "redo" });
  assert.deepEqual(redone.rows, saved.rows);
  const branched = userCellHistoryReducer(undone, {
    type: "apply",
    changes: [name("New branch")],
  });
  assert.equal(branched.future.length, 0);
  assert.equal(userCellHistoryReducer(initial, { type: "undo" }), initial);
  assert.equal(userCellHistoryReducer(initial, { type: "redo" }), initial);
  assert.equal(
    userCellHistoryReducer(initial, { type: "apply", changes: [name("")] }),
    initial,
  );
});

test("copy normalizes reversed selection and preserves row/column order", () => {
  const selection = range(2, 3, 1, 2);
  assert.deepEqual(getCellRange(selection), {
    top: 1,
    bottom: 2,
    left: 2,
    right: 3,
  });
  assert.equal(
    copyCellRange(selection, ({ row, column }) => `${row}:${column}`),
    "1:2\t1:3\n2:2\t2:3",
  );
});

test("paste accepts spreadsheet CRLF and fills a selection with a single value", () => {
  const result = pasteCellRange(
    "male\tadmin\r\nfemale\tviewer\r\n",
    range(0, 2),
    36,
    6,
  );
  assert.deepEqual(result.changes, [
    { row: 0, column: 2, value: "male" },
    { row: 0, column: 3, value: "admin" },
    { row: 1, column: 2, value: "female" },
    { row: 1, column: 3, value: "viewer" },
  ]);
  assert.equal(
    pasteCellRange("active", range(0, 5, 2, 5), 36, 6).changes.length,
    3,
  );
});

test("paste rejects ragged matrices and overflow without partial changes", () => {
  for (const [text, selection] of [
    ["a\tb\nc", range(0, 0)],
    ["a\tb", range(0, 5)],
    ["a\nb", range(35, 0)],
  ]) {
    const result = pasteCellRange(text, selection, 36, 6);
    assert.ok(result.error);
    assert.deepEqual(result.changes, []);
  }
});

test("drag fill repeats a source pattern in both directions and leaves source cells untouched", () => {
  const getValue = ({ row, column }) => `${row}:${column}`;
  const filled = fillCellRange(range(1, 2, 2, 2), range(0, 2, 4, 2), getValue);
  assert.deepEqual(filled, [
    { row: 0, column: 2, value: "2:2" },
    { row: 3, column: 2, value: "1:2" },
    { row: 4, column: 2, value: "2:2" },
  ]);
});

test("clipboard round-trips quoted tabs, newlines and double quotes", () => {
  const values = [
    ["a\tb", 'She said "hello"'],
    ["line1\nline2", ""],
  ];
  const copied = copyCellRange(
    range(0, 0, 1, 1),
    ({ row, column }) => values[row][column],
  );
  assert.deepEqual(parseClipboardText(copied), values);
  assert.ok(pasteCellRange('"unfinished', range(0, 0), 36, 6).error);
});

test("paste repeats a rectangular pattern to fill a matching selection", () => {
  const result = pasteCellRange(
    "male\tadmin\nfemale\tviewer",
    range(0, 2, 3, 3),
    36,
    6,
  );
  assert.equal(result.changes.length, 8);
  assert.deepEqual(result.changes[7], { row: 3, column: 3, value: "viewer" });
});

test("spreadsheet navigation clamps page and edge movements", () => {
  const cell = { row: 12, column: 3 };
  assert.deepEqual(moveCellFocus(cell, "Home", 36, 6), { row: 12, column: 0 });
  assert.deepEqual(moveCellFocus(cell, "End", 36, 6, true), {
    row: 35,
    column: 5,
  });
  assert.deepEqual(moveCellFocus(cell, "ArrowUp", 36, 6, true), {
    row: 0,
    column: 3,
  });
  assert.deepEqual(moveCellFocus(cell, "PageDown", 36, 6, false, 30), {
    row: 35,
    column: 3,
  });
  assert.deepEqual(moveCellFocus(cell, "PageUp", 36, 6, false, 30), {
    row: 0,
    column: 3,
  });
  assert.equal(moveCellFocus(cell, "Escape", 36, 6), undefined);
});

test("create, delete, undo and redo preserve snapshots and reject duplicate identifiers", () => {
  const initial = { rows: users, past: [], future: [] };
  const draft = createUserCellDraft(users, users[0]);
  assert.equal(draft.id, "USR-037");
  assert.equal(draft.email, "");
  const added = userCellHistoryReducer(initial, {
    type: "replace",
    rows: [...users, { ...draft, email: "copy@example.com" }],
  });
  assert.equal(added.rows.length, 37);
  assert.deepEqual(userCellHistoryReducer(added, { type: "undo" }).rows, users);
  const deleted = userCellHistoryReducer(added, {
    type: "replace",
    rows: added.rows.filter((row) => row.id !== users[0].id),
  });
  const undone = userCellHistoryReducer(deleted, { type: "undo" });
  assert.deepEqual(undone.rows, added.rows);
  assert.deepEqual(
    userCellHistoryReducer(undone, { type: "redo" }).rows,
    deleted.rows,
  );
  assert.equal(
    userCellHistoryReducer(initial, {
      type: "replace",
      rows: [...users, { ...users[0], email: "different@example.com" }],
    }),
    initial,
  );
});

test("column filters combine with AND, preserve user identities and support enum/date/number comparisons", () => {
  const filters = [
    { field: "name", operator: "contains", value: " ANDI " },
    { field: "status", operator: "equals", value: users[0].status },
  ];
  const result = filterUserCells(users, filters);
  assert.equal(result[0], users[0]);
  assert.equal(
    filterUserCells(users, [
      { field: "id", operator: "equals", value: "USR-002" },
    ])[0],
    users[1],
  );
  assert.equal(
    filterUserCells(users, [{ field: "no", operator: "after", value: "9" }])
      .length,
    27,
  );
  assert.equal(
    filterUserCells(users, [
      { field: "name", operator: "contains", value: "not-found" },
    ]).length,
    0,
  );
  assert.equal(
    filterUserCells(users, [{ field: "status", operator: "equals", value: "" }])
      .length,
    36,
  );
  assert.ok(
    filterUserCells(users, [
      { field: "joinDate", operator: "before", value: "2025-01-01" },
    ]).every((row) => row.joinDate < "2025-01-01"),
  );
});
