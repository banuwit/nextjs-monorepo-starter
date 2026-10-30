import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type {
  CheckoutFieldChange,
  CheckoutForm,
  CheckoutFormErrors,
} from "../types/checkout";
import { CheckoutCheckboxField } from "./checkout-checkbox-field";
import { CheckoutTextField } from "./checkout-text-field";

type CheckoutAccountOptionsProps = {
  form: CheckoutForm;
  errors: CheckoutFormErrors;
  notice: string;
  onChange: CheckoutFieldChange;
  onSignIn: () => void;
  onResetPassword: () => void;
  onCreateWithOrder: () => void;
};

export function CheckoutAccountOptions({
  form,
  errors,
  notice,
  onChange,
  onSignIn,
  onResetPassword,
  onCreateWithOrder,
}: CheckoutAccountOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold tracking-tight">
          Account Options
        </h3>
        <CardDescription>
          Sign in or create an account after checkout.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid gap-3 @lg/main:grid-cols-2">
          <section
            aria-labelledby="checkout-returning-heading"
            className="flex flex-col gap-3 rounded-lg border border-border p-4"
          >
            <div className="text-sm">
              <h4 id="checkout-returning-heading" className="font-medium">
                Returning Customer
              </h4>
              <p className="text-muted-foreground">
                Use saved checkout details.
              </p>
            </div>
            <CheckoutTextField
              id="checkout-sign-in-email"
              label="Email"
              type="email"
              autoComplete="username"
              spellCheck={false}
              value={form.signInEmail}
              error={errors.signInEmail}
              onValueChange={(value) => onChange("signInEmail", value)}
            />
            <CheckoutTextField
              id="checkout-sign-in-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={form.signInPassword}
              error={errors.signInPassword}
              labelAction={
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  className="h-auto p-0 text-foreground"
                  onClick={onResetPassword}
                >
                  Reset Password
                </Button>
              }
              onValueChange={(value) => onChange("signInPassword", value)}
            />
            <Button
              type="button"
              variant="secondary"
              className="mt-auto w-full"
              onClick={onSignIn}
            >
              Sign In
              <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
            </Button>
          </section>
          <section
            aria-labelledby="checkout-create-heading"
            className="flex flex-col gap-3 rounded-lg border border-border p-4"
          >
            <div className="text-sm">
              <h4 id="checkout-create-heading" className="font-medium">
                Create Account
              </h4>
              <p className="text-muted-foreground">
                Save details for next time.
              </p>
            </div>
            <CheckoutCheckboxField
              id="checkout-create-account"
              label="Create Account After Checkout"
              description={`Uses ${form.email}.`}
              checked={form.createAccount}
              onCheckedChange={(checked) => onChange("createAccount", checked)}
            />
            <CheckoutTextField
              id="checkout-new-password"
              label="New Password"
              type="password"
              autoComplete="new-password"
              placeholder="8+ characters"
              value={form.newPassword}
              error={errors.newPassword}
              onValueChange={(value) => onChange("newPassword", value)}
            />
            <CheckoutCheckboxField
              id="checkout-email-perks"
              label="Email Order Perks"
              checked={form.emailPerks}
              onCheckedChange={(checked) => onChange("emailPerks", checked)}
            />
            <Button
              type="button"
              variant="secondary"
              className="mt-auto w-full"
              onClick={onCreateWithOrder}
            >
              Create With Order
            </Button>
          </section>
        </div>
        <p role="status" className="text-sm text-muted-foreground empty:hidden">
          {notice}
        </p>
      </CardContent>
    </Card>
  );
}
