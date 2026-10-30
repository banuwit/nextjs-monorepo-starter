"use client";

import { useRef, type FormEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ShoppingBagIcon } from "lucide-react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Toaster, toast } from "@/components/ui/toast";
import { useCheckout } from "../hooks/use-checkout";
import type { CheckoutItem, CheckoutStepId } from "../types/checkout";
import {
  CHECKOUT_STEP_IDS,
  CHECKOUT_STEPS,
  checkoutPaymentLabel,
  formatCheckoutCurrency,
} from "../utils/checkout";
import { CheckoutAccountOptions } from "./checkout-account-options";
import { CheckoutCustomerStep } from "./checkout-customer-step";
import { CheckoutDeliveryStep } from "./checkout-delivery-step";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { CheckoutPaymentStep } from "./checkout-payment-step";
import { CheckoutReviewStep } from "./checkout-review-step";
import { CheckoutStepper } from "./checkout-stepper";

const FORM_ID = "checkout-form";

export function CheckoutPage({ items }: { items?: CheckoutItem[] }) {
  const checkout = useCheckout(items);
  const { data, step, form, errors, placed, address, shippingMethod, totals } =
    checkout;
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copy = CHECKOUT_STEPS[step];
  const nextStep = CHECKOUT_STEP_IDS[checkout.stepIndex + 1];

  const focusHeading = () =>
    requestAnimationFrame(() => headingRef.current?.focus());

  const goToStep = (target: CheckoutStepId) => {
    checkout.goToStep(target);
    focusHeading();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkout.submitStep()) {
      focusHeading();
      if (step === "review") {
        toast.add({
          title: "Order placed",
          description: `${formatCheckoutCurrency(totals.total)} charged to ${checkoutPaymentLabel(form)}.`,
          type: "success",
        });
      }
    } else {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
    }
  };

  const reset = () => {
    checkout.reset();
    focusHeading();
  };

  return (
    <AppBody>
      <Toaster />
      <div className="mx-auto flex w-full max-w-[68rem] flex-col gap-6">
        <PageHeading
          title="Checkout"
          currentPage="Checkout"
          description="Confirm shipping, payment, and order details."
        >
          {checkout.items.length > 0 && (
            <>
              {checkout.stepIndex > 0 && !placed && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    checkout.goBack();
                    focusHeading();
                  }}
                >
                  <ArrowLeftIcon aria-hidden="true" data-icon="inline-start" />
                  Back
                </Button>
              )}
              {placed ? (
                <Button type="button" onClick={reset}>
                  New Order
                  <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
                </Button>
              ) : (
                <Button type="submit" form={FORM_ID}>
                  {nextStep
                    ? `Continue to ${CHECKOUT_STEPS[nextStep].label}`
                    : "Place Order"}
                  <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
                </Button>
              )}
            </>
          )}
        </PageHeading>
        <CheckoutStepper
          stepIndex={checkout.stepIndex}
          locked={placed}
          onStepSelect={goToStep}
        />
        <div className="grid items-stretch gap-4 @4xl/main:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {checkout.items.length === 0 ? (
            <Card className="justify-center">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ShoppingBagIcon aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>Your bag is empty</EmptyTitle>
                  <EmptyDescription>
                    Add items to continue checking out.
                  </EmptyDescription>
                </EmptyHeader>
                <Button type="button" variant="outline" onClick={reset}>
                  Restore Bag
                </Button>
              </Empty>
            </Card>
          ) : (
            <form
              id={FORM_ID}
              ref={formRef}
              noValidate
              className="flex min-w-0 flex-col gap-4"
              onSubmit={submit}
            >
              <div
                key={step}
                className="flex animate-in flex-col gap-4 duration-200 fade-in-0 motion-reduce:animate-none"
              >
                <Card>
                  <CardHeader>
                    <h2
                      ref={headingRef}
                      tabIndex={-1}
                      className="scroll-mt-40 text-lg font-semibold tracking-tight outline-none"
                    >
                      {copy.title}
                    </h2>
                    <CardDescription>{copy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {step === "customer" && (
                      <CheckoutCustomerStep
                        form={form}
                        errors={errors}
                        countries={data.countries}
                        onChange={checkout.changeField}
                      />
                    )}
                    {step === "delivery" && (
                      <CheckoutDeliveryStep
                        form={form}
                        addresses={data.addresses}
                        shippingMethods={data.shippingMethods}
                        onChange={checkout.changeField}
                      />
                    )}
                    {step === "payment" && (
                      <CheckoutPaymentStep
                        form={form}
                        errors={errors}
                        onChange={checkout.changeField}
                      />
                    )}
                    {step === "review" && (
                      <CheckoutReviewStep
                        form={form}
                        errors={errors}
                        address={address}
                        shippingMethod={shippingMethod}
                        total={totals.total}
                        placed={placed}
                        onChange={checkout.changeField}
                        onEdit={goToStep}
                      />
                    )}
                  </CardContent>
                </Card>
                {step === "customer" && (
                  <CheckoutAccountOptions
                    form={form}
                    errors={errors}
                    notice={checkout.accountNotice}
                    onChange={checkout.changeField}
                    onSignIn={checkout.signIn}
                    onResetPassword={checkout.resetPassword}
                    onCreateWithOrder={checkout.createWithOrder}
                  />
                )}
              </div>
            </form>
          )}
          <aside aria-label="Order summary" className="min-w-0">
            <CheckoutOrderSummary
              items={checkout.items}
              addressLabel={address?.label}
              promo={checkout.promo}
              defaultPromoCode={data.defaultPromoCode}
              shippingPrice={checkout.shippingPrice}
              totals={totals}
              readOnly={placed}
              onApplyPromo={checkout.applyPromo}
              onRemoveItem={checkout.removeItem}
            />
          </aside>
        </div>
      </div>
    </AppBody>
  );
}
