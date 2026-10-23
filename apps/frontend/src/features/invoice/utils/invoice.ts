import type { Invoice, InvoiceLineItem } from "../types/invoice";

export const invoiceTaxOptions = [
  { id: "gst", name: "GST", rate: 18 },
  { id: "vat", name: "VAT", rate: 12 },
  { id: "service-tax", name: "Service Tax", rate: 10 },
  { id: "none", name: "No Tax", rate: 0 },
] as const;

const cents = (value: number) => Math.round((value + Number.EPSILON) * 100);

const nonnegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export function getLineAmount(item: InvoiceLineItem) {
  return cents(nonnegative(item.quantity) * nonnegative(item.unitPrice)) / 100;
}

export function calculateInvoice(invoice: Invoice) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + cents(getLineAmount(item)),
    0,
  );
  const value = nonnegative(invoice.discountValue);
  const discount = Math.min(
    subtotal,
    invoice.discountType === "percent"
      ? Math.round((subtotal * value) / 100)
      : cents(value),
  );
  const rate =
    invoiceTaxOptions.find((option) => option.id === invoice.taxId)?.rate ?? 0;
  const tax = Math.round(((subtotal - discount) * rate) / 100);
  return {
    subtotal: subtotal / 100,
    discount: discount / 100,
    tax: tax / 100,
    total: (subtotal - discount + tax) / 100,
  };
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatInvoiceCurrency = (value: number) =>
  currency.format(nonnegative(value));
