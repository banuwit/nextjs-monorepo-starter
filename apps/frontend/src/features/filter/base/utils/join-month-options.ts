import type { SelectOption } from "@/components/filter/types";
import type { User } from "@/mocks/user.mock";

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Every `YYYY-MM` users joined in, newest first, grouped by year. */
export function getJoinMonthOptions(users: User[]): SelectOption[] {
  const months = [...new Set(users.map((user) => user.joinDate.slice(0, 7)))];

  return months
    .sort((left, right) => right.localeCompare(left))
    .map((month) => ({
      value: month,
      label: monthFormatter.format(new Date(`${month}-01T00:00:00Z`)),
      group: month.slice(0, 4),
    }));
}
