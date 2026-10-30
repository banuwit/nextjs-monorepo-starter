import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type CheckoutCheckboxFieldProps = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  error?: string;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function CheckoutCheckboxField({
  id,
  label,
  description,
  checked,
  error,
  disabled,
  onCheckedChange,
}: CheckoutCheckboxFieldProps) {
  return (
    <Field orientation="horizontal" data-invalid={Boolean(error)}>
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onCheckedChange={onCheckedChange}
      />
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
}
