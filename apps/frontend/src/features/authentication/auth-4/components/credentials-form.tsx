"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AuthPreviewAction } from "./auth-preview-action";

export function CredentialsForm({
  placeholder = "Email or username",
}: {
  placeholder?: string;
}) {
  const id = useId();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        // UI preview: no authentication yet, so go straight to the dashboard.
        router.push("/dashboard");
      }}
    >
      <FieldGroup className="gap-4">
        <Field className="gap-1.5">
          <FieldLabel htmlFor={`${id}-username`}>Email or username</FieldLabel>
          <Input
            id={`${id}-username`}
            name="username"
            autoComplete="username"
            placeholder={placeholder}
            required
          />
        </Field>
        <Field className="gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
            <AuthPreviewAction
              variant="link"
              className="h-auto p-0 text-xs"
              message="Password recovery is not connected in this preview. Contact your administrator for account assistance."
            >
              Forgot password?
            </AuthPreviewAction>
          </div>
          <InputGroup>
            <InputGroupInput
              id={`${id}-password`}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                aria-controls={`${id}-password`}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
}
