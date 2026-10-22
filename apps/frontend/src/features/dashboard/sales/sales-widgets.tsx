"use client";

import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  PackageCheckIcon,
  PackageXIcon,
  StarIcon,
  TriangleAlertIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import {
  customerReviews,
  productCategories,
  revenueHistory,
  topProducts,
  trafficHistory,
  trafficSources,
} from "@/mocks/dashboard-sales.mock";

const trafficData = trafficHistory.map((visitors, index) => ({
  time: index === 0 ? "24h ago" : index === trafficHistory.length - 1 ? "now" : "",
  visitors,
  anomalies: index % 6 === 0 ? 8 : index % 4 + 1,
}));

const salesChartConfig = {
  revenue: { label: "Revenue", color: "var(--foreground)" },
  profit: { label: "Profit", color: "var(--muted-foreground)" },
} satisfies ChartConfig;
const trafficChartConfig = {
  visitors: { label: "Visitors", color: "var(--chart-3)" },
  anomalies: { label: "Anomalies", color: "var(--destructive)" },
} satisfies ChartConfig;

function PanelHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <CardHeader>
      <CardTitle className="text-sm font-normal text-muted-foreground">{title}</CardTitle>
      <CardDescription className="text-xl leading-none tracking-tight tabular-nums text-foreground">{subtitle}</CardDescription>
      <CardAction><ArrowUpRightIcon className="size-4" aria-hidden="true" /></CardAction>
    </CardHeader>
  );
}

