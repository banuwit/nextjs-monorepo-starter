import { z } from "zod";

import type {
  DataGridFilters,
  DataGridPageMeta,
} from "@/components/data-grid/types";

const genders = ["male", "female"] as const;
const roles = ["admin", "editor", "viewer"] as const;
const statuses = ["active", "inactive", "pending"] as const;
const sortColumns = [
  "id",
  "name",
  "email",
  "gender",
  "role",
  "joinDate",
  "status",
] as const;

export type User = {
  id: string;
  name: string;
  email: string;
  gender: (typeof genders)[number];
  role: (typeof roles)[number];
  joinDate: string;
  status: (typeof statuses)[number];
};

const names = [
  "Andi Pratama",
  "Siti Rahma",
  "Budi Santoso",
  "Dewi Lestari",
  "Rizky Maulana",
  "Nadia Putri",
  "Fajar Nugroho",
  "Ayu Wulandari",
  "Dimas Saputra",
  "Rina Kartika",
  "Arif Hidayat",
  "Maya Permata",
  "Reza Firmansyah",
  "Intan Safitri",
  "Bayu Wijaya",
  "Putri Amelia",
  "Agus Setiawan",
  "Lina Marlina",
  "Yoga Kurniawan",
  "Dian Puspita",
  "Rian Hakim",
  "Nisa Aulia",
  "Eko Susanto",
  "Tika Maharani",
  "Ilham Ramadhan",
  "Ratna Sari",
  "Aditya Gunawan",
  "Wulan Anggraini",
  "Hendra Saputra",
  "Fitri Handayani",
  "Galih Prakoso",
  "Citra Dewanti",
  "Kevin Hartono",
  "Laras Paramita",
  "Surya Darmawan",
  "Anisa Zahra",
];

export const users: User[] = names.map((name, index) => ({
  id: `USR-${String(index + 1).padStart(3, "0")}`,
  name,
  email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
  gender: index % 2 === 0 ? "male" : "female",
  role: roles[index % roles.length] ?? "viewer",
  joinDate: new Date(Date.UTC(2024 + (index % 3), index % 12, (index % 28) + 1))
    .toISOString()
    .slice(0, 10),
  status: statuses[Math.floor(index / 3) % statuses.length] ?? "active",
}));

export type UserListResult = {
  data: User[];
  meta: DataGridPageMeta;
  filters: DataGridFilters;
};

// Demo source: replace this query with the users API when backend integration is added.
export function getMockUsers(
  params: Record<string, string | string[] | undefined>,
): UserListResult {
  const query = z
    .object({
      search: z.string().trim().max(200).catch(""),
      page: z.coerce
        .number()
        .int()
        .positive()
        .max(Number.MAX_SAFE_INTEGER)
        .catch(1),
      pageSize: z.coerce
        .number()
        .pipe(z.union([z.literal(20), z.literal(50), z.literal(100)]))
        .catch(20),
      sortBy: z.enum(sortColumns).catch("id"),
      sortOrder: z.enum(["asc", "desc"]).catch("asc"),
    })
    .parse(params);

  const filters: DataGridFilters = {
    search: query.search || undefined,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    pageSize: String(query.pageSize),
  };

  for (const [key, options] of Object.entries({
    gender: genders,
    role: roles,
    status: statuses,
  })) {
    const value = params[key];
    const selected = (
      Array.isArray(value) ? value : value ? [value] : []
    ).filter((item) => (options as readonly string[]).includes(item));
    if (selected.length) filters[key] = [...new Set(selected)];
  }

  const search = query.search.toLowerCase();
  const matching = users
    .filter(
      (user) =>
        [user.id, user.name, user.email].some((value) =>
          value.toLowerCase().includes(search),
        ) &&
        (["gender", "role", "status"] as const).every((key) => {
          const selected = filters[key];
          return !selected || selected.includes(user[key]);
        }),
    )
    .sort((left, right) => {
      const comparison = left[query.sortBy].localeCompare(
        right[query.sortBy],
        "en",
      );
      return (
        (query.sortOrder === "desc" ? -comparison : comparison) ||
        left.id.localeCompare(right.id)
      );
    });

  const total = matching.length;
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);
  const offset = (page - 1) * query.pageSize;

  return {
    data: matching.slice(offset, offset + query.pageSize),
    meta: { page, pageSize: query.pageSize, total, totalPages },
    filters: { ...filters, page: String(page) },
  };
}
