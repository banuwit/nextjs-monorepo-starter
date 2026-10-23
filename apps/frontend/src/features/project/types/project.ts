import type { projectStatuses, projectPriorities } from "../utils/project";

export type Project = {
  id: string;
  name: string;
  description: string;
  client: string;
  owner: string;
  status: keyof typeof projectStatuses;
  priority: keyof typeof projectPriorities;
  startDate: string;
  dueDate: string;
  progress: number;
};

export type ProjectErrors = Partial<Record<keyof Project, string>>;

export type ProjectChange =
  | { type: "save"; project: Project; isNew: boolean }
  | { type: "delete"; id: string };
