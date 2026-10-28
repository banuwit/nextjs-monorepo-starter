"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Folder,
  HardDrive,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { DriveEntry, DriveLocation } from "../types/drive";
import { formatBytes, isInBin } from "../utils/drive";

export const locationLabels: Record<DriveLocation, string> = {
  drive: "My Drive",
  shared: "Shared With Me",
  recent: "Recent",
  starred: "Starred",
  bin: "Bin",
};
const shortcuts = [
  { id: "shared", icon: Users },
  { id: "recent", icon: Clock },
  { id: "starred", icon: Star },
  { id: "bin", icon: Trash2 },
] as const;

export function DriveNavigation({
  entries,
  location,
  folderId,
  onNavigate,
  onMove,
  onStorage,
}: {
  entries: DriveEntry[];
  location: DriveLocation;
  folderId: string | null;
  onNavigate: (location: DriveLocation, folderId?: string | null) => void;
  onMove: (id: string, parentId: string | null) => void;
  onStorage: () => void;
}) {
  const [expanded, setExpanded] = useState<string[]>(["root", "clients"]);
  const folders = entries.filter(
    (entry) => entry.kind === "folder" && !isInBin(entries, entry),
  );
  const used = entries.reduce((sum, entry) => sum + entry.size, 0);
  const capacity = 2 * 1024 ** 4;
  function folderRow(
    id: string,
    name: string,
    parentId: string | null,
    depth: number,
  ) {
    const children = folders.filter((folder) => folder.parentId === parentId);
    const open = expanded.includes(id);
    return (
      <li key={id}>
        <div
          className={cn(
            "flex items-center rounded-lg pr-1",
            location === "drive" && folderId === parentId && "bg-muted",
          )}
          style={{ paddingLeft: `${depth * 0.875}rem` }}
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes("application/x-drive-entry"))
              event.preventDefault();
          }}
          onDrop={(event) => {
            const item = event.dataTransfer.getData(
              "application/x-drive-entry",
            );
            if (item) {
              event.preventDefault();
              event.stopPropagation();
              onMove(item, parentId);
            }
          }}
        >
          {children.length ? (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`${open ? "Collapse" : "Expand"} ${name}`}
              aria-expanded={open}
              onClick={() =>
                setExpanded((current) =>
                  open
                    ? current.filter((value) => value !== id)
                    : [...current, id],
                )
              }
            >
              {open ? <ChevronDown /> : <ChevronRight />}
            </Button>
          ) : (
            <span className="w-6 shrink-0" />
          )}
          <button
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg py-2.5 text-left text-sm outline-none hover:text-primary-text focus-visible:ring-2 focus-visible:ring-ring"
            aria-current={
              location === "drive" && folderId === parentId ? "page" : undefined
            }
            onClick={() => onNavigate("drive", parentId)}
          >
            <Folder className="size-4 shrink-0" />
            <span className="truncate">{name}</span>
          </button>
        </div>
        {open && children.length > 0 && (
          <ul>
            {children.map((child) =>
              folderRow(child.id, child.name, child.id, depth + 1),
            )}
          </ul>
        )}
      </li>
    );
  }
  return (
    <nav aria-label="Drive folders" className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <ul>{folderRow("root", "My Drive", null, 0)}</ul>
      </div>
      <Separator />
      <div className="flex flex-col gap-1 p-2">
        {shortcuts.map(({ id, icon: Icon }) => (
          <Button
            key={id}
            variant={location === id ? "secondary" : "ghost"}
            className="justify-start"
            aria-current={location === id ? "page" : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon data-icon="inline-start" />
            {locationLabels[id]}
          </Button>
        ))}
      </div>
      <Separator />
      <div className="flex flex-col gap-3 p-3">
        <div className="flex justify-between gap-2 text-xs">
          <span className="flex items-center gap-1.5">
            <HardDrive className="size-3.5" />
            Storage
          </span>
          <span className="text-muted-foreground">
            {Math.round((used / capacity) * 100)}% full
          </span>
        </div>
        <Progress
          value={Math.min(100, (used / capacity) * 100)}
          aria-label="Storage used"
        />
        <p className="text-xs text-muted-foreground">
          {formatBytes(used)} of 2 TB used
        </p>
        <Button variant="outline" size="sm" onClick={onStorage}>
          Get More Storage
        </Button>
      </div>
    </nav>
  );
}
