import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { humanResourceMetrics } from "@/mocks/dashboard-human-resource.mock";

import { formatLongDate } from "../utils/format";
import { HumanResourceDepartmentSplit } from "./human-resource-department-split";
import { HumanResourceEmployees } from "./human-resource-employees";
import { HumanResourceEngagement } from "./human-resource-engagement";
import { HumanResourceHeadcountTrend } from "./human-resource-headcount-trend";
import { HumanResourceHiringPipeline } from "./human-resource-hiring-pipeline";
import { HumanResourceLeaveToday } from "./human-resource-leave-today";
import { KpiStrip } from "./kpi-strip";

export function HumanResourceDashboardPage({ today }: { today: string }) {
  return (
    <AppBody>
      <PageHeading
        title="People overview"
        currentPage="Human Resource"
        description={`${formatLongDate(today)}. Headcount, hiring, leave, and engagement across the company.`}
      />
      <KpiStrip label="Workforce" items={humanResourceMetrics} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HumanResourceHeadcountTrend />
        </div>
        <HumanResourceDepartmentSplit />
      </div>
      <HumanResourceHiringPipeline />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HumanResourceEngagement />
        </div>
        <HumanResourceLeaveToday />
      </div>
      <HumanResourceEmployees />
    </AppBody>
  );
}
