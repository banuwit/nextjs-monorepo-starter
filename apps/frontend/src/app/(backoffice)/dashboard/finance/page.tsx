import type { Metadata } from "next";
import { FinanceDashboardPage } from "@/features/dashboard/finance/components/finance-dashboard-page";
import { workspaceToday } from "@/features/dashboard/finance/utils/today";

export const metadata: Metadata = {
  title: "Finance | Dashboard",
  description: "Accounts, spending, income, bills, and transfers at a glance.",
};

export default function Page() {
  return <FinanceDashboardPage today={workspaceToday()} />;
}
