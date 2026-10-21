"use client";

import { createContext, useContext } from "react";
import { Handle, NodeToolbar, Position, type NodeProps } from "@xyflow/react";
import {
  BriefcaseBusinessIcon,
  CheckIcon,
  CircleIcon,
  CopyIcon,
  EyeIcon,
  GitBranchIcon,
  MessageSquareIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SkipForwardIcon,
  Trash2Icon,
  WebhookIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { StepData, StepNode } from "../flow-model";

export const FlowActions = createContext<{
  locked: boolean;
  view: (id: string) => void;
  edit: (id: string) => void;
  add: (id?: string) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
} | null>(null);

export const stepIcons = {
  webhook: WebhookIcon,
  branch: GitBranchIcon,
  search: SearchIcon,
  message: MessageSquareIcon,
  deal: BriefcaseBusinessIcon,
};

export function StepStatus({ status }: { status: StepData["status"] }) {
  const Icon = {
    Success: CheckIcon,
    Failed: XIcon,
    Skipped: SkipForwardIcon,
    Idle: CircleIcon,
  }[status];
  return (
    <Badge variant={status === "Failed" ? "destructive" : "secondary"}>
      <Icon aria-hidden="true" />
      {status}
    </Badge>
  );
}

export function FlowStep({ id, data, selected }: NodeProps<StepNode>) {
  const actions = useContext(FlowActions)!;
  const Icon = stepIcons[data.icon];
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
          disabled={actions.locked}
          onClick={() => actions.edit(id)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Add step after"
          title="Add step after"
          disabled={actions.locked}
          onClick={() => actions.add(id)}
        >
          <PlusIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Duplicate step"
          title="Duplicate step"
          disabled={actions.locked}
          onClick={() => actions.duplicate(id)}
        >
          <CopyIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete step"
          title="Delete step"
          disabled={actions.locked}
          onClick={() => actions.remove(id)}
        >
          <Trash2Icon />
        </Button>
      </NodeToolbar>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "w-60 rounded-lg border bg-card p-2 text-card-foreground shadow-xs",
              selected && "border-primary ring-2 ring-primary/20",
            )}
          >
            {data.category !== "trigger" && (
              <Handle type="target" position={Position.Left} />
            )}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md border",
                  data.category === "trigger" &&
                    "border-primary bg-primary text-primary-foreground",
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
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Avatar className="size-4" title={data.owner}>
                  <AvatarFallback>
                    {data.owner
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{data.duration}</span>
              </div>
              <StepStatus status={data.status} />
            </div>
            {data.category === "condition" ? (
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
              <Handle type="source" position={Position.Right} />
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
              disabled={actions.locked}
              onClick={() => actions.edit(id)}
            >
              <PencilIcon />
              Edit step
            </ContextMenuItem>
            <ContextMenuItem
              disabled={actions.locked}
              onClick={() => actions.add(id)}
            >
              <PlusIcon />
              Add step after
            </ContextMenuItem>
            <ContextMenuItem
              disabled={actions.locked}
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
              disabled={actions.locked}
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
