import { ArrowRightIcon, CircleCheckIcon } from "lucide-react";
import type {
  CheckoutAddress,
  CheckoutFieldChange,
  CheckoutForm,
  CheckoutFormErrors,
  CheckoutShippingMethod,
  CheckoutStepId,
} from "../types/checkout";
import {
  checkoutPaymentLabel,
  formatCheckoutCurrency,
} from "../utils/checkout";
import { CheckoutCheckboxField } from "./checkout-checkbox-field";

const ROW_CLASS =
  "flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 text-left text-sm";

function ReviewRow({
  label,
  title,
  detail,
  onEdit,
}: {
  label: string;
  title: string;
  detail: string;
  onEdit?: () => void;
}) {
  const content = (
    <>
      <span className="mr-auto text-muted-foreground">{label}</span>
      <span className="flex min-w-0 flex-col text-right">
        <span className="truncate font-medium">{title}</span>
        <span className="truncate text-xs text-muted-foreground">{detail}</span>
      </span>
    </>
  );

  if (!onEdit) return <div className={ROW_CLASS}>{content}</div>;

  return (
    <button
      type="button"
      aria-label={`Edit ${label.toLowerCase()}: ${title}, ${detail}`}
      className={`${ROW_CLASS} outline-none transition-colors hover:border-foreground/30 focus-visible:ring-3 focus-visible:ring-ring/50`}
      onClick={onEdit}
    >
      {content}
      <ArrowRightIcon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
    </button>
  );
}

type CheckoutReviewStepProps = {
  form: CheckoutForm;
  errors: CheckoutFormErrors;
  address?: CheckoutAddress;
  shippingMethod?: CheckoutShippingMethod;
  total: number;
  placed: boolean;
  onChange: CheckoutFieldChange;
  onEdit: (step: CheckoutStepId) => void;
};

export function CheckoutReviewStep({
  form,
  errors,
  address,
  shippingMethod,
  total,
  placed,
  onChange,
  onEdit,
}: CheckoutReviewStepProps) {
  const paymentLabel = checkoutPaymentLabel(form);
  const edit = (step: CheckoutStepId) =>
    placed ? undefined : () => onEdit(step);

  return (
    <div className="flex flex-col gap-4">
      {placed && (
        <div
          role="status"
          className="flex gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm"
        >
          <CircleCheckIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
          />
          <div>
            <p className="font-medium">Order Placed</p>
            <p className="text-muted-foreground">
              Confirmation was sent to {form.email}. The order total is{" "}
              {formatCheckoutCurrency(total)}.
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <ReviewRow
          label="Customer"
          title={`${form.firstName} ${form.lastName}`}
          detail={form.email}
          onEdit={edit("customer")}
        />
        <ReviewRow
          label="Delivery"
          title={shippingMethod?.name ?? ""}
          detail={`${address?.street} · ${shippingMethod?.arrival}`}
          onEdit={edit("delivery")}
        />
        <ReviewRow
          label="Payment"
          title={paymentLabel}
          detail={
            form.paymentMethod === "card"
              ? `Card ending ${form.cardNumber.slice(-4)}`
              : `Pay with ${paymentLabel}`
          }
          onEdit={edit("payment")}
        />
      </div>
      <CheckoutCheckboxField
        id="checkout-confirmed"
        label="Confirm This Order"
        description="I reviewed the delivery address, payment method, return policy, and final total."
        checked={form.confirmed}
        error={errors.confirmed}
        disabled={placed}
        onCheckedChange={(checked) => onChange("confirmed", checked)}
      />
    </div>
  );
}
