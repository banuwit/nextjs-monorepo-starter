import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateInvoice,
  validateStep,
  billingSchema,
} from "../src/features/wizard/wizard-model.ts";
import { billingDraft, billingPlans } from "../src/mocks/wizard.mock.ts";

test("Wizard is available from the Playground navigation with the initial invoice", async () => {
  const response = await fetch("http://localhost:3000/playground/wizard");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /href="\/playground\/wizard"/);
  assert.match(html, /Wizard \| Playground/);
  assert.match(html, /Billing upgrade/);
  assert.match(html, /\$31,235/);
});

test("annual Business invoice matches the reference and rounds credit to whole dollars", () => {
  assert.deepEqual(calculateInvoice(72, 42, "annual"), {
    subtotal: 36288,
    discount: 5443,
    support: 390,
    total: 31235,
  });
});

test("monthly and changed plan or seat counts update the invoice without annual credit", () => {
  assert.deepEqual(calculateInvoice(49, 30, "monthly"), {
    subtotal: 1470,
    discount: 0,
    support: 390,
    total: 1860,
  });
  assert.equal(calculateInvoice(96, 50, "annual").total, 49350);
});

test("draft starts valid and every offered plan produces a positive invoice", () => {
  assert.equal(billingSchema.safeParse(billingDraft).success, true);
  for (const plan of billingPlans)
    assert.ok(calculateInvoice(plan.price, 42, "annual").total > 0);
});

test("step validation blocks invalid seats and owner without validating later payment fields", () => {
  const draft = {
    ...billingDraft,
    invoiceEmail: "",
    seats: 29,
    owner: "invalid",
  };
  assert.deepEqual(Object.keys(validateStep(1, draft)).sort(), [
    "owner",
    "seats",
  ]);
  assert.deepEqual(validateStep(0, { ...draft, plan: "business" }), {});
  assert.ok(validateStep(0, { ...draft, plan: "unknown" }).plan);
  for (const seats of [29, 101, 30.5, NaN])
    assert.ok(validateStep(1, { ...billingDraft, seats }).seats);
});

test("payment and final review require valid routing details", () => {
  const draft = {
    ...billingDraft,
    invoiceEmail: "invalid",
    renewal: "2026-02-30",
    purchaseOrder: " ",
  };
  assert.deepEqual(Object.keys(validateStep(2, draft)).sort(), [
    "invoiceEmail",
    "purchaseOrder",
    "renewal",
  ]);
  assert.ok(validateStep(3, { ...billingDraft, owner: "" }).owner);
  assert.deepEqual(validateStep(3, billingDraft), {});
});
