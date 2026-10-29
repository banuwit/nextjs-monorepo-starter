import type { Metadata } from "next";
import { FunnelChartPage } from "@/features/chart/funnel/components/funnel-chart-page";

export const metadata: Metadata = {
  title: "Chart · Funnel | Workspace",
  description:
    "Funnel charts for conversion stages in classic, horizontal, and comparison layouts.",
};

export default function Page() {
  return <FunnelChartPage />;
}
