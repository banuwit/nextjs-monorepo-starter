import { MainDashboardPage } from "@/features/dashboard/main/components/dashboard-main-page";
import { workspaceToday } from "@/features/dashboard/utils/today";

export const metadata = { title: "Overview | Dashboard" };

export default function Page() {
  return <MainDashboardPage today={workspaceToday()} />;
}
