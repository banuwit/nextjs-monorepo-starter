import { CreditCardIcon, PackageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Invoice } from "../types/invoice";
import { InvoicePartyBlock, InvoicePartyLines } from "./invoice-party";
import { calculateInvoice, formatInvoiceCurrency } from "../utils/invoice";

export function InvoiceDetails({ invoice }: { invoice: Invoice }) {
  const { subtotal, total } = calculateInvoice(invoice);
  const rows = [
    { label: "Subtotal", value: subtotal },
    { label: "Shipping", value: invoice.shipping },
    {
      label: `Discount (${invoice.discountCode})`,
      value: -invoice.discount,
      savings: true,
    },
    { label: "Estimated Tax", value: invoice.tax },
  ];

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Order Details</h2>
          <p className="text-sm text-muted-foreground">
            {invoice.items.length}{" "}
            {invoice.items.length === 1 ? "item" : "items"} in this order
          </p>
        </div>
        <ItemGroup className="gap-3">
          {invoice.items.map((item) => (
            <Item key={item.id} role="listitem" className="flex-nowrap p-0">
              <ItemMedia
                variant="image"
                className="size-12 rounded-lg bg-muted"
              >
                <PackageIcon
                  aria-hidden="true"
                  className="size-5 text-muted-foreground"
                />
              </ItemMedia>
              <ItemContent className="min-w-0 gap-0.5">
                <ItemTitle>{item.name}</ItemTitle>
                <ItemDescription className="text-xs">
                  {item.variant} · Qty {item.quantity}
                </ItemDescription>
              </ItemContent>
              <ItemContent className="items-end gap-0.5 tabular-nums">
                <span className="text-sm font-medium">
                  {formatInvoiceCurrency(item.quantity * item.unitPrice)}
                </span>
                {item.quantity > 1 && (
                  <span className="text-xs text-muted-foreground">
                    {formatInvoiceCurrency(item.unitPrice)} each
                  </span>
                )}
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
        <Separator />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <InvoicePartyBlock
            icon={<CreditCardIcon aria-hidden="true" />}
            title="Payment"
          >
            <InvoicePartyLines
              name={invoice.payment.method}
              lines={[
                `Expires ${invoice.payment.expires}`,
                `Charged ${invoice.payment.chargedAt}`,
              ]}
            />
          </InvoicePartyBlock>
          <dl className="flex w-full flex-col gap-2 text-sm tabular-nums sm:max-w-72">
            {rows.map(({ label, value, savings }) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{label}</dt>
                <dd
                  className={cn(
                    "font-medium",
                    savings && "text-emerald-700 dark:text-emerald-400",
                  )}
                >
                  {formatInvoiceCurrency(value)}
                </dd>
              </div>
            ))}
            <Separator className="my-1" />
            <div className="flex justify-between gap-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{formatInvoiceCurrency(total)}</dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
