import type { Metadata } from "next";
import { BarChartPage } from "@/features/chart/bar/components/bar-chart-page";

export const metadata: Metadata = {
  title: "Chart · Bar | Workspace",
  description:
    "Bar chart variants: stacked, grouped, horizontal, negative values, and custom shapes.",
};

export default function Page() {
  return <BarChartPage />;
}
