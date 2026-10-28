"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  Code,
  Download,
  FileImage,
  FileText,
  Folder,
  FolderInput,
  MoreVertical,
  Pencil,
  RotateCcw,
  Share2,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import type { DriveAction, DriveEntry, DriveKind } from "../types/drive";
import {
  displayDate,
  folderStats,
  formatBytes,
  kindLabels,
} from "../utils/drive";

const icons = {
  folder: Folder,
  pdf: FileText,
  image: FileImage,
  video: Video,
  archive: Archive,
  document: FileText,
  code: Code,
};
export function EntryIcon({
  kind,
  large = false,
}: {
  kind: DriveKind;
  large?: boolean;
}) {
  const Icon = icons[kind];
  return (
    <Icon
      className={cn(
        "shrink-0 text-muted-foreground",
        large ? "size-10" : "size-4",
      )}
      aria-hidden="true"
    />
  );
}
export function EntryOwner({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2">
      <Avatar className="size-5">
        <AvatarFallback className="text-[0.55rem]">
          {name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </AvatarFallback>
      </Avatar>
      <span className="truncate">{name}</span>
    </span>
  );
}
function EntryActions({
  entry,
  inBin,
  onAction,
}: {
  entry: DriveEntry;
  inBin: boolean;
  onAction: (action: DriveAction, entry: DriveEntry) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${entry.name}`}
          />
        }
      >
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {inBin ? (
            <DropdownMenuItem onClick={() => onAction("restore", entry)}>
              <RotateCcw />
              Restore
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem onClick={() => onAction("open", entry)}>
                <Folder />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("share", entry)}>
                <Share2 />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("rename", entry)}>
                <Pencil />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("star", entry)}>
                <Star />
                {entry.starred ? "Unstar" : "Star"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("move", entry)}>
                <FolderInput />
                Move
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!entry.file}
                onClick={() => onAction("download", entry)}
                title={
                  !entry.file
                    ? "Download is available for files added in this session."
                    : undefined
                }
              >
                <Download />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onAction("trash", entry)}
              >
                <Trash2 />
                Move To Trash
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DriveEntries({
  entries,
  allEntries,
  view,
  details,
  inBin,
  onAction,
  onMove,
}: {
  entries: DriveEntry[];
  allEntries: DriveEntry[];
  view: "list" | "grid";
  details: boolean;
  inBin: boolean;
  onAction: (action: DriveAction, entry: DriveEntry) => void;
  onMove: (id: string, parentId: string) => void;
}) {
  function nameCell(entry: DriveEntry) {
    return (
      <div className="group/entry flex min-w-0 items-center gap-2">
        <EntryIcon kind={entry.kind} />
        <button
          className="max-w-64 truncate rounded-sm text-left font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onAction("open", entry)}
        >
          {entry.name}
        </button>
        {!inBin && (
          <button
            aria-label={`${entry.starred ? "Unstar" : "Star"} ${entry.name}`}
            aria-pressed={!!entry.starred}
            onClick={() => onAction("star", entry)}
            className={cn(
              "rounded-sm p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !entry.starred && "opacity-50 hover:opacity-100",
              entry.starred && "text-amber-500",
            )}
          >
            <Star className={cn("size-3.5", entry.starred && "fill-current")} />
          </button>
        )}
      </div>
    );
  }
  function summary(entry: DriveEntry) {
    const stats =
      entry.kind === "folder" ? folderStats(allEntries, entry.id) : null;
    return (
      <span className="flex flex-col text-xs">
        <span>{formatBytes(stats?.size ?? entry.size)}</span>
        {stats && (
          <span className="text-muted-foreground">{stats.count} items</span>
        )}
      </span>
    );
  }
  const columns: ColumnDef<DataGridFeatures, DriveEntry>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Name" />
      ),
      cell: ({ row }) => nameCell(row.original),
    },
    ...(details
      ? ([
          {
            accessorKey: "owner",
            header: ({ column }) => (
              <DataGridHeaderSort column={column} title="Owner" />
            ),
            cell: ({ row }) => <EntryOwner name={row.original.owner} />,
          },
          {
            accessorKey: "kind",
            header: ({ column }) => (
              <DataGridHeaderSort column={column} title="Type" />
            ),
            cell: ({ row }) => (
              <Badge variant="outline">{kindLabels[row.original.kind]}</Badge>
            ),
          },
          {
            id: "size",
            accessorFn: (entry) =>
              entry.kind === "folder"
                ? folderStats(allEntries, entry.id).size
                : entry.size,
            header: ({ column }) => (
              <DataGridHeaderSort column={column} title="Size" />
            ),
            cell: ({ row }) => summary(row.original),
          },
          {
            accessorKey: "modified",
            header: ({ column }) => (
              <DataGridHeaderSort column={column} title="Modified" />
            ),
            cell: ({ row }) => (
              <span className="flex flex-col gap-1 text-xs">
                <span>{displayDate(row.original.modified)}</span>
                <span className="text-muted-foreground">
                  {row.original.owner}
                </span>
              </span>
            ),
          },
        ] satisfies ColumnDef<DataGridFeatures, DriveEntry>[])
      : []),
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <EntryActions entry={row.original} inBin={inBin} onAction={onAction} />
      ),
    },
  ];
  function dragProps(entry: DriveEntry) {
    return {
      draggable: !inBin,
      onDragStart: (event: React.DragEvent) => {
        event.dataTransfer.setData("application/x-drive-entry", entry.id);
        event.dataTransfer.effectAllowed = "move";
      },
      onDragOver: (event: React.DragEvent) => {
        if (
          !inBin &&
          entry.kind === "folder" &&
          event.dataTransfer.types.includes("application/x-drive-entry")
        )
          event.preventDefault();
      },
      onDrop: (event: React.DragEvent) => {
        const id = event.dataTransfer.getData("application/x-drive-entry");
        if (!inBin && id && entry.kind === "folder") {
          event.preventDefault();
          event.stopPropagation();
          onMove(id, entry.id);
        }
      },
    };
  }
  if (!entries.length)
    return (
      <Empty className="min-h-64">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Folder />
          </EmptyMedia>
          <EmptyTitle>{inBin ? "Bin is empty" : "No files found"}</EmptyTitle>
          <EmptyDescription>
            {inBin
              ? "Deleted items appear here until you restore them."
              : "Try another search or filter, or add files to this folder."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  if (view === "list")
    return (
      <DataGridClient
        data={entries}
        columns={columns}
        getRowId={(entry) => entry.id}
        getRowProps={dragProps}
        pagination="none"
        showVisibilityToggle={false}
      />
    );
  return (
    <div className="grid grid-cols-1 gap-3 @lg/drive:grid-cols-2 @3xl/drive:grid-cols-3 @5xl/drive:grid-cols-4">
      {entries.map((entry) => (
        <article
          key={entry.id}
          className="flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card"
          {...dragProps(entry)}
        >
          <div className="flex items-center justify-between px-3 pt-2">
            <Badge variant="outline">{kindLabels[entry.kind]}</Badge>
            <EntryActions entry={entry} inBin={inBin} onAction={onAction} />
          </div>
          <button
            className="m-3 flex h-28 items-center justify-center rounded-lg bg-muted/40 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Open ${entry.name}`}
            onClick={() => onAction("open", entry)}
          >
            <EntryIcon kind={entry.kind} large />
          </button>
          <div className="flex min-w-0 flex-col gap-3 p-3 pt-0">
            {nameCell(entry)}
            {details && (
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <EntryOwner name={entry.owner} />
                {summary(entry)}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
