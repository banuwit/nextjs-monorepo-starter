import type { SelectOption } from "@/components/filter/types";
import type { User } from "@/mocks/user.mock";

/** Users who supervise at least one other user, as combobox options. */
export function getManagerOptions(users: User[]): SelectOption[] {
  const managerIds = new Set(users.map((user) => user.managerId));

  return users
    .filter((user) => managerIds.has(user.id))
    .map((user) => ({
      label: user.name,
      value: user.id,
      description: `${user.id} · ${user.email}`,
      keywords: [user.email],
    }));
}
