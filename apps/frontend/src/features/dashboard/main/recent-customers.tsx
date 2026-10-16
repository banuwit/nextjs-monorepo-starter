"use client";

import { useMemo, useState } from "react";
import { type ColumnDef, useTable } from "@tanstack/react-table";
import {
  ArrowDownUpIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  Clock3Icon,
  DownloadIcon,
  LoaderIcon,
  SearchIcon,
  UserRoundIcon,
} from "lucide-react";

import { type ClientTableFeatures, tableFeaturesClient } from "@/components/data-grid/table-features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardCustomers, type DashboardCustomer } from "@/mocks/dashboard-main.mock";

const statusOptions = ["All statuses", "Subscribed", "Inactive", "Unsubscribed"];
const billingOptions = ["All billing", "Paid", "Pending", "Overdue", "Trial"];
const dateOptions = [
  { value: "all", label: "All time" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];
const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];
const pageSizes = [10, 20, 50].map((size) => ({ value: String(size), label: String(size) }));

const billingIcons = {
  Paid: CircleCheckIcon,
  Pending: LoaderIcon,
  Overdue: CircleAlertIcon,
  Trial: Clock3Icon,
};

const columns: ColumnDef<ClientTableFeatures, DashboardCustomer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all customers on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-md border bg-muted text-muted-foreground"><UserRoundIcon className="size-4" /></span>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">#{row.original.id}</span>
        </div>
      </div>
    ),
  },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge> },
  {
    accessorKey: "billing",
    header: "Billing",
    cell: ({ row }) => {
      const Icon = billingIcons[row.original.billing];
      return <Badge variant="outline"><Icon />{row.original.billing}</Badge>;
    },
  },
  { accessorKey: "plan", header: "Plan" },
  {
    accessorKey: "joined",
    header: "Joined",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span>{new Date(`${row.original.joined}T00:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</span>
        <span className="text-xs text-muted-foreground">at 10:25 AM</span>
      </div>
    ),
  },
];

function exportCustomers(data: DashboardCustomer[]) {
  const fields = ["id", "name", "email", "status", "billing", "plan", "joined"] as const;
  const csv = [fields.join(","), ...data.map((row) => fields.map((field) => `"${row[field].replaceAll('"', '""')}"`).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "customers.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function RecentCustomers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [billing, setBilling] = useState("All billing");
  const [joined, setJoined] = useState("all");
  const [sort, setSort] = useState("newest");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const cutoff = joined === "all" ? 0 : Date.now() - Number(joined) * 86_400_000;
    const filtered = dashboardCustomers.filter((customer) =>
      (status === "All statuses" || customer.status === status) &&
      (billing === "All billing" || customer.billing === billing) &&
      (cutoff === 0 || Date.parse(`${customer.joined}T00:00:00Z`) >= cutoff) &&
      (!query || `${customer.id} ${customer.name} ${customer.email}`.toLowerCase().includes(query))
    );
    return filtered.sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      return sort === "oldest" ? a.joined.localeCompare(b.joined) : b.joined.localeCompare(a.joined);
    });
  }, [search, status, billing, joined, sort]);

  const table = useTable({
    features: tableFeaturesClient,
    data: rows,
    columns,
    state: { rowSelection, pagination },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  });
  const resetPage = () => table.setPageIndex(0);

  return (
    <Card id="customers">
      <CardHeader>
        <CardTitle>18,426 Customers</CardTitle>
        <CardDescription>Recent customer records with plan, billing, status, and signup activity.</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline" onClick={() => exportCustomers(rows)}><DownloadIcon data-icon="inline-start" />Export</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-72">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input aria-label="Search customers" placeholder="Search customers..." className="pl-8" value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} />
            </div>
            <Select value={status} onValueChange={(value) => { setStatus(value ?? "All statuses"); resetPage(); }} items={statusOptions.map((value) => ({ value, label: value }))}>
              <SelectTrigger size="sm" aria-label="Customer status"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{statusOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
            <Select value={joined} onValueChange={(value) => { setJoined(value ?? "all"); resetPage(); }} items={dateOptions}>
              <SelectTrigger size="sm" aria-label="Joined date"><CalendarDaysIcon /> <SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{dateOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select value={billing} onValueChange={(value) => { setBilling(value ?? "All billing"); resetPage(); }} items={billingOptions.map((value) => ({ value, label: value }))}>
              <SelectTrigger size="sm" aria-label="Billing status"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{billingOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
            <Select value={sort} onValueChange={(value) => { setSort(value ?? "newest"); resetPage(); }} items={sortOptions}>
              <SelectTrigger size="sm" aria-label="Sort customers"><ArrowDownUpIcon /><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{sortOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted/20">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>{group.headers.map((header) => <TableHead key={header.id} className="h-11 px-3">{header.isPlaceholder ? null : <table.FlexRender header={header} />}</TableHead>)}</TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => <TableCell key={cell.id} className="px-3 py-3"><table.FlexRender cell={cell} /></TableCell>)}
                </TableRow>
              )) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">No results.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">{table.getFilteredSelectedRowModel().rows.length} of {rows.length} row(s) selected.</span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Rows per page</span>
            <Select value={String(pagination.pageSize)} onValueChange={(value) => table.setPageSize(Number(value ?? "10"))} items={pageSizes}>
              <SelectTrigger size="sm" aria-label="Rows per page"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>{pageSizes.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
            <span className="whitespace-nowrap">Page {pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}</span>
            <Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ChevronLeftIcon /></Button>
            <Button variant="outline" size="icon-sm" aria-label="Next page" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}><ChevronRightIcon /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
