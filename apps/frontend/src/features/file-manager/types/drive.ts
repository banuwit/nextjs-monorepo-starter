export type DriveKind =
  "folder" | "pdf" | "image" | "video" | "archive" | "document" | "code";
export type DriveLocation = "drive" | "shared" | "recent" | "starred" | "bin";

export interface DriveEntry {
  id: string;
  name: string;
  kind: DriveKind;
  parentId: string | null;
  size: number;
  owner: string;
  modified: string;
  starred?: boolean;
  shared?: boolean;
  trashed?: boolean;
  file?: File;
  permission?: "viewer" | "editor";
}

export interface DriveFilter {
  location: DriveLocation;
  folderId?: string | null;
  search?: string;
  kind?: string;
}

export type DriveAction =
  | "open"
  | "rename"
  | "star"
  | "move"
  | "share"
  | "download"
  | "trash"
  | "restore";
