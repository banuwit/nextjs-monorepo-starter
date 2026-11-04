"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCustomerProfile } from "../hooks/use-customer-locations";
import type { SalesSummary } from "../types/map-location";
import {
  averageNominal,
  formatCount,
  formatDate,
  formatNominal,
} from "../utils/map-location";

type CustomerProfilePanelProps = {
  customerId: string;
  onClose: () => void;
};

/** Profile card docked beside the map; the page shows it while a customer is selected. */
export function CustomerProfilePanel({ customerId, onClose }: CustomerProfilePanelProps) {
  return (
    <aside
      aria-label="Customer profile"
      className="flex min-h-0 flex-col border-t border-border bg-card lg:w-[24rem] lg:shrink-0 lg:border-t-0 lg:border-l"
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <h2 className="flex-1 text-sm font-semibold">Profile Customer</h2>
        <Button variant="ghost" size="icon-sm" aria-label="Close profile" onClick={onClose}>
          <XIcon />
        </Button>
      </div>
      {/* Keyed so switching customers remounts (and refetches) everything. */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <ProfileBody key={customerId} customerId={customerId} />
      </div>
    </aside>
  );
}

function ProfileBody({ customerId }: { customerId: string }) {
  const { data: customer, isLoading, isError } = useCustomerProfile(customerId);

  return (
    <div className="flex flex-col gap-3">
      <Card size="sm">
        <CardHeader>
          <CardTitle>
            {isLoading ? <Skeleton className="h-5 w-48" /> : (customer?.name ?? "-")}
          </CardTitle>
          <CardDescription className="text-xs">Customer Name</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category" value={customer?.category.name} loading={isLoading} />
            <Field label="City" value={customer?.city.name} loading={isLoading} />
            <Field label="District" value={customer?.district.name} loading={isLoading} />
            <Field label="Street" value={customer?.street.name} loading={isLoading} />
            <Field label="Branch" value={customer?.branch.name} loading={isLoading} />
            <Field label="Salesman" value={customer?.employee.name} loading={isLoading} />
          </div>
          {!isLoading && isError && (
            <p className="text-sm text-destructive">Failed to load profile</p>
          )}
        </CardContent>
      </Card>
      <SalesCard invoice={customer?.salesInvoice} returns={customer?.salesReturn} loading={isLoading} />
    </div>
  );
}

function Field({ label, value, loading }: { label: string; value?: string; loading: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {loading ? <Skeleton className="h-5 w-24" /> : <span className="truncate text-sm font-medium" title={value}>{value || "-"}</span>}
    </div>
  );
}

/** Invoice and return side by side in one table, so the panel stays short. */
function SalesCard({
  invoice,
  returns,
  loading,
}: {
  invoice?: SalesSummary;
  returns?: SalesSummary;
  loading: boolean;
}) {
  const rows: { label: string; value: (sales?: SalesSummary) => string; average?: boolean }[] = [
    { label: "Total Invoice", value: (sales) => formatCount(sales?.totalInvoice) },
    { label: "Value", value: (sales) => formatNominal(sales?.salesAmount) },
    { label: "Avg. Value", value: (sales) => averageNominal(sales?.salesAmount, sales?.totalInvoice), average: true },
    { label: "Quantity", value: (sales) => formatNominal(sales?.quantityCtn) },
    { label: "Avg. Quantity", value: (sales) => averageNominal(sales?.quantityCtn, sales?.totalInvoice), average: true },
    { label: "Volume", value: (sales) => formatNominal(sales?.quantityKg) },
    { label: "Avg. Volume", value: (sales) => averageNominal(sales?.quantityKg, sales?.totalInvoice), average: true },
    { label: "Last Date", value: (sales) => formatDate(sales?.lastDateInvoice) },
  ];
  const cell = (sales?: SalesSummary, row?: (typeof rows)[number]) =>
    loading ? <Skeleton className="ml-auto h-4 w-16" /> : row!.value(sales);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="bg-muted/40 px-2.5 py-1.5 text-left font-medium text-muted-foreground">Metric</th>
                <th className="border-l border-border bg-emerald-500/10 px-2.5 py-1.5 text-right font-semibold text-emerald-700 dark:text-emerald-300">Invoice</th>
                <th className="border-l border-border bg-red-500/10 px-2.5 py-1.5 text-right font-semibold text-red-700 dark:text-red-300">Return</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-b-0">
                  <td className={cn("bg-muted/40 px-2.5 py-1.5 font-medium", row.average && "pl-4 font-normal text-muted-foreground")}>
                    {row.label}
                  </td>
                  <td className="border-l border-border px-2.5 py-1.5 text-right font-medium text-emerald-700 tabular-nums dark:text-emerald-300">
                    {cell(invoice, row)}
                  </td>
                  <td className="border-l border-border px-2.5 py-1.5 text-right font-medium text-red-700 tabular-nums dark:text-red-300">
                    {cell(returns, row)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
