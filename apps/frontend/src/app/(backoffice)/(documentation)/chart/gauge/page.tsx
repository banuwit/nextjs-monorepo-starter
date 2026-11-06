import type { Metadata } from "next";
import { GaugeChartPage } from "@/features/chart/gauge/components/gauge-chart-page";

export const metadata: Metadata = {
  title: "Chart · Gauge | Workspace",
  description:
    "Gauge charts with needle, progress, segmented, and target styles.",
};

export default function Page() {
  return <GaugeChartPage />;
}
