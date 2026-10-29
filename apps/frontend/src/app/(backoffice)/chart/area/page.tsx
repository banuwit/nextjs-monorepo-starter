import type { Metadata } from "next";
import { AreaChartPage } from "@/features/chart/area/components/area-chart-page";

export const metadata: Metadata = {
  title: "Chart · Area | Workspace",
  description:
    "Area chart variants: stacked, stepped, curved, interactive, and gradient fills.",
};

export default function Page() {
  return <AreaChartPage />;
}
