"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Download, Ellipsis } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { User } from "@/mocks/user.mock";
import {
  buildUserTree,
  emptyTreeFilters,
  filterUserTree,
  flattenUserTree,
  getExpandedTreeIds,
  getTreeBranchIds,
  type TreeFilters,
  type UserTreeNode,
} from "../user-tree";
import {
  defaultTreeDisplay,
  treeColumns,
  TreeTableControls,
  type TreeDisplay,
} from "./tree-table-controls";
import { TreeUserDetails } from "./tree-user-details";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function exportUsers(users: User[], name: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(users, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function TreeUserTable({ users }: { users: User[] }) {
  const data = users;
  const [filters, setFilters] = useState<TreeFilters>(emptyTreeFilters);
  const [display, setDisplay] = useState<TreeDisplay>(defaultTreeDisplay);
  const [expanded, setExpanded] = useState(() =>
    getExpandedTreeIds(buildUserTree(users), 1),
  );
  const [depth, setDepth] = useState<number | null>(1);
  const [focusedId, setFocusedId] = useState<string>();
  const [profile, setProfile] = useState<User | null>(null);
  const gridId = useId();
  const tree = buildUserTree(data);
  const allNodes = flattenUserTree(tree, getExpandedTreeIds(tree, Infinity));
  const filteredTree = filterUserTree(tree, filters);
  const filteredNodes = flattenUserTree(
    filteredTree,
    getExpandedTreeIds(filteredTree, Infinity),
  );
  const rows = flattenUserTree(filteredTree, expanded);
  const focusId = rows.some((node) => node.user.id === focusedId)
    ? focusedId
    : rows[0]?.user.id;
  const managers = allNodes.filter((node) => node.directReports > 0);
  const levels = allNodes.reduce(
    (max, node) => Math.max(max, node.depth + 1),
    0,
  );
  const visibleColumns = treeColumns.filter(
    ({ id }) => !display.hidden.includes(id),
  );
  const widths: Record<string, number> = {
    actions: 48,
    ...Object.fromEntries(visibleColumns.map(({ id, width }) => [id, width])),
  };
  const totalWidth = Object.values(widths).reduce(
    (total, width) => total + width,
    0,
  );

  function changeFilters(next: TreeFilters) {
    setFilters(next);
    const nextDepth =
      next.search.trim() || next.role !== "all" || next.status !== "all"
        ? Infinity
        : 1;
    setDepth(nextDepth);
    setExpanded(getExpandedTreeIds(tree, nextDepth));
  }
  function toggleExpanded(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setDepth(null);
  }
  function focusRow(id: string) {
    setFocusedId(id);
    requestAnimationFrame(() =>
      document.getElementById(`${gridId}-${id}`)?.focus(),
    );
  }
  function handleRowKey(
    event: KeyboardEvent<HTMLTableRowElement>,
    node: UserTreeNode,
  ) {
    if (
      event.target !== event.currentTarget ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    const index = rows.indexOf(node);
    let target: string | undefined;
    switch (event.key) {
      case "ArrowDown":
        target = rows[index + 1]?.user.id;
        break;
      case "ArrowUp":
        target = rows[index - 1]?.user.id;
        break;
      case "Home":
        target = rows[0]?.user.id;
        break;
      case "End":
        target = rows.at(-1)?.user.id;
        break;
      case "ArrowRight":
        if (node.children.length && !expanded.has(node.user.id))
          toggleExpanded(node.user.id);
        else target = node.children[0]?.user.id;
        break;
      case "ArrowLeft":
        if (node.children.length && expanded.has(node.user.id))
          toggleExpanded(node.user.id);
        else target = node.parentId;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (target) focusRow(target);
  }

  const columns: ColumnDef<DataGridFeatures, UserTreeNode>[] = [
    ...visibleColumns.map(
      ({ id, label }): ColumnDef<DataGridFeatures, UserTreeNode> => ({
        id,
        header: () => <DataGridHeader title={label} />,
        enableSorting: false,
        cell: ({ row }) => {
          const node = row.original;
          const user = node.user;
          if (id === "name")
            return (
              <div
                className="flex min-w-0 items-center gap-2.5"
                style={{ paddingInlineStart: `${node.depth * 1.25}rem` }}
              >
                {node.children.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={`${expanded.has(user.id) ? "Collapse" : "Expand"} ${user.name}`}
                    aria-expanded={expanded.has(user.id)}
                    onClick={() => toggleExpanded(user.id)}
                  >
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform duration-200 motion-reduce:transition-none",
                        expanded.has(user.id) && "rotate-90",
                      )}
                    />
                  </Button>
                ) : (
                  <span aria-hidden="true" className="size-7 shrink-0" />
                )}
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="text-xs">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <span
                    className="block truncate font-medium"
                    title={user.name}
                  >
                    {user.name}
                  </span>
                  {!node.matchesFilter && (
                    <span className="text-xs text-muted-foreground">
                      Ancestor context
                    </span>
                  )}
                </div>
              </div>
            );
          if (id === "reports")
            return (
              <span
                className="tabular-nums"
                title={`${node.directReports} direct reports, ${node.totalReports} total reports`}
              >
                {node.directReports}
                <span className="ml-1 text-xs text-muted-foreground">
                  of {node.totalReports}
                </span>
              </span>
            );
          if (id === "joinDate")
            return (
              <time dateTime={user.joinDate}>
                {dateFormatter.format(new Date(user.joinDate))}
              </time>
            );
          if (id === "status" || id === "role")
            return (
              <Badge
                variant={
                  id === "role"
                    ? "outline"
                    : user.status === "active"
                      ? "default"
                      : "secondary"
                }
                className="capitalize"
              >
                {user[id]}
              </Badge>
            );
          return (
            <span
              className={cn(
                "block truncate",
                id === "gender" && "capitalize",
                (id === "id" || id === "email") && "text-muted-foreground",
              )}
              title={user[id]}
            >
              {user[id]}
            </span>
          );
        },
      }),
    ),
    {
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label={`Actions for ${row.original.user.name}`}
              />
            }
          >
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setProfile(row.original.user)}>
              Open profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const ids = new Set(getTreeBranchIds(row.original));
                exportUsers(
                  data.filter((user) => ids.has(user.id)),
                  `reporting-line-${row.original.user.id}`,
                );
              }}
            >
              Export reporting line
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b px-4 pb-4 sm:px-6">
        <div>
          <h2 className="font-semibold">Reporting hierarchy</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Struktur atasan dan bawahan dalam satu tabel.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          {[
            ["Headcount", data.length],
            ["Layers", levels],
            ["Managers", managers.length],
            [
              "Avg. span",
              managers.length
                ? (
                    allNodes.reduce(
                      (total, node) => total + node.directReports,
                      0,
                    ) / managers.length
                  ).toFixed(1)
                : "0",
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-semibold tabular-nums">{value}</p>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={!filteredNodes.length}
            onClick={() =>
              exportUsers(
                filteredNodes.map((node) => node.user),
                "user-hierarchy",
              )
            }
          >
            <Download />
            Export
          </Button>
        </div>
      </div>
      <CardContent className="space-y-4">
        <TreeTableControls
          filters={filters}
          onFiltersChange={changeFilters}
          display={display}
          onDisplayChange={setDisplay}
          depth={depth}
          onDepthChange={(value) => {
            setDepth(value);
            setExpanded(getExpandedTreeIds(tree, value));
          }}
        />
        <div className="[&_[data-slot=table-container]]:max-h-[65vh] [&_[data-slot=table-container]]:overflow-auto">
          <DataGridClient
            columns={columns}
            data={rows}
            getRowId={(node) => node.user.id}
            pagination="none"
            showVisibilityToggle={false}
            showHeaderVisibilityToggle={false}
            emptyTitle="No matching users"
            emptyDescription="Try another search or clear your filters."
            tableProps={{
              role: "treegrid",
              "aria-label": "User reporting hierarchy",
              "aria-describedby": `${gridId}-help`,
              className: "table-fixed",
              style: { minWidth: `${totalWidth / 16}rem` },
            }}
            getHeaderProps={(id) => ({
              className: "sticky top-0 z-10 bg-muted",
              style: { width: `${((widths[id] ?? 48) / totalWidth) * 100}%` },
            })}
            getCellProps={() => ({
              className: display.compact ? "py-2" : "py-4",
            })}
            getRowProps={(node) => ({
              id: `${gridId}-${node.user.id}`,
              "aria-level": node.depth + 1,
              "aria-expanded": node.children.length
                ? expanded.has(node.user.id)
                : undefined,
              tabIndex: focusId === node.user.id ? 0 : -1,
              className:
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
              onFocus: (event) => {
                if (event.target === event.currentTarget)
                  setFocusedId(node.user.id);
              },
              onKeyDown: (event) => handleRowKey(event, node),
            })}
          />
        </div>
        <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
          <p role="status">
            {rows.length} visible ·{" "}
            {filteredNodes.filter((node) => node.matchesFilter).length} matching
            · {data.length} total users
          </p>
          <p>Reports: direct / total</p>
        </div>
        <p id={`${gridId}-help`} className="text-xs text-muted-foreground">
          Gunakan tombol panah untuk navigasi dan expand/collapse hierarki.
        </p>
      </CardContent>
      {profile && (
        <TreeUserDetails
          user={profile}
          manager={data.find((user) => user.id === profile.managerId)}
          onClose={() => setProfile(null)}
        />
      )}
    </Card>
  );
}
