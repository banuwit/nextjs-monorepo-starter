import type { Metadata } from "next";
import { TaskPage } from "@/features/task/components/task-page";

export const metadata: Metadata = {
  title: "Task | Dashboard",
  description: "Plan tasks on a kanban board, list, table, or Gantt chart.",
};

export default function Page() {
  return <TaskPage />;
}
