import type { Metadata } from "next";
import { TreemapChartPage } from "@/features/chart/treemap/components/treemap-chart-page";

export const metadata: Metadata = {
  title: "Chart · Treemap | Workspace",
  description: "Treemap variants with drill-down, sunburst, and value scales.",
};

export default function Page() {
  return <TreemapChartPage />;
}
