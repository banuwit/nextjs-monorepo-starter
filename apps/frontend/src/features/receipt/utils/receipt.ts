import type { Receipt } from "../types/receipt";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatReceiptCurrency(cents: number) {
  return currency.format(cents / 100);
}

export function calculateReceipt(receipt: Receipt) {
  const subtotal = receipt.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  return {
    subtotal,
    total: subtotal + receipt.shipping - receipt.discount + receipt.tax,
  };
}

export function receiptEmailHref(receipt: Receipt) {
  const { subtotal, total } = calculateReceipt(receipt);
  const body = [
    `${receipt.shop.name} — Receipt ${receipt.id}`,
    `Order: ${receipt.orderId}`,
    `Date: ${receipt.date}`,
    "",
    ...receipt.items.map(
      (item) =>
        `${item.quantity} × ${item.name}: ${formatReceiptCurrency(item.quantity * item.unitPrice)}`,
    ),
    "",
    `Subtotal: ${formatReceiptCurrency(subtotal)}`,
    `Shipping: ${formatReceiptCurrency(receipt.shipping)}`,
    `Discount (${receipt.discountCode}): ${formatReceiptCurrency(-receipt.discount)}`,
    `Tax: ${formatReceiptCurrency(receipt.tax)}`,
    `Total: ${formatReceiptCurrency(total)}`,
    `Payment: ${receipt.payment.method}`,
    `Tracking: ${receipt.shipment.trackingNumber}`,
  ].join("\n");
  return `mailto:${receipt.customerEmail}?subject=${encodeURIComponent(`Receipt ${receipt.id}`)}&body=${encodeURIComponent(body)}`;
}
