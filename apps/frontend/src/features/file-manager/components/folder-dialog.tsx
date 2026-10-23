"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { folderNameSchema } from "../schemas/file-manager.schema";
import type { FileManagerFolder } from "../types/file-manager";

export function FolderDialog({
  folder,
  folders,
  onSave,
  onClose,
}: {
  folder: FileManagerFolder | null;
  folders: FileManagerFolder[];
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(folder?.name ?? "");
  const [error, setError] = useState("");
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{folder ? "Rename folder" : "New folder"}</DialogTitle>
          <DialogDescription>
            Organize files in this demo workspace.
          </DialogDescription>
        </DialogHeader>
        <form
          id="folder-form"
          onSubmit={(event) => {
            event.preventDefault();
            const parsed = folderNameSchema.safeParse(name);
            if (!parsed.success) {
              setError(
                parsed.error.issues[0]?.message ?? "Check the folder name.",
              );
              return;
            }
            if (
              folders.some(
                (item) =>
                  item.id !== folder?.id &&
                  item.name.toLowerCase() === parsed.data.toLowerCase(),
              )
            ) {
              setError("A folder with this name already exists.");
              return;
            }
            onSave(parsed.data);
          }}
        >
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="folder-name">Folder name</FieldLabel>
            <Input
              id="folder-name"
              autoFocus
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              maxLength={100}
              aria-invalid={!!error}
              aria-describedby={error ? "folder-error" : undefined}
            />
            {error && <FieldError id="folder-error">{error}</FieldError>}
          </Field>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="folder-form">
            {folder ? "Save changes" : "Create folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
