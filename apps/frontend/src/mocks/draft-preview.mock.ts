import type { Invoice } from "../features/invoice/types/invoice";

export const invoiceExample: Invoice = {
  reference: "INV-2026-024",
  issuedDate: "2026-10-28",
  dueDate: "2026-11-11",
  currency: "IDR",
  from: {
    name: "Forma Studio",
    email: "hello@forma.example",
    address: "Jl. Cihampelas No. 18\nBandung, Jawa Barat 40131",
    taxId: "",
  },
  to: {
    name: "Nusa Creative",
    email: "finance@nusa.example",
    address: "Jl. Kemang Raya No. 42\nJakarta Selatan 12730",
    taxId: "",
  },
  items: [
    {
      id: "brand",
      description: "Brand identity exploration",
      quantity: 1,
      unit: "project",
      rate: 4500000,
    },
    {
      id: "design",
      description: "Website design & art direction",
      quantity: 5,
      unit: "pages",
      rate: 850000,
    },
    {
      id: "handoff",
      description: "Design system & developer handoff",
      quantity: 1,
      unit: "package",
      rate: 1750000,
    },
  ],
  discountType: "percent",
  discountValue: 5,
  taxRate: 0,
  bank: "Bank Central Asia",
  accountName: "Forma Studio",
  accountNumber: "123 456 7890",
  notes:
    "Thank you for creating with us. Please include the invoice number in your payment reference.",
};
