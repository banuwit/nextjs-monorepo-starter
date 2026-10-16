"use client";
import { CrudResource } from "@/components/crud/crud-resource";
import { CrudForm, type CrudField } from "@/components/crud/crud-form";
import type { CrudColumn } from "@/components/crud/crud-list";
import { crudSchemas, type MockEntity } from "@/mocks/crud-model";
import { useCrudData } from "@/mocks/use-crud-data";

type Entity = MockEntity<"countries">;
export function CountryPage() {
  const { data, ready, error, reload, commit } = useCrudData();

  const fields: CrudField<Entity>[] = [
    { name: "name", label: "Nama", required: true, placeholder: "Indonesia" },
    { name: "code", label: "Kode", required: true, placeholder: "ID" },
  ];
  const columns: CrudColumn<Entity>[] = [
    { key: "name", label: "Nama", value: (row) => row.name, width: 250 },
    { key: "code", label: "Kode", value: (row) => row.code, width: 100 },

    {
      key: "updatedAt",
      label: "Diperbarui",
      value: (row) => row.updatedAt,
      render: (row) => new Date(row.updatedAt).toLocaleDateString("id-ID"),
    },
  ];
  return (
    <CrudResource
      title="Country"
      pattern="dialog"
      rows={data.countries}
      ready={ready}
      error={error}
      reload={reload}
      columns={columns}
      label={(row) => row.name}

      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({
          type: "save",
          resource: "countries",
          record,
          isNew,
          expectedUpdatedAt,
        })
      }
      onDelete={(record) =>
        commit({ type: "delete", resource: "countries", id: record.id })
      }
      form={(props) => (
        <CrudForm
          {...props}
          schema={crudSchemas.countries}
          defaults={{ name: "", code: "" }}
          fields={fields}
        />
      )}
    />
  );
}
