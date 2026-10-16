import { z } from "zod";

const text = z
  .string()
  .trim()
  .min(1, "Wajib diisi.")
  .max(255, "Maksimal 255 karakter.");
const base = {
  id: text,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
};
const code = text.toUpperCase();
export const crudSchemas = {
  users: z.object({
    ...base,
    name: text,
    email: z.email("Email tidak valid.").trim().toLowerCase(),
    role: z.enum(["admin", "editor", "viewer"]),
    status: z.enum(["active", "inactive"]),
  }),
  countries: z.object({
    ...base,
    code: code.max(3, "Maksimal 3 karakter."),
    name: text,
  }),
  provinces: z.object({ ...base, countryId: text, code, name: text }),
  cities: z.object({
    ...base,
    provinceId: text,
    code: z.string().trim().toUpperCase().max(20),
    name: text,
  }),
  menus: z.object({
    ...base,
    title: text,
    path: z
      .string()
      .trim()
      .max(255)
      .refine(
        (value) => /^\/(?!\/)/.test(value) && !/[\\\s]/.test(value),
        "Gunakan path internal, misalnya /users.",
      ),
    icon: z.enum(["Users", "Globe", "Map", "Building", "Menu", "Settings"]),
    parentId: z.string(),
    sortOrder: z.number().int().min(0),
    isActive: z.boolean(),
    role: z.enum(["all", "admin", "editor", "viewer"]),
  }),
  parameters: z
    .object({
      ...base,
      key: text.regex(
        /^[a-zA-Z][a-zA-Z0-9_.-]*$/,
        "Gunakan huruf, angka, titik, _ atau -.",
      ),
      value: z.string().max(4000),
      description: z.string().trim().max(500),
      type: z.enum(["string", "number", "boolean", "json"]),
      isActive: z.boolean(),
    })
    .superRefine((item, context) => {
      let valid = true;
      if (item.type === "number")
        valid = item.value.trim() !== "" && Number.isFinite(Number(item.value));
      if (item.type === "boolean")
        valid = ["true", "false"].includes(item.value);
      if (item.type === "json") {
        try {
          JSON.parse(item.value);
        } catch {
          valid = false;
        }
      }
      if (!valid)
        context.addIssue({
          code: "custom",
          path: ["value"],
          message: `Nilai harus berupa ${item.type} yang valid.`,
        });
    }),
};

const databaseSchema = z.object({
  users: z.array(crudSchemas.users),
  countries: z.array(crudSchemas.countries),
  provinces: z.array(crudSchemas.provinces),
  cities: z.array(crudSchemas.cities),
  menus: z.array(crudSchemas.menus),
  parameters: z.array(crudSchemas.parameters),
});
export type CrudDatabase = z.infer<typeof databaseSchema>;
export type ResourceName = keyof CrudDatabase;
export type MockEntity<K extends ResourceName> = CrudDatabase[K][number];
export const crudStorageKey = "workspace-crud-v1";
export const currentMockUserId = "user-banu";
export function getMockMenuItems(menus: CrudDatabase["menus"], role: string) {
  const items: { title: string; url: string }[] = [];
  const visited = new Set<string>();
  function visit(parentId: string, prefix = "") {
    const siblings = menus.filter(
      (menu) =>
        menu.parentId === parentId &&
        menu.isActive &&
        (menu.role === "all" || menu.role === role),
    );
    siblings.sort(
      (a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title),
    );
    for (const menu of siblings) {
      if (visited.has(menu.id)) continue;
      visited.add(menu.id);
      const title = prefix + menu.title;
      items.push({ title, url: menu.path });
      visit(menu.id, `${title} / `);
    }
  }
  visit("");
  return items;
}
export type CrudChange = { resource: ResourceName } & (
  | {
      type: "save";
      record: unknown;
      isNew: boolean;
      expectedUpdatedAt?: string;
    }
  | { type: "delete"; id: string }
);

