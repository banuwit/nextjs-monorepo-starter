import type { Metadata } from "next";
import { ScatterChartPage } from "@/features/chart/scatter/components/scatter-chart-page";

export const metadata: Metadata = {
  title: "Chart · Scatter | Workspace",
  description:
    "Scatter chart variants: bubbles, quadrants, trend lines, and threshold cells.",
};

export default function Page() {
  return <ScatterChartPage />;
}
