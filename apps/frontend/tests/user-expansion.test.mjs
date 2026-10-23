import assert from "node:assert/strict";
import test from "node:test";
import { users } from "../src/mocks/user.mock.ts";
import { getDirectReports } from "../src/features/table/group/expansion/user-reporting.ts";
import { applyUserCellChanges } from "../src/features/table/editable/user-editing.ts";

test("five users have no manager and reporting relationships have no cycles", () => {
  const byId = new Map(users.map((user) => [user.id, user]));
  assert.deepEqual(
    users.filter((user) => !user.managerId).map((user) => user.id),
    ["USR-001", "USR-002", "USR-003", "USR-004", "USR-005"],
  );
  for (const user of users) {
    const visited = new Set([user.id]);
    let managerId = user.managerId;
    while (managerId) {
      assert.ok(byId.has(managerId), `Missing supervisor ${managerId}`);
      assert.ok(!visited.has(managerId), `Cycle involving ${user.id}`);
      visited.add(managerId);
      managerId = byId.get(managerId).managerId;
    }
  }
});

test("expansion resolves direct reports only, including users on other pages", () => {
  const root = getDirectReports(users, "USR-001");
  assert.deepEqual(
    root.map((user) => user.id),
    ["USR-006"],
  );
  const team = getDirectReports(users, "USR-002");
  assert.equal(team.length, 4);
  assert.ok(team.some((user) => users.indexOf(user) > 20));
  assert.deepEqual(getDirectReports(users, "USR-007").map((user) => user.id), ["USR-027", "USR-032"]);
  assert.ok(!team.some((user) => user.id === "USR-027"));
  assert.equal(getDirectReports(users, "USR-036").length, 0);
  assert.equal(getDirectReports(users, "missing").length, 0);
});

test("existing editing validation preserves supervisor relationships", () => {
  const result = applyUserCellChanges(users, [
    { id: "USR-002", field: "name", value: "Updated user" },
  ]);
  assert.equal(result.error, undefined);
  assert.equal(result.rows[1].name, "Updated user");
  assert.deepEqual(
    result.rows.map((user) => user.managerId),
    users.map((user) => user.managerId),
  );
  assert.equal(users[1].name, "Siti Rahma");
});
