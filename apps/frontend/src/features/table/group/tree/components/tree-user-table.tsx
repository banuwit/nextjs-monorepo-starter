"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@/mocks/user.mock";
import {
  buildUserTree,
  emptyTreeFilters,
  filterUserTree,
  flattenUserTree,
  getExpandedTreeIds,
} from "../utils/user-tree";
import type { TreeFilters, UserTreeNode } from "../types/user-tree";
import { treeColumns, TreeTableControls } from "./tree-table-controls";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function TreeUserTable({ users }: { users: User[] }) {
  const [filters, setFilters] = useState<TreeFilters>(emptyTreeFilters);
  const [expanded, setExpanded] = useState(() =>
    getExpandedTreeIds(buildUserTree(users), 1),
  );
  const [focusedId, setFocusedId] = useState<string>();
  const gridId = useId();
  const tree = buildUserTree(users);
  const filteredTree = filterUserTree(tree, filters);
  const rows = flattenUserTree(filteredTree, expanded);
  const focusId = rows.some((node) => node.user.id === focusedId)
    ? focusedId
    : rows[0]?.user.id;
  const widths: Record<string, number> = Object.fromEntries(
    treeColumns.map(({ id, width }) => [id, width]),
  );
  const totalWidth = Object.values(widths).reduce(
    (total, width) => total + width,
    0,
  );

  function changeFilters(next: TreeFilters) {
    setFilters(next);
    const hasFilter =
      next.search.trim() ||
      next.gender.length ||
      next.role.length ||
      next.status.length;
    setExpanded(getExpandedTreeIds(tree, hasFilter ? Infinity : 1));
  }
  function toggleExpanded(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  const columns: ColumnDef<DataGridFeatures, UserTreeNode>[] = treeColumns.map(
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
                <span className="block truncate font-medium" title={user.name}>
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
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporting hierarchy</CardTitle>
        <CardDescription>
          Struktur atasan dan bawahan dalam satu tabel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TreeTableControls filters={filters} onFiltersChange={changeFilters} />
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
              className: "table-fixed",
              style: { minWidth: `${totalWidth / 16}rem` },
            }}
            getHeaderProps={(id) => ({
              className: "sticky top-0 z-10 bg-muted",
              style: { width: `${((widths[id] ?? 48) / totalWidth) * 100}%` },
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
      </CardContent>
    </Card>
  );
}
