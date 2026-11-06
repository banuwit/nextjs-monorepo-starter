import type { Metadata } from "next";
import { LeadsPage } from "@/features/leads/components/leads-page";

export const metadata: Metadata = {
  title: "Leads | Dashboard",
  description: "Track CRM leads across pipelines as a kanban board or list, from first contact to won or lost.",
};

export default function Page() {
  return <LeadsPage />;
}
