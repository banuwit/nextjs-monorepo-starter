"use client";

import { Ellipsis } from "lucide-react";
import {
  type TrafficSourceDatum,
  sourcesData,
  campaignsData,
  referrersData,
} from "@/mocks/dashboard-analytic.mock";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  type LabelProps,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartConfig = {
  visitors: {
    color: "var(--chart-1)",
    label: "Visitors",
  },
} satisfies ChartConfig;

const renderValueLabel = (props: LabelProps) => {
  const { height, value, y } = props;

  return (
    <text
      className="fill-foreground"
      dominantBaseline="middle"
      dx={-6}
      fontSize={14}
      textAnchor="end"
      x="100%"
      y={Number(y) + Number(height) / 2}
    >
      {value}
    </text>
  );
};

function TrafficSourceBarChart({ data }: { data: TrafficSourceDatum[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 0,
          right: 48,
        }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <YAxis
          dataKey="source"
          hide
          tickLine={false}
          tickMargin={10}
          type="category"
        />
        <XAxis dataKey="visitors" hide type="number" />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          barSize={40}
          dataKey="visitors"
          fill="var(--color-visitors)"
          fillOpacity={0.5}
          radius={8}
        >
          <LabelList
            className="fill-foreground"
            dataKey="source"
            fontSize={14}
            offset={12}
            position="insideLeft"
          />
          <LabelList content={renderValueLabel} dataKey="label" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function TopTrafficSources() {
  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">Traffic Sources</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Tabs defaultValue="sources" className="flex flex-col gap-3">
          <TabsList
            className="w-full justify-start border-b px-2.5"
            variant="line"
          >
            <TabsTrigger className="flex-none font-normal" value="sources">
              Sources
            </TabsTrigger>
            <TabsTrigger className="flex-none font-normal" value="campaigns">
              Campaigns
            </TabsTrigger>
            <TabsTrigger className="flex-none font-normal" value="referrers">
              Referrers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="px-4">
            <TrafficSourceBarChart data={sourcesData} />
          </TabsContent>

          <TabsContent value="campaigns" className="px-4">
            <TrafficSourceBarChart data={campaignsData} />
          </TabsContent>
          <TabsContent value="referrers" className="px-4">
            <TrafficSourceBarChart data={referrersData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
