export type FileKind =
  "document" | "spreadsheet" | "design" | "pdf" | "archive" | "other";

export type FileManagerView = "grid" | "list";

export interface FileManagerFolder {
  id: string;
  name: string;
  fileCount: number;
  size: string;
  sizeBytes: number;
  updatedAt: string;
}

export interface FileManagerFile {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  sizeBytes: number;
  owner: string;
  ownerInitials: string;
  modifiedAt: string;
  modifiedTimestamp: number;
  shared: boolean;
  starred: boolean;
  folderId?: string;
  localFile?: File;
}

export interface FileFilters {
  search?: string;
  show?: "all" | "starred" | "shared";
  kind?: "all" | FileKind;
  sort?: "modified" | "name" | "size";
  folderId?: string;
}
