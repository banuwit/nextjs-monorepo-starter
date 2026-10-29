import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { KpiStrip } from "./kpi-strip";
import { formatLongDate } from "../utils/format";
import { dashboardCustomers, dashboardMainMetrics } from "@/mocks/dashboard-main.mock";

import { CustomerActivity } from "./customer-activity";
import { CustomerAttention } from "./customer-attention";
import { RecentCustomers } from "./recent-customers";

export function MainDashboardPage({ today }: { today: string }) {
  return (
    <AppBody>
      <PageHeading
        title="Overview"
        currentPage="Main"
        description={`Business health for ${formatLongDate(today)}`}
      />
      <KpiStrip label="Key metrics" items={dashboardMainMetrics} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <CustomerActivity />
        </div>
        <CustomerAttention customers={dashboardCustomers} />
      </div>
      <RecentCustomers customers={dashboardCustomers} />
    </AppBody>
  );
}
