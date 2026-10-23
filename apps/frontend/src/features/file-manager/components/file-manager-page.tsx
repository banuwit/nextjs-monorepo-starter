"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  ArrowLeft,
  FolderPlus,
  Grid2X2,
  List,
  Search,
  Upload,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  files as initialFiles,
  folders as initialFolders,
} from "@/mocks/file-manager.mock";
import {
  filterFiles,
  formatFileSize,
  getFileKind,
  toggleFileStar,
  updateFolderSummary,
} from "../utils/file-manager";
import type {
  FileFilters,
  FileManagerFile,
  FileManagerFolder,
  FileManagerView,
} from "../types/file-manager";
import { FileGridView } from "./file-grid-view";
import { FileListView } from "./file-list-view";
import { FileManagerToolbar } from "./file-manager-toolbar";
import { FolderDialog } from "./folder-dialog";
import { FoldersSection } from "./folders-section";

export function FileManagerPage({
  activeView,
}: {
  activeView: FileManagerView;
}) {
  // shortcut: keep this reference demo in memory; connect file storage when persistence is required.
  const [files, setFiles] = useState(initialFiles);
  const [folders, setFolders] = useState(initialFolders);
  const [filters, setFilters] = useState<FileFilters>({});
  const [folderDialog, setFolderDialog] = useState<{
    folder: FileManagerFolder | null;
  } | null>(null);
  const [deleting, setDeleting] = useState<FileManagerFile | null>(null);
  const [message, setMessage] = useState("");
  const uploadInput = useRef<HTMLInputElement>(null);
  const visibleFiles = filterFiles(files, filters);
  const activeFolder = folders.find((folder) => folder.id === filters.folderId);
  const visibleFolders = folders.filter((folder) =>
    folder.name
      .toLowerCase()
      .includes(filters.search?.trim().toLowerCase() ?? ""),
  );
  const onToggleStar = useCallback(
    (id: string) => setFiles((current) => toggleFileStar(current, id)),
    [],
  );

  return (
    <AppBody>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl leading-none tracking-tight">My files</h1>
            <p className="text-sm text-muted-foreground">
              Organize, share, and find workspace files.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setFolderDialog({ folder: null })}
            >
              <FolderPlus data-icon="inline-start" />
              New folder
            </Button>
            <Button onClick={() => uploadInput.current?.click()}>
              <Upload data-icon="inline-start" />
              Upload
            </Button>
            <input
              ref={uploadInput}
              type="file"
              multiple
              className="hidden"
              aria-label="Upload files"
              onChange={(event) => {
                const selected = Array.from(event.target.files ?? []);
                if (!selected.length) return;
                const uploaded: FileManagerFile[] = selected.map((file) => ({
                  id: crypto.randomUUID(),
                  name: file.name,
                  kind: getFileKind(file.name),
                  size: formatFileSize(file.size),
                  sizeBytes: file.size,
                  owner: "You",
                  ownerInitials: "YO",
                  modifiedAt: "Just now",
                  modifiedTimestamp: Date.now(),
                  shared: false,
                  starred: false,
                  folderId: filters.folderId,
                  localFile: file,
                }));
                setFiles((current) => [...uploaded, ...current]);
                setFolders((current) =>
                  current.map((folder) =>
                    folder.id === filters.folderId
                      ? updateFolderSummary(
                          folder,
                          uploaded.length,
                          uploaded.reduce(
                            (sum, file) => sum + file.sizeBytes,
                            0,
                          ),
                        )
                      : folder,
                  ),
                );
                setFilters((current) => ({ folderId: current.folderId }));
                setMessage(
                  `${selected.length} file${selected.length === 1 ? "" : "s"} added for this session. Nothing was uploaded to a server.`,
                );
                event.target.value = "";
              }}
            />
          </div>
        </div>
        <FileManagerToolbar filters={filters} onChange={setFilters} />
        {activeFolder ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFilters((current) => ({ ...current, folderId: undefined }))
              }
            >
              <ArrowLeft data-icon="inline-start" />
              All folders
            </Button>
            <span className="truncate text-sm font-medium">
              {activeFolder.name}
            </span>
          </div>
        ) : (
          <FoldersSection
            folders={visibleFolders}
            onOpen={(folder) => setFilters({ folderId: folder.id })}
            onRename={(folder) => setFolderDialog({ folder })}
          />
        )}
        <section
          className="flex flex-col gap-2"
          aria-labelledby="files-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="files-heading" className="text-lg font-medium">
              {activeFolder ? "Folder files" : "All files"}
            </h2>
            <ToggleGroup
              variant="outline"
              size="sm"
              spacing={0}
              value={[activeView]}
              aria-label="File view"
            >
              <ToggleGroupItem
                value="grid"
                nativeButton={false}
                render={
                  <Link
                    href="?view=grid"
                    prefetch={false}
                    replace
                    scroll={false}
                  />
                }
              >
                <Grid2X2 />
                Grid View
              </ToggleGroupItem>
              <ToggleGroupItem
                value="list"
                nativeButton={false}
                render={
                  <Link
                    href="?view=list"
                    prefetch={false}
                    replace
                    scroll={false}
                  />
                }
              >
                <List />
                List View
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {visibleFiles.length ? (
            activeView === "list" ? (
              <FileListView
                files={visibleFiles}
                onToggleStar={onToggleStar}
                onDelete={setDeleting}
              />
            ) : (
              <FileGridView
                files={visibleFiles}
                onToggleStar={onToggleStar}
                onDelete={setDeleting}
              />
            )
          ) : (
            <Empty className="min-h-48 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search />
                </EmptyMedia>
                <EmptyTitle>No files found</EmptyTitle>
                <EmptyDescription>
                  Try another search or filter, or upload a file.
                </EmptyDescription>
              </EmptyHeader>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters((current) => ({ folderId: current.folderId }))
                }
              >
                Clear filters
              </Button>
            </Empty>
          )}
        </section>
        <p className="text-xs text-muted-foreground">
          Demo workspace · Changes last until you reload. Downloads are
          available for files you add; sharing requires connected storage.
        </p>
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      </div>
      {folderDialog && (
        <FolderDialog
          folder={folderDialog.folder}
          folders={folders}
          onClose={() => setFolderDialog(null)}
          onSave={(name) => {
            const existing = folderDialog.folder;
            setFolders((current) =>
              existing
                ? current.map((folder) =>
                    folder.id === existing.id ? { ...folder, name } : folder,
                  )
                : [
                    ...current,
                    {
                      id: crypto.randomUUID(),
                      name,
                      fileCount: 0,
                      size: "0 B",
                      sizeBytes: 0,
                      updatedAt: "Just now",
                    },
                  ],
            );
            setMessage(existing ? "Folder renamed." : "Folder created.");
            setFolderDialog(null);
          }}
        />
      )}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move file to trash?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove {deleting?.name} from this demo session. Reloading restores
              the example files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleting) return;
                setFiles((current) =>
                  current.filter((file) => file.id !== deleting.id),
                );
                setFolders((current) =>
                  current.map((folder) =>
                    folder.id === deleting.folderId
                      ? updateFolderSummary(folder, -1, -deleting.sizeBytes)
                      : folder,
                  ),
                );
                setMessage(`${deleting.name} removed from this session.`);
                setDeleting(null);
              }}
            >
              Move to trash
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppBody>
  );
}
