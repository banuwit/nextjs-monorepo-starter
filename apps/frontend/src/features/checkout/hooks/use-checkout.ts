"use client";

import { useState } from "react";
import { checkout } from "@/mocks/checkout.mock";
import {
  resetPasswordSchema,
  signInSchema,
} from "../schemas/checkout.schema";
import type {
  CheckoutFieldChange,
  CheckoutFormErrors,
  CheckoutItem,
  CheckoutPromo,
  CheckoutStepId,
} from "../types/checkout";
import {
  calculateCheckout,
  CHECKOUT_STEP_IDS,
  CHECKOUT_STEP_SCHEMAS,
  validateCheckoutFields,
} from "../utils/checkout";

function findPromo(code: string) {
  return (
    checkout.promos.find(
      (candidate) => candidate.code === code.trim().toUpperCase(),
    ) ?? null
  );
}

export function useCheckout(initialItems: CheckoutItem[] = checkout.items) {
  const [step, setStep] = useState<CheckoutStepId>("customer");
  const [form, setForm] = useState(checkout.defaults);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [items, setItems] = useState(initialItems);
  const [promo, setPromo] = useState<CheckoutPromo | null>(
    findPromo(checkout.defaultPromoCode),
  );
  const [accountNotice, setAccountNotice] = useState("");
  const [placed, setPlaced] = useState(false);

  const stepIndex = CHECKOUT_STEP_IDS.indexOf(step);
  const address = checkout.addresses.find(
    (candidate) => candidate.id === form.addressId,
  );
  const shippingMethod = checkout.shippingMethods.find(
    (method) => method.id === form.shippingMethodId,
  );
  const shippingPrice = shippingMethod?.price ?? 0;
  const totals = calculateCheckout(
    items,
    shippingPrice,
    checkout.taxRate,
    promo,
  );

  const changeField: CheckoutFieldChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors(({ [field]: _cleared, ...rest }) => rest);
  };

  const goToStep = (target: CheckoutStepId) => {
    setErrors({});
    setStep(target);
  };

  // Returns false when the current step has invalid fields.
  const submitStep = () => {
    const stepErrors = validateCheckoutFields(CHECKOUT_STEP_SCHEMAS[step], form);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return false;

    const next = CHECKOUT_STEP_IDS[stepIndex + 1];
    if (next) {
      setStep(next);
    } else {
      setPlaced(true);
    }
    return true;
  };

  const goBack = () => {
    const previous = CHECKOUT_STEP_IDS[stepIndex - 1];
    if (previous) goToStep(previous);
  };

  const signIn = () => {
    const signInErrors = validateCheckoutFields(signInSchema, form);
    setErrors(signInErrors);
    setAccountNotice(
      Object.keys(signInErrors).length > 0
        ? ""
        : `Signed in as ${form.signInEmail}.`,
    );
  };

  const resetPassword = () => {
    const resetErrors = validateCheckoutFields(resetPasswordSchema, form);
    setErrors(resetErrors);
    setAccountNotice(
      Object.keys(resetErrors).length > 0
        ? ""
        : `Password reset link sent to ${form.signInEmail}.`,
    );
  };

  const createWithOrder = () => {
    setForm((current) => ({ ...current, createAccount: true }));
    if (form.newPassword.length < 8) {
      setErrors({ newPassword: "Password must be at least 8 characters." });
      setAccountNotice("");
    } else {
      setErrors({});
      setAccountNotice("An account will be created with this order.");
    }
  };

  // An empty code clears the applied promo.
  const applyPromo = (code: string) => {
    if (!code.trim()) {
      setPromo(null);
      return true;
    }
    const match = findPromo(code);
    if (match) setPromo(match);
    return Boolean(match);
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const reset = () => {
    setStep("customer");
    setForm(checkout.defaults);
    setErrors({});
    setItems(initialItems);
    setPromo(findPromo(checkout.defaultPromoCode));
    setAccountNotice("");
    setPlaced(false);
  };

  return {
    data: checkout,
    step,
    stepIndex,
    form,
    errors,
    items,
    promo,
    accountNotice,
    placed,
    address,
    shippingMethod,
    shippingPrice,
    totals,
    changeField,
    goToStep,
    submitStep,
    goBack,
    signIn,
    resetPassword,
    createWithOrder,
    applyPromo,
    removeItem,
    reset,
  };
}
