import type { Metadata } from "next";
import { ReceiptPage } from "@/features/receipt/components/receipt-page";

export const metadata: Metadata = {
  title: "Receipt | Dashboard",
  description: "View, print, and share an itemized order receipt.",
};

export default function Page() {
  return <ReceiptPage />;
}
