import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { invoiceTaxOptions } from "../utils/invoice";
import type { Invoice, InvoiceClient } from "../types/invoice";
import { ClientSelector } from "./client-selector";
import { InvoiceDetails } from "./invoice-details";
import { InvoiceItems } from "./invoice-items";

const taxChoices = invoiceTaxOptions.map((tax) => ({
  value: tax.id,
  label: `${tax.name} (${tax.rate}%)`,
}));
const discountChoices = [
  { value: "fixed", label: "Fixed amount" },
  { value: "percent", label: "Percent" },
];

export function InvoiceForm({
  invoice,
  clients,
  onChange,
  onAddClient,
}: {
  invoice: Invoice;
  clients: InvoiceClient[];
  onChange: (patch: Partial<Invoice>) => void;
  onAddClient: (client: InvoiceClient) => void;
}) {
  const updateBusiness = (patch: Partial<Invoice["from"]>) =>
    onChange({ from: { ...invoice.from, ...patch } });
  return (
    <Tabs
      defaultValue="invoice"
      className="min-w-0 gap-4 rounded-xl border bg-card p-4 [&_[data-slot=field-label]]:text-xs"
    >
      <TabsList className="w-full" aria-label="Invoice settings">
        <TabsTrigger value="invoice">Invoice</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="business">Business</TabsTrigger>
      </TabsList>
      <TabsContent value="invoice" className="flex flex-col gap-4">
        <InvoiceDetails invoice={invoice} onChange={onChange} />
        <Separator />
        <ClientSelector
          value={invoice.to}
          clients={clients}
          onSelect={(to) => onChange({ to })}
          onAdd={onAddClient}
        />
        <Separator />
        <InvoiceItems
          items={invoice.items}
          onChange={(items) => onChange({ items })}
        />
        <Separator />
        <section className="flex flex-col gap-4">
          <h2 className="font-medium tracking-tight">Adjustments</h2>
          <FieldGroup className="grid gap-4 @min-[500px]/editor:grid-cols-2">
            <Field className="gap-1">
              <FieldLabel htmlFor="invoice-tax">Tax</FieldLabel>
              <Select
                items={taxChoices}
                value={invoice.taxId}
                onValueChange={(taxId) => {
                  if (taxId) onChange({ taxId });
                }}
              >
                <SelectTrigger id="invoice-tax" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    {taxChoices.map((tax) => (
                      <SelectItem key={tax.value} value={tax.value}>
                        {tax.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <FieldGroup className="grid grid-cols-[minmax(0,1fr)_90px] gap-3">
              <Field className="gap-1">
                <FieldLabel htmlFor="invoice-discount">Discount</FieldLabel>
                <Select
                  items={discountChoices}
                  value={invoice.discountType}
                  onValueChange={(discountType) => {
                    if (discountType === "fixed" || discountType === "percent")
                      onChange({ discountType });
                  }}
                >
                  <SelectTrigger id="invoice-discount" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <SelectGroup>
                      {discountChoices.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field className="gap-1">
                <FieldLabel htmlFor="discount-value">Value</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="discount-value"
                    aria-label="Discount value"
                    type="number"
                    min="0"
                    max={invoice.discountType === "percent" ? 100 : 1_000_000}
                    step="0.01"
                    value={invoice.discountValue}
                    onChange={(event) =>
                      onChange({
                        discountValue: Math.min(
                          1_000_000,
                          Math.max(0, Number(event.target.value)),
                        ),
                      })
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    {invoice.discountType === "fixed" ? "$" : "%"}
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </section>
      </TabsContent>
      <TabsContent value="payment" className="flex flex-col gap-5">
        <h2 className="font-medium">Payment Details</h2>
        <FieldGroup className="gap-4">
          <BusinessInput
            label="Payment account"
            field="paymentAccountName"
            value={invoice.from}
            onChange={updateBusiness}
          />
          <BusinessInput
            label="Routing number"
            field="routingNumber"
            value={invoice.from}
            onChange={updateBusiness}
          />
        </FieldGroup>
        <p className="text-sm text-muted-foreground">
          These details appear on your invoice. All amounts are in USD.
        </p>
      </TabsContent>
      <TabsContent value="business" className="flex flex-col gap-5">
        <h2 className="font-medium">Business Details</h2>
        <FieldGroup className="gap-4">
          <BusinessInput
            label="Business name"
            field="name"
            value={invoice.from}
            onChange={updateBusiness}
          />
          <BusinessInput
            label="Business email"
            field="email"
            value={invoice.from}
            onChange={updateBusiness}
          />
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <BusinessInput
              label="Phone"
              field="phone"
              value={invoice.from}
              onChange={updateBusiness}
            />
            <BusinessInput
              label="Website"
              field="website"
              value={invoice.from}
              onChange={updateBusiness}
            />
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="business-address">Business address</FieldLabel>
            <Textarea
              id="business-address"
              maxLength={1500}
              value={invoice.from.addressLines.join("\n")}
              onChange={(event) =>
                updateBusiness({
                  addressLines: event.target.value.split("\n").slice(0, 5),
                })
              }
            />
          </Field>
          <BusinessInput
            label="Business tax ID"
            field="taxId"
            value={invoice.from}
            onChange={updateBusiness}
          />
          <BusinessInput
            label="Issued by"
            field="issuerName"
            value={invoice.from}
            onChange={updateBusiness}
          />
        </FieldGroup>
      </TabsContent>
    </Tabs>
  );
}

function BusinessInput({
  label,
  field,
  value,
  onChange,
}: {
  label: string;
  field: Exclude<keyof Invoice["from"], "addressLines">;
  value: Invoice["from"];
  onChange: (patch: Partial<Invoice["from"]>) => void;
}) {
  return (
    <Field className="gap-1">
      <FieldLabel htmlFor={`business-${field}`}>{label}</FieldLabel>
      <Input
        id={`business-${field}`}
        maxLength={300}
        type={field === "email" ? "email" : "text"}
        value={value[field]}
        onChange={(event) => onChange({ [field]: event.target.value })}
      />
    </Field>
  );
}
