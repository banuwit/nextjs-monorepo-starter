import type { Metadata } from "next";
import { RadialChartPage } from "@/features/chart/radial/components/radial-chart-page";

export const metadata: Metadata = {
  title: "Chart · Radial | Workspace",
  description:
    "Radial bar charts with rings, gauges, labels, and stacked values.",
};

export default function Page() {
  return <RadialChartPage />;
}
