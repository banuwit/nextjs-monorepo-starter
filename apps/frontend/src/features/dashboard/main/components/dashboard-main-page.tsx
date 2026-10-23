import {
  DollarSignIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UserPlusIcon,
  UsersIcon,
  WavesIcon,
} from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardMainMetrics } from "@/mocks/dashboard-main.mock";

import { CustomerActivity } from "./customer-activity";
import { RecentCustomers } from "./recent-customers";

const metricIcons = [DollarSignIcon, UserPlusIcon, UsersIcon, WavesIcon];

export function MainDashboardPage() {
  return (
    <AppBody>
      <PageHeading title="Dashboard" currentPage="Main">
        <Input
          type="date"
          aria-label="Filter dashboard by date"
          className="w-auto"
        />
      </PageHeading>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMainMetrics.map((metric, index) => {
          const Icon = metricIcons[index];
          return (
            <Card
              key={metric.label}
              className="bg-linear-to-t from-primary/5 to-card shadow-xs"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="grid size-7 place-items-center rounded-lg border bg-muted">
                    {Icon && <Icon className="size-4" />}
                  </span>
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-3xl font-medium tabular-nums tracking-tight">
                    {metric.value}
                  </span>
                  <Badge
                    variant={"negative" in metric ? "destructive" : "default"}
                  >
                    {"negative" in metric ? (
                      <TrendingDownIcon />
                    ) : (
                      <TrendingUpIcon />
                    )}
                    {metric.change}
                  </Badge>
                </div>
                <CardDescription>{metric.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CustomerActivity />
      <RecentCustomers />
    </AppBody>
  );
}
