import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CheckoutCountry,
  CheckoutFieldChange,
  CheckoutForm,
  CheckoutFormErrors,
} from "../types/checkout";
import { CheckoutTextField } from "./checkout-text-field";

type CheckoutCustomerStepProps = {
  form: CheckoutForm;
  errors: CheckoutFormErrors;
  countries: CheckoutCountry[];
  onChange: CheckoutFieldChange;
};

export function CheckoutCustomerStep({
  form,
  errors,
  countries,
  onChange,
}: CheckoutCustomerStepProps) {
  const countryItems = countries.map((country) => ({
    value: country.code,
    label: `${country.flag} ${country.name}`,
  }));

  return (
    <div className="grid gap-4 @lg/main:grid-cols-2">
      <CheckoutTextField
        id="checkout-first-name"
        label="First Name"
        autoComplete="given-name"
        value={form.firstName}
        error={errors.firstName}
        onValueChange={(value) => onChange("firstName", value)}
      />
      <CheckoutTextField
        id="checkout-last-name"
        label="Last Name"
        autoComplete="family-name"
        value={form.lastName}
        error={errors.lastName}
        onValueChange={(value) => onChange("lastName", value)}
      />
      <CheckoutTextField
        id="checkout-email"
        label="Email"
        type="email"
        autoComplete="email"
        spellCheck={false}
        description="Receipts and shipment changes are sent here."
        value={form.email}
        error={errors.email}
        onValueChange={(value) => onChange("email", value)}
      />
      <CheckoutTextField
        id="checkout-phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        value={form.phone}
        error={errors.phone}
        onValueChange={(value) => onChange("phone", value)}
      />
      <Field className="@lg/main:col-span-2">
        <FieldLabel id="checkout-country-label">Country</FieldLabel>
        <Select
          items={countryItems}
          value={form.country}
          onValueChange={(value: string | null) => {
            if (value) onChange("country", value);
          }}
        >
          <SelectTrigger
            className="w-full bg-card"
            aria-labelledby="checkout-country-label"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countryItems.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
