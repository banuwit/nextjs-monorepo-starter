"use client";

import { useReducer, useRef, useState, type KeyboardEvent } from "react";
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
  CheckIcon,
  ChevronRightIcon,
  HandIcon,
  KeyboardIcon,
  LockIcon,
  MaximizeIcon,
  MinusIcon,
  MoreHorizontalIcon,
  MousePointer2Icon,
  PlusIcon,
  Redo2Icon,
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
import { initialProcess } from "@/mocks/process.mock";
import {
  canConnect,
  graphReducer,
  removeStep,
  serializeGraph,
} from "../utils/process";
import type { Graph, StepNode } from "../types/process";
import { ProcessActions, ProcessStep } from "./process-step";
import { StepInspector } from "./step-inspector";
import "@xyflow/react/dist/style.css";
import "./process.css";

const nodeTypes = { step: ProcessStep };
const defaultEdgeOptions = { type: "smoothstep", interactionWidth: 20 };

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
  const [saved, setSaved] = useState(() => serializeGraph(initialProcess));
  const [updated, setUpdated] = useState(false);
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
  const dirty = saved !== serializeGraph(graph);
  const inspectedNode = graph.nodes.find((node) => node.id === inspector?.id);

  function commit(next: Graph) {
    if (!locked) dispatch({ type: "commit", graph: next });
  }

  function openInspector(id: string, editing = false) {
    setInspector({ id, editing });
  }

  function addStep(afterId?: string) {
    if (locked) return;
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
        title: "New action",
        detail: "Configure this step",
        category: "action",
        owner: "Ines Marchetti",
        status: "Idle",
        duration: "Not run",
        icon: "deal",
      },
    };
    const sourceHandle =
      source?.data.category === "condition" ? "yes" : undefined;
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
    if (!source || locked) return;
    const node: StepNode = {
      ...source,
      id: crypto.randomUUID(),
      position: { x: source.position.x + 40, y: source.position.y + 140 },
      selected: true,
      data: {
        ...source.data,
        title: `${source.data.title} (copy)`,
        status: "Idle",
        duration: "Not run",
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

  function updateWorkflow() {
    setSaved(serializeGraph(graph));
    setUpdated(true);
    toast.add({
      title: "Workflow updated",
      description:
        "Demo changes are kept for this page session. No automation is executed.",
      type: "success",
    });
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

  function connect(connection: Connection) {
    if (!canConnect(graph, connection)) return;
    const label =
      connection.sourceHandle === "yes"
        ? "Yes"
        : connection.sourceHandle === "no"
          ? "No"
          : undefined;
    commit({
      ...graph,
      edges: addEdge({ ...connection, type: "smoothstep", label }, graph.edges),
    });
  }

  function onReconnect(edge: Edge, connection: Connection) {
    const otherEdges = graph.edges.filter((item) => item.id !== edge.id);
    if (!canConnect({ ...graph, edges: otherEdges }, connection)) return;
    const label =
      connection.sourceHandle === "yes"
        ? "Yes"
        : connection.sourceHandle === "no"
          ? "No"
          : undefined;
    commit({
      ...graph,
      edges: reconnectEdge({ ...edge, label }, connection, graph.edges),
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      (event.target as HTMLElement).closest(
        "input, textarea, select, [contenteditable=true], [role=dialog]",
      )
    )
      return;
    const modifier = event.metaKey || event.ctrlKey;
    if (modifier && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (!locked) dispatch({ type: event.shiftKey ? "redo" : "undo" });
    } else if (modifier && event.key.toLowerCase() === "s") {
      event.preventDefault();
      if (dirty && !locked) updateWorkflow();
    } else if (event.key === "Escape") setInspector(null);
    else if (!modifier && event.key.toLowerCase() === "v") setTool("select");
    else if (!modifier && event.key.toLowerCase() === "h") setTool("pan");
    else if (!modifier && event.key.toLowerCase() === "f")
      void fitView({ padding: 0.2 });
    else if (!locked && (event.key === "Delete" || event.key === "Backspace")) {
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

  return (
    <div
      className="process flex h-[calc(100svh-4rem)] min-h-128 min-w-0 flex-col overflow-hidden bg-background"
      onKeyDown={onKeyDown}
    >
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Process</span>
          <ChevronRightIcon className="size-4 text-muted-foreground" />
          <h1 className="font-semibold">Lead Routing</h1>
        </div>
        <Separator orientation="vertical" className="hidden h-5! lg:block" />
        <p className="hidden text-xs text-muted-foreground lg:block">
          {graph.nodes.length} steps, {graph.edges.length} connections
        </p>
        <p className="hidden text-xs text-muted-foreground xl:block">
          {dirty
            ? "Unsaved changes"
            : updated
              ? "Updated just now"
              : "Edited 2h ago by Ines Marchetti"}
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
          <Button variant="outline" disabled={locked} onClick={() => addStep()}>
            <PlusIcon data-icon="inline-start" />
            Add step
          </Button>
          <Button disabled={!dirty || locked} onClick={updateWorkflow}>
            <CheckIcon data-icon="inline-start" />
            Update
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Workflow actions"
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
                  disabled={locked}
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <ProcessActions.Provider
        value={{
          locked,
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
          aria-label="Workflow editor"
        >
          <ReactFlow<StepNode>
            nodes={graph.nodes}
            edges={graph.edges}
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
            nodesDraggable={!locked}
            nodesConnectable={!locked}
            edgesReconnectable={!locked}
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
                  disabled={locked || !history.past.length}
                  onClick={() => dispatch({ type: "undo" })}
                >
                  <Undo2Icon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Redo"
                  title="Redo"
                  disabled={locked || !history.future.length}
                  onClick={() => dispatch({ type: "redo" })}
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
              editing={inspector.editing}
              locked={locked}
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
        <span>Demo workflow · Changes reset when you leave or reload.</span>
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
              disabled={locked}
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
              Use these while the workflow canvas is focused.
            </DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt>Undo / Redo</dt>
            <dd>⌘ / Ctrl + Z / Shift + Z</dd>
            <dt>Update workflow</dt>
            <dd>⌘ / Ctrl + S</dd>
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
