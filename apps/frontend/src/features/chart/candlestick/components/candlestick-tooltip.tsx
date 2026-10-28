"use client";

import { type TooltipContentProps } from "recharts";

import type { CandleRow } from "@/features/chart/candlestick/types/candlestick";
import {
  candleColor,
  candleDirection,
  formatVolume,
} from "@/features/chart/candlestick/utils/candlestick";
import {
  candlestickConfig,
  formatPrice,
  movingAverageConfig,
} from "@/features/chart/candlestick/utils/candlestick-config";

/** OHLC tooltip with the open→close change and optional volume / averages. */
export function CandlestickTooltip({
  active,
  payload,
  formatLabel,
}: Partial<TooltipContentProps<number, string>> & {
  formatLabel: (time: string) => string;
}) {
  const row = payload?.[0]?.payload as CandleRow | undefined;
  if (!active || !row) return null;

  const direction = candleDirection(row);
  const change = row.close - row.open;
  const changePct = (change / row.open) * 100;
  const sign = change >= 0 ? "+" : "−";
  const averages = (["sma7", "sma20"] as const).filter(
    (key) => row[key] !== undefined,
  );

  return (
    <div className="grid min-w-40 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{formatLabel(row.time)}</span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-[2px]"
            style={{ backgroundColor: candleColor(row) }}
            aria-hidden="true"
          />
          <span className="text-muted-foreground">
            {candlestickConfig[direction].label}
          </span>
        </span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
        {(["open", "high", "low", "close"] as const).map((key) => (
          <div key={key} className="contents">
            <dt className="text-muted-foreground capitalize">{key}</dt>
            <dd className="text-right font-mono font-medium tabular-nums">
              {formatPrice(row[key])}
            </dd>
          </div>
        ))}
        <dt className="text-muted-foreground">Change</dt>
        <dd className="text-right font-mono tabular-nums">
          {sign}
          {formatPrice(Math.abs(change))} ({sign}
          {Math.abs(changePct).toFixed(2)}%)
        </dd>
        {row.volume !== undefined && (
          <>
            <dt className="text-muted-foreground">Volume</dt>
            <dd className="text-right font-mono tabular-nums">
              {formatVolume(row.volume)}
            </dd>
          </>
        )}
        {averages.map((key) => (
          <div key={key} className="contents">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: movingAverageConfig[key].color }}
                aria-hidden="true"
              />
              {movingAverageConfig[key].label}
            </dt>
            <dd className="text-right font-mono tabular-nums">
              {formatPrice(row[key]!)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
