"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { graphlib, layout } from "@dagrejs/dagre";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useReactFlow,
  useViewport,
  type XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ChevronRightIcon,
  CircleHelpIcon,
  CopyIcon,
  GitBranchIcon,
  HandIcon,
  MinusIcon,
  MoreHorizontalIcon,
  MousePointer2Icon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/toast";
import { flowSteps } from "@/mocks/flow-structure.mock";
import {
  insertStep,
  removeStep,
  simulateRun,
  type FlowStep,
  type RunResult,
} from "../flow-model";
import {
  FlowNode,
  FlowEdge,
  type StepNode,
  type StepEdge,
} from "./flow-elements";
import { StepInspector } from "./step-inspector";

const nodeTypes = { step: FlowNode };
const edgeTypes = { step: FlowEdge };
const notRun: RunResult = { status: "Not run", detail: "No test run yet" };
const models = ["Claude Sonnet 5", "Claude Opus 4.6", "Claude Haiku 4.5"];

function layoutSteps(steps: FlowStep[]): Record<string, XYPosition> {
  const graph = new graphlib.Graph()
    .setGraph({ rankdir: "TB", nodesep: 72, ranksep: 72 })
    .setDefaultEdgeLabel(() => ({}));
  steps.forEach((step) => graph.setNode(step.id, { width: 280, height: 92 }));
  steps.forEach((step) => {
    if (step.parent) graph.setEdge(step.parent, step.id);
  });
  layout(graph);
  return Object.fromEntries(
    steps.map((step) => {
      const node = graph.node(step.id);
      return [step.id, { x: node.x - 140, y: node.y - 46 }];
    }),
  );
}

