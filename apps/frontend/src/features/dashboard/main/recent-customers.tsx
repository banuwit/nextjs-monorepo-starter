"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  Clock3Icon,
  DownloadIcon,
  LoaderIcon,
  UserRoundIcon,
} from "lucide-react";
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
import {
  dashboardCustomers,
  type DashboardCustomer,
} from "@/mocks/dashboard-main.mock";

const PAGE_SIZE = 10;
const billingIcons = {
  Paid: CircleCheckIcon,
  Pending: LoaderIcon,
  Overdue: CircleAlertIcon,
  Trial: Clock3Icon,
};
function exportCustomers(data: DashboardCustomer[]) {
  const fields = [
    "id",
    "name",
    "email",
    "status",
    "billing",
    "plan",
    "joined",
  ] as const;
  const csv = [
    fields.join(","),
    ...data.map((row) =>
      fields.map((field) => `"${row[field].replaceAll('"', '""')}"`).join(","),
    ),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "customers.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function RecentCustomers() {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(
    1,
    Math.ceil(dashboardCustomers.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount - 1);
  const rows = dashboardCustomers.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );
  return (
    <Card id="customers">
      <CardHeader>
        <CardTitle>18,426 Customers</CardTitle>
        <CardDescription>
          Recent customer records with plan, billing, status, and signup
          activity.
        </CardDescription>
        <CardAction>
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportCustomers(dashboardCustomers)}
          >
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((customer) => {
              const Icon = billingIcons[customer.billing];
              return (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-md border bg-muted text-muted-foreground">
                        <UserRoundIcon className="size-4" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">
                          #{customer.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Icon />
                      {customer.billing}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.plan}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span>
                        {new Date(
                          `${customer.joined}T00:00:00Z`,
                        ).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        at 10:25 AM
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {dashboardCustomers.length} customers
          </span>
          <div className="flex items-center gap-2">
            <span>
              Page {currentPage + 1} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous page"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next page"
              disabled={currentPage === pageCount - 1}
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
