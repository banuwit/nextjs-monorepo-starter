"use client";

import { PauseIcon, PlayIcon } from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { manufacturingMetrics } from "@/mocks/dashboard-manufacturing.mock";

import { useMachineLive } from "../hooks/use-machine-live";
import type { KpiItem } from "../types/dashboard";
import { formatLongDate } from "../utils/format";
import { KpiStrip } from "./kpi-strip";
import { ManufacturingDowntimePareto } from "./manufacturing-downtime-pareto";
import { ManufacturingLineThroughput } from "./manufacturing-line-throughput";
import { ManufacturingMachineBoard } from "./manufacturing-machine-board";
import { ManufacturingOee } from "./manufacturing-oee";
import { ManufacturingWorkOrders } from "./manufacturing-work-orders";

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Jakarta",
});

const BASE_THROUGHPUT = 412;

export function ManufacturingDashboardPage({
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
  const metrics: KpiItem[] = manufacturingMetrics.map((item) =>
    item.label === "Throughput"
      ? { ...item, value: `${throughput} units/hr` }
      : item,
  );

  return (
    <AppBody>
      <PageHeading
        title="Shift floor"
        currentPage="Manufaktur"
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
        <ManufacturingOee />
        <div className="min-w-0 xl:col-span-2">
          <ManufacturingLineThroughput />
        </div>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <ManufacturingMachineBoard
            machines={live.machines}
            latestId={live.latestId}
          />
        </div>
        <ManufacturingDowntimePareto />
      </div>

      <ManufacturingWorkOrders hour={hour} minute={minute} />
    </AppBody>
  );
}
