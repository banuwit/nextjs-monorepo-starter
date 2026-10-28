import type { BoardState, ColumnId, Task, TaskPriority } from "../types/task";

export type TaskSort = "default" | "due" | "priority";

const priorityOrder: TaskPriority[] = ["High", "Medium", "Low"];

/** Move a task to a column and position without mutating the current board. */
export function moveTask(
  board: BoardState,
  taskId: string,
  targetColumn: ColumnId,
  targetIndex = board[targetColumn]?.length ?? 0,
): BoardState {
  const sourceColumn = (Object.keys(board) as ColumnId[]).find((column) =>
    board[column].some((task) => task.id === taskId),
  );
  if (!sourceColumn || !board[targetColumn]) return board;

  const next = Object.fromEntries(
    Object.entries(board).map(([column, tasks]) => [column, [...tasks]]),
  ) as BoardState;
  const sourceIndex = next[sourceColumn].findIndex(
    (task) => task.id === taskId,
  );
  const [task] = next[sourceColumn].splice(sourceIndex, 1);
  if (!task) return board;
  const insertionIndex =
    sourceColumn === targetColumn && sourceIndex < targetIndex
      ? targetIndex - 1
      : targetIndex;
  next[targetColumn].splice(Math.max(0, insertionIndex), 0, task);
  return next;
}

/** Select tasks for all views while retaining their current column. */
export function selectTasks(
  board: BoardState,
  {
    query = "",
    priority = "All",
    sort = "default",
  }: { query?: string; priority?: TaskPriority | "All"; sort?: TaskSort } = {},
): { columnId: ColumnId; task: Task }[] {
  const search = query.trim().toLocaleLowerCase();
  const selected = (Object.entries(board) as [ColumnId, Task[]][]).flatMap(
    ([columnId, tasks]) =>
      tasks
        .filter(
          (task) =>
            (priority === "All" || task.priority === priority) &&
            [task.title, task.description, task.owner.name, task.team].some(
              (value) => value.toLocaleLowerCase().includes(search),
            ),
        )
        .map((task) => ({ columnId, task })),
  );
  if (sort === "due")
    selected.sort((a, b) => a.task.dueDate.localeCompare(b.task.dueDate));
  if (sort === "priority")
    selected.sort(
      (a, b) =>
        priorityOrder.indexOf(a.task.priority) -
        priorityOrder.indexOf(b.task.priority),
    );
  return selected;
}

/** Apply edits from a filtered view without deleting tasks hidden by its filters. */
export function mergeVisibleBoard(
  board: BoardState,
  visibleBoard: BoardState,
  updatedBoard: BoardState,
): BoardState {
  const editedIds = new Set([
    ...Object.values(visibleBoard)
      .flat()
      .map((task) => task.id),
    ...Object.values(updatedBoard)
      .flat()
      .map((task) => task.id),
  ]);
  return Object.fromEntries(
    (Object.entries(board) as [ColumnId, Task[]][]).map(([column, tasks]) => [
      column,
      [
        ...tasks.filter((task) => !editedIds.has(task.id)),
        ...updatedBoard[column],
      ],
    ]),
  ) as BoardState;
}
