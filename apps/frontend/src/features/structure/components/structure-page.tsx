"use client";

import { useEffect, useMemo, useState } from "react";
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
import "./structure.css";
import {
  ChevronRightIcon,
  CircleHelpIcon,
  CopyIcon,
  GitBranchIcon,
  HandIcon,
  MinusIcon,
  MoreHorizontalIcon,
  MousePointer2Icon,
  PlusIcon,
  RotateCcwIcon,
  UserRoundPlusIcon,
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/toast";
import { structureEmployees } from "@/mocks/structure.mock";
import {
  directReports,
  insertEmployee,
  removeEmployee,
  reportingLine,
  totalReports,
} from "../utils/structure";
import type { Employee } from "../types/structure";
import {
  EmployeeCard,
  ReportingLine,
  type EmployeeNode,
  type ReportingEdge,
} from "./structure-elements";
import { EmployeeInspector } from "./employee-inspector";

const nodeTypes = { employee: EmployeeCard };
const edgeTypes = { reporting: ReportingLine };

function layoutTree(employees: Employee[]): Record<string, XYPosition> {
  const graph = new graphlib.Graph()
    .setGraph({ rankdir: "TB", nodesep: 48, ranksep: 72 })
    .setDefaultEdgeLabel(() => ({}));
  employees.forEach((employee) =>
    graph.setNode(employee.id, { width: 280, height: 92 }),
  );
  employees.forEach((employee) => {
    if (employee.parent) graph.setEdge(employee.parent, employee.id);
  });
  layout(graph);
  return Object.fromEntries(
    employees.map((employee) => {
      const node = graph.node(employee.id);
      return [employee.id, { x: node.x - 140, y: node.y - 46 }];
    }),
  );
}

function StructureEditor() {
  const [employees, setEmployees] = useState(structureEmployees);
  const [positions, setPositions] = useState<Record<string, XYPosition>>({});
  const [selectedId, setSelectedId] = useState<string>();
  const [editRequested, setEditRequested] = useState(false);
  const [pan, setPan] = useState(true);
  const [help, setHelp] = useState(false);
  const [confirm, setConfirm] = useState<
    { type: "delete"; id: string } | { type: "reset" }
  >();
  const [compact, setCompact] = useState(false);
  const { fitView, zoomIn, zoomOut } = useReactFlow<EmployeeNode, ReportingEdge>();
  const viewport = useViewport();
  const automaticPositions = useMemo(() => layoutTree(employees), [employees]);
  const selected = employees.find((employee) => employee.id === selectedId);
  const departmentCount = new Set(employees.map((employee) => employee.department)).size;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function changeEmployees(next: Employee[]) {
    setEmployees(next);
    setPositions({});
  }
  function addEmployee(parent?: string, target?: string) {
    const id = `emp_${crypto.randomUUID().slice(0, 8)}`;
    const attachTo = parent ?? selectedId ?? employees.find((employee) => !employee.parent)?.id;
    if (!attachTo) return;
    changeEmployees(insertEmployee(employees, id, attachTo, target));
    setEditRequested(true);
    setSelectedId(id);
    toast.add({
      title: "Position added",
      description: "Fill in the employee in the details panel.",
      type: "success",
    });
  }
  const nodes: EmployeeNode[] = employees.map((employee) => ({
    id: employee.id,
    type: "employee",
    width: 280,
    height: 90,
    position: positions[employee.id] ?? automaticPositions[employee.id]!,
    selected: employee.id === selectedId,
    data: {
      employee,
      reports: {
        direct: directReports(employees, employee.id).length,
        total: totalReports(employees, employee.id),
      },
      leaf: !employees.some((report) => report.parent === employee.id),
      edit: () => {
        setEditRequested(true);
        setSelectedId(employee.id);
      },
      add: () => addEmployee(employee.id),
      remove: () => setConfirm({ type: "delete", id: employee.id }),
    },
  }));
  const edges: ReportingEdge[] = employees
    .filter((employee) => employee.parent)
    .map((employee) => ({
      id: `${employee.parent}-${employee.id}`,
      source: employee.parent!,
      target: employee.id,
      type: "reporting",
      data: { add: () => addEmployee(employee.parent, employee.id) },
    }));

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ name: "Heron Run", employees }, null, 2),
      );
      toast.add({ title: "Organisation copied as JSON", type: "success" });
    } catch {
      toast.add({
        title: "Could not copy the organisation",
        description: "Allow clipboard access and try again.",
        type: "error",
      });
    }
  }
  const inspector = selected && (
    <EmployeeInspector
      key={`${selected.id}-${editRequested}-${selected.name}-${selected.title}-${selected.department}`}
      employee={selected}
      manager={employees.find((employee) => employee.id === selected.parent)}
      line={reportingLine(employees, selected.id)}
      reports={directReports(employees, selected.id)}
      startEditing={editRequested}
      onSave={(updated) =>
        changeEmployees(
          employees.map((employee) =>
            employee.id === updated.id ? updated : employee,
          ),
        )
      }
      onDelete={() => setConfirm({ type: "delete", id: selected.id })}
      onClose={() => setSelectedId(undefined)}
      onSelect={(id) => {
        setEditRequested(false);
        setSelectedId(id);
      }}
    />
  );

  return (
    <section
      data-slot="app-body"
      aria-label="Structure"
      className="structure mx-auto flex h-[calc(100svh-3rem)] min-h-[520px] w-full min-w-0 flex-col"
    >
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm text-muted-foreground">Structure</span>
          <ChevronRightIcon className="size-3 text-muted-foreground" />
          <h1 className="truncate text-sm font-semibold">Heron Run organisation</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {employees.length} employees, {departmentCount} departments
          </span>
          <span className="hidden sm:inline">· Updated by Sofia Rahmawati</span>
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
          <Button variant="outline" onClick={() => addEmployee()}>
            <UserRoundPlusIcon data-icon="inline-start" />
            Add employee
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Organisation actions"
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
                <DropdownMenuItem onClick={() => setConfirm({ type: "reset" })}>
                  <RotateCcwIcon />
                  Reset demo
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="relative min-h-0 flex-1">
        <ReactFlow<EmployeeNode, ReportingEdge>
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
              const picked = selections.find((change) => change.selected);
              if (picked) setSelectedId(picked.id);
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
                aria-label="Fit chart to view"
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
              Sample organisation · Changes last until refresh
            </p>
          </Panel>
        </ReactFlow>
        {selected && !compact && (
          <aside
            aria-label="Employee details"
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
              <SheetTitle>Employee details</SheetTitle>
              <SheetDescription>
                Inspect and edit this position in the organisation.
              </SheetDescription>
            </SheetHeader>
            {compact && inspector}
          </SheetContent>
        </Sheet>
      </div>
      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Explore the organisation</DialogTitle>
            <DialogDescription>
              Pan the canvas by dragging its background. Scroll or use the
              controls to zoom. Select an employee to see their manager,
              reporting line, and direct reports; drag a card to reposition it.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            The plus under a card adds a direct report; the plus on a line
            inserts a position between a manager and their report. Removing a
            position moves its reports up one level. Tab focuses cards and
            controls; arrow keys move a focused card. Copy as JSON exports the
            current tree.
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
                ? "Remove this position?"
                : "Reset the organisation?"}
            </DialogTitle>
            <DialogDescription>
              {confirm?.type === "delete"
                ? "Their direct reports will report to their manager instead. This cannot be undone."
                : "Your changes will be replaced by the original sample organisation."}
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
                  changeEmployees(removeEmployee(employees, confirm.id));
                } else {
                  setEmployees(structureEmployees);
                  setPositions({});
                }
                setSelectedId(undefined);
                setConfirm(undefined);
              }}
            >
              {confirm?.type === "delete" ? "Remove position" : "Reset demo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function StructurePage() {
  return (
    <ReactFlowProvider>
      <StructureEditor />
    </ReactFlowProvider>
  );
}
