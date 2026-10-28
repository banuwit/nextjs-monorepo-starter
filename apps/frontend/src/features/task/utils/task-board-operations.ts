/** Move a task to a column and position without mutating the current board. */
export function moveTask(
  board,
  taskId,
  targetColumn,
  targetIndex = board[targetColumn]?.length ?? 0,
) {
  const sourceColumn = Object.keys(board).find((column) =>
    board[column].some((task) => task.id === taskId),
  );
  if (!sourceColumn || !board[targetColumn]) return board;

  const next = Object.fromEntries(
    Object.entries(board).map(([column, tasks]) => [column, [...tasks]]),
  );
  const sourceIndex = next[sourceColumn].findIndex(
    (task) => task.id === taskId,
  );
  const [task] = next[sourceColumn].splice(sourceIndex, 1);
  const insertionIndex =
    sourceColumn === targetColumn && sourceIndex < targetIndex
      ? targetIndex - 1
      : targetIndex;
  next[targetColumn].splice(Math.max(0, insertionIndex), 0, task);
  return next;
}

/** Select tasks for all views while retaining their current column. */
export function selectTasks(
  board,
  { query = "", priority = "All", sort = "default" } = {},
) {
  const search = query.trim().toLocaleLowerCase();
  const selected = Object.entries(board).flatMap(([columnId, tasks]) =>
    tasks
      .filter(
        (task) =>
          (priority === "All" || task.priority === priority) &&
          [
            task.title,
            task.description,
            task.owner?.name ?? task.owner,
            task.team,
          ].some((value) => value?.toLocaleLowerCase().includes(search)),
      )
      .map((task) => ({ columnId, task })),
  );
  if (sort === "due")
    selected.sort((a, b) => a.task.dueDate.localeCompare(b.task.dueDate));
  if (sort === "priority")
    selected.sort(
      (a, b) =>
        ["High", "Medium", "Low"].indexOf(a.task.priority) -
        ["High", "Medium", "Low"].indexOf(b.task.priority),
    );
  return selected;
}

/** Apply edits from a filtered view without deleting tasks hidden by its filters. */
export function mergeVisibleBoard(board, visibleBoard, updatedBoard) {
  const editedIds = new Set([
    ...Object.values(visibleBoard)
      .flat()
      .map((task) => task.id),
    ...Object.values(updatedBoard)
      .flat()
      .map((task) => task.id),
  ]);
  return Object.fromEntries(
    Object.entries(board).map(([column, tasks]) => [
      column,
      [
        ...tasks.filter((task) => !editedIds.has(task.id)),
        ...updatedBoard[column],
      ],
    ]),
  );
}
