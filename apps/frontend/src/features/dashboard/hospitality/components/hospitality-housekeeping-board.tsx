import { ChevronRightIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  hospitalityAttendants,
  hospitalityHousekeepingBoard,
  hospitalityRoomCount,
} from "@/mocks/dashboard-hospitality.mock";

import {
  housekeepingStageOrder,
  housekeepingStageStyles,
  sharePercent,
} from "../utils/hospitality";

export function HospitalityHousekeepingBoard() {
  const columns = housekeepingStageOrder.flatMap((stage) => {
    const column = hospitalityHousekeepingBoard.find(
      (candidate) => candidate.stage === stage,
    );
    return column ? [column] : [];
  });
  const ready = columns.find((column) => column.stage === "ready")?.count ?? 0;
  const dirty = columns.find((column) => column.stage === "dirty")?.count ?? 0;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Housekeeping board</CardTitle>
        <CardDescription>
          {ready} of {hospitalityRoomCount} rooms ready, {dirty} still waiting
          for an attendant
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {columns.map((column, index) => {
            const style = housekeepingStageStyles[column.stage];
            const more = column.count - column.rooms.length;
            return (
              <li
                key={column.stage}
                className="relative flex min-w-0 flex-col overflow-hidden rounded-lg border border-border"
              >
                {index < columns.length - 1 && (
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="absolute top-3 -right-2 hidden size-4 text-muted-foreground/60 xl:block"
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-between gap-2 px-3 py-2",
                    style.header,
                  )}
                >
                  <h3 className="flex items-center gap-1.5 text-sm font-medium">
                    <span
                      aria-hidden="true"
                      className={cn("size-2 rounded-full", style.dot)}
                    />
                    {style.label}
                  </h3>
                  <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {column.count}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {sharePercent(column.count, hospitalityRoomCount)}% of{" "}
                    {hospitalityRoomCount}
                  </p>
                  <ul
                    className="flex flex-wrap gap-1.5"
                    aria-label={`${style.label} rooms`}
                  >
                    {column.rooms.map((room) => (
                      <li
                        key={room.number}
                        className="flex items-center gap-1 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-xs"
                        aria-label={`Room ${room.number}, ${room.type}${room.attendant ? `, ${room.attendant}` : ", unassigned"}`}
                      >
                        <span className="font-medium tabular-nums">
                          {room.number}
                        </span>
                        <span className="text-muted-foreground">
                          {room.type}
                        </span>
                        {room.attendant ? (
                          <span
                            aria-hidden="true"
                            className="grid size-4 place-items-center rounded-full bg-primary/10 text-[0.5625rem] font-semibold text-primary-text"
                          >
                            {room.attendant}
                          </span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className="size-4 rounded-full border border-dashed border-muted-foreground/50"
                          />
                        )}
                      </li>
                    ))}
                    {more > 0 && (
                      <li className="rounded-md px-1.5 py-0.5 text-xs text-muted-foreground tabular-nums">
                        +{more} more
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            Attendants
          </h3>
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-5">
            {hospitalityAttendants.map((attendant) => {
              const percent = sharePercent(attendant.done, attendant.assigned);
              return (
                <li key={attendant.id} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-[0.625rem] font-semibold text-primary-text"
                  >
                    {attendant.id}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="truncate font-medium">
                        {attendant.name}
                      </span>
                      <span className="shrink-0 text-muted-foreground tabular-nums">
                        {attendant.done}/{attendant.assigned}
                      </span>
                    </div>
                    <div
                      role="meter"
                      aria-valuemin={0}
                      aria-valuemax={attendant.assigned}
                      aria-valuenow={attendant.done}
                      aria-label={`${attendant.name}: ${attendant.done} of ${attendant.assigned} rooms done`}
                      className="h-1.5 overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className={cn(
                          "h-full rounded-full",
                          percent < 55 ? "bg-amber-500" : "bg-emerald-500",
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
