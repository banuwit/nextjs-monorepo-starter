"use client";

import { DownloadIcon, PauseIcon, PlayIcon } from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/features/dashboard/utils/csv";
import { formatLongDate } from "@/features/dashboard/utils/format";
import { cn } from "@/lib/utils";
import {
  salesConversionRate,
  salesDailyTarget,
  salesVisitorsLastHour,
} from "@/mocks/dashboard-sales.mock";

import { useSalesLive } from "../hooks/use-sales-live";
import { expectedByNow, ordersCsvHeader, salesTotalsAt } from "../utils/sales";
import { SalesAlerts } from "./sales-alerts";
import { SalesChannels } from "./sales-channels";
import { SalesLeaderboard } from "./sales-leaderboard";
import { SalesLiveFeed } from "./sales-live-feed";
import { SalesPaceChart } from "./sales-pace-chart";
import { SalesTarget } from "./sales-target";

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

export function SalesDashboardPage({
  today,
  hour,
  now,
}: {
  today: string;
  hour: number;
  now: number;
}) {
  const live = useSalesLive(now);
  const base = salesTotalsAt(hour);
  const revenue = base.revenue + live.extraRevenue;
  const orders = base.orders + live.extraOrders;

  return (
    <AppBody>
      <PageHeading
        title="Sales monitor"
        currentPage="Sales"
        description={
          <span className="flex flex-wrap items-center gap-x-2">
            {formatLongDate(today)}
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full",
                  live.paused ? "bg-muted-foreground" : "bg-emerald-500 motion-safe:animate-pulse",
                )}
              />
              <span role="status">
                {live.paused ? "Paused" : "Live"}, updated {clockFormat.format(live.clock)}
              </span>
            </span>
          </span>
        }
      >
        <Button
          variant="outline"
          size="sm"
          aria-pressed={live.paused}
          onClick={() => live.setPaused(!live.paused)}
        >
          {live.paused ? <PlayIcon data-icon="inline-start" /> : <PauseIcon data-icon="inline-start" />}
          {live.paused ? "Resume updates" : "Pause updates"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            downloadCsv(
              "orders-today.csv",
              ordersCsvHeader,
              live.feed.map((order) => [
                order.id,
                order.customer,
                order.product,
                order.items,
                order.channel,
                order.payment,
                order.total.toFixed(2),
              ]),
            )
          }
        >
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
      </PageHeading>

      <SalesTarget
        revenue={revenue}
        orders={orders}
        yesterdayRevenue={base.yesterdayRevenue}
        yesterdayOrders={base.yesterdayOrders}
        target={salesDailyTarget}
        expected={expectedByNow(hour, salesDailyTarget)}
        visitors={salesVisitorsLastHour}
        conversion={salesConversionRate}
      />

      <div className="grid min-w-0 gap-4 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <SalesPaceChart hour={hour} liveExtra={live.extraRevenue} target={salesDailyTarget} />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <SalesLiveFeed orders={live.feed} clock={live.clock} latestId={live.latestId} />
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SalesChannels revenue={revenue} />
        <SalesLeaderboard />
        <SalesAlerts />
      </div>
    </AppBody>
  );
}
