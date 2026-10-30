import { ChartExamplePage } from "./chart-example-page";
import { LineConnectNullsCard } from "@/features/chart/line/components/line-connect-nulls-card";
import { LineDotsCustomCard } from "@/features/chart/line/components/line-dots-custom-card";
import { LineLabelCard } from "@/features/chart/line/components/line-label-card";
import { LineLinearDotsCard } from "@/features/chart/line/components/line-linear-dots-card";
import { LineLiveCard } from "@/features/chart/line/components/line-live-card";
import { LineMetricSwitcherCard } from "@/features/chart/line/components/line-metric-switcher-card";
import { LineMultipleCard } from "@/features/chart/line/components/line-multiple-card";
import { LineNegativeCard } from "@/features/chart/line/components/line-negative-card";
import { LineStepCard } from "@/features/chart/line/components/line-step-card";
import { LineUptimeCard } from "@/features/chart/line/components/line-uptime-card";
import { LineVerticalCard } from "@/features/chart/line/components/line-vertical-card";

export function LineChartPage() {
  return (
    <ChartExamplePage title="Line">
      <LineMetricSwitcherCard />
      <LineUptimeCard />
      <LineMultipleCard />
      <LineStepCard />
      <LineLinearDotsCard />
      <LineLabelCard />
      <LineDotsCustomCard />
      <LineVerticalCard />
      <LineConnectNullsCard />
      <LineNegativeCard />
      <LineLiveCard />
    </ChartExamplePage>
  );
}
