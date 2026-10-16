"use client";
import { useId, useState } from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { CrudInlinePanelHeader } from "./crud-inline-panel";

export type CrudRecord = { id: string; createdAt: string; updatedAt: string };
export type CrudField<T> = {
  name: keyof T & string;
  label: string;
  type?: "text" | "email" | "number" | "textarea" | "select" | "boolean";
  options?: { value: string; label: string }[];
  description?: string;
  placeholder?: string;
  required?: boolean;
};
export type CrudFormProps<T> = {
  layout?: "default" | "panel";
  heading?: string;
  record?: T;
  onSave: (record: T, original?: T) => boolean | Promise<boolean>;
  onCancel: () => void;
  onDirty?: () => void;
  error?: string;
};

export function CrudForm<T extends CrudRecord>({
  record,
  defaults,
  fields,
  schema,
  onSave,
  onCancel,
  onDirty,
  error,
  layout = "default",
  heading,
}: CrudFormProps<T> & {
  defaults: Omit<T, keyof CrudRecord>;
  fields: CrudField<T>[];
  schema: z.ZodType<T>;
}) {
  const formId = useId();
  const [original] = useState(record);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const actions = (
    <>
      <Button type="submit" disabled={pending}>
        {pending && <Spinner data-icon="inline-start" />}
        {layout === "panel" ? "Simpan" : record ? "Simpan perubahan" : "Simpan"}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={onCancel}
      >
        Batal
      </Button>
    </>
  );
  return (
    <form
      noValidate
      className={cn(
        "flex flex-col",
        layout === "panel" ? "h-full min-h-0" : "gap-6",
      )}
      onChange={onDirty}
      onSubmit={async (event) => {
        event.preventDefault();
        if (pending) return;
        const form = event.currentTarget;
        const formData = new FormData(form);
        const values = Object.fromEntries(
          fields.map((field) => [
            field.name,
            field.type === "boolean"
              ? formData.get(field.name) === "on"
              : field.type === "number"
                ? formData.get(field.name) === ""
                  ? NaN
                  : Number(formData.get(field.name))
                : String(formData.get(field.name) ?? ""),
          ]),
        );
        const now = new Date().toISOString();
        const result = schema.safeParse({
          ...defaults,
          ...original,
          ...values,
          id: original?.id ?? crypto.randomUUID(),
          createdAt: original?.createdAt ?? now,
          updatedAt: now,
        });
        if (!result.success) {
          const next = Object.fromEntries(
            result.error.issues.map((issue) => [
              String(issue.path[0]),
              issue.message,
            ]),
          );
          setErrors(next);
          const invalid = fields.find((field) => next[field.name]);
          if (invalid)
            (
              form.elements.namedItem(invalid.name) as HTMLElement | null
            )?.focus();
          return;
        }
        setErrors({});
        setSubmitError("");
        setPending(true);
        try {
          await onSave(result.data, original);
        } catch {
          setSubmitError("Gagal menyimpan perubahan. Coba lagi.");
        } finally {
          setPending(false);
        }
      }}
    >
      {layout === "panel" && (
        <CrudInlinePanelHeader title={heading ?? "Form"} actions={actions} />
      )}
      <FieldGroup
        className={cn(
          layout === "panel" &&
            "relative min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] scroll-py-4 md:p-6 [&>[data-slot=field]]:shrink-0 [&_[data-slot=input]]:min-h-11 [&_[data-slot=input]]:text-base [&_select]:min-h-11 [&_select]:text-base [&_textarea]:text-base [&_label]:min-h-6 [&_[role=switch]]:after:-inset-y-3.5 md:[&_[data-slot=input]]:min-h-8 md:[&_[data-slot=input]]:text-sm md:[&_select]:min-h-8 md:[&_select]:text-sm md:[&_textarea]:text-sm",
        )}
      >
        {fields.map((field) => {
          const id = `${formId}-${field.name}`;
          const value =
            original?.[field.name] ??
            defaults[field.name as keyof typeof defaults];
          const props = {
            id,
            name: field.name,
            disabled: pending,
            "aria-invalid": !!errors[field.name],
            "aria-describedby": errors[field.name]
              ? `${id}-error`
              : field.description
                ? `${id}-help`
                : undefined,
            required: field.required,
          };
          return (
            <Field
              key={field.name}
              data-invalid={!!errors[field.name]}
              orientation={
                layout === "panel" && field.type === "boolean"
                  ? "horizontal"
                  : "vertical"
              }
              className={cn(
                layout === "panel" &&
                  field.type === "boolean" &&
                  "relative min-h-11",
              )}
            >
              <FieldLabel htmlFor={id}>
                {field.label}
                {field.required && " *"}
              </FieldLabel>
              {field.type === "select" ? (
                <NativeSelect
                  {...props}
                  className="w-full"
                  defaultValue={String(value ?? "")}
                >
                  <NativeSelectOption value="">
                    {field.required ? "Pilih…" : "Tanpa parent"}
                  </NativeSelectOption>
                  {field.options?.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              ) : field.type === "boolean" ? (
                <Switch
                  {...props}
                  defaultChecked={Boolean(value)}
                  onCheckedChange={onDirty}
                />
              ) : field.type === "textarea" ? (
                <Textarea
                  {...props}
                  defaultValue={String(value ?? "")}
                  placeholder={field.placeholder}
                  rows={4}
                />
              ) : (
                <Input
                  {...props}
                  type={field.type ?? "text"}
                  defaultValue={String(value ?? "")}
                  placeholder={field.placeholder}
                  autoComplete={field.type === "email" ? "email" : "off"}
                />
              )}
              {field.description && (
                <FieldDescription id={`${id}-help`}>
                  {field.description}
                </FieldDescription>
              )}
              {errors[field.name] && (
                <FieldError id={`${id}-error`}>{errors[field.name]}</FieldError>
              )}
            </Field>
          );
        })}
      </FieldGroup>
      {(layout !== "panel" || error || submitError) && (
        <div
          data-slot="crud-form-actions"
          className={cn(
            "flex shrink-0 flex-wrap gap-2",
            layout === "panel" &&
              "border-t bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6",
          )}
        >
          {(error || submitError) && (
            <FieldError className="w-full" role="alert">
              {error || submitError}
            </FieldError>
          )}
          {layout !== "panel" && actions}
        </div>
      )}
    </form>
  );
}
