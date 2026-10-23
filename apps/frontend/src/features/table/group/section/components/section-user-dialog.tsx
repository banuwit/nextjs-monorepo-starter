"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  createUserCellDraft,
  getUserEditErrors,
  userEditsSchema,
  type EditableUserField,
} from "@/features/table/editable/user-editing";
import type { User } from "@/mocks/user.mock";
import { sectionColumns } from "../user-sections";

const fields: {
  field: EditableUserField;
  label: string;
  type?: "email" | "date";
  options?: string[];
}[] = [
  { field: "name", label: "Name" },
  { field: "email", label: "Email", type: "email" },
  { field: "gender", label: "Gender", options: ["male", "female"] },
  { field: "role", label: "Role", options: ["admin", "editor", "viewer"] },
  { field: "joinDate", label: "Join Date", type: "date" },
  {
    field: "status",
    label: "Status",
    options: ["active", "inactive", "pending"],
  },
];

export function SectionUserDialog({
  user,
  role,
  users,
  onCreate,
  onClose,
}: {
  user?: User;
  role?: User["role"];
  users: User[];
  onCreate: (user: User) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(() => ({
    ...createUserCellDraft(users),
    role: role ?? "viewer",
  }));
  const [submitted, setSubmitted] = useState(false);
  const candidate = [...users, draft];
  const errors = submitted
    ? (getUserEditErrors(candidate)[draft.id] ?? {})
    : {};
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "User profile" : "New user"}</DialogTitle>
          <DialogDescription>
            {user?.id ?? draft.id} · Data demo lokal, kembali ke mock saat
            reload.
          </DialogDescription>
        </DialogHeader>
        {user ? (
          <dl className="space-y-3">
            {sectionColumns
              .filter(({ id }) => id !== "no")
              .map(({ id, label }) => (
                <div
                  key={id}
                  className="grid grid-cols-[6rem_1fr] gap-3 text-sm"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="break-words">{user[id as keyof User]}</dd>
                </div>
              ))}
            <div className="grid grid-cols-[6rem_1fr] gap-3 text-sm">
              <dt className="text-muted-foreground">Manager</dt>
              <dd>
                {users.find((item) => item.id === user.managerId)?.name ??
                  "No manager"}
              </dd>
            </div>
          </dl>
        ) : (
          <form
            className="space-y-4"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
              const result = userEditsSchema.safeParse(candidate);
              if (result.success) {
                onCreate(result.data[result.data.length - 1]!);
                onClose();
              }
            }}
          >
            {fields.map(({ field, label, type, options }) => (
              <label
                key={field}
                className="flex flex-col gap-1.5 text-sm font-medium"
              >
                {label}
                {options ? (
                  <NativeSelect
                    className="w-full"
                    aria-label={label}
                    value={draft[field]}
                    aria-invalid={Boolean(errors[field])}
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
                    aria-label={label}
                    value={draft[field]}
                    type={type ?? "text"}
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
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create user</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
