"use client";
import { CrudResource } from "@/components/crud/crud-resource";
import { CrudForm, type CrudField } from "@/components/crud/crud-form";
import type { CrudColumn } from "@/components/crud/crud-list";
import { Badge } from "@/components/ui/badge";
import { crudSchemas, type MockEntity } from "@/mocks/crud-model";
import { useCrudData } from "@/mocks/use-crud-data";

type Menu = MockEntity<"menus">;
export function MenuPage() {
  const { data, ready, error, reload, commit } = useCrudData();
  const fields: CrudField<Menu>[] = [
    {
      name: "title",
      label: "Nama menu",
      required: true,
      placeholder: "Laporan",
    },
    {
      name: "path",
      label: "Path",
      required: true,
      placeholder: "/dashboard/main",
      description: "Gunakan path internal menuju halaman yang tersedia.",
    },
    {
      name: "icon",
      label: "Ikon",
      type: "select",
      required: true,
      options: ["Users", "Globe", "Map", "Building", "Menu", "Settings"].map(
        (value) => ({ value, label: value }),
      ),
    },
    {
      name: "parentId",
      label: "Parent menu",
      type: "select",
      options: data.menus.map((menu) => ({
        value: menu.id,
        label: menu.title,
      })),
    },
    { name: "sortOrder", label: "Urutan", type: "number", required: true },
    {
      name: "role",
      label: "Visibilitas role",
      type: "select",
      required: true,
      options: [
        { value: "all", label: "Semua role" },
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
        { value: "viewer", label: "Viewer" },
      ],
      description:
        "Pratinjau memakai role admin. Ini bukan kontrol akses server.",
    },
    { name: "isActive", label: "Menu aktif", type: "boolean" },
  ];
  const columns: CrudColumn<Menu>[] = [
    { key: "title", label: "Nama menu", value: (row) => row.title, width: 200 },
    { key: "path", label: "Path", value: (row) => row.path, width: 200 },
    {
      key: "parentId",
      label: "Parent",
      value: (row) =>
        data.menus.find((menu) => menu.id === row.parentId)?.title ?? "—",
    },
    {
      key: "sortOrder",
      label: "Urutan",
      value: (row) => row.sortOrder,
      width: 100,
    },
    { key: "role", label: "Role", value: (row) => row.role, width: 110 },
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
      title="Menu"
      pattern="sheet"
      rows={data.menus}
      ready={ready}
      error={error}
      reload={reload}
      columns={columns}
      label={(row) => row.title}
      filters={[
        {
          label: "Status",
          value: (row) => String(row.isActive),
          options: [
            { value: "true", label: "Aktif" },
            { value: "false", label: "Nonaktif" },
          ],
        },
      ]}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({
          type: "save",
          resource: "menus",
          record,
          isNew,
          expectedUpdatedAt,
        })
      }
      onDelete={(record) =>
        commit({ type: "delete", resource: "menus", id: record.id })
      }
      form={(props) => (
        <CrudForm
          {...props}
          schema={crudSchemas.menus}
          fields={fields.map((field) =>
            field.name === "parentId"
              ? {
                  ...field,
                  options: field.options?.filter(
                    (option) => option.value !== props.record?.id,
                  ),
                }
              : field,
          )}
          defaults={{
            title: "",
            path: "",
            icon: "Menu",
            parentId: "",
            sortOrder: data.menus.length,
            isActive: true,
            role: "all",
          }}
        />
      )}
    />
  );
}
