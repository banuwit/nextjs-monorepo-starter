import type { Metadata } from "next";

import { CrmDashboardPage } from "@/features/dashboard/crm/crm-dashboard-page";

export const metadata: Metadata = {
  title: "CRM | Dashboard",
  description:
    "Lead quality, opportunity pipeline, meetings, and proposal progress.",
};

export default function Page() {
  return <CrmDashboardPage />;
}
