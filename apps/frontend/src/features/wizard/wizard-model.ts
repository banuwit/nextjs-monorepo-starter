import { z } from "zod";

export const billingSchema = z.object({
  plan: z.enum(["team", "business", "enterprise"]),
  seats: z.number().int().min(30).max(100),
  cycle: z.enum(["monthly", "annual"]),
  owner: z.email("Enter a valid request owner email."),
  reason: z.enum(["team-growth", "consolidation", "new-project"]),
  payment: z.enum(["net-30", "card", "bank-transfer"]),
  renewal: z.iso.date("Choose a valid renewal date."),
  invoiceEmail: z.email("Enter a valid invoice email."),
  purchaseOrder: z.string().trim().min(1, "Enter a purchase order.").max(100),
});

export type BillingDraft = z.infer<typeof billingSchema>;
export type BillingErrors = Partial<Record<keyof BillingDraft, string>>;

const stepSchemas = [
  billingSchema.pick({ plan: true }),
  billingSchema.pick({ seats: true, cycle: true, owner: true, reason: true }),
  billingSchema.pick({
    payment: true,
    renewal: true,
    invoiceEmail: true,
    purchaseOrder: true,
  }),
  billingSchema,
];

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
