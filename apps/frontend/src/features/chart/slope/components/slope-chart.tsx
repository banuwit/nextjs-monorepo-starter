"use client";

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "cn";

import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  formatPercentChange,
  percentChange,
} from "@/features/chart/slope/utils/slope-change";

type SlopeChartProps = {
  /** Exactly two rows: start and end period, keyed by `period`. */
  data: ({ period: string } & Record<string, number | string>)[];
  config: ChartConfig;
  /** Put the lowest value at the top, e.g. for rankings. */
  reversed?: boolean;
  formatValue: (value: number) => string;
  /** Series key to emphasize; every other line is muted. */
  highlight?: string;
  /** Show the percent change next to each end value. */
  showChange?: boolean;
  /** Classes for the chart box, e.g. a taller height. */
  className?: string;
};

const mutedColor = "var(--muted-foreground)";

export function SlopeChart({
  data,
  config,
  reversed = false,
  formatValue,
  highlight,
  showChange = false,
  className,
}: SlopeChartProps) {
  const legend = useChartLegendToggle();
  const isMuted = (key: string) => highlight !== undefined && key !== highlight;
  // Hidden lines are not rendered at all so their end labels disappear too.
  // The highlighted line is drawn last so it sits on top.
  const series = Object.entries(config)
    .filter(([key]) => !legend.isHidden(key))
    .sort(([a], [b]) => Number(!isMuted(a)) - Number(!isMuted(b)));
  const legendItems = legendItemsFromConfig(config).map((item) =>
    isMuted(item.key) ? { ...item, color: mutedColor } : item,
  );

  return (
    <>
      <ChartContainer config={config} className={cn("h-72 w-full", className)}>
        <LineChart
          data={data}
          accessibilityLayer
          margin={{
            top: 16,
            bottom: 8,
            left: 56,
            right: showChange ? 136 : 88,
          }}
        >
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            padding={{ left: 8, right: 8 }}
          />
          <YAxis hide reversed={reversed} domain={["dataMin", "dataMax"]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          {series.map(([key, item]) => {
            const muted = isMuted(key);
            const color = muted ? mutedColor : `var(--color-${key})`;
            const start = Number(data[0]?.[key] ?? 0);

            return (
              <Line
                key={key}
                dataKey={key}
                stroke={color}
                strokeOpacity={muted ? 0.4 : 1}
                strokeWidth={muted ? 1.5 : 2}
                dot={{ r: muted ? 3 : 4, fill: color, fillOpacity: 1 }}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={key}
                  content={({ x, y, index, value }) => {
                    const isEnd = index === data.length - 1;
                    const change = percentChange(start, Number(value));
                    return (
                      <text
                        x={Number(x) + (isEnd ? 10 : -10)}
                        y={Number(y)}
                        textAnchor={isEnd ? "start" : "end"}
                        dominantBaseline="middle"
                        className="text-xs"
                      >
                        <tspan
                          className={cn(
                            "font-medium",
                            muted ? "fill-muted-foreground" : "fill-foreground",
                          )}
                        >
                          {formatValue(Number(value))}
                        </tspan>
                        {isEnd && showChange && (
                          <tspan
                            className={
                              change < 0
                                ? "fill-destructive"
                                : "fill-muted-foreground"
                            }
                          >
                            {" "}
                            {formatPercentChange(change)}
                          </tspan>
                        )}
                        {isEnd && (
                          <tspan className="fill-muted-foreground">
                            {" "}
                            {item.label}
                          </tspan>
                        )}
                      </text>
                    );
                  }}
                />
              </Line>
            );
          })}
        </LineChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItems}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </>
  );
}
