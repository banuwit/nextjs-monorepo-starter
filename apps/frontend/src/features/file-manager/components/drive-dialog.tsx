"use client";

import { useState } from "react";
import { Copy, Download, HardDrive } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { entryNameSchema } from "../schemas/drive.schema";
import type { DriveEntry } from "../types/drive";
import {
  ancestors,
  displayDate,
  formatBytes,
  isInBin,
  kindLabels,
} from "../utils/drive";
import { EntryIcon, EntryOwner } from "./drive-entries";

export type DriveDialogState = {
  type: "new" | "rename" | "move" | "share" | "details" | "trash" | "storage";
  entry?: DriveEntry;
};
export function DriveDialog({
  dialog,
  entries,
  onClose,
  onSave,
  onDownload,
}: {
  dialog: DriveDialogState;
  entries: DriveEntry[];
  onClose: () => void;
  onSave: (value: string, permission?: "viewer" | "editor") => void;
  onDownload: (entry: DriveEntry) => void;
}) {
  const entry = dialog.entry;
  const [name, setName] = useState(entry?.name ?? "");
  const [destination, setDestination] = useState(entry?.parentId ?? "root");
  const [shared, setShared] = useState(entry?.shared ?? false);
  const [permission, setPermission] = useState<"viewer" | "editor">(
    entry?.permission ?? "viewer",
  );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const title = {
    new: "New Folder",
    rename: "Rename",
    move: "Move",
    share: "Share",
    details: "File details",
    trash: "Move to trash?",
    storage: "Storage",
  }[dialog.type];
  function submit() {
    try {
      if (dialog.type === "new" || dialog.type === "rename") {
        const parsed = entryNameSchema.safeParse(name);
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Enter a valid name.");
          return;
        }
        onSave(parsed.data);
      } else if (dialog.type === "move") onSave(destination);
      else if (dialog.type === "share")
        onSave(shared ? "shared" : "private", permission);
      else onSave("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to save changes.",
      );
    }
  }
  if (dialog.type === "trash")
    return (
      <AlertDialog
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {entry?.name}{" "}
              {entry?.kind === "folder"
                ? "and its contents will be moved"
                : "will be moved"}{" "}
              to the bin. You can restore it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submit}>
              Move to trash
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  const destinations = [
    { value: "root", label: "My Drive" },
    ...entries
      .filter(
        (item) =>
          item.kind === "folder" &&
          !isInBin(entries, item) &&
          !ancestors(entries, item.id).some(
            (parent) => parent.id === entry?.id,
          ),
      )
      .map((item) => ({
        value: item.id,
        label: ancestors(entries, item.id)
          .map((part) => part.name)
          .join(" / "),
      })),
  ];
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {title}
            {["share", "move"].includes(dialog.type) && entry
              ? ` · ${entry.name}`
              : ""}
          </DialogTitle>
          <DialogDescription>
            {dialog.type === "storage"
              ? "Storage overview for this demo workspace."
              : dialog.type === "share"
                ? "Demo access settings apply only to this browser session. No invitations are sent."
                : dialog.type === "details"
                  ? "File information in your workspace."
                  : dialog.type === "move"
                    ? "Choose a destination folder."
                    : "Choose a unique name for this folder or file."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <FieldGroup>
            {(dialog.type === "new" || dialog.type === "rename") && (
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor="drive-name">Name</FieldLabel>
                <Input
                  id="drive-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  autoFocus
                  maxLength={120}
                  aria-invalid={!!error}
                  aria-describedby={error ? "drive-dialog-error" : undefined}
                  placeholder="Untitled folder"
                />
              </Field>
            )}
            {dialog.type === "move" && (
              <Field>
                <FieldLabel htmlFor="drive-destination">Destination</FieldLabel>
                <Select
                  items={destinations}
                  value={destination}
                  onValueChange={(value) => {
                    if (value) setDestination(value);
                  }}
                >
                  <SelectTrigger id="drive-destination" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {destinations.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
            {dialog.type === "share" && (
              <>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="drive-shared">
                    Shared with workspace
                  </FieldLabel>
                  <Switch
                    id="drive-shared"
                    checked={shared}
                    onCheckedChange={setShared}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="drive-permission">
                    Workspace permission
                  </FieldLabel>
                  <Select
                    items={[
                      { value: "viewer", label: "Can view" },
                      { value: "editor", label: "Can edit" },
                    ]}
                    value={permission}
                    onValueChange={(value) => {
                      if (value === "viewer" || value === "editor")
                        setPermission(value);
                    }}
                    disabled={!shared}
                  >
                    <SelectTrigger id="drive-permission" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="viewer">Can view</SelectItem>
                        <SelectItem value="editor">Can edit</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const url = new URL(window.location.href);
                      url.searchParams.set("item", entry!.id);
                      await navigator.clipboard.writeText(url.toString());
                      setCopied(true);
                    } catch {
                      setError(
                        "Clipboard is unavailable. Copy the page address from your browser.",
                      );
                    }
                  }}
                >
                  <Copy />
                  {copied ? "Link copied" : "Copy workspace link"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Links to example items can be reopened. Files added in this
                  session are only available here until reload.
                </p>
              </>
            )}
            {dialog.type === "details" && entry && (
              <>
                <div className="flex h-28 items-center justify-center rounded-lg bg-muted/40">
                  <EntryIcon kind={entry.kind} large />
                </div>
                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="break-words">{entry.name}</dd>
                  <dt className="text-muted-foreground">Owner</dt>
                  <dd>
                    <EntryOwner name={entry.owner} />
                  </dd>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd>{kindLabels[entry.kind]}</dd>
                  <dt className="text-muted-foreground">Size</dt>
                  <dd>{formatBytes(entry.size)}</dd>
                  <dt className="text-muted-foreground">Modified</dt>
                  <dd>{displayDate(entry.modified)}</dd>
                </dl>
                {!entry.file && (
                  <p className="text-xs text-muted-foreground">
                    This example contains metadata only. Add a local file to
                    enable downloads.
                  </p>
                )}
              </>
            )}
            {dialog.type === "storage" && (
              <>
                <HardDrive className="size-10 text-muted-foreground" />
                <p className="text-sm">
                  {formatBytes(
                    entries.reduce((sum, item) => sum + item.size, 0),
                  )}{" "}
                  of 2 TB used, including items in the bin.
                </p>
                <p className="text-sm text-muted-foreground">
                  This is sample storage usage. A storage provider and billing
                  integration are needed to upgrade your plan.
                </p>
              </>
            )}
          </FieldGroup>
          {error && (
            <p
              id="drive-dialog-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {["details", "storage"].includes(dialog.type)
                ? "Close"
                : "Cancel"}
            </Button>
            {dialog.type === "details"
              ? entry?.file && (
                  <Button type="button" onClick={() => onDownload(entry)}>
                    <Download />
                    Download
                  </Button>
                )
              : dialog.type !== "storage" && (
                  <Button type="submit">
                    {dialog.type === "new"
                      ? "Create folder"
                      : dialog.type === "move"
                        ? "Move here"
                        : "Save changes"}
                  </Button>
                )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
