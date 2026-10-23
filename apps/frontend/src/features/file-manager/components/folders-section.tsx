"use client";
import { Clock, Folder, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import type { FileManagerFolder } from "../types/file-manager";

export function FoldersSection({
  folders,
  onOpen,
  onRename,
}: {
  folders: FileManagerFolder[];
  onOpen: (folder: FileManagerFolder) => void;
  onRename: (folder: FileManagerFolder) => void;
}) {
  return (
    <section className="flex flex-col gap-2" aria-labelledby="folders-heading">
      <div className="flex items-center justify-between">
        <h2 id="folders-heading" className="font-medium text-lg">
          Folders
        </h2>
        <span className="text-muted-foreground text-sm">
          {folders.length} folders
        </span>
      </div>
      {folders.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {folders.map((folder) => (
            <Card key={folder.id} size="sm">
              <CardHeader className="grid-cols-[minmax(0,1fr)_auto]">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Folder className="size-4.5" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <CardTitle className="truncate leading-none">
                      <button
                        className="max-w-full truncate rounded-sm text-left hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                        onClick={() => onOpen(folder)}
                      >
                        {folder.name}
                      </button>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {folder.fileCount} files
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${folder.name}`}
                        />
                      }
                    >
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => onOpen(folder)}>
                          Open folder
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled
                          title="Sharing requires connected file storage."
                        >
                          Copy share link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRename(folder)}>
                          Rename
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3 text-muted-foreground text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>Updated {folder.updatedAt}</span>
                </div>
                <span>{folder.size}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Empty className="min-h-32">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Folder />
            </EmptyMedia>
            <EmptyTitle>No folders yet</EmptyTitle>
            <EmptyDescription>
              Create a folder to organize your files.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  );
}
