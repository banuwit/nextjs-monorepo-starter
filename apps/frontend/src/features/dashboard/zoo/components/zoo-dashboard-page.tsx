import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { zooMetrics } from "@/mocks/dashboard-zoo.mock";

import { formatLongDate } from "../utils/format";
import { KpiStrip } from "./kpi-strip";
import { ZooAlerts } from "./zoo-alerts";
import { ZooAnimalCare } from "./zoo-animal-care";
import { ZooEnclosures } from "./zoo-enclosures";
import { ZooSchedule } from "./zoo-schedule";
import { ZooTicketMix } from "./zoo-ticket-mix";
import { ZooVisitorFlow } from "./zoo-visitor-flow";

export function ZooDashboardPage({
  today,
  hour,
}: {
  today: string;
  hour: number;
}) {
  return (
    <AppBody>
      <PageHeading
        title="Park operations"
        currentPage="Zoo"
        description={`${formatLongDate(today)}. Visitors, enclosures, animal care, and today's feeding schedule.`}
      />
      <KpiStrip label="Today" items={zooMetrics} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <ZooVisitorFlow hour={hour} />
        </div>
        <ZooTicketMix />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <ZooEnclosures />
        </div>
        <ZooSchedule hour={hour} />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <ZooAnimalCare />
        </div>
        <ZooAlerts />
      </div>
    </AppBody>
  );
}
