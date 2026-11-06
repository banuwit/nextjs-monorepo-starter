import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { healthcareMetrics } from "@/mocks/dashboard-healthcare.mock";

import { formatLongDate } from "../utils/format";
import { HealthcareAlerts } from "./healthcare-alerts";
import { HealthcareBedMap } from "./healthcare-bed-map";
import { HealthcareDepartments } from "./healthcare-departments";
import { HealthcarePatientFlow } from "./healthcare-patient-flow";
import { HealthcareQueue } from "./healthcare-queue";
import { HealthcareRoster } from "./healthcare-roster";
import { KpiStrip } from "./kpi-strip";

export function HealthcareDashboardPage({
  today,
  hour,
}: {
  today: string;
  hour: number;
}) {
  return (
    <AppBody>
      <PageHeading
        title="Clinic operations"
        currentPage="Healthcare"
        description={`${formatLongDate(today)}. Patient flow, beds, and the doctor roster for today.`}
      />
      <KpiStrip label="Clinic today" items={healthcareMetrics} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HealthcarePatientFlow hour={hour} />
        </div>
        <HealthcareDepartments />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HealthcareBedMap />
        </div>
        <HealthcareRoster />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HealthcareQueue />
        </div>
        <HealthcareAlerts />
      </div>
    </AppBody>
  );
}
