import { addDays, format, parseISO } from "date-fns";
import type { Invoice, InvoiceClient } from "../features/invoice/types/invoice";

const defaultInvoiceValues: Invoice = {
  referenceNumber: "FL-0425",
  issuedDate: "2026-10-17",
  paymentDueDate: "2026-10-31",
  from: {
    name: "Weblabs Studio",
    email: "hello@weblabs.studio",
    phone: "+1-512-555-0184",
    website: "weblabs.studio",
    addressLines: ["214 Pixel Avenue", "Austin, TX 78701"],
    taxId: "WS-1029384756",
    paymentAccountName: "Mercury Business",
    routingNumber: "084009519",
    issuerName: "Arham Khan",
  },
  to: {
    id: "aiy-cap",
    name: "AIY Cap",
    email: "finance@aiycap.com",
    addressLines: [
      "One BKC, Bandra Kurla Complex",
      "Mumbai, Maharashtra 400051",
    ],
    taxId: "GSTIN-27AAICA9102K1Z7",
  },
  taxId: "vat",
  discountType: "fixed",
  discountValue: 40,
  items: [
    {
      id: "hosting",
      description: "Cloud hosting services",
      quantity: 1,
      unitPrice: 3500,
    },
    {
      id: "analytics",
      description: "Data analytics report",
      quantity: 2,
      unitPrice: 750,
    },
    {
      id: "support",
      description: "Technical support retainer",
      quantity: 1,
      unitPrice: 400,
    },
  ],
};

export const invoiceClients: InvoiceClient[] = [
  {
    id: "bright-enterprises",
    name: "Bright Enterprises",
    email: "billing@brightenterprises.com",
    addressLines: [
      "450 Park Avenue South",
      "New York, NY 10016",
      "United States",
    ],
    taxId: "US-EIN-84-2938475",
  },
  defaultInvoiceValues.to,
  {
    id: "northline-gmbh",
    name: "Northline GmbH",
    email: "ap@northline.de",
    addressLines: ["Kastanienallee 32", "10435 Berlin", "Germany"],
    taxId: "DE-VAT-219384756",
  },
];

export function createDemoInvoice(today: string): Invoice {
  return {
    ...structuredClone(defaultInvoiceValues),
    issuedDate: today,
    paymentDueDate: format(addDays(parseISO(today), 14), "yyyy-MM-dd"),
  };
}
