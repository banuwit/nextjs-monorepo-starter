import { ChartExamplePage } from "./chart-example-page";
import { WaterfallCashBridgeCard } from "@/features/chart/waterfall/components/waterfall-cash-bridge-card";
import { WaterfallConnectorCard } from "@/features/chart/waterfall/components/waterfall-connector-card";
import { WaterfallHorizontalCard } from "@/features/chart/waterfall/components/waterfall-horizontal-card";
import { WaterfallProfitLossCard } from "@/features/chart/waterfall/components/waterfall-profit-loss-card";

export function WaterfallChartPage() {
  return (
    <ChartExamplePage title="Waterfall">
      <WaterfallProfitLossCard />
      <WaterfallConnectorCard />
      <WaterfallHorizontalCard />
      <WaterfallCashBridgeCard />
    </ChartExamplePage>
  );
}
