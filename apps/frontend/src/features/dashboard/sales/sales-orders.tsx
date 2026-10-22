"use client";

import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { salesOrders, type SalesOrder } from "@/mocks/dashboard-sales.mock";
import {
  filterSalesOrders,
  orderFilters,
  type SalesChannel,
  type SalesOrderFilter,
  type SalesPeriod,
} from "./sales-model";

type OrderRow = SalesOrder & { date: string };
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const dateTime = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const PAGE_SIZE = 10;

function downloadOrders(orders: OrderRow[]) {
  const fields = [
    "id",
    "customer",
    "payment",
    "fulfillment",
    "total",
    "date",
  ] as const;
  const csv = [
    fields.join(","),
    ...orders.map((order) =>
      fields
        .map((field) => `"${String(order[field]).replaceAll('"', '""')}"`)
        .join(","),
    ),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "sales-orders.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function SalesOrders({
  today,
  period,
  channel,
}: {
  today: string;
  period: SalesPeriod;
  channel: SalesChannel;
}) {
  const [filter, setFilter] = useState<SalesOrderFilter>("All");
  const [page, setPage] = useState(0);
  const rows = useMemo(() => {
    const todayDate = new Date(today);
    return filterSalesOrders(
      salesOrders,
      period,
      channel,
      filter,
      todayDate,
    ).map((order) => ({
      ...order,
      date: new Date(
        Date.UTC(
          todayDate.getUTCFullYear(),
          todayDate.getUTCMonth(),
          todayDate.getUTCDate(),
        ) -
          order.daysAgo * 86_400_000,
      ).toISOString(),
    }));
  }, [today, period, channel, filter]);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleRows = rows.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );
  return (
    <Card id="sales-orders" className="min-w-0">
      <CardHeader>
        <CardTitle className="text-sm font-normal text-muted-foreground">
          Recent Orders
        </CardTitle>
        <CardDescription className="text-xl leading-none tracking-tight text-foreground">
          {rows.length} orders
        </CardDescription>
        <CardAction>
          <Button
            aria-label="Download orders as CSV"
            size="icon-sm"
            variant="outline"
            disabled={!rows.length}
            onClick={() => downloadOrders(rows)}
          >
            <DownloadIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-col gap-4">
        <div className="max-w-full overflow-x-auto">
          <ToggleGroup
            aria-label="Filter orders"
            variant="outline"
            size="sm"
            spacing={0}
            value={[filter]}
            onValueChange={(values) => {
              if (values[0]) {
                setFilter(values[0] as SalesOrderFilter);
                setPage(0);
              }
            }}
          >
            {orderFilters.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">#{order.id}</span>
                    <span className="text-xs text-muted-foreground">
                      {order.items} {order.items === 1 ? "item" : "items"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant={
                        order.payment === "Refunded" ? "destructive" : "outline"
                      }
                    >
                      {order.payment}
                    </Badge>
                    <Badge variant="secondary">{order.fulfillment}</Badge>
                  </div>
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {money.format(order.total)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {dateTime.format(new Date(order.date))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted-foreground">
            Viewing {visibleRows.length} out of {rows.length} orders
          </p>
          <div className="flex items-center gap-2">
            <span>
              {currentPage + 1} / {pageCount}
            </span>
            <Button
              aria-label="Previous page"
              size="icon-sm"
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              aria-label="Next page"
              size="icon-sm"
              variant="outline"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
