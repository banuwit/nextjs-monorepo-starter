"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { leadFormFields, leadFormSchema, type LeadFormValues } from "../schemas/lead-form.schema";
import type { Lead, Pipeline } from "../types/leads";
import { fieldErrors, focusFirstInvalid } from "../utils/form-errors";
import { openStages } from "../utils/lead-movement";
import { leadPriorities, leadSources } from "../utils/leads";

type FieldName = keyof LeadFormValues;

type LeadFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipeline: Pipeline;
  owners: readonly string[];
  /** Present when editing; the stage is then changed only through moves. */
  lead?: Lead;
  defaultStageId?: string;
  onSubmit: (values: LeadFormValues) => void;
};

export function LeadFormDialog(props: LeadFormDialogProps) {
  const { open, onOpenChange, lead, pipeline } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{lead ? "Edit lead" : "Tambah lead"}</DialogTitle>
          <DialogDescription>
            {lead
              ? "Perbarui informasi lead. Tahap diubah lewat pergerakan pipeline."
              : `Lead baru masuk ke pipeline ${pipeline.name}.`}
          </DialogDescription>
        </DialogHeader>
        {/* Remount per open so the form starts from the selected lead. */}
        {open && <LeadForm {...props} onCancel={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function LeadForm({
  pipeline,
  owners,
  lead,
  defaultStageId,
  onSubmit,
  onCancel,
}: LeadFormDialogProps & { onCancel: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const stages = openStages(pipeline);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = leadFormSchema.safeParse(
      Object.fromEntries(leadFormFields.map((key) => [key, data.get(key) ?? ""])),
    );
    if (!result.success) {
      const next = fieldErrors<FieldName>(result.error);
      setErrors(next);
      focusFirstInvalid(formRef.current, leadFormFields, next);
      return;
    }
    onSubmit(result.data);
  }

  function field(name: FieldName, label: string, control: ReactNode) {
    return (
      <Field data-invalid={Boolean(errors[name])}>
        <FieldLabel htmlFor={`lead-${name}`}>{label}</FieldLabel>
        {control}
        {errors[name] && <FieldError id={`lead-${name}-error`}>{errors[name]}</FieldError>}
      </Field>
    );
  }

  const aria = (name: FieldName) => ({
    id: `lead-${name}`,
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `lead-${name}-error` : undefined,
  });

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-col gap-4">
      <FieldGroup className="grid max-h-[60dvh] grid-cols-1 gap-4 overflow-y-auto p-0.5 sm:grid-cols-2">
        {field("company", "Perusahaan", <Input {...aria("company")} defaultValue={lead?.company} autoComplete="organization" />)}
        {field("name", "Nama kontak", <Input {...aria("name")} defaultValue={lead?.name} autoComplete="name" />)}
        {field("email", "Email", <Input {...aria("email")} type="email" defaultValue={lead?.email} autoComplete="email" />)}
        {field("phone", "Telepon", <Input {...aria("phone")} type="tel" defaultValue={lead?.phone} placeholder="+62 812 …" autoComplete="tel" />)}
        {field(
          "value",
          "Nilai deal (Rp)",
          <Input {...aria("value")} type="number" inputMode="numeric" min={0} step={1000} defaultValue={lead?.value} />,
        )}
        {field("expectedClose", "Perkiraan closing", <Input {...aria("expectedClose")} type="date" defaultValue={lead?.expectedClose} />)}
        {field(
          "owner",
          "Penanggung jawab",
          <NativeSelect {...aria("owner")} className="w-full" defaultValue={lead?.owner ?? owners[0]}>
            {owners.map((owner) => (
              <NativeSelectOption key={owner} value={owner}>
                {owner}
              </NativeSelectOption>
            ))}
          </NativeSelect>,
        )}
        {field(
          "source",
          "Sumber",
          <NativeSelect {...aria("source")} className="w-full" defaultValue={lead?.source ?? "website"}>
            {Object.entries(leadSources).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>,
        )}
        {field(
          "priority",
          "Prioritas",
          <NativeSelect {...aria("priority")} className="w-full" defaultValue={lead?.priority ?? "medium"}>
            {Object.entries(leadPriorities).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>,
        )}
        {lead ? (
          <input type="hidden" name="stageId" value={lead.stageId} />
        ) : (
          field(
            "stageId",
            "Tahap awal",
            <NativeSelect {...aria("stageId")} className="w-full" defaultValue={defaultStageId ?? stages[0]?.id}>
              {stages.map((stage) => (
                <NativeSelectOption key={stage.id} value={stage.id}>
                  {stage.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>,
          )
        )}
      </FieldGroup>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">{lead ? "Simpan perubahan" : "Tambah lead"}</Button>
      </DialogFooter>
    </form>
  );
}
