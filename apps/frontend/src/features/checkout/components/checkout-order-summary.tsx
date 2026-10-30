"use client";

import { useState, type FormEvent } from "react";
import { LockIcon, PackageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { CheckoutItem, CheckoutPromo } from "../types/checkout";
import { formatCheckoutCurrency } from "../utils/checkout";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

type CheckoutOrderSummaryProps = {
  items: CheckoutItem[];
  addressLabel?: string;
  promo: CheckoutPromo | null;
  defaultPromoCode: string;
  shippingPrice: number;
  totals: { subtotal: number; discount: number; tax: number; total: number };
  readOnly: boolean;
  onApplyPromo: (code: string) => boolean;
  onRemoveItem: (id: string) => void;
};

export function CheckoutOrderSummary({
  items,
  addressLabel,
  promo,
  defaultPromoCode,
  shippingPrice,
  totals,
  readOnly,
  onApplyPromo,
  onRemoveItem,
}: CheckoutOrderSummaryProps) {
  const [code, setCode] = useState(defaultPromoCode);
  const [error, setError] = useState("");

  const submitPromo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(onApplyPromo(code) ? "" : "This promo code is not valid.");
  };

  return (
    <Card className="@4xl/main:sticky @4xl/main:top-16">
      <CardHeader>
        <h2 className="text-lg font-semibold tracking-tight">Order Summary</h2>
        <CardDescription>
          {items.length} {items.length === 1 ? "item" : "items"} shipping to{" "}
          {addressLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ul
          tabIndex={0}
          aria-label="Items in your order"
          className="-mx-1 flex flex-col gap-4 overflow-y-auto px-1 py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 @4xl/main:max-h-72"
        >
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                <PackageIcon
                  aria-hidden="true"
                  className="size-5 text-muted-foreground"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col text-sm">
                <span className="truncate font-medium">{item.name}</span>
                <span className="truncate text-muted-foreground">
                  {item.variant} • Qty {item.quantity}
                </span>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    className="h-6 self-start p-0 text-muted-foreground"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                )}
              </span>
              <span className="flex flex-col items-end gap-0.5 text-sm tabular-nums">
                <span>
                  {formatCheckoutCurrency(item.quantity * item.unitPrice)}
                </span>
                {item.compareAtPrice && (
                  <s className="text-xs text-muted-foreground">
                    {formatCheckoutCurrency(
                      item.quantity * item.compareAtPrice,
                    )}
                  </s>
                )}
              </span>
            </li>
          ))}
        </ul>
        <Separator />
        <form onSubmit={submitPromo} noValidate>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="checkout-promo">Promo Code</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="checkout-promo"
                className="bg-card"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                disabled={readOnly}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setError("");
                }}
              />
              <Button type="submit" variant="outline" disabled={readOnly}>
                Apply
              </Button>
            </div>
            {error ? (
              <FieldError>{error}</FieldError>
            ) : (
              promo && (
                <p className="text-sm text-muted-foreground">
                  <strong className="font-semibold">{promo.code}</strong>{" "}
                  applied for {formatCheckoutCurrency(totals.discount)} off.
                </p>
              )
            )}
          </Field>
        </form>
        <Separator />
        <dl className="flex flex-col gap-2.5">
          <SummaryRow
            label="Subtotal"
            value={formatCheckoutCurrency(totals.subtotal)}
          />
          <SummaryRow
            label="Delivery"
            value={
              shippingPrice === 0
                ? "Free"
                : formatCheckoutCurrency(shippingPrice)
            }
          />
          <SummaryRow
            label="Estimated Tax"
            value={formatCheckoutCurrency(totals.tax)}
          />
          {totals.discount > 0 && (
            <div className="flex justify-between gap-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <dt>Discount</dt>
              <dd className="tabular-nums">
                -{formatCheckoutCurrency(totals.discount)}
              </dd>
            </div>
          )}
        </dl>
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-semibold">Total</p>
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {formatCheckoutCurrency(totals.total)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Delivery, promo, and tax included.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
            Charged after review
            <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              {readOnly ? "Order placed" : "Ready to place"}
            </Badge>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <LockIcon aria-hidden="true" className="size-3.5 shrink-0" />
          Demo checkout. No payment is processed.
        </p>
      </CardContent>
    </Card>
  );
}
