import assert from "node:assert/strict";
import { test } from "node:test";

test("Timeline Activity renders the release timeline inside the dashboard", async () => {
  const response = await fetch(
    "http://localhost:3000/dashboard/timeline-activity",
  );
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<h1[^>]*>Timeline Activity<\/h1>/);
  assert.match(html, /href="\/dashboard\/timeline-activity"/);
  assert.match(html, /<ol[^>]*aria-label="Release changelog"/);
  for (const type of ["New", "Improved"]) {
    assert.ok(html.includes(`>${type}</span>`), `${type} badge is missing`);
  }
  assert.match(html, /<time dateTime="\d{4}-\d{2}-\d{2}"/);
  for (const release of [
    "v2.5 Release Channels",
    "v2.4 AI Assist",
    "v2.3 Theme Studio",
    "v2.2 Live Editing",
  ]) {
    assert.ok(html.includes(release), `${release} is missing`);
  }
  assert.match(html, /Demo data/);
});
