"use client";

import { useId, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { Sector, Tier } from "../types/stadium";
import { formatMoney, isOpen, stepOpenSector } from "../utils/stadium";

type PriceTimelineProps = {
  /** Sectors already in walking order. */
  sectors: Sector[];
  tiers: Tier[];
  currency: string;
  selectedId: string | null;
  onSelect: (sector: Sector) => void;
};

const BAR_WIDTH = 8;
const BAR_GAP = 4;
const HEIGHT = 150;
const TOP_PAD = 22;
const BOTTOM_PAD = 18;

export function PriceTimeline({
  sectors,
  tiers,
  currency,
  selectedId,
  onSelect,
}: PriceTimelineProps) {
  const describedBy = useId();
  const maxPrice = Math.max(...sectors.map((sector) => sector.topPrice));
  const plotHeight = HEIGHT - TOP_PAD - BOTTOM_PAD;
  const width = sectors.length * (BAR_WIDTH + BAR_GAP);
  const scale = (price: number) => TOP_PAD + plotHeight * (1 - price / maxPrice);

  const tierStarts = tiers.map((tier) => ({
    tier,
    index: sectors.findIndex((sector) => sector.tier === tier.id),
  }));

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : null;
    if (!step) return;
    event.preventDefault();
    const next = stepOpenSector(sectors, selectedId, step);
    if (next) onSelect(next);
  }

  return (
    <div
      tabIndex={0}
      role="group"
      aria-label="Price timeline by sector"
      aria-describedby={describedBy}
      onKeyDown={onKeyDown}
      className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <p id={describedBy} className="sr-only">
        One bar per sector in walking order. Bars rise to the sector top price,
        the dot marks its best available price. Use the left and right arrow
        keys to move between open sectors.
      </p>
      <svg
        viewBox={`0 0 ${width} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-36 w-full"
        aria-hidden="true"
      >
        {[0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={fraction}
            x1={0}
            x2={width}
            y1={scale(maxPrice * fraction)}
            y2={scale(maxPrice * fraction)}
            className="stroke-border"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
        ))}
        {tierStarts.map(({ tier, index }) => (
          <g key={tier.id}>
            {index > 0 && (
              <line
                x1={index * (BAR_WIDTH + BAR_GAP) - BAR_GAP / 2}
                x2={index * (BAR_WIDTH + BAR_GAP) - BAR_GAP / 2}
                y1={TOP_PAD - 10}
                y2={HEIGHT - BOTTOM_PAD}
                className="stroke-border"
                strokeWidth={1}
              />
            )}
            <text
              x={index * (BAR_WIDTH + BAR_GAP) + 2}
              y={11}
              className="fill-muted-foreground text-[10px] font-medium"
            >
              {tier.label}
            </text>
          </g>
        ))}
        {sectors.map((sector, index) => {
          const x = index * (BAR_WIDTH + BAR_GAP);
          const open = isOpen(sector);
          const selected = sector.id === selectedId;
          const top = scale(sector.topPrice);
          const bottom = HEIGHT - BOTTOM_PAD;
          return (
            <g
              key={sector.id}
              className={cn(open && "cursor-pointer")}
              onClick={() => open && onSelect(sector)}
            >
              <title>
                {open
                  ? `${sector.label} · from ${formatMoney(sector.bestPrice, currency)} · top ${formatMoney(sector.topPrice, currency)}`
                  : `${sector.label} · sold out`}
              </title>
              <rect
                x={x - BAR_GAP / 2}
                y={TOP_PAD - 10}
                width={BAR_WIDTH + BAR_GAP}
                height={bottom - TOP_PAD + 10}
                className="fill-transparent"
              />
              <rect
                x={x}
                y={top}
                width={BAR_WIDTH}
                height={bottom - top}
                rx={2}
                className={cn(
                  "transition-[fill]",
                  !open && "fill-muted-foreground/20",
                  open && !selected && "fill-primary/30",
                  selected && "fill-primary/60",
                )}
              />
              {open && (
                <circle
                  cx={x + BAR_WIDTH / 2}
                  cy={scale(sector.bestPrice)}
                  r={selected ? 4 : 3}
                  className={cn(
                    "fill-primary stroke-card",
                    selected && "stroke-ring",
                  )}
                  strokeWidth={selected ? 2 : 1.5}
                />
              )}
              {selected && (
                <text
                  x={x + BAR_WIDTH / 2}
                  y={HEIGHT - 4}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-semibold"
                >
                  {sector.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Walking order · lower to upper tier</span>
        <span>Top {formatMoney(maxPrice, currency)}</span>
      </div>
    </div>
  );
}
