"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { User } from "@/mocks/user.mock";
import {
  getUserEditErrors,
  userEditsSchema,
  type EditableUserField,
  type UserDraft,
} from "../../user-editing";

export type CellUserEditor = {
  mode: "duplicate" | "details";
  draft: UserDraft;
};
export function CellUserForm({
  editor,
  rows,
  onSave,
  onClose,
  fields,
}: {
  editor: CellUserEditor;
  rows: User[];
  onSave: (rows: User[]) => void;
  onClose: () => void;
  fields: readonly {
    field: EditableUserField;
    title: string;
    type?: "email" | "date";
    options?: string[];
  }[];
}) {
  const [draft, setDraft] = useState(editor.draft);
  const [submitted, setSubmitted] = useState(false);
  const candidate =
    editor.mode === "details"
      ? rows.map((row) => (row.id === draft.id ? draft : row))
      : [...rows, draft];
  const errors = submitted
    ? (getUserEditErrors(candidate)[draft.id] ?? {})
    : {};
  const title = editor.mode === "details" ? "User details" : "Duplicate user";
  const description = `${draft.id} · Changes stay in this local table and can be undone.`;
  const form = (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        const result = userEditsSchema.safeParse(candidate);
        if (result.success) {
          onSave(result.data);
          onClose();
        }
      }}
    >
      {fields.map(({ field, title, type, options }) => (
        <label
          key={field}
          className="flex flex-col gap-1.5 text-sm font-medium"
        >
          {title}
          {options ? (
            <NativeSelect
              className="w-full"
              aria-label={title}
              value={draft[field]}
              onChange={(event) =>
                setDraft({ ...draft, [field]: event.target.value })
              }
            >
              {options.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {value[0]!.toUpperCase() + value.slice(1)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          ) : (
            <Input
              aria-label={title}
              type={type ?? "text"}
              value={draft[field]}
              aria-invalid={Boolean(errors[field])}
              onChange={(event) =>
                setDraft({ ...draft, [field]: event.target.value })
              }
            />
          )}
          {errors[field] && (
            <span role="alert" className="text-xs text-destructive">
              {errors[field]}
            </span>
          )}
        </label>
      ))}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {editor.mode === "details" ? "Save user" : "Create user"}
        </Button>
      </div>
    </form>
  );
  return editor.mode === "details" ? (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">{form}</div>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}

export function CellUserDelete({
  user,
  onDelete,
  onClose,
}: {
  user?: User;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <AlertDialog
      open={Boolean(user)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            Delete {user?.name} ({user?.id}) from this table? You can restore
            the row with Undo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              if (user) onDelete(user.id);
              onClose();
            }}
          >
            Delete user
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
