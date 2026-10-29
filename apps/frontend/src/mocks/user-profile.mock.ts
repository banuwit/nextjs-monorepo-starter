import type { User } from "./user.mock";
import { users } from "./user.mock";

export const levels = ["junior", "mid", "senior", "lead", "principal"] as const;
export const employmentTypes = ["full-time", "contract", "intern"] as const;
export const devices = ["web", "ios", "android", "desktop"] as const;
export const permissions = [
  "read",
  "write",
  "publish",
  "admin",
  "billing",
] as const;
export const skills = [
  "React",
  "TypeScript",
  "Node.js",
  "SQL",
  "Python",
  "Figma",
  "Go",
  "DevOps",
  "SEO",
  "Copywriting",
] as const;

/**
 * The user directory plus HR/account attributes for the advanced filter demo.
 * Kept apart from `User` so the editable table demos keep their model.
 */
export type UserProfile = User & {
  level: (typeof levels)[number];
  employmentType: (typeof employmentTypes)[number];
  /** Performance score, 0–100. */
  score: number;
  /** Gross monthly salary in rupiah. */
  salary: number;
  experienceYears: number;
  /** Last sign-in day, `yyyy-MM-dd`, within the 60 days before today. */
  lastActiveAt: string;
  devices: (typeof devices)[number][];
  permissions: (typeof permissions)[number][];
  skills: (typeof skills)[number][];
  twoFactor: boolean;
  /** Six-character badge code, e.g. `K3P9QA`. */
  employeeCode: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local calendar day, matching how the date filter resolves "today". */
const toDay = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

function toProfile(user: User, index: number): UserProfile {
  const deviceBits = (index * 5 + 3) % 16 || 1;
  const userPermissions: UserProfile["permissions"] =
    user.role === "admin"
      ? [
          "read",
          "write",
          "publish",
          "admin",
          ...(index % 2 ? ["billing" as const] : []),
        ]
      : user.role === "editor"
        ? ["read", "write", ...(index % 3 ? ["publish" as const] : [])]
        : ["read"];

  return {
    ...user,
    level: levels[(index * 2) % levels.length] ?? "mid",
    employmentType:
      index % 7 === 0 ? "intern" : index % 4 === 0 ? "contract" : "full-time",
    score: (index * 37 + 11) % 101,
    salary: 6_000_000 + ((index * 13) % 25) * 1_000_000,
    experienceYears: (index * 5) % 16,
    // Relative to today, so "last 7 days" style presets always match someone.
    lastActiveAt: toDay(new Date(Date.now() - ((index * 11) % 60) * DAY_MS)),
    devices: devices.filter((_, bit) => deviceBits & (1 << bit)),
    permissions: userPermissions,
    skills: [
      ...new Set([
        skills[index % skills.length] ?? "React",
        skills[(index * 3 + 1) % skills.length] ?? "SQL",
        skills[(index * 7 + 2) % skills.length] ?? "Figma",
      ]),
    ],
    twoFactor: index % 3 !== 1,
    // Multiplicative hash spread over 36^6 so codes do not share a prefix.
    employeeCode: (((index + 1) * 2_654_435_761) % 36 ** 6)
      .toString(36)
      .toUpperCase()
      .padStart(6, "0")
      .slice(-6),
  };
}

export function getUserProfiles(): UserProfile[] {
  return users.map(toProfile);
}
