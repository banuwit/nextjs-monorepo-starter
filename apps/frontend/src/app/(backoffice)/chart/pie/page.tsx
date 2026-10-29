import type { Metadata } from "next";
import { PieChartPage } from "@/features/chart/pie/components/pie-chart-page";

export const metadata: Metadata = {
  title: "Chart · Pie | Workspace",
  description:
    "Pie and donut chart variants with legends, labels, and active slices.",
};

export default function Page() {
  return <PieChartPage />;
}
