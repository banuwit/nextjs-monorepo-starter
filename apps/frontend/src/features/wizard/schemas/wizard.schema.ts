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

export const stepSchemas = [
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
