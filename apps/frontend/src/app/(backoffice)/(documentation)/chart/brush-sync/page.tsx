import type { Metadata } from "next";
import { BrushSyncChartPage } from "@/features/chart/brush-sync/components/brush-sync-chart-page";

export const metadata: Metadata = {
  title: "Chart · Brush & Sync | Workspace",
  description:
    "Brush and zoom charts that stay synchronized across multiple views.",
};

export default function Page() {
  return <BrushSyncChartPage />;
}
