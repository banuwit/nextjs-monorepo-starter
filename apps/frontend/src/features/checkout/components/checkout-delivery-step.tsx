import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import type {
  CheckoutAddress,
  CheckoutFieldChange,
  CheckoutForm,
  CheckoutShippingMethod,
} from "../types/checkout";
import { formatCheckoutCurrency } from "../utils/checkout";
import { CheckoutOptionCard } from "./checkout-option-card";

type CheckoutDeliveryStepProps = {
  form: CheckoutForm;
  addresses: CheckoutAddress[];
  shippingMethods: CheckoutShippingMethod[];
  onChange: CheckoutFieldChange;
};

export function CheckoutDeliveryStep({
  form,
  addresses,
  shippingMethods,
  onChange,
}: CheckoutDeliveryStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <FieldSet>
        <div className="flex items-center justify-between gap-2">
          <FieldLegend variant="label" className="mb-0">
            Ship To
          </FieldLegend>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-foreground"
            nativeButton={false}
            render={<Link href="/dashboard/profile" />}
          >
            Manage Address
          </Button>
        </div>
        <RadioGroup
          className="grid gap-3 @lg/main:grid-cols-2"
          value={form.addressId}
          onValueChange={(value: string) => onChange("addressId", value)}
        >
          {addresses.map((address) => (
            <CheckoutOptionCard key={address.id} value={address.id}>
              <span className="flex items-start justify-between gap-2">
                <span className="font-medium">{address.label}</span>
                {address.isDefault && <Badge variant="secondary">Default</Badge>}
              </span>
              <span className="text-muted-foreground">{address.recipient}</span>
              <span className="text-muted-foreground">{address.street}</span>
              <span className="text-muted-foreground">{address.cityLine}</span>
            </CheckoutOptionCard>
          ))}
        </RadioGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label" className="mb-2">
          Delivery Speed
        </FieldLegend>
        <RadioGroup
          value={form.shippingMethodId}
          onValueChange={(value: string) =>
            onChange("shippingMethodId", value)
          }
        >
          {shippingMethods.map((method) => (
            <CheckoutOptionCard key={method.id} value={method.id}>
              <span className="flex items-start justify-between gap-2 font-medium">
                {method.name}
                <span className="tabular-nums">
                  {method.price === 0
                    ? "Free"
                    : formatCheckoutCurrency(method.price)}
                </span>
              </span>
              <span className="text-muted-foreground">
                {method.detail} • {method.arrival}
              </span>
            </CheckoutOptionCard>
          ))}
        </RadioGroup>
      </FieldSet>
    </div>
  );
}