function FlowEditor() {
  const [steps, setSteps] = useState(flowSteps);
  const [results, setResults] = useState(() => simulateRun(flowSteps));
  const [positions, setPositions] = useState<Record<string, XYPosition>>({});
  const [selectedId, setSelectedId] = useState<string>();
  const [editRequested, setEditRequested] = useState(false);
  const [model, setModel] = useState(models[0]!);
  const [running, setRunning] = useState(false);
  const [pan, setPan] = useState(true);
  const [help, setHelp] = useState(false);
  const [confirm, setConfirm] = useState<
    { type: "delete"; id: string } | { type: "reset" }
  >();
  const [compact, setCompact] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { fitView, zoomIn, zoomOut } = useReactFlow<StepNode, StepEdge>();
  const viewport = useViewport();
  const automaticPositions = useMemo(() => layoutSteps(steps), [steps]);
  const selected = steps.find((step) => step.id === selectedId);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      clearTimeout(timer.current);
    };
  }, []);

  function changeSteps(next: FlowStep[]) {
    setSteps(next);
    setResults({});
    setPositions({});
  }
  function addStep(parent?: string, target?: string) {
    if (running) return;
    const id = `step_${crypto.randomUUID().slice(0, 8)}`;
    const attachTo =
      parent ??
      selectedId ??
      steps.find((step) => !steps.some((child) => child.parent === step.id))
        ?.id;
    if (!attachTo) return;
    changeSteps(insertStep(steps, id, attachTo, target));
    setSelectedId(id);
    toast.add({
      title: "Step added",
      description: "Configure the new step in the details panel.",
      type: "success",
    });
  }
  const nodes: StepNode[] = steps.map((step) => ({
    id: step.id,
    type: "step",
    width: 280,
    height: 90,
    position: positions[step.id] ?? automaticPositions[step.id]!,
    selected: step.id === selectedId,
    data: {
      step,
      result: results[step.id] ?? notRun,
      leaf: !steps.some((child) => child.parent === step.id),
      running,
      edit: () => {
        setEditRequested(true);
        setSelectedId(step.id);
      },
      add: () => addStep(step.id),
      remove: () => setConfirm({ type: "delete", id: step.id }),
    },
  }));
  const edges: StepEdge[] = steps
    .filter((step) => step.parent)
    .map((step) => ({
      id: `${step.parent}-${step.id}`,
      source: step.parent!,
      target: step.id,
      type: "step",
      label: step.branch,
      data: { add: () => addStep(step.parent, step.id), running },
    }));

  function runTest() {
    if (running) return;
    setRunning(true);
    setResults({});
    const outcomes = simulateRun(steps);
    const entries = Object.entries(outcomes);
    let index = 0;
    function tick() {
      const current = entries[index++];
      if (!current) {
        setRunning(false);
        const counts = ["Passed", "Failed", "Skipped"].map(
          (status) =>
            `${entries.filter(([, value]) => value.status === status).length} ${status.toLowerCase()}`,
        );
        toast.add({
          title: "Demo test complete",
          description: counts.join(", "),
          type: "info",
        });
        return;
      }
      const [id, result] = current;
      setResults((previous) => ({
        ...previous,
        [id]: { status: "Running", detail: "Testing step…" },
      }));
      timer.current = setTimeout(
        () => {
          setResults((previous) => ({ ...previous, [id]: result }));
          tick();
        },
        result.status === "Skipped" ? 80 : 450,
      );
    }
    tick();
  }
  async function copyJson() {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          { name: "Collections Agent", model, steps, results },
          null,
          2,
        ),
      );
      toast.add({ title: "Flow copied as JSON", type: "success" });
    } catch {
      toast.add({
        title: "Could not copy the flow",
        description: "Allow clipboard access and try again.",
        type: "error",
      });
    }
  }
  const inspector = selected && (
    <StepInspector
      key={`${selected.id}-${editRequested}-${selected.title}-${selected.detail}-${selected.app}`}
      step={selected}
      result={results[selected.id] ?? notRun}
      nextCount={steps.filter((step) => step.parent === selected.id).length}
      running={running}
      startEditing={editRequested}
      onSave={(updated) =>
        changeSteps(
          steps.map((step) => (step.id === updated.id ? updated : step)),
        )
      }
      onDelete={() => setConfirm({ type: "delete", id: selected.id })}
      onClose={() => setSelectedId(undefined)}
    />
  );

  return (
    <section
      data-slot="app-body"
      aria-label="Flow Structure"
      className="flow-structure mx-auto flex h-[calc(100svh-3rem)] min-h-[520px] w-full min-w-0 flex-col"
    >
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm text-muted-foreground">Flow Structure</span>
          <ChevronRightIcon className="size-3 text-muted-foreground" />
          <h1 className="truncate text-sm font-semibold">Collections Agent</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {steps.length} steps, {steps.filter((step) => step.branch).length}{" "}
            paths
          </span>
          <span className="hidden sm:inline">· Draft 4 by Hanna Berg</span>
          <Badge variant="secondary">Demo</Badge>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Canvas help"
            onClick={() => setHelp(true)}
          >
            <CircleHelpIcon />
          </Button>
          <Select
            value={model}
            disabled={running}
            onValueChange={(value) => {
              if (!value) return;
              setModel(value);
              const firstClaude = steps.find((step) => step.app === "Claude");
              changeSteps(
                steps.map((step) =>
                  step.id === firstClaude?.id
                    ? { ...step, title: value }
                    : step,
                ),
              );
            }}
          >
            <SelectTrigger aria-label="Model">
              <SparklesIcon />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {models.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => addStep()}
            disabled={running}
          >
            <PlusIcon data-icon="inline-start" />
            Add step
          </Button>
          <Button variant="outline" onClick={runTest} disabled={running}>
            <PlayIcon data-icon="inline-start" />
            {running ? "Running…" : "Run test"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Agent actions"
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={copyJson}>
                  <CopyIcon />
                  Copy as JSON
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={running}
                  onClick={() => setConfirm({ type: "reset" })}
                >
                  <RotateCcwIcon />
                  Reset demo
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="relative min-h-0 flex-1">
        <ReactFlow<StepNode, StepEdge>
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.12, maxZoom: 1 }}
          minZoom={0.2}
          maxZoom={2}
          panOnDrag={pan}
          selectionOnDrag={!pan}
          nodesDraggable={!running}
          nodesConnectable={false}
          edgesFocusable={false}
          deleteKeyCode={null}
          onNodeClick={(_, node) => {
            setEditRequested(false);
            setSelectedId(node.id);
          }}
          onPaneClick={() => setSelectedId(undefined)}
          onNodesChange={(changes) => {
            const selections = changes.filter(
              (change) => change.type === "select",
            );
            if (selections.length) {
              const selected = selections.find((change) => change.selected);
              if (selected) setSelectedId(selected.id);
              else if (selections.some((change) => change.id === selectedId))
                setSelectedId(undefined);
            }
            if (
              !changes.some(
                (change) => change.type === "position" && change.position,
              )
            )
              return;
            setPositions((previous) => {
              const next = { ...previous };
              changes.forEach((change) => {
                if (change.type === "position" && change.position)
                  next[change.id] = change.position;
              });
              return next;
            });
          }}
        >
          <Background gap={26} size={1} color="var(--border)" />
          <Panel position="bottom-left">
            <div
              role="group"
              aria-label="Canvas controls"
              className="flex items-center gap-1 rounded-lg border bg-background p-1 shadow-xs"
            >
              <ToggleGroup
                value={[pan ? "pan" : "select"]}
                onValueChange={(value) => {
                  if (value.length) setPan(value[0] === "pan");
                }}
              >
                <ToggleGroupItem value="select" aria-label="Select">
                  <MousePointer2Icon />
                </ToggleGroupItem>
                <ToggleGroupItem value="pan" aria-label="Pan">
                  <HandIcon />
                </ToggleGroupItem>
              </ToggleGroup>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Zoom out"
                onClick={() => zoomOut()}
              >
                <MinusIcon />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Fit flow to view"
                onClick={() => fitView({ padding: 0.12 })}
              >
                {Math.round(viewport.zoom * 100)}%
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Zoom in"
                onClick={() => zoomIn()}
              >
                <PlusIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Tidy tree"
                onClick={() => {
                  setPositions({});
                  requestAnimationFrame(
                    () => void fitView({ padding: 0.12, maxZoom: 1 }),
                  );
                }}
              >
                <GitBranchIcon />
              </Button>
            </div>
          </Panel>
          <Panel position="top-left">
            <p className="text-[10px] text-muted-foreground" role="status">
              {running
                ? "Running recorded test…"
                : "Sample workflow · Changes last until refresh"}
            </p>
          </Panel>
        </ReactFlow>
        {selected && !compact && (
          <aside
            aria-label="Node details"
            className="absolute inset-y-3 right-3 w-80 overflow-auto rounded-xl border bg-background shadow-lg"
          >
            {inspector}
          </aside>
        )}
        <Sheet
          open={Boolean(selected) && compact}
          onOpenChange={(open) => {
            if (!open) setSelectedId(undefined);
          }}
        >
          <SheetContent className="w-full overflow-y-auto sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Node details</SheetTitle>
              <SheetDescription>
                Inspect and configure this workflow step.
              </SheetDescription>
            </SheetHeader>
            {compact && inspector}
          </SheetContent>
        </Sheet>
      </div>
      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Explore the flow</DialogTitle>
            <DialogDescription>
              Pan the canvas by dragging its background. Scroll or use the
              controls to zoom. Select a step to inspect it, drag it to
              reposition, or use a connector’s plus button to insert a step.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tab focuses steps and controls; arrow keys move a focused step. Run
            test replays sample outcomes on the Promised path. No external
            services are called. Copy as JSON exports your current work.
          </p>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(confirm)}
        onOpenChange={(open) => {
          if (!open) setConfirm(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm?.type === "delete"
                ? "Delete this step?"
                : "Reset this flow?"}
            </DialogTitle>
            <DialogDescription>
              {confirm?.type === "delete"
                ? "The next steps will reconnect to the previous step. This cannot be undone."
                : "Your changes will be replaced by the original sample workflow."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(undefined)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm?.type === "delete") {
                  changeSteps(removeStep(steps, confirm.id));
                } else {
                  setSteps(flowSteps);
                  setResults(simulateRun(flowSteps));
                  setPositions({});
                  setModel(models[0]!);
                }
                setSelectedId(undefined);
                setConfirm(undefined);
              }}
            >
              {confirm?.type === "delete" ? "Delete step" : "Reset demo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function FlowStructurePage() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}
