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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  createNewRoleSchema,
  type NewRoleValues,
} from "../schemas/new-role.schema";
import type { WorkspaceRole } from "../types/access-management";

type FieldName = keyof NewRoleValues;

type NewRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: WorkspaceRole[];
  onCreate: (values: NewRoleValues) => void;
};

export function NewRoleDialog({
  open,
  onOpenChange,
  roles,
  onCreate,
}: NewRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>
            Start from an existing role, then fine-tune its permissions in the
            matrix.
          </DialogDescription>
        </DialogHeader>
        {/* Remount on every open so the form starts empty. */}
        {open && (
          <NewRoleForm
            roles={roles}
            onCreate={onCreate}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function NewRoleForm({
  roles,
  onCreate,
  onCancel,
}: Pick<NewRoleDialogProps, "roles" | "onCreate"> & { onCancel: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const schema = createNewRoleSchema(roles.map((role) => role.name));
    const result = schema.safeParse({
      name: data.get("name"),
      description: data.get("description"),
      baseRoleId: data.get("baseRoleId"),
    });

    if (!result.success) {
      const next: Partial<Record<FieldName, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as FieldName;
        next[key] ??= issue.message;
      }
      setErrors(next);
      const first = (["name", "description", "baseRoleId"] as const).find(
        (key) => next[key],
      );
      if (first)
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${first}"]`)
          ?.focus();
      return;
    }

    onCreate(result.data);
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="new-role-name">Role name</FieldLabel>
          <Input
            id="new-role-name"
            name="name"
            placeholder="e.g. Support"
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "new-role-name-error" : undefined}
          />
          {errors.name && (
            <FieldError id="new-role-name-error">{errors.name}</FieldError>
          )}
        </Field>
        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor="new-role-description">Description</FieldLabel>
          <Textarea
            id="new-role-description"
            name="description"
            rows={3}
            placeholder="What is this role responsible for?"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "new-role-description-error" : undefined
            }
          />
          {errors.description && (
            <FieldError id="new-role-description-error">
              {errors.description}
            </FieldError>
          )}
        </Field>
        <Field data-invalid={Boolean(errors.baseRoleId)}>
          <FieldLabel htmlFor="new-role-base">Copy permissions from</FieldLabel>
          <NativeSelect
            id="new-role-base"
            name="baseRoleId"
            defaultValue="member"
            className="w-full"
            aria-invalid={Boolean(errors.baseRoleId)}
          >
            {roles.map((role) => (
              <NativeSelectOption key={role.id} value={role.id}>
                {role.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {errors.baseRoleId && <FieldError>{errors.baseRoleId}</FieldError>}
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create role</Button>
      </DialogFooter>
    </form>
  );
}
