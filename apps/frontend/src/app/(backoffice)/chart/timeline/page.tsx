import type { Metadata } from "next";
import { TimelineChartPage } from "@/features/chart/timeline/components/timeline-chart-page";

export const metadata: Metadata = {
  title: "Chart · Timeline | Workspace",
  description:
    "Timeline charts with Gantt bars, milestones, shifts, and status.",
};

export default function Page() {
  return <TimelineChartPage />;
}
