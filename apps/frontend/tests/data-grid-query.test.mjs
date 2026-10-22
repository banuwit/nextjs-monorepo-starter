import assert from "node:assert/strict"
import test from "node:test"

import { buildDataGridUrl } from "../src/components/data-grid/query.ts"

test("server grid query follows the list contract and removes defaults", () => {
  assert.equal(
    buildDataGridUrl(
      "/users",
      { search: "andi", status: ["active", "pending"], page: "3" },
      { page: 1, pageSize: 20, sortBy: "name", sortOrder: "asc" },
      { pageSize: 20, sortBy: "name", sortOrder: "asc" },
    ),
    "/users?search=andi&status=active&status=pending",
  )
})

test("server grid query drops cleared filters and encodes values", () => {
  assert.equal(
    buildDataGridUrl(
      "/users",
      { search: "old", status: ["active"] },
      { search: "a & b", status: undefined, page: 2 },
    ),
    "/users?search=a+%26+b&page=2",
  )
})
