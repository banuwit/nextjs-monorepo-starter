import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = "http://localhost:3000";

test("timeline workflow is reachable from the dashboard navigation", async () => {
  const response = await fetch(`${baseUrl}/dashboard`);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /href="\/dashboard\/timeline-workflow"/);
  assert.match(html, /Timeline Workflow/);
});

test("timeline workflow renders the approval stages and accessible controls", async () => {
  const response = await fetch(`${baseUrl}/dashboard/timeline-workflow`);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /Approval Workflow Timeline/);
  assert.match(html, /Trigger Captured/);
  assert.match(html, /Records Matched/);
  assert.match(html, /Policy Cleared/);
  assert.match(html, /Lead Signoff Running/);
  assert.match(html, /Customer Notified/);
  assert.equal((html.match(/data-workflow-step="/g) ?? []).length, 8);
  assert.match(html, /aria-current="step"/);
  assert.match(html, /aria-label="Approval workflow stages"/);
  assert.match(html, /aria-label="Preview intake.json"/);
  assert.match(html, /Demo workflow/);
});
