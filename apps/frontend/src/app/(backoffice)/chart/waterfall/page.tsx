import type { Metadata } from "next";
import { WaterfallChartPage } from "@/features/chart/waterfall/components/waterfall-chart-page";

export const metadata: Metadata = {
  title: "Chart · Waterfall | Workspace",
  description: "Waterfall charts for cash bridges and profit and loss changes.",
};

export default function Page() {
  return <WaterfallChartPage />;
}
