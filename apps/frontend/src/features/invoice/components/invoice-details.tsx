import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon, HashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Invoice } from "../invoice-model";

export function InvoiceDetails({
  invoice,
  onChange,
}: {
  invoice: Invoice;
  onChange: (patch: Partial<Invoice>) => void;
}) {
  return (
    <FieldGroup className="gap-5">
      <Field className="gap-1">
        <FieldLabel htmlFor="reference-number">Reference Number</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="reference-number"
            maxLength={300}
            value={invoice.referenceNumber}
            onChange={(event) =>
              onChange({ referenceNumber: event.target.value })
            }
          />
          <InputGroupAddon align="inline-end">
            <HashIcon />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        <InvoiceDatePicker
          label="Issued Date"
          id="issued-date"
          value={invoice.issuedDate}
          onChange={(issuedDate) => onChange({ issuedDate })}
        />
        <InvoiceDatePicker
          label="Due Date"
          id="due-date"
          value={invoice.paymentDueDate}
          onChange={(paymentDueDate) => onChange({ paymentDueDate })}
        />
      </FieldGroup>
    </FieldGroup>
  );
}

function InvoiceDatePicker({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const date = parseISO(value);
  return (
    <Field className="gap-1">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            />
          }
        >
          {format(date, "PPP")}
          <CalendarIcon data-icon="inline-end" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={(selected) => {
              if (selected) {
                onChange(format(selected, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
