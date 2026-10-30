import type { Metadata } from "next";
import { InvoicePage } from "@/features/invoice/components/invoice-page";

export const metadata: Metadata = {
  title: "Invoice | Playground",
  description: "Create an invoice, review the A4 document, and download a PDF.",
};

export default function Page() {
  return <InvoicePage />;
}
