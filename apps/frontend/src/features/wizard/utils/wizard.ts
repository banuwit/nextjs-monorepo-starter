import { billingSchema, stepSchemas } from "../schemas/wizard.schema";
import type { BillingDraft, BillingErrors } from "../types/wizard";

export function validateStep(step: number, draft: BillingDraft): BillingErrors {
  const result = (stepSchemas[step] ?? billingSchema).safeParse(draft);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [issue.path[0], issue.message]),
  );
}

export function calculateInvoice(
  price: number,
  seats: number,
  cycle: BillingDraft["cycle"],
) {
  const subtotal = price * seats * (cycle === "annual" ? 12 : 1);
  const discount = cycle === "annual" ? Math.round(subtotal * 0.15) : 0;
  const support = 390;
  return { subtotal, discount, support, total: subtotal - discount + support };
}
