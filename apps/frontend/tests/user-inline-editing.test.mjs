import assert from "node:assert/strict";
import test from "node:test";
import { users } from "../src/mocks/user.mock.ts";
import {
  getChangedUserCount,
  getUserEditErrors,
  updateUserDraft,
  userEditsSchema,
} from "../src/features/table/editable/user-editing.ts";

test("editing by stable ID preserves the seed and unrelated users", () => {
  const changed = updateUserDraft(users, "USR-036", "name", "Updated user");
  assert.equal(changed[35].name, "Updated user");
  assert.equal(users[35].name, "Anisa Zahra");
  assert.equal(changed[0], users[0]);
  assert.equal(getChangedUserCount(changed, users), 1);
  assert.equal(
    getChangedUserCount(
      updateUserDraft(changed, "USR-036", "name", users[35].name),
      users,
    ),
    0,
  );
  assert.equal(updateUserDraft(users, "USR-001", "id", "changed"), users);
});

test("invalid fields block saving and errors identify their exact cells", () => {
  let rows = updateUserDraft(users, "USR-001", "name", "  ");
  rows = updateUserDraft(rows, "USR-002", "email", "invalid");
  rows = updateUserDraft(rows, "USR-003", "joinDate", "2025-02-30");
  rows = updateUserDraft(rows, "USR-004", "role", "unknown");
  const errors = getUserEditErrors(rows);
  for (const [id, field] of [
    ["USR-001", "name"],
    ["USR-002", "email"],
    ["USR-003", "joinDate"],
    ["USR-004", "role"],
  ])
    assert.ok(errors[id][field]);
  assert.equal(userEditsSchema.safeParse(rows).success, false);
});

test("duplicate email validation is case insensitive and marks both users", () => {
  const rows = updateUserDraft(
    users,
    "USR-002",
    "email",
    users[0].email.toUpperCase(),
  );
  const errors = getUserEditErrors(rows);
  assert.ok(errors["USR-001"].email);
  assert.ok(errors["USR-002"].email);
});

test("saving normalizes values and establishes a clean new baseline", () => {
  const drafts = updateUserDraft(users, "USR-001", "name", "  New Name  ");
  const saved = userEditsSchema.parse(drafts);
  assert.equal(saved[0].name, "New Name");
  assert.equal(getChangedUserCount(saved, saved), 0);
  const later = updateUserDraft(saved, "USR-001", "name", "Later edit");
  assert.equal(getChangedUserCount(later, saved), 1);
  assert.equal(saved[0].name, "New Name");
  assert.deepEqual(getUserEditErrors(saved), {});
});
