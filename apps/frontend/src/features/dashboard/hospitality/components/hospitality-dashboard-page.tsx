import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { hospitalityMetrics } from "@/mocks/dashboard-hospitality.mock";

import { formatLongDate } from "../utils/format";
import { HospitalityArrivalsTimeline } from "./hospitality-arrivals-timeline";
import { HospitalityForecast } from "./hospitality-forecast";
import { HospitalityGuestReviews } from "./hospitality-guest-reviews";
import { HospitalityHousekeepingBoard } from "./hospitality-housekeeping-board";
import { HospitalityReservations } from "./hospitality-reservations";
import { HospitalityRevenueMix } from "./hospitality-revenue-mix";
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
        description={`${formatLongDate(today)}. ${greeting} shift: rate forecast, check-in rush, housekeeping board, guest sentiment, and reservations.`}
      />
      <KpiStrip label="Tonight" items={hospitalityMetrics} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HospitalityForecast today={today} />
        </div>
        <HospitalityArrivalsTimeline hour={hour} />
      </div>
      <HospitalityHousekeepingBoard />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <HospitalityGuestReviews />
        </div>
        <HospitalityRevenueMix />
      </div>
      <HospitalityReservations today={today} />
    </AppBody>
  );
}
