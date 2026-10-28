import { z } from "zod";

const requiredText = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(160);
const party = z.object({
  name: requiredText,
  email: z.email("Enter a valid email address."),
  address: z.string().trim().min(1, "Enter an address.").max(500),
  taxId: z.string().max(80),
});

const invoiceBaseSchema = z.object({
  reference: requiredText.max(60),
  issuedDate: z.iso.date("Enter a valid issue date."),
  dueDate: z.iso.date("Enter a valid due date."),
  currency: z.enum(["IDR", "USD", "EUR"]),
  from: party,
  to: party,
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        description: z.string().trim().min(1, "Describe this item.").max(500),
        quantity: z
          .number("Enter a quantity.")
          .positive("Quantity must be greater than zero.")
          .max(10_000),
        unit: z.string().trim().max(20),
        rate: z
          .number("Enter a unit price.")
          .min(0, "Price cannot be negative.")
          .max(100_000_000),
      }),
    )
    .min(1, "Add at least one item.")
    .max(100, "Use at most 100 items."),
  discountType: z.enum(["fixed", "percent"]),
  discountValue: z.number("Enter a discount.").min(0).max(100_000_000),
  taxRate: z.number("Enter a tax rate.").min(0).max(100),
  bank: requiredText,
  accountName: requiredText,
  accountNumber: requiredText,
  notes: z.string().max(1500),
});

function validateDates(
  invoice: { issuedDate: string; dueDate: string },
  ctx: z.RefinementCtx,
) {
  if (invoice.dueDate < invoice.issuedDate)
    ctx.addIssue({
      code: "custom",
      path: ["dueDate"],
      message: "Due date must be on or after the issue date.",
    });
}
function validateDiscount(
  invoice: { discountType: "fixed" | "percent"; discountValue: number },
  ctx: z.RefinementCtx,
) {
  if (invoice.discountType === "percent" && invoice.discountValue > 100)
    ctx.addIssue({
      code: "custom",
      path: ["discountValue"],
      message: "Discount cannot exceed 100%.",
    });
}

export const invoiceSchema = invoiceBaseSchema.superRefine((invoice, ctx) => {
  validateDates(invoice, ctx);
  validateDiscount(invoice, ctx);
});

const invoiceStepSchemas = [
  invoiceBaseSchema
    .pick({ reference: true, issuedDate: true, dueDate: true, currency: true })
    .superRefine(validateDates),
  invoiceBaseSchema.pick({ from: true, to: true }),
  invoiceBaseSchema
    .pick({
      items: true,
      discountType: true,
      discountValue: true,
      taxRate: true,
    })
    .superRefine(validateDiscount),
  invoiceBaseSchema.pick({
    bank: true,
    accountName: true,
    accountNumber: true,
    notes: true,
  }),
] as const;

const stepFields = [
  ["reference", "issuedDate", "dueDate", "currency"],
  ["from", "to"],
  ["items", "discountType", "discountValue", "taxRate"],
  ["bank", "accountName", "accountNumber", "notes"],
] as const;

export function invoiceStepForPath(path: string) {
  const field = path.split(".")[0];
  return Math.max(
    0,
    stepFields.findIndex((fields) =>
      (fields as readonly string[]).includes(field ?? ""),
    ),
  );
}

export function validateInvoiceStep(
  step: number,
  draft: z.input<typeof invoiceSchema>,
): Record<string, string> {
  const schema = invoiceStepSchemas[step];
  if (!schema) return {};
  const result = schema.safeParse(draft);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues)
    errors[issue.path.join(".")] ??= issue.message;
  return errors;
}
