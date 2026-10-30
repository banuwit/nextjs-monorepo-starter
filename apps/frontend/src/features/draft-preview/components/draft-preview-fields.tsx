import type { ComponentProps } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DraftPreview, DraftPreviewErrors } from "../types/draft-preview";

type DraftPreviewFieldProps = { label: string; id: string; error?: string } & (
  | ({ multiline: true } & ComponentProps<"textarea">)
  | ({ multiline?: false } & ComponentProps<"input">)
);

export function DraftPreviewField({
  label,
  id,
  error,
  ...props
}: DraftPreviewFieldProps) {
  const accessibility = {
    id,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
  let control;
  if (props.multiline) {
    const { multiline: _multiline, ...input } = props;
    control = (
      <Textarea
        {...input}
        {...accessibility}
        rows={3}
        className="min-h-20 resize-y"
      />
    );
  } else {
    const { multiline: _multiline, ...input } = props;
    control = <Input {...input} {...accessibility} className="h-10" />;
  }
  return (
    <Field className="min-w-0 gap-2" data-invalid={!!error}>
      <FieldLabel htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </FieldLabel>
      {control}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </Field>
  );
}

export function PartyFields({
  kind,
  value,
  errors,
  onChange,
}: {
  kind: "from" | "to";
  value: DraftPreview["from"];
  errors: DraftPreviewErrors;
  onChange: (party: DraftPreview["from"]) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-primary" />
        <h3 className="text-sm font-medium">
          {kind === "from" ? "From" : "Bill to"}
        </h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {kind === "from" ? "Your business" : "Your client"}
        </span>
      </div>
      <DraftPreviewField
        id={`${kind}.name`}
        label={kind === "from" ? "Business name" : "Client name"}
        value={value.name}
        maxLength={160}
        error={errors[`${kind}.name`]}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <DraftPreviewField
        id={`${kind}.email`}
        label="Email address"
        type="email"
        value={value.email}
        error={errors[`${kind}.email`]}
        onChange={(e) => onChange({ ...value, email: e.target.value })}
      />
      <DraftPreviewField
        id={`${kind}.address`}
        label="Address"
        multiline
        value={value.address}
        maxLength={500}
        error={errors[`${kind}.address`]}
        onChange={(e) => onChange({ ...value, address: e.target.value })}
      />
      <DraftPreviewField
        id={`${kind}.taxId`}
        label="Tax ID (optional)"
        value={value.taxId}
        maxLength={80}
        error={errors[`${kind}.taxId`]}
        placeholder="Add a tax identification number"
        onChange={(e) => onChange({ ...value, taxId: e.target.value })}
      />
    </div>
  );
}
