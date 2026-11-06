import type { Metadata } from "next";
import { StatusTrackerChartPage } from "@/features/chart/status-tracker/components/status-tracker-chart-page";

export const metadata: Metadata = {
  title: "Chart · Status Tracker | Workspace",
  description:
    "Status tracker bars for uptime, services, pipelines, and run history.",
};

export default function Page() {
  return <StatusTrackerChartPage />;
}
