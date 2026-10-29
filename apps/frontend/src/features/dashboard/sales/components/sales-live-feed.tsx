import { CircleCheckIcon, HourglassIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { usd } from "../utils/format";
import { cn } from "@/lib/utils";

import type { SalesFeedOrder } from "../types/sales";
import { minutesAgoLabel } from "../utils/sales";

export function SalesLiveFeed({
  orders,
  clock,
  latestId,
}: {
  orders: SalesFeedOrder[];
  clock: number;
  latestId: string | null;
}) {
  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Incoming orders</CardTitle>
        <CardDescription>Newest first</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col divide-y" aria-live="off">
          {orders.map((order) => (
            <li
              key={order.id}
              className={cn(
                "-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-1000 motion-reduce:transition-none",
                order.id === latestId && "bg-primary/5",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-2 text-sm">
                  <span className="truncate font-medium">{order.customer}</span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">#{order.id}</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {order.items} × {order.product}, {order.channel}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-medium tabular-nums">{usd.format(order.total)}</span>
                <span className="flex items-center gap-1.5">
                  {order.payment === "Pending" ? (
                    <StatusBadge tone="warning" icon={HourglassIcon}>Unpaid</StatusBadge>
                  ) : (
                    <StatusBadge tone="success" icon={CircleCheckIcon}>Paid</StatusBadge>
                  )}
                </span>
              </div>
              <time
                dateTime={new Date(order.at).toISOString()}
                className="w-16 shrink-0 text-right text-xs text-muted-foreground"
              >
                {minutesAgoLabel(order.at, clock)}
              </time>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
