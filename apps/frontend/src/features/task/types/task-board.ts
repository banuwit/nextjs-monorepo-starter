import type { ColumnId, Task } from "./task";

export type BoardTask = Task & {
  columnId: ColumnId;
  columnTitle: string;
};
