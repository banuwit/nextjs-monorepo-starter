"use client";
import { CrudResource } from "@/components/crud/crud-resource";
import { CrudForm, type CrudField } from "@/components/crud/crud-form";
import type { CrudColumn } from "@/components/crud/crud-list";
import { crudSchemas, type MockEntity } from "@/mocks/crud-model";
import { useCrudData } from "@/mocks/use-crud-data";

type Entity = MockEntity<"cities">;
export function CityPage() {
  const { data, ready, error, reload, commit } = useCrudData();
  const options = data.provinces.map((row) => ({
    value: row.id,
    label: row.name,
  }));
  const parentName = (row: Entity) =>
    data.provinces.find((parent) => parent.id === row.provinceId)?.name ?? "—";
  const fields: CrudField<Entity>[] = [
    { name: "name", label: "Nama", required: true, placeholder: "Bandung" },
    { name: "code", label: "Kode", required: false, placeholder: "BDG" },
    {
      name: "provinceId",
      label: "Province",
      type: "select",
      required: true,
      options,
    },
  ];
  const columns: CrudColumn<Entity>[] = [
    { key: "name", label: "Nama", value: (row) => row.name, width: 250 },
    { key: "code", label: "Kode", value: (row) => row.code, width: 100 },
    { key: "provinceId", label: "Province", value: parentName },
    {
      key: "updatedAt",
      label: "Diperbarui",
      value: (row) => row.updatedAt,
      render: (row) => new Date(row.updatedAt).toLocaleDateString("id-ID"),
    },
  ];
  return (
    <CrudResource
      title="City"
      pattern="dialog"
      rows={data.cities}
      ready={ready}
      error={error}
      reload={reload}
      columns={columns}
      label={(row) => row.name}
      filters={[{ label: "Province", options, value: (row) => row.provinceId }]}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({
          type: "save",
          resource: "cities",
          record,
          isNew,
          expectedUpdatedAt,
        })
      }
      onDelete={(record) =>
        commit({ type: "delete", resource: "cities", id: record.id })
      }
      form={(props) => (
        <CrudForm
          {...props}
          schema={crudSchemas.cities}
          defaults={{ name: "", code: "", provinceId: "" }}
          fields={fields}
        />
      )}
    />
  );
}
