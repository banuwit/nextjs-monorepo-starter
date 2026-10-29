"use client";

import { Fragment, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Folder,
  FolderPlus,
  Grid2X2,
  List,
  PanelLeft,
  Search,
  Settings2,
  Upload,
  X,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { initialDriveEntries } from "@/mocks/file-manager.mock";
import type { DriveAction, DriveEntry, DriveLocation } from "../types/drive";
import {
  ancestors,
  assertUniqueName,
  fileKind,
  folderStats,
  formatBytes,
  kindLabels,
  moveEntry,
  restoreEntry,
  trashEntry,
  visibleEntries,
} from "../utils/drive";
import { entryNameSchema } from "../schemas/drive.schema";
import { DriveDialog, type DriveDialogState } from "./drive-dialog";
import { DriveEntries } from "./drive-entries";
import { DriveNavigation, locationLabels } from "./drive-navigation";

const typeOptions = [
  { value: "all", label: "All types" },
  ...Object.entries(kindLabels).map(([value, label]) => ({ value, label })),
];

export function FileManagerPage({ initialItemId }: { initialItemId?: string }) {
  const initialItem = initialDriveEntries.find(
    (entry) => entry.id === initialItemId && !entry.trashed,
  );
  // shortcut: files and demo permissions live in this session; connect storage before using real shared files.
  const [entries, setEntries] = useState(initialDriveEntries);
  const [location, setLocation] = useState<DriveLocation>("drive");
  const [folderId, setFolderId] = useState<string | null>(
    initialItem?.kind === "folder"
      ? initialItem.id
      : (initialItem?.parentId ?? null),
  );
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [view, setView] = useState<"list" | "grid">("list");
  const [details, setDetails] = useState(true);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dialog, setDialog] = useState<DriveDialogState | null>(
    initialItem && initialItem.kind !== "folder"
      ? { type: "details", entry: initialItem }
      : null,
  );
  const [message, setMessage] = useState(
    initialItemId && !initialItem
      ? "This item is no longer available in this session."
      : "",
  );
  const [uploads, setUploads] = useState<DriveEntry[]>([]);
  const uploadInput = useRef<HTMLInputElement>(null);
  const visible = visibleEntries(entries, { location, folderId, search, kind });
  const path = ancestors(entries, folderId);
  const suggested = entries
    .filter(
      (entry) =>
        entry.kind === "folder" && !entry.trashed && entry.parentId === null,
    )
    .sort(
      (a, b) =>
        folderStats(entries, b.id).size - folderStats(entries, a.id).size,
    );
  const showSuggested =
    location === "drive" && !folderId && !search && kind === "all";

  function navigate(next: DriveLocation, id: string | null = null) {
    setLocation(next);
    setFolderId(id);
    setSearch("");
    setKind("all");
    setNavigationOpen(false);
  }
  function move(id: string, destination: string | null) {
    try {
      setEntries(moveEntry(entries, id, destination));
      setMessage("Item moved.");
    } catch (cause) {
      setMessage(
        cause instanceof Error ? cause.message : "Unable to move this item.",
      );
    }
  }
  function download(entry: DriveEntry) {
    if (!entry.file) return;
    const url = URL.createObjectURL(entry.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = entry.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(`Downloaded ${entry.name}.`);
  }
  function act(action: DriveAction, entry: DriveEntry) {
    if (action === "star") {
      setEntries((current) =>
        current.map((item) =>
          item.id === entry.id ? { ...item, starred: !item.starred } : item,
        ),
      );
      return;
    }
    if (action === "restore") {
      try {
        setEntries(restoreEntry(entries, entry.id));
        setMessage(`${entry.name} restored.`);
      } catch (cause) {
        setMessage(
          cause instanceof Error
            ? cause.message
            : "Unable to restore this item.",
        );
      }
      return;
    }
    if (action === "download") {
      download(entry);
      return;
    }
    if (action === "open" && entry.kind === "folder") {
      if (location === "bin")
        setMessage("Restore this folder to browse its contents.");
      else navigate("drive", entry.id);
      return;
    }
    setDialog({ type: action === "open" ? "details" : action, entry });
  }
  function addFiles(files: File[]) {
    if (!files.length) return;
    let next = entries;
    const added: DriveEntry[] = [];
    const errors: string[] = [];
    for (const file of files) {
      try {
        const name = entryNameSchema.parse(file.name);
        assertUniqueName(next, name, folderId);
        const entry: DriveEntry = {
          id: crypto.randomUUID(),
          name,
          kind: fileKind(file),
          parentId: folderId,
          size: file.size,
          owner: "You",
          modified: new Date().toISOString(),
          file,
        };
        next = [...next, entry];
        added.push(entry);
      } catch {
        errors.push(file.name);
      }
    }
    setEntries(next);
    setUploads(added);
    setSearch("");
    setKind("all");
    setLocation("drive");
    setMessage(
      `${added.length} file(s) added to this session.${errors.length ? ` Skipped duplicate or invalid names: ${errors.join(", ")}.` : ""}`,
    );
  }
  function save(value: string, permission?: "viewer" | "editor") {
    if (!dialog) return;
    const entry = dialog.entry;
    if (dialog.type === "new") {
      assertUniqueName(entries, value, folderId);
      setEntries([
        ...entries,
        {
          id: crypto.randomUUID(),
          name: value,
          kind: "folder",
          parentId: folderId,
          size: 0,
          owner: "You",
          modified: new Date().toISOString(),
        },
      ]);
      setLocation("drive");
      setSearch("");
      setKind("all");
    } else if (entry) {
      if (dialog.type === "rename") {
        assertUniqueName(entries, value, entry.parentId, entry.id);
        setEntries(
          entries.map((item) =>
            item.id === entry.id
              ? { ...item, name: value, modified: new Date().toISOString() }
              : item,
          ),
        );
      }
      if (dialog.type === "move")
        setEntries(
          moveEntry(entries, entry.id, value === "root" ? null : value),
        );
      if (dialog.type === "trash") setEntries(trashEntry(entries, entry.id));
      if (dialog.type === "share")
        setEntries(
          entries.map((item) =>
            item.id === entry.id
              ? { ...item, shared: value === "shared", permission }
              : item,
          ),
        );
    }
    setMessage(
      dialog.type === "new"
        ? "Folder created."
        : dialog.type === "trash"
          ? "Moved to bin. You can restore it from the sidebar."
          : "Changes saved for this session.",
    );
    setDialog(null);
  }
  const navigation = (
    <DriveNavigation
      entries={entries}
      location={location}
      folderId={folderId}
      onNavigate={navigate}
      onMove={move}
      onStorage={() => setDialog({ type: "storage" })}
    />
  );

  return (
    <AppBody>
      <section
        aria-label="File Manager"
        className="flex min-h-[40rem] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground lg:h-[calc(100svh-7rem)] lg:min-h-[38rem] lg:flex-none"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              File Manager
            </h1>
            <p className="text-xs text-muted-foreground">
              Shared studio files and folders
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDialog({ type: "new" })}
            >
              <FolderPlus data-icon="inline-start" />
              New Folder
            </Button>
            <Button onClick={() => uploadInput.current?.click()}>
              <Upload data-icon="inline-start" />
              Upload
            </Button>
          </div>
        </header>
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-56 shrink-0 border-r lg:block">
            {navigation}
          </aside>
          <div className="@container/drive flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3">
              <div className="flex min-w-0 items-center gap-2">
                <Button
                  className="lg:hidden"
                  variant="ghost"
                  size="icon"
                  aria-label="Open drive navigation"
                  onClick={() => setNavigationOpen(true)}
                >
                  <PanelLeft />
                </Button>
                <nav aria-label="File path" className="min-w-0">
                  <ol className="flex flex-wrap items-center gap-1 text-sm">
                    <li>
                      <button
                        className="rounded px-1 py-1 outline-none hover:text-primary-text focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => navigate("drive")}
                      >
                        {location === "drive"
                          ? "My Drive"
                          : locationLabels[location]}
                      </button>
                    </li>
                    {location === "drive" &&
                      path.map((entry) => (
                        <Fragment key={entry.id}>
                          <li aria-hidden="true">
                            <ChevronRight className="size-3.5 text-muted-foreground" />
                          </li>
                          <li>
                            <button
                              className="max-w-44 truncate rounded px-1 py-1 outline-none hover:text-primary-text focus-visible:ring-2 focus-visible:ring-ring"
                              onClick={() => navigate("drive", entry.id)}
                            >
                              {entry.name}
                            </button>
                          </li>
                        </Fragment>
                      ))}
                  </ol>
                </nav>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 @3xl/drive:w-auto">
                <InputGroup className="w-full @lg/drive:w-48">
                  <InputGroupInput
                    aria-label="Search files"
                    placeholder="Search files"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
                <Select
                  items={typeOptions}
                  value={kind}
                  onValueChange={(value) => {
                    if (value) setKind(value);
                  }}
                >
                  <SelectTrigger aria-label="Filter by type" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <ToggleGroup
                  variant="outline"
                  spacing={0}
                  value={[view]}
                  onValueChange={(values) => {
                    if (values[0] === "list" || values[0] === "grid")
                      setView(values[0]);
                  }}
                  aria-label="Browse view"
                >
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <Grid2X2 />
                  </ToggleGroupItem>
                </ToggleGroup>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" />}>
                    <Settings2 />
                    View
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuCheckboxItem
                        checked={details}
                        onCheckedChange={setDetails}
                      >
                        Show file details
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div
              className="relative flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4"
              onDragOver={(event) => {
                if (event.dataTransfer.types.includes("Files"))
                  event.preventDefault();
              }}
              onDrop={(event) => {
                if (event.dataTransfer.files.length) {
                  event.preventDefault();
                  addFiles(Array.from(event.dataTransfer.files));
                }
              }}
            >
              <input
                ref={uploadInput}
                type="file"
                multiple
                className="sr-only"
                tabIndex={-1}
                aria-label="Upload files"
                onChange={(event) => {
                  addFiles(Array.from(event.target.files ?? []));
                  event.target.value = "";
                }}
              />
              {showSuggested && (
                <section aria-labelledby="suggested-folders">
                  <h2
                    id="suggested-folders"
                    className="mb-3 text-xs font-medium text-muted-foreground"
                  >
                    Suggested Folders
                  </h2>
                  <div className="grid gap-2 @xl/drive:grid-cols-2 @4xl/drive:grid-cols-3">
                    {suggested.map((entry) => {
                      const stats = folderStats(entries, entry.id);
                      return (
                        <button
                          key={entry.id}
                          className="flex min-w-0 items-center gap-3 rounded-lg border p-3 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
                          onClick={() => navigate("drive", entry.id)}
                          onDragOver={(event) => {
                            if (
                              event.dataTransfer.types.includes(
                                "application/x-drive-entry",
                              )
                            )
                              event.preventDefault();
                          }}
                          onDrop={(event) => {
                            const id = event.dataTransfer.getData(
                              "application/x-drive-entry",
                            );
                            if (id) {
                              event.preventDefault();
                              event.stopPropagation();
                              move(id, entry.id);
                            }
                          }}
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                            <Folder className="size-5" />
                          </span>
                          <span className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-sm font-medium">
                              {entry.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatBytes(stats.size)} · {stats.count} items
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
              <section
                aria-labelledby="drive-files-heading"
                className="min-w-0"
              >
                <h2
                  id="drive-files-heading"
                  className="mb-3 text-xs font-medium text-muted-foreground"
                >
                  {showSuggested
                    ? "Suggested Files"
                    : `${location === "drive" ? (path.at(-1)?.name ?? "My Drive") : locationLabels[location]} · ${visible.length} items`}
                </h2>
                <DriveEntries
                  entries={visible}
                  allEntries={entries}
                  view={view}
                  details={details}
                  inBin={location === "bin"}
                  onAction={act}
                  onMove={move}
                />
              </section>
              {uploads.length > 0 && (
                <section
                  className="mt-auto rounded-lg border p-3"
                  aria-label="Upload queue"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-medium">
                      {uploads.length} files added
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Dismiss upload queue"
                      onClick={() => setUploads([])}
                    >
                      <X />
                    </Button>
                  </div>
                  {uploads.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-2 py-1 text-xs"
                    >
                      <Check className="size-4 text-primary-text" />
                      <span className="min-w-0 flex-1 truncate">
                        {entry.name}
                      </span>
                      <span className="text-muted-foreground">
                        {formatBytes(entry.size)}
                      </span>
                    </div>
                  ))}
                </section>
              )}
            </div>
            <footer className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2 text-xs text-muted-foreground">
              <span>Demo workspace · Changes reset on reload.</span>
              <span role="status" className="max-w-full break-words">
                {message || "Drop files here to add them to this session."}
              </span>
            </footer>
          </div>
        </div>
      </section>
      <Sheet open={navigationOpen} onOpenChange={setNavigationOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>File Manager</SheetTitle>
          </SheetHeader>
          {navigation}
        </SheetContent>
      </Sheet>
      {dialog && (
        <DriveDialog
          key={`${dialog.type}-${dialog.entry?.id ?? "new"}`}
          dialog={dialog}
          entries={entries}
          onClose={() => setDialog(null)}
          onSave={save}
          onDownload={download}
        />
      )}
    </AppBody>
  );
}
