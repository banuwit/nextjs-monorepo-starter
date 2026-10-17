import {
  File,
  FileArchive,
  FileChartColumn,
  FileImage,
  FileText,
} from "lucide-react";
import type { FileKind } from "../file-manager-model";

export const fileIcons = {
  other: File,
  archive: FileArchive,
  design: FileImage,
  document: FileText,
  pdf: File,
  spreadsheet: FileChartColumn,
} satisfies Record<FileKind, typeof File>;
