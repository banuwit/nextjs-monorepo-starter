"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { resolutionByTeam } from "@/mocks/chart-slope.mock";

const dumbbellConfig = {
  before: { label: "Q1", color: "var(--chart-2)" },
  after: { label: "Q2", color: "var(--chart-5)" },
} satisfies ChartConfig;

type DumbbellRow = (typeof resolutionByTeam)[number] & {
  range: [number, number];
};

const dumbbellRows: DumbbellRow[] = resolutionByTeam.map((row) => ({
  ...row,
  // A range bar positions the shape between the lower and higher value.
  range: [Math.min(row.before, row.after), Math.max(row.before, row.after)],
}));

function DumbbellTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly { payload?: DumbbellRow }[];
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;

  return (
    <div className="grid min-w-32 gap-0.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <span className="font-medium">{row.team}</span>
      <span className="text-muted-foreground tabular-nums">
        {dumbbellConfig.before.label} {row.before}h →{" "}
        {dumbbellConfig.after.label} {row.after}h
      </span>
    </div>
  );
}

export function SlopeDumbbellCard() {
  const legend = useChartLegendToggle();
  const showBefore = !legend.isHidden("before");
  const showAfter = !legend.isHidden("after");

  return (
    <ChartCard
      title="Resolution time by team"
      description="Dumbbell — before/after per category, median hours"
      value="13.4h avg"
      change={-23.9}
      footer="Onboarding and support almost halved their resolution time."
    >
      {/* Category labels need width; scroll horizontally on narrow screens. */}
      <div className="-mx-1 overflow-x-auto px-1">
        <ChartContainer
          config={dumbbellConfig}
          className="aspect-auto h-64 w-full min-w-[22rem]"
        >
          <BarChart
            data={dumbbellRows}
            layout="vertical"
            accessibilityLayer
            margin={{ top: 8, bottom: 0, left: 0, right: 16 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, "dataMax + 4"]}
              tickFormatter={(value) => `${value}h`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="team"
              tickLine={false}
              axisLine={false}
              width={84}
            />
            <ChartTooltip cursor={false} content={DumbbellTooltip} />
            <Bar
              dataKey="range"
              isAnimationActive={false}
              shape={(props: {
                x?: number;
                y?: number;
                width?: number;
                height?: number;
                payload?: DumbbellRow;
              }) => {
                const { x = 0, y = 0, width = 0, height = 0, payload } = props;
                if (!payload) return <g />;
                const cy = y + height / 2;
                const lowX = x;
                const highX = x + width;
                const rising = payload.after >= payload.before;
                const beforeX = rising ? lowX : highX;
                const afterX = rising ? highX : lowX;

                return (
                  <g>
                    {showBefore && showAfter && (
                      <line
                        x1={lowX}
                        x2={highX}
                        y1={cy}
                        y2={cy}
                        stroke="var(--muted-foreground)"
                        strokeOpacity={0.5}
                        strokeWidth={3}
                        strokeLinecap="round"
                      />
                    )}
                    {showBefore && (
                      <circle
                        cx={beforeX}
                        cy={cy}
                        r={6}
                        fill="var(--color-before)"
                      />
                    )}
                    {showAfter && (
                      <circle
                        cx={afterX}
                        cy={cy}
                        r={6}
                        fill="var(--color-after)"
                      />
                    )}
                  </g>
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </div>
      <ChartLegendToggle
        items={legendItemsFromConfig(dumbbellConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
