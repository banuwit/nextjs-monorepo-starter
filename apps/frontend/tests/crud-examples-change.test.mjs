import assert from "node:assert/strict";
import { test } from "node:test";
import { applyCrudExampleChange } from "../src/mocks/crud-examples-change.ts";

const timestamp = "2026-10-16T00:00:00.000Z";
const record = (id, key = id) => ({
  id,
  key,
  value: "value",
  type: "string",
  description: "",
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp,
});

test("create, update, and delete share one immutable dataset", () => {
  const original = [record("first")];
  const created = applyCrudExampleChange(original, {
    type: "save",
    record: record("second"),
    isNew: true,
  });
  assert.equal(original.length, 1);
  assert.equal(created.length, 2);

  const edited = applyCrudExampleChange(created, {
    type: "save",
    record: { ...created[1], value: "changed" },
    isNew: false,
    expectedUpdatedAt: timestamp,
  });
  assert.equal(created[1].value, "value");
  assert.equal(edited[1].value, "changed");
  assert.deepEqual(
    applyCrudExampleChange(edited, { type: "delete", id: "second" }),
    original,
  );
});

test("rejects duplicate keys and stale or missing records", () => {
  const current = [record("first", "same")];
  assert.throws(
    () =>
      applyCrudExampleChange(current, {
        type: "save",
        record: record("second", "same"),
        isNew: true,
      }),
    /Key sudah digunakan/,
  );
  assert.throws(
    () =>
      applyCrudExampleChange(current, {
        type: "save",
        record: record("first"),
        isNew: false,
        expectedUpdatedAt: "2026-10-15T00:00:00.000Z",
      }),
    /Data sudah berubah/,
  );
  assert.throws(
    () => applyCrudExampleChange(current, { type: "delete", id: "missing" }),
    /Data tidak ditemukan/,
  );
});
