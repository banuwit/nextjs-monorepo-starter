import type { z } from "zod";
import type { clientSchema, invoiceSchema } from "../schemas/invoice.schema";

export type Invoice = z.infer<typeof invoiceSchema>;

export type InvoiceClient = z.infer<typeof clientSchema>;

export type InvoiceLineItem = Invoice["items"][number];
