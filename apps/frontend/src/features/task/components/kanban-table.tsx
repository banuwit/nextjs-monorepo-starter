"use client";
"use no memo";

import * as React from "react";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type ColumnDef, useTable } from "@tanstack/react-table";

import {
  DataGrid,
  type DataGridCellStatus,
  DataGridContainer,
  type DataGridFeatures,
  type DataGridRowStatus,
  dataGridFeatures,
} from "@/components/data-grid/data-grid";
import { DataGridTable } from "@/components/data-grid/data-grid-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { isMatch, parseISO } from "date-fns";
import { selectTasks } from "../task-board.js";

import { columns, taskOwners } from "@/mocks/task.mock";
import {
  TaskActionsCell,
  TaskActivityCell,
  TaskDueDateCell,
  TaskOwnerCell,
  TaskPriorityCell,
  TaskProgressCell,
  TaskStatusCell,
  TaskTeamCell,
  TaskTitleCell,
} from "./kanban-table-cells";
import type { BoardState, ColumnId, TaskPriority } from "./types";
import {
  areBoardTasksEqual,
  type BoardTask,
  boardFromTasks,
  cloneBoardTask,
  flattenBoard,
} from "./utils";

interface KanbanTableProps {
  board: BoardState;
  filters: {
    query: string;
    priority: TaskPriority | "All";
    sort: "default" | "due" | "priority";
  };
  columnOrder: ColumnId[];
  onBoardChange: (board: BoardState) => void;
}

function cloneTasks(tasks: BoardTask[]) {
  return tasks.map(cloneBoardTask);
}

function getTaskFieldError(task: BoardTask, columnId: string) {
  if (columnId === "title" && !task.title.trim()) return "Title is required";
  if (
    columnId === "dueDate" &&
    (!isMatch(task.dueDate, "yyyy-MM-dd") ||
      (task.startDate && parseISO(task.dueDate) < parseISO(task.startDate)))
  )
    return "Enter a valid due date on or after the start date";
  if (
    columnId === "progress" &&
    (!Number.isFinite(task.progress) ||
      task.progress < 0 ||
      task.progress > 100)
  ) {
    return "Progress must be between 0 and 100";
  }
  return undefined;
}

function TableHeaderLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-muted-foreground">{children}</span>;
}

function createEmptyTask(): BoardTask {
  const column = columns[0];

  return {
    id: `task-${crypto.randomUUID()}`,
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    progress: 0,
    owner: taskOwners.arham,
    team: "Product",
    insights: [],
    columnId: column.id,
    columnTitle: column.title,
  };
}

