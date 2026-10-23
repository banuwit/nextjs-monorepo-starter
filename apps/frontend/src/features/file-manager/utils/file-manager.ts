import type {
  FileKind,
  FileManagerFolder,
  FileManagerFile,
  FileFilters,
} from "../types/file-manager";

export const fileKindLabels: Record<FileKind, string> = {
  archive: "Archive",
  design: "Design",
  document: "Document",
  pdf: "PDF",
  spreadsheet: "Spreadsheet",
  other: "File",
};

export function filterFiles(
  files: FileManagerFile[],
  filters: FileFilters,
): FileManagerFile[] {
  const search = filters.search?.trim().toLowerCase() ?? "";
  return files
    .filter(
      (file) =>
        file.name.toLowerCase().includes(search) &&
        (!filters.folderId || file.folderId === filters.folderId) &&
        (filters.show !== "starred" || file.starred) &&
        (filters.show !== "shared" || file.shared) &&
        (!filters.kind || filters.kind === "all" || file.kind === filters.kind),
    )
    .sort((a, b) => {
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      if (filters.sort === "size") return b.sizeBytes - a.sizeBytes;
      return b.modifiedTimestamp - a.modifiedTimestamp;
    });
}

export function toggleFileStar(
  files: FileManagerFile[],
  id: string,
): FileManagerFile[] {
  return files.map((file) =>
    file.id === id ? { ...file, starred: !file.starred } : file,
  );
}

export function getFileKind(name: string): FileKind {
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "pdf") return "pdf";
  if (
    ["fig", "sketch", "png", "jpg", "jpeg", "svg", "webp"].includes(extension)
  )
    return "design";
  if (["xlsx", "xls", "csv"].includes(extension)) return "spreadsheet";
  if (["docx", "doc", "txt", "md"].includes(extension)) return "document";
  if (["zip", "rar", "gz", "7z"].includes(extension)) return "archive";
  return "other";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
  return `${Number((bytes / 1024 ** unit).toFixed(1))} ${["B", "KB", "MB", "GB"][unit]}`;
}

export function updateFolderSummary(
  folder: FileManagerFolder,
  countDelta: number,
  bytesDelta: number,
): FileManagerFolder {
  const sizeBytes = Math.max(0, folder.sizeBytes + bytesDelta);
  return {
    ...folder,
    fileCount: Math.max(0, folder.fileCount + countDelta),
    sizeBytes,
    size: formatFileSize(sizeBytes),
    updatedAt: "Just now",
  };
}
