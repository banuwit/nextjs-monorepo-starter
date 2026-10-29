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
  CheckCircle2Icon,
  CircleXIcon,
  CodeIcon,
  CreditCardIcon,
  DatabaseIcon,
  HashIcon,
  ListChecksIcon,
  LoaderCircleIcon,
  MailIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { StructureApp, StructureStep, RunResult } from "../types/structure";

const icons = {
  Stripe: CreditCardIcon,
  Neon: DatabaseIcon,
  Claude: SparklesIcon,
  ClickUp: ListChecksIcon,
  Resend: MailIcon,
  "Custom Code": CodeIcon,
  Slack: HashIcon,
};

export function AppIcon({ app }: { app: StructureApp }) {
  const Icon = icons[app];
  return (
    <span
      className="structure-app-icon flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background"
      data-app={app}
    >
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

export type StepNode = Node<
  {
    step: StructureStep;
    result: RunResult;
    leaf: boolean;
    running: boolean;
    edit: () => void;
    add: () => void;
    remove: () => void;
  },
  "step"
>;
export const StructureNode = memo(function StructureNode({
  data,
  selected,
}: NodeProps<StepNode>) {
  const { step, result } = data;
  const StatusIcon =
    result.status === "Passed"
      ? CheckCircle2Icon
      : result.status === "Failed"
        ? CircleXIcon
        : result.status === "Running"
          ? LoaderCircleIcon
          : MinusIcon;
  return (
    <>
      {step.parent && (
        <Handle type="target" position={Position.Top} isConnectable={false} />
      )}
      <div
        className={cn(
          "w-[280px] rounded-lg border bg-card shadow-xs",
          selected && "ring-2 ring-primary",
        )}
      >
        <div className="flex items-center gap-2.5 p-2.5">
          <AppIcon app={step.app} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{step.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {step.detail}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  className="nodrag"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={`Actions for ${step.title}`}
                  disabled={data.running}
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(event) => event.stopPropagation()}>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={data.edit}>
                  Edit step
                </DropdownMenuItem>
                <DropdownMenuItem onClick={data.add}>
                  Add step after
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!step.parent}
                  variant="destructive"
                  onClick={data.remove}
                >
                  Delete step
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          className="flex h-8 items-center gap-1.5 rounded-b-lg border-t bg-muted/35 px-2.5 text-[11px] text-muted-foreground"
          title={result.status}
        >
          <StatusIcon
            aria-label={result.status}
            className={cn(
              "size-3.5 shrink-0",
              result.status === "Passed" && "text-emerald-600",
              result.status === "Failed" && "text-destructive",
              result.status === "Running" && "animate-spin",
            )}
          />
          <span className="truncate">{result.detail}</span>
          {result.metric && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{result.metric}</span>
            </>
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
            aria-label={`Add a step after ${step.title}`}
            onClick={(event) => {
              event.stopPropagation();
              data.add();
            }}
            disabled={data.running}
          >
            <PlusIcon />
          </Button>
        </div>
      )}
    </>
  );
});

export type StepEdge = Edge<{ add: () => void; running: boolean }, "step">;
export function StructureEdge(props: EdgeProps<StepEdge>) {
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
          {props.label && (
            <span className="rounded border bg-background px-1.5 py-0.5 text-[10px]">
              {props.label}
            </span>
          )}
          <Button
            size="icon-xs"
            variant="outline"
            className="structure-edge-add rounded-full"
            aria-label={
              props.label
                ? `Add a step on the ${props.label} path`
                : "Add a step here"
            }
            onClick={(event) => {
              event.stopPropagation();
              props.data?.add();
            }}
            disabled={props.data?.running}
          >
            <PlusIcon />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
