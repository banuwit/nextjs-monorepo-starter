"use client";

import {
  DAYS,
  COMPACT_DAYS,
} from "@/features/chart/status-tracker/utils/status-meta";

export function StatusTrackerAxis() {
  return (
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>
        <span className="@xl/main:hidden">{COMPACT_DAYS} days ago</span>
        <span className="hidden @xl/main:inline">{DAYS} days ago</span>
      </span>
      <span>Today</span>
    </div>
  );
}
