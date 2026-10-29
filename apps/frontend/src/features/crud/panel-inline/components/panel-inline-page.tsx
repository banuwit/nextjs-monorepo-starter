"use client";

import { CrudResource } from "@/components/crud/crud-resource";
import { useCrudExamples } from "@/mocks/use-crud-examples";
import { panelInlineColumns } from "./panel-inline-columns";
import { PanelInlineForm } from "./panel-inline-form";
import type { PanelInlineExample } from "../types/panel-inline-example";

export function PanelInlinePage() {
  const { data, ready, error, reload, commit } = useCrudExamples();
  return (
    <CrudResource<PanelInlineExample>
      title="Parameter contoh"
      heading="Panel Inline"
      description="Pola Panel Inline. Semua submenu CRUD memakai data contoh yang sama dan tersimpan di browser ini."
      pattern="inline"
      rows={data}
      ready={ready}
      error={error}
      reload={reload}
      columns={panelInlineColumns}
      label={(row) => row.key}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({ type: "save", record, isNew, expectedUpdatedAt })
      }
      onDelete={(record) => commit({ type: "delete", id: record.id })}
      form={(props) => <PanelInlineForm {...props} />}
    />
  );
}
