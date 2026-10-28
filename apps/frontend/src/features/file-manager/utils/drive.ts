import type { DriveEntry, DriveFilter, DriveKind } from "../types/drive";

export const kindLabels: Record<DriveKind, string> = {
  folder: "Folder",
  pdf: "PDF",
  image: "Image",
  video: "Video",
  archive: "ZIP",
  document: "Document",
  code: "JSON",
};

export function ancestors(
  entries: DriveEntry[],
  id: string | null,
): DriveEntry[] {
  const path: DriveEntry[] = [];
  const seen = new Set<string>();
  let entry = entries.find((item) => item.id === id);
  while (entry && !seen.has(entry.id)) {
    path.unshift(entry);
    seen.add(entry.id);
    entry = entries.find((item) => item.id === entry?.parentId);
  }
  return path;
}

export function isInBin(entries: DriveEntry[], entry: DriveEntry) {
  return ancestors(entries, entry.id).some((item) => item.trashed);
}

export function visibleEntries(entries: DriveEntry[], filter: DriveFilter) {
  const search = filter.search?.trim().toLowerCase() ?? "";
  return entries
    .filter((entry) => {
      if (filter.location === "bin") {
        if (
          !entry.trashed ||
          ancestors(entries, entry.parentId).some((item) => item.trashed)
        )
          return false;
      } else if (isInBin(entries, entry)) return false;
      if (
        filter.location === "drive" &&
        entry.parentId !== (filter.folderId ?? null)
      )
        return false;
      if (filter.location === "shared" && !entry.shared) return false;
      if (filter.location === "starred" && !entry.starred) return false;
      if (filter.location === "recent" && entry.kind === "folder") return false;
      return (
        entry.name.toLowerCase().includes(search) &&
        (!filter.kind || filter.kind === "all" || filter.kind === entry.kind)
      );
    })
    .sort((a, b) =>
      filter.location === "recent"
        ? b.modified.localeCompare(a.modified)
        : a.name.localeCompare(b.name),
    );
}

export function assertUniqueName(
  entries: DriveEntry[],
  name: string,
  parentId: string | null,
  exceptId?: string,
) {
  if (
    entries.some(
      (entry) =>
        entry.id !== exceptId &&
        entry.parentId === parentId &&
        !entry.trashed &&
        entry.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    throw new Error("An item with this name already exists in this folder.");
  }
}

export function moveEntry(
  entries: DriveEntry[],
  id: string,
  parentId: string | null,
) {
  const entry = entries.find((item) => item.id === id);
  if (!entry) throw new Error("Item not found.");
  if (
    parentId !== null &&
    !entries.some(
      (item) =>
        item.id === parentId &&
        item.kind === "folder" &&
        !isInBin(entries, item),
    )
  )
    throw new Error("Choose an available destination folder.");
  if (ancestors(entries, parentId).some((item) => item.id === id))
    throw new Error("A folder cannot be moved inside itself.");
  assertUniqueName(entries, entry.name, parentId, id);
  return entries.map((item) => (item.id === id ? { ...item, parentId } : item));
}

export function trashEntry(entries: DriveEntry[], id: string) {
  return entries.map((entry) =>
    entry.id === id ? { ...entry, trashed: true } : entry,
  );
}

export function restoreEntry(entries: DriveEntry[], id: string) {
  const entry = entries.find((item) => item.id === id);
  if (!entry) return entries;
  const parentId = ancestors(entries, entry.parentId).some(
    (item) => item.trashed,
  )
    ? null
    : entry.parentId;
  assertUniqueName(entries, entry.name, parentId, id);
  return entries.map((item) =>
    item.id === id ? { ...item, trashed: false, parentId } : item,
  );
}

export function folderStats(entries: DriveEntry[], id: string) {
  const children = entries.filter(
    (entry) =>
      entry.id !== id &&
      !isInBin(entries, entry) &&
      ancestors(entries, entry.parentId).some((parent) => parent.id === id),
  );
  return {
    count: children.length,
    size: children.reduce((sum, entry) => sum + entry.size, 0),
  };
}

export function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 B";
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4);
  return `${Number((bytes / 1024 ** unit).toFixed(1))} ${["B", "KB", "MB", "GB", "TB"][unit]}`;
}

export function fileKind(file: File): DriveKind {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "pdf";
  if (["zip", "gz", "rar", "7z"].includes(extension ?? "")) return "archive";
  if (["json", "js", "ts", "css", "html"].includes(extension ?? ""))
    return "code";
  return "document";
}

export function displayDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
