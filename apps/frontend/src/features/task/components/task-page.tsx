import { initialBoard } from "@/mocks/task.mock";
import { Kanban } from "./kanban";

export function TaskPage() {
  return <Kanban initialBoard={initialBoard} />;
}
