import { ArrowDownRight, ArrowUpRight, Ellipsis } from "lucide-react";

import { analyticsKpis } from "@/mocks/dashboard-analytic.mock";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AnalyticsKpiStrip() {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
      <div className="grid divide-y *:data-[slot=card]:rounded-none *:data-[slot=card]:ring-0 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-5">
        {analyticsKpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardTitle className="text-sm font-normal">{kpi.title}</CardTitle>
              <CardAction>
                <Ellipsis className="size-4" aria-hidden="true" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-2xl leading-none tracking-tight tabular-nums">
                  {kpi.value}
                </div>
                <Badge
                  className={
                    kpi.trend === "up"
                      ? "bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                      : "bg-destructive/10 text-destructive"
                  }
                >
                  {kpi.trend === "up" ? <ArrowUpRight /> : <ArrowDownRight />}
                  {kpi.change}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  from <span className="text-foreground">{kpi.previous}</span>
                </span>
                <span aria-hidden="true">•</span>
                <span>last 4 weeks</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
