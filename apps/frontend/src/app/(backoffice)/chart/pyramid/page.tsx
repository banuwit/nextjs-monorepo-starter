import type { Metadata } from "next";
import { PyramidChartPage } from "@/features/chart/pyramid/components/pyramid-chart-page";

export const metadata: Metadata = {
  title: "Chart · Pyramid | Workspace",
  description: "Pyramid charts for population and percentage breakdowns.",
};

export default function Page() {
  return <PyramidChartPage />;
}
