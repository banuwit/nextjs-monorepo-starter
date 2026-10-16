import assert from "node:assert/strict";
import { test } from "node:test";

test("profile page shows the employee summary and all profile sections", async () => {
  const response = await fetch("http://localhost:3000/dashboard/profile");
  const html = await response.text();

  assert.equal(response.status, 200);
  for (const text of [
    "Arham Khan",
    "Software Engineer",
    "92% Complete",
    "About",
    "Work details",
    "Reporting line",
    "Record status",
    "Upcoming events",
    "Overview",
    "Personal",
    "Employment",
    "Compensation",
    "Time off",
    "Documents",
  ]) {
    assert.ok(html.includes(text), `${text} is missing`);
  }
});
