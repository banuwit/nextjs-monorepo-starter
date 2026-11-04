import type { Metadata } from "next";
import { ProcessPage } from "@/features/process/components/process-page";

export const metadata: Metadata = {
  title: "Process | Dashboard",
  description:
    "Follow an order through every step of the delivery process, from intake to proof of delivery.",
};

export default function Page() {
  return <ProcessPage />;
}
