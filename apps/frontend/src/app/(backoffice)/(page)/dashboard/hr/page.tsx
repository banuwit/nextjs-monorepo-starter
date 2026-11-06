import type { Metadata } from "next";
import { HrDashboardPage } from "@/features/dashboard/hr/components/hr-dashboard-page";
import { workspaceToday } from "@/features/dashboard/hr/utils/today";

export const metadata: Metadata = {
  title: "HR | Dashboard",
  description:
    "People overview: headcount movement, department split, hiring pipeline, engagement survey, leave, and the employee directory.",
};

export default function Page() {
  return <HrDashboardPage today={workspaceToday(new Date())} />;
}
