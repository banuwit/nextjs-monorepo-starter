import assert from "node:assert/strict";
import test from "node:test";
import { createMockUsers, users } from "../src/mocks/user.mock.ts";
import {
  filterScrollUsers,
  nextLoadedCount,
  SCROLL_USER_COUNT,
} from "../src/features/table/scroll/user-scroll.ts";

test("large fixture retains original profiles and creates unique deterministic users", () => {
  const generated = createMockUsers(SCROLL_USER_COUNT);
  assert.equal(generated.length, 10000);
  assert.equal(new Set(generated.map((user) => user.id)).size, 10000);
  assert.equal(new Set(generated.map((user) => user.email)).size, 10000);
  assert.deepEqual(generated.slice(0, users.length), users);
  assert.deepEqual(createMockUsers(80), generated.slice(0, 80));
  assert.notEqual(generated[0], users[0]);
  const ids = new Set(generated.map((user) => user.id));
  assert.ok(
    generated.every((user) => !user.managerId || ids.has(user.managerId)),
  );
  assert.equal(users.length, 36);
});

test("search includes records beyond the loaded batch", () => {
  const generated = createMockUsers(10000);
  const target = generated.at(-1);
  assert.deepEqual(
    filterScrollUsers(generated, ` ${target.email.toUpperCase()} `),
    [target],
  );
  assert.deepEqual(filterScrollUsers(generated, "no-such-user"), []);
  assert.deepEqual(filterScrollUsers(generated, ""), generated);
});

test("load more advances a single batch and stops at partial and empty endings", () => {
  assert.equal(nextLoadedCount(0, 10000), 25);
  assert.equal(nextLoadedCount(25, 10000), 50);
  assert.equal(nextLoadedCount(50, 63), 63);
  assert.equal(nextLoadedCount(63, 63), 63);
  assert.equal(nextLoadedCount(0, 0), 0);
});
