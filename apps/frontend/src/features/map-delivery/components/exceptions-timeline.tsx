"use client";

import { CheckIcon, EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import type { FleetException, FleetState } from "../types/map-delivery";
import { exceptionLabels, exceptionTone, formatClock, sortExceptions } from "../utils/map-delivery";

export type ExceptionFix = "reassign" | "reschedule" | "message";

type ExceptionsTimelineProps = {
  state: FleetState;
  onView: (exception: FleetException) => void;
  onAcknowledge: (exception: FleetException) => void;
  onFix: (fix: ExceptionFix, exception: FleetException) => void;
};

/** The fix that makes sense for each exception kind. */
const fixes: Record<FleetException["kind"], { fix: ExceptionFix; label: string }> = {
  breakdown: { fix: "reassign", label: "Reassign stops" },
  "late-stop": { fix: "reschedule", label: "Reschedule" },
  "low-range": { fix: "reassign", label: "Reassign stops" },
  "cargo-temp": { fix: "message", label: "Message driver" },
  "failed-attempt": { fix: "reschedule", label: "Reschedule" },
};

export function ExceptionsTimeline({ state, onView, onAcknowledge, onFix }: ExceptionsTimelineProps) {
  const items = sortExceptions(state.exceptions);
  if (!items.length) {
    return (
      <Empty className="py-10">
        <EmptyHeader>
          <EmptyTitle>No exceptions</EmptyTitle>
          <EmptyDescription>The fleet is running to plan.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ol className="relative flex flex-col gap-3 pl-5 before:absolute before:top-2 before:bottom-2 before:left-[0.4375rem] before:w-px before:bg-border">
      {items.map((item) => {
        const van = state.vans.find((entry) => entry.id === item.vanId);
        const stop = item.stopId ? state.stops.find((entry) => entry.id === item.stopId) : undefined;
        const fix = fixes[item.kind];
        const fixable = !item.acknowledged && (fix.fix === "message" || (stop && stop.status === "to-go"));
        return (
          <li key={item.id} className={cn("relative", item.acknowledged && "opacity-60")}>
            <span
              aria-hidden
              className={cn(
                "absolute top-2 -left-5 size-3.5 rounded-full ring-4 ring-background",
                item.acknowledged ? "bg-muted-foreground/40" : exceptionTone[item.kind].dot,
              )}
            />
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={cn("rounded-full px-2 py-0.5 font-medium", exceptionTone[item.kind].badge)}>
                  {exceptionLabels[item.kind]}
                </span>
                <span className="font-medium">{van?.name ?? "—"}</span>
                <span className="ml-auto tabular-nums text-muted-foreground">{formatClock(item.at)}</span>
              </div>
              <p className="mt-1.5 text-sm">{item.message}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {fixable && (
                  <Button size="xs" onClick={() => onFix(fix.fix, item)}>
                    {fix.label}
                  </Button>
                )}
                <Button size="xs" variant="outline" onClick={() => onView(item)}>
                  <EyeIcon /> View
                </Button>
                {!item.acknowledged && (
                  <Button size="xs" variant="ghost" onClick={() => onAcknowledge(item)}>
                    <CheckIcon /> Acknowledge
                  </Button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
