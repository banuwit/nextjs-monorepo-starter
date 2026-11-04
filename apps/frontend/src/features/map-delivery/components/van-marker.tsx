"use client";

import {
  BikeIcon,
  CrosshairIcon,
  InfoIcon,
  MessageSquareIcon,
  PackageIcon,
  SnowflakeIcon,
  TruckIcon,
} from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import type { FleetException, Van, VanBody } from "../types/map-delivery";
import { exceptionLabels, exceptionTone, statusLabels } from "../utils/map-delivery";

export type VanMarkerAction = "open" | "follow" | "message" | "details";

const bodyIcon: Record<VanBody, typeof TruckIcon> = {
  "cargo-van": PackageIcon,
  "box-truck": TruckIcon,
  reefer: SnowflakeIcon,
  "cargo-bike": BikeIcon,
};

type VanMarkerProps = {
  van: Van;
  color: string;
  driver: string;
  exception?: FleetException;
  selected: boolean;
  showLabel: boolean;
  tabIndex: number;
  onSelect: () => void;
  onAction: (action: VanMarkerAction) => void;
};

export function VanMarker({
  van,
  color,
  driver,
  exception,
  selected,
  showLabel,
  tabIndex,
  onSelect,
  onAction,
}: VanMarkerProps) {
  const Icon = bodyIcon[van.body];
  const stalled = van.status === "breakdown";

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <button
            type="button"
            tabIndex={tabIndex}
            aria-label={`${van.name}, ${driver}, ${statusLabels[van.status]}${exception ? `, ${exceptionLabels[exception.kind]}` : ""}`}
            aria-pressed={selected}
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
            className="group/marker flex flex-col items-center gap-0.5 outline-none"
          />
        }
      >
        <span
          className={cn(
            "relative flex size-8 items-center justify-center rounded-full border-2 bg-background text-foreground shadow-md transition-transform group-focus-visible/marker:ring-3 group-focus-visible/marker:ring-ring/60",
            selected && "scale-115 ring-3 ring-primary/40",
            stalled && "border-dashed",
          )}
          style={{ borderColor: color }}
        >
          <Icon className="size-4" style={{ color }} />
          {van.status === "en-route" && (
            <span
              aria-hidden
              className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
              style={{
                background: color,
                transform: `rotate(${van.heading}deg) translateY(-1.1rem)`,
                transformOrigin: "50% 1.3rem",
              }}
            />
          )}
          {exception && (
            <span
              aria-hidden
              className={cn(
                "absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2 ring-background",
                exceptionTone[exception.kind].dot,
              )}
            />
          )}
        </span>
        {showLabel && (
          <span
            className={cn(
              "rounded-md px-1.5 py-px text-[0.6875rem] font-semibold leading-tight shadow-sm",
              selected ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground",
            )}
          >
            {van.name}
          </span>
        )}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuLabel>
            {van.name} · {driver}
          </ContextMenuLabel>
          <ContextMenuItem onClick={() => onAction("open")}>
            <InfoIcon /> Show in panel
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction("details")}>
            <PackageIcon /> Vehicle sheet
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAction("follow")}>
            <CrosshairIcon /> Follow on map
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onAction("message")}>
          <MessageSquareIcon /> Message driver
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
