import type { User } from "@/mocks/user.mock";

export type UserFilterField = Exclude<keyof User, "managerId"> | "no";

export type UserCellSorting = { field: UserFilterField; desc: boolean } | null;

export type UserFilter = {
  field: UserFilterField;
  operator: "contains" | "equals" | "not" | "before" | "after";
  value: string;
};
