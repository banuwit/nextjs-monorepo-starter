import { ArrowRightIcon, RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Invoice } from "../types/invoice";
import { InvoiceEyebrow } from "./invoice-eyebrow";
import { InvoicePartyBlock } from "./invoice-party";

export function InvoiceTimeline({
  steps,
  shipment,
}: Pick<Invoice, "steps" | "shipment">) {
  const currentStep = steps.find((step) => step.status === "current");

  return (
    <div className="flex flex-col gap-6">
      <InvoicePartyBlock
        className="gap-5"
        icon={<RouteIcon aria-hidden="true" />}
        title="Shipment Status"
      >
        <p className="-mt-2 text-sm text-muted-foreground">
          Latest update: {currentStep?.title}.
        </p>
        <ol aria-label="Shipment progress" className="flex flex-col">
          {steps.map((step, index) => {
            const upcoming = step.status === "upcoming";
            const next = steps[index + 1];
            return (
              <li
                key={step.id}
                aria-current={step.status === "current" ? "step" : undefined}
                className="relative flex gap-4 pb-5 last:pb-0"
              >
                {next && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-5 bottom-0.5 left-2 w-0.5 -translate-x-1/2 rounded-full",
                      next.status === "upcoming" ? "bg-border" : "bg-primary",
                    )}
                  />
                )}
                <span
                  aria-hidden="true"
                  className="flex h-5 w-4 shrink-0 items-center justify-center"
                >
                  <span
                    className={cn(
                      "rounded-full",
                      upcoming
                        ? "size-2 border-2 border-border bg-card"
                        : "size-2.5 bg-primary",
                      step.status === "current" && "ring-3 ring-primary/20",
                    )}
                  />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      upcoming && "font-normal text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {step.date}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
        <section className="flex flex-col gap-2.5 rounded-xl border border-dashed border-border p-4">
          <InvoiceEyebrow>Next Step</InvoiceEyebrow>
          <p className="font-mono text-xs wrap-anywhere text-muted-foreground">
            Tracking {shipment.trackingNumber}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            nativeButton={false}
            render={
              <a
                href={shipment.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            aria-label={`Track shipment ${shipment.trackingNumber} (opens in a new tab)`}
          >
            Track Shipment
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </section>
      </InvoicePartyBlock>
    </div>
  );
}