export function SalesOverview({ today }: { today: string }) {
  const currentDate = new Date(today);
  const revenueData = revenueHistory.map((revenue, index) => {
    const month = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 11 + Math.floor(index / 6), 1));
    const label = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(month);
    return {
      month: index % 6 === 2 ? label : "",
      period: `${label} ${index % 6 + 1}`,
      revenue,
      profit: Math.round(revenue * [0.24, 0.28, 0.26][index % 3]!),
    };
  });
  return (
    <Card className="h-full rounded-none ring-0">
      <CardHeader>
        <CardTitle className="font-normal">Sales Overview</CardTitle>
        <CardAction><ArrowUpRightIcon className="size-4" aria-hidden="true" /></CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={salesChartConfig} className="h-72 w-full">
          <ComposedChart accessibilityLayer data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" interval={0} tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
            <YAxis yAxisId="revenue" hide domain={[3000, 10000]} />
            <YAxis yAxisId="profit" hide domain={[0, 6000]} />
            <ChartTooltip content={<ChartTooltipContent labelKey="period" />} cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }} />
            <Bar yAxisId="profit" dataKey="profit" fill="var(--color-profit)" opacity={0.2} barSize={4} radius={[4, 4, 0, 0]} />
            <Area yAxisId="revenue" dataKey="revenue" fill="none" stroke="var(--color-revenue)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </ComposedChart>
        </ChartContainer>
        <div className="mt-3 flex justify-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-foreground" />Revenue</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-muted-foreground" />Profit</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StoreTraffic() {
  return (
    <Card className="h-full">
      <PanelHeading title="Store Traffic" subtitle="12.9K visits" />
      <CardContent>
        <ChartContainer config={trafficChartConfig} className="h-54 w-full">
          <AreaChart accessibilityLayer data={trafficData} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
            <defs><linearGradient id="sales-traffic-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.28} /><stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.02} /></linearGradient></defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" interval={0} tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis domain={[0, 650]} width={34} tickLine={false} axisLine={false} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="visitors" type="stepAfter" fill="url(#sales-traffic-fill)" stroke="var(--color-visitors)" strokeWidth={2} dot={false} />
            <Line dataKey="anomalies" type="stepAfter" stroke="var(--color-anomalies)" strokeWidth={2} dot={false} connectNulls={false} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TrafficSources() {
  return (
    <Card className="h-full">
      <PanelHeading title="Traffic Sources" subtitle="14.8K visits" />
      <CardContent className="flex h-54 flex-col justify-between gap-2">
        {trafficSources.map((source) => (
          <div key={source.name} className="grid grid-cols-[6rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm">
            <div className="min-w-0"><div className="font-medium">{source.name}</div><div className="text-xs text-muted-foreground">{source.visits}</div></div>
            <div className="h-7 rounded-md bg-muted/70"><div className="h-full rounded-md bg-chart-3/60" style={{ width: `${source.share}%` }} /></div>
            <span className={source.change.startsWith("-") ? "text-right text-destructive" : "text-right text-primary-text"}>{source.change}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TopProducts() {
  return (
    <Card className="h-full">
      <PanelHeading title="Top Products" subtitle="73% of sales" />
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div role="img" aria-label="Sales by category: Apparel 44%, Accessories 32%, Home 24%" className="flex h-2 gap-1 overflow-hidden rounded-md bg-muted">
            {productCategories.map((category) => <span aria-hidden="true" key={category.name} className="rounded-md" style={{ backgroundColor: category.color, width: `${category.share}%` }} />)}
          </div>
          <div className="flex flex-wrap gap-4">{productCategories.map((category) => <span key={category.name} className="flex items-center gap-1 text-xs text-muted-foreground"><span className="size-2 rounded-full" style={{ backgroundColor: category.color }} />{category.name}</span>)}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-4 gap-y-3 text-sm">
          <span className="text-xs text-muted-foreground">Products</span><span className="text-xs text-muted-foreground">Share</span><span className="text-xs text-muted-foreground">Sales</span>
          {topProducts.map((product) => <div key={product.name} className="contents"><div className="min-w-0"><div className="truncate font-medium">{product.name}</div><div className="text-xs text-muted-foreground">{product.category}</div></div><span className="self-center tabular-nums text-muted-foreground">{product.share}</span><span className="self-center font-medium tabular-nums">{product.sales}</span></div>)}
        </div>
      </CardContent>
    </Card>
  );
}

const inventory = [
  { label: "In stock", value: 760, color: "var(--chart-3)", icon: PackageCheckIcon },
  { label: "Low stock", value: 320, color: "var(--chart-1)", icon: TriangleAlertIcon },
  { label: "Out", value: 160, color: "var(--destructive)", icon: PackageXIcon },
];

export function Inventory() {
  return (
    <Card className="h-full">
      <PanelHeading title="Inventory" subtitle="61% available" />
      <CardContent className="flex flex-col gap-4">
        <div role="img" aria-label="Inventory: 61% available, 760 in stock, 320 low stock, 160 out" className="relative mx-auto h-30 w-full">
          <ChartContainer config={{ stock: { color: "var(--chart-3)" } }} className="h-full w-full">
            <PieChart><Pie data={inventory} dataKey="value" startAngle={180} endAngle={0} cx="50%" cy="100%" innerRadius={72} outerRadius={98} paddingAngle={2} stroke="var(--card)">{inventory.map((item) => <Cell key={item.label} fill={item.color} />)}</Pie></PieChart>
          </ChartContainer>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center"><span className="text-2xl font-medium tabular-nums">61%</span><span className="text-xs text-muted-foreground">Available</span></div>
        </div>
        <Separator />
        <div className="grid grid-cols-3 divide-x divide-border">
          {inventory.map((item) => <div key={item.label} className="flex flex-col items-center gap-2 text-center"><span className="grid size-9 place-items-center rounded-full bg-muted"><item.icon className="size-4 text-muted-foreground" /></span><div><div className="text-xs text-muted-foreground">{item.label}</div><div className="font-medium tabular-nums">{item.value}</div></div></div>)}
        </div>
      </CardContent>
    </Card>
  );
}

export function Reviews() {
  const [index, setIndex] = useState(0);
  const review = customerReviews[index]!;

  return (
    <Card className="h-full">
      <PanelHeading title="Reviews" subtitle="4.6 average rating" />
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0"><div aria-label="5 out of 5 stars" className="flex gap-0.5">{Array.from({ length: 5 }, (_, star) => <StarIcon key={star} className="size-3.5 fill-current" aria-hidden="true" />)}</div><p className="mt-2 font-medium">{review.name}</p><p className="mt-2 line-clamp-3 min-h-[4.5em] text-muted-foreground">{review.review}</p></div>
            <div className="flex shrink-0 gap-1"><Button aria-label="Previous review" size="icon-xs" variant="outline" onClick={() => setIndex((index + customerReviews.length - 1) % customerReviews.length)}><ArrowLeftIcon /></Button><Button aria-label="Next review" size="icon-xs" variant="outline" onClick={() => setIndex((index + 1) % customerReviews.length)}><ArrowRightIcon /></Button></div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"><div><p className="font-medium">12.8K reviews</p><p className="text-xs text-muted-foreground">Customers reviewed this month</p></div><div className="flex -space-x-2" aria-label="Recent reviewers">{["EM", "OW", "NO"].map((initials) => <span key={initials} className="grid size-8 place-items-center rounded-full border-2 border-card bg-muted text-[0.65rem] font-medium">{initials}</span>)}</div></div>
      </CardContent>
    </Card>
  );
}
