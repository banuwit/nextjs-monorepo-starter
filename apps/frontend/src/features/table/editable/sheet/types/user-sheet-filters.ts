import type { User } from "@/mocks/user.mock";

// The sheet edits the original profile columns only.
export type UserFilterField =
  | Exclude<keyof User, "managerId" | "department" | "city">
  | "no";

export type UserCellSorting = { field: UserFilterField; desc: boolean } | null;

export type UserFilter = {
  field: UserFilterField;
  operator: "contains" | "equals" | "not" | "before" | "after";
  value: string;
};
