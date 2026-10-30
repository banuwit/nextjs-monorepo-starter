"use client";

import { useRef, useState } from "react";
import {
  CheckIcon,
  CircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { draftPreviewExample } from "@/mocks/draft-preview.mock";
import {
  draftPreviewSchema,
  draftPreviewStepForPath,
  validateDraftPreviewStep,
} from "../schemas/draft-preview.schema";
import { cn } from "@/lib/utils";
import type { DraftPreview, DraftPreviewErrors } from "../types/draft-preview";
import { calculateDraftPreview, formatMoney } from "../utils/draft-preview";
import { DraftPreviewField, PartyFields } from "./draft-preview-fields";
import { DraftPreviewItems } from "./draft-preview-items";
import { DraftPreviewPreview } from "./draft-preview-preview";
import { useDraftPreviewExport } from "../hooks/use-draft-preview-export";

const steps = [
  {
    title: "Details",
    caption: "Draft Preview",
    description: "Set the reference and payment timeline.",
  },
  {
    title: "Parties",
    caption: "From & to",
    description: "Add your business and client details.",
  },
  {
    title: "Items",
    caption: "Charges",
    description: "Add items and adjust the total.",
  },
  {
    title: "Payment",
    caption: "Review",
    description: "Add payment details and review your draft preview.",
  },
] as const;

export function DraftPreviewPage() {
  const [draftPreview, setDraftPreview] =
    useState<DraftPreview>(draftPreviewExample);
  const [step, setStep] = useState(0);
  const [validatedSteps, setValidatedSteps] = useState<number[]>([]);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const output = useDraftPreviewExport(draftPreview);
  const validation = draftPreviewSchema.safeParse(draftPreview);
  const errors: DraftPreviewErrors = {};
  for (const index of validatedSteps)
    Object.assign(errors, validateDraftPreviewStep(index, draftPreview));
  const totals = calculateDraftPreview(draftPreview);
  const money = (value: number) => formatMoney(value, draftPreview.currency);
  const update = (patch: Partial<DraftPreview>) =>
    setDraftPreview((current) => ({ ...current, ...patch }));
  const checks = [
    "Draft Preview details",
    "Business & client",
    "Items & adjustments",
    "Payment details",
  ].map((label, index) => ({
    label,
    complete:
      Object.keys(validateDraftPreviewStep(index, draftPreview)).length === 0,
  }));

  function navigate(target: number) {
    if (target < 0 || target >= steps.length) return;
    if (target > step) {
      for (let index = 0; index < target; index++) {
        const invalid = validateDraftPreviewStep(index, draftPreview);
        if (Object.keys(invalid).length) {
          setValidatedSteps((current) =>
            current.includes(index) ? current : [...current, index],
          );
          setStep(index);
          requestAnimationFrame(() =>
            document.getElementById(Object.keys(invalid)[0]!)?.focus(),
          );
          return;
        }
      }
    }
    setStep(target);
    requestAnimationFrame(() => stepHeading.current?.focus());
  }

  function exportDraftPreview() {
    if (!validation.success) {
      setValidatedSteps([0, 1, 2, 3]);
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }
    output.download();
  }

  return (
    <AppBody>
      <div className="flex flex-col gap-6 pb-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Draft Preview
              </h1>
              <span className="rounded-md border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground">
                Draft
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Good work deserves a well-crafted draft preview.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="lg"
              disabled={output.busy}
              onClick={() => exportDraftPreview()}
            >
              {output.busy ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <DownloadIcon />
              )}{" "}
              {output.busy ? "Preparing PDF…" : "Download PDF"}
            </Button>
          </div>
        </header>
        {output.error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            {output.error}
          </div>
        )}
        {output.message && (
          <p role="status" className="text-sm text-primary-text">
            {output.message}
          </p>
        )}
        {Object.keys(errors).length > 0 && (
          <div
            ref={errorSummary}
            tabIndex={-1}
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <h2 className="text-sm font-medium">
              A few details need your attention
            </h2>
            <ul className="mt-2 flex list-inside list-disc flex-col gap-1 text-sm text-destructive">
              {Object.entries(errors).map(([path, message]) => (
                <li key={path}>
                  <a
                    href={`#${path}`}
                    className="underline underline-offset-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setStep(draftPreviewStepForPath(path));
                      requestAnimationFrame(() =>
                        document.getElementById(path)?.focus(),
                      );
                    }}
                  >
                    {path.startsWith("items.")
                      ? `Item ${Number(path.split(".")[1]) + 1}: `
                      : ""}
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid min-w-0 items-start gap-6 @min-[900px]/main:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-5">
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (step === steps.length - 1) exportDraftPreview();
                else navigate(step + 1);
              }}
              className="min-w-0 rounded-xl border border-border bg-card text-card-foreground"
            >
              <nav
                aria-label="Draft Preview progress"
                className="px-4 pt-6 pb-5 sm:px-6"
              >
                <ol className="flex">
                  {steps.map((item, index) => (
                    <li key={item.title} className="relative min-w-0 flex-1">
                      {index < steps.length - 1 && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute top-3 left-[calc(50%+1.125rem)] h-0.5 w-[calc(100%-2.25rem)]",
                            index < step ? "bg-primary" : "bg-muted",
                          )}
                        />
                      )}
                      <button
                        type="button"
                        aria-label={item.title}
                        aria-current={index === step ? "step" : undefined}
                        onClick={() => navigate(index)}
                        className="relative flex min-h-11 w-full flex-col items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full border text-xs",
                            index < step
                              ? "border-primary bg-primary text-primary-foreground"
                              : index === step
                                ? "border-dashed border-primary bg-primary/10 text-primary-text"
                                : "border-border bg-background",
                          )}
                        >
                          {index + 1}
                        </span>
                        <span className="text-center text-xs leading-tight font-medium sm:text-sm">
                          {item.title}
                        </span>
                        <span className="hidden text-center text-xs leading-none text-muted-foreground sm:block">
                          {item.caption}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="border-t px-5 pt-5 sm:px-7">
                <h2
                  ref={stepHeading}
                  tabIndex={-1}
                  className="text-base font-semibold outline-none"
                >
                  {steps[step]?.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {steps[step]?.description}
                </p>
              </div>
              <fieldset className="min-w-0">
                {step === 0 && (
                  <section
                    className="px-5 py-6 sm:px-7"
                    aria-label="Draft Preview details"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <DraftPreviewField
                        id="reference"
                        label="Draft Preview number"
                        maxLength={60}
                        value={draftPreview.reference}
                        error={errors.reference}
                        onChange={(e) => update({ reference: e.target.value })}
                      />
                      <DraftPreviewField
                        id="issuedDate"
                        label="Issue date"
                        type="date"
                        value={draftPreview.issuedDate}
                        error={errors.issuedDate}
                        onChange={(e) => update({ issuedDate: e.target.value })}
                      />
                      <DraftPreviewField
                        id="dueDate"
                        label="Due date"
                        type="date"
                        value={draftPreview.dueDate}
                        error={errors.dueDate}
                        onChange={(e) => update({ dueDate: e.target.value })}
                      />
                      <Field className="gap-2">
                        <FieldLabel
                          htmlFor="currency"
                          className="text-xs text-muted-foreground"
                        >
                          Currency
                        </FieldLabel>
                        <NativeSelect
                          id="currency"
                          className="w-full [&_select]:h-10"
                          value={draftPreview.currency}
                          onChange={(e) =>
                            update({
                              currency: e.target
                                .value as DraftPreview["currency"],
                            })
                          }
                        >
                          {["IDR", "USD", "EUR"].map((currency) => (
                            <NativeSelectOption key={currency} value={currency}>
                              {currency}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      </Field>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Changing currency keeps the entered prices; it does not
                      convert them.
                    </p>
                  </section>
                )}
                {step === 1 && (
                  <section
                    className="grid gap-7 px-5 py-6 sm:grid-cols-2 sm:px-7"
                    aria-label="Business and client"
                  >
                    <PartyFields
                      kind="from"
                      value={draftPreview.from}
                      errors={errors}
                      onChange={(from) => update({ from })}
                    />
                    <PartyFields
                      kind="to"
                      value={draftPreview.to}
                      errors={errors}
                      onChange={(to) => update({ to })}
                    />
                  </section>
                )}
                {step === 2 && (
                  <DraftPreviewItems
                    draftPreview={draftPreview}
                    errors={errors}
                    onChange={(items) => update({ items })}
                  />
                )}
                {step === 3 && (
                  <section
                    className="px-5 py-6 sm:px-7"
                    aria-labelledby="payment-heading"
                  >
                    <h2 id="payment-heading" className="mb-5 font-medium">
                      Payment & notes
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <DraftPreviewField
                        id="bank"
                        label="Bank name"
                        value={draftPreview.bank}
                        maxLength={160}
                        error={errors.bank}
                        onChange={(e) => update({ bank: e.target.value })}
                      />
                      <DraftPreviewField
                        id="accountName"
                        label="Account holder"
                        value={draftPreview.accountName}
                        maxLength={160}
                        error={errors.accountName}
                        onChange={(e) =>
                          update({ accountName: e.target.value })
                        }
                      />
                      <DraftPreviewField
                        id="accountNumber"
                        label="Account number"
                        value={draftPreview.accountNumber}
                        maxLength={160}
                        error={errors.accountNumber}
                        onChange={(e) =>
                          update({ accountNumber: e.target.value })
                        }
                      />
                    </div>
                    <div className="mt-5">
                      <DraftPreviewField
                        id="notes"
                        label="Notes to your client (optional)"
                        multiline
                        maxLength={1500}
                        value={draftPreview.notes}
                        error={errors.notes}
                        onChange={(e) => update({ notes: e.target.value })}
                      />
                    </div>
                  </section>
                )}
                {step === 2 && (
                  <section
                    className="border-t border-border px-5 py-6 sm:px-7"
                    aria-labelledby="draft-preview-summary-heading"
                  >
                    <div>
                      <h2
                        id="draft-preview-summary-heading"
                        className="font-medium"
                      >
                        Draft Preview summary
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Every detail, accounted for.
                      </p>
                    </div>
                    <fieldset className="mt-5 flex min-w-0 flex-col gap-5">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium tabular-nums">
                          {money(totals.subtotal)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field className="gap-2">
                          <FieldLabel
                            htmlFor="discountType"
                            className="text-xs text-muted-foreground"
                          >
                            Discount type
                          </FieldLabel>
                          <NativeSelect
                            id="discountType"
                            className="w-full [&_select]:h-10"
                            value={draftPreview.discountType}
                            onChange={(e) =>
                              update({
                                discountType: e.target
                                  .value as DraftPreview["discountType"],
                              })
                            }
                          >
                            <NativeSelectOption value="percent">
                              Percent (%)
                            </NativeSelectOption>
                            <NativeSelectOption value="fixed">
                              Amount
                            </NativeSelectOption>
                          </NativeSelect>
                        </Field>
                        <DraftPreviewField
                          id="discountValue"
                          label={
                            draftPreview.discountType === "percent"
                              ? "Discount (%)"
                              : `Discount (${draftPreview.currency})`
                          }
                          type="number"
                          min={0}
                          step="any"
                          value={
                            Number.isFinite(draftPreview.discountValue)
                              ? draftPreview.discountValue
                              : ""
                          }
                          error={errors.discountValue}
                          onChange={(e) =>
                            update({ discountValue: e.target.valueAsNumber })
                          }
                        />
                      </div>
                      <DraftPreviewField
                        id="taxRate"
                        label="Tax rate (%)"
                        type="number"
                        min={0}
                        max={100}
                        step="any"
                        value={
                          Number.isFinite(draftPreview.taxRate)
                            ? draftPreview.taxRate
                            : ""
                        }
                        error={errors.taxRate}
                        onChange={(e) =>
                          update({ taxRate: e.target.valueAsNumber })
                        }
                      />
                      <dl className="flex flex-col gap-3 text-sm">
                        <div className="flex justify-between gap-2">
                          <dt className="text-muted-foreground">Discount</dt>
                          <dd className="tabular-nums">
                            −{money(totals.discount)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-muted-foreground">Tax</dt>
                          <dd className="tabular-nums">{money(totals.tax)}</dd>
                        </div>
                      </dl>
                      <div className="border-t pt-5">
                        <p className="text-xs text-muted-foreground">
                          Total due{" "}
                          <span className="float-right">
                            {draftPreview.currency}
                          </span>
                        </p>
                        <p className="mt-2 break-words text-3xl font-semibold tracking-tight tabular-nums">
                          {money(totals.total)}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Tax is calculated after discount.
                        </p>
                      </div>
                    </fieldset>
                  </section>
                )}
                {step === 3 && (
                  <section
                    className="border-t border-border px-5 py-6 sm:px-7"
                    aria-labelledby="draft-preview-readiness-heading"
                  >
                    <h2
                      id="draft-preview-readiness-heading"
                      className="mb-4 text-sm font-medium"
                    >
                      Ready to share?
                    </h2>
                    <ul className="flex flex-col gap-3">
                      {checks.map((check) => (
                        <li
                          key={check.label}
                          className="flex items-center gap-2.5 text-xs"
                        >
                          {check.complete ? (
                            <CheckIcon className="size-4 text-primary-text" />
                          ) : (
                            <CircleIcon className="size-4 text-muted-foreground" />
                          )}
                          <span>{check.label}</span>
                          <span className="sr-only">
                            {check.complete ? "complete" : "incomplete"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </fieldset>
              <div className="flex items-center justify-between gap-3 border-t bg-muted/50 px-5 py-4 sm:px-7">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(step - 1)}
                  >
                    <ArrowLeftIcon data-icon="inline-start" />
                    Previous
                  </Button>
                )}
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={output.busy && step === steps.length - 1}
                >
                  {step === steps.length - 1 ? "Download PDF" : "Next"}
                  {step < steps.length - 1 && (
                    <ArrowRightIcon data-icon="inline-end" />
                  )}
                </Button>
              </div>
            </form>
            <p className="px-1 text-xs leading-relaxed text-muted-foreground">
              Example draft preview. Changes stay on this page until you leave
              or reload. Download a PDF to keep a copy.
            </p>
          </div>
          <DraftPreviewPreview
            key={output.file?.url ?? "loading"}
            output={output}
            onValidate={exportDraftPreview}
          />
        </div>
      </div>
    </AppBody>
  );
}
