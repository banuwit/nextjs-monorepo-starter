import type { Metadata } from "next";
import { HospitalityDashboardPage } from "@/features/dashboard/hospitality/components/hospitality-dashboard-page";
import {
  workspaceHour,
  workspaceToday,
} from "@/features/dashboard/hospitality/utils/today";

export const metadata: Metadata = {
  title: "Hospitality | Dashboard",
  description:
    "Hotel front desk for today: occupancy trend, arrivals and departures, room status by floor, housekeeping progress, revenue mix, and reservations.",
};

export default function Page() {
  const now = new Date();
  return (
    <HospitalityDashboardPage
      today={workspaceToday(now)}
      hour={workspaceHour(now)}
    />
  );
}
