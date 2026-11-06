import type { Metadata } from "next";
import { HealthcareDashboardPage } from "@/features/dashboard/healthcare/components/healthcare-dashboard-page";
import {
  workspaceHour,
  workspaceToday,
} from "@/features/dashboard/healthcare/utils/today";

export const metadata: Metadata = {
  title: "Healthcare | Dashboard",
  description:
    "Clinic operations for today: patient flow, department occupancy, bed map, doctor roster, and the appointment queue.",
};

export default function Page() {
  const now = new Date();
  return (
    <HealthcareDashboardPage
      today={workspaceToday(now)}
      hour={workspaceHour(now)}
    />
  );
}
