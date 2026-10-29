import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { KpiStrip } from "@/features/dashboard/components/kpi-strip";
import { crmMetrics } from "@/mocks/dashboard-crm.mock";

import { CrmLeadFlow } from "./crm-lead-flow";
import { CrmPipeline } from "./crm-pipeline";
import { CrmToday } from "./crm-today";

export function CrmDashboardPage() {
  return (
    <AppBody>
      <PageHeading
        title="Pipeline overview"
        currentPage="CRM"
        description="Lead quality, open deals, and conversion for the current sales cycle"
      />
      <KpiStrip label="Pipeline metrics" items={crmMetrics} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <CrmLeadFlow />
        </div>
        <CrmToday />
      </div>
      <CrmPipeline />
    </AppBody>
  );
}
