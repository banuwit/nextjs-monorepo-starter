import type { LucideIcon } from "lucide-react";
import { CreditCardIcon, SmartphoneIcon, WalletIcon } from "lucide-react";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import type {
  CheckoutFieldChange,
  CheckoutForm,
  CheckoutFormErrors,
  CheckoutPaymentMethod,
} from "../types/checkout";
import { formatCardExpiry, formatCardNumber } from "../utils/checkout";
import { CheckoutCheckboxField } from "./checkout-checkbox-field";
import { CheckoutOptionCard } from "./checkout-option-card";
import { CheckoutTextField } from "./checkout-text-field";

const PAYMENT_METHODS: {
  value: CheckoutPaymentMethod;
  label: string;
  detail: string;
  icon: LucideIcon;
}[] = [
  {
    value: "card",
    label: "Card",
    detail: "Visa, Mastercard, Amex",
    icon: CreditCardIcon,
  },
  {
    value: "paypal",
    label: "PayPal",
    detail: "Redirect after review",
    icon: WalletIcon,
  },
  {
    value: "apple-pay",
    label: "Apple Pay",
    detail: "Confirm on this device",
    icon: SmartphoneIcon,
  },
];

type CheckoutPaymentStepProps = {
  form: CheckoutForm;
  errors: CheckoutFormErrors;
  onChange: CheckoutFieldChange;
};

export function CheckoutPaymentStep({
  form,
  errors,
  onChange,
}: CheckoutPaymentStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <FieldSet>
        <FieldLegend variant="label" className="mb-2">
          Payment
        </FieldLegend>
        <RadioGroup
          className="grid gap-3 @lg/main:grid-cols-3"
          value={form.paymentMethod}
          onValueChange={(value: CheckoutPaymentMethod) =>
            onChange("paymentMethod", value)
          }
        >
          {PAYMENT_METHODS.map(({ value, label, detail, icon: Icon }) => (
            <CheckoutOptionCard key={value} value={value}>
              <span className="flex items-center gap-2 font-medium">
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {label}
              </span>
              <span className="mt-0.5 text-xs text-muted-foreground">
                {detail}
              </span>
            </CheckoutOptionCard>
          ))}
        </RadioGroup>
      </FieldSet>
      {form.paymentMethod === "card" && (
        <>
          <div className="grid gap-4 @lg/main:grid-cols-2">
            <CheckoutTextField
              id="checkout-card-name"
              label="Name On Card"
              autoComplete="cc-name"
              value={form.cardName}
              error={errors.cardName}
              onValueChange={(value) => onChange("cardName", value)}
            />
            <CheckoutTextField
              id="checkout-card-number"
              label="Card Number"
              inputMode="numeric"
              autoComplete="cc-number"
              value={form.cardNumber}
              error={errors.cardNumber}
              onValueChange={(value) =>
                onChange("cardNumber", formatCardNumber(value))
              }
            />
            <CheckoutTextField
              id="checkout-card-expiry"
              label="Expiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={form.cardExpiry}
              error={errors.cardExpiry}
              onValueChange={(value) =>
                onChange("cardExpiry", formatCardExpiry(value))
              }
            />
            <CheckoutTextField
              id="checkout-card-cvc"
              label="CVC"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              value={form.cardCvc}
              error={errors.cardCvc}
              onValueChange={(value) =>
                onChange("cardCvc", value.replace(/\D/g, ""))
              }
            />
          </div>
          <CheckoutCheckboxField
            id="checkout-save-card"
            label="Save Card"
            description="Use this payment method faster next time."
            checked={form.saveCard}
            onCheckedChange={(checked) => onChange("saveCard", checked)}
          />
        </>
      )}
    </div>
  );
}
