import { TooltipProvider } from "@/components/ui/tooltip";
import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { StatusTrackerPipelineCard } from "@/features/chart/status-tracker/components/status-tracker-pipeline-card";
import { StatusTrackerRunHistoryCard } from "@/features/chart/status-tracker/components/status-tracker-run-history-card";
import { StatusTrackerServicesCard } from "@/features/chart/status-tracker/components/status-tracker-services-card";
import { StatusTrackerUptimeCard } from "@/features/chart/status-tracker/components/status-tracker-uptime-card";

export function StatusTrackerChartPage() {
  return (
    <ChartExamplePage title="Status Tracker">
      <TooltipProvider>
        <StatusTrackerUptimeCard />
        <StatusTrackerServicesCard />
        <StatusTrackerPipelineCard />
        <StatusTrackerRunHistoryCard />
      </TooltipProvider>
    </ChartExamplePage>
  );
}
