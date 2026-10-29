"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { crmHealth, crmStages, type CrmOpportunity } from "@/mocks/dashboard-crm.mock";

import { opportunityValueError } from "../utils/crm-data";
import { priorityLabels } from "../utils/crm-status";

export function CrmOpportunityEditor({
  opportunity,
  onSave,
}: {
  opportunity: CrmOpportunity;
  onSave: (opportunity: CrmOpportunity) => void;
}) {
  const [draft, setDraft] = useState(opportunity);
  const [value, setValue] = useState(String(opportunity.value));
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      noValidate
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = Number(value);
        const message = opportunityValueError(value.trim() ? parsed : Number.NaN);
        setError(message);
        if (message) {
          document.getElementById("crm-value")?.focus();
          return;
        }
        onSave({ ...draft, value: parsed });
      }}
    >
      <SheetHeader>
        <SheetTitle>{opportunity.account}</SheetTitle>
        <SheetDescription>
          Opportunity {opportunity.id}. Changes stay until you reload the page.
        </SheetDescription>
      </SheetHeader>
      <FieldGroup className="overflow-y-auto px-4">
        <Field>
          <FieldLabel htmlFor="crm-stage">Stage</FieldLabel>
          <NativeSelect
            id="crm-stage"
            value={draft.stage}
            onChange={(event) =>
              setDraft({ ...draft, stage: event.target.value as CrmOpportunity["stage"] })
            }
          >
            {crmStages.map((stage) => (
              <NativeSelectOption key={stage} value={stage}>
                {stage}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="crm-health">Health</FieldLabel>
          <NativeSelect
            id="crm-health"
            value={draft.health}
            onChange={(event) =>
              setDraft({ ...draft, health: event.target.value as CrmOpportunity["health"] })
            }
          >
            {crmHealth.map((health) => (
              <NativeSelectOption key={health} value={health}>
                {health}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="crm-priority">Priority</FieldLabel>
          <NativeSelect
            id="crm-priority"
            value={String(draft.priority)}
            onChange={(event) =>
              setDraft({
                ...draft,
                priority: Number(event.target.value) as CrmOpportunity["priority"],
              })
            }
          >
            {([1, 2, 3] as const).map((priority) => (
              <NativeSelectOption key={priority} value={String(priority)}>
                {priorityLabels[priority]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="crm-value">Deal value (USD)</FieldLabel>
          <Input
            id="crm-value"
            inputMode="numeric"
            value={value}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "crm-value-error" : undefined}
            onChange={(event) => {
              setValue(event.target.value);
              setError(null);
            }}
          />
          {error && <FieldError id="crm-value-error">{error}</FieldError>}
        </Field>
      </FieldGroup>
      <SheetFooter>
        <Button type="submit">Save changes</Button>
        <SheetClose render={<Button variant="outline" type="button" />}>Cancel</SheetClose>
      </SheetFooter>
    </form>
  );
}
