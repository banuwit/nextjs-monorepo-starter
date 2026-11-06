import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { logisticsMetrics } from "@/mocks/dashboard-logistics.mock";

import { formatLongDate } from "../utils/format";
import { KpiStrip } from "./kpi-strip";
import { LogisticsExceptions } from "./logistics-exceptions";
import { LogisticsFleetUtilization } from "./logistics-fleet-utilization";
import { LogisticsOnTime } from "./logistics-on-time";
import { LogisticsRouteBoard } from "./logistics-route-board";
import { LogisticsShipments } from "./logistics-shipments";
import { LogisticsStages } from "./logistics-stages";

export function LogisticsDashboardPage({
  today,
  hour,
  minute,
}: {
  today: string;
  hour: number;
  minute: number;
}) {
  return (
    <AppBody>
      <PageHeading
        title="Deliveries today"
        currentPage="Logistics"
        description={`${formatLongDate(today)}. Shipment stages, on-time performance, fleet, and routes in progress.`}
      />
      <KpiStrip label="Delivery metrics" items={logisticsMetrics} />
      <LogisticsStages />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <LogisticsOnTime today={today} />
        </div>
        <LogisticsFleetUtilization />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <LogisticsRouteBoard />
        </div>
        <LogisticsExceptions />
      </div>
      <LogisticsShipments hour={hour} minute={minute} />
    </AppBody>
  );
}
