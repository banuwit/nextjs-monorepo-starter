"use client";

import { createContext, useContext } from "react";
import { Handle, NodeToolbar, Position, type NodeProps } from "@xyflow/react";
import {
  CheckIcon,
  CircleDashedIcon,
  CopyIcon,
  EyeIcon,
  FlagIcon,
  GitBranchIcon,
  LoaderCircleIcon,
  MessageSquareIcon,
  PackageCheckIcon,
  PencilIcon,
  PlusIcon,
  ShoppingCartIcon,
  SkipForwardIcon,
  SnowflakeIcon,
  Trash2Icon,
  TriangleAlertIcon,
  TruckIcon,
  WalletIcon,
  PackageOpenIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { StepData, StepIcon, StepNode } from "../types/process";

export const ProcessActions = createContext<{
  locked: boolean;
  running: boolean;
  view: (id: string) => void;
  edit: (id: string) => void;
  add: (id?: string) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
} | null>(null);

export const stepIcons: Record<StepIcon, typeof CheckIcon> = {
  order: ShoppingCartIcon,
  payment: WalletIcon,
  branch: GitBranchIcon,
  picking: PackageOpenIcon,
  packing: PackageCheckIcon,
  snowflake: SnowflakeIcon,
  truck: TruckIcon,
  check: FlagIcon,
  alert: TriangleAlertIcon,
  message: MessageSquareIcon,
};

export const stepIconLabels: Record<StepIcon, string> = {
  order: "Order",
  payment: "Payment",
  branch: "Decision",
  picking: "Picking",
  packing: "Packing",
  snowflake: "Cold chain",
  truck: "Delivery",
  check: "Finish",
  alert: "Exception",
  message: "Contact",
};

export const categoryLabels: Record<StepData["category"], string> = {
  start: "Start",
  task: "Task",
  decision: "Decision",
  end: "End",
};

export function StepStatus({ status }: { status: StepData["status"] }) {
  const Icon = {
    Done: CheckIcon,
    Failed: XIcon,
    Skipped: SkipForwardIcon,
    Pending: CircleDashedIcon,
    Active: LoaderCircleIcon,
  }[status];
  return (
    <Badge
      variant={status === "Failed" ? "destructive" : "secondary"}
      className={cn(
        status === "Done" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        status === "Active" && "bg-primary/15 text-primary-text",
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(status === "Active" && "animate-spin")}
      />
      {status}
    </Badge>
  );
}

export function ProcessStep({ id, data, selected }: NodeProps<StepNode>) {
  const actions = useContext(ProcessActions)!;
  const Icon = stepIcons[data.icon];
  const disabled = actions.locked || actions.running;
  const terminal = data.category === "start" || data.category === "end";
  return (
    <>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex gap-1 rounded-lg border bg-popover p-1 shadow-sm"
      >
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="View step"
          title="View step"
          onClick={() => actions.view(id)}
        >
          <EyeIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Edit step"
          title="Edit step"
          disabled={disabled}
          onClick={() => actions.edit(id)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Add step after"
          title="Add step after"
          disabled={disabled || data.category === "end"}
          onClick={() => actions.add(id)}
        >
          <PlusIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Duplicate step"
          title="Duplicate step"
          disabled={disabled || terminal}
          onClick={() => actions.duplicate(id)}
        >
          <CopyIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete step"
          title="Delete step"
          disabled={disabled || data.category === "start"}
          onClick={() => actions.remove(id)}
        >
          <Trash2Icon />
        </Button>
      </NodeToolbar>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "w-60 rounded-lg border bg-card p-2 text-card-foreground shadow-xs transition-[box-shadow,opacity]",
              selected && "border-primary ring-2 ring-primary/20",
              data.status === "Active" && "border-primary shadow-md shadow-primary/20",
              data.status === "Done" && "border-emerald-500/50",
              data.status === "Failed" && "border-destructive/60",
              data.status === "Skipped" && "opacity-55",
              terminal && "rounded-full px-3",
            )}
          >
            {data.category !== "start" && (
              <Handle type="target" position={Position.Left} />
            )}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md border",
                  data.category === "start" && "border-primary bg-primary text-primary-foreground",
                  data.category === "end" && "border-emerald-600 bg-emerald-600 text-white",
                  data.category === "decision" && "border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300",
                  terminal && "rounded-full",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{data.title}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {data.detail}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 border-t pt-2">
              <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="truncate">{data.owner}</span>
                <span aria-hidden="true">·</span>
                <span className="shrink-0 tabular-nums">{data.duration}</span>
              </div>
              <StepStatus status={data.status} />
            </div>
            {data.category === "decision" ? (
              <>
                <Handle
                  id="yes"
                  type="source"
                  position={Position.Right}
                  style={{ top: "30%" }}
                />
                <Handle
                  id="no"
                  type="source"
                  position={Position.Right}
                  style={{ top: "70%" }}
                />
              </>
            ) : (
              data.category !== "end" && (
                <Handle type="source" position={Position.Right} />
              )
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem onClick={() => actions.view(id)}>
              <EyeIcon />
              View step
            </ContextMenuItem>
            <ContextMenuItem
              disabled={disabled}
              onClick={() => actions.edit(id)}
            >
              <PencilIcon />
              Edit step
            </ContextMenuItem>
            <ContextMenuItem
              disabled={disabled || data.category === "end"}
              onClick={() => actions.add(id)}
            >
              <PlusIcon />
              Add step after
            </ContextMenuItem>
            <ContextMenuItem
              disabled={disabled || terminal}
              onClick={() => actions.duplicate(id)}
            >
              <CopyIcon />
              Duplicate
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem
              variant="destructive"
              disabled={disabled || data.category === "start"}
              onClick={() => actions.remove(id)}
            >
              <Trash2Icon />
              Delete step
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
