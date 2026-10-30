import type { ComponentProps, ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CheckoutTextFieldProps = Omit<
  ComponentProps<typeof Input>,
  "id" | "onChange" | "value"
> & {
  id: string;
  label: string;
  value: string;
  description?: string;
  error?: string;
  labelAction?: ReactNode;
  onValueChange: (value: string) => void;
};

export function CheckoutTextField({
  id,
  label,
  value,
  description,
  error,
  labelAction,
  className,
  onValueChange,
  ...props
}: CheckoutTextFieldProps) {
  return (
    <Field data-invalid={Boolean(error)}>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {labelAction}
      </div>
      <Input
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn("scroll-mt-24 bg-card", className)}
        onChange={(event) => onValueChange(event.target.value)}
        {...props}
      />
      {description && !error && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}
