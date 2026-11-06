"use client";

import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { zooTicketMix } from "@/mocks/dashboard-zoo.mock";

import { integer } from "../utils/format";

const chartConfig = {
  count: { label: "Tickets" },
  adult: { label: "Adult", color: "var(--chart-1)" },
  child: { label: "Child", color: "var(--chart-2)" },
  family: { label: "Family", color: "var(--chart-3)" },
  member: { label: "Member", color: "var(--chart-4)" },
  group: { label: "Group", color: "var(--chart-5)" },
} satisfies ChartConfig;

// Fill per slice comes from the config so the legend and chart share colors.
const slices = zooTicketMix.map((ticket) => ({
  ...ticket,
  fill: `var(--color-${ticket.id})`,
}));

const total = zooTicketMix.reduce((sum, ticket) => sum + ticket.count, 0);

export function ZooTicketMix() {
  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Ticket mix</CardTitle>
        <CardDescription>
          {integer.format(total)} tickets sold today, by type
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-52 shrink-0"
          role="img"
          aria-label={`Donut of ${integer.format(total)} tickets sold today by type`}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="id" hideLabel />}
            />
            <Pie
              data={slices}
              dataKey="count"
              nameKey="id"
              innerRadius={58}
              strokeWidth={4}
              isAnimationActive={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-semibold"
                      >
                        {integer.format(total)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 22}
                        className="fill-muted-foreground text-xs"
                      >
                        Tickets
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <dl className="grid w-full grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3 xl:grid-cols-2">
          {zooTicketMix.map((ticket) => (
            <div key={ticket.id} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--color-${ticket.id})` }}
              />
              <dt className="flex-1 truncate text-muted-foreground">
                {ticket.label}
              </dt>
              <dd className="font-medium tabular-nums">
                {integer.format(ticket.count)}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  {Math.round((ticket.count / total) * 100)}%
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
