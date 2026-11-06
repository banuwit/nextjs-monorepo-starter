import type { Metadata } from "next";
import { BoxPlotChartPage } from "@/features/chart/box-plot/components/box-plot-chart-page";

export const metadata: Metadata = {
  title: "Chart · Box Plot | Workspace",
  description:
    "Box plot variants with grouped series, outliers, and mean markers.",
};

export default function Page() {
  return <BoxPlotChartPage />;
}
