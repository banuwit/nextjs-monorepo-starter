import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateInvoice,
  invoiceSchema,
  readyInvoiceSchema,
} from "../src/features/invoice/invoice-model.ts";
import { createDemoInvoice } from "../src/mocks/invoice.mock.ts";

test("invoice matches the reference totals, taxing the discounted subtotal", () => {
  const invoice = createDemoInvoice("2026-10-17");
  assert.equal(invoice.paymentDueDate, "2026-10-31");
  assert.deepEqual(calculateInvoice(invoice), {
    subtotal: 5400,
    discount: 40,
    tax: 643.2,
    total: 6003.2,
  });
});

test("percent discounts, no tax and discounts over the subtotal stay correct", () => {
  const invoice = createDemoInvoice("2026-10-17");
  assert.deepEqual(
    calculateInvoice({
      ...invoice,
      discountType: "percent",
      discountValue: 10,
    }),
    {
      subtotal: 5400,
      discount: 540,
      tax: 583.2,
      total: 5443.2,
    },
  );
  assert.equal(calculateInvoice({ ...invoice, taxId: "none" }).total, 5360);
  assert.equal(calculateInvoice({ ...invoice, discountValue: 99999 }).total, 0);
  assert.equal(calculateInvoice({ ...invoice, items: [] }).total, 0);
});

test("currency calculations round each line to cents and exclude invalid input", () => {
  const invoice = createDemoInvoice("2026-10-17");
  const line = invoice.items[0];
  const result = calculateInvoice({
    ...invoice,
    discountValue: 0,
    taxId: "none",
    items: [
      { ...line, quantity: 3, unitPrice: 0.1 },
      { ...line, id: "two", quantity: 1, unitPrice: 1.005 },
      { ...line, id: "invalid", quantity: NaN, unitPrice: 10 },
      { ...line, id: "negative", quantity: -1, unitPrice: 10 },
    ],
  });
  assert.equal(result.total, 1.31);
});

test("stored drafts are validated and sending requires a complete invoice", () => {
  const invoice = createDemoInvoice("2026-10-17");
  assert.equal(readyInvoiceSchema.safeParse(invoice).success, true);
  for (const value of [
    null,
    {},
    { ...invoice, taxId: "unknown" },
    { ...invoice, issuedDate: "2026-02-30" },
    { ...invoice, discountValue: -1 },
    { ...invoice, items: [{ ...invoice.items[0], quantity: Infinity }] },
  ]) {
    assert.equal(invoiceSchema.safeParse(value).success, false);
  }
  for (const patch of [
    { referenceNumber: " " },
    { items: [] },
    { paymentDueDate: "2026-10-16" },
    { items: [{ ...invoice.items[0], description: "" }] },
  ]) {
    assert.equal(
      readyInvoiceSchema.safeParse({ ...invoice, ...patch }).success,
      false,
    );
  }
  assert.equal(
    invoiceSchema.safeParse({ ...invoice, items: [] }).success,
    true,
  );
});
