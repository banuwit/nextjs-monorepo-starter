import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout/components/checkout-page";
import { createProductCheckoutItems } from "@/features/checkout/utils/checkout-product";

export const metadata: Metadata = {
  title: "Checkout | Dashboard",
  description: "Confirm shipping, payment, and order details in a multi-step checkout.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { product, color, size } = await searchParams;
  return (
    <CheckoutPage items={createProductCheckoutItems(product, color, size)} />
  );
}
