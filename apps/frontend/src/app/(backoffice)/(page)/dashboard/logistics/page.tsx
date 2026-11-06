import type { Metadata } from "next";
import { LogisticsDashboardPage } from "@/features/dashboard/logistics/components/logistics-dashboard-page";
import {
  workspaceHour,
  workspaceMinute,
  workspaceToday,
} from "@/features/dashboard/logistics/utils/today";

export const metadata: Metadata = {
  title: "Logistics | Dashboard",
  description:
    "Deliveries in progress: shipment stages, on-time rate against SLA, fleet utilization, route board, and active shipments.",
};

export default function Page() {
  const now = new Date();
  return (
    <LogisticsDashboardPage
      today={workspaceToday(now)}
      hour={workspaceHour(now)}
      minute={workspaceMinute(now)}
    />
  );
}
