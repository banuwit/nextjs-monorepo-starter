import { ReceiptTextIcon, TruckIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Invoice } from "../types/invoice";
import { InvoicePartyBlock, InvoicePartyLines } from "./invoice-party";

export function InvoiceParties({
  shipTo,
  billTo,
}: Pick<Invoice, "shipTo" | "billTo">) {
  return (
    <Card className="py-0">
      <CardContent className="grid divide-y divide-border p-0 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <InvoicePartyBlock
          className="gap-2 p-3.5"
          icon={<TruckIcon aria-hidden="true" />}
          title="Ship To"
        >
          <InvoicePartyLines
            as="address"
            compact
            name={shipTo.name}
            lines={shipTo.lines}
          />
        </InvoicePartyBlock>
        <InvoicePartyBlock
          className="gap-2 p-3.5"
          icon={<ReceiptTextIcon aria-hidden="true" />}
          title="Bill To"
        >
          <InvoicePartyLines
            as="address"
            compact
            name={billTo.name}
            lines={billTo.lines}
          />
        </InvoicePartyBlock>
      </CardContent>
    </Card>
  );
}
