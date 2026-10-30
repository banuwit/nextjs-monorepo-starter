import type { Invoice } from "../types/invoice";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatInvoiceCurrency(cents: number) {
  return currency.format(cents / 100);
}

export function calculateInvoice(invoice: Invoice) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  return {
    subtotal,
    total: subtotal + invoice.shipping - invoice.discount + invoice.tax,
  };
}

export function invoiceEmailHref(invoice: Invoice) {
  const { total } = calculateInvoice(invoice);
  const body = [
    `${invoice.shop.name} — Invoice ${invoice.id}`,
    `Order: ${invoice.orderId}`,
    `Placed: ${invoice.placedAt}`,
    `Total paid: ${formatInvoiceCurrency(total)}`,
    `Tracking: ${invoice.shipment.trackingNumber}`,
  ].join("\n");
  return `mailto:${invoice.customerEmail}?subject=${encodeURIComponent(`Invoice ${invoice.id}`)}&body=${encodeURIComponent(body)}`;
}
