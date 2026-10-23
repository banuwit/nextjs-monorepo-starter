import type { User } from "@/mocks/user.mock";

/** Resolve against the whole dataset, so parent filters do not hide team members. */
export function getDirectReports(users: User[], managerId: string) {
  return users.filter((user) => user.managerId === managerId);
}
