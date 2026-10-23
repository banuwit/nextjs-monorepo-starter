import { z } from "zod";
import type { User } from "@/mocks/user.mock";

export const editableFields = [
  "name",
  "email",
  "gender",
  "role",
  "joinDate",
  "status",
] as const;
export type EditableUserField = (typeof editableFields)[number];
export type UserDraft = { [Key in keyof User]: string };

export type UserCellChange = {
  id: string;
  field: EditableUserField;
  value: string;
};
export type UserCellHistory = {
  rows: User[];
  past: User[][];
  future: User[][];
};

/** Validate the entire transaction so paste/fill never partially saves a range. */
export function applyUserCellChanges(
  rows: User[],
  changes: UserCellChange[],
): { rows: User[]; error?: string } {
  const drafts = rows.map((row) => ({ ...row }));
  for (const change of changes) {
    const row = drafts.find((item) => item.id === change.id);
    if (!row || !editableFields.includes(change.field))
      return { rows, error: "This cell is read-only or no longer exists." };
    Object.assign(row, { [change.field]: change.value });
  }
  const result = userEditsSchema.safeParse(drafts);
  if (!result.success) {
    const issue = result.error.issues[0]!;
    const id = rows[Number(issue.path[0])]?.id ?? "User";
    return { rows, error: `${id}: ${issue.message}` };
  }
  const changed = rows.some((row, index) =>
    editableFields.some((field) => row[field] !== result.data[index]![field]),
  );
  return { rows: changed ? result.data : rows };
}

export function userCellHistoryReducer(
  state: UserCellHistory,
  action:
    | { type: "apply"; changes: UserCellChange[] }
    | { type: "replace"; rows: User[] }
    | { type: "undo" | "redo" },
): UserCellHistory {
  if (action.type === "undo") {
    const rows = state.past.at(-1);
    return rows
      ? {
          rows,
          past: state.past.slice(0, -1),
          future: [state.rows, ...state.future],
        }
      : state;
  }
  if (action.type === "redo") {
    const rows = state.future[0];
    return rows
      ? {
          rows,
          past: [...state.past, state.rows],
          future: state.future.slice(1),
        }
      : state;
  }
  if (action.type === "apply") {
    const result = applyUserCellChanges(state.rows, action.changes);
    if (result.rows === state.rows) return state;
    return {
      rows: result.rows,
      past: [...state.past.slice(-99), state.rows],
      future: [],
    };
  }
  if (action.type === "replace") {
    const result = userEditsSchema.safeParse(action.rows);
    if (
      !result.success ||
      new Set(action.rows.map((row) => row.id)).size !== action.rows.length ||
      JSON.stringify(state.rows) === JSON.stringify(result.data)
    )
      return state;
    return {
      rows: result.data,
      past: [...state.past.slice(-99), state.rows],
      future: [],
    };
  }
  return state;
}

export function createUserCellDraft(rows: User[], source?: User): UserDraft {
  const next =
    Math.max(
      0,
      ...rows.map((row) => Number(row.id.match(/^USR-(\d+)$/)?.[1] ?? 0)),
    ) + 1;
  return {
    id: `USR-${String(next).padStart(3, "0")}`,
    name: source ? `${source.name} (copy)` : "",
    email: "",
    gender: source?.gender ?? "male",
    role: source?.role ?? "viewer",
    joinDate: source?.joinDate ?? new Date().toISOString().slice(0, 10),
    status: source?.status ?? "pending",
  };
}

export const userEditSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Use at most 100 characters."),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email("Enter a valid email address.")),
  gender: z.enum(["male", "female"]),
  role: z.enum(["admin", "editor", "viewer"]),
  joinDate: z.iso.date("Enter a valid date."),
  status: z.enum(["active", "inactive", "pending"]),
});

