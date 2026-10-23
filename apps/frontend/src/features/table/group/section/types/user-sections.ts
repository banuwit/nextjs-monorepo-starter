import type { User } from "@/mocks/user.mock";

export type SectionFilters = {
  search: string;
  gender: User["gender"] | "all";
  status: User["status"] | "all";
};
