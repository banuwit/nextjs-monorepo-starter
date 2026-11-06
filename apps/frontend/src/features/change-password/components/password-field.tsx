"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type PasswordFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
};

export function PasswordField({
  name,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  description,
  error,
  disabled,
}: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const inputId = `${id}-input`;
  const messageId = `${id}-message`;

  return (
    <Field className="gap-1.5" data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || description ? messageId : undefined}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={visible ? `Hide ${label}` : `Show ${label}`}
            aria-pressed={visible}
            aria-controls={inputId}
            disabled={disabled}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <div id={messageId}>
        {error ? (
          <FieldError>{error}</FieldError>
        ) : (
          description && <FieldDescription>{description}</FieldDescription>
        )}
      </div>
    </Field>
  );
}
