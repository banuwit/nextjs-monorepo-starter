import type { User } from "@/mocks/user.mock";

export const SCROLL_BATCH_SIZE = 25;
export const SCROLL_USER_COUNT = 10_000;
export type ScrollFilters = {
  search: string;
  gender: User["gender"] | "all";
  role: User["role"] | "all";
  status: User["status"] | "all";
};
export const emptyScrollFilters: ScrollFilters = {
  search: "",
  gender: "all",
  role: "all",
  status: "all",
};

export function filterScrollUsers(users: User[], filters: ScrollFilters) {
  const search = filters.search.trim().toLowerCase();
  return users.filter(
    (user) =>
      [user.id, user.name, user.email].some((value) =>
        value.toLowerCase().includes(search),
      ) &&
      (filters.gender === "all" || user.gender === filters.gender) &&
      (filters.role === "all" || user.role === filters.role) &&
      (filters.status === "all" || user.status === filters.status),
  );
}

export function nextLoadedCount(loaded: number, total: number) {
  return Math.min(loaded + SCROLL_BATCH_SIZE, total);
}
