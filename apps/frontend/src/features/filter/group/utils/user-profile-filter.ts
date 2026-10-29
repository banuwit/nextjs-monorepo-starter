import type { UserProfile } from "@/mocks/user-profile.mock";
import type { FilterFieldReader } from "@/components/filter/advanced/filter-query";

export const REGIONS = [
  { value: "jawa", label: "Jawa" },
  { value: "sumatera", label: "Sumatera" },
  { value: "kalimantan", label: "Kalimantan" },
  { value: "sulawesi", label: "Sulawesi" },
  { value: "bali-nusra", label: "Bali & Nusa Tenggara" },
] as const;

const REGION_OF_CITY: Record<string, (typeof REGIONS)[number]["value"]> = {
  Jakarta: "jawa",
  Bandung: "jawa",
  Surabaya: "jawa",
  Yogyakarta: "jawa",
  Semarang: "jawa",
  Medan: "sumatera",
  Palembang: "sumatera",
  Balikpapan: "kalimantan",
  Makassar: "sulawesi",
  Denpasar: "bali-nusra",
};

export const regionOf = (city: string | undefined) =>
  city ? REGION_OF_CITY[city] : undefined;

/** Option value for users without a manager (the exclusive "No manager" row). */
export const NO_MANAGER = "none";

/** Lowercase slug used as an option value for free-form labels. */
export const slugify = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * Maps a rule path to the value it filters. Group ids (`organization`,
 * `account`) only namespace the leaf, so the leaf id decides.
 */
export const readUserProfileField: FilterFieldReader<UserProfile> = (
  user,
  path,
) => {
  switch (path.at(-1)) {
    case "user":
      return `${user.id} ${user.name} ${user.email}`;
    case "person":
      return user.id;
    case "manager":
      return user.managerId ?? NO_MANAGER;
    case "department":
      return user.department ? slugify(user.department) : undefined;
    case "city":
      return user.city ? slugify(user.city) : undefined;
    case "region":
      return regionOf(user.city);
    case "emailDomain":
      return user.email.split("@")[1];
    case "joined":
      return user.joinDate;
    case "joinMonth":
      return user.joinDate.slice(0, 7);
    case "lastActive":
      return user.lastActiveAt;
    case "skills":
      return user.skills;
    case "devices":
      return user.devices;
    case "permissions":
      return user.permissions;
    case "twoFactor":
      return user.twoFactor;
    case "employeeCode":
      return user.employeeCode;
    case "employmentType":
      return user.employmentType;
    case "experienceYears":
      return user.experienceYears;
    case "level":
      return user.level;
    case "role":
      return user.role;
    case "salary":
      return user.salary;
    case "score":
      return user.score;
    case "status":
      return user.status;
    default:
      return undefined;
  }
};

/** Fake paged directory search for `loadOptions` (pola `c-filters-1`/`4`). */
export function searchUserDirectory(
  users: UserProfile[],
  query: string,
  signal: AbortSignal,
  cursor?: string,
  pageSize = 8,
) {
  const needle = query.trim().toLowerCase();
  const matches = users.filter((user) =>
    `${user.id} ${user.name} ${user.email}`.toLowerCase().includes(needle),
  );
  const start = cursor ? Number(cursor) : 0;
  const next = start + pageSize;

  return new Promise<{ items: UserProfile[]; nextCursor?: string }>(
    (resolve, reject) => {
      const timer = setTimeout(
        () =>
          resolve({
            items: matches.slice(start, next),
            nextCursor: next < matches.length ? String(next) : undefined,
          }),
        260,
      );
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    },
  );
}

/** Fake id lookup for `resolveValues`, e.g. after restoring a saved view. */
export function fetchUsersByIds(users: UserProfile[], ids: string[]) {
  const wanted = new Set(ids);
  return new Promise<UserProfile[]>((resolve) => {
    setTimeout(() => resolve(users.filter((user) => wanted.has(user.id))), 240);
  });
}

export const formatRupiah = (value: number) =>
  `Rp${value.toLocaleString("id-ID")}`;

/** Short rupiah for chips and sliders: `Rp12 jt`. */
export const formatRupiahShort = (value: number) =>
  `Rp${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
