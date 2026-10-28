import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { TimelineGanttCard } from "@/features/chart/timeline/components/timeline-gantt-card";
import { TimelineMilestonesCard } from "@/features/chart/timeline/components/timeline-milestones-card";
import { TimelineShiftCard } from "@/features/chart/timeline/components/timeline-shift-card";
import { TimelineStatusCard } from "@/features/chart/timeline/components/timeline-status-card";
import { TimelineTeamCard } from "@/features/chart/timeline/components/timeline-team-card";

export function TimelineChartPage() {
  return (
    <ChartExamplePage title="Timeline">
      <TimelineGanttCard />
      <TimelineTeamCard />
      <TimelineMilestonesCard />
      <TimelineStatusCard />
      <TimelineShiftCard />
    </ChartExamplePage>
  );
}
