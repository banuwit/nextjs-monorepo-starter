"use client";

import { PauseIcon, PlayIcon } from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { manufactureMetrics } from "@/mocks/dashboard-manufacture.mock";

import { useMachineLive } from "../hooks/use-machine-live";
import type { KpiItem } from "../types/dashboard";
import { formatLongDate } from "../utils/format";
import { KpiStrip } from "./kpi-strip";
import { ManufactureDowntimePareto } from "./manufacture-downtime-pareto";
import { ManufactureLineThroughput } from "./manufacture-line-throughput";
import { ManufactureMachineBoard } from "./manufacture-machine-board";
import { ManufactureOee } from "./manufacture-oee";
import { ManufactureWorkOrders } from "./manufacture-work-orders";

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Jakarta",
});

const BASE_THROUGHPUT = 412;

export function ManufactureDashboardPage({
  today,
  hour,
  minute,
  now,
}: {
  today: string;
  hour: number;
  minute: number;
  now: number;
}) {
  const live = useMachineLive(now);
  const throughput = Math.round(BASE_THROUGHPUT + live.extraUnits);
  const metrics: KpiItem[] = manufactureMetrics.map((item) =>
    item.label === "Throughput"
      ? { ...item, value: `${throughput} units/hr` }
      : item,
  );

  return (
    <AppBody>
      <PageHeading
        title="Shift floor"
        currentPage="Manufacture"
        description={
          <span className="flex flex-wrap items-center gap-x-2">
            {formatLongDate(today)}
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full",
                  live.paused
                    ? "bg-muted-foreground"
                    : "bg-emerald-500 motion-safe:animate-pulse",
                )}
              />
              <span role="status">
                {live.paused ? "Paused" : "Live"}, sensors read{" "}
                {clockFormat.format(live.clock)}
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
          {live.paused ? (
            <PlayIcon data-icon="inline-start" />
          ) : (
            <PauseIcon data-icon="inline-start" />
          )}
          {live.paused ? "Resume updates" : "Pause updates"}
        </Button>
      </PageHeading>

      <KpiStrip label="Shift metrics" items={metrics} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <ManufactureOee />
        <div className="min-w-0 xl:col-span-2">
          <ManufactureLineThroughput />
        </div>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <ManufactureMachineBoard
            machines={live.machines}
            latestId={live.latestId}
          />
        </div>
        <ManufactureDowntimePareto />
      </div>

      <ManufactureWorkOrders hour={hour} minute={minute} />
    </AppBody>
  );
}
