import type { z } from "zod";
import {
  customerSchema,
  deliverySchema,
  paymentSchema,
  reviewSchema,
} from "../schemas/checkout.schema";
import type {
  CheckoutForm,
  CheckoutFormErrors,
  CheckoutItem,
  CheckoutPromo,
  CheckoutStepId,
} from "../types/checkout";

export const CHECKOUT_STEP_IDS: CheckoutStepId[] = [
  "customer",
  "delivery",
  "payment",
  "review",
];

export const CHECKOUT_STEPS: Record<
  CheckoutStepId,
  { label: string; title: string; description: string }
> = {
  customer: {
    label: "Customer",
    title: "Customer Details",
    description: "Use details that can receive receipts and shipment changes.",
  },
  delivery: {
    label: "Delivery",
    title: "Delivery",
    description: "Choose where the order should arrive and how quickly it should move.",
  },
  payment: {
    label: "Payment",
    title: "Payment Method",
    description: "Choose a payment option. Card details stay in this checkout form.",
  },
  review: {
    label: "Review",
    title: "Review Order",
    description: "Check the final delivery, payment, and total before placing the order.",
  },
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCheckoutCurrency(cents: number) {
  return currency.format(cents / 100);
}

export function calculateCheckout(
  items: CheckoutItem[],
  shippingPrice: number,
  taxRate: number,
  promo: CheckoutPromo | null,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const discount = !promo
    ? 0
    : promo.type === "percent"
      ? Math.round((subtotal * promo.value) / 100)
      : Math.min(promo.value, subtotal);
  const tax = Math.round((subtotal - discount + shippingPrice) * taxRate);

  return {
    subtotal,
    discount,
    tax,
    total: subtotal - discount + shippingPrice + tax,
  };
}

export function validateCheckoutFields(
  schema: z.ZodType,
  form: CheckoutForm,
): CheckoutFormErrors {
  const result = schema.safeParse(form);
  if (result.success) return {};

  const errors: CheckoutFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof CheckoutForm;
    errors[field] ??= issue.message;
  }
  return errors;
}

export const CHECKOUT_STEP_SCHEMAS: Record<CheckoutStepId, z.ZodType> = {
  customer: customerSchema,
  delivery: deliverySchema,
  payment: paymentSchema,
  review: reviewSchema,
};

export function checkoutPaymentLabel(form: CheckoutForm) {
  if (form.paymentMethod === "paypal") return "PayPal";
  if (form.paymentMethod === "apple-pay") return "Apple Pay";
  return "Card";
}

export function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatCardExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
}
