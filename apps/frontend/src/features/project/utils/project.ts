import type { Project, ProjectErrors, ProjectChange } from "../types/project";

export const projectStatuses = {
  planned: "Direncanakan",
  active: "Berjalan",
  "on-hold": "Ditunda",
  completed: "Selesai",
} as const;

export const projectPriorities = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
} as const;

export const projectStorageKey = "workspace.projects.v1";

function isDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

export function getProjectErrors(project: Project): ProjectErrors {
  const errors: ProjectErrors = {};
  if (!project.name.trim() || project.name.length > 100)
    errors.name = "Isi nama project, maksimal 100 karakter.";
  if (!project.owner.trim() || project.owner.length > 80)
    errors.owner = "Isi penanggung jawab, maksimal 80 karakter.";
  if (project.client.length > 100) errors.client = "Maksimal 100 karakter.";
  if (project.description.length > 2000)
    errors.description = "Maksimal 2.000 karakter.";
  if (!Object.hasOwn(projectStatuses, project.status))
    errors.status = "Pilih status project.";
  if (!Object.hasOwn(projectPriorities, project.priority))
    errors.priority = "Pilih prioritas project.";
  if (!isDate(project.startDate))
    errors.startDate = "Isi tanggal mulai yang valid.";
  if (!isDate(project.dueDate)) errors.dueDate = "Isi tenggat yang valid.";
  else if (!errors.startDate && project.dueDate < project.startDate)
    errors.dueDate = "Tenggat tidak boleh sebelum tanggal mulai.";
  if (
    !Number.isInteger(project.progress) ||
    project.progress < 0 ||
    project.progress > 100
  )
    errors.progress = "Progres harus berupa angka bulat 0–100%.";
  else if (project.status === "completed" && project.progress !== 100)
    errors.progress = "Project selesai harus memiliki progres 100%.";
  return errors;
}

export function applyProjectChange(
  projects: Project[],
  change: ProjectChange,
): Project[] {
  const id = change.type === "save" ? change.project.id : change.id;
  const exists = projects.some((project) => project.id === id);
  if (change.type === "delete")
    return projects.filter((project) => project.id !== id);
  if (!change.isNew && !exists)
    throw new Error(
      "Project tidak ditemukan. Muat ulang daftar dan coba lagi.",
    );
  if (change.isNew && exists) throw new Error("ID project sudah digunakan.");
  if (Object.keys(getProjectErrors(change.project)).length)
    throw new Error("Periksa kembali data project.");
  return change.isNew
    ? [change.project, ...projects]
    : projects.map((project) => (project.id === id ? change.project : project));
}

export function isOverdue(project: Project, today: string) {
  return project.status !== "completed" && project.dueDate < today;
}

export function sortProjects(
  projects: Project[],
  sorting: { id: string; desc: boolean }[],
) {
  const sort = sorting[0];
  if (!sort) return projects;
  return [...projects].sort((a, b) => {
    let result = 0;
    if (sort.id === "progress") result = a.progress - b.progress;
    else if (sort.id === "priority") {
      const order = { high: 0, medium: 1, low: 2 };
      result = order[a.priority] - order[b.priority];
    } else if (sort.id === "status") {
      const order = { planned: 0, active: 1, "on-hold": 2, completed: 3 };
      result = order[a.status] - order[b.status];
    } else if (
      sort.id === "name" ||
      sort.id === "owner" ||
      sort.id === "dueDate"
    ) {
      result = a[sort.id].localeCompare(b[sort.id], "id", { numeric: true });
    }
    return sort.desc ? -result : result;
  });
}

export function selectProjects(
  projects: Project[],
  query: string,
  status: string,
  priority: string,
) {
  const search = query.trim().toLocaleLowerCase("id");
  return projects.filter(
    (project) =>
      (status === "all" || project.status === status) &&
      (priority === "all" || project.priority === priority) &&
      [project.name, project.description, project.owner, project.client].some(
        (value) => value.toLocaleLowerCase("id").includes(search),
      ),
  );
}

export function parseProjectStorage(raw: string): Project[] {
  const data: unknown = JSON.parse(raw);
  if (
    !data ||
    typeof data !== "object" ||
    !("version" in data) ||
    data.version !== 1 ||
    !("projects" in data) ||
    !Array.isArray(data.projects)
  ) {
    throw new Error("Format data project tidak dikenali.");
  }
  const ids = new Set<string>();
  for (const item of data.projects) {
    const strings = [
      "id",
      "name",
      "description",
      "client",
      "owner",
      "status",
      "priority",
      "startDate",
      "dueDate",
    ];
    if (
      !item ||
      typeof item !== "object" ||
      !strings.every((key) => typeof item[key] === "string") ||
      typeof item.progress !== "number" ||
      !item.id ||
      ids.has(item.id) ||
      Object.keys(getProjectErrors(item)).length
    ) {
      throw new Error("Data project tersimpan tidak valid.");
    }
    ids.add(item.id);
  }
  return data.projects;
}

export function todayDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatProjectDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
