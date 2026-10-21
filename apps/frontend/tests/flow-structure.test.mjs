import assert from "node:assert/strict";
import { test } from "node:test";
import {
  insertStep,
  removeStep,
  simulateRun,
} from "../src/features/flow-structure/flow-model.ts";
import { flowSteps } from "../src/mocks/flow-structure.mock.ts";

test("inserting on a branch preserves its label and downstream connection", () => {
  const result = insertStep(flowSteps, "new", "triage", "terms");
  assert.equal(result.find((step) => step.id === "new").branch, "Promised");
  assert.equal(result.find((step) => step.id === "terms").parent, "new");
  assert.equal(result.find((step) => step.id === "terms").branch, undefined);
  assert.equal(flowSteps.find((step) => step.id === "terms").parent, "triage");
});

test("deleting a step reconnects children and keeps the trigger protected", () => {
  const result = removeStep(flowSteps, "terms");
  assert.equal(result.find((step) => step.id === "confirm").parent, "triage");
  assert.equal(result.find((step) => step.id === "confirm").branch, "Promised");
  assert.deepEqual(removeStep(flowSteps, "overdue"), flowSteps);
  assert.deepEqual(removeStep(flowSteps, "missing"), flowSteps);
});

test("recorded run follows the live promised branch and skips other paths", () => {
  const results = simulateRun(flowSteps);
  assert.equal(results.overdue.status, "Passed");
  assert.equal(results.terms.status, "Passed");
  assert.equal(results.confirm.status, "Failed");
  assert.equal(results.charges.status, "Skipped");
  assert.equal(results.assign.status, "Skipped");
  assert.equal(
    Object.values(results).filter((r) => r.status === "Passed").length,
    4,
  );
});

test("an unconfigured inserted step fails and blocks its descendants", () => {
  const result = simulateRun(insertStep(flowSteps, "new", "ledger", "triage"));
  assert.equal(result.new.status, "Failed");
  assert.equal(result.triage.status, "Skipped");
  assert.equal(result.confirm.status, "Skipped");
});
