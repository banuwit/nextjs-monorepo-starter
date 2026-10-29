import { FinanceDashboardPage } from "@/features/dashboard/finance/components/dashboard-finance-page";
import { workspaceToday } from "@/features/dashboard/utils/today";

export const metadata = { title: "Finance | Dashboard" };

export default function Page() {
  return <FinanceDashboardPage today={workspaceToday()} />;
}
