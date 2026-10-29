import type { Metadata } from "next";
import { SalesDashboardPage } from "@/features/dashboard/sales/components/sales-dashboard-page";
import {
  workspaceHour,
  workspaceToday,
} from "@/features/dashboard/sales/utils/today";

export const metadata: Metadata = {
  title: "Sales monitor | Dashboard",
  description:
    "Live sales pace, channels, leaderboard, and alerts against the daily target.",
};

export default function Page() {
  const now = new Date();
  return (
    <SalesDashboardPage
      today={workspaceToday(now)}
      hour={workspaceHour(now)}
      now={now.getTime()}
    />
  );
}
