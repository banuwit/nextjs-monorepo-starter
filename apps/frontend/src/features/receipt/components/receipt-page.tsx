import { ArrowUpRightIcon, ShoppingBagIcon } from "lucide-react";
import { AppBody } from "@/components/app-body";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { receipt } from "@/mocks/receipt.mock";
import {
  calculateReceipt,
  formatReceiptCurrency,
  receiptEmailHref,
} from "../utils/receipt";
import { ReceiptActions } from "./receipt-actions";

function ReceiptRule() {
  return (
    <Separator className="border-t border-dashed border-border bg-transparent" />
  );
}

export function ReceiptPage() {
  const { subtotal, total } = calculateReceipt(receipt);

  return (
    <AppBody>
      <section
        aria-labelledby="receipt-heading"
        className="mx-auto w-full max-w-md py-4 sm:px-4 md:py-8"
        data-receipt-page
      >
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1
            id="receipt-heading"
            className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase"
          >
            Receipt
          </h1>
          <ReceiptActions
            id={receipt.id}
            emailHref={receiptEmailHref(receipt)}
          />
        </header>
        <Card
          data-receipt-paper
          className="gap-3 py-6 [--card-spacing:--spacing(6)]"
        >
          <CardHeader className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBagIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-sm font-bold tracking-[0.22em] uppercase">
                Order Receipt
              </h2>
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {receipt.shop.name} · {receipt.shop.website}
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 tabular-nums">
            <ReceiptRule />
            <dl className="flex flex-col gap-1.5 text-xs">
              {[
                ["Receipt #", receipt.id],
                ["Order #", receipt.orderId],
                ["Date", receipt.date],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <dt className="shrink-0 text-muted-foreground">{label}</dt>
                  <dd className="min-w-0 text-right wrap-anywhere">{value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Customer</dt>
                <dd className="min-w-0 text-right wrap-anywhere">
                  <a
                    href={`mailto:${receipt.customerEmail}`}
                    className="underline-offset-4 hover:text-primary-text hover:underline"
                  >
                    {receipt.customerEmail}
                  </a>
                </dd>
              </div>
            </dl>
            <ReceiptRule />
            <ul aria-label="Ordered items" className="flex flex-col gap-3.5">
              {receipt.items.map((item) => (
                <li key={item.id} className="flex flex-col gap-0.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="min-w-0 text-sm font-semibold">
                      {item.name}
                    </h3>
                    <span className="shrink-0 text-sm font-semibold">
                      {formatReceiptCurrency(item.quantity * item.unitPrice)}
                    </span>
                  </div>
                  <p className="text-xs leading-snug text-muted-foreground">
                    {item.variant} · {item.quantity} ×{" "}
                    {formatReceiptCurrency(item.unitPrice)}
                  </p>
                </li>
              ))}
            </ul>
            <ReceiptRule />
            <dl className="flex flex-col gap-1.5 text-xs">
              {(
                [
                  ["Subtotal", subtotal],
                  ["Shipping", receipt.shipping],
                  [`Discount (${receipt.discountCode})`, -receipt.discount],
                  ["Tax", receipt.tax],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="shrink-0 font-medium">
                    {formatReceiptCurrency(value)}
                  </dd>
                </div>
              ))}
            </dl>
            <dl className="flex items-baseline justify-between gap-3 border-y-[3px] border-double border-foreground py-3">
              <dt className="text-base font-bold tracking-[0.18em] uppercase">
                Total
              </dt>
              <dd className="text-lg font-bold">
                {formatReceiptCurrency(total)}
              </dd>
            </dl>
            <section
              aria-labelledby="receipt-payment"
              className="flex flex-col gap-2"
            >
              <h3
                id="receipt-payment"
                className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase"
              >
                Payment
              </h3>
              <div className="flex flex-col gap-0.5 text-xs leading-snug">
                <p>{receipt.payment.method}</p>
                <p className="text-muted-foreground">
                  Charged {receipt.payment.chargedAt}
                </p>
              </div>
            </section>
            <ReceiptRule />
            <section
              aria-labelledby="receipt-shipping"
              className="flex flex-col gap-2"
            >
              <h3
                id="receipt-shipping"
                className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase"
              >
                Ship To
              </h3>
              <address className="text-xs leading-snug not-italic">
                <p>{receipt.shipTo.name}</p>
                {receipt.shipTo.lines.map((line) => (
                  <p key={line} className="text-muted-foreground">
                    {line}
                  </p>
                ))}
              </address>
            </section>
            <ReceiptRule />
            <section
              aria-labelledby="receipt-tracking"
              className="flex flex-col gap-2"
            >
              <h3
                id="receipt-tracking"
                className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase"
              >
                Tracking
              </h3>
              <div className="flex flex-col gap-0.5 text-xs leading-snug">
                <p className="wrap-anywhere">
                  {receipt.shipment.trackingNumber}
                </p>
                <p className="text-muted-foreground">
                  {receipt.shipment.carrier} · Arrives{" "}
                  {receipt.shipment.arrival}
                </p>
                <a
                  href={`https://www.ups.com/track?tracknum=${encodeURIComponent(receipt.shipment.trackingNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-1 font-semibold underline-offset-4 hover:text-primary-text hover:underline"
                  aria-label={`Track order ${receipt.orderId} (opens in a new tab)`}
                >
                  Track Shipment{" "}
                  <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
                </a>
              </div>
            </section>
            <ReceiptRule />
            <footer className="flex flex-col items-center gap-2 pt-1 text-center">
              <p className="text-sm font-medium">
                Thank you for shopping with {receipt.shop.name}.
              </p>
              <a
                href={`mailto:${receipt.shop.supportEmail}`}
                className="text-xs tracking-wide text-muted-foreground underline-offset-4 hover:text-primary-text hover:underline"
              >
                {receipt.shop.supportEmail}
              </a>
            </footer>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo receipt · Sample order and shipment details.
        </p>
      </section>
    </AppBody>
  );
}
