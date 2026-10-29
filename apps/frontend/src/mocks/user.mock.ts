import { z } from "zod";

import type {
  DataGridFilters,
  DataGridPageMeta,
} from "@/components/data-grid/types";

const genders = ["male", "female"] as const;
const roles = ["admin", "editor", "viewer"] as const;
const statuses = ["active", "inactive", "pending"] as const;
export const departments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Operations",
] as const;
export const cities = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Makassar",
  "Denpasar",
  "Balikpapan",
  "Palembang",
] as const;
const emailDomains = ["example.com", "acme.co.id", "nusantara.id"] as const;

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
  /** Always set in the fixture; optional so editable demos can omit it. */
  department?: (typeof departments)[number];
  city?: (typeof cities)[number];
  /** Direct supervisor; absent for users at the top of the demo organization. */
  managerId?: string;
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
  email: `${name.toLowerCase().replaceAll(" ", ".")}@${emailDomains[index % emailDomains.length]}`,
  gender: index % 2 === 0 ? "male" : "female",
  role: roles[index % roles.length] ?? "viewer",
  joinDate: new Date(Date.UTC(2024 + (index % 3), index % 12, (index % 28) + 1))
    .toISOString()
    .slice(0, 10),
  status: statuses[Math.floor(index / 3) % statuses.length] ?? "active",
  // Co-prime strides so department, city, and role do not move in lockstep.
  department: departments[(index * 3) % departments.length] ?? "Engineering",
  city: cities[(index * 7) % cities.length] ?? "Jakarta",
  // Roots 001–005; 006 reports to 001; 007–026 to 002–006; 027–036 to 007–011.
  managerId:
    index < 5
      ? undefined
      : index === 5
        ? "USR-001"
        : index < 26
          ? `USR-${String(2 + ((index - 6) % 5)).padStart(3, "0")}`
          : `USR-${String(7 + ((index - 26) % 5)).padStart(3, "0")}`,
}));

export type UserListResult = {
  data: User[];
  meta: DataGridPageMeta;
  filters: DataGridFilters;
};

/** Larger deterministic fixture for scrolling demos; the original directory remains the seed. */
export function createMockUsers(count: number): User[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = users[index % users.length]!;
    const batch = Math.floor(index / users.length);
    if (batch === 0) return { ...seed };
    const number = index + 1;
    return {
      ...seed,
      id: `USR-${String(number).padStart(3, "0")}`,
      name: `${seed.name} ${batch + 1}`,
      email: seed.email.replace("@", `.${number}@`),
      managerId: seed.managerId
        ? `USR-${String(Number(seed.managerId.slice(4)) + batch * users.length).padStart(3, "0")}`
        : undefined,
    };
  });
}

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
    department: departments,
    city: cities,
  })) {
    const value = params[key];
    const selected = (
      Array.isArray(value) ? value : value ? [value] : []
    ).filter((item) => (options as readonly string[]).includes(item));
    if (selected.length) filters[key] = [...new Set(selected)];
  }

  // Single join month (`YYYY-MM`, scrollable select demo).
  const joinMonth = Array.isArray(params.joinMonth)
    ? params.joinMonth[0]
    : params.joinMonth;
  if (joinMonth && /^\d{4}-\d{2}$/.test(joinMonth)) {
    filters.joinMonth = joinMonth;
  }

  // Single supervisor filter (combobox demo); only ids that manage someone count.
  const manager = Array.isArray(params.manager)
    ? params.manager[0]
    : params.manager;
  if (manager && users.some((user) => user.managerId === manager)) {
    filters.manager = manager;
  }

  const search = query.search.toLowerCase();
  const matching = users
    .filter(
      (user) =>
        [user.id, user.name, user.email].some((value) =>
          value.toLowerCase().includes(search),
        ) &&
        (["gender", "role", "status", "department", "city"] as const).every(
          (key) => {
            const selected = filters[key];
            return !selected || selected.includes(user[key] ?? "");
          },
        ) &&
        (!filters.manager || user.managerId === filters.manager) &&
        (!filters.joinMonth ||
          user.joinDate.startsWith(String(filters.joinMonth))),
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