function validateRelations(data: CrudDatabase) {
  function unique(values: string[]) {
    if (new Set(values).size !== values.length)
      throw new Error(
        "Kode, email, atau key sudah digunakan. Gunakan nilai lain.",
      );
  }
  for (const rows of Object.values(data)) unique(rows.map((row) => row.id));
  unique(data.users.map((row) => row.email));
  unique(data.countries.map((row) => row.code));
  unique(data.provinces.map((row) => `${row.countryId}:${row.code}`));
  unique(data.parameters.map((row) => row.key));
  if (
    data.provinces.some(
      (row) => !data.countries.some((parent) => parent.id === row.countryId),
    )
  )
    throw new Error(
      "Country tidak ditemukan atau masih digunakan oleh province.",
    );
  if (
    data.cities.some(
      (row) => !data.provinces.some((parent) => parent.id === row.provinceId),
    )
  )
    throw new Error("Province tidak ditemukan atau masih digunakan oleh city.");
  const menus = new Map(data.menus.map((menu) => [menu.id, menu]));
  for (const menu of data.menus) {
    const visited = new Set([menu.id]);
    let parent = menu.parentId;
    while (parent) {
      if (visited.has(parent))
        throw new Error("Parent menu membentuk siklus hierarki.");
      visited.add(parent);
      const entry = menus.get(parent);
      if (!entry)
        throw new Error("Parent menu tidak ditemukan atau masih digunakan.");
      parent = entry.parentId;
    }
  }
}

export function parseCrudStorage(raw: string): CrudDatabase {
  const parsed = z
    .object({ version: z.literal(1), data: databaseSchema })
    .parse(JSON.parse(raw));
  validateRelations(parsed.data);
  return parsed.data;
}

export function applyCrudChange(
  data: CrudDatabase,
  change: CrudChange,
  currentUserId?: string,
): CrudDatabase {
  const rows = data[change.resource];
  const record =
    change.type === "save"
      ? crudSchemas[change.resource].parse(change.record)
      : null;
  const id = record ? record.id : change.type === "delete" ? change.id : "";
  const existing = rows.find((row) => row.id === id);
  if (
    change.type === "save" &&
    existing &&
    change.expectedUpdatedAt &&
    existing.updatedAt !== change.expectedUpdatedAt
  ) {
    throw new Error(
      "Data sudah berubah di tab lain. Isian Anda tetap ada; buka ulang data terbaru sebelum menyimpan.",
    );
  }
  if (!(change.type === "save" && change.isNew) && !existing)
    throw new Error("Data tidak ditemukan. Muat ulang daftar.");
  if (change.type === "save" && change.isNew && existing)
    throw new Error("ID sudah digunakan.");
  if (change.resource === "users" && existing) {
    const previous = data.users.find((user) => user.id === id)!;
    const nextUser = record ? crudSchemas.users.parse(record) : null;
    const destructive =
      !nextUser ||
      nextUser.status !== previous.status ||
      nextUser.role !== previous.role;
    if (id === currentUserId && destructive)
      throw new Error(
        "Akun sendiri tidak dapat dihapus, dinonaktifkan, atau diubah perannya.",
      );
    if (
      previous.role === "admin" &&
      previous.status === "active" &&
      (!nextUser ||
        nextUser.role !== "admin" ||
        nextUser.status !== "active") &&
      data.users.filter(
        (user) => user.role === "admin" && user.status === "active",
      ).length === 1
    )
      throw new Error(
        "Tidak dapat mengubah atau menghapus admin aktif terakhir.",
      );
  }
  const nextRows = record
    ? change.type === "save" && change.isNew
      ? [...rows, record]
      : rows.map((row) => (row.id === id ? record : row))
    : rows.filter((row) => row.id !== id);
  const next = databaseSchema.parse({ ...data, [change.resource]: nextRows });
  validateRelations(next);
  return next;
}
