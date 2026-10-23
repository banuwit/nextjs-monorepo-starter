import { columnIds, columns } from "@/mocks/task.mock";
import type { BoardState, ColumnId, Task } from "../types/task";
import type { BoardTask } from "../types/task-board";

function isColumnId(id: string): id is ColumnId {
  return columnIds.includes(id as ColumnId);
}

export function findColumnId(
  board: BoardState,
  id: string,
): ColumnId | undefined {
  if (isColumnId(id)) return id;
  return columnIds.find((columnId) =>
    board[columnId].some((task) => task.id === id),
  );
}

export function findTask(board: BoardState, id: string) {
  for (const columnId of columnIds) {
    const task = board[columnId].find((item) => item.id === id);
    if (task) return task;
  }
  return undefined;
}

export function flattenBoard(
  board: BoardState,
  columnOrder: ColumnId[] = columnIds,
): BoardTask[] {
  return columnOrder.flatMap((columnId) => {
    const column = columns.find((item) => item.id === columnId);

    return board[columnId].map((task) => ({
      ...task,
      columnId,
      columnTitle: column?.title ?? columnId,
    }));
  });
}

export function cloneBoardTask(task: BoardTask): BoardTask {
  return {
    ...task,
    owner: { ...task.owner },
    insights: task.insights.map((insight) => ({ ...insight })),
  };
}

export function boardFromTasks(tasks: BoardTask[]): BoardState {
  const next = Object.fromEntries(
    columnIds.map((columnId) => [columnId, [] as Task[]]),
  ) as BoardState;

  for (const task of tasks) {
    const { columnId, columnTitle: _columnTitle, ...rest } = task;
    next[columnId].push(rest);
  }

  return next;
}

export function areBoardTasksEqual(left: BoardTask, right: BoardTask) {
  return (
    left.id === right.id &&
    left.title === right.title &&
    left.description === right.description &&
    left.priority === right.priority &&
    left.dueDate === right.dueDate &&
    left.startDate === right.startDate &&
    left.progress === right.progress &&
    left.team === right.team &&
    left.columnId === right.columnId &&
    left.owner.name === right.owner.name
  );
}
