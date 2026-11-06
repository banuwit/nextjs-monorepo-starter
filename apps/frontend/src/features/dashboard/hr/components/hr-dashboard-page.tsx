import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { hrMetrics } from "@/mocks/dashboard-hr.mock";

import { formatLongDate } from "../utils/format";
import { HrDepartmentSplit } from "./hr-department-split";
import { HrEmployees } from "./hr-employees";
import { HrEngagement } from "./hr-engagement";
import { HrHeadcountTrend } from "./hr-headcount-trend";
import { HrHiringPipeline } from "./hr-hiring-pipeline";
import { HrLeaveToday } from "./hr-leave-today";
import { KpiStrip } from "./kpi-strip";

export function HrDashboardPage({ today }: { today: string }) {
  return (
    <AppBody>
      <PageHeading
        title="People overview"
        currentPage="HR"
        description={`${formatLongDate(today)}. Headcount, hiring, leave, and engagement across the company.`}
      />
      <KpiStrip label="Workforce" items={hrMetrics} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HrHeadcountTrend />
        </div>
        <HrDepartmentSplit />
      </div>
      <HrHiringPipeline />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HrEngagement />
        </div>
        <HrLeaveToday />
      </div>
      <HrEmployees />
    </AppBody>
  );
}
