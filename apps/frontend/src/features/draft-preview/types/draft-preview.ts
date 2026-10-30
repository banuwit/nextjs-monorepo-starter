import type { z } from "zod";
import type { invoiceSchema } from "../schemas/invoice.schema";

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceErrors = Record<string, string>;
