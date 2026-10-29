"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/features/dashboard/components/status-badge";
import { downloadCsv } from "@/features/dashboard/utils/csv";
import { formatShortDate, initials, usdWhole } from "@/features/dashboard/utils/format";
import type { DashboardCustomer } from "@/mocks/dashboard-main.mock";

import { customersCsvHeader, customersCsvRows } from "../utils/customers";
import { accountStyles, billingStyles } from "./customer-status";

const columns: ColumnDef<DataGridFeatures, DashboardCustomer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Customer" />,
    cell: ({ row }) => (
      <div className="flex min-w-48 items-center gap-2.5">
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
        >
          {initials(row.original.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "plan",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Plan" />,
  },
  {
    accessorKey: "mrr",
    header: ({ column }) => <DataGridHeaderSort column={column} title="MRR" />,
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.mrr ? usdWhole.format(row.original.mrr) : "Free trial"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <DataGridHeader title="Account" />,
    cell: ({ row }) => {
      const { status } = row.original;
      const Icon = accountStyles[status].icon;
      return (
        <span
          className={
            status === "Subscribed"
              ? "inline-flex items-center gap-1.5"
              : "inline-flex items-center gap-1.5 text-muted-foreground"
          }
        >
          <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "billing",
    header: () => <DataGridHeader title="Billing" />,
    cell: ({ row }) => {
      const style = billingStyles[row.original.billing];
      return (
        <StatusBadge tone={style.tone} icon={style.icon}>
          {row.original.billing}
        </StatusBadge>
      );
    },
  },
  {
    accessorKey: "joined",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Joined" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground tabular-nums">
        {formatShortDate(row.original.joined)}
      </span>
    ),
  },
];

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ label: value, value }));

export function RecentCustomers({
  customers,
}: {
  customers: DashboardCustomer[];
}) {
  return (
    <Card id="customers" className="min-w-0">
      <CardHeader>
        <CardTitle>Recent customers</CardTitle>
        <CardDescription>
          Latest {customers.length} sign-ups with their plan and billing state
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <DataGridClient
          columns={columns}
          data={customers}
          getRowId={(row) => row.id}
          defaultSorting={[{ id: "joined", desc: true }]}
          pagination="simple"
          defaultPageSize={8}
          toolbar={{
            searches: [{ key: "name", placeholder: "Search customers..." }],
            facets: [
              {
                key: "billing",
                title: "Billing",
                options: toOptions(["Paid", "Pending", "Overdue", "Trial"]),
              },
              {
                key: "plan",
                title: "Plan",
                options: toOptions(["Enterprise", "Growth", "Pro", "Starter"]),
              },
              {
                key: "status",
                title: "Account",
                options: toOptions(["Subscribed", "Inactive", "Unsubscribed"]),
              },
            ],
          }}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadCsv("customers.csv", customersCsvHeader, customersCsvRows(customers))
              }
            >
              <DownloadIcon data-icon="inline-start" />
              Export
            </Button>
          }
          emptyFilteredTitle="No customers match these filters"
          emptyFilteredDescription="Clear a filter or search for another name."
        />
      </CardContent>
    </Card>
  );
}
