"use client";

import { GripVertical } from "lucide-react";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { ColumnDragHandleContext } from "./data-grid-column-dnd";

export function DataGridHeaderDrag({ title }: { title: string }) {
  const context = useContext(ColumnDragHandleContext);
  if (!context) return <span>{title}</span>;
  const { attributes, listeners, setHandleNode } = context;

  return (
    <Button
      ref={setHandleNode}
      variant="ghost"
      size="sm"
      {...attributes}
      {...listeners}
      aria-label={`Move ${title} column`}
      aria-roledescription="draggable column"
      className="-ml-2 touch-none cursor-grab gap-2 active:cursor-grabbing"
    >
      <GripVertical data-icon="inline-start" className="text-muted-foreground" />
      {title}
    </Button>
  );
}
