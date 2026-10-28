import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { LineDotsCustomCard } from "@/features/chart/line/components/line-dots-custom-card";
import { LineLabelCard } from "@/features/chart/line/components/line-label-card";
import { LineLinearDotsCard } from "@/features/chart/line/components/line-linear-dots-card";
import { LineMetricSwitcherCard } from "@/features/chart/line/components/line-metric-switcher-card";
import { LineMultipleCard } from "@/features/chart/line/components/line-multiple-card";
import { LineStepCard } from "@/features/chart/line/components/line-step-card";
import { LineUptimeCard } from "@/features/chart/line/components/line-uptime-card";

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
    </ChartExamplePage>
  );
}
