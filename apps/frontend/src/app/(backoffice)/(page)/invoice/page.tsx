import type { Metadata } from "next";
import { InvoicePage } from "@/features/invoice/components/invoice-page";

export const metadata: Metadata = {
  title: "Invoice | Dashboard",
  description: "Track an order's fulfillment and review its itemized invoice.",
};

export default function Page() {
  return <InvoicePage />;
}
