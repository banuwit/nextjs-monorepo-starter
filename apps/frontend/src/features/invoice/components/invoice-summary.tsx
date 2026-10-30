import { CircleCheckIcon } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Invoice } from "../types/invoice";
import { calculateInvoice, formatInvoiceCurrency } from "../utils/invoice";
import { InvoiceEyebrow } from "./invoice-eyebrow";

export function InvoiceSummary({ invoice }: { invoice: Invoice }) {
  const { total } = calculateInvoice(invoice);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-3 border-b">
        <AppLogo className="w-14" />
        <span className="sr-only">{invoice.shop.name}</span>
        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          <CircleCheckIcon data-icon="inline-start" />
          Paid
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-xs text-muted-foreground">
            Placed {invoice.placedAt}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight wrap-anywhere">
            Order {invoice.orderId}
          </h2>
          <p className="text-sm text-muted-foreground">
            A receipt was sent to{" "}
            <a
              href={`mailto:${invoice.customerEmail}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {invoice.customerEmail}
            </a>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-0.5 sm:items-end">
          <InvoiceEyebrow>Total Paid</InvoiceEyebrow>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatInvoiceCurrency(total)}
          </p>
          <p className="text-xs text-muted-foreground">
            {invoice.payment.method}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
