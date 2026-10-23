"use client";

import { cn } from "cn";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { FileManagerFile } from "../types/file-manager";
import { fileKindLabels } from "../utils/file-manager";
import { fileIcons } from "./file-icons";
import { FileActions } from "./file-actions";

export function FileGridView({
  files,
  onToggleStar,
  onDelete,
}: {
  files: FileManagerFile[];
  onToggleStar: (id: string) => void;
  onDelete: (file: FileManagerFile) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {files.map((file) => {
        const FileIcon = fileIcons[file.kind];
        return (
          <Card key={file.id} size="sm" className="group/file">
            <CardContent>
              <div className="relative flex h-36 items-center justify-center rounded-lg bg-muted/50">
                <FileIcon
                  className="size-12 text-muted-foreground"
                  aria-hidden="true"
                />
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className={cn(
                    "absolute top-2 right-2 opacity-100 [@media(hover:hover)]:opacity-0 focus-visible:opacity-100 group-hover/file:opacity-100",
                    file.starred && "[@media(hover:hover)]:opacity-100",
                  )}
                  aria-pressed={file.starred}
                  aria-label={
                    file.starred ? `Unstar ${file.name}` : `Star ${file.name}`
                  }
                  onClick={() => onToggleStar(file.id)}
                >
                  <Star className={cn(file.starred && "fill-current")} />
                </Button>
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 text-muted-foreground text-xs">
                  <span>{fileKindLabels[file.kind]}</span>
                  <span>{file.size}</span>
                </div>
              </div>
            </CardContent>
            <CardHeader className="min-w-0 grid-cols-[minmax(0,1fr)_auto]">
              <CardTitle className="truncate">{file.name}</CardTitle>
              <CardDescription className="truncate">
                Modified {file.modifiedAt} by {file.owner}
              </CardDescription>
              <CardAction>
                <FileActions
                  file={file}
                  onToggleStar={() => onToggleStar(file.id)}
                  onDelete={() => onDelete(file)}
                />
              </CardAction>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
