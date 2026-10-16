import { initialBoard } from "@/mocks/task.mock";
import { Kanban } from "./components/kanban";

export function TaskPage() {
  return <Kanban initialBoard={initialBoard} />;
}
