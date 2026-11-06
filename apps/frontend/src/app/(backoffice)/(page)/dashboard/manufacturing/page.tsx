import type { Metadata } from "next";
import { ManufacturingDashboardPage } from "@/features/dashboard/manufacturing/components/manufacturing-dashboard-page";
import {
  workspaceHour,
  workspaceMinute,
  workspaceToday,
} from "@/features/dashboard/manufacturing/utils/today";

export const metadata: Metadata = {
  title: "Manufaktur | Dashboard",
  description:
    "Shift floor at a glance: OEE, line throughput against target, live machine sensors, downtime Pareto, and maintenance work orders.",
};

export default function Page() {
  const now = new Date();
  return (
    <ManufacturingDashboardPage
      today={workspaceToday(now)}
      hour={workspaceHour(now)}
      minute={workspaceMinute(now)}
      now={now.getTime()}
    />
  );
}
