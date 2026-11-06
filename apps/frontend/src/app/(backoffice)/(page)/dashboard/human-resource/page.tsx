import type { Metadata } from "next";
import { HumanResourceDashboardPage } from "@/features/dashboard/human-resource/components/human-resource-dashboard-page";
import { workspaceToday } from "@/features/dashboard/human-resource/utils/today";

export const metadata: Metadata = {
  title: "Human Resource | Dashboard",
  description:
    "People overview: headcount movement, department split, hiring pipeline, engagement survey, leave, and the employee directory.",
};

export default function Page() {
  return <HumanResourceDashboardPage today={workspaceToday(new Date())} />;
}
