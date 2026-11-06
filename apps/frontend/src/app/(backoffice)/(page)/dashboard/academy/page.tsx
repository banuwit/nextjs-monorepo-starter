import type { Metadata } from "next";
import { AcademyDashboardPage } from "@/features/dashboard/academy/components/academy-dashboard-page";
import { workspaceToday } from "@/features/dashboard/academy/utils/today";

export const metadata: Metadata = {
  title: "Academy | Dashboard",
  description:
    "Learning overview for this term: enrollments, completion funnel, course performance, quiz scores, and today's live sessions.",
};

export default function Page() {
  const now = new Date();
  return <AcademyDashboardPage today={workspaceToday(now)} />;
}
