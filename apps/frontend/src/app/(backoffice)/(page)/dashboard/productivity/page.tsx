import type { Metadata } from "next";
import { ProductivityDashboardPage } from "@/features/dashboard/productivity/components/productivity-dashboard-page";
import {
  workspaceHour,
  workspaceToday,
} from "@/features/dashboard/productivity/utils/today";

export const metadata: Metadata = {
  title: "Productivity | Dashboard",
  description:
    "Tasks, projects, notes, calendar, and focus timer in one workspace.",
};

export default function Page() {
  return (
    <ProductivityDashboardPage
      today={workspaceToday()}
      hour={workspaceHour()}
    />
  );
}
