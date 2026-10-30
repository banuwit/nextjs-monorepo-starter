import type { User } from "@/mocks/user.mock";
import type { editableFields } from "../utils/user-editing";

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

export type RowEditState = {
  rows: User[];
  editing: { draft: UserDraft; afterId?: string } | null;
  message: string;
};

export type RowEditAction =
  | { type: "edit" | "duplicate" | "delete"; id: string }
  | { type: "change"; field: EditableUserField; value: string }
  | { type: "save" | "cancel" };
