"use client";

import { useState } from "react";
import { SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { initials, usd } from "../utils/format";
import { financeAccounts, financeRecipients } from "@/mocks/dashboard-finance.mock";

import { transferAmountError } from "../utils/finance";

const available = financeAccounts[0].balance;

export function FinanceTransfer() {
  const [recipientId, setRecipientId] = useState<string>(financeRecipients[0].id);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const recipient = financeRecipients.find((item) => item.id === recipientId)!;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Quick transfer</CardTitle>
        <CardDescription>
          From Everyday checking, {usd.format(available)} available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            const message = transferAmountError(amount, available);
            setError(message);
            setResult(
              message
                ? ""
                : `Preview only: ${usd.format(Number(amount))} to ${recipient.name} was not sent.`,
            );
          }}
        >
          <FieldSet>
            <FieldLegend variant="label">Send to</FieldLegend>
            <div className="grid grid-cols-4 gap-2">
              {financeRecipients.map((item) => (
                <label key={item.id} className="flex cursor-pointer flex-col items-center gap-1.5">
                  <input
                    type="radio"
                    name="recipient"
                    value={item.id}
                    checked={item.id === recipientId}
                    onChange={() => {
                      setRecipientId(item.id);
                      setResult("");
                    }}
                    className="peer sr-only"
                  />
                  <span className="grid size-11 place-items-center rounded-full bg-muted text-sm font-medium ring-offset-2 ring-offset-card transition-shadow peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                    {initials(item.name)}
                  </span>
                  <span className="w-full truncate text-center text-xs text-muted-foreground peer-checked:text-foreground">
                    {item.name.split(" ")[0]}
                  </span>
                </label>
              ))}
            </div>
          </FieldSet>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="finance-transfer-amount">Amount</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="finance-transfer-amount"
                inputMode="decimal"
                placeholder="0.00"
                autoComplete="off"
                value={amount}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "finance-transfer-error" : undefined}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError(null);
                  setResult("");
                }}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>USD</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {error && <FieldError id="finance-transfer-error">{error}</FieldError>}
          </Field>
          <Button type="submit">
            <SendIcon data-icon="inline-start" />
            Send to {recipient.name.split(" ")[0]}
          </Button>
          <p role="status" className="min-h-5 text-xs text-muted-foreground">
            {result}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
