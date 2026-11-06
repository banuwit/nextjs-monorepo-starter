"use client";

import { useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { healthcareBeds } from "@/mocks/dashboard-healthcare.mock";

import type { HealthcareWard } from "../types/healthcare";
import { bedStateOrder, bedStateStyles } from "../utils/healthcare";

type WardFilter = "all" | HealthcareWard;

const wardLabels: Record<WardFilter, string> = {
  all: "All wards",
  A: "Ward A",
  B: "Ward B",
  ICU: "ICU",
};

export function HealthcareBedMap() {
  const [ward, setWard] = useState<WardFilter>("all");
  const beds =
    ward === "all"
      ? healthcareBeds
      : healthcareBeds.filter((bed) => bed.ward === ward);
  const counts = bedStateOrder.map((state) => ({
    state,
    count: beds.filter((bed) => bed.state === state).length,
  }));

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Bed map</CardTitle>
        <CardDescription aria-live="polite">
          {wardLabels[ward]}, {beds.length} beds
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[ward]}
            onValueChange={(value) => {
              const next = value[0];
              if (
                next === "all" ||
                next === "A" ||
                next === "B" ||
                next === "ICU"
              )
                setWard(next);
            }}
            variant="outline"
            size="sm"
            aria-label="Ward"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="A">A</ToggleGroupItem>
            <ToggleGroupItem value="B">B</ToggleGroupItem>
            <ToggleGroupItem value="ICU">ICU</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul
          className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-12"
          aria-label="Beds"
        >
          {beds.map((bed) => {
            const style = bedStateStyles[bed.state];
            return (
              <li key={bed.id} className="min-w-0">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <div
                        tabIndex={0}
                        aria-label={`${bed.id}: ${style.label}${bed.patient ? `, ${bed.patient}` : ""}`}
                        className={cn(
                          "flex aspect-square items-center justify-center rounded-sm text-[0.625rem] font-medium tabular-nums outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring",
                          style.className,
                          bed.state === "occupied"
                            ? "text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {bed.id.split("-")[1]}
                      </div>
                    }
                  />
                  <TooltipContent className="flex-col items-start gap-0.5">
                    <span className="font-medium">
                      {bed.id} · {style.label}
                    </span>
                    {bed.patient && (
                      <span>
                        {bed.patient}, since {bed.since}
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>
        <dl className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
          {counts.map(({ state, count }) => (
            <div key={state} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn(
                  "size-2.5 rounded-sm",
                  bedStateStyles[state].className,
                )}
              />
              <dt className="text-muted-foreground">
                {bedStateStyles[state].label}
              </dt>
              <dd className="font-medium tabular-nums">{count}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
