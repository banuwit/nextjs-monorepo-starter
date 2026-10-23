import { useState } from "react";
import { cn } from "cn";
import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  CircleDashed,
  CircleGauge,
  Clock3,
  Copy,
  EllipsisVertical,
  FileText,
  Plus,
  RefreshCw,
  Settings,
  SquareTerminal,
  Terminal,
} from "lucide-react";

import { PlatformIcon } from "./platform-icon";
import {
  copyInfrastructureValue,
  previewCloudAction,
} from "./infrastructure-actions";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  InfrastructureEnvironment,
  InfrastructureGroup,
} from "../types/infrastructure";

export function ProjectEnvironments({
  group,
  onRefresh,
}: {
  group: InfrastructureGroup;
  onRefresh: () => void;
}) {
  return (
    <Collapsible
      defaultOpen
      className="flex flex-col overflow-hidden rounded-xl border bg-card py-3 text-card-foreground data-open:gap-3 data-open:pb-0"
    >
      <div className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center">
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              className="group -ml-2 h-auto w-full justify-start gap-2 px-2 py-1 hover:bg-transparent aria-expanded:bg-transparent sm:flex-1"
            />
          }
        >
          <ChevronDown className="group-data-panel-open:rotate-180" />
          <div className="flex min-w-0 items-baseline gap-1.5 text-left">
            <span className="shrink-0 font-medium leading-none">
              {group.organization}
            </span>
            <span className="min-w-0 truncate text-muted-foreground text-sm">
              ({group.name})
            </span>
          </div>
        </CollapsibleTrigger>
        <div className="flex w-full items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-1.5 sm:ml-0"
            onClick={() => previewCloudAction("Add Environment")}
          >
            <Plus data-icon="inline-start" />
            Add Environment
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Actions for ${group.name}`}
                />
              }
            >
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                {group.rows.length > 0 ? (
                  <DropdownMenuItem
                    onClick={() => previewCloudAction("Activity Logs")}
                  >
                    <FileText />
                    Activity Logs
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem
                  onClick={() => previewCloudAction("Open Console")}
                >
                  <Terminal />
                  Open Console
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => previewCloudAction("Project Settings")}
                >
                  <Settings />
                  Project Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRefresh}>
                  <RefreshCw />
                  Sync Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => previewCloudAction("Manage Alerts")}
                >
                  <Bell />
                  Manage Alerts
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    copyInfrastructureValue(
                      `demo-${group.name.toLowerCase().replaceAll(" ", "-")}`,
                    )
                  }
                >
                  <Copy />
                  Copy Project ID
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CollapsibleContent>
        {group.rows.length > 0 ? (
          <EnvironmentTable rows={group.rows} />
        ) : (
          <EmptyProjectState />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function EnvironmentTable({ rows }: { rows: InfrastructureEnvironment[] }) {
  const [descending, setDescending] = useState(false);
  const sortedRows = [...rows].sort(
    (a, b) => (descending ? -1 : 1) * a.domain.localeCompare(b.domain),
  );
  return (
    <div className="scrollbar-thin overflow-x-auto [scrollbar-color:var(--border)_transparent] **:data-[slot=table-container]:overflow-visible [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1">
      <Table
        aria-label="Project environments"
        className="min-w-[1700px] table-fixed **:data-[slot='table-cell']:px-5 **:data-[slot='table-head']:px-5"
      >
        <colgroup>
          <col className="w-90" />
          <col className="w-40" />
          <col className="w-42" />
          <col className="w-35" />
          <col className="w-35" />
          <col className="w-38" />
          <col className="w-98" />
          <col className="w-55" />
          <col className="w-18" />
        </colgroup>
        <TableHeader className="bg-muted/50 [&_tr]:border-y">
          <TableRow>
            <TableHead
              className="font-medium"
              aria-sort={descending ? "descending" : "ascending"}
            >
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2"
                onClick={() => setDescending(!descending)}
              >
                Domain <ArrowUpDown data-icon="inline-end" />
              </Button>
            </TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead>Uptime</TableHead>
            <TableHead>Resources</TableHead>
            <TableHead>Server</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="**:data-[slot='table-row']:hover:bg-transparent">
          {sortedRows.map((row) => (
            <TableRow key={row.domain}>
              <TableCell>
                <span className="block truncate font-medium" title={row.domain}>
                  {row.domain}
                </span>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2 font-medium text-muted-foreground">
                  <PlatformIcon name={row.platform.name} />
                  {row.platform.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    row.environment === "Expired" ? "destructive" : "secondary"
                  }
                  className={cn(
                    "rounded-sm px-1.5 py-0.5",
                    row.environment === "Production" &&
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    row.environment === "Staging" &&
                      "bg-sky-500/10 text-sky-600 dark:text-sky-400",
                  )}
                >
                  {row.environment}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    row.status === "Online" ? "secondary" : "destructive"
                  }
                  className={cn(
                    "rounded-sm px-1.5 py-0.5",
                    row.status === "Online" &&
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      row.status === "Online"
                        ? "bg-emerald-500"
                        : "bg-destructive",
                    )}
                  />
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                  <CircleGauge className="size-4" />
                  {row.latency}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground tabular-nums">
                  <Clock3 className="size-4" />
                  {row.uptime}
                </span>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-3 gap-4">
                  <ResourceMeter label="CPU" value={row.resources.cpu} />
                  <ResourceMeter label="RAM" value={row.resources.ram} />
                  <ResourceMeter label="Disk" value={row.resources.disk} />
                </div>
              </TableCell>
              <TableCell>
                <span className="flex flex-col font-medium">
                  {row.server}
                  <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <CountryFlag code={row.countryCode} />
                    {row.countryCode} · {row.plan}
                  </span>
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="-mr-2"
                        aria-label={`Actions for ${row.domain}`}
                      />
                    }
                  >
                    <SquareTerminal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => previewCloudAction("View Logs")}
                      >
                        <FileText />
                        View Logs
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => previewCloudAction("Open Console")}
                      >
                        <Terminal />
                        Open Console
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => previewCloudAction("Restart")}
                      >
                        <RefreshCw />
                        Restart
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          copyInfrastructureValue(`https://${row.domain}`)
                        }
                      >
                        <Copy />
                        Copy URL
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ResourceMeter({ label, value }: { label: string; value: number }) {
  const isCritical = value >= 70;
  const isWarning = value >= 55;

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-medium text-emerald-600 tabular-nums dark:text-emerald-400",
            isWarning && "text-amber-600 dark:text-amber-400",
            isCritical && "text-destructive",
          )}
        >
          {value}%
        </span>
      </span>
      <Progress
        aria-label={label}
        value={value}
        className={cn(
          "**:data-[slot=progress-track]:h-1.5 **:data-[slot=progress-indicator]:bg-emerald-500",
          isWarning && "**:data-[slot=progress-indicator]:bg-amber-500",
          isCritical && "**:data-[slot=progress-indicator]:bg-destructive",
        )}
      />
    </div>
  );
}

function EmptyProjectState() {
  return (
    <Empty className="min-h-24 rounded-none border-t bg-muted/50 p-4">
      <EmptyTitle className="flex items-center gap-2">
        <CircleDashed className="size-4" />
        <span>No environments in this project</span>
      </EmptyTitle>
    </Empty>
  );
}

function CountryFlag({ code }: { code: string }) {
  const colors: Record<string, string[]> = {
    DE: ["#000", "#dd0000", "#ffce00"],
    NL: ["#ae1c28", "#fff", "#21468b"],
    EE: ["#4891d9", "#000", "#fff"],
  };
  return (
    <svg
      viewBox="0 0 18 12"
      className="h-3 w-4 shrink-0 rounded-xs ring-1 ring-foreground/10"
      aria-hidden="true"
    >
      {colors[code]?.map((fill, i) => (
        <rect key={i} y={i * 4} width="18" height="4" fill={fill} />
      ))}
    </svg>
  );
}
