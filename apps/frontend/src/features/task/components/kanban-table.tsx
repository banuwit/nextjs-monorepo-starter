"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns, taskOwners } from "@/mocks/task.mock";
import type { BoardState, ColumnId, TaskPriority } from "../types/task";
import {
  boardFromTasks,
  cloneBoardTask,
  flattenBoard,
} from "../utils/task-board";
import type { BoardTask } from "../types/task-board";

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

function createEmptyTask(): BoardTask {
  const column = columns[0];
  return {
    id: `task-${crypto.randomUUID()}`,
    title: "Untitled task",
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
  const [previousBoard, setPreviousBoard] = React.useState(board);
  if (board !== previousBoard) {
    setPreviousBoard(board);
    setRows(flattenBoard(board, columnOrder));
  }
  const visibleRows = rows.filter(
    (task) =>
      (filters.priority === "All" || task.priority === filters.priority) &&
      (!filters.query ||
        `${task.title} ${task.owner.name} ${task.team}`
          .toLowerCase()
          .includes(filters.query.toLowerCase())),
  );
  const save = () => onBoardChange(boardFromTasks(rows));
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted/25 px-4 py-4 lg:px-5 lg:py-5">
      <div className="mb-3 flex justify-end">
        <Button
          size="sm"
          onClick={() => setRows((current) => [...current, createEmptyTask()])}
        >
          <PlusIcon data-icon="inline-start" />
          Add task
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.length ? (
              visibleRows.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.columnTitle}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.owner.name}</TableCell>
                  <TableCell>{task.team}</TableCell>
                  <TableCell>{task.dueDate || "—"}</TableCell>
                  <TableCell>{task.progress}%</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No tasks to display.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-3 flex justify-end">
        <Button size="sm" onClick={save}>
          Save
        </Button>
      </div>
    </div>
  );
}
