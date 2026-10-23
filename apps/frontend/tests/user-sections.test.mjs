import assert from "node:assert/strict";
import test from "node:test";
import { users } from "../src/mocks/user.mock.ts";
import {
  buildUserSections,
  emptySectionFilters,
} from "../src/features/table/group/section/user-sections.ts";

test("role sections partition the entire mock once, in a stable role and user order", () => {
  const before = structuredClone(users);
  const sections = buildUserSections(users, emptySectionFilters);
  assert.deepEqual(
    sections.map((section) => section.role),
    ["admin", "editor", "viewer"],
  );
  assert.deepEqual(
    sections.map((section) => section.users.length),
    [12, 12, 12],
  );
  assert.equal(
    new Set(sections.flatMap((section) => section.users.map((user) => user.id)))
      .size,
    users.length,
  );
  for (const section of sections) {
    assert.deepEqual(
      section.users,
      users.filter((user) => user.role === section.role),
    );
    assert.ok(section.users.every((user) => users.includes(user)));
  }
  assert.deepEqual(users, before);
});

test("search matches user ID, name and email on the complete dataset", () => {
  const last = users.at(-1);
  for (const value of [last.id, last.name, last.email]) {
    const sections = buildUserSections(users, {
      ...emptySectionFilters,
      search: ` ${value.toUpperCase()} `,
    });
    assert.deepEqual(
      sections.flatMap((section) => section.users),
      [last],
    );
  }
});

test("combined filters update each role count and handle no matches", () => {
  const filters = { search: "", gender: "female", status: "pending" };
  const sections = buildUserSections(users, filters);
  for (const section of sections) {
    assert.deepEqual(
      section.users,
      users.filter(
        (user) =>
          user.role === section.role &&
          user.gender === "female" &&
          user.status === "pending",
      ),
    );
  }
  assert.equal(sections.flatMap((section) => section.users).length, 6);
  assert.ok(
    buildUserSections(users, { ...filters, search: "missing-user" }).every(
      (section) => section.users.length === 0,
    ),
  );
  assert.ok(
    buildUserSections([], emptySectionFilters).every(
      (section) => section.users.length === 0,
    ),
  );
});

test("new and reassigned users appear only in their current role section", () => {
  const added = {
    ...users[0],
    id: "USR-037",
    name: "New user",
    email: "new@example.com",
    role: "editor",
  };
  const data = [
    ...users.map((user) =>
      user.id === "USR-001" ? { ...user, role: "viewer" } : user,
    ),
    added,
  ];
  const sections = buildUserSections(data, emptySectionFilters);
  assert.deepEqual(
    sections.map((section) => section.users.length),
    [11, 13, 13],
  );
  assert.equal(
    sections.find((section) => section.role === "editor").users.at(-1).id,
    "USR-037",
  );
  assert.equal(users[0].role, "admin");
});
