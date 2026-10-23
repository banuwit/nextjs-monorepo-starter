import type { User } from "@/mocks/user.mock";
import type { SectionFilters } from "../types/user-sections";

export const roleSections = [
  {
    role: "admin",
    label: "Admin",
    color:
      "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200",
  },
  {
    role: "editor",
    label: "Editor",
    color:
      "bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
  },
  {
    role: "viewer",
    label: "Viewer",
    color:
      "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
  },
] as const;

export const emptySectionFilters: SectionFilters = {
  search: "",
  gender: "all",
  status: "all",
};

/** Filter the complete dataset before partitioning, preserving order and identities. */
export function buildUserSections(users: User[], filters: SectionFilters) {
  const search = filters.search.trim().toLowerCase();
  const filtered = users.filter(
    (user) =>
      (filters.gender === "all" || user.gender === filters.gender) &&
      (filters.status === "all" || user.status === filters.status) &&
      [user.id, user.name, user.email].some((value) =>
        value.toLowerCase().includes(search),
      ),
  );
  return roleSections.map((section) => ({
    ...section,
    users: filtered.filter((user) => user.role === section.role),
  }));
}

export const sectionColumns = [
  { id: "no", label: "No", width: 56 },
  { id: "id", label: "User ID", width: 112 },
  { id: "name", label: "Name", width: 216 },
  { id: "email", label: "Email", width: 280 },
  { id: "gender", label: "Gender", width: 96 },
  { id: "role", label: "Role", width: 96 },
  { id: "joinDate", label: "Join Date", width: 128 },
  { id: "status", label: "Status", width: 104 },
] as const;
