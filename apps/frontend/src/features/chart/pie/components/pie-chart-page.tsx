import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { PieDonutLegendCard } from "@/features/chart/pie/components/pie-donut-legend-card";
import { PiePaddingAngleCard } from "@/features/chart/pie/components/pie-padding-angle-card";
import { PieLabelCard } from "@/features/chart/pie/components/pie-label-card";
import { PieSeparatorNoneCard } from "@/features/chart/pie/components/pie-separator-none-card";
import { PieDonutActiveCard } from "@/features/chart/pie/components/pie-donut-active-card";
import { PieInteractiveCard } from "@/features/chart/pie/components/pie-interactive-card";
import { PieStackedCard } from "@/features/chart/pie/components/pie-stacked-card";

export function PieChartPage() {
  return (
    <ChartExamplePage title="Pie">
      <PieDonutLegendCard />
      <PiePaddingAngleCard />
      <PieLabelCard />
      <PieSeparatorNoneCard />
      <PieDonutActiveCard />
      <PieInteractiveCard />
      <PieStackedCard />
    </ChartExamplePage>
  );
}
