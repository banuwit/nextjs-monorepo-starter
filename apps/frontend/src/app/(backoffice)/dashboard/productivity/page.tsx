import { ProductivityDashboardPage } from "@/features/dashboard/productivity/components/dashboard-productivity-page";
import { workspaceHour, workspaceToday } from "@/features/dashboard/utils/today";

export const metadata = { title: "Productivity | Dashboard" };

export default function Page() {
  return (
    <ProductivityDashboardPage today={workspaceToday()} hour={workspaceHour()} />
  );
}
