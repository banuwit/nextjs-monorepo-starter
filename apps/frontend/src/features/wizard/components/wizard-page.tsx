"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CircleHelpIcon,
  FileTextIcon,
  SendIcon,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { billingDraft, billingPlans } from "@/mocks/wizard.mock";
import { calculateInvoice, validateStep } from "../utils/wizard";
import type { BillingDraft, BillingErrors } from "../types/wizard";

const steps = [
  {
    title: "Plan",
    caption: "Select tier",
    description: "Choose the tier for the seat increase.",
  },
  {
    title: "Seats",
    caption: "Set seats",
    description: "Set capacity before finance review.",
  },
  {
    title: "Payment",
    caption: "Choose terms",
    description: "Route the invoice to finance.",
  },
  {
    title: "Review",
    caption: "Approve",
    description: "Check contract and finance routing.",
  },
] as const;
const reasons = {
  "team-growth": "Team growth",
  consolidation: "Workspace consolidation",
  "new-project": "New project",
};
const paymentMethods = {
  "net-30": "Net 30 invoice",
  card: "Credit card",
  "bank-transfer": "Bank transfer",
};
const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
const dateLabel = (value: string) =>
  value && !Number.isNaN(Date.parse(value))
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(value))
    : "Not set";

function Detail({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <dt className="flex min-w-0 flex-col gap-0.5">
        <span>{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </dt>
      <dd className="min-w-0 text-right font-medium break-words [overflow-wrap:anywhere] tabular-nums">
        {children}
      </dd>
    </div>
  );
}

function FormRow({
  name,
  label,
  description,
  error,
  children,
}: {
  name: string;
  label: string;
  description: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <Field orientation="responsive" data-invalid={!!error}>
      <FieldContent>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
      <div className="flex min-w-0 flex-col gap-2 @md/field-group:w-56">
        {children}
        {error && <FieldError id={`${name}-error`}>{error}</FieldError>}
      </div>
    </Field>
  );
}

function Help({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`${label} details`}
          />
        }
      >
        <CircleHelpIcon />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

export function WizardPage() {
  const [draft, setDraft] = useState<BillingDraft>({ ...billingDraft });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<BillingErrors>({});
  const [issued, setIssued] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const plan = billingPlans.find((option) => option.id === draft.plan)!;
  const invoice = calculateInvoice(plan.price, draft.seats, draft.cycle);
  const currentStep = steps[step]!;
  const cycleLabel = draft.cycle === "annual" ? "Annual" : "Monthly";

  function update<K extends keyof BillingDraft>(
    key: K,
    value: BillingDraft[K],
  ) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setIssued(false);
  }

  function navigate(target: number) {
    if (target > step) {
      for (let index = 0; index < Math.min(target, steps.length); index++) {
        const invalid = validateStep(index, draft);
        if (Object.keys(invalid).length) {
          setErrors(invalid);
          setStep(index);
          requestAnimationFrame(() =>
            document.getElementById(Object.keys(invalid)[0]!)?.focus(),
          );
          return;
        }
      }
    }
    setErrors({});
    if (target === steps.length) {
      setIssued(true);
    } else {
      setStep(target);
      requestAnimationFrame(() => heading.current?.focus());
    }
  }

  function inputProps(name: keyof BillingDraft) {
    return {
      id: name,
      name,
      "aria-invalid": !!errors[name],
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }

  return (
    <AppBody>
      <PageHeading title="Wizard" currentPage="Wizard">
        <Badge variant="outline">Demo</Badge>
      </PageHeading>
      <div className="flex flex-1 items-start justify-center py-4 sm:py-8">
        <Card className="w-full max-w-4xl gap-0 py-0">
          <CardHeader className="border-b px-5 py-4 sm:px-6">
            <CardTitle>Billing upgrade</CardTitle>
            <CardDescription>
              Change plan, seats, and payment terms before renewal.
            </CardDescription>
            <CardAction className="self-center">
              <Badge
                variant="outline"
                aria-label={`Workflow status: ${issued ? "Issued" : "Draft"}`}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    issued ? "bg-primary" : "bg-amber-500",
                  )}
                  aria-hidden="true"
                />
                {issued ? "Issued" : "Draft"}
              </Badge>
            </CardAction>
          </CardHeader>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (!issued) navigate(step + 1);
            }}
          >
            <CardContent className="flex flex-col gap-6 px-5 py-5 sm:px-6 sm:py-6">
              <nav aria-label="Billing upgrade progress" className="py-4">
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
                        className="relative flex min-h-11 w-full cursor-pointer flex-col items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                        <span className="text-sm leading-none font-medium">
                          {item.title}
                        </span>
                        <span className="hidden text-xs leading-none text-muted-foreground sm:block">
                          {item.caption}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="grid gap-7 @3xl/main:grid-cols-[minmax(0,1fr)_19rem]">
                <section
                  aria-labelledby="wizard-step-title"
                  className="flex min-w-0 flex-col gap-4"
                >
                  <div className="flex flex-col gap-0.5">
                    <h2
                      id="wizard-step-title"
                      ref={heading}
                      tabIndex={-1}
                      className="text-base font-semibold outline-none"
                    >
                      {currentStep.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {currentStep.description}
                    </p>
                  </div>
                  {step === 0 && (
                    <FieldSet className="min-w-0">
                      <FieldLegend className="sr-only">
                        Available plans
                      </FieldLegend>
                      <RadioGroup
                        aria-label="Select billing plan"
                        value={draft.plan}
                        onValueChange={(value) =>
                          update("plan", value as BillingDraft["plan"])
                        }
                      >
                        {billingPlans.map((option) => (
                          <FieldLabel
                            key={option.id}
                            htmlFor={`plan-${option.id}`}
                          >
                            <Field
                              orientation="horizontal"
                              className="min-h-20 cursor-pointer flex-wrap sm:flex-nowrap"
                            >
                              <RadioGroupItem
                                id={`plan-${option.id}`}
                                value={option.id}
                              />
                              <FieldContent className="min-w-0">
                                <FieldTitle className="flex-wrap">
                                  {option.name}
                                  {option.id === "business" && (
                                    <Badge variant="secondary">
                                      Recommended
                                    </Badge>
                                  )}
                                </FieldTitle>
                                <FieldDescription>
                                  {option.description}
                                </FieldDescription>
                              </FieldContent>
                              <span className="ml-6 w-full shrink-0 text-xs font-medium sm:ml-0 sm:w-auto">
                                ${option.price}/seat/mo
                              </span>
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                    </FieldSet>
                  )}
                  {step === 1 && (
                    <>
                      <FieldGroup>
                        <FormRow
                          name="seats"
                          label="Seat count"
                          description={`30 current, ${draft.seats - 30} added.`}
                          error={errors.seats}
                        >
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              30 minimum
                            </span>
                            <output aria-live="polite">
                              {draft.seats} seats
                            </output>
                          </div>
                          <Slider
                            id="seats"
                            aria-label="Seat count"
                            min={30}
                            max={100}
                            step={1}
                            value={[draft.seats]}
                            onValueChange={(value) =>
                              update(
                                "seats",
                                Array.isArray(value) ? value[0]! : value,
                              )
                            }
                          />
                        </FormRow>
                        <FormRow
                          name="cycle"
                          label="Billing cycle"
                          description="Annual keeps one approval window."
                        >
                          <RadioGroup
                            id="cycle"
                            aria-label="Billing cycle"
                            className="grid-cols-2"
                            value={draft.cycle}
                            onValueChange={(value) =>
                              update("cycle", value as BillingDraft["cycle"])
                            }
                          >
                            {(["monthly", "annual"] as const).map((cycle) => (
                              <FieldLabel
                                key={cycle}
                                htmlFor={`cycle-${cycle}`}
                              >
                                <Field orientation="horizontal">
                                  <RadioGroupItem
                                    id={`cycle-${cycle}`}
                                    value={cycle}
                                  />
                                  <FieldTitle>
                                    {cycle === "annual" ? "Annual" : "Monthly"}
                                  </FieldTitle>
                                </Field>
                              </FieldLabel>
                            ))}
                          </RadioGroup>
                        </FormRow>
                      </FieldGroup>
                      <Separator className="my-1" />
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Request details</h3>
                        <Badge variant="outline">Seat change</Badge>
                      </div>
                      <FieldGroup>
                        <FormRow
                          name="owner"
                          label="Request owner"
                          description="Receives finance follow-up."
                          error={errors.owner}
                        >
                          <Input
                            {...inputProps("owner")}
                            type="email"
                            value={draft.owner}
                            onChange={(event) =>
                              update("owner", event.target.value)
                            }
                          />
                        </FormRow>
                        <FormRow
                          name="reason"
                          label="Upgrade reason"
                          description="Adds context for approval."
                        >
                          <NativeSelect
                            {...inputProps("reason")}
                            className="w-full"
                            value={draft.reason}
                            onChange={(event) =>
                              update(
                                "reason",
                                event.target.value as BillingDraft["reason"],
                              )
                            }
                          >
                            {Object.entries(reasons).map(([value, label]) => (
                              <NativeSelectOption key={value} value={value}>
                                {label}
                              </NativeSelectOption>
                            ))}
                          </NativeSelect>
                        </FormRow>
                      </FieldGroup>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <FieldGroup>
                        <FormRow
                          name="payment"
                          label="Payment method"
                          description="Sets the approval path."
                        >
                          <NativeSelect
                            {...inputProps("payment")}
                            className="w-full"
                            value={draft.payment}
                            onChange={(event) =>
                              update(
                                "payment",
                                event.target.value as BillingDraft["payment"],
                              )
                            }
                          >
                            {Object.entries(paymentMethods).map(
                              ([value, label]) => (
                                <NativeSelectOption key={value} value={value}>
                                  {label}
                                </NativeSelectOption>
                              ),
                            )}
                          </NativeSelect>
                        </FormRow>
                        <FormRow
                          name="renewal"
                          label="Renewal date"
                          description="Used for contract and invoice terms."
                          error={errors.renewal}
                        >
                          <Input
                            {...inputProps("renewal")}
                            type="date"
                            value={draft.renewal}
                            onChange={(event) =>
                              update("renewal", event.target.value)
                            }
                          />
                        </FormRow>
                        <FormRow
                          name="invoiceEmail"
                          label="Invoice email"
                          description="Receives the draft invoice."
                          error={errors.invoiceEmail}
                        >
                          <Input
                            {...inputProps("invoiceEmail")}
                            type="email"
                            value={draft.invoiceEmail}
                            onChange={(event) =>
                              update("invoiceEmail", event.target.value)
                            }
                          />
                        </FormRow>
                        <FormRow
                          name="purchaseOrder"
                          label="Purchase order"
                          description="Shown on the invoice."
                          error={errors.purchaseOrder}
                        >
                          <Input
                            {...inputProps("purchaseOrder")}
                            maxLength={100}
                            value={draft.purchaseOrder}
                            onChange={(event) =>
                              update("purchaseOrder", event.target.value)
                            }
                          />
                        </FormRow>
                      </FieldGroup>
                      <Alert>
                        <FileTextIcon />
                        <AlertTitle>Draft invoice</AlertTitle>
                        <AlertDescription>
                          One draft invoice includes the seat delta, renewal
                          date, and PO.
                        </AlertDescription>
                      </Alert>
                    </>
                  )}
                  {step === 3 && (
                    <div className="grid gap-6 sm:grid-cols-2 @3xl/main:grid-cols-1 @5xl/main:grid-cols-2">
                      <dl className="flex flex-col gap-3">
                        <Detail label="Plan">{plan.name}</Detail>
                        <Detail label="Seats">{draft.seats} total</Detail>
                        <Detail label="Cycle">{cycleLabel}</Detail>
                        <Detail label="Renewal">
                          {dateLabel(draft.renewal)}
                        </Detail>
                      </dl>
                      <dl className="flex flex-col gap-3">
                        <Detail label="Approval">
                          {paymentMethods[draft.payment]}
                        </Detail>
                        <Detail label="Reason">{reasons[draft.reason]}</Detail>
                        <Detail label="Owner">{draft.owner}</Detail>
                        <Detail label="Invoice">{draft.invoiceEmail}</Detail>
                        <Detail label="PO">{draft.purchaseOrder}</Detail>
                      </dl>
                    </div>
                  )}
                  {issued && (
                    <Alert role="status">
                      <CheckIcon />
                      <AlertTitle>Draft issued</AlertTitle>
                      <AlertDescription>
                        Demo invoice prepared. No payment was charged or email
                        sent. Editing a value starts a new draft.
                      </AlertDescription>
                    </Alert>
                  )}
                </section>
                <aside
                  aria-labelledby="invoice-preview-title"
                  className="flex min-w-0 flex-col gap-5 border-t pt-5 @3xl/main:border-t-0 @3xl/main:border-l @3xl/main:pt-0 @3xl/main:pl-6"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        id="invoice-preview-title"
                        className="text-sm font-semibold"
                      >
                        Invoice preview
                      </h2>
                      <Badge variant="outline">{cycleLabel}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Draft before approval.
                    </p>
                  </div>
                  <Item variant="outline" className="border-dashed">
                    <ItemContent>
                      <ItemTitle>Due today</ItemTitle>
                      <ItemDescription>
                        {plan.name}, {draft.seats} seats, {draft.cycle}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <output
                        aria-label="Due today"
                        aria-live="polite"
                        className="text-lg font-semibold tabular-nums"
                      >
                        {money(invoice.total)}
                      </output>
                    </ItemActions>
                  </Item>
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-medium">Cost breakdown</h3>
                      <Help label="Cost breakdown">
                        Annual billing includes a 15% term credit. Support is a
                        flat $390.
                      </Help>
                    </div>
                    <dl className="flex flex-col gap-2.5">
                      <Detail
                        label="Seats"
                        hint={`${draft.seats} seats, ${draft.cycle}`}
                      >
                        {money(invoice.subtotal)}
                      </Detail>
                      <Detail
                        label="Discount"
                        hint={`${draft.cycle === "annual" ? 15 : 0}% term credit`}
                      >
                        -{money(invoice.discount)}
                      </Detail>
                      <Detail label="Support">{money(invoice.support)}</Detail>
                    </dl>
                  </section>
                  <section className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-medium">Invoice routing</h3>
                      <Help label="Invoice routing">
                        Renewal date and purchase order come from the Payment
                        step.
                      </Help>
                    </div>
                    <dl className="flex flex-col gap-2.5">
                      <Detail label="Renewal">
                        {dateLabel(draft.renewal)}
                      </Detail>
                      <Detail label="PO">
                        {draft.purchaseOrder || "Not set"}
                      </Detail>
                    </dl>
                  </section>
                </aside>
              </div>
            </CardContent>
            <CardFooter className="justify-between gap-3 px-5 py-4 sm:px-6">
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
              <Button type="submit" className="ml-auto" disabled={issued}>
                {issued ? "Issued" : step === 3 ? "Issue draft" : "Next"}
                {!issued &&
                  (step === 3 ? (
                    <SendIcon data-icon="inline-end" />
                  ) : (
                    <ArrowRightIcon data-icon="inline-end" />
                  ))}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppBody>
  );
}
