"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Sector, Tier } from "../types/stadium";
import { midAngleRadians, tierById } from "../utils/stadium";

type SeatViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sector: Sector | null;
  tiers: Tier[];
};

const elevation: Record<Tier["id"], number> = {
  lower: 0.3,
  middle: 0.5,
  upper: 0.7,
};

/** Illustrative view of the pitch from the sector: steeper from higher tiers, skewed from the ends. */
function SeatViewPreview({ sector, tier }: { sector: Sector; tier: Tier }) {
  const lift = elevation[tier.id];
  const angle = midAngleRadians(sector);
  const skew = Math.cos(angle) * 70;
  const horizon = 110 - lift * 70;
  const farHalf = 70 + (1 - lift) * 50;
  const nearY = 232;
  const far = { left: 200 - farHalf + skew, right: 200 + farHalf + skew };
  const near = { left: 10, right: 390 };
  const centerFar = (far.left + far.right) / 2;
  const centerNear = (near.left + near.right) / 2 + skew * 0.35;

  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full rounded-lg border border-border"
      role="img"
      aria-label={`Illustrative view of the pitch from sector ${sector.label}`}
    >
      <rect width={400} height={240} className="fill-muted" />
      <rect
        y={horizon - 46}
        width={400}
        height={46}
        className="fill-muted-foreground/25"
      />
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          x1={0}
          x2={400}
          y1={horizon - 40 + i * 5}
          y2={horizon - 40 + i * 5}
          className="stroke-muted-foreground/30"
          strokeWidth={1}
        />
      ))}
      <polygon
        points={`${near.left},${nearY} ${near.right},${nearY} ${far.right},${horizon} ${far.left},${horizon}`}
        className="fill-emerald-500/85 dark:fill-emerald-600/80"
      />
      <polygon
        points={`${near.left + 14},${nearY - 8} ${near.right - 14},${nearY - 8} ${far.right - 8},${horizon + 6} ${far.left + 8},${horizon + 6}`}
        className="fill-none stroke-white/85"
        strokeWidth={1.5}
      />
      <line
        x1={centerNear}
        y1={nearY - 8}
        x2={centerFar}
        y2={horizon + 6}
        className="stroke-white/85"
        strokeWidth={1.5}
      />
      <ellipse
        cx={(centerNear + centerFar) / 2}
        cy={(nearY + horizon) / 2}
        rx={26}
        ry={9 + lift * 10}
        className="fill-none stroke-white/85"
        strokeWidth={1.5}
      />
    </svg>
  );
}

export function SeatViewDialog({
  open,
  onOpenChange,
  sector,
  tiers,
}: SeatViewDialogProps) {
  const tier = sector ? tierById(tiers, sector.tier) : null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {sector ? `View from ${sector.label}` : "Seat view"}
          </DialogTitle>
          <DialogDescription>
            {tier
              ? `${tier.label}. An illustrative render of the sightline; the real seat view is captured on match day.`
              : "Pick a sector to preview its sightline."}
          </DialogDescription>
        </DialogHeader>
        {sector && tier && (
          <div className="flex flex-col gap-3">
            <SeatViewPreview sector={sector} tier={tier} />
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">View score {sector.viewScore}/100</Badge>
              <Badge variant="outline">{sector.seatsLeft} seats left</Badge>
              <Badge variant="outline">
                Capacity {sector.capacity.toLocaleString("en-US")}
              </Badge>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
