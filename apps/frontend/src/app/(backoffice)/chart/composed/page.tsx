import type { Metadata } from "next";
import { ComposedChartPage } from "@/features/chart/composed/components/composed-chart-page";

export const metadata: Metadata = {
  title: "Chart · Composed | Workspace",
  description:
    "Composed charts that combine lines, bars, and areas with target bands.",
};

export default function Page() {
  return <ComposedChartPage />;
}
