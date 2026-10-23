"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { FileManagerFile } from "../types/file-manager";
import { FileActions } from "./file-actions";
import { fileIcons } from "./file-icons";

export function FileListView({
  files,
  onToggleStar,
  onDelete,
}: {
  files: FileManagerFile[];
  onToggleStar: (id: string) => void;
  onDelete: (file: FileManagerFile) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Owner</TableHead>
          <TableHead className="hidden lg:table-cell">Modified</TableHead>
          <TableHead className="hidden sm:table-cell">Size</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => {
          const Icon = fileIcons[file.kind];
          return (
            <TableRow key={file.id}>
              <TableCell>
                <div className="flex min-w-0 items-center gap-3">
                  <Icon
                    className="size-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span
                    className="max-w-40 truncate font-medium sm:max-w-72"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                  {file.shared && (
                    <Badge variant="outline" className="hidden xl:inline-flex">
                      Shared
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>{file.ownerInitials}</AvatarFallback>
                  </Avatar>
                  <span>{file.owner}</span>
                </div>
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">
                {file.modifiedAt}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {file.size}
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-pressed={file.starred}
                    aria-label={`${file.starred ? "Unstar" : "Star"} ${file.name}`}
                    onClick={() => onToggleStar(file.id)}
                  >
                    <Star className={cn(file.starred && "fill-current")} />
                  </Button>
                  <FileActions
                    file={file}
                    onToggleStar={() => onToggleStar(file.id)}
                    onDelete={() => onDelete(file)}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
