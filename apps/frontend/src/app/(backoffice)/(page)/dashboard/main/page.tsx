import type { Metadata } from "next";
import { MainDashboardPage } from "@/features/dashboard/main/components/main-dashboard-page";
import { workspaceToday } from "@/features/dashboard/main/utils/today";

export const metadata: Metadata = {
  title: "Overview | Dashboard",
  description: "Key metrics and recent customer activity across the workspace.",
};

export default function Page() {
  return <MainDashboardPage today={workspaceToday()} />;
}
