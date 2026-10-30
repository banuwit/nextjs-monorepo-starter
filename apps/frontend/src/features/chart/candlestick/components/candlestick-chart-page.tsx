import { CandlestickBasicCard } from "@/features/chart/candlestick/components/candlestick-basic-card";
import { CandlestickHollowCard } from "@/features/chart/candlestick/components/candlestick-hollow-card";
import { CandlestickMovingAverageCard } from "@/features/chart/candlestick/components/candlestick-moving-average-card";
import { CandlestickRangeCard } from "@/features/chart/candlestick/components/candlestick-range-card";
import { CandlestickVolumeCard } from "@/features/chart/candlestick/components/candlestick-volume-card";
import { ChartExamplePage } from "./chart-example-page";

export function CandlestickChartPage() {
  return (
    <ChartExamplePage title="Candlestick">
      <CandlestickBasicCard />
      <CandlestickRangeCard />
      <CandlestickMovingAverageCard />
      <CandlestickHollowCard />
      <CandlestickVolumeCard />
    </ChartExamplePage>
  );
}
