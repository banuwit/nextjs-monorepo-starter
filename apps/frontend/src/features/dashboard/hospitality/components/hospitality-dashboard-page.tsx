import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { hospitalityMetrics } from "@/mocks/dashboard-hospitality.mock";

import { formatLongDate } from "../utils/format";
import { HospitalityArrivals } from "./hospitality-arrivals";
import { HospitalityHousekeeping } from "./hospitality-housekeeping";
import { HospitalityOccupancyTrend } from "./hospitality-occupancy-trend";
import { HospitalityReservations } from "./hospitality-reservations";
import { HospitalityRevenueMix } from "./hospitality-revenue-mix";
import { HospitalityRoomGrid } from "./hospitality-room-grid";
import { KpiStrip } from "./kpi-strip";

export function HospitalityDashboardPage({
  today,
  hour,
}: {
  today: string;
  hour: number;
}) {
  const greeting = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  return (
    <AppBody>
      <PageHeading
        title="Front desk today"
        currentPage="Hospitality"
        description={`${formatLongDate(today)}. ${greeting} shift: occupancy, arrivals, room status, housekeeping, and reservations.`}
      />
      <KpiStrip label="Tonight" items={hospitalityMetrics} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HospitalityOccupancyTrend today={today} />
        </div>
        <HospitalityArrivals />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HospitalityRoomGrid />
        </div>
        <HospitalityHousekeeping />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HospitalityReservations today={today} />
        </div>
        <HospitalityRevenueMix />
      </div>
    </AppBody>
  );
}
