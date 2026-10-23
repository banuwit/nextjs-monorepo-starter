import { z } from "zod";

const text = z.string().max(300);

const amount = z.number().min(0).max(1_000_000);

export const clientSchema = z.object({
  id: text.min(1),
  name: text.trim().min(1, "Client name is required."),
  email: z.email(),
  addressLines: z.array(text).max(5),
  taxId: text,
});

export const invoiceSchema = z.object({
  referenceNumber: text,
  issuedDate: z.iso.date(),
  paymentDueDate: z.iso.date(),
  from: z.object({
    name: text,
    email: text,
    phone: text,
    website: text,
    addressLines: z.array(text).max(5),
    taxId: text,
    paymentAccountName: text,
    routingNumber: text,
    issuerName: text,
  }),
  to: clientSchema,
  taxId: z.enum(["gst", "vat", "service-tax", "none"]),
  discountType: z.enum(["fixed", "percent"]),
  discountValue: amount,
  items: z
    .array(
      z.object({
        id: text.min(1),
        description: text,
        quantity: amount,
        unitPrice: amount,
      }),
    )
    .max(100),
});

export const readyInvoiceSchema = invoiceSchema.superRefine((invoice, ctx) => {
  const issue = (path: (string | number)[], message: string) =>
    ctx.addIssue({ code: "custom", path, message });
  if (!invoice.referenceNumber.trim())
    issue(["referenceNumber"], "Enter a reference number.");
  if (invoice.paymentDueDate < invoice.issuedDate)
    issue(["paymentDueDate"], "Due date must be on or after the issued date.");
  if (!invoice.items.length) issue(["items"], "Add at least one invoice item.");
  invoice.items.forEach((item, index) => {
    if (!item.description.trim())
      issue(
        ["items", index, "description"],
        `Enter a description for item ${index + 1}.`,
      );
    if (item.quantity <= 0)
      issue(
        ["items", index, "quantity"],
        `Item ${index + 1} needs a quantity greater than zero.`,
      );
  });
  if (!invoice.from.name.trim())
    issue(["from", "name"], "Enter your business name in the Business tab.");
  if (!z.email().safeParse(invoice.from.email).success)
    issue(
      ["from", "email"],
      "Enter a valid business email in the Business tab.",
    );
  if (!invoice.from.paymentAccountName.trim())
    issue(
      ["from", "paymentAccountName"],
      "Enter a payment account in the Payment tab.",
    );
  if (invoice.discountType === "percent" && invoice.discountValue > 100)
    issue(["discountValue"], "Percentage discount cannot exceed 100%.");
});
