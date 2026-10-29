import type { Metadata } from "next";
import { CalendarPage } from "@/features/calendar/components/calendar-page";

export const metadata: Metadata = {
  title: "Calendar | Dashboard",
  description: "Schedule and manage events in month, week, and day views.",
};

export default function Page() {
  return <CalendarPage />;
}
