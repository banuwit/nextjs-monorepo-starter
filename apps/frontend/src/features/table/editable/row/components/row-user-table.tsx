"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  createContext,
  useContext,
  useId,
  useReducer,
  useState,
  type Dispatch,
  type KeyboardEvent,
} from "react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridEditableActions } from "@/components/data-grid/data-grid-editable-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
import { cn } from "@/lib/utils";
import type { User } from "@/mocks/user.mock";
import {
  getUserEditErrors,
  type EditableUserField,
  type UserDraft,
  getRowEditRows,
  rowEditReducer,
  type RowEditAction,
  type RowEditState,
} from "../../user-editing";

const fields: {
  field: EditableUserField;
  title: string;
  type?: "email" | "date";
  options?: string[];
}[] = [
  { field: "name", title: "Name" },
  { field: "email", title: "Email", type: "email" },
  { field: "gender", title: "Gender", options: ["male", "female"] },
  { field: "role", title: "Role", options: ["admin", "editor", "viewer"] },
  { field: "joinDate", title: "Join Date", type: "date" },
  {
    field: "status",
    title: "Status",
    options: ["active", "inactive", "pending"],
  },
];

const RowEditorContext = createContext<{
  state: RowEditState;
  errors: ReturnType<typeof getUserEditErrors>;
  dispatch: Dispatch<RowEditAction>;
  requestDelete: (id: string) => void;
} | null>(null);

function useRowEditor() {
  const editor = useContext(RowEditorContext);
  if (!editor) throw new Error("Row editor context is required.");
  return editor;
}

function UserRowCell({
  user,
  config,
}: {
  user: UserDraft;
  config: (typeof fields)[number];
}) {
  const { state, errors, dispatch } = useRowEditor();
  const errorId = useId();
  const { field, title, type, options } = config;
  const editing = state.editing?.draft.id === user.id;
  const original = state.rows.find((row) => row.id === user.id);
  const error = errors[user.id]?.[field];
  const changed = editing && user[field] !== original?.[field];
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
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{user.name}</span>
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
    ) : (
      <span className={options ? "capitalize" : undefined}>{user[field]}</span>
    );

  const onKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      dispatch({ type: "cancel" });
    }
    if (event.key === "Enter" && event.currentTarget.tagName !== "SELECT") {
      event.preventDefault();
      dispatch({ type: "save" });
    }
  };
  const inputProps = {
    value: user[field],
    "aria-label": `${title} for ${user.id}`,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    autoFocus: state.editing?.afterId ? field === "email" : field === "name",
    onKeyDown,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => dispatch({ type: "change", field, value: event.target.value }),
  };

  return (
    <div
      className={cn(
        "min-w-28 rounded-md",
        field === "name" && "min-w-48",
        field === "email" && "min-w-64",
        field === "joinDate" && "min-w-36",
        changed &&
          "bg-yellow-100/70 ring-1 ring-yellow-300/60 dark:bg-yellow-400/10 dark:ring-yellow-400/25",
      )}
    >
      {editing ? (
        options ? (
          <NativeSelect {...inputProps} className="w-full">
            {options.map((value) => (
              <NativeSelectOption key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        ) : (
          <Input {...inputProps} type={type ?? "text"} />
        )
      ) : (
        display
      )}
      {editing && error && (
        <p
          id={errorId}
          className="max-w-64 px-2 py-1 text-xs whitespace-normal text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function RowActions({ user }: { user: UserDraft }) {
  const { state, errors, dispatch, requestDelete } = useRowEditor();
  return (
    <DataGridEditableActions
      label={user.id}
      editing={state.editing?.draft.id === user.id}
      disabled={Boolean(state.editing)}
      saveDisabled={Boolean(Object.keys(errors[user.id] ?? {}).length)}
      onEdit={() => dispatch({ type: "edit", id: user.id })}
      onDuplicate={() => dispatch({ type: "duplicate", id: user.id })}
      onDelete={() => requestDelete(user.id)}
      onSave={() => dispatch({ type: "save" })}
      onCancel={() => dispatch({ type: "cancel" })}
    />
  );
}

const columns: ColumnDef<DataGridFeatures, UserDraft>[] = [
  {
    id: "no",
    header: () => <DataGridHeader title="No" />,
    enableSorting: false,
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
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
    cell: ({ row }) => <UserRowCell user={row.original} config={config} />,
  })),
  {
    id: "actions",
    header: () => <DataGridHeader title="Actions" />,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <RowActions user={row.original} />,
  },
];

export function RowUserTable({ users }: { users: User[] }) {
  const [state, dispatch] = useReducer(rowEditReducer, {
    rows: users,
    editing: null,
    message: "Choose Edit to change one user at a time.",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const rows = getRowEditRows(state);
  const errors = state.editing ? getUserEditErrors(rows) : {};
  const deleting = state.rows.find((row) => row.id === deleteId);

  return (
    <RowEditorContext.Provider
      value={{ state, errors, dispatch, requestDelete: setDeleteId }}
    >
      <div className="flex flex-col gap-3">
        <p role="status" className="text-sm text-muted-foreground">
          {state.message}
        </p>
        <DataGridClient
          columns={columns}
          data={rows}
          getRowId={(user) => user.id}
          pagination="none"
          showVisibilityToggle={false}
          showHeaderVisibilityToggle={false}
          defaultColumnPinning={{ start: [], end: ["actions"] }}
        />
      </div>
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {deleting?.name} ({deleting?.id}) from this local table?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleteId) dispatch({ type: "delete", id: deleteId });
                setDeleteId(null);
              }}
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RowEditorContext.Provider>
  );
}
