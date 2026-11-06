import type { Metadata } from "next";
import { CandlestickChartPage } from "@/features/chart/candlestick/components/candlestick-chart-page";

export const metadata: Metadata = {
  title: "Chart · Candlestick | Workspace",
  description:
    "Candlestick charts with volume, moving average, and price range overlays.",
};

export default function Page() {
  return <CandlestickChartPage />;
}
