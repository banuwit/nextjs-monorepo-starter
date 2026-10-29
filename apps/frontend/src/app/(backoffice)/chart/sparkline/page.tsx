import type { Metadata } from "next";
import { SparklineChartPage } from "@/features/chart/sparkline/components/sparkline-chart-page";

export const metadata: Metadata = {
  title: "Chart · Sparkline | Workspace",
  description: "Compact sparklines for KPI tiles, tables, and service lists.",
};

export default function Page() {
  return <SparklineChartPage />;
}
