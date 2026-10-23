import { SalesDashboardPage } from "@/features/dashboard/sales/components/sales-dashboard-page";

export const metadata = { title: "Sales | Dashboard" };

export default function Page() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .map(({ type, value }) => [type, value]),
  );
  return (
    <SalesDashboardPage
      today={`${parts.year}-${parts.month}-${parts.day}T12:00:00Z`}
    />
  );
}
