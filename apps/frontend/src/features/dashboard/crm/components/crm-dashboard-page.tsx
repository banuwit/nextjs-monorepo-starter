"use client";

import { useState } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  ChartNoAxesCombinedIcon,
  PercentIcon,
  WalletIcon,
} from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  crmLeadFlow,
  crmMeetings,
  crmMetrics,
} from "@/mocks/dashboard-crm.mock";

import { summarizeCrmLeadFlow } from "../utils/crm-data";
import { RecentOpportunities } from "./recent-opportunities";

const metricIcons = [
  WalletIcon,
  PercentIcon,
  BriefcaseBusinessIcon,
  ChartNoAxesCombinedIcon,
];

const periodOptions = [
  { value: "12", label: "Last 12 months" },
  { value: "6", label: "Last 6 months" },
  { value: "3", label: "Last 3 months" },
];

const flowConfig = {
  qualified: { label: "Qualified leads", color: "var(--chart-2)" },
  booked: { label: "Discovery calls", color: "var(--chart-3)" },
} satisfies ChartConfig;

function PipelineMetrics() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {crmMetrics.map((metric, index) => {
        const Icon = metricIcons[index];
        return (
          <Card key={metric.label} className="min-w-0 shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {metric.label}
              </CardTitle>
              <CardAction>
                <span className="grid size-8 place-items-center rounded-lg border bg-muted/50 text-muted-foreground">
                  {Icon && <Icon className="size-4" aria-hidden="true" />}
                </span>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums tracking-tight">
                  {metric.value}
                </span>
                <span className="flex items-center gap-0.5 text-xs font-medium text-primary-text">
                  {metric.positive ? (
                    <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowDownRightIcon
                      className="size-3.5"
                      aria-hidden="true"
                    />
                  )}
                  {metric.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{metric.previous}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function QualifiedLeadFlow() {
  const [period, setPeriod] = useState("12");
  const points = crmLeadFlow.slice(-Number(period));
  const { qualified, booked, bookingRate } = summarizeCrmLeadFlow(points);

  return (
    <Card className="min-w-0 shadow-xs lg:col-span-8">
      <CardHeader>
        <CardTitle>Qualified Lead Flow</CardTitle>
        <CardAction>
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value ?? "12")}
            items={periodOptions}
          >
            <SelectTrigger
              size="sm"
              aria-label="Lead flow period"
              className="w-38"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ChartContainer
          config={flowConfig}
          className="aspect-auto h-64 w-full"
          role="img"
          aria-label={`Qualified leads and discovery calls for the last ${period} months`}
        >
          <AreaChart
            data={points}
            accessibilityLayer
            margin={{ left: -24, right: 8, top: 8 }}
          >
            <defs>
              <linearGradient id="crmLeadFlowFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-qualified)"
                  stopOpacity={0.24}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-qualified)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.5} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              type="monotone"
              dataKey="qualified"
              stroke="var(--color-qualified)"
              fill="url(#crmLeadFlowFill)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="booked"
              stroke="var(--color-booked)"
              fill="transparent"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
        <div className="grid gap-5 border-t pt-5 sm:grid-cols-2">
          <div>
            <p className="text-2xl font-semibold tabular-nums">
              {qualified} leads
            </p>
            <p className="text-sm text-muted-foreground">
              Total qualified leads captured over the last {period} months.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Discovery Calls Booked</p>
            <p className="text-xl font-semibold tabular-nums">
              {booked} meetings
            </p>
            <p className="text-xs text-muted-foreground">
              {bookingRate}% of qualified leads booked a first call.
            </p>
            <Progress
              value={bookingRate}
              aria-label={`${bookingRate}% of qualified leads booked a first call`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{booked} booked</span>
              <span>{qualified} qualified</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingMeetings() {
  return (
    <Card className="min-w-0 shadow-xs">
      <CardHeader>
        <CardTitle>Upcoming Meetings</CardTitle>
        <CardAction>
          <Link
            href="/dashboard/calendar"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <CalendarDaysIcon data-icon="inline-start" />
            View Calendar
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          {crmMeetings.map((meeting) => (
            <li
              key={meeting.time}
              className="grid grid-cols-[3.5rem_1fr] gap-3 border-t py-3 first:border-0 first:pt-0 last:pb-0"
            >
              <time className="text-xs tabular-nums text-muted-foreground">
                {meeting.time}
              </time>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{meeting.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {meeting.account}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function ProposalGoal() {
  const sent = 12;
  const target = 18;
  const progress = Math.round((sent / target) * 100);
  return (
    <Card className="min-w-0 shadow-xs">
      <CardHeader>
        <CardTitle>Monthly Proposal Goal</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <span className="text-3xl font-semibold tabular-nums">{sent}</span>
            <span className="ml-1 text-sm text-muted-foreground">sent</span>
          </div>
          <span className="text-sm text-muted-foreground">{target} target</span>
        </div>
        <Progress
          value={progress}
          aria-label={`${progress}% of monthly proposal target reached`}
        />
        <p className="text-sm text-muted-foreground">
          {progress}% of this month&apos;s proposal target reached.
        </p>
      </CardContent>
    </Card>
  );
}

export function CrmDashboardPage() {
  return (
    <AppBody>
      <PageHeading title="Pipeline Overview" currentPage="CRM" />
      <p className="-mt-3 text-sm text-muted-foreground">
        Keep tabs on lead quality, open opportunities, and conversion rates
        across the current sales cycle.
      </p>
      <PipelineMetrics />
      <div className="grid gap-4 lg:grid-cols-12">
        <QualifiedLeadFlow />
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-4">
          <UpcomingMeetings />
          <ProposalGoal />
        </div>
      </div>
      <RecentOpportunities />
    </AppBody>
  );
}
