import assert from "node:assert/strict"
import test from "node:test"

import { getDataGridBodyState } from "../src/components/data-grid/data-grid-state.ts"

test("error replaces pending and rows so the retry remains visible", () => {
  assert.equal(
    getDataGridBodyState({ error: "Unavailable", pending: true, rowCount: 3 }),
    "error",
  )
  assert.equal(
    getDataGridBodyState({ error: "", pending: true, rowCount: 3 }),
    "error",
  )
})

test("pending navigation replaces stale rows", () => {
  assert.equal(getDataGridBodyState({ pending: true, rowCount: 3 }), "loading")
})

test("empty and populated responses select their respective states", () => {
  assert.equal(getDataGridBodyState({ rowCount: 0 }), "empty")
  assert.equal(getDataGridBodyState({ rowCount: 2 }), "rows")
})
