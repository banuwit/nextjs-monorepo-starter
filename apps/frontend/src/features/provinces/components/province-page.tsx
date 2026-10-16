"use client";
import { CrudResource } from "@/components/crud/crud-resource";
import { CrudForm, type CrudField } from "@/components/crud/crud-form";
import type { CrudColumn } from "@/components/crud/crud-list";
import { crudSchemas, type MockEntity } from "@/mocks/crud-model";
import { useCrudData } from "@/mocks/use-crud-data";

type Entity = MockEntity<"provinces">;
export function ProvincePage() {
  const { data, ready, error, reload, commit } = useCrudData();
  const options = data.countries.map((row) => ({
    value: row.id,
    label: row.name,
  }));
  const parentName = (row: Entity) =>
    data.countries.find((parent) => parent.id === row.countryId)?.name ?? "—";
  const fields: CrudField<Entity>[] = [
    { name: "name", label: "Nama", required: true, placeholder: "Jawa Barat" },
    { name: "code", label: "Kode", required: true, placeholder: "JB" },
    {
      name: "countryId",
      label: "Country",
      type: "select",
      required: true,
      options,
    },
  ];
  const columns: CrudColumn<Entity>[] = [
    { key: "name", label: "Nama", value: (row) => row.name, width: 250 },
    { key: "code", label: "Kode", value: (row) => row.code, width: 100 },
    { key: "countryId", label: "Country", value: parentName },
    {
      key: "updatedAt",
      label: "Diperbarui",
      value: (row) => row.updatedAt,
      render: (row) => new Date(row.updatedAt).toLocaleDateString("id-ID"),
    },
  ];
  return (
    <CrudResource
      title="Province"
      pattern="dialog"
      rows={data.provinces}
      ready={ready}
      error={error}
      reload={reload}
      columns={columns}
      label={(row) => row.name}
      filters={[{ label: "Country", options, value: (row) => row.countryId }]}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({
          type: "save",
          resource: "provinces",
          record,
          isNew,
          expectedUpdatedAt,
        })
      }
      onDelete={(record) =>
        commit({ type: "delete", resource: "provinces", id: record.id })
      }
      form={(props) => (
        <CrudForm
          {...props}
          schema={crudSchemas.provinces}
          defaults={{ name: "", code: "", countryId: "" }}
          fields={fields}
        />
      )}
    />
  );
}
