"use client";

import type { ReactNode } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChartCardProps = {
  title: string;
  description?: string;
  /** Headline value shown under the title, e.g. "$45.2K". */
  value?: ReactNode;
  /** Percent change for the trend badge next to `value`. */
  change?: number;
  /** Controls in the top-right corner, e.g. `ChartPeriodTabs`. */
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * Card wrapper for every chart: title, optional headline value with trend,
 * header action, chart body, and footer. Reuse it on any page that shows a
 * chart so the layout stays consistent.
 */
export function ChartCard({
  title,
  description,
  value,
  change,
  action,
  footer,
  className,
  children,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
        {value !== undefined && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {value}
            </span>
            {change !== undefined && <TrendBadge change={change} />}
          </div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="text-sm text-muted-foreground">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export function TrendBadge({ change }: { change: number }) {
  const positive = change >= 0;
  const Icon = positive ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Badge
      variant={positive ? "secondary" : "destructive"}
      className={cn(
        positive && "text-emerald-700 dark:text-emerald-400",
        "tabular-nums",
      )}
    >
      <Icon data-icon="inline-start" aria-hidden="true" />
      {positive ? "+" : ""}
      {change.toFixed(1)}%
    </Badge>
  );
}

type ChartPeriodTabsProps<T extends string> = {
  value: T;
  options: readonly { value: T; label: string }[];
  onValueChange: (value: T) => void;
  label?: string;
};

/** Compact tabs for switching a chart's period or metric. */
export function ChartPeriodTabs<T extends string>({
  value,
  options,
  onValueChange,
  label = "Period",
}: ChartPeriodTabsProps<T>) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        const option = options.find((item) => item.value === next);
        if (option) onValueChange(option.value);
      }}
    >
      <TabsList aria-label={label}>
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className="px-2.5"
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
