"use client";

import { useRef, useState, type FormEvent } from "react";
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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { lostReasonSchema, type LostReasonValues } from "../schemas/lost-reason.schema";
import { fieldErrors, focusFirstInvalid } from "../utils/form-errors";

type FieldName = keyof LostReasonValues;

export function LostReasonDialog({
  open,
  onOpenChange,
  leadLabel,
  stageName,
  reasons,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadLabel: string;
  stageName: string;
  reasons: readonly string[];
  onConfirm: (values: LostReasonValues) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = lostReasonSchema.safeParse({
      reason: data.get("reason") ?? "",
      note: data.get("note") ?? "",
    });
    if (!result.success) {
      const next = fieldErrors<FieldName>(result.error);
      setErrors(next);
      focusFirstInvalid(formRef.current, ["reason", "note"] as const, next);
      return;
    }
    setErrors({});
    onConfirm(result.data);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setErrors({});
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pindahkan ke {stageName}?</DialogTitle>
          <DialogDescription>
            Catat alasan “{leadLabel}” kalah agar tim bisa mempelajari polanya.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={Boolean(errors.reason)}>
              <FieldLabel htmlFor="lost-reason">Alasan</FieldLabel>
              <NativeSelect
                id="lost-reason"
                name="reason"
                className="w-full"
                defaultValue=""
                aria-invalid={Boolean(errors.reason)}
              >
                <NativeSelectOption value="" disabled>
                  Pilih alasan…
                </NativeSelectOption>
                {reasons.map((reason) => (
                  <NativeSelectOption key={reason} value={reason}>
                    {reason}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {errors.reason && <FieldError>{errors.reason}</FieldError>}
            </Field>
            <Field data-invalid={Boolean(errors.note)}>
              <FieldLabel htmlFor="lost-note">Catatan (opsional)</FieldLabel>
              <Textarea id="lost-note" name="note" rows={3} aria-invalid={Boolean(errors.note)} />
              {errors.note && <FieldError>{errors.note}</FieldError>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" variant="destructive">
              Pindahkan ke {stageName}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
