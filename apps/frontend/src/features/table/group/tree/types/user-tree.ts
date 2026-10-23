import type { User } from "@/mocks/user.mock";

export type UserTreeNode = {
  user: User;
  depth: number;
  parentId?: string;
  children: UserTreeNode[];
  directReports: number;
  totalReports: number;
  matchesFilter: boolean;
};

export type TreeFilters = {
  search: string;
  gender: User["gender"][];
  role: User["role"][];
  status: User["status"][];
};
