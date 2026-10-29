import type { Metadata } from "next";
import { SankeyChartPage } from "@/features/chart/sankey/components/sankey-chart-page";

export const metadata: Metadata = {
  title: "Chart · Sankey | Workspace",
  description:
    "Sankey diagrams for budgets, income statements, and customer journeys.",
};

export default function Page() {
  return <SankeyChartPage />;
}