export function KanbanTable({
  board,
  columnOrder,
  onBoardChange,
  filters,
}: KanbanTableProps) {
  const [rows, setRows] = React.useState(() =>
    flattenBoard(board, columnOrder),
  );
  const [savedRows, setSavedRows] = React.useState(() =>
    flattenBoard(board, columnOrder),
  );
  const [previousBoard, setPreviousBoard] = React.useState(board);
  if (board !== previousBoard) {
    setPreviousBoard(board);
    const previousIds = new Set(
      flattenBoard(previousBoard).map((task) => task.id),
    );
    const additions = flattenBoard(board, columnOrder).filter(
      (task) =>
        !previousIds.has(task.id) && !rows.some((row) => row.id === task.id),
    );
    if (additions.length) {
      setRows((current) => [...current, ...additions]);
      setSavedRows((current) => [...current, ...cloneTasks(additions)]);
    }
  }
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(
    null,
  );

  const savedById = React.useMemo(
    () => new Map(savedRows.map((task) => [task.id, task])),
    [savedRows],
  );

  const changeCount = React.useMemo(() => {
    const currentIds = new Set(rows.map((task) => task.id));
    let count = savedRows.reduce(
      (total, task) => total + (currentIds.has(task.id) ? 0 : 1),
      0,
    );

    for (const task of rows) {
      const saved = savedById.get(task.id);
      if (!saved || !areBoardTasksEqual(task, saved)) count += 1;
    }

    return count;
  }, [rows, savedById, savedRows]);

  const hasInvalidRows = React.useMemo(
    () =>
      rows.some(
        (task) =>
          Boolean(getTaskFieldError(task, "title")) ||
          Boolean(getTaskFieldError(task, "dueDate")) ||
          Boolean(getTaskFieldError(task, "progress")),
      ),
    [rows],
  );

  const orderChanged =
    rows.map((task) => task.id).join(",") !==
    savedRows.map((task) => task.id).join(",");
  const isDirty = changeCount > 0 || orderChanged;
  const pendingDeleteTask = rows.find((task) => task.id === pendingDeleteId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleTaskReorder(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setRows((currentRows) => {
      const activeIndex = currentRows.findIndex(
        (task) => task.id === active.id,
      );
      const overIndex = currentRows.findIndex((task) => task.id === over.id);
      if (activeIndex === -1 || overIndex === -1) return currentRows;

      return arrayMove(currentRows, activeIndex, overIndex);
    });
  }

  const updateTask = React.useCallback(
    (taskId: string, patch: Partial<BoardTask>) => {
      setRows((current) =>
        current.map((task) => {
          if (task.id !== taskId) return task;

          const next = { ...task, ...patch };
          if (patch.columnId && patch.columnId !== task.columnId) {
            next.columnTitle =
              columns.find((column) => column.id === patch.columnId)?.title ??
              patch.columnId;
          }
          return next;
        }),
      );
    },
    [],
  );

  const handleCreateTask = React.useCallback(() => {
    setRows((current) => [...current, createEmptyTask()]);
  }, []);

  const handleDuplicateTask = React.useCallback((taskId: string) => {
    setRows((current) => {
      const index = current.findIndex((task) => task.id === taskId);
      if (index === -1) return current;

      const source = current[index];
      if (!source) return current;
      const duplicate = cloneBoardTask(source);
      duplicate.id = `task-${crypto.randomUUID()}`;
      duplicate.title = source.title.trim() ? `${source.title} copy` : "";

      return [
        ...current.slice(0, index + 1),
        duplicate,
        ...current.slice(index + 1),
      ];
    });
  }, []);

  const handleDeleteTask = React.useCallback((taskId: string) => {
    setRows((current) => current.filter((task) => task.id !== taskId));
    setPendingDeleteId(null);
  }, []);

  const handleSave = React.useCallback(() => {
    if (hasInvalidRows) return;

    const nextBoard = boardFromTasks(rows);
    onBoardChange(nextBoard);
    setSavedRows(cloneTasks(rows));
    toast.add({
      title: "Tasks saved",
      description: "Table edits were applied to the board.",
    });
  }, [hasInvalidRows, onBoardChange, rows]);

  const handleDiscard = React.useCallback(() => {
    setRows(cloneTasks(savedRows));
    setPendingDeleteId(null);
  }, [savedRows]);

  const getRowStatus = React.useCallback(
    (task: BoardTask): DataGridRowStatus | undefined => {
      const saved = savedById.get(task.id);
      if (!saved) return "new";
      if (!areBoardTasksEqual(task, saved)) return "dirty";
      return undefined;
    },
    [savedById],
  );

  const getCellStatus = React.useCallback(
    (task: BoardTask, columnId: string): DataGridCellStatus | undefined => {
      if (getTaskFieldError(task, columnId)) return "invalid";

      const saved = savedById.get(task.id);
      if (!saved) return "dirty";

      if (
        columnId === "title" &&
        (task.title !== saved.title || task.description !== saved.description)
      )
        return "dirty";
      if (columnId === "status" && task.columnId !== saved.columnId)
        return "dirty";
      if (columnId === "priority" && task.priority !== saved.priority)
        return "dirty";
      if (columnId === "owner" && task.owner.name !== saved.owner.name)
        return "dirty";
      if (columnId === "team" && task.team !== saved.team) return "dirty";
      if (columnId === "dueDate" && task.dueDate !== saved.dueDate)
        return "dirty";
      if (columnId === "progress" && task.progress !== saved.progress)
        return "dirty";

      return undefined;
    },
    [savedById],
  );

  const tableColumns = React.useMemo<ColumnDef<DataGridFeatures, BoardTask>[]>(
    () => [
      {
        accessorKey: "title",
        id: "title",
        header: () => <TableHeaderLabel>Task</TableHeaderLabel>,
        cell: ({ row }) => (
          <TaskTitleCell
            invalid={Boolean(getTaskFieldError(row.original, "title"))}
            onChange={(patch) => updateTask(row.original.id, patch)}
            task={row.original}
          />
        ),
        minSize: 240,
        meta: { autoSize: true, headerTitle: "Task" },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "columnTitle",
        id: "status",
        header: () => <TableHeaderLabel>Status</TableHeaderLabel>,
        cell: ({ row }) => (
          <TaskStatusCell
            onChange={(patch) => updateTask(row.original.id, patch)}
            task={row.original}
          />
        ),
        size: 150,
        meta: { headerTitle: "Status" },
        enableSorting: false,
      },
      {
        accessorKey: "priority",
        id: "priority",
        header: () => <TableHeaderLabel>Priority</TableHeaderLabel>,
        cell: ({ row }) => (
          <TaskPriorityCell
            onChange={(patch) => updateTask(row.original.id, patch)}
            task={row.original}
          />
        ),
        size: 140,
        meta: { headerTitle: "Priority" },
        enableSorting: false,
      },
      {
        accessorKey: "owner",
        id: "owner",
        accessorFn: (row) => row.owner.name,
        header: () => <TableHeaderLabel>Owner</TableHeaderLabel>,
        cell: ({ row }) => (
          <TaskOwnerCell
            onChange={(patch) => updateTask(row.original.id, patch)}
            task={row.original}
          />
        ),
        size: 180,
        meta: { headerTitle: "Owner" },
        enableSorting: false,
      },
      {
        accessorKey: "team",
        id: "team",
        header: () => <TableHeaderLabel>Team</TableHeaderLabel>,
        cell: ({ row }) => (
          <TaskTeamCell
            onChange={(patch) => updateTask(row.original.id, patch)}
            task={row.original}
          />
        ),
        size: 150,
        meta: { headerTitle: "Team" },
        enableSorting: false,
      },
      {
        accessorKey: "dueDate",
        id: "dueDate",
        header: () => <TableHeaderLabel>Due date</TableHeaderLabel>,
        cell: ({ row }) => (
          <TaskDueDateCell
            invalid={Boolean(getTaskFieldError(row.original, "dueDate"))}
            onChange={(patch) => updateTask(row.original.id, patch)}
            task={row.original}
          />
        ),
        size: 150,
        meta: { headerTitle: "Due date" },
        enableSorting: false,
      },
      {
        accessorKey: "progress",
        id: "progress",
        header: () => <TableHeaderLabel>Progress</TableHeaderLabel>,
        cell: ({ row }) => (
          <TaskProgressCell
            invalid={Boolean(getTaskFieldError(row.original, "progress"))}
            onChange={(patch) => updateTask(row.original.id, patch)}
            task={row.original}
          />
        ),
        size: 170,
        meta: { headerTitle: "Progress" },
        enableSorting: false,
      },
      {
        id: "activity",
        header: () => <TableHeaderLabel>Activity</TableHeaderLabel>,
        cell: ({ row }) => <TaskActivityCell task={row.original} />,
        size: 140,
        enableSorting: false,
        meta: { headerTitle: "Activity" },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <TaskActionsCell
            onDelete={() => setPendingDeleteId(row.original.id)}
            onDuplicate={() => handleDuplicateTask(row.original.id)}
          />
        ),
        size: 52,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [handleDuplicateTask, updateTask],
  );

  const visibleIds = new Set(
    selectTasks(boardFromTasks(rows), filters).map(
      (item: { task: { id: string } }) => item.task.id,
    ),
  );
  const visibleRows = rows.filter((task) => visibleIds.has(task.id));
  if (filters.sort === "due")
    visibleRows.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  if (filters.sort === "priority")
    visibleRows.sort(
      (a, b) =>
        ["High", "Medium", "Low"].indexOf(a.priority) -
        ["High", "Medium", "Low"].indexOf(b.priority),
    );

  const table = useTable({
    features: dataGridFeatures,
    columns: tableColumns,
    data: visibleRows,
    getRowId: (row) => row.id,
    state: {
      pagination: { pageIndex: 0, pageSize: Math.max(rows.length, 1) },
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted/25 px-4 py-4 lg:px-5 lg:py-5">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleTaskReorder}
        sensors={sensors}
      >
        <SortableContext
          items={rows.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <DataGrid
            emptyMessage="No tasks to display."
            getCellStatus={getCellStatus}
            getRowStatus={getRowStatus}
            onRowCreate={handleCreateTask}
            recordCount={rows.length}
            rowCreateLabel="Add task"
            table={table}
            tableClassNames={{
              headerSticky: "sticky top-0 z-40 bg-card",
            }}
            tableLayout={{
              cellBorder: true,
              headerBackground: true,
              headerSticky: true,
              rowBorder: true,
              width: "fixed",
            }}
          >
            <DataGridContainer className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card">
              <div className="min-h-0 flex-1 overflow-auto">
                <DataGridTable />
              </div>
              {isDirty ? (
                <div className="flex shrink-0 flex-col gap-2 border-t bg-muted/30 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-muted-foreground text-sm">
                    {changeCount || 1} unsaved{" "}
                    {changeCount === 1 ? "change" : "changes"}
                    {hasInvalidRows ? " · Fix invalid cells to save" : null}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button onClick={handleDiscard} size="sm" variant="outline">
                      Discard
                    </Button>
                    <Button
                      disabled={hasInvalidRows}
                      onClick={handleSave}
                      size="sm"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : null}
            </DataGridContainer>
          </DataGrid>
        </SortableContext>
      </DndContext>

      <AlertDialog
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        open={pendingDeleteId !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteTask?.title.trim()
                ? `"${pendingDeleteTask.title}" will be removed from the table. Save to apply the deletion.`
                : "This untitled task will be removed from the table. Save to apply the deletion."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDeleteId) handleDeleteTask(pendingDeleteId);
              }}
              variant="destructive"
            >
              Delete task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
