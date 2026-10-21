import type { MockEntity } from "./crud-model";

type Example = MockEntity<"parameters">;
export type CrudExampleChange =
  | {
      type: "save";
      record: Example;
      isNew: boolean;
      expectedUpdatedAt?: string;
    }
  | { type: "delete"; id: string };

export function applyCrudExampleChange(
  current: Example[],
  change: CrudExampleChange,
): Example[] {
  const record = change.type === "save" ? change.record : null;
  const id = record?.id ?? (change.type === "delete" ? change.id : "");
  const existing = current.find((item) => item.id === id);
  if (change.type === "save" && change.isNew ? !!existing : !existing)
    throw new Error(
      "Data tidak ditemukan atau ID sudah digunakan. Muat ulang daftar.",
    );
  if (
    change.type === "save" &&
    change.expectedUpdatedAt &&
    existing?.updatedAt !== change.expectedUpdatedAt
  )
    throw new Error(
      "Data sudah berubah di tab lain. Buka ulang data terbaru sebelum menyimpan.",
    );
  const next = record
    ? change.type === "save" && change.isNew
      ? [...current, record]
      : current.map((item) => (item.id === id ? record : item))
    : current.filter((item) => item.id !== id);
  if (new Set(next.map((item) => item.key)).size !== next.length)
    throw new Error("Key sudah digunakan. Gunakan nilai lain.");
  return next;
}
