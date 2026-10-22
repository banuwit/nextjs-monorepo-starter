"use client";

import { useState } from "react";
import {
  DollarSignIcon,
  PackageCheckIcon,
  ReceiptTextIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";

import { AppBody } from "@/components/app-body";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { salesMetrics } from "@/mocks/dashboard-sales.mock";

import { SalesOrders } from "./sales-orders";
import { type SalesChannel, type SalesPeriod } from "./sales-model";
import { Inventory, Reviews, SalesOverview, StoreTraffic, TopProducts, TrafficSources } from "./sales-widgets";

const metricIcons = {
  sales: DollarSignIcon,
  orders: ShoppingBagIcon,
  customers: UsersIcon,
  average: ReceiptTextIcon,
  returns: RotateCcwIcon,
  stock: PackageCheckIcon,
};

const periods: { value: SalesPeriod; label: string }[] = [
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "year-to-date", label: "Year to Date" },
];

const channels: { value: SalesChannel; label: string }[] = [
  { value: "all", label: "All Channels" },
  { value: "Online Store", label: "Online Store" },
  { value: "Marketplace", label: "Marketplace" },
  { value: "Social", label: "Social" },
  { value: "Retail", label: "Retail" },
];

export function SalesDashboardPage({ today }: { today: string }) {
  const [period, setPeriod] = useState<SalesPeriod>("this-month");
  const [channel, setChannel] = useState<SalesChannel>("all");
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(today));

  return (
    <AppBody>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Store Overview</h1>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NativeSelect aria-label="Order period" size="sm" className="w-36" value={period} onChange={(event) => setPeriod(event.target.value as SalesPeriod)}>
            {periods.map((item) => <NativeSelectOption key={item.value} value={item.value}>{item.label}</NativeSelectOption>)}
          </NativeSelect>
          <NativeSelect aria-label="Order channel" size="sm" className="w-40" value={channel} onChange={(event) => setChannel(event.target.value as SalesChannel)}>
            {channels.map((item) => <NativeSelectOption key={item.value} value={item.value}>{item.label}</NativeSelectOption>)}
          </NativeSelect>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-12">
        <section aria-label="Sales metrics and overview" className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 xl:col-span-12">
          <div className="grid xl:grid-cols-12">
            <div className="grid sm:grid-cols-2 xl:col-span-5 xl:border-r">
              {salesMetrics.map((metric) => {
                const Icon = metricIcons[metric.icon];
                return (
                  <Card key={metric.label} className="rounded-none border-b border-border shadow-none ring-0 sm:odd:border-r">
                    <CardHeader>
                      <CardTitle className="text-sm font-normal">{metric.label}</CardTitle>
                      <CardDescription className="text-3xl leading-none tracking-tight tabular-nums text-foreground">{metric.value}</CardDescription>
                      <CardAction className="grid size-6 place-items-center rounded-sm bg-muted"><Icon className="size-3" aria-hidden="true" /></CardAction>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <span className={metric.change.startsWith("-") || metric.label === "Return Requests" ? "text-destructive" : "text-primary-text"}>{metric.change}</span>
                      <span className="text-muted-foreground"> {metric.comparison}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="min-w-0 xl:col-span-7"><SalesOverview today={today} /></div>
          </div>
        </section>

        <div className="min-w-0 xl:col-span-5"><StoreTraffic /></div>
        <div className="min-w-0 xl:col-span-7"><TrafficSources /></div>
        <div className="min-w-0 xl:col-span-4"><TopProducts /></div>
        <div className="min-w-0 xl:col-span-4"><Inventory /></div>
        <div className="min-w-0 xl:col-span-4"><Reviews /></div>
        <div className="min-w-0 xl:col-span-12"><SalesOrders today={today} period={period} channel={channel} /></div>
      </div>
    </AppBody>
  );
}
