"use client";

import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  reconnectEdge,
  SelectionMode,
  useReactFlow,
  useViewport,
  type Connection,
  type Edge,
  type NodeChange,
} from "@xyflow/react";
import {
  ChevronRightIcon,
  HandIcon,
  KeyboardIcon,
  LockIcon,
  MaximizeIcon,
  MinusIcon,
  MoreHorizontalIcon,
  MousePointer2Icon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  Redo2Icon,
  RotateCcwIcon,
  SkipForwardIcon,
  Undo2Icon,
  UnlockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { initialProcess } from "@/mocks/process.mock";
import {
  canConnect,
  graphReducer,
  removeStep,
  simulateRun,
  stageOrder,
} from "../utils/process";
import type { Graph, RunResult, StepNode } from "../types/process";
import { ProcessActions, ProcessStep } from "./process-step";
import { StepInspector } from "./step-inspector";
import "@xyflow/react/dist/style.css";
import "./process.css";

const nodeTypes = { step: ProcessStep };
const defaultEdgeOptions = { type: "smoothstep", interactionWidth: 20 };
/** Time the replay dwells on each step. */
const STEP_MS = 1100;

export function ProcessPage() {
  return (
    <ReactFlowProvider>
      <ProcessCanvas />
    </ReactFlowProvider>
  );
}

function ProcessCanvas() {
  const [history, dispatch] = useReducer(graphReducer, {
    past: [],
    present: initialProcess,
    future: [],
  });
  const graph = history.present;
  // Replay: `cursor` is how many entries of the recorded run have been reached.
  const run = useMemo(() => simulateRun(graph), [graph]);
  const stages = useMemo(() => stageOrder(graph), [graph]);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [inspector, setInspector] = useState<{
    id: string;
    editing: boolean;
  } | null>(null);
  const [deletion, setDeletion] = useState<{
    kind: "step" | "edge";
    id: string;
  } | null>(null);
  const [tool, setTool] = useState("pan");
  const [locked, setLocked] = useState(false);
  const [snap, setSnap] = useState(true);
  const [minimap, setMinimap] = useState(true);
  const [shortcuts, setShortcuts] = useState(false);
  const dragBefore = useRef<Graph | null>(null);
  const { fitView, zoomIn, zoomOut, screenToFlowPosition } =
    useReactFlow<StepNode>();
  const { zoom } = useViewport();
  const canvas = useRef<HTMLDivElement>(null);

  const finished = cursor >= run.length;
  const running = playing && !finished;
  const reached = run.slice(0, cursor);
  const current = cursor > 0 ? reached[cursor - 1] : undefined;
  const failedAt = reached.find((entry) => entry.result.status === "Failed");

  // Advance the replay while playing; `running` is false once the end is reached.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setCursor((value) => value + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, cursor]);

  // Replay results overlay node data at render time so undo history stays clean.
  const results: Record<string, RunResult> = {};
  reached.forEach((entry, index) => {
    const isCurrent = index === cursor - 1 && running;
    results[entry.id] = isCurrent
      ? { status: "Active", duration: entry.result.duration }
      : entry.result;
  });
  const nodes = graph.nodes.map((node) => {
    const result = results[node.id];
    return result ? { ...node, data: { ...node.data, ...result } } : node;
  });
  const takenEdges = new Set(
    reached.filter((entry) => entry.result.status !== "Skipped" && entry.via).map((entry) => entry.via!),
  );
  const edges = graph.edges.map((edge) => ({
    ...edge,
    animated: takenEdges.has(edge.id) && !finished,
    className: cn(takenEdges.has(edge.id) && "process-edge-taken"),
  }));
  const inspectedNode = nodes.find((node) => node.id === inspector?.id);

  function resetRun() {
    setPlaying(false);
    setCursor(0);
  }

  function commit(next: Graph) {
    if (locked || running) return;
    resetRun();
    dispatch({ type: "commit", graph: next });
  }

  function openInspector(id: string, editing = false) {
    setInspector({ id, editing });
  }

  function togglePlay() {
    if (finished) {
      setCursor(0);
      setPlaying(true);
      return;
    }
    setPlaying(!running);
  }

  function stepForward() {
    if (finished) return;
    setPlaying(false);
    setCursor((value) => value + 1);
  }

  function addStep(afterId?: string) {
    if (locked || running) return;
    const source = graph.nodes.find((node) => node.id === afterId);
    const rect = canvas.current?.getBoundingClientRect();
    const position = source
      ? { x: source.position.x + 300, y: source.position.y + 140 }
      : screenToFlowPosition({
          x: (rect?.left ?? 0) + (rect?.width ?? 800) / 2,
          y: (rect?.top ?? 0) + (rect?.height ?? 600) / 2,
        });
    const node: StepNode = {
      id: crypto.randomUUID(),
      type: "step",
      position,
      data: {
        title: "New step",
        detail: "Describe what happens here",
        category: "task",
        stage: source?.data.stage ?? stages[0] ?? "Order",
        owner: source?.data.owner ?? "Order desk",
        status: "Pending",
        duration: "1m",
        icon: "packing",
      },
    };
    const sourceHandle =
      source?.data.category === "decision" ? "yes" : undefined;
    const edges = source
      ? [
          ...graph.edges,
          {
            id: crypto.randomUUID(),
            source: source.id,
            target: node.id,
            sourceHandle,
            type: "smoothstep",
            ...(sourceHandle ? { label: "Yes" } : {}),
          },
        ]
      : graph.edges;
    commit({
      nodes: [
        ...graph.nodes.map((item) => ({ ...item, selected: false })),
        { ...node, selected: true },
      ],
      edges,
    });
    openInspector(node.id, true);
  }

  function duplicate(id: string) {
    const source = graph.nodes.find((node) => node.id === id);
    if (!source || locked || running) return;
    const node: StepNode = {
      ...source,
      id: crypto.randomUUID(),
      position: { x: source.position.x + 40, y: source.position.y + 140 },
      selected: true,
      data: {
        ...source.data,
        title: `${source.data.title} (copy)`,
        status: "Pending",
      },
    };
    commit({
      ...graph,
      nodes: [
        ...graph.nodes.map((item) => ({ ...item, selected: false })),
        node,
      ],
    });
    openInspector(node.id, true);
  }

  function onNodesChange(changes: NodeChange<StepNode>[]) {
    const safeChanges = changes.filter(
      (change) =>
        change.type !== "remove" &&
        (!locked || change.type === "select" || change.type === "dimensions"),
    );
    const next = {
      ...graph,
      nodes: applyNodeChanges(safeChanges, graph.nodes),
    };
    // A mouse drag is one history entry; keyboard moves commit immediately.
    if (
      !dragBefore.current &&
      safeChanges.some((change) => change.type === "position")
    )
      commit(next);
    else dispatch({ type: "preview", graph: next });
  }

  function edgeLabel(connection: Connection) {
    return connection.sourceHandle === "yes"
      ? "Yes"
      : connection.sourceHandle === "no"
        ? "No"
        : undefined;
  }

  function connect(connection: Connection) {
    if (!canConnect(graph, connection)) return;
    commit({
      ...graph,
      edges: addEdge(
        { ...connection, type: "smoothstep", label: edgeLabel(connection) },
        graph.edges,
      ),
    });
  }

  function onReconnect(edge: Edge, connection: Connection) {
    const otherEdges = graph.edges.filter((item) => item.id !== edge.id);
    if (!canConnect({ ...graph, edges: otherEdges }, connection)) return;
    commit({
      ...graph,
      edges: reconnectEdge(
        { ...edge, label: edgeLabel(connection) },
        connection,
        graph.edges,
      ),
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      (event.target as HTMLElement).closest(
        "input, textarea, select, button, [contenteditable=true], [role=dialog]",
      )
    )
      return;
    const modifier = event.metaKey || event.ctrlKey;
    if (modifier && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (!locked && !running) {
        resetRun();
        dispatch({ type: event.shiftKey ? "redo" : "undo" });
      }
    } else if (event.key === " ") {
      event.preventDefault();
      togglePlay();
    } else if (event.key === "ArrowRight" && !event.shiftKey) {
      event.preventDefault();
      stepForward();
    } else if (event.key === "Escape") setInspector(null);
    else if (!modifier && event.key.toLowerCase() === "v") setTool("select");
    else if (!modifier && event.key.toLowerCase() === "h") setTool("pan");
    else if (!modifier && event.key.toLowerCase() === "f")
      void fitView({ padding: 0.2 });
    else if (
      !locked &&
      !running &&
      (event.key === "Delete" || event.key === "Backspace")
    ) {
      const node = graph.nodes.find((item) => item.selected);
      const edge = graph.edges.find((item) => item.selected);
      if (node || edge) {
        event.preventDefault();
        setDeletion(
          node ? { kind: "step", id: node.id } : { kind: "edge", id: edge!.id },
        );
      }
    }
  }

  const progressLabel = finished
    ? failedAt
      ? `Stopped at “${graph.nodes.find((node) => node.id === failedAt.id)?.data.title}”`
      : "Reached the end"
    : current
      ? `${cursor} of ${run.length} · ${graph.nodes.find((node) => node.id === current.id)?.data.title}`
      : "Press Play to follow the order from start to finish";

  return (
    <div
      className="process flex h-[calc(100svh-4rem)] min-h-128 min-w-0 flex-col overflow-hidden bg-background"
      onKeyDown={onKeyDown}
    >
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Process</span>
          <ChevronRightIcon className="size-4 text-muted-foreground" />
          <h1 className="font-semibold">Order to Delivery</h1>
        </div>
        <Separator orientation="vertical" className="hidden h-5! lg:block" />
        <p className="hidden text-xs text-muted-foreground lg:block">
          {graph.nodes.length} steps, {graph.edges.length} connections, {stages.length} stages
        </p>
        <p className="hidden text-xs text-muted-foreground xl:block" role="status">
          {progressLabel}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts"
            onClick={() => setShortcuts(true)}
          >
            <KeyboardIcon />
          </Button>
          <Button
            variant="outline"
            disabled={locked || running}
            onClick={() => addStep()}
          >
            <PlusIcon data-icon="inline-start" />
            Add step
          </Button>
          <Button onClick={togglePlay} aria-pressed={running}>
            {running ? <PauseIcon data-icon="inline-start" /> : <PlayIcon data-icon="inline-start" />}
            {running ? "Pause" : finished ? "Replay" : cursor > 0 ? "Resume" : "Play process"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next step"
            title="Next step (→)"
            disabled={finished}
            onClick={stepForward}
          >
            <SkipForwardIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Reset run"
            title="Reset run"
            disabled={cursor === 0}
            onClick={resetRun}
          >
            <RotateCcwIcon />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Process actions"
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => void fitView({ padding: 0.2 })}
                >
                  <MaximizeIcon />
                  Fit to view
                </DropdownMenuItem>
                <DropdownMenuCheckboxItem
                  checked={snap}
                  onCheckedChange={setSnap}
                >
                  Snap to grid
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={minimap}
                  onCheckedChange={setMinimap}
                >
                  Show minimap
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={locked}
                  onCheckedChange={setLocked}
                >
                  Lock canvas
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  disabled={locked || running}
                  onClick={() => {
                    commit({
                      ...graph,
                      nodes: graph.nodes.map((node) => {
                        const original = initialProcess.nodes.find(
                          (item) => item.id === node.id,
                        );
                        return original
                          ? { ...node, position: original.position }
                          : node;
                      }),
                    });
                  }}
                >
                  Reset layout
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={locked || running}
                  onClick={() => {
                    commit(initialProcess);
                    setInspector(null);
                    toast.add({ title: "Sample process restored", type: "info" });
                  }}
                >
                  Reset demo
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Stage strip: where the order is on its way from start to finish. */}
      <ol
        className="flex shrink-0 items-stretch gap-1 overflow-x-auto border-b bg-muted/30 px-4 py-2"
        aria-label="Process stages"
      >
        {stages.map((stage, index) => {
          const stageIds = graph.nodes.filter((node) => node.data.stage === stage).map((node) => node.id);
          const stageEntries = reached.filter((entry) => stageIds.includes(entry.id));
          const reachedCount = stageEntries.filter((entry) => entry.result.status !== "Skipped").length;
          const total = run.filter((entry) => stageIds.includes(entry.id) && entry.result.status !== "Skipped").length;
          const active = current ? stageIds.includes(current.id) && !finished : false;
          const failed = stageEntries.some((entry) => entry.result.status === "Failed");
          const done = total > 0 && reachedCount >= total && !active && !failed;
          return (
            <li
              key={stage}
              className={cn(
                "flex min-w-32 flex-1 flex-col gap-1 rounded-md border px-3 py-1.5 text-xs transition-colors",
                active && "border-primary bg-primary/5",
                done && "border-emerald-500/40 bg-emerald-500/5",
                failed && "border-destructive/50 bg-destructive/5",
                !active && !done && !failed && "border-border",
              )}
              aria-current={active ? "step" : undefined}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full text-[10px] font-semibold",
                    active && "bg-primary text-primary-foreground",
                    done && "bg-emerald-600 text-white",
                    failed && "bg-destructive text-white",
                    !active && !done && !failed && "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="font-medium">{stage}</span>
                <span className="ml-auto tabular-nums text-muted-foreground">
                  {reachedCount}/{total}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full transition-[width] duration-500",
                    failed ? "bg-destructive" : done ? "bg-emerald-600" : "bg-primary",
                  )}
                  style={{ width: `${total ? (reachedCount / total) * 100 : 0}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <ProcessActions.Provider
        value={{
          locked,
          running,
          view: (id) => openInspector(id),
          edit: (id) => openInspector(id, true),
          add: addStep,
          duplicate,
          remove: (id) => setDeletion({ kind: "step", id }),
        }}
      >
        <div
          ref={canvas}
          className="relative min-h-0 flex-1"
          aria-label="Process editor"
        >
          <ReactFlow<StepNode>
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodesChange={onNodesChange}
            onEdgesChange={(changes) =>
              dispatch({
                type: "preview",
                graph: {
                  ...graph,
                  edges: applyEdgeChanges(
                    changes.filter((change) => change.type === "select"),
                    graph.edges,
                  ),
                },
              })
            }
            onConnect={connect}
            onReconnect={onReconnect}
            isValidConnection={(connection) =>
              canConnect(
                {
                  ...graph,
                  edges: graph.edges.filter(
                    (edge) =>
                      !("id" in connection && edge.id === connection.id),
                  ),
                },
                connection,
              )
            }
            onNodeDoubleClick={(_, node) => openInspector(node.id)}
            onNodeDragStart={() => {
              dragBefore.current = graph;
            }}
            onNodeDragStop={(_, node) => {
              const next = {
                ...graph,
                nodes: graph.nodes.map((item) =>
                  item.id === node.id
                    ? { ...item, position: node.position, dragging: false }
                    : item,
                ),
              };
              dispatch({
                type: "commit",
                graph: next,
                before: dragBefore.current ?? graph,
              });
              dragBefore.current = null;
            }}
            nodesDraggable={!locked && !running}
            nodesConnectable={!locked && !running}
            edgesReconnectable={!locked && !running}
            deleteKeyCode={null}
            panOnDrag={tool === "pan" ? true : [1, 2]}
            selectionOnDrag={tool === "select"}
            selectionMode={SelectionMode.Partial}
            snapToGrid={snap}
            snapGrid={[20, 20]}
            minZoom={0.2}
            maxZoom={2}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            onPaneClick={() => setInspector(null)}
          >
            <Background gap={20} size={1} />
            {minimap && (
              <MiniMap
                position="bottom-left"
                pannable
                zoomable
                className="hidden sm:block"
                nodeColor="var(--muted)"
                nodeStrokeColor="var(--border)"
                maskColor="color-mix(in srgb, var(--background) 70%, transparent)"
              />
            )}
            <Panel position="bottom-center" className="max-w-[calc(100%-1rem)]">
              <div
                role="group"
                aria-label="Canvas controls"
                className="flex items-center gap-1 overflow-x-auto rounded-xl border bg-background p-1.5 shadow-sm"
              >
                <ToggleGroup
                  value={[tool]}
                  onValueChange={(value) => {
                    if (value[0]) setTool(value[0]);
                  }}
                  aria-label="Canvas tool"
                >
                  <ToggleGroupItem
                    value="select"
                    aria-label="Select tool"
                    title="Select (V)"
                  >
                    <MousePointer2Icon className="size-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="pan"
                    aria-label="Pan tool"
                    title="Pan (H)"
                  >
                    <HandIcon className="size-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                <Separator orientation="vertical" className="mx-1 h-5!" />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Zoom out"
                  onClick={() => void zoomOut()}
                >
                  <MinusIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Zoom level ${Math.round(zoom * 100)}%, fit to view`}
                  title="Fit to view (F)"
                  onClick={() => void fitView({ padding: 0.2 })}
                >
                  {Math.round(zoom * 100)}%
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Zoom in"
                  onClick={() => void zoomIn()}
                >
                  <PlusIcon />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-5!" />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Undo"
                  title="Undo"
                  disabled={locked || running || !history.past.length}
                  onClick={() => {
                    resetRun();
                    dispatch({ type: "undo" });
                  }}
                >
                  <Undo2Icon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Redo"
                  title="Redo"
                  disabled={locked || running || !history.future.length}
                  onClick={() => {
                    resetRun();
                    dispatch({ type: "redo" });
                  }}
                >
                  <Redo2Icon />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-5!" />
                <Button
                  variant={locked ? "secondary" : "ghost"}
                  size="icon-sm"
                  aria-label={locked ? "Unlock canvas" : "Lock canvas"}
                  title={locked ? "Unlock canvas" : "Lock canvas"}
                  onClick={() => setLocked(!locked)}
                >
                  {locked ? <LockIcon /> : <UnlockIcon />}
                </Button>
              </div>
            </Panel>
          </ReactFlow>
          {inspectedNode && inspector && (
            <StepInspector
              key={`${inspectedNode.id}-${inspector.editing}`}
              node={inspectedNode}
              graph={graph}
              order={(() => {
                const index = run.findIndex(
                  (entry) => entry.id === inspectedNode.id && entry.result.status !== "Skipped",
                );
                return index >= 0 ? index + 1 : undefined;
              })()}
              editing={inspector.editing}
              locked={locked || running}
              onEdit={() => openInspector(inspectedNode.id, true)}
              onClose={() => setInspector(null)}
              onSave={(data) => {
                commit({
                  ...graph,
                  nodes: graph.nodes.map((node) =>
                    node.id === inspectedNode.id ? { ...node, data } : node,
                  ),
                });
                openInspector(inspectedNode.id);
              }}
            />
          )}
        </div>
      </ProcessActions.Provider>
      <footer className="flex flex-wrap justify-between gap-1 border-t px-4 py-2 text-[11px] text-muted-foreground">
        <span>
          Demo process · Play replays one recorded order through every step;
          decisions take their “Yes” branch and a failed step stops the run.
          Changes reset when you leave or reload.
        </span>
        <span>Double-click a step to inspect · Right-click for actions</span>
      </footer>
      <AlertDialog
        open={!!deletion}
        onOpenChange={(open) => {
          if (!open) setDeletion(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deletion?.kind === "step" ? "step" : "connection"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletion?.kind === "step"
                ? "This also removes the step’s connections."
                : "This disconnects the two steps."}{" "}
              You can undo this change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={locked || running}
              onClick={() => {
                if (!deletion) return;
                commit(
                  deletion.kind === "step"
                    ? removeStep(graph, deletion.id)
                    : {
                        ...graph,
                        edges: graph.edges.filter(
                          (edge) => edge.id !== deletion.id,
                        ),
                      },
                );
                if (inspector?.id === deletion.id) setInspector(null);
                setDeletion(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={shortcuts} onOpenChange={setShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard shortcuts</DialogTitle>
            <DialogDescription>
              Use these while the process canvas is focused.
            </DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt>Play / Pause</dt>
            <dd>Space</dd>
            <dt>Next step</dt>
            <dd>→</dd>
            <dt>Undo / Redo</dt>
            <dd>⌘ / Ctrl + Z / Shift + Z</dd>
            <dt>Select / Pan</dt>
            <dd>V / H</dd>
            <dt>Fit to view</dt>
            <dd>F</dd>
            <dt>Delete selection</dt>
            <dd>Delete / Backspace</dd>
            <dt>Close inspector</dt>
            <dd>Escape</dd>
          </dl>
        </DialogContent>
      </Dialog>
    </div>
  );
}