export const userEditsSchema = z
  .array(userEditSchema)
  .superRefine((rows, context) => {
    const emails = new Map<string, number>();
    rows.forEach((row, index) => {
      const email = row.email.toLowerCase();
      const previous = emails.get(email);
      if (previous !== undefined) {
        for (const rowIndex of [previous, index]) {
          context.addIssue({
            code: "custom",
            path: [rowIndex, "email"],
            message: "Email is already used by another user.",
          });
        }
      }
      emails.set(email, index);
    });
  });

export function updateUserDraft(
  rows: UserDraft[],
  id: string,
  field: EditableUserField,
  value: string,
): UserDraft[] {
  if (!editableFields.includes(field)) return rows;
  return rows.map((row) => (row.id === id ? { ...row, [field]: value } : row));
}

export function getChangedUserCount(rows: UserDraft[], saved: User[]): number {
  const baseline = new Map(saved.map((row) => [row.id, row]));
  return rows.filter((row) =>
    editableFields.some(
      (field) => row[field] !== baseline.get(row.id)?.[field],
    ),
  ).length;
}

export function getUserEditErrors(
  rows: UserDraft[],
): Record<string, Partial<Record<EditableUserField, string>>> {
  const result = userEditsSchema.safeParse(rows);
  const errors: Record<string, Partial<Record<EditableUserField, string>>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const row = rows[Number(issue.path[0])];
      const field = issue.path[1] as EditableUserField;
      if (row && editableFields.includes(field)) {
        (errors[row.id] ??= {})[field] = issue.message;
      }
    }
  }
  return errors;
}

export type RowEditState = {
  rows: User[];
  editing: { draft: UserDraft; afterId?: string } | null;
  message: string;
};

export type RowEditAction =
  | { type: "edit" | "duplicate" | "delete"; id: string }
  | { type: "change"; field: EditableUserField; value: string }
  | { type: "save" | "cancel" };

export function getRowEditRows(state: RowEditState): UserDraft[] {
  const edit = state.editing;
  if (!edit) return state.rows;
  if (!edit.afterId)
    return state.rows.map((row) =>
      row.id === edit.draft.id ? edit.draft : row,
    );
  const rows: UserDraft[] = [...state.rows];
  rows.splice(
    rows.findIndex((row) => row.id === edit.afterId) + 1,
    0,
    edit.draft,
  );
  return rows;
}

export function rowEditReducer(
  state: RowEditState,
  action: RowEditAction,
): RowEditState {
  switch (action.type) {
    case "edit":
    case "duplicate": {
      if (state.editing) return state;
      const user = state.rows.find((row) => row.id === action.id);
      if (!user) return state;
      if (action.type === "edit")
        return {
          ...state,
          editing: { draft: { ...user } },
          message: `Editing ${user.id}. Save or cancel to unlock the other rows.`,
        };
      const next =
        Math.max(
          0,
          ...state.rows.map((row) =>
            Number(row.id.match(/^USR-(\d+)$/)?.[1] ?? 0),
          ),
        ) + 1;
      const id = `USR-${String(next).padStart(3, "0")}`;
      return {
        ...state,
        editing: {
          afterId: user.id,
          draft: { ...user, id, name: `${user.name} (copy)`, email: "" },
        },
        message: `Duplicating ${user.id}. Enter a unique email, then save ${id}.`,
      };
    }
    case "change":
      if (!state.editing || !editableFields.includes(action.field))
        return state;
      return {
        ...state,
        editing: {
          ...state.editing,
          draft: { ...state.editing.draft, [action.field]: action.value },
        },
      };
    case "save": {
      if (!state.editing) return state;
      const result = userEditsSchema.safeParse(getRowEditRows(state));
      if (!result.success) return state;
      return {
        rows: result.data,
        editing: null,
        message: `${state.editing.draft.id} saved locally.`,
      };
    }
    case "cancel":
      return state.editing
        ? { ...state, editing: null, message: "Row changes cancelled." }
        : state;
    case "delete":
      if (state.editing || !state.rows.some((row) => row.id === action.id))
        return state;
      return {
        ...state,
        rows: state.rows.filter((row) => row.id !== action.id),
        message: `${action.id} deleted locally.`,
      };
  }
}
