"use client";
import { Download, MoreVertical, Share2, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { FileManagerFile } from "../file-manager-model";

interface FileActionsProps {
  file: FileManagerFile;
  onToggleStar: () => void;
  onDelete: () => void;
}

export function FileActions({
  file,
  onToggleStar,
  onDelete,
}: FileActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${file.name}`}
          />
        }
      >
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onToggleStar}>
            <Star />
            {file.starred ? "Remove from starred" : "Add to starred"}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!file.localFile}
            onClick={() => {
              if (!file.localFile) return;
              const url = URL.createObjectURL(file.localFile);
              const link = document.createElement("a");
              link.href = url;
              link.download = file.name;
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            <Download />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled
            title="Sharing requires connected file storage."
          >
            <Share2 />
            Copy share link
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 />
            Move to trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
