"use client";

import { CrudResource } from "@/components/crud/crud-resource";
import { useCrudExamples } from "@/mocks/use-crud-examples";
import { modalColumns } from "./modal-columns";
import { ModalForm } from "./modal-form";
import type { ModalExample } from "../types/modal-example";

export function ModalPage() {
  const { data, ready, error, reload, commit } = useCrudExamples();
  return (
    <CrudResource<ModalExample>
      title="Parameter contoh"
      heading="Modal"
      description="Pola Modal. Semua submenu CRUD memakai data contoh yang sama dan tersimpan di browser ini."
      pattern="dialog"
      rows={data}
      ready={ready}
      error={error}
      reload={reload}
      columns={modalColumns}
      label={(row) => row.key}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({ type: "save", record, isNew, expectedUpdatedAt })
      }
      onDelete={(record) => commit({ type: "delete", id: record.id })}
      form={(props) => <ModalForm {...props} />}
    />
  );
}
