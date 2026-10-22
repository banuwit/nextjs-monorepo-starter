"use client";

import { CrudResource } from "@/components/crud/crud-resource";
import type { CrudColumn } from "@/components/crud/crud-list";
import { Badge } from "@/components/ui/badge";
import { useCrudExamples } from "@/mocks/use-crud-examples";
import { ExampleForm, type Example } from "./example-form";

export const exampleColumns: CrudColumn<Example>[] = [
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

const patterns = {
  "new-page": { label: "New Page", pattern: "page" },
  modal: { label: "Modal", pattern: "dialog" },
  sheet: { label: "Sheet", pattern: "sheet" },
  "panel-inline": { label: "Panel Inline", pattern: "inline" },
} as const;

export function ExamplePage({ variant }: { variant: keyof typeof patterns }) {
  const { data, ready, error, reload, commit } = useCrudExamples();
  const { label, pattern } = patterns[variant];
  return (
    <CrudResource
      title="Parameter contoh"
      heading={label}
      parent={{ label: "CRUD", href: "/crud" }}
      description={`Pola ${label}. Semua submenu CRUD memakai data contoh yang sama dan tersimpan di browser ini.`}
      pattern={pattern}
      basePath={pattern === "page" ? "/crud/new-page" : undefined}
      rows={data}
      ready={ready}
      error={error}
      reload={reload}
      columns={exampleColumns}
      label={(row) => row.key}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({ type: "save", record, isNew, expectedUpdatedAt })
      }
      onDelete={(record) => commit({ type: "delete", id: record.id })}
      form={(props) => <ExampleForm {...props} />}
    />
  );
}
