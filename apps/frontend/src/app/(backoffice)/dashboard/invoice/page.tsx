import type { Metadata } from "next";
import { InvoicePage } from "@/features/invoice/components/invoice-page";

export const metadata: Metadata = {
  title: "Invoice | Dashboard",
  description:
    "Create an invoice and preview its line items, taxes, and payment details.",
};

export default function Page() {
  return <InvoicePage />;
}
