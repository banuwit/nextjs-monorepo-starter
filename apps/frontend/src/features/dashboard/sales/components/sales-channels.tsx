import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendDelta } from "@/features/dashboard/components/trend-delta";
import { usdWhole } from "@/features/dashboard/utils/format";
import { salesChannels } from "@/mocks/dashboard-sales.mock";

export function SalesChannels({ revenue }: { revenue: number }) {
  const max = Math.max(...salesChannels.map((channel) => channel.share));
  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>By channel</CardTitle>
        <CardDescription>Revenue today, share change vs yesterday</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {salesChannels.map((channel) => {
            const change = Math.round((channel.share - channel.yesterdayShare) * 100);
            return (
              <li key={channel.name} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{channel.name}</span>
                  <span className="flex items-baseline gap-2">
                    <span className="font-medium tabular-nums">
                      {usdWhole.format(revenue * channel.share)}
                    </span>
                    <TrendDelta
                      className="w-14 justify-end"
                      delta={{
                        value: `${Math.abs(change)} pts`,
                        direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
                        sentiment: change > 0 ? "good" : change < 0 ? "bad" : "neutral",
                      }}
                    />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-chart-2"
                      style={{ width: `${(channel.share / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
                    {Math.round(channel.share * 100)}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
