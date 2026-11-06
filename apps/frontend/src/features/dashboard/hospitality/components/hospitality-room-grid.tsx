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
import {
  hospitalityFloors,
  hospitalityRooms,
} from "@/mocks/dashboard-hospitality.mock";

import type { HospitalityFloor } from "../types/hospitality";
import { roomStateOrder, roomStateStyles } from "../utils/hospitality";

type FloorFilter = "all" | HospitalityFloor;

function parseFloor(value: string | undefined): FloorFilter | null {
  if (value === "all") return "all";
  const floor = Number(value);
  return hospitalityFloors.find((candidate) => candidate === floor) ?? null;
}

export function HospitalityRoomGrid() {
  const [floor, setFloor] = useState<FloorFilter>("all");
  const rooms =
    floor === "all"
      ? hospitalityRooms
      : hospitalityRooms.filter((room) => room.floor === floor);
  const counts = roomStateOrder.map((state) => ({
    state,
    count: rooms.filter((room) => room.state === state).length,
  }));

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Room status</CardTitle>
        <CardDescription aria-live="polite">
          {floor === "all" ? "All floors" : `Floor ${floor}`}, {rooms.length}{" "}
          rooms
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[String(floor)]}
            onValueChange={(value) => {
              const next = parseFloor(value[0]);
              if (next !== null) setFloor(next);
            }}
            variant="outline"
            size="sm"
            aria-label="Floor"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            {hospitalityFloors.map((candidate) => (
              <ToggleGroupItem key={candidate} value={String(candidate)}>
                {candidate}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul
          className="grid grid-cols-10 gap-1.5 sm:grid-cols-15"
          aria-label="Rooms"
        >
          {rooms.map((room) => {
            const style = roomStateStyles[room.state];
            const occupied =
              room.state === "occupied" || room.state === "due-out";
            return (
              <li key={room.number} className="min-w-0">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <div
                        tabIndex={0}
                        aria-label={`Room ${room.number}: ${style.label}${room.guest ? `, ${room.guest}` : ""}`}
                        className={cn(
                          "flex aspect-square items-center justify-center rounded-sm text-[0.625rem] font-medium tabular-nums outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring",
                          style.className,
                          room.state === "occupied"
                            ? "text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {room.number.slice(1)}
                      </div>
                    }
                  />
                  <TooltipContent className="flex-col items-start gap-0.5">
                    <span className="font-medium">
                      Room {room.number} · {style.label}
                    </span>
                    <span>{room.type}</span>
                    {occupied && room.guest && <span>{room.guest}</span>}
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
                  roomStateStyles[state].className,
                )}
              />
              <dt className="text-muted-foreground">
                {roomStateStyles[state].label}
              </dt>
              <dd className="font-medium tabular-nums">{count}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
