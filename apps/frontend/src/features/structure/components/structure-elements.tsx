"use client";

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  Position,
  getSmoothStepPath,
  type EdgeProps,
  type Node,
  type NodeProps,
  type Edge,
} from "@xyflow/react";
import {
  MapPinIcon,
  MoreHorizontalIcon,
  PlusIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Employee } from "../types/structure";
import { departmentTone, initials } from "../utils/structure";

export function EmployeeAvatar({
  employee,
  className,
}: {
  employee: Employee;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-9 rounded-lg", className)}>
      <AvatarFallback
        className={cn("rounded-lg text-xs font-semibold", departmentTone[employee.department])}
      >
        {initials(employee.name) || "?"}
      </AvatarFallback>
    </Avatar>
  );
}

export type EmployeeNode = Node<
  {
    employee: Employee;
    /** Direct reports and everyone below them. */
    reports: { direct: number; total: number };
    leaf: boolean;
    edit: () => void;
    add: () => void;
    remove: () => void;
  },
  "employee"
>;

export const EmployeeCard = memo(function EmployeeCard({
  data,
  selected,
}: NodeProps<EmployeeNode>) {
  const { employee, reports } = data;
  return (
    <>
      {employee.parent && (
        <Handle type="target" position={Position.Top} isConnectable={false} />
      )}
      <div
        className={cn(
          "w-[280px] rounded-lg border bg-card shadow-xs",
          selected && "ring-2 ring-primary",
        )}
      >
        <div className="flex items-center gap-2.5 p-2.5">
          <EmployeeAvatar employee={employee} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{employee.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {employee.title}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  className="nodrag"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={`Actions for ${employee.name}`}
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(event) => event.stopPropagation()}>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={data.edit}>
                  Edit employee
                </DropdownMenuItem>
                <DropdownMenuItem onClick={data.add}>
                  Add direct report
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!employee.parent}
                  variant="destructive"
                  onClick={data.remove}
                >
                  Remove position
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex h-8 items-center gap-1.5 rounded-b-lg border-t bg-muted/35 px-2.5 text-[11px] text-muted-foreground">
          <span
            className={cn(
              "rounded-full px-1.5 py-px font-medium",
              departmentTone[employee.department],
            )}
          >
            {employee.department}
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPinIcon className="size-3 shrink-0" aria-hidden="true" />
            {employee.location || "—"}
          </span>
          {reports.direct > 0 && (
            <span
              className="ml-auto flex shrink-0 items-center gap-1"
              title={`${reports.direct} direct, ${reports.total} total`}
            >
              <UsersRoundIcon className="size-3" aria-hidden="true" />
              {reports.direct}
              {reports.total > reports.direct && (
                <span className="text-muted-foreground/70">/ {reports.total}</span>
              )}
            </span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
      {data.leaf && (
        <div className="absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center">
          <div className="h-5 w-px bg-border" />
          <Button
            size="icon-xs"
            variant="outline"
            className="nodrag rounded-full"
            aria-label={`Add a direct report under ${employee.name}`}
            onClick={(event) => {
              event.stopPropagation();
              data.add();
            }}
          >
            <PlusIcon />
          </Button>
        </div>
      )}
    </>
  );
});

export type ReportingEdge = Edge<{ add: () => void }, "reporting">;

/** Manager → report line; the plus inserts a position between the two. */
export function ReportingLine(props: EdgeProps<ReportingEdge>) {
  const [path, x, y] = getSmoothStepPath({ ...props, borderRadius: 8 });
  return (
    <>
      <BaseEdge
        id={props.id}
        path={path}
        style={{ stroke: "var(--border)", strokeWidth: 1.5 }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute flex items-center gap-1"
          style={{
            transform: `translate(-50%, -50%) translate(${x}px,${y}px)`,
          }}
        >
          <Button
            size="icon-xs"
            variant="outline"
            className="structure-edge-add rounded-full"
            aria-label="Insert a position between these two"
            onClick={(event) => {
              event.stopPropagation();
              props.data?.add();
            }}
          >
            <PlusIcon />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
