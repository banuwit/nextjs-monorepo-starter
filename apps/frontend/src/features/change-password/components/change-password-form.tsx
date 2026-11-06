"use client";

import { useState, type FormEvent } from "react";
import { CircleCheckIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { changePasswordSchema } from "../schemas/change-password.schema";
import type {
  ChangePasswordErrors,
  ChangePasswordField,
  ChangePasswordValues,
} from "../types/change-password";
import { PasswordField } from "./password-field";
import { PasswordRequirements } from "./password-requirements";

const emptyValues: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordForm() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [saved, setSaved] = useState(false);

  function update(field: ChangePasswordField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = changePasswordSchema.safeParse(values);

    if (!result.success) {
      const next: ChangePasswordErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as ChangePasswordField | undefined;
        if (field && !next[field]) next[field] = issue.message;
      }
      setErrors(next);
      setSaved(false);
      const firstInvalid = (Object.keys(emptyValues) as ChangePasswordField[])
        .find((field) => next[field]);
      if (firstInvalid) {
        form
          .querySelector<HTMLInputElement>(`input[name="${firstInvalid}"]`)
          ?.focus();
      }
      return;
    }

    // UI preview: no API yet, so nothing is sent or stored.
    setErrors({});
    setValues(emptyValues);
    setSaved(true);
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <FieldGroup className="gap-4">
        <PasswordField
          name="currentPassword"
          label="Current password"
          autoComplete="current-password"
          placeholder="Enter your current password"
          value={values.currentPassword}
          onChange={(value) => update("currentPassword", value)}
          error={errors.currentPassword}
        />
        <PasswordField
          name="newPassword"
          label="New password"
          autoComplete="new-password"
          placeholder="Enter a new password"
          value={values.newPassword}
          onChange={(value) => update("newPassword", value)}
          error={errors.newPassword}
        />
        <PasswordRequirements password={values.newPassword} />
        <PasswordField
          name="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Re-enter the new password"
          value={values.confirmPassword}
          onChange={(value) => update("confirmPassword", value)}
          error={errors.confirmPassword}
        />
      </FieldGroup>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValues(emptyValues);
            setErrors({});
            setSaved(false);
          }}
        >
          Reset
        </Button>
        <Button type="submit">Update password</Button>
      </div>
      {saved && (
        <Alert role="status">
          <CircleCheckIcon />
          <AlertTitle>Form is valid</AlertTitle>
          <AlertDescription>
            This is a UI preview. Your password was not sent and has not been
            changed.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
