import { SalesDashboardPage } from "@/features/dashboard/sales/components/sales-dashboard-page";
import { workspaceHour, workspaceToday } from "@/features/dashboard/utils/today";

export const metadata = { title: "Sales monitor | Dashboard" };

export default function Page() {
  const now = new Date();
  return (
    <SalesDashboardPage
      today={workspaceToday(now)}
      hour={workspaceHour(now)}
      now={now.getTime()}
    />
  );
}
