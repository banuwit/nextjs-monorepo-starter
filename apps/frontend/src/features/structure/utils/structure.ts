import type { Department, Employee } from "../types/structure";

export const departments: Department[] = [
  "Executive",
  "Engineering",
  "Product",
  "Design",
  "Sales",
  "Finance",
  "People",
];

/** Tailwind classes are written in full so the compiler keeps them. */
export const departmentTone: Record<Department, string> = {
  Executive: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  Engineering: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  Product: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Design: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  Sales: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Finance: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  People: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
};

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/**
 * Add a new position under `parent`. With `target` (one of the parent's
 * reports), the new position is inserted between them and inherits that report.
 */
export function insertEmployee(
  employees: Employee[],
  id: string,
  parent: string,
  target?: string,
): Employee[] {
  const manager = employees.find((employee) => employee.id === parent);
  const child = employees.find(
    (employee) => employee.id === target && employee.parent === parent,
  );
  return [
    ...employees.map((employee) =>
      employee === child ? { ...employee, parent: id } : employee,
    ),
    {
      id,
      parent,
      name: "New position",
      title: "Not assigned yet",
      department: manager?.department ?? "Engineering",
      email: "",
      location: manager?.location ?? "",
    },
  ];
}

/** Remove a position; its reports move up to its manager. The root stays. */
export function removeEmployee(employees: Employee[], id: string): Employee[] {
  const removed = employees.find((employee) => employee.id === id);
  if (!removed?.parent) return employees;
  return employees
    .filter((employee) => employee.id !== id)
    .map((employee) =>
      employee.parent === id ? { ...employee, parent: removed.parent } : employee,
    );
}

export function directReports(employees: Employee[], id: string) {
  return employees.filter((employee) => employee.parent === id);
}

/** Everyone below this position, at any depth. */
export function totalReports(employees: Employee[], id: string): number {
  return directReports(employees, id).reduce(
    (sum, report) => sum + 1 + totalReports(employees, report.id),
    0,
  );
}

/** Managers from the root down to (but excluding) this position. */
export function reportingLine(employees: Employee[], id: string): Employee[] {
  const line: Employee[] = [];
  let current = employees.find((employee) => employee.id === id);
  while (current?.parent) {
    const manager = employees.find((employee) => employee.id === current!.parent);
    if (!manager) break;
    line.unshift(manager);
    current = manager;
  }
  return line;
}
