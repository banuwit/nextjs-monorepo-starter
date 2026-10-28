"use client";

import { Bar, LabelList } from "recharts";

import { formatSigned } from "@/features/chart/waterfall/utils/waterfall";
import { waterfallCategories } from "@/features/chart/waterfall/utils/waterfall-config";

/** Invisible base + one stacked bar per category, hidden via the legend. */
export function WaterfallBars({
  isHidden,
  format,
  horizontal = false,
  labels = true,
}: {
  isHidden: (key: string) => boolean;
  format: (value: number) => string;
  horizontal?: boolean;
  labels?: boolean;
}) {
  return [
    <Bar
      key="base"
      dataKey="base"
      stackId="waterfall"
      fill="transparent"
      tooltipType="none"
      isAnimationActive={false}
    />,
    ...waterfallCategories.map((category) => (
      <Bar
        key={category}
        dataKey={category}
        stackId="waterfall"
        fill={`var(--color-${category})`}
        radius={4}
        hide={isHidden(category)}
      >
        {labels && (
          <LabelList
            dataKey="amount"
            position={horizontal ? "right" : "top"}
            className="fill-foreground"
            fontSize={11}
            formatter={(value) => {
              const amount = Number(value);
              return category === "total"
                ? format(amount)
                : formatSigned(amount, format);
            }}
          />
        )}
      </Bar>
    )),
  ];
}
