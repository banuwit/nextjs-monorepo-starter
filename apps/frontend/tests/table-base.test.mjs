import assert from "node:assert/strict";
import test from "node:test";

import { getMockUsers, users } from "../src/mocks/user.mock.ts";

test("user table paginates the complete dataset without overlap", () => {
  const first = getMockUsers({});
  const second = getMockUsers({ page: "2" });
  assert.equal(first.data.length, 20);
  assert.equal(first.meta.total, users.length);
  assert.equal(second.meta.page, 2);
  assert.equal(
    new Set([...first.data, ...second.data].map((user) => user.id)).size,
    users.length,
  );
});

test("search finds users beyond the first page by name, email, or ID", () => {
  const user = users.at(-1);
  for (const search of [user.name.toUpperCase(), user.email, user.id]) {
    const result = getMockUsers({ search: ` ${search} ` });
    assert.deepEqual(result.data, [user]);
    assert.equal(result.meta.total, 1);
  }
});

test("gender, role, and multi-status filters apply before pagination", () => {
  const result = getMockUsers({
    gender: "female",
    role: "editor",
    status: ["active", "pending"],
  });
  const expected = users.filter(
    (user) =>
      user.gender === "female" &&
      user.role === "editor" &&
      ["active", "pending"].includes(user.status),
  );
  assert.ok(expected.length > 0);
  assert.deepEqual(result.data, expected);
  assert.equal(result.meta.total, expected.length);
});

test("every profile column sorts in both directions before pagination", () => {
  for (const sortBy of [
    "id",
    "name",
    "email",
    "gender",
    "role",
    "joinDate",
    "status",
  ]) {
    for (const sortOrder of ["asc", "desc"]) {
      const result = getMockUsers({ sortBy, sortOrder, pageSize: "100" });
      for (let index = 1; index < result.data.length; index++) {
        const comparison = result.data[index - 1][sortBy].localeCompare(
          result.data[index][sortBy],
          "en",
        );
        assert.ok(sortOrder === "asc" ? comparison <= 0 : comparison >= 0);
      }
    }
  }
});

test("invalid query values normalize and empty or out-of-range pages remain usable", () => {
  const invalid = getMockUsers({
    page: "-1",
    pageSize: "999999",
    sortBy: "__proto__",
    sortOrder: "bad",
    gender: "bad",
    role: ["admin", "bad"],
  });
  assert.equal(invalid.meta.page, 1);
  assert.equal(invalid.meta.pageSize, 20);
  assert.equal(invalid.filters.sortBy, "id");
  assert.equal(invalid.filters.sortOrder, "asc");
  assert.equal(invalid.filters.gender, undefined);
  assert.deepEqual(invalid.filters.role, ["admin"]);
  const last = getMockUsers({ page: "999" });
  assert.equal(last.meta.page, last.meta.totalPages);
  assert.ok(last.data.length > 0);
  const empty = getMockUsers({ search: "no-such-user", page: "999" });
  assert.deepEqual(empty.data, []);
  assert.deepEqual(empty.meta, {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });
});
