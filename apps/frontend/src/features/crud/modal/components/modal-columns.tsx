import type { CrudColumn } from "@/components/crud/crud-list";
import { Badge } from "@/components/ui/badge";
import type { ModalExample } from "../types/modal-example";

export const modalColumns: CrudColumn<ModalExample>[] = [
  { key: "key", label: "Key", value: (row) => row.key, width: 220 },
  { key: "value", label: "Nilai", value: (row) => row.value, width: 200 },
  {
    key: "type",
    label: "Tipe",
    value: (row) => row.type,
    render: (row) => <Badge variant="outline">{row.type}</Badge>,
    width: 100,
  },
  {
    key: "description",
    label: "Deskripsi",
    value: (row) => row.description,
    width: 250,
  },
  {
    key: "isActive",
    label: "Status",
    value: (row) => (row.isActive ? "Aktif" : "Nonaktif"),
    render: (row) => (
      <Badge variant={row.isActive ? "secondary" : "outline"}>
        {row.isActive ? "Aktif" : "Nonaktif"}
      </Badge>
    ),
    width: 110,
  },
];
