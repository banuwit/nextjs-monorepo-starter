"use client";
import { CrudResource } from "@/components/crud/crud-resource";
import { CrudForm, type CrudField } from "@/components/crud/crud-form";
import type { CrudColumn } from "@/components/crud/crud-list";
import { Badge } from "@/components/ui/badge";
import { crudSchemas, type MockEntity } from "@/mocks/crud-model";
import { useCrudData } from "@/mocks/use-crud-data";

type Parameter = MockEntity<"parameters">;
export function ParameterPage() {
  const { data, ready, error, reload, commit } = useCrudData();
  const types = ["string", "number", "boolean", "json"].map((value) => ({
    value,
    label: value,
  }));
  const fields: CrudField<Parameter>[] = [
    { name: "key", label: "Key", required: true, placeholder: "app.name" },
    {
      name: "type",
      label: "Tipe",
      type: "select",
      required: true,
      options: types,
    },
    {
      name: "value",
      label: "Nilai",
      type: "textarea",
      description:
        "Boolean: true / false. JSON harus valid. Jangan isi password, token, atau secret.",
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "textarea",
      placeholder: "Kegunaan parameter ini…",
    },
    { name: "isActive", label: "Parameter aktif", type: "boolean" },
  ];
  const columns: CrudColumn<Parameter>[] = [
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
  return (
    <CrudResource
      title="Parameter"
      pattern="inline"
      rows={data.parameters}
      ready={ready}
      error={error}
      reload={reload}
      columns={columns}
      label={(row) => row.key}
      filters={[{ label: "Tipe", options: types, value: (row) => row.type }]}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({
          type: "save",
          resource: "parameters",
          record,
          isNew,
          expectedUpdatedAt,
        })
      }
      onDelete={(record) =>
        commit({ type: "delete", resource: "parameters", id: record.id })
      }
      form={(props) => (
        <CrudForm
          {...props}
          schema={crudSchemas.parameters}
          fields={fields}
          defaults={{
            key: "",
            value: "",
            type: "string",
            description: "",
            isActive: true,
          }}
        />
      )}
    />
  );
}
