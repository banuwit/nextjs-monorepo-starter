import type { Metadata } from "next";
import { LineChartPage } from "@/features/chart/line/components/line-chart-page";

export const metadata: Metadata = {
  title: "Chart · Line | Workspace",
  description:
    "Line chart variants: multiple series, step, dots, labels, and live data.",
};

export default function Page() {
  return <LineChartPage />;
}
