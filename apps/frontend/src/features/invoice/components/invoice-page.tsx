import { LifeBuoyIcon } from "lucide-react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { invoice } from "@/mocks/invoice.mock";
import { invoiceEmailHref } from "../utils/invoice";
import { InvoiceActions } from "./invoice-actions";
import { InvoiceDetails } from "./invoice-details";
import { InvoiceParties } from "./invoice-parties";
import { InvoiceSummary } from "./invoice-summary";
import { InvoiceTimeline } from "./invoice-timeline";

export function InvoicePage() {
  return (
    <AppBody>
      <div className="mx-auto flex w-full max-w-[68rem] flex-col gap-6">
        <PageHeading
          title="Invoice"
          currentPage="Invoice"
          description="Review payment, items, and shipment progress."
        >
          <InvoiceActions
            id={invoice.id}
            emailHref={invoiceEmailHref(invoice)}
          />
        </PageHeading>
        <div
          data-invoice-paper
          className="grid items-stretch gap-8 @4xl/main:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] print:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
        >
          <div className="flex min-w-0 flex-col gap-5">
            <InvoiceSummary invoice={invoice} />
            <InvoiceParties shipTo={invoice.shipTo} billTo={invoice.billTo} />
            <InvoiceDetails invoice={invoice} />
          </div>
          <aside
            aria-label="Shipment details"
            className="min-w-0 border-t border-border pt-6 @4xl/main:border-t-0 @4xl/main:border-l @4xl/main:pt-0 @4xl/main:pl-7 print:border-t-0 print:border-l print:pt-0 print:pl-7"
          >
            <div className="flex flex-col gap-5 @4xl/main:sticky @4xl/main:top-20">
              <InvoiceTimeline
                steps={invoice.steps}
                shipment={invoice.shipment}
              />
              <a
                href={`mailto:${invoice.shop.supportEmail}`}
                className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-primary-text hover:underline print:hidden"
              >
                <LifeBuoyIcon aria-hidden="true" className="size-3.5" />
                Need help with this order?
              </a>
            </div>
          </aside>
        </div>
      </div>
    </AppBody>
  );
}
