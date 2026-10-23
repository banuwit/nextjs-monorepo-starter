import type { User } from "@/mocks/user.mock";

export const SCROLL_BATCH_SIZE = 25;
export const SCROLL_USER_COUNT = 10_000;
export function filterScrollUsers(users: User[], query: string) {
  const search = query.trim().toLowerCase();
  return users.filter((user) =>
    [user.id, user.name, user.email].some((value) =>
      value.toLowerCase().includes(search),
    ),
  );
}

export function nextLoadedCount(loaded: number, total: number) {
  return Math.min(loaded + SCROLL_BATCH_SIZE, total);
}
