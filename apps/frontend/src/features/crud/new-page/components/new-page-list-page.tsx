"use client";

import { CrudResource } from "@/components/crud/crud-resource";
import { useCrudExamples } from "@/mocks/use-crud-examples";
import { newPageColumns } from "./new-page-columns";
import { NewPageForm } from "./new-page-form";
import type { NewPageExample } from "../types/new-page-example";

export function NewPageListPage() {
  const { data, ready, error, reload, commit } = useCrudExamples();
  return (
    <CrudResource<NewPageExample>
      title="Parameter contoh"
      heading="New Page"
      description="Pola New Page. Semua submenu CRUD memakai data contoh yang sama dan tersimpan di browser ini."
      pattern="page"
      basePath="/crud/new-page"
      rows={data}
      ready={ready}
      error={error}
      reload={reload}
      columns={newPageColumns}
      label={(row) => row.key}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({ type: "save", record, isNew, expectedUpdatedAt })
      }
      onDelete={(record) => commit({ type: "delete", id: record.id })}
      form={(props) => <NewPageForm {...props} />}
    />
  );
}
