import type { Metadata } from "next";
import { SlopeChartPage } from "@/features/chart/slope/components/slope-chart-page";

export const metadata: Metadata = {
  title: "Chart · Slope | Workspace",
  description:
    "Slope charts that compare ranks and values between two periods.",
};

export default function Page() {
  return <SlopeChartPage />;
}
