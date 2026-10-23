"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Check, RotateCcw, Save } from "lucide-react";
import { createContext, useContext, useState } from "react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import { DataGridEditableCell } from "@/components/data-grid/data-grid-editable-cell";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  getChangedUserCount,
  getUserEditErrors,
  updateUserDraft,
} from "../../utils/user-editing";
import { userEditsSchema } from "../../schemas/user-editing.schema";
import type { EditableUserField, UserDraft } from "../../types/user-editing";

const options = (values: string[]) =>
  values.map((value) => ({
    value,
    label: value[0]!.toUpperCase() + value.slice(1),
  }));
const fields: {
  field: EditableUserField;
  title: string;
  type?: "text" | "email" | "date";
  options?: { value: string; label: string }[];
}[] = [
  { field: "name", title: "Name" },
  { field: "email", title: "Email", type: "email" },
  { field: "gender", title: "Gender", options: options(["male", "female"]) },
  {
    field: "role",
    title: "Role",
    options: options(["admin", "editor", "viewer"]),
  },
  { field: "joinDate", title: "Join Date", type: "date" },
  {
    field: "status",
    title: "Status",
    options: options(["active", "inactive", "pending"]),
  },
];

const EditContext = createContext<{
  saved: User[];
  errors: ReturnType<typeof getUserEditErrors>;
  revision: number;
  update: (id: string, field: EditableUserField, value: string) => void;
} | null>(null);

function UserCell({
  user,
  config,
}: {
  user: UserDraft;
  config: (typeof fields)[number];
}) {
  const editing = useContext(EditContext);
  if (!editing) throw new Error("UserCell requires EditContext.");
  const { field, title, type, options: choices } = config;
  const saved = editing.saved.find((row) => row.id === user.id);
  const display =
    field === "name" ? (
      <span className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback>
            {user.name
              .split(" ")
              .filter(Boolean)
              .map((part) => part[0])
              .slice(0, 2)
              .join("") || "?"}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{user.name || "—"}</span>
      </span>
    ) : field === "status" || field === "role" ? (
      <Badge
        className="capitalize"
        variant={
          field === "status" && user.status === "active" ? "default" : "outline"
        }
      >
        {user[field]}
      </Badge>
    ) : choices ? (
      choices.find((choice) => choice.value === user[field])?.label
    ) : (
      user[field]
    );

  return (
    <DataGridEditableCell
      key={editing.revision}
      label={`${title} for ${user.id}`}
      value={user[field]}
      type={type}
      options={choices}
      dirty={user[field] !== saved?.[field]}
      error={editing.errors[user.id]?.[field]}
      onChange={(value) => editing.update(user.id, field, value)}
    >
      {display}
    </DataGridEditableCell>
  );
}

// Keep render functions stable so typing does not remount the active editor.
const columns: ColumnDef<DataGridFeatures, UserDraft>[] = [
  {
    id: "no",
    header: () => <DataGridHeader title="No" />,
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: () => <DataGridHeader title="User ID" />,
    enableSorting: false,
  },
  ...fields.map((config): ColumnDef<DataGridFeatures, UserDraft> => ({
    accessorKey: config.field,
    header: () => <DataGridHeader title={config.title} />,
    enableSorting: false,
    cell: ({ row }) => <UserCell user={row.original} config={config} />,
  })),
];

export function InlineUserTable({ users }: { users: User[] }) {
  const [saved, setSaved] = useState(users);
  const [drafts, setDrafts] = useState<UserDraft[]>(users);
  const [revision, setRevision] = useState(0);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [message, setMessage] = useState("No unsaved changes.");
  const changed = getChangedUserCount(drafts, saved);
  const errors = getUserEditErrors(drafts);
  const errorCount = Object.values(errors).reduce(
    (count, row) => count + Object.keys(row).length,
    0,
  );

  function save() {
    const result = userEditsSchema.safeParse(drafts);
    if (!result.success) return;
    setSaved(result.data);
    setDrafts(result.data);
    setRevision((value) => value + 1);
    setMessage("Changes saved locally. Reload restores the sample data.");
  }

  return (
    <EditContext.Provider
      value={{
        saved,
        errors,
        revision,
        update: (id, field, value) => {
          setDrafts((current) => updateUserDraft(current, id, field, value));
          setMessage("No unsaved changes.");
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3 shadow-sm">
          <div role="status" className="flex items-center gap-2 text-sm">
            {changed ? (
              <Badge variant="secondary">{changed} changed</Badge>
            ) : (
              <Check className="size-4 text-muted-foreground" />
            )}
            <span>
              {changed
                ? `${changed} user${changed > 1 ? "s" : ""} with unsaved changes.`
                : message}
            </span>
            {errorCount > 0 && (
              <span className="text-destructive">
                {errorCount} invalid field{errorCount > 1 ? "s" : ""}.
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!changed}
              onClick={() => setConfirmDiscard(true)}
            >
              <RotateCcw data-icon="inline-start" />
              Discard
            </Button>
            <Button
              size="sm"
              disabled={!changed || errorCount > 0}
              onClick={save}
            >
              <Save data-icon="inline-start" />
              Save changes
            </Button>
          </div>
        </div>
        <DataGridClient
          columns={columns}
          data={drafts}
          getRowId={(user) => user.id}
          pagination="none"
          showVisibilityToggle={false}
          showHeaderVisibilityToggle={false}
        />
      </div>
      <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Changes to {changed} user{changed > 1 ? "s" : ""} will be reverted
              to the last locally saved values.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setDrafts(saved);
                setRevision((value) => value + 1);
                setMessage("Unsaved changes discarded.");
                setConfirmDiscard(false);
              }}
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EditContext.Provider>
  );
}
