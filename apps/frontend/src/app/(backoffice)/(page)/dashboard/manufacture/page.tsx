import type { Metadata } from "next";
import { ManufactureDashboardPage } from "@/features/dashboard/manufacture/components/manufacture-dashboard-page";
import {
  workspaceHour,
  workspaceMinute,
  workspaceToday,
} from "@/features/dashboard/manufacture/utils/today";

export const metadata: Metadata = {
  title: "Manufacture | Dashboard",
  description:
    "Shift floor at a glance: OEE, line throughput against target, live machine sensors, downtime Pareto, and maintenance work orders.",
};

export default function Page() {
  const now = new Date();
  return (
    <ManufactureDashboardPage
      today={workspaceToday(now)}
      hour={workspaceHour(now)}
      minute={workspaceMinute(now)}
      now={now.getTime()}
    />
  );
}
