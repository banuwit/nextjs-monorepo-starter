import assert from "node:assert/strict";
import test from "node:test";
import { users } from "../src/mocks/user.mock.ts";
import {
  getRowEditRows,
  rowEditReducer,
} from "../src/features/table/editable/user-editing.ts";

const initial = () => ({ rows: users, editing: null, message: "" });
const change = (state, field, value) =>
  rowEditReducer(state, { type: "change", field, value });

test("only one row is checked out and cancel preserves the saved dataset", () => {
  const state = rowEditReducer(initial(), { type: "edit", id: "USR-001" });
  for (const type of ["edit", "duplicate", "delete"]) {
    assert.equal(rowEditReducer(state, { type, id: "USR-002" }), state);
  }
  const edited = change(state, "name", "Changed");
  assert.equal(getRowEditRows(edited)[0].name, "Changed");
  assert.equal(edited.rows[0].name, "Andi Pratama");
  assert.equal(rowEditReducer(edited, { type: "cancel" }).rows, users);
  assert.equal(change(state, "id", "tampered"), state);
});

test("save validates fields and email uniqueness before committing one row", () => {
  let state = rowEditReducer(initial(), { type: "edit", id: "USR-001" });
  for (const [field, value] of [
    ["name", ""],
    ["email", "invalid"],
    ["email", users[1].email.toUpperCase()],
    ["joinDate", "2026-02-30"],
  ]) {
    const invalid = change(state, field, value);
    assert.equal(rowEditReducer(invalid, { type: "save" }), invalid);
  }
  state = change(state, "name", "  Updated Name  ");
  const saved = rowEditReducer(state, { type: "save" });
  assert.equal(saved.editing, null);
  assert.equal(saved.rows[0].name, "Updated Name");
  assert.deepEqual(saved.rows.slice(1), users.slice(1));
  assert.equal(users[0].name, "Andi Pratama");
});

test("duplicate is inserted next to its source and cancel removes the unsaved row", () => {
  const state = rowEditReducer(initial(), { type: "duplicate", id: "USR-002" });
  assert.equal(state.editing.draft.id, "USR-037");
  assert.equal(state.editing.draft.email, "");
  assert.equal(state.rows.length, 36);
  assert.equal(getRowEditRows(state)[2].id, "USR-037");
  assert.equal(rowEditReducer(state, { type: "save" }), state);
  assert.equal(
    getRowEditRows(rowEditReducer(state, { type: "cancel" })).length,
    36,
  );
});

test("saved duplicates have unique IDs and persist when a later edit is cancelled", () => {
  let state = rowEditReducer(initial(), { type: "duplicate", id: "USR-001" });
  state = change(state, "email", "copy@example.com");
  state = rowEditReducer(state, { type: "save" });
  assert.equal(state.rows.length, 37);
  assert.equal(state.rows[1].email, "copy@example.com");
  const next = rowEditReducer(state, { type: "duplicate", id: "USR-001" });
  assert.equal(next.editing.draft.id, "USR-038");
  assert.equal(rowEditReducer(next, { type: "cancel" }).rows, state.rows);
});

test("delete targets only the requested saved row; stale actions are ignored", () => {
  const state = initial();
  const deleted = rowEditReducer(state, { type: "delete", id: "USR-036" });
  assert.equal(deleted.rows.length, 35);
  assert.deepEqual(deleted.rows, users.slice(0, 35));
  for (const type of ["edit", "duplicate", "delete"])
    assert.equal(rowEditReducer(state, { type, id: "missing" }), state);
  assert.equal(users.length, 36);
});
