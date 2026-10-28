"use client";

import type { ComponentProps } from "react";
import { cn } from "cn";

import { ChartContainer } from "@/components/ui/chart";

/**
 * Timelines need width for their date axis: the chart keeps a minimum
 * width and scrolls horizontally inside the card on narrow screens.
 */
export function TimelineChartFrame({
  className,
  ...props
}: ComponentProps<typeof ChartContainer>) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <ChartContainer
        className={cn("aspect-auto h-72 w-full min-w-[32rem]", className)}
        {...props}
      />
    </div>
  );
}
