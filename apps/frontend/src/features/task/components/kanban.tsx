"use client";

import * as React from "react";

import {
  closestCorners,
  DndContext,
  type DragCancelEvent,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  ArrowUpDownIcon,
  ChartGanttIcon,
  KanbanIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  Table2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toast";

import { TaskFormDialog } from "./task-form-dialog";
import { selectTasks, mergeVisibleBoard } from "../utils/task-board-operations";

import { columnIds, columns } from "@/mocks/task.mock";
import { KanbanColumn } from "./kanban-column";
import dynamic from "next/dynamic";
import { KanbanList } from "./kanban-list";
import { KanbanTable } from "./kanban-table";
import { TaskCard } from "./task-card";
import type {
  BoardState,
  ColumnId,
  Task,
  TaskPriority as Priority,
} from "../types/task";
import { findColumnId, findTask } from "../utils/task-board";

const KanbanGantt = dynamic(
  () => import("./kanban-gantt").then((module) => module.KanbanGantt),
  {
    ssr: false,
    loading: () => (
      <p role="status" className="p-4 text-sm text-muted-foreground">
        Loading Gantt…
      </p>
    ),
  },
);

interface KanbanProps {
  initialBoard: BoardState;
}

const kanbanViews = ["board", "list", "table", "gantt"] as const;

type KanbanView = (typeof kanbanViews)[number];

function isKanbanView(value: unknown): value is KanbanView {
  return kanbanViews.includes(value as KanbanView);
}

export function Kanban({ initialBoard }: KanbanProps) {
  const [board, setBoard] = React.useState<BoardState>(initialBoard);

  const [query, setQuery] = React.useState("");
  const [priority, setPriority] = React.useState<Priority | "All">("All");
  const [sort, setSort] = React.useState<"default" | "due" | "priority">(
    "default",
  );
  const [addTo, setAddTo] = React.useState<ColumnId>("ideas");
  const [addOpen, setAddOpen] = React.useState(false);
  const selected = selectTasks(board, { query, priority, sort });
  const visibleBoard = Object.fromEntries(
    columnIds.map((id) => [
      id,
      selected.filter((item) => item.columnId === id).map((item) => item.task),
    ]),
  ) as BoardState;

  function openAdd(columnId: ColumnId) {
    setAddTo(columnId);
    setAddOpen(true);
  }

  function updateVisibleBoard(updated: BoardState) {
    setBoard((current) => mergeVisibleBoard(current, visibleBoard, updated));
  }

  const [columnOrder, setColumnOrder] = React.useState<ColumnId[]>(columnIds);
  const [view, setView] = React.useState<KanbanView>("board");
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [activeColumnId, setActiveColumnId] = React.useState<ColumnId | null>(
    null,
  );
  const boardBeforeDrag = React.useRef<BoardState>(initialBoard);
  const orderedColumns = columnOrder.flatMap(
    (columnId) => columns.find((column) => column.id === columnId) ?? [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "column") return;

    boardBeforeDrag.current = board;
    const task = findTask(board, String(event.active.id));
    setActiveTask(task ?? null);
    setActiveColumnId(findColumnId(board, String(event.active.id)) ?? null);
  }

  function handleDragCancel(event: DragCancelEvent) {
    if (event.active.data.current?.type !== "column") {
      setBoard(boardBeforeDrag.current);
    }
    setActiveTask(null);
    setActiveColumnId(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.type === "column") return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((currentBoard) => {
      const activeColId = findColumnId(currentBoard, activeId);
      const overColId = findColumnId(currentBoard, overId);

      if (overColId) setActiveColumnId(overColId);

      if (!activeColId || !overColId || activeColId === overColId)
        return currentBoard;

      const activeItems = currentBoard[activeColId];
      const overItems = currentBoard[overColId];
      const activeIndex = activeItems.findIndex((task) => task.id === activeId);
      if (activeIndex === -1) return currentBoard;

      const overIndex = overItems.findIndex((task) => task.id === overId);
      const nextIndex = overIndex >= 0 ? overIndex : overItems.length;
      const activeItem = activeItems[activeIndex];
      if (!activeItem) return currentBoard;

      return {
        ...currentBoard,
        [activeColId]: activeItems.filter((task) => task.id !== activeId),
        [overColId]: [
          ...overItems.slice(0, nextIndex),
          activeItem,
          ...overItems.slice(nextIndex),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeType = active.data.current?.type;
    const snapshot = boardBeforeDrag.current;
    setActiveTask(null);
    setActiveColumnId(null);

    if (activeType === "column") {
      if (!over) return;

      const activeColumnId = String(active.id) as ColumnId;
      const overColumnId = findColumnId(board, String(over.id));
      if (!overColumnId || activeColumnId === overColumnId) return;

      setColumnOrder((currentOrder) => {
        const activeIndex = currentOrder.indexOf(activeColumnId);
        const overIndex = currentOrder.indexOf(overColumnId);
        if (activeIndex === -1 || overIndex === -1) return currentOrder;
        return arrayMove(currentOrder, activeIndex, overIndex);
      });
      return;
    }

    if (!over) {
      setBoard(snapshot);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((currentBoard) => {
      const activeColumnId = findColumnId(currentBoard, activeId);
      const overColumnId = findColumnId(currentBoard, overId);
      if (!activeColumnId || !overColumnId || activeColumnId !== overColumnId)
        return currentBoard;

      const columnTasks = currentBoard[activeColumnId];
      const activeIndex = columnTasks.findIndex((task) => task.id === activeId);
      const overIndex = columnTasks.findIndex((task) => task.id === overId);
      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex)
        return currentBoard;

      return {
        ...currentBoard,
        [activeColumnId]: arrayMove(columnTasks, activeIndex, overIndex),
      };
    });
  }

  return (
    <div className="flex h-[calc(100dvh-3rem)] min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 border-b px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            value={view}
            onValueChange={(value) => isKanbanView(value) && setView(value)}
            className="min-w-0"
          >
            <TabsList className="w-fit">
              <TabsTrigger value="board">
                <KanbanIcon />
                Board
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListIcon />
                List
              </TabsTrigger>
              <TabsTrigger value="table">
                <Table2Icon />
                Table
              </TabsTrigger>
              <TabsTrigger value="gantt">
                <ChartGanttIcon />
                Gantt
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-xs text-muted-foreground">Sample data</span>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <InputGroup className="w-full sm:w-52">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder="Search tasks"
              aria-label="Search tasks"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <SlidersHorizontalIcon data-icon="inline-start" />
              Filter{priority !== "All" ? `: ${priority}` : ""}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {(["All", "High", "Medium", "Low"] as const).map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setPriority(option)}
                  >
                    {option === priority ? "✓ " : ""}
                    {option} {option === "All" ? "priorities" : ""}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <ArrowUpDownIcon data-icon="inline-start" />
              Sort
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {(
                  [
                    { value: "default", label: "Board order" },
                    { value: "due", label: "Due date" },
                    { value: "priority", label: "Priority" },
                  ] as const
                ).map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSort(option.value)}
                  >
                    {sort === option.value ? "✓ " : ""}
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => openAdd("ideas")}>
            <PlusIcon data-icon="inline-start" />
            Add task
          </Button>
        </div>
      </div>

      {view === "board" ? (
        <DndContext
          id="kanban-board"
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden bg-muted/25 px-4 pt-4 pb-0 [scrollbar-color:var(--border)_transparent] lg:px-5 lg:pt-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1">
            <div className="inline-grid h-full min-w-full grid-cols-[repeat(5,minmax(20rem,1fr))] gap-4">
              <SortableContext
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                {orderedColumns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={visibleBoard[column.id]}
                    onAdd={openAdd}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <TaskCard
                task={activeTask}
                columnId={activeColumnId ?? undefined}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : null}

      {view === "list" ? (
        <KanbanList
          board={visibleBoard}
          columnOrder={columnOrder}
          onBoardChange={updateVisibleBoard}
          onAdd={openAdd}
        />
      ) : null}

      {view === "table" ? (
        <KanbanTable
          board={board}
          columnOrder={columnOrder}
          onBoardChange={setBoard}
          filters={{ query, priority, sort }}
        />
      ) : null}

      {view === "gantt" ? (
        <KanbanGantt
          board={visibleBoard}
          columnOrder={columnOrder}
          onBoardChange={updateVisibleBoard}
        />
      ) : null}
      <TaskFormDialog
        open={addOpen}
        columnId={addTo}
        onOpenChange={setAddOpen}
        onCreate={(task, columnId) =>
          setBoard((current) => ({
            ...current,
            [columnId]: [...current[columnId], task],
          }))
        }
      />
      <Toaster />
    </div>
  );
}
