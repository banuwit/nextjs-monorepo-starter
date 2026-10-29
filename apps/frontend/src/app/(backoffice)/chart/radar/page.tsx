import type { Metadata } from "next";
import { RadarChartPage } from "@/features/chart/radar/components/radar-chart-page";

export const metadata: Metadata = {
  title: "Chart · Radar | Workspace",
  description:
    "Radar chart variants with different grids, labels, and multiple series.",
};

export default function Page() {
  return <RadarChartPage />;
}
