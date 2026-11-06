import type { Metadata } from "next";
import { ZooDashboardPage } from "@/features/dashboard/zoo/components/zoo-dashboard-page";
import {
  workspaceHour,
  workspaceToday,
} from "@/features/dashboard/zoo/utils/today";

export const metadata: Metadata = {
  title: "Zoo | Dashboard",
  description:
    "Park operations for today: visitor flow, ticket mix, enclosure conditions, animal care, feeding schedule, and alerts.",
};

export default function Page() {
  const now = new Date();
  return (
    <ZooDashboardPage today={workspaceToday(now)} hour={workspaceHour(now)} />
  );
}
